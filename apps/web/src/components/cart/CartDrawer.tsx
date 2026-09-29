"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import { useCartStore } from "../../store/useCartStore";
import { formatINR } from "../../lib/utils";

export function CartDrawer() {
  const [mounted, setMounted] = useState(false);
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    getSubtotal,
    getShippingFee,
    getGrandTotal,
    getEstimatedGST,
  } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isDrawerOpen) return null;

  const subtotal = getSubtotal();
  const shippingFee = getShippingFee();
  const grandTotal = getGrandTotal();
  const estimatedGst = getEstimatedGST();
  const amountForFreeShipping = Math.max(0, 1500 - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-indigo-950/60 backdrop-blur-sm transition-opacity"
        onClick={closeDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-kora-50 shadow-2xl flex flex-col border-l border-kora-300">
          {/* Header */}
          <div className="px-6 py-5 bg-white border-b border-kora-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-indigo-950" />
              <h2 className="text-base font-serif font-bold text-indigo-950">
                Your Handloom Bag ({items.length})
              </h2>
            </div>
            <button
              onClick={closeDrawer}
              className="p-1.5 rounded-full text-indigo-900/60 hover:text-indigo-950 hover:bg-kora-100 transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress bar */}
          <div className="bg-indigo-50 px-6 py-3 border-b border-indigo-100">
            {amountForFreeShipping > 0 ? (
              <div>
                <p className="text-xs text-indigo-900 font-medium">
                  Add <strong className="text-indigo-950">{formatINR(amountForFreeShipping)}</strong> more to get{" "}
                  <span className="text-terracotta-600 font-bold">Free Delivery</span> anywhere in India!
                </p>
                <div className="w-full bg-indigo-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-indigo-900 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (subtotal / 1500) * 100)}%` }}
                  />
                </div>
              </div>
            ) : (
              <p className="text-xs text-emerald-800 font-semibold flex items-center gap-1.5">
                🎉 Congratulations! You have unlocked Free Express Delivery across India.
              </p>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="w-12 h-12 text-kora-400 mx-auto mb-3 stroke-[1.5]" />
                <h3 className="text-sm font-semibold text-indigo-950">Your bag is empty</h3>
                <p className="text-xs text-indigo-900/60 mt-1 max-w-xs mx-auto">
                  Explore our authentic handloom shirts, kurtas, and sarees woven in Tamil Nadu and Bengal.
                </p>
                <button
                  onClick={closeDrawer}
                  className="mt-6 inline-flex text-xs font-semibold text-white bg-indigo-900 px-5 py-2.5 rounded-full hover:bg-indigo-950 transition"
                >
                  Start Exploring
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.variantId}
                  className="flex gap-4 p-3 bg-white rounded-xl border border-kora-200 shadow-sm"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-24 bg-kora-100 rounded-lg overflow-hidden shrink-0 border border-kora-200">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          href={`/product/${item.productSlug}`}
                          onClick={closeDrawer}
                          className="text-xs font-serif font-bold text-indigo-950 hover:underline line-clamp-1"
                        >
                          {item.productName}
                        </Link>
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="text-indigo-400 hover:text-rose-600 transition p-0.5 ml-2"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-indigo-800/70 mt-0.5">
                        Size: <span className="font-semibold text-indigo-950">{item.size}</span> • Color: {item.colorName}
                      </p>
                      <p className="text-xs font-bold text-indigo-950 mt-1">
                        {formatINR(item.price)}
                        {item.mrp > item.price && (
                          <span className="text-[11px] text-indigo-900/40 line-through font-normal ml-1.5">
                            {formatINR(item.mrp)}
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-kora-300 rounded-lg bg-kora-50">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="p-1 text-indigo-900 hover:bg-kora-200 rounded-l-lg transition"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-indigo-950">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          disabled={item.quantity >= item.maxStock}
                          className="p-1 text-indigo-900 hover:bg-kora-200 rounded-r-lg transition disabled:opacity-30"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-[10px] text-indigo-900/50">
                        Sub: {formatINR(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout CTA */}
          {items.length > 0 && (
            <div className="bg-white border-t border-kora-300 p-6 space-y-3">
              <div className="space-y-1.5 text-xs text-indigo-900/80">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold text-indigo-950">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery across India</span>
                  <span className="font-semibold text-indigo-950">
                    {shippingFee === 0 ? <span className="text-emerald-700">FREE</span> : formatINR(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-indigo-900/60">
                  <span>Estimated GST (included in price)</span>
                  <span>{formatINR(estimatedGst)}</span>
                </div>
              </div>

              <div className="border-t border-kora-200 pt-3 flex justify-between items-baseline">
                <span className="text-sm font-bold text-indigo-950">Total Payable</span>
                <span className="text-lg font-bold text-indigo-950">{formatINR(grandTotal)}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  href="/cart"
                  onClick={closeDrawer}
                  className="py-3 px-4 text-center rounded-xl text-xs font-semibold border border-indigo-900 text-indigo-950 hover:bg-kora-100 transition"
                >
                  View Full Bag
                </Link>
                <Link
                  href="/checkout"
                  onClick={closeDrawer}
                  className="py-3 px-4 text-center rounded-xl text-xs font-semibold bg-indigo-950 text-white hover:bg-indigo-900 transition flex items-center justify-center gap-1.5 shadow-md"
                >
                  Checkout <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-indigo-900/50 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>UPI, Cards, NetBanking (Razorpay) & Cash on Delivery</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
