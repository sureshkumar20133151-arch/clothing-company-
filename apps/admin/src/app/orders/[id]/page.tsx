"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "../../../lib/api";
import { formatINR } from "../../../lib/utils";
import { OrderDTO } from "@indigo/shared";
import {
  ArrowLeft,
  Printer,
  ShieldCheck,
  Truck,
  CreditCard,
  User,
  MapPin,
  Calendar,
  Loader2,
} from "lucide-react";

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params?.id as string;

  const { data: apiData, isLoading } = useQuery({
    queryKey: ["admin-order", orderId],
    queryFn: async () => {
      return adminApi.get<OrderDTO>(`/orders/${orderId}`);
    },
  });

  const order = apiData?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500 mr-3" />
        <span className="text-sm">Fetching order tax invoice...</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <h2 className="text-lg font-bold text-white mb-2">Order Not Found</h2>
        <p className="text-xs text-slate-400 mb-6">Could not locate order ID #{orderId}</p>
        <Link
          href="/orders"
          className="text-xs font-semibold px-4 py-2 bg-amber-500 text-slate-950 rounded-xl"
        >
          &larr; Back to Orders
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Back button & Actions */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-800">
        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition"
        >
          <Printer className="w-4 h-4" /> Print GST Invoice
        </button>
      </div>

      {/* Invoice Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 print:bg-white print:text-black print:border-none print:shadow-none">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-serif font-bold text-amber-400 print:text-black">
              INDIGO & THREAD
            </h1>
            <p className="text-xs text-slate-400 mt-1">Artisanal Handloom Clothing Pvt. Ltd.</p>
            <p className="text-xs text-slate-400">Salem Weaver Cluster, Tamil Nadu, India</p>
            <p className="text-xs font-mono text-amber-500 print:text-black mt-1">
              GSTIN: 33AAAAA0000A1Z5 (State Code: 33)
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
              B2C Tax Invoice
            </span>
            <h2 className="text-xl font-mono font-bold text-white print:text-black">{order.orderNumber}</h2>
            <p className="text-xs text-slate-400 mt-1">
              Date: {new Date(order.createdAt).toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" })}
            </p>
            <div className="mt-2 inline-flex items-center gap-2">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-slate-700">
                {order.status}
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-slate-700">
                {order.paymentMethod} • {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Addresses & Logistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase tracking-wider mb-2">
              <MapPin className="w-4 h-4" /> Shipping Destination
            </div>
            <p className="font-semibold text-white print:text-black">{order.shippingAddress?.fullName}</p>
            <p className="text-slate-400">{order.shippingAddress?.addressLine1}</p>
            {order.shippingAddress?.addressLine2 && <p className="text-slate-400">{order.shippingAddress.addressLine2}</p>}
            <p className="text-slate-300 font-medium">
              {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}
            </p>
            <p className="text-slate-400 mt-2">Mobile: <strong className="text-white print:text-black">+91 {order.shippingAddress?.phone}</strong></p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-blue-400 font-bold uppercase tracking-wider mb-2">
              <Truck className="w-4 h-4" /> Indian Courier Logistics
            </div>
            <p className="text-slate-300">Courier: <strong className="text-white print:text-black">{order.courierPartner || "Bluedart Express"}</strong></p>
            <p className="text-slate-300">Tracking AWB: <strong className="text-amber-400 font-mono print:text-black">{order.trackingNumber || "Pending Assignment"}</strong></p>
            <p className="text-slate-400 text-[11px] mt-2">
              State Type:{" "}
              {order.shippingAddress?.state.toLowerCase() === "tamil nadu"
                ? "Intra-state Supply (CGST + SGST)"
                : `Inter-state Supply (IGST to ${order.shippingAddress?.state})`}
            </p>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] text-slate-400 uppercase tracking-wider border-b border-slate-800 bg-slate-950/40">
              <tr>
                <th className="py-3 px-3">Item Description</th>
                <th className="py-3 px-3">SKU</th>
                <th className="py-3 px-3 text-center">Qty</th>
                <th className="py-3 px-3 text-right">Unit Price</th>
                <th className="py-3 px-3 text-right">GST Slab</th>
                <th className="py-3 px-3 text-right">GST Amount</th>
                <th className="py-3 px-3 text-right">Total (INR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-white print:text-black block">{item.productName}</span>
                    <span className="text-[10px] text-slate-400 block">{item.variantInfo}</span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-400">{item.sku}</td>
                  <td className="py-3 px-3 text-center font-bold text-white print:text-black">{item.quantity}</td>
                  <td className="py-3 px-3 text-right">{formatINR(item.price)}</td>
                  <td className="py-3 px-3 text-right font-medium text-amber-400">{item.gstRate}%</td>
                  <td className="py-3 px-3 text-right">{formatINR(item.gstAmount)}</td>
                  <td className="py-3 px-3 text-right font-bold text-white print:text-black">
                    {formatINR(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals & Tax Calculation Breakdown */}
        <div className="flex justify-end pt-4 border-t border-slate-800">
          <div className="w-full max-w-xs space-y-2 text-xs text-slate-300">
            <div className="flex justify-between">
              <span>Gross Taxable Value:</span>
              <span className="font-semibold text-white print:text-black">{formatINR(order.taxableAmount)}</span>
            </div>

            {order.cgst > 0 && (
              <>
                <div className="flex justify-between text-slate-400">
                  <span>CGST (Tamil Nadu 2.5% or 6%):</span>
                  <span>{formatINR(order.cgst)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>SGST (Tamil Nadu 2.5% or 6%):</span>
                  <span>{formatINR(order.sgst)}</span>
                </div>
              </>
            )}

            {order.igst > 0 && (
              <div className="flex justify-between text-slate-400">
                <span>IGST (5% / 12%):</span>
                <span>{formatINR(order.igst)}</span>
              </div>
            )}

            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Discount Applied:</span>
                <span>-{formatINR(order.discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Delivery Charges:</span>
              <span className="font-semibold text-white print:text-black">
                {order.shippingFee === 0 ? "FREE" : formatINR(order.shippingFee)}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-700 flex justify-between items-baseline font-bold text-white print:text-black">
              <span className="text-sm">Invoice Grand Total:</span>
              <span className="text-xl font-mono text-amber-400 print:text-black">{formatINR(order.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
