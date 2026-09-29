import { z } from "zod";
import { ORDER_STATUS, PAYMENT_METHOD } from "../constants";

export const addressSchema = z.object({
  fullName: z.string().trim().min(2, "Full name required").max(100),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"),
  alternatePhone: z.string().trim().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number").optional().nullable(),
  addressLine1: z.string().trim().min(5, "Flat, House no., Building, Company, Apartment").max(200),
  addressLine2: z.string().trim().max(200).optional().nullable(),
  landmark: z.string().trim().max(100).optional().nullable(),
  city: z.string().trim().min(2, "City required").max(100),
  state: z.string().trim().min(2, "State required").max(100),
  postalCode: z.string().trim().regex(/^[1-9][0-9]{5}$/, "Please enter a valid 6-digit Indian PIN code"),
  isDefault: z.boolean().default(false),
});

export const createOrderSchema = z.object({
  shippingAddressId: z.string().cuid().optional(),
  newShippingAddress: addressSchema.optional(),
  billingAddressSameAsShipping: z.boolean().default(true),
  billingAddressId: z.string().cuid().optional(),
  newBillingAddress: addressSchema.optional(),
  paymentMethod: z.enum([PAYMENT_METHOD.RAZORPAY, PAYMENT_METHOD.COD]),
  couponCode: z.string().trim().max(30).optional().nullable(),
  customerNotes: z.string().trim().max(300).optional().nullable(),
}).refine(
  (data) => data.shippingAddressId || data.newShippingAddress,
  { message: "Either shippingAddressId or newShippingAddress must be provided", path: ["shippingAddressId"] }
);

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    ORDER_STATUS.PENDING,
    ORDER_STATUS.CONFIRMED,
    ORDER_STATUS.PROCESSING,
    ORDER_STATUS.SHIPPED,
    ORDER_STATUS.DELIVERED,
    ORDER_STATUS.CANCELLED,
    ORDER_STATUS.RETURN_REQUESTED,
    ORDER_STATUS.RETURNED,
  ]),
  trackingNumber: z.string().trim().optional().nullable(),
  courierPartner: z.string().trim().optional().nullable(),
  comment: z.string().trim().optional().nullable(),
});

export const orderFilterQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: z.enum([
    ORDER_STATUS.PENDING,
    ORDER_STATUS.CONFIRMED,
    ORDER_STATUS.PROCESSING,
    ORDER_STATUS.SHIPPED,
    ORDER_STATUS.DELIVERED,
    ORDER_STATUS.CANCELLED,
    ORDER_STATUS.RETURN_REQUESTED,
    ORDER_STATUS.RETURNED,
  ]).optional(),
  search: z.string().trim().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export type AddressInput = z.infer<typeof addressSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type OrderFilterQuery = z.infer<typeof orderFilterQuerySchema>;
