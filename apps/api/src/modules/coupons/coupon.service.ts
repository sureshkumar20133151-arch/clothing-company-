import { prisma } from "../../config/prisma";
import { DiscountType } from "@prisma/client";

export class CouponService {
  static async listCoupons() {
    return prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  static async createCoupon(data: {
    code: string;
    discountType: DiscountType;
    discountValue: number;
    minOrderAmount?: number;
    maxDiscountAmount?: number;
    endDate?: Date;
    usageLimit?: number;
  }) {
    const existing = await prisma.coupon.findUnique({
      where: { code: data.code.toUpperCase() },
    });

    if (existing) {
      throw { statusCode: 409, message: "A coupon with this code already exists" };
    }

    return prisma.coupon.create({
      data: {
        code: data.code.toUpperCase(),
        discountType: data.discountType,
        discountValue: data.discountValue,
        minOrderAmount: data.minOrderAmount || 0,
        maxDiscountAmount: data.maxDiscountAmount || null,
        startDate: new Date(),
        endDate: data.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        usageLimit: data.usageLimit || null,
        isActive: true,
      },
    });
  }

  static async deleteCoupon(id: string) {
    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon) {
      throw { statusCode: 404, message: "Coupon not found" };
    }

    return prisma.coupon.delete({ where: { id } });
  }
}
