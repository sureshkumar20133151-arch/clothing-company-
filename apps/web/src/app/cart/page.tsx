"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "../../store/useCartStore";
import { formatINR } from "../../lib/utils";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
  CheckCircle2,
  XCircle,
  Truck,
} from "lucide-react";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [couponMessage, setCouponMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    getShippingFee,
    getGrandTotal,
    getEstimatedGST,
    couponCode,
    discountAmount,
    applyCoupon,
    removeCoupon,
  } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const subtotal = getSubtotal();
  const shippingFee = getShippingFee();
  const grandTotal = getGrandTotal();
  const estimatedGst = getEstimatedGST();
  const amountForFreeShipping = Math.max(0, 1500 - subtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponMessage(null);
    const code = couponInput.trim().toUpperCase();

    if (!code) return;

    if (code === "WELCOME10") {
      if (subtotal < 1000) {
        setCouponMessage({ type: "error", text: "Minimum order of ₹1,000 required for WELCOME10." });
        return;
      }
      const discount = Math.min(500, Math.round((subtotal * 10) / 100));
      applyCoupon(code, discount);
      setCouponMessage({ type: "success", text: `Coupon WELCOME10 applied! You saved ${formatINR(discount)}.` });
      setCouponInput("");
    } else if (code === "HANDLOOM500") {
      if (subtotal < 2500) {
        setCouponMessage({ type: "error", text: "Minimum order of ₹2,500 required for HANDLOOM500." });
        return;
      }
      applyCoupon(code, 500);
      setCouponMessage({ type: "success", text: `Coupon HANDLOOM500 applied! You saved ₹500.` });
      setCouponInput("");
    } else {
      setCouponMessage({ type: "error", text: "Invalid coupon code. Try WELCOME10 or HANDLOOM500." });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="flex items-center justify-between pb-6 border-b border-kora-300 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-indigo-950">
            Your Handloom Shopping Bag
          </h1>
          <p className="text-xs text-indigo-900/60 mt-1">
            {items.length} unique handcrafted piece{items.length === 1 ? "" : "s"}
          </p>
        </div>
        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs text-indigo-900/60 hover:text-rose-600 transition font-medium"
          >
            Clear Bag
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-kora-300 p-8">
          <ShoppingBag className="w-16 h-16 text-kora-400 mx-auto mb-4 stroke-[1.2]" />
          <h2 className="text-lg font-serif font-bold text-indigo-950">Your bag is empty</h2>
          <p className="text-xs text-indigo-900/60 max-w-sm mx-auto mt-2 mb-8 leading-relaxed">
            Support traditional Indian weavers by shopping authentic handloom cotton shirts, kurtas, and sarees.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-indigo-950 hover:bg-indigo-900 text-white text-xs font-semibold px-8 py-3.5 rounded-full transition shadow-md"
          >
            Explore Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Free shipping banner */}
            <div className="p-4 bg-white rounded-2xl border border-kora-300 shadow-sm">
              {amountForFreeShipping > 0 ? (
                <div>
                  <p className="text-xs text-indigo-900 font-medium">
                    Add <strong className="text-indigo-950 font-bold">{formatINR(amountForFreeShipping)}</strong> more to unlock{" "}
                    <span className="text-terracotta-600 font-bold">Free Pan-India Delivery</span>!
                  </p>
                  <div className="w-full bg-kora-200 h-2 rounded-full mt-2.5 overflow-hidden">
                    <div
                      className="bg-indigo-900 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (subtotal / 1500) * 100)}%` }}
                    />
                  </div>
                </div>
              ) : (
                <p className="text-xs text-emerald-800 font-semibold flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  Your order qualifies for Free Standard Delivery across India!
                </p>
              )}
            </div>

            {/* List */}
            {items.map((item) => (
              <div
                key={item.variantId}
                className="flex gap-4 sm:gap-6 p-4 sm:p-5 bg-white rounded-2xl border border-kora-300 shadow-sm"
              >
                <div className="relative w-24 sm:w-28 aspect-[3/4] bg-kora-100 rounded-xl overflow-hidden shrink-0 border border-kora-200">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <Link
                        href={`/product/${item.productSlug}`}
                        className="font-serif text-sm sm:text-base font-bold text-indigo-950 hover:underline"
                      >
                        {item.productName}
                      </Link>
                      <button
                        onClick={() => removeItem(item.variantId)}
                        className="text-indigo-900/40 hover:text-rose-600 transition p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs text-indigo-900/70 mt-1">
                      <span>Size: <strong>{item.size}</strong></span>
                      <span>•</span>
                      <span>Color: <strong>{item.colorName}</strong></span>
                    </div>

                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-sm sm:text-base font-bold text-indigo-950">
                        {formatINR(item.price)}
                      </span>
                      {item.mrp > item.price && (
                        <span className="text-xs text-indigo-900/40 line-through">
                          {formatINR(item.mrp)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-kora-200">
                    <div className="flex items-center border border-kora-300 rounded-xl bg-kora-50">
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        className="p-1.5 text-indigo-950 hover:bg-kora-200 rounded-l-xl transition"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-indigo-950">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        disabled={item.quantity >= item.maxStock}
                        className="p-1.5 text-indigo-950 hover:bg-kora-200 rounded-r-xl transition disabled:opacity-30"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-indigo-950">
                        {formatINR(item.price * item.quantity)}
                      </span>
                      <span className="block text-[10px] text-indigo-900/50">Incl. GST</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary & Coupon */}
          <div className="space-y-6">
            {/* Coupon Code Input */}
            <div className="bg-white p-6 rounded-3xl border border-kora-300 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-950 flex items-center gap-1.5 mb-3">
                <Tag className="w-4 h-4 text-terracotta-500" /> Apply Promo Code
              </h3>

              {couponCode ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-bold text-emerald-900">{couponCode}</span>
                      <span className="block text-[10px] text-emerald-700">Applied: -{formatINR(discountAmount)}</span>
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-rose-600 hover:underline font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. WELCOME10"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 bg-kora-50 border border-kora-300 rounded-xl px-3 py-2 text-xs uppercase font-semibold text-indigo-950 focus:outline-none focus:ring-1 focus:ring-indigo-900"
                    />
                    <button
                      type="submit"
                      className="bg-indigo-950 hover:bg-indigo-900 text-white text-xs font-semibold px-4 py-2 rounded-xl transition"
                    >
                      Apply
                    </button>
                  </div>
                  <p className="text-[10px] text-indigo-900/50">
                    Try <strong>WELCOME10</strong> (10% off &gt; ₹1000) or <strong>HANDLOOM500</strong> (₹500 off &gt; ₹2500)
                  </p>
                </form>
              )}

              {couponMessage && (
                <div
                  className={`mt-3 p-2.5 rounded-xl text-xs font-medium flex items-center gap-1.5 ${
                    couponMessage.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-rose-50 text-rose-800 border border-rose-200"
                  }`}
                >
                  {couponMessage.type === "success" ? (
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 shrink-0" />
                  )}
                  <span>{couponMessage.text}</span>
                </div>
              )}
            </div>

            {/* Bill Summary */}
            <div className="bg-white p-6 rounded-3xl border border-kora-300 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-950 pb-2 border-b border-kora-200">
                Order Bill Summary (INR)
              </h3>

              <div className="space-y-2 text-xs text-indigo-900/80">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold text-indigo-950">{formatINR(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount Coupon ({couponCode})</span>
                    <span>-{formatINR(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Delivery across India</span>
                  <span className="font-semibold text-indigo-950">
                    {shippingFee === 0 ? <span className="text-emerald-700">FREE</span> : formatINR(shippingFee)}
                  </span>
                </div>

                <div className="flex justify-between text-[11px] text-indigo-900/60 pt-1 border-t border-dashed border-kora-200">
                  <span>Estimated Indian GST (included in price)</span>
                  <span>{formatINR(estimatedGst)}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-kora-300 flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-bold text-indigo-950">Total Payable</span>
                  <span className="block text-[10px] text-indigo-900/50">All Indian taxes included</span>
                </div>
                <span className="text-2xl font-serif font-bold text-indigo-950">
                  {formatINR(grandTotal)}
                </span>
              </div>

              <Link
                href="/checkout"
                className="w-full py-4 px-6 rounded-2xl bg-indigo-950 hover:bg-indigo-900 text-white text-sm font-semibold transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg mt-4"
              >
                Proceed to Indian Checkout <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-indigo-900/60 pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Encrypted Razorpay UPI / Cards & COD Available</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
