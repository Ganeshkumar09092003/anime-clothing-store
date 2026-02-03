import mongoose from "mongoose";

const cartItemSchema = new  mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    size: {
        type: String,
        enum: ["S","M","L","XL"],
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    price: {
        type: Number, 
        required: true,
    },
});

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        unique: true,
    },
    items: [cartItemSchema],
}, {
    timestamps: true,
})

cartSchema.index({ user: 1 });

export default mongoose.model("Cart", cartSchema);