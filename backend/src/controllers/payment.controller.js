import {Order} from '../models/order.model.js';
import {ApiError} from '../utils/ApiError.js';

export const createPaymentIntent = async (req, res, next) => {
    try {
        const {orderId} = req.body;

        const order = await Order.findById(orderId);

        if(!order){
            throw new ApiError(404, "Order not found");
        }

        if(order.status !== "pending"){
            throw new ApiError(400, "Order is not Pending");
        }

        const paymentIntentId = `pi_${Date.now()}`; // placeholder

        order.paymentIntentId = paymentIntentId;
        await order.save();

        res.status(200).json({
            success: true,
            paymentIntentId,
            amount: order.totalAmount
        });
    } catch (error) {
        next(error);
    }
}