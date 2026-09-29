import { UserRole, OrderStatus, PaymentStatus, PaymentMethod, ClothingSize, Gender, ProductStatus } from "../constants";

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string | Record<string, any>;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    [key: string]: any;
  };
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string | null;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  tokenVersion?: number;
}

export interface CategoryDTO {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  gender: Gender;
  parentId?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariantDTO {
  id: string;
  productId: string;
  sku: string;
  size: ClothingSize;
  colorName: string;
  colorHex: string;
  price: number;
  mrp: number;
  stock: number;
  barcode?: string | null;
}

export interface ProductImageDTO {
  id: string;
  productId: string;
  url: string;
  altText: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface ProductDTO {
  id: string;
  name: string;
  slug: string;
  description: string;
  craftStory?: string | null;
  fabricDetails?: string | null;
  careInstructions?: string | null;
  hsnCode: string;
  gender: Gender;
  status: ProductStatus;
  isFeatured: boolean;
  categoryId: string;
  category?: CategoryDTO;
  variants: ProductVariantDTO[];
  images: ProductImageDTO[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItemDTO {
  id: string;
  cartId: string;
  productVariantId: string;
  variant: ProductVariantDTO & {
    product: Pick<ProductDTO, "id" | "name" | "slug"> & {
      images: ProductImageDTO[];
    };
  };
  quantity: number;
}

export interface CartDTO {
  id: string;
  userId?: string | null;
  items: CartItemDTO[];
  subtotal: number;
  totalQuantity: number;
}

export interface AddressDTO {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  alternatePhone?: string | null;
  addressLine1: string;
  addressLine2?: string | null;
  landmark?: string | null;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
}

export interface OrderItemDTO {
  id: string;
  orderId: string;
  productVariantId: string;
  productName: string;
  variantInfo: string; // "Size: M, Color: Indigo Blue"
  sku: string;
  price: number;
  quantity: number;
  gstRate: number;
  gstAmount: number;
  total: number;
}

export interface OrderDTO {
  id: string;
  orderNumber: string;
  userId: string;
  user?: Pick<UserSession, "id" | "name" | "email" | "phone">;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  subtotal: number;
  discountAmount: number;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalGst: number;
  shippingFee: number;
  totalAmount: number;
  shippingAddress: AddressDTO;
  billingAddress: AddressDTO;
  items: OrderItemDTO[];
  trackingNumber?: string | null;
  courierPartner?: string | null;
  customerNotes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
