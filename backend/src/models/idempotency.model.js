import mongoose from "mongoose";

const idempotencySchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
    },
    response: {
        type: Object,
        required: true,
    },
    statusCode: {
        type: Number,
        required: true,
    }
},{
    timestamps: true
})
idempotencySchema.index({ key: 1 }, { unique: true });
idempotencySchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 86400 }
);


export const Idempotency = mongoose.model("Idempotency", idempotencySchema);