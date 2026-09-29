import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ClothingSize } from "@indigo/shared";

export interface CartItemLocal {
  id: string; // cart item id or temporary local id
  variantId: string;
  productId: string;
  productName: string;
  productSlug: string;
  size: ClothingSize;
  colorName: string;
  price: number;
  mrp: number;
  image: string;
  quantity: number;
  maxStock: number;
}

interface CartState {
  items: CartItemLocal[];
  isDrawerOpen: boolean;
  couponCode: string | null;
  discountAmount: number;

  addItem: (item: Omit<CartItemLocal, "id">) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;

  // Computed helpers
  getSubtotal: () => number;
  getTotalQuantity: () => number;
  getShippingFee: () => number;
  getEstimatedGST: () => number;
  getGrandTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      couponCode: null,
      discountAmount: 0,

      addItem: (item) => {
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex((i) => i.variantId === item.variantId);

        if (existingIndex > -1) {
          const updated = [...currentItems];
          const newQty = Math.min(updated[existingIndex].quantity + item.quantity, item.maxStock);
          updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
          set({ items: updated, isDrawerOpen: true });
        } else {
          const newItem: CartItemLocal = {
            ...item,
            id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          };
          set({ items: [...currentItems, newItem], isDrawerOpen: true });
        }
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }

        const updated = get().items.map((item) => {
          if (item.variantId === variantId) {
            return { ...item, quantity: Math.min(quantity, item.maxStock) };
          }
          return item;
        });

        set({ items: updated });
      },

      removeItem: (variantId) => {
        set({ items: get().items.filter((item) => item.variantId !== variantId) });
      },

      clearCart: () => set({ items: [], couponCode: null, discountAmount: 0 }),
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),

      applyCoupon: (code, discount) => set({ couponCode: code, discountAmount: discount }),
      removeCoupon: () => set({ couponCode: null, discountAmount: 0 }),

      getSubtotal: () => {
        return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      },

      getTotalQuantity: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },

      getShippingFee: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        return subtotal >= 1500 ? 0 : 100;
      },

      getEstimatedGST: () => {
        // Approximate GST included in MRP: 5% for items <= 1000, 12% for items > 1000
        return get().items.reduce((acc, item) => {
          const rate = item.price <= 1000 ? 5 : 12;
          const gross = item.price * item.quantity;
          const taxable = gross / (1 + rate / 100);
          return acc + (gross - taxable);
        }, 0);
      },

      getGrandTotal: () => {
        const subtotal = get().getSubtotal();
        const shipping = get().getShippingFee();
        const discount = get().discountAmount;
        return Math.max(0, subtotal - discount + shipping);
      },
    }),
    {
      name: "indigo-cart-store",
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
        discountAmount: state.discountAmount,
      }),
    }
  )
);
