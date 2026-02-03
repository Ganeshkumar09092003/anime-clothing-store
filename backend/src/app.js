import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import cartRoutes from './routes/cart.routes.js';
import productRoutes from './routes/product.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';
import orderRoutes from './routes/order.routes.js';
import paymentRoutes from './routes/payment.routes.js'
import webhookRoutes from './routes/webhook.routes.js';

const app = express();

// Global Middlewares
app.use(cors({
    origin: env.FRONTEND_URL,
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/webhooks', webhookRoutes);

//Error Handlers
app.use(errorHandler);

export default app;