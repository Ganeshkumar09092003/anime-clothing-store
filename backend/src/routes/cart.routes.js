import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { addToCart, getCart, removeCartItem, updateCartItem } from "../controllers/cart.controller.js";

const router = express.Router();

router.post("/", authenticate, addToCart);
router.get("/", authenticate, getCart);
router.patch("/", authenticate, updateCartItem);
router.delete("/", authenticate, removeCartItem);

export default router;