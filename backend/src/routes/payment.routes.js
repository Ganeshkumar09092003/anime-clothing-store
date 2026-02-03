import express from 'express';
import { createPaymentIntent } from '../controllers/payment.controller.js';
import {authenticate} from '../middlewares/auth.middleware.js'
import { idempotencyMiddleware } from '../middlewares/idempotency.middleware.js';

const router = express.Router();

router.post('/intent', authenticate, idempotencyMiddleware, createPaymentIntent);

export default router;