import { describe, it } from "node:test";
import assert from "node:assert/strict";

interface MockCoupon {
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number | null;
  isActive: boolean;
  endDate?: Date | null;
}

function calculateCouponDiscount(coupon: MockCoupon, orderSubtotal: number): {
  isValid: boolean;
  discountAmount: number;
  reason?: string;
} {
  if (!coupon.isActive) {
    return { isValid: false, discountAmount: 0, reason: "Coupon is inactive" };
  }

  if (coupon.endDate && new Date() > coupon.endDate) {
    return { isValid: false, discountAmount: 0, reason: "Coupon has expired" };
  }

  if (orderSubtotal < coupon.minOrderAmount) {
    return {
      isValid: false,
      discountAmount: 0,
      reason: `Minimum order amount of ₹${coupon.minOrderAmount} required`,
    };
  }

  let discount = 0;
  if (coupon.discountType === "PERCENTAGE") {
    discount = (orderSubtotal * coupon.discountValue) / 100;
    if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
      discount = coupon.maxDiscountAmount;
    }
  } else {
    discount = Math.min(coupon.discountValue, orderSubtotal);
  }

  return {
    isValid: true,
    discountAmount: Number(discount.toFixed(2)),
  };
}

describe("Coupon Discount Engine", () => {
  it("should calculate flat percentage discount within maximum cap", () => {
    const coupon: MockCoupon = {
      code: "WELCOME10",
      discountType: "PERCENTAGE",
      discountValue: 10,
      minOrderAmount: 1000,
      maxDiscountAmount: 300,
      isActive: true,
    };

    // Subtotal 2000 -> 10% is 200 (under 300 cap)
    const result1 = calculateCouponDiscount(coupon, 2000);
    assert.equal(result1.isValid, true);
    assert.equal(result1.discountAmount, 200);

    // Subtotal 5000 -> 10% is 500 (capped at 300)
    const result2 = calculateCouponDiscount(coupon, 5000);
    assert.equal(result2.isValid, true);
    assert.equal(result2.discountAmount, 300);
  });

  it("should calculate fixed amount discount", () => {
    const coupon: MockCoupon = {
      code: "HANDLOOM500",
      discountType: "FIXED",
      discountValue: 500,
      minOrderAmount: 2500,
      isActive: true,
    };

    const result = calculateCouponDiscount(coupon, 3000);
    assert.equal(result.isValid, true);
    assert.equal(result.discountAmount, 500);
  });

  it("should reject orders below the minimum order threshold", () => {
    const coupon: MockCoupon = {
      code: "HANDLOOM500",
      discountType: "FIXED",
      discountValue: 500,
      minOrderAmount: 2500,
      isActive: true,
    };

    const result = calculateCouponDiscount(coupon, 1890);
    assert.equal(result.isValid, false);
    assert.equal(result.discountAmount, 0);
    assert.ok(result.reason?.includes("Minimum order amount"));
  });

  it("should reject expired coupons", () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 2);

    const coupon: MockCoupon = {
      code: "EXPIRED20",
      discountType: "PERCENTAGE",
      discountValue: 20,
      minOrderAmount: 0,
      isActive: true,
      endDate: pastDate,
    };

    const result = calculateCouponDiscount(coupon, 3000);
    assert.equal(result.isValid, false);
    assert.equal(result.discountAmount, 0);
    assert.equal(result.reason, "Coupon has expired");
  });
});
