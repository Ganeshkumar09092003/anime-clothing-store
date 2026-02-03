import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { createProduct, getAllProducts, getProductById } from "../controllers/product.controller.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post(
  "/",
  authenticate,
  authorizeRoles("admin"),
  upload.array("images", 5),
  createProduct
);

export default router;

