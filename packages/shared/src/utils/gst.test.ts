import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  getApparelGSTRate,
  calculateItemGST,
  calculateOrderTotals,
} from "./gst";
import { GST_CONSTANTS } from "../constants";

describe("Indian Apparel GST Calculations", () => {
  it("should apply 5% GST for garments priced <= ₹1,000", () => {
    assert.equal(getApparelGSTRate(500), 5);
    assert.equal(getApparelGSTRate(999), 5);
    assert.equal(getApparelGSTRate(1000), 5); // exact slab boundary
  });

  it("should apply 12% GST for garments priced > ₹1,000", () => {
    assert.equal(getApparelGSTRate(1001), 12);
    assert.equal(getApparelGSTRate(1890), 12);
    assert.equal(getApparelGSTRate(4500), 12);
  });

  it("should split taxes into CGST (2.5%) and SGST (2.5%) for Tamil Nadu intra-state orders <= ₹1000", () => {
    const result = calculateItemGST({
      unitPrice: 1000,
      quantity: 1,
      destinationState: "Tamil Nadu",
      originState: "Tamil Nadu",
      inclusiveOfTax: true,
    });

    assert.equal(result.isInterState, false);
    assert.equal(result.gstRate, 5);
    assert.equal(result.cgstRate, 2.5);
    assert.equal(result.sgstRate, 2.5);
    assert.equal(result.igstRate, 0);
    assert.equal(result.igstAmount, 0);

    // Taxable = 1000 / 1.05 = 952.38
    assert.equal(result.taxableAmount, 952.38);
    // GST = 1000 - 952.38 = 47.62
    assert.equal(result.totalGstAmount, 47.62);
    // CGST = 23.81, SGST = 23.81
    assert.equal(result.cgstAmount, 23.81);
    assert.equal(result.sgstAmount, 23.81);
    assert.equal(result.totalAmount, 1000);
  });

  it("should apply IGST (12%) for inter-state orders (e.g., Tamil Nadu to Maharashtra or Karnataka) > ₹1000", () => {
    const result = calculateItemGST({
      unitPrice: 1890,
      quantity: 1,
      destinationState: "Maharashtra",
      originState: "Tamil Nadu",
      inclusiveOfTax: true,
    });

    assert.equal(result.isInterState, true);
    assert.equal(result.gstRate, 12);
    assert.equal(result.cgstRate, 0);
    assert.equal(result.sgstRate, 0);
    assert.equal(result.cgstAmount, 0);
    assert.equal(result.sgstAmount, 0);
    assert.equal(result.igstRate, 12);

    // Taxable = 1890 / 1.12 = 1687.50
    assert.equal(result.taxableAmount, 1687.50);
    // IGST = 1890 - 1687.50 = 202.50
    assert.equal(result.igstAmount, 202.50);
    assert.equal(result.totalGstAmount, 202.50);
    assert.equal(result.totalAmount, 1890);
  });

  it("should calculate order totals with mixed GST slabs, shipping fee, and coupon discount", () => {
    const orderResult = calculateOrderTotals({
      items: [
        { unitPrice: 800, quantity: 1 }, // 5% GST item
        { unitPrice: 2000, quantity: 1 }, // 12% GST item
      ],
      shippingState: "Karnataka", // Inter-state IGST
      shippingFee: 99,
      discountAmount: 200,
    });

    assert.equal(orderResult.subtotal, 2800);
    assert.equal(orderResult.discountAmount, 200);
    assert.equal(orderResult.shippingFee, 99);
    // Total = 2800 - 200 + 99 = 2699
    assert.equal(orderResult.totalAmount, 2699);
    assert.equal(orderResult.cgst, 0);
    assert.equal(orderResult.sgst, 0);
    assert.ok(orderResult.igst > 0);
    assert.equal(orderResult.totalGst, orderResult.igst);
  });
});
