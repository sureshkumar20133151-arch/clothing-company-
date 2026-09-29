import { GST_CONSTANTS } from "../constants";

export interface GSTCalculationItem {
  price: number; // Selling price inclusive of GST or exclusive
  quantity: number;
  hsnCode?: string;
}

export interface GSTBreakupResult {
  taxableAmount: number; // Base price before GST
  gstRate: number; // Percentage, e.g. 5 or 12
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  igstRate: number;
  igstAmount: number;
  totalGstAmount: number;
  totalAmount: number; // Price * quantity
  isInterState: boolean;
}

/**
 * Returns GST percentage for garment item according to Indian tax slabs.
 * Under ₹1000: 5%
 * Above ₹1000: 12%
 */
export function getApparelGSTRate(unitPrice: number): number {
  if (unitPrice <= GST_CONSTANTS.SLAB_LOW_THRESHOLD_INR) {
    return GST_CONSTANTS.SLAB_LOW_RATE_PERCENT;
  }
  return GST_CONSTANTS.SLAB_HIGH_RATE_PERCENT;
}

/**
 * Calculates Indian GST breakup for an item or cart.
 * If inclusiveOfTax is true, unit price already includes GST (standard in Indian B2C e-commerce).
 * Price = Base + Base * (rate/100) -> Base = Price / (1 + rate/100)
 */
export function calculateItemGST({
  unitPrice,
  quantity,
  destinationState,
  originState = GST_CONSTANTS.DEFAULT_STORE_STATE,
  inclusiveOfTax = true,
}: {
  unitPrice: number;
  quantity: number;
  destinationState: string;
  originState?: string;
  inclusiveOfTax?: boolean;
}): GSTBreakupResult {
  const effectiveGstRate = getApparelGSTRate(unitPrice);
  const totalGross = Number((unitPrice * quantity).toFixed(2));

  let taxableAmount: number;
  let totalGstAmount: number;

  if (inclusiveOfTax) {
    taxableAmount = Number((totalGross / (1 + effectiveGstRate / 100)).toFixed(2));
    totalGstAmount = Number((totalGross - taxableAmount).toFixed(2));
  } else {
    taxableAmount = totalGross;
    totalGstAmount = Number(((taxableAmount * effectiveGstRate) / 100).toFixed(2));
  }

  const isInterState =
    destinationState.trim().toLowerCase() !== originState.trim().toLowerCase();

  let cgstRate = 0;
  let cgstAmount = 0;
  let sgstRate = 0;
  let sgstAmount = 0;
  let igstRate = 0;
  let igstAmount = 0;

  if (isInterState) {
    igstRate = effectiveGstRate;
    igstAmount = totalGstAmount;
  } else {
    cgstRate = effectiveGstRate / 2;
    sgstRate = effectiveGstRate / 2;
    cgstAmount = Number((totalGstAmount / 2).toFixed(2));
    sgstAmount = Number((totalGstAmount - cgstAmount).toFixed(2)); // handle odd cents
  }

  const totalAmount = inclusiveOfTax ? totalGross : Number((taxableAmount + totalGstAmount).toFixed(2));

  return {
    taxableAmount,
    gstRate: effectiveGstRate,
    cgstRate,
    cgstAmount,
    sgstRate,
    sgstAmount,
    igstRate,
    igstAmount,
    totalGstAmount,
    totalAmount,
    isInterState,
  };
}

/**
 * Calculates cart totals including shipping, discount, and consolidated GST breakdown.
 */
export function calculateOrderTotals({
  items,
  shippingState,
  shippingFee = 0,
  discountAmount = 0,
}: {
  items: Array<{ unitPrice: number; quantity: number }>;
  shippingState: string;
  shippingFee?: number;
  discountAmount?: number;
}) {
  let subtotal = 0;
  let totalTaxable = 0;
  let totalCGST = 0;
  let totalSGST = 0;
  let totalIGST = 0;
  let totalGST = 0;

  items.forEach((item) => {
    const itemCalculation = calculateItemGST({
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      destinationState: shippingState,
      inclusiveOfTax: true,
    });

    subtotal += item.unitPrice * item.quantity;
    totalTaxable += itemCalculation.taxableAmount;
    totalCGST += itemCalculation.cgstAmount;
    totalSGST += itemCalculation.sgstAmount;
    totalIGST += itemCalculation.igstAmount;
    totalGST += itemCalculation.totalGstAmount;
  });

  const finalAmount = Math.max(0, subtotal - discountAmount + shippingFee);

  return {
    subtotal: Number(subtotal.toFixed(2)),
    discountAmount: Number(discountAmount.toFixed(2)),
    shippingFee: Number(shippingFee.toFixed(2)),
    taxableAmount: Number(totalTaxable.toFixed(2)),
    cgst: Number(totalCGST.toFixed(2)),
    sgst: Number(totalSGST.toFixed(2)),
    igst: Number(totalIGST.toFixed(2)),
    totalGst: Number(totalGST.toFixed(2)),
    totalAmount: Number(finalAmount.toFixed(2)),
  };
}
