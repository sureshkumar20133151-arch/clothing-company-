import { z } from "zod";

export const createRazorpayOrderSchema = z.object({
  orderId: z.string().cuid(),
});

export const verifyRazorpayPaymentSchema = z.object({
  orderId: z.string().cuid(),
  razorpayOrderId: z.string().min(1, "Razorpay Order ID is required"),
  razorpayPaymentId: z.string().min(1, "Razorpay Payment ID is required"),
  razorpaySignature: z.string().min(1, "Razorpay Signature is required"),
});

export type CreateRazorpayOrderInput = z.infer<typeof createRazorpayOrderSchema>;
export type VerifyRazorpayPaymentInput = z.infer<typeof verifyRazorpayPaymentSchema>;
