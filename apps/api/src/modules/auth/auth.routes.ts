import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validate } from "../../middlewares/validate.middleware";
import { requireAuth } from "../../middlewares/auth.middleware";
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
} from "@indigo/shared";

const router = Router();

router.post("/register", validate(registerSchema), AuthController.register);
router.post("/login", validate(loginSchema), AuthController.login);
router.post("/refresh", AuthController.refreshToken);
router.post("/logout", AuthController.logout);

router.get("/me", requireAuth, AuthController.getMe);
router.patch("/profile", requireAuth, validate(updateProfileSchema), AuthController.updateProfile);
router.post("/change-password", requireAuth, validate(changePasswordSchema), AuthController.changePassword);

export default router;
