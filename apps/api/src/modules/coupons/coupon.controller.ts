import { Request, Response, NextFunction } from "express";
import { CouponService } from "./coupon.service";
import { ApiResponse } from "../../utils/apiResponse";

export class CouponController {
  static async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const coupons = await CouponService.listCoupons();
      return ApiResponse.success(res, coupons, "Coupons fetched successfully");
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, discountType, discountValue, minOrderAmount, maxDiscountAmount, endDate, usageLimit } = req.body;
      if (!code || !discountType || discountValue === undefined) {
        return ApiResponse.error(res, "Code, discountType (PERCENTAGE/FIXED), and discountValue are required", 400);
      }

      const coupon = await CouponService.createCoupon({
        code,
        discountType,
        discountValue: Number(discountValue),
        minOrderAmount: minOrderAmount ? Number(minOrderAmount) : 0,
        maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        usageLimit: usageLimit ? Number(usageLimit) : undefined,
      });

      return ApiResponse.created(res, coupon, "Coupon created successfully");
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await CouponService.deleteCoupon(req.params.id);
      return ApiResponse.success(res, null, "Coupon deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}
