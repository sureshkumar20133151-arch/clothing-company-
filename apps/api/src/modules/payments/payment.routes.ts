import { Router } from "express";
import { PaymentController } from "./payment.controller";
import { requireAuth } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { createRazorpayOrderSchema, verifyRazorpayPaymentSchema } from "@indigo/shared";

const router = Router();

router.use(requireAuth);

router.post("/razorpay/create-order", validate(createRazorpayOrderSchema), PaymentController.createRazorpayOrder);
router.post("/razorpay/verify", validate(verifyRazorpayPaymentSchema), PaymentController.verifyRazorpayPayment);

export default router;
