import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  size: {
    type: String,
    enum: ["S", "M", "L", "XL"],
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    anime: {
      type: String, // Naruto, One Piece
      required: true,
    },

    category: {
      type: String, // Hoodie, T-Shirt
      required: true,
    },

    variants: [variantSchema],

    images: [
      {
        type: String, // Cloudinary / S3 URLs
      },
    ],

    isLimitedEdition: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

productSchema.index({ anime: 1 });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ "variants.size": 1 });

export default mongoose.model("Product", productSchema);
