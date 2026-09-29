export const ROLES = {
  CUSTOMER: "customer",
  ADMIN: "admin",
  MANAGER: "manager",
  SUPPORT: "support",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export const ORDER_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  PROCESSING: "PROCESSING",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
  RETURN_REQUESTED: "RETURN_REQUESTED",
  RETURNED: "RETURNED",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  AUTHORIZED: "AUTHORIZED",
  PAID: "PAID",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
} as const;

export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export const PAYMENT_METHOD = {
  RAZORPAY: "RAZORPAY",
  COD: "COD",
} as const;

export type PaymentMethod = (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD];

export const CLOTHING_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "FREE_SIZE"] as const;
export type ClothingSize = (typeof CLOTHING_SIZES)[number];

export const GENDERS = ["MEN", "WOMEN", "UNISEX"] as const;
export type Gender = (typeof GENDERS)[number];

export const PRODUCT_STATUS = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
} as const;

export type ProductStatus = (typeof PRODUCT_STATUS)[keyof typeof PRODUCT_STATUS];

// Indian GST Apparel Constants
export const GST_CONSTANTS = {
  DEFAULT_STORE_STATE: "Tamil Nadu",
  DEFAULT_STORE_STATE_CODE: "33",
  SLAB_LOW_THRESHOLD_INR: 1000,
  SLAB_LOW_RATE_PERCENT: 5,
  SLAB_HIGH_RATE_PERCENT: 12,
  HSN_APPAREL_WOVEN: "6205",
  HSN_APPAREL_KNITTED: "6109",
  HSN_HANDLOOM_COTTON: "5208",
  CURRENCY: "INR",
  CURRENCY_SYMBOL: "₹",
} as const;

// 36 Indian States & UTs with GST State Codes
export const INDIAN_STATES = [
  { code: "01", name: "Jammu and Kashmir" },
  { code: "02", name: "Himachal Pradesh" },
  { code: "03", name: "Punjab" },
  { code: "04", name: "Chandigarh" },
  { code: "05", name: "Uttarakhand" },
  { code: "06", name: "Haryana" },
  { code: "07", name: "Delhi" },
  { code: "08", name: "Rajasthan" },
  { code: "09", name: "Uttar Pradesh" },
  { code: "10", name: "Bihar" },
  { code: "11", name: "Sikkim" },
  { code: "12", name: "Arunachal Pradesh" },
  { code: "13", name: "Nagaland" },
  { code: "14", name: "Manipur" },
  { code: "15", name: "Mizoram" },
  { code: "16", name: "Tripura" },
  { code: "17", name: "Meghalaya" },
  { code: "18", name: "Assam" },
  { code: "19", name: "West Bengal" },
  { code: "20", name: "Jharkhand" },
  { code: "21", name: "Odisha" },
  { code: "22", name: "Chhattisgarh" },
  { code: "23", name: "Madhya Pradesh" },
  { code: "24", name: "Gujarat" },
  { code: "26", name: "Dadra and Nagar Haveli and Daman and Diu" },
  { code: "27", name: "Maharashtra" },
  { code: "28", name: "Andhra Pradesh" },
  { code: "29", name: "Karnataka" },
  { code: "30", name: "Goa" },
  { code: "31", name: "Lakshadweep" },
  { code: "32", name: "Kerala" },
  { code: "33", name: "Tamil Nadu" },
  { code: "34", name: "Puducherry" },
  { code: "35", name: "Andaman and Nicobar Islands" },
  { code: "36", name: "Telangana" },
  { code: "37", name: "Ladakh" },
] as const;
