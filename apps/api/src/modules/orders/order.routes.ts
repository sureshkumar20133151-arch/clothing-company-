import { Router } from "express";
import { OrderController } from "./order.controller";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import {
  createOrderSchema,
  updateOrderStatusSchema,
  orderFilterQuerySchema,
  ROLES,
} from "@indigo/shared";

const router = Router();

router.use(requireAuth);

router.post("/", validate(createOrderSchema), OrderController.create);
router.get("/", validate(orderFilterQuerySchema, "query"), OrderController.list);
router.get("/:id", OrderController.getById);

router.patch(
  "/:id/status",
  requireRole([ROLES.ADMIN, ROLES.MANAGER, ROLES.SUPPORT]),
  validate(updateOrderStatusSchema),
  OrderController.updateStatus
);

export default router;
