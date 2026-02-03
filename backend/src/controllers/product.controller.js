import mongoose from "mongoose";
import Product from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";


export const createProduct = async (req, res, next) => {
  try {
    // Debug logging
    console.log("=== CREATE PRODUCT DEBUG ===");
    console.log("req.body:", JSON.stringify(req.body, null, 2));
    console.log("req.files:", req.files);
    console.log("============================");

    const {
      name,
      description,
      price,
      anime,
      category,
      isLimitedEdition,
    } = req.body;

    // Parse variants from FormData format (variants[0][size], variants[0][stock], etc.)
    let variants = req.body.variants;
    if (!Array.isArray(variants)) {
      // Parse variants from object format sent by FormData
      variants = [];
      let i = 0;
      while (req.body[`variants[${i}][size]`]) {
        variants.push({
          size: req.body[`variants[${i}][size]`],
          stock: parseInt(req.body[`variants[${i}][stock]`]) || 0,
        });
        i++;
      }
    }

    // Validation
    console.log("Parsed variants:", variants);
    console.log("Validation check - name:", name, "price:", price, "anime:", anime, "variants length:", variants?.length);
    if (!name || !price || !anime || !variants?.length) {
      throw new ApiError(400, "Required product fields missing");
    }

    // Map images to just URL strings (not objects) as expected by schema
    const images = req.files?.map((file) => file.path) || [];
    console.log("Images array:", images);

    const productData = {
      name,
      description,
      price: parseFloat(price),
      anime,
      category,
      variants,
      images,
      isLimitedEdition: isLimitedEdition === 'true' || isLimitedEdition === true,
      createdBy: req.user.id,
    };
    console.log("Creating product with data:", JSON.stringify(productData, null, 2));

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Product creation error:", error);
    next(error);
  }
};


export const getAllProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      anime,
      category,
      size,
      sort,
    } = req.query;

    const query = {};

    // Filters
    if (anime) query.anime = anime;
    if (category) query.category = category;
    if (size) query["variants.size"] = size;

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === "price") sortOption = { price: 1 };
    if (sort === "-price") sortOption = { price: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};


export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid product ID");
    }

    const product = await Product.findById(id);

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};
