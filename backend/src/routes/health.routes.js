import { Router } from "express";
import { healthCheck } from "../controllers/health.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

// public
router.get("/", healthCheck);

// protected
router.get("/private", authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Protected route accessed",
    user: req.user,
  });
});

export default router;
