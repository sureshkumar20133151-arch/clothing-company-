import { z } from "zod";

export const addToCartSchema = z.object({
  productVariantId: z.string().cuid("Invalid product variant ID"),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1").max(10, "Maximum 10 units per item"),
});

export const updateCartItemSchema = z.object({
  quantity: z.coerce.number().int().min(0, "Quantity cannot be negative").max(10, "Maximum 10 units per item"),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
