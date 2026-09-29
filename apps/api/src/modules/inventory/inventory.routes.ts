import { Router } from "express";
import { InventoryController } from "./inventory.controller";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware";
import { ROLES } from "@indigo/shared";

const router = Router();

router.use(requireAuth);
router.use(requireRole([ROLES.ADMIN, ROLES.MANAGER]));

router.get("/", InventoryController.list);
router.patch("/:variantId/stock", InventoryController.updateStock);
router.patch("/:variantId/adjust", InventoryController.adjustStock);

export default router;
