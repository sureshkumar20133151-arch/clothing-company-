import { Router } from "express";
import { ReviewController } from "./review.controller";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware";
import { ROLES } from "@indigo/shared";

const router = Router();

// Public review retrieval
router.get("/product/:productId", ReviewController.listByProduct);

// Authenticated user actions
router.post("/", requireAuth, ReviewController.create);
router.post("/:id/helpful", requireAuth, ReviewController.voteHelpful);

// Admin moderation actions
router.get(
  "/admin",
  requireAuth,
  requireRole([ROLES.ADMIN, ROLES.MANAGER]),
  ReviewController.adminList
);

router.patch(
  "/admin/:id",
  requireAuth,
  requireRole([ROLES.ADMIN, ROLES.MANAGER]),
  ReviewController.adminUpdateStatus
);

router.delete(
  "/admin/:id",
  requireAuth,
  requireRole([ROLES.ADMIN]),
  ReviewController.adminDelete
);

router.post(
  "/admin/:id/reply",
  requireAuth,
  requireRole([ROLES.ADMIN, ROLES.MANAGER]),
  ReviewController.adminReply
);

export default router;
