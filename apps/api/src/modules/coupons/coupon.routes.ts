import { Router } from "express";
import { CouponController } from "./coupon.controller";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware";
import { ROLES } from "@indigo/shared";

const router = Router();

router.use(requireAuth);
router.use(requireRole([ROLES.ADMIN, ROLES.MANAGER]));

router.get("/", CouponController.list);
router.post("/", CouponController.create);
router.delete("/:id", CouponController.delete);

export default router;
