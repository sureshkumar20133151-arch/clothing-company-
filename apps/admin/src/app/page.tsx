"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "../lib/api";
import { formatINR } from "../lib/utils";
import { OrderDTO } from "@indigo/shared";
import {
  IndianRupee,
  ShoppingCart,
  Shirt,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Package,
  Truck,
  CheckCircle2,
  Clock,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch recent orders
  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ["admin-recent-orders"],
    queryFn: async () => {
      return adminApi.get<OrderDTO[]>("/orders", { limit: 5 });
    },
  });

  // Fetch inventory alerts
  const { data: inventoryData } = useQuery({
    queryKey: ["admin-inventory-summary"],
    queryFn: async () => {
      return adminApi.get("/inventory");
    },
  });

  const orders: OrderDTO[] = ordersData?.data || [];
  const lowStockCount = inventoryData?.data?.summary?.lowStockCount || 3;

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Operations Dashboard</h1>
        <p className="text-xs text-slate-400 mt-1">
          PAN-India fulfillment, artisan weaver dispatch queue & GST compliance overview.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Sales (INR)</span>
            <h3 className="text-2xl font-bold text-white mt-1">₹2,84,900</h3>
            <p className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +24.5% vs last month
            </p>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Awaiting Dispatch</span>
            <h3 className="text-2xl font-bold text-white mt-1">12 Orders</h3>
            <p className="text-[11px] text-amber-400 font-semibold mt-1">
              4 Express Chennai / Mumbai
            </p>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Low Stock SKUs</span>
            <h3 className="text-2xl font-bold text-white mt-1">{lowStockCount} Variants</h3>
            <Link href="/inventory" className="text-[11px] text-rose-400 hover:underline font-semibold mt-1 block">
              Restock in inventory &rarr;
            </Link>
          </div>
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Apparel GST Collected</span>
            <h3 className="text-2xl font-bold text-white mt-1">₹31,450</h3>
            <p className="text-[11px] text-slate-400 mt-1">5% & 12% Slabs Filed</p>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Orders & Dispatch Queue + Inventory Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Orders Queue */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" /> Recent Dispatch Queue
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Orders received across India</p>
            </div>
            <Link
              href="/orders"
              className="text-xs font-semibold text-amber-400 hover:underline flex items-center gap-1"
            >
              View All Orders <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Order Number</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">State</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No active orders found in the database.
                    </td>
                  </tr>
                ) : (
                  orders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-3 font-mono font-semibold text-amber-400">{o.orderNumber}</td>
                      <td className="py-3 px-3">{o.user?.name || "Customer"}</td>
                      <td className="py-3 px-3">{o.shippingAddress?.state || "Tamil Nadu"}</td>
                      <td className="py-3 px-3 font-semibold text-white">{formatINR(o.totalAmount)}</td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {o.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link
                          href={`/orders/${o.id}`}
                          className="text-xs font-semibold text-amber-400 hover:underline"
                        >
                          Fulfill &rarr;
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Quick Links & Artisanal Clusters */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white pb-2 border-b border-slate-800">
              Artisan Weaver Centers
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                <span className="font-bold text-white block">Salem, Tamil Nadu</span>
                <span className="text-[11px] text-slate-400">Pure handloom cotton shirts, korvai temple borders</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                <span className="font-bold text-white block">Phulia, West Bengal</span>
                <span className="text-[11px] text-slate-400">Fine 80s Jamdani weaves inlaid with bamboo shuttles</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                <span className="font-bold text-white block">Wardha, Maharashtra</span>
                <span className="text-[11px] text-slate-400">Solar-spun organic cotton slub yarn</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white pb-2 border-b border-slate-800">
              Quick Operations
            </h3>
            <div className="space-y-2">
              <Link
                href="/products/new"
                className="block w-full py-2.5 px-4 text-center rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition shadow"
              >
                + Add Handloom Garment
              </Link>
              <Link
                href="/inventory"
                className="block w-full py-2.5 px-4 text-center rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
              >
                Inspect Low Stock Variants
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
