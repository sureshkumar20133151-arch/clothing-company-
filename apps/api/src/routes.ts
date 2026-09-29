import { Router, Request, Response } from "express";
import authRoutes from "./modules/auth/auth.routes";
import categoryRoutes from "./modules/categories/category.routes";
import productRoutes from "./modules/products/product.routes";
import cartRoutes from "./modules/cart/cart.routes";
import orderRoutes from "./modules/orders/order.routes";
import paymentRoutes from "./modules/payments/payment.routes";
import inventoryRoutes from "./modules/inventory/inventory.routes";
import uploadRoutes from "./modules/upload/upload.routes";
import reviewRoutes from "./modules/reviews/review.routes";
import couponRoutes from "./modules/coupons/coupon.routes";
import { prisma } from "./config/prisma";
import { ApiResponse } from "./utils/apiResponse";

const router = Router();

// Health check endpoint with database ping
router.get("/health", async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return ApiResponse.success(res, {
      brand: "Indigo & Thread",
      market: "India",
      currency: "INR (₹)",
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return res.status(503).json({
      success: false,
      brand: "Indigo & Thread",
      status: "degraded",
      database: "disconnected",
      message: error?.message || "Database connection unavailable",
      timestamp: new Date().toISOString(),
    });
  }
});

// Brand Meta endpoint
router.get("/brand-story", (_req: Request, res: Response) => {
  return ApiResponse.success(res, {
    brand: "Indigo & Thread",
    market: "India",
    currency: "INR",
    currencySymbol: "₹",
    gstCompliance: "Active (5% for <= ₹1000, 12% for > ₹1000 apparel slabs)",
    story:
      "Rooted in artisanal heritage, Indigo & Thread crafts authentic handloom cotton and linen apparel sourced directly from master weavers across Tamil Nadu, Bengal, and Andhra Pradesh. Every silhouette is reimagined for everyday ease, balancing traditional weaves with clean, contemporary tailoring. Sustainable, breathable, and designed for effortless Indian living.",
  });
});

// Mount modules
router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/payments", paymentRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/upload", uploadRoutes);
router.use("/reviews", reviewRoutes);
router.use("/coupons", couponRoutes);

export default router;
