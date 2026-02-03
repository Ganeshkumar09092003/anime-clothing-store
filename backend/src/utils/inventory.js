import Product from '../models/product.model.js';
import { ApiError } from './ApiError.js';

export const lockInventory = async (cartItems, session) => {
    for (const item of cartItems) {
        const result = await Product.updateOne(
            {
        _id: item.product,
        "variants.size": item.size,
        "variants.stock": { $gte: item.quantity },
      },
      {
        $inc: { "variants.$.stock": -item.quantity },
      },
      { session }
    )
    if (result.modifiedCount === 0) {
      throw new ApiError(
        400,
        `Insufficient stock for product ${item.product}`
      );
    }
  }
}

export const restoreInventory = async (orderItems, session) => {
    for(const item of orderItems){
      const result = await Product.updateOne(
        {
          _id: item.product,
          "variants.size": item.size
        },
        {
          $inc: {
            "variants.$.stock" : item.quantity
          }
        },
        {session}
      );

      if(result.matchedCount === 0){
        throw new ApiError(500, "Failed to restore inventory");
      }
    }
}