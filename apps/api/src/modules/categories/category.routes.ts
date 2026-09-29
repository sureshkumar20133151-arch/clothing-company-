import { Router } from "express";
import { CategoryController } from "./category.controller";
import { validate } from "../../middlewares/validate.middleware";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware";
import { categorySchema, ROLES } from "@indigo/shared";

const router = Router();

router.get("/", CategoryController.list);
router.get("/:slug", CategoryController.getBySlug);
router.post(
  "/",
  requireAuth,
  requireRole([ROLES.ADMIN, ROLES.MANAGER]),
  validate(categorySchema),
  CategoryController.create
);

export default router;
