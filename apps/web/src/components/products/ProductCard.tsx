"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ProductDTO } from "@indigo/shared";
import { formatINR, calculateDiscountPercent } from "../../lib/utils";
import { Heart } from "lucide-react";
import { useWishlistStore } from "../../store/useWishlistStore";

interface ProductCardProps {
  product: ProductDTO;
}

export function ProductCard({ product }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const inWishlist = mounted ? isInWishlist(product.id) : false;
  const primaryImage = product.images.find((img) => img.isPrimary)?.url || product.images[0]?.url;
  const secondaryImage = product.images.find((img) => !img.isPrimary)?.url || primaryImage;

  // Derive lowest price variant
  const minPriceVariant = product.variants.reduce((prev, curr) =>
    curr.price < prev.price ? curr : prev
  );

  const price = minPriceVariant ? minPriceVariant.price : 0;
  const mrp = minPriceVariant ? minPriceVariant.mrp : price;
  const discountPercent = calculateDiscountPercent(price, mrp);

  // Unique sizes available in stock
  const availableSizes = Array.from(
    new Set(product.variants.filter((v) => v.stock > 0).map((v) => v.size))
  );

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-kora-300 overflow-hidden shadow-sm hover:shadow-md transition duration-300">
      {/* Image container */}
      <Link
        href={`/product/${product.slug}`}
        className="relative aspect-[3/4] w-full overflow-hidden bg-kora-200 block"
      >
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover object-top transition duration-500 group-hover:opacity-0"
        />
        <img
          src={secondaryImage}
          alt={`${product.name} alternate view`}
          className="absolute inset-0 w-full h-full object-cover object-top opacity-0 transition duration-500 group-hover:opacity-100"
        />

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 bg-terracotta-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
            {discountPercent}% OFF
          </div>
        )}

        {/* GST Slab Badge */}
        <div className="absolute top-3 right-3 bg-indigo-950/80 backdrop-blur-sm text-kora-100 text-[10px] font-medium px-2 py-0.5 rounded-md">
          {price <= 1000 ? "5% GST" : "12% GST"}
        </div>
      </Link>

      {/* Wishlist Toggle Button */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product);
        }}
        className={`absolute top-12 right-3 z-10 p-2 rounded-full backdrop-blur-md transition shadow-sm ${
          inWishlist
            ? "bg-rose-50 text-rose-600 scale-110"
            : "bg-white/80 text-indigo-950 hover:bg-white hover:text-rose-600"
        }`}
        title={inWishlist ? "Remove from Wishlist" : "Save to Wishlist"}
      >
        <Heart className={`w-4 h-4 ${inWishlist ? "fill-rose-600 stroke-rose-600" : ""}`} />
      </button>

      {/* Info Container */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Craft note */}
          <div className="text-[11px] font-medium text-indigo-800/70 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>{product.category?.name || "Handloom"}</span>
            <span className="text-terracotta-600 font-semibold">{product.gender}</span>
          </div>

          <Link href={`/product/${product.slug}`}>
            <h3 className="font-serif text-sm font-bold text-indigo-950 hover:text-terracotta-600 transition line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-indigo-900/60 line-clamp-2 mt-1 leading-relaxed">
            {product.craftStory || product.description}
          </p>
        </div>

        {/* Sizes & Pricing */}
        <div className="mt-4 pt-3 border-t border-kora-200">
          <div className="flex items-center gap-1 mb-2">
            <span className="text-[10px] text-indigo-900/50 uppercase font-semibold mr-1">Sizes:</span>
            {availableSizes.map((size) => (
              <span
                key={size}
                className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-kora-100 text-indigo-950 border border-kora-300"
              >
                {size}
              </span>
            ))}
          </div>

          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-indigo-950">{formatINR(price)}</span>
              {mrp > price && (
                <span className="text-xs text-indigo-900/40 line-through">{formatINR(mrp)}</span>
              )}
            </div>
            <span className="text-[10px] text-indigo-900/60">Incl. GST</span>
          </div>
        </div>
      </div>
    </div>
  );
}
