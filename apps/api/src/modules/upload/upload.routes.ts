import { Router } from "express";
import { UploadController } from "./upload.controller";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware";
import { ROLES } from "@indigo/shared";

const router = Router();

router.use(requireAuth);
router.post(
  "/image",
  requireRole([ROLES.ADMIN, ROLES.MANAGER]),
  UploadController.uploadImage
);

export default router;
