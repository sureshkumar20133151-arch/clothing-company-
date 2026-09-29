import { Router } from "express";
import { ProductController } from "./product.controller";
import { validate } from "../../middlewares/validate.middleware";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware";
import {
  productCreateSchema,
  productUpdateSchema,
  productFilterQuerySchema,
  ROLES,
} from "@indigo/shared";

const router = Router();

router.get("/", validate(productFilterQuerySchema, "query"), ProductController.list);
router.get("/slug/:slug", ProductController.getBySlug);
router.get("/:id", ProductController.getById);

router.post(
  "/",
  requireAuth,
  requireRole([ROLES.ADMIN, ROLES.MANAGER]),
  validate(productCreateSchema),
  ProductController.create
);

router.patch(
  "/:id",
  requireAuth,
  requireRole([ROLES.ADMIN, ROLES.MANAGER]),
  validate(productUpdateSchema),
  ProductController.update
);

router.delete(
  "/:id",
  requireAuth,
  requireRole([ROLES.ADMIN]),
  ProductController.delete
);

export default router;
