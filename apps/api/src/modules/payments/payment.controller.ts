import { Request, Response, NextFunction } from "express";
import { PaymentService } from "./payment.service";
import { ApiResponse } from "../../utils/apiResponse";

export class PaymentController {
  static async createRazorpayOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const orderData = await PaymentService.createRazorpayOrder(req.body.orderId, req.user!.id);
      return ApiResponse.success(res, orderData, "Razorpay order initialized");
    } catch (error) {
      next(error);
    }
  }

  static async verifyRazorpayPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await PaymentService.verifyRazorpayPayment(req.body, req.user!.id);
      return ApiResponse.success(res, order, "Payment verified and order confirmed successfully");
    } catch (error) {
      next(error);
    }
  }
}
