import mongoose from 'mongoose';
import Cart from '../models/cart.model.js'
import {Order} from '../models/order.model.js'
import {lockInventory as deductInventory, restoreInventory} from '../utils/inventory.js'
import { ApiError } from '../utils/ApiError.js';

export const createOrder = async(req, res, next) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const cart = await Cart.findOne({user: req.user.id}).session(session);

        if (!cart || cart.items.length === 0) {
            throw new ApiError(400, "Cart is empty");
        }
        await deductInventory(cart.items, session);

         const orderItems = cart.items.map(item => ({
            product: item.product,
            anime: item.anime,
            category: item.category,
            size: item.size,
            quantity: item.quantity,
            price: item.price,
            image: item.image
        }));

        const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const order = await Order.create([
            {
                user: req.user.id,
                items: orderItems,
                totalAmount,
                status: "pending"
            }
        ],
        {session}
        );

        cart.items = [];

        await cart.save({session});

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            data: order[0]
        })


    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

export const cancelOrder = async (req, res, next) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const {orderId} = req.params;

        console.log(`Cancel order request - User: ${req.user.id}, Order: ${orderId}`);

        const order = await Order.findById(orderId).session(session);

        if (!order) {
            throw new ApiError(404, "Order not found");
        }

        if (order.user.toString() !== req.user.id) {
            throw new ApiError(403, "Not authorized to cancel this order");
        }

        if (order.status !== "pending") {
            throw new ApiError(400, "Order cannot be cancelled");
        }
        
        await restoreInventory(order.items, session);

        order.status = "cancelled";
        await order.save({session});

        await session.commitTransaction();
        session.endSession();

         console.log(`Order cancelled successfully - Order: ${orderId}`);

        res.status(200).json({
            success: true,
            message: "Order cancelled successfully"
        })

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

export const getMyOrders = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments({ user: req.user.id });

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const { status, userId } = req.query;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (userId) {
      filter.user = userId;
    }

    const orders = await Order.find(filter)
      .populate("user", "email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total
      }
    });
  } catch (error) {
    next(error);
  }
};

export const refundOrder = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    if (order.status !== "paid") {
      throw new ApiError(400, "Order is not refundable");
    }

    /**
     * 💳 Payment provider refund call (Stripe/Razorpay)
     * This must be done BEFORE DB transaction
     */
    const refundSuccessful = true; // placeholder

    if (!refundSuccessful) {
      throw new ApiError(502, "Refund failed at payment provider");
    }

    // Now inventory + order update must be atomic
    session.startTransaction();

    await restoreInventory(order.items, session);

    order.status = "cancelled";
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Refund processed successfully"
    });

  } catch (error) {
    if(session.inTransaction()){
        await session.abortTransaction();
    }
    session.endSession();
    next(error);
  }
};
