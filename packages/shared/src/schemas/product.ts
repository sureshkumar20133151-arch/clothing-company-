import { z } from "zod";
import { CLOTHING_SIZES, GENDERS, PRODUCT_STATUS } from "../constants";

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  slug: z.string().trim().min(2).max(100).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().trim().max(500).optional().nullable(),
  image: z.string().url("Must be a valid image URL").optional().nullable(),
  gender: z.enum(GENDERS).default("UNISEX"),
  parentId: z.string().cuid().optional().nullable(),
  isActive: z.boolean().default(true),
});

export const productVariantSchema = z.object({
  id: z.string().cuid().optional(),
  sku: z.string().trim().min(3).max(50),
  size: z.enum(CLOTHING_SIZES),
  colorName: z.string().trim().min(2, "Color name required"),
  colorHex: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Valid hex code required"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  mrp: z.coerce.number().positive("MRP must be greater than 0"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  barcode: z.string().trim().optional().nullable(),
});

export const productImageSchema = z.object({
  url: z.string().url("Valid image URL required"),
  altText: z.string().trim().default("Indigo & Thread Garment"),
  isPrimary: z.boolean().default(false),
  displayOrder: z.coerce.number().int().default(0),
});

export const productCreateSchema = z.object({
  name: z.string().trim().min(3, "Product name must be at least 3 characters").max(150),
  slug: z.string().trim().min(3).max(180).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().trim().min(10, "Description must be at least 10 characters"),
  craftStory: z.string().trim().max(1000).optional().nullable(),
  fabricDetails: z.string().trim().max(500).optional().nullable(),
  careInstructions: z.string().trim().max(500).optional().nullable(),
  hsnCode: z.string().trim().default("6205"),
  gender: z.enum(GENDERS),
  status: z.enum([PRODUCT_STATUS.DRAFT, PRODUCT_STATUS.PUBLISHED, PRODUCT_STATUS.ARCHIVED]).default(PRODUCT_STATUS.PUBLISHED),
  isFeatured: z.boolean().default(false),
  categoryId: z.string().cuid("Invalid category ID"),
  variants: z.array(productVariantSchema).min(1, "At least one size/color variant is required"),
  images: z.array(productImageSchema).min(1, "At least one product image is required"),
});

export const productUpdateSchema = productCreateSchema.partial().extend({
  id: z.string().cuid(),
});

export const productFilterQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().trim().optional(),
  category: z.string().trim().optional(),
  gender: z.enum(GENDERS).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().positive().optional(),
  size: z.enum(CLOTHING_SIZES).optional(),
  color: z.string().trim().optional(),
  sortBy: z.enum(["newest", "price_asc", "price_desc", "name_asc", "popular"]).default("newest"),
  status: z.enum([PRODUCT_STATUS.DRAFT, PRODUCT_STATUS.PUBLISHED, PRODUCT_STATUS.ARCHIVED]).optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;
export type ProductVariantInput = z.infer<typeof productVariantSchema>;
export type ProductImageInput = z.infer<typeof productImageSchema>;
export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
export type ProductFilterQuery = z.infer<typeof productFilterQuerySchema>;
