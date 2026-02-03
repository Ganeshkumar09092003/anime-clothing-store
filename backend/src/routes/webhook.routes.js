import express from 'express';
import { paymentWebhook } from '../controllers/webhook.controller.js';

const router = express.Router();

router.post('/payment',paymentWebhook);

export default router;