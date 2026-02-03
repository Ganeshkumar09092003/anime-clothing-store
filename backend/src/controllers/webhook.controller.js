import { Order } from "../models/order.model.js";

export const paymentWebhook = async (req, res) => {
    try {
        const event = req.body;
        if(event.type === "payment.success"){
            const paymentIntentId = event.data.paymentIntentId;
            const order = await Order.findOne({ paymentIntentId })
            if(order && order.status === "pending"){
                order.status = "paid";
                await order.save();
            }
        }

        if(event.type === "payment.failed"){
            const paymentIntentId = event.data.paymentIntentId;
            const order = await Order.findOne({ paymentIntentId });

            if (order) {
                order.status = "failed";
                await order.save();
            }
        }
        res.status(200).json({received: true});
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(200).json({received: true, error: 'Processing failed'});
    }
}