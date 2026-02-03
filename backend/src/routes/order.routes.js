import express from 'express';
import { cancelOrder, createOrder, getAllOrders, getMyOrders, refundOrder } from '../controllers/order.controller.js';
import {authenticate} from '../middlewares/auth.middleware.js';
import {authorizeRoles} from '../middlewares/role.middleware.js'
import { idempotencyMiddleware } from '../middlewares/idempotency.middleware.js';

const router = express.Router();

router.post('/', authenticate, idempotencyMiddleware, createOrder);
router.post('/:orderId/cancel',authenticate, idempotencyMiddleware, cancelOrder)
router.get('/my-orders', authenticate, getMyOrders);
router.get('/all', authenticate, authorizeRoles("admin"), getAllOrders)
router.post('/:orderId/refund', authenticate, authorizeRoles("admin"),idempotencyMiddleware, refundOrder);

export default router;