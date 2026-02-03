import Cart from "../models/cart.model.js"
import Product from '../models/product.model.js'
import { ApiError } from "../utils/ApiError.js"

export const addToCart = async (req, res, next) => {
    try {
        const { productId, size, quantity } = req.body;

        if (!productId || !size || !quantity) {
            throw new ApiError(400, "Missing cart fields");
        }

        const product = await Product.findById(productId);

        if (!product) {
            throw new ApiError(404, "Product not Found");
        }

        const variant = product.variants.find(v => v.size === size);

        if (!variant || variant.stock < quantity) {
            throw new ApiError(400, "Insufficient Stock");
        }

        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            cart = await Cart.create({
                user: req.user.id,
                items: [],
            });
        }
        const existingItem = cart.items.find(item => item.product.toString() === productId && item.size === size);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                product: productId,
                size,
                quantity,
                price: product.price,
            });
        }
        await cart.save();

        res.status(200).json({
            success: true,
            data: cart,
        });
    } catch (error) {
        next(error);
    }
}

export const getCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");

        if (!cart) {
            return res.status(200).json({
                success: true,
                data: { items: [] },
            });
        }

        res.status(200).json({
            success: true,
            data: cart
        });
    } catch (error) {
        next(error);
    }
}

export const updateCartItem = async (req, res, next) => {
    try {
        const { productId, size, quantity } = req.body;

        if (!productId || !size || quantity < 1) {
            throw new ApiError(400, "Invalid cart update data");
        }

        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            throw new ApiError(404, "Cart not Found");
        }

        const item = cart.items.find(item =>
            item.product.toString() === productId && item.size === size
        )

        if (!item) {
            throw new ApiError(404, "Item not found");
        }
        const product = await Product.findById(productId);
        const variant = product?.variants.find(v => v.size === size);

        if (!variant || variant.stock < quantity) {
            throw new ApiError(400, "Insufficient stock");
        }

        item.quantity = quantity;
        await cart.save();

        res.status(200).json({
            success: true,
            data: cart,
        })
    }
    catch (err) {
        next(err);
    }
}

export const removeCartItem = async (req, res, next) => {
    try {
        const { productId, size } = req.body;

        if (!productId || !size) {
            throw new ApiError(400, "Invalid remove request");
        }

        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            throw new ApiError(404, "Cart not found");
        }

        const initialLength = cart.items.length;

        cart.items = cart.items.filter(
            (item) =>
                !(
                    item.product.toString() === productId &&
                    item.size === size
                )
        );

        if (cart.items.length === initialLength) {
            throw new ApiError(404, "Cart item not found");
        }

        await cart.save();

        res.status(200).json({
            success: true,
            data: cart,
        });
    } catch (error) {
        next(error);
    }
};
