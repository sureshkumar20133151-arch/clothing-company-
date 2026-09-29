"use client";

import React from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { CheckCircle2, Package, Truck, ArrowRight, ShieldCheck, Download } from "lucide-react";

function OrderSuccessContent() {
  const params = useParams();
  const searchParams = useSearchParams();

  const orderId = params?.orderId as string;
  const orderNumber =
    searchParams.get("orderNumber") ||
    `IND-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const method = searchParams.get("method") || "RAZORPAY";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-3">
        {method.includes("COD") ? "COD Order Confirmed" : "Payment Verified & Order Confirmed"}
      </div>

      <h1 className="text-3xl sm:text-4xl font-serif font-bold text-indigo-950 mb-2">
        Thank You for Supporting Indian Artisans!
      </h1>
      <p className="text-sm text-indigo-900/70 max-w-lg mx-auto">
        Your order has been forwarded to our master weaver cluster. We will carefully hand-pack your garments with zero plastic.
      </p>

      {/* Order Badge Card */}
      <div className="mt-8 bg-white rounded-3xl p-6 sm:p-8 border border-kora-300 shadow-sm text-left space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-6 border-b border-kora-200 gap-2">
          <div>
            <span className="text-[11px] text-indigo-900/60 uppercase font-semibold">Order Reference Number</span>
            <h3 className="text-xl font-mono font-bold text-indigo-950 tracking-wider">{orderNumber}</h3>
          </div>
          <span className="inline-block text-xs font-bold px-3 py-1 bg-indigo-50 text-indigo-900 rounded-lg border border-indigo-200">
            {method.includes("COD") ? "💵 Cash On Delivery" : "💳 Paid via Razorpay"}
          </span>
        </div>

        {/* Fulfillment Timeline */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-950">
            Indian Delivery Timeline
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-kora-50 border border-kora-200">
              <span className="font-bold text-indigo-950 block mb-1">1. Artisan Workshop</span>
              <p className="text-indigo-900/70 text-[11px]">Quality inspection & wooden steam press (Today)</p>
            </div>
            <div className="p-4 rounded-2xl bg-kora-50 border border-kora-200">
              <span className="font-bold text-indigo-950 block mb-1">2. Courier Dispatch</span>
              <p className="text-indigo-900/70 text-[11px]">Bluedart / Delhivery express tracking within 24-48 hrs</p>
            </div>
            <div className="p-4 rounded-2xl bg-kora-50 border border-kora-200">
              <span className="font-bold text-indigo-950 block mb-1">3. Doorstep Delivery</span>
              <p className="text-indigo-900/70 text-[11px]">Estimated arrival in 3-5 business days across India</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-kora-200 flex flex-col sm:flex-row justify-between items-center text-xs text-indigo-900/70 gap-3">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> GST Tax Invoice sent to your email
          </span>
          <span className="font-semibold text-indigo-950">Free 7-Day Doorstep Exchange Policy Applies</span>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-indigo-950 hover:bg-indigo-900 text-white text-xs font-semibold px-8 py-3.5 rounded-full transition shadow-md"
        >
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/account"
          className="inline-flex items-center gap-2 bg-white hover:bg-kora-100 text-indigo-950 border border-kora-300 text-xs font-semibold px-8 py-3.5 rounded-full transition"
        >
          View Order in My Account
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <React.Suspense fallback={<div className="py-20 text-center text-sm font-medium">Loading confirmation...</div>}>
      <OrderSuccessContent />
    </React.Suspense>
  );
}
