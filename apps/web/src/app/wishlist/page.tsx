"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useWishlistStore } from "../../store/useWishlistStore";
import { useCartStore } from "../../store/useCartStore";
import { formatINR } from "../../lib/utils";
import { Heart, ShoppingBag, Trash2, ArrowRight, Sparkles } from "lucide-react";

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist } = useWishlistStore();
  const { addItem, openDrawer } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-sm text-indigo-900/60">
        Loading saved handloom pieces...
      </div>
    );
  }

  const handleMoveToBag = (product: any) => {
    // Pick the first available variant with stock, or fallback to first variant
    const variant = product.variants?.find((v: any) => v.stock > 0) || product.variants?.[0];
    if (!variant) return;

    addItem({
      variantId: variant.id,
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      size: variant.size,
      colorName: variant.colorName,
      price: variant.price,
      mrp: variant.mrp,
      image: product.images?.[0]?.url || "",
      quantity: 1,
      maxStock: variant.stock,
    });

    removeFromWishlist(product.id);
    openDrawer();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-kora-300 gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-terracotta-600 flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5" /> Handpicked Artisanal Favorites
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-indigo-950">
            My Wishlist ({items.length})
          </h1>
        </div>

        {items.length > 0 && (
          <button
            onClick={clearWishlist}
            className="text-xs text-rose-700 hover:text-rose-900 font-medium underline transition"
          >
            Clear All Items
          </button>
        )}
      </div>

      {/* Content */}
      {items.length === 0 ? (
        <div className="text-center py-20 px-4 bg-white rounded-3xl border border-kora-300 mt-8 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h2 className="text-xl font-serif font-bold text-indigo-950 mb-2">
            Your Wishlist is Empty
          </h2>
          <p className="text-sm text-indigo-900/60 max-w-md mx-auto mb-6 leading-relaxed">
            Save your favorite pure handloom cotton shirts, Salem sarees, and artisanal staples to purchase anytime.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-950 text-white text-xs font-semibold hover:bg-indigo-900 transition shadow"
          >
            <span>Explore Handloom Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {items.map((product) => {
            const primaryImage =
              product.images?.find((img) => img.isPrimary)?.url || product.images?.[0]?.url;
            const minPrice = product.variants?.reduce(
              (min, v) => (v.price < min ? v.price : min),
              product.variants[0]?.price || 0
            );

            return (
              <div
                key={product.id}
                className="group flex flex-col bg-white rounded-2xl border border-kora-300 overflow-hidden shadow-sm hover:shadow-md transition"
              >
                {/* Image */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-kora-200">
                  <Link href={`/product/${product.slug}`} className="block w-full h-full">
                    <img
                      src={primaryImage}
                      alt={product.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
                    />
                  </Link>

                  {/* Remove Wishlist Button */}
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm text-rose-600 hover:bg-rose-50 shadow transition"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Info */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-indigo-900/60 mb-1">
                      {product.gender} • {product.category?.name || "Artisanal"}
                    </div>
                    <Link href={`/product/${product.slug}`}>
                      <h3 className="font-serif text-sm font-bold text-indigo-950 hover:text-terracotta-600 transition line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="mt-2 text-sm font-bold text-indigo-950">
                      {formatINR(minPrice)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-kora-200 flex items-center gap-2">
                    <button
                      onClick={() => handleMoveToBag(product)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-indigo-950 hover:bg-indigo-900 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-sm"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Bag</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
