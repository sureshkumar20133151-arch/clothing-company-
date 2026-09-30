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
import searchRoutes from "./modules/search/search.routes";
import { ReviewController } from "./modules/reviews/review.controller";
import { prisma } from "./config/prisma";
import { isRedisReady, redisClient } from "./config/redis";
import { ApiResponse } from "./utils/apiResponse";
import { generalApiLimiter, authLimiter } from "./middlewares/rateLimit.middleware";
import { requireAuth, requireRole } from "./middlewares/auth.middleware";
import { ROLES } from "@indigo/shared";

const router = Router();

// Apply general Redis-backed distributed rate limiter
router.use(generalApiLimiter);

// Health check endpoint with PostgreSQL and Redis pings
router.get("/health", async (_req: Request, res: Response) => {
  let dbStatus = "disconnected";
  let redisStatus = isRedisReady() ? "connected" : "disconnected";

  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = "connected";
  } catch {
    dbStatus = "disconnected";
  }

  if (isRedisReady()) {
    try {
      const pong = await redisClient.ping();
      if (pong === "PONG") redisStatus = "connected";
    } catch {
      redisStatus = "disconnected";
    }
  }

  const isHealthy = dbStatus === "connected";
  const statusCode = isHealthy ? 200 : 503;

  return res.status(statusCode).json({
    success: isHealthy,
    brand: "Indigo & Thread",
    market: "India",
    currency: "INR (₹)",
    status: isHealthy ? "healthy" : "degraded",
    database: dbStatus,
    redis: redisStatus,
    timestamp: new Date().toISOString(),
  });
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

// Mount modules with dedicated rate limiting where required
router.use("/auth", authLimiter, authRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/payments", paymentRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/upload", uploadRoutes);
router.use("/reviews", reviewRoutes);
router.use("/coupons", couponRoutes);
router.use("/search", searchRoutes);

// Admin review moderation dedicated routes
router.get(
  "/admin/reviews",
  requireAuth,
  requireRole([ROLES.ADMIN, ROLES.MANAGER]),
  ReviewController.adminList
);
router.patch(
  "/admin/reviews/:id",
  requireAuth,
  requireRole([ROLES.ADMIN, ROLES.MANAGER]),
  ReviewController.adminUpdateStatus
);
router.delete(
  "/admin/reviews/:id",
  requireAuth,
  requireRole([ROLES.ADMIN]),
  ReviewController.adminDelete
);
router.post(
  "/admin/reviews/:id/reply",
  requireAuth,
  requireRole([ROLES.ADMIN, ROLES.MANAGER]),
  ReviewController.adminReply
);

export default router;
