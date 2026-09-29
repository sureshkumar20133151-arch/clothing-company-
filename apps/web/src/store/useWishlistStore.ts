import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ProductDTO } from "@indigo/shared";

interface WishlistState {
  items: ProductDTO[];
  toggleWishlist: (product: ProductDTO) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      toggleWishlist: (product) => {
        const current = get().items;
        const exists = current.some((p) => p.id === product.id);

        if (exists) {
          set({ items: current.filter((p) => p.id !== product.id) });
        } else {
          set({ items: [...current, product] });
        }
      },

      removeFromWishlist: (productId) => {
        set({ items: get().items.filter((p) => p.id !== productId) });
      },

      isInWishlist: (productId) => {
        return get().items.some((p) => p.id === productId);
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "indigo-wishlist-store",
    }
  )
);
