"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { formatINR } from "../../lib/utils";
import { OrderDTO } from "@indigo/shared";
import {
  User,
  Package,
  MapPin,
  LogOut,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Truck,
} from "lucide-react";

export default function AccountPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: ordersData, isLoading: isOrdersLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: async () => {
      return api.get<OrderDTO[]>("/orders");
    },
    enabled: mounted && isAuthenticated,
  });

  if (!mounted) return null;

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <User className="w-12 h-12 text-kora-400 mx-auto mb-3" />
        <h2 className="text-xl font-serif font-bold text-indigo-950 mb-2">Sign in Required</h2>
        <p className="text-xs text-indigo-900/60 mb-6">
          Please log in to your account to view your past handloom orders and addresses.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="bg-indigo-950 text-white text-xs font-semibold px-6 py-3 rounded-full hover:bg-indigo-900 transition"
        >
          Sign In
        </button>
      </div>
    );
  }

  const orders: OrderDTO[] = ordersData?.data || [];

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-kora-300 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-indigo-950">
              Welcome, {user.name}
            </h1>
            <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-indigo-950 text-white">
              {user.role}
            </span>
          </div>
          <p className="text-xs text-indigo-900/60 mt-1">{user.email} • {user.phone || "No phone added"}</p>
        </div>

        <div className="flex gap-3">
          {(user.role === "admin" || user.role === "manager") && (
            <a
              href="http://localhost:3001"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 transition"
            >
              Open Operations Portal <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-white border border-kora-300 text-rose-700 hover:bg-rose-50 transition"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Orders List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-kora-200">
            <Package className="w-5 h-5 text-terracotta-500" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-950">
              Order History ({orders.length})
            </h2>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 border border-kora-300 text-center">
              <ShoppingBag className="w-12 h-12 text-kora-400 mx-auto mb-3" />
              <h3 className="text-sm font-serif font-bold text-indigo-950">No orders placed yet</h3>
              <p className="text-xs text-indigo-900/60 max-w-xs mx-auto mt-1 mb-6">
                Explore our handloom collection sourced directly from Tamil Nadu and Bengal master weavers.
              </p>
              <Link
                href="/shop"
                className="bg-indigo-950 text-white text-xs font-semibold px-6 py-2.5 rounded-full hover:bg-indigo-900 transition"
              >
                Browse Collection
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-kora-300 p-5 shadow-sm space-y-4"
                >
                  <div className="flex flex-wrap justify-between items-center pb-3 border-b border-kora-200 gap-2">
                    <div>
                      <span className="font-mono text-xs font-bold text-indigo-950">{order.orderNumber}</span>
                      <span className="text-[11px] text-indigo-900/50 block">
                        Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-900 border border-indigo-200">
                        {order.status}
                      </span>
                      <span className="text-xs font-bold text-indigo-950">
                        {formatINR(order.totalAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-xs">
                        <div>
                          <span className="font-medium text-indigo-950">{item.productName}</span>
                          <span className="text-[11px] text-indigo-900/60 block">{item.variantInfo} • Qty: {item.quantity}</span>
                        </div>
                        <span className="font-semibold text-indigo-950">{formatINR(item.total)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tax summary & address */}
                  <div className="pt-3 border-t border-kora-200 flex flex-wrap justify-between items-center text-[11px] text-indigo-900/70 gap-2">
                    <span>
                      Shipping to: <strong>{order.shippingAddress?.city}, {order.shippingAddress?.state}</strong>
                    </span>
                    <span className="text-indigo-950 font-medium">
                      GST Breakdown: Total Tax {formatINR(order.totalGst)} ({order.cgst > 0 ? "CGST + SGST" : "IGST"})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Profile & Artisanal Highlights */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-kora-300 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-950 pb-2 border-b border-kora-200">
              Account Overview
            </h3>

            <div className="text-xs space-y-2 text-indigo-900/80">
              <div className="flex justify-between">
                <span>Name:</span>
                <span className="font-semibold text-indigo-950">{user.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Email:</span>
                <span className="font-semibold text-indigo-950">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span>Mobile:</span>
                <span className="font-semibold text-indigo-950">{user.phone || "+91 (Not provided)"}</span>
              </div>
              <div className="flex justify-between">
                <span>Role:</span>
                <span className="font-semibold text-indigo-950 capitalize">{user.role}</span>
              </div>
            </div>
          </div>

          <div className="bg-kora-50 p-6 rounded-3xl border border-kora-300 space-y-3">
            <div className="flex items-center gap-2 text-indigo-950 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Indigo & Thread Guarantee</span>
            </div>
            <p className="text-xs text-indigo-900/70 leading-relaxed">
              Every purchase you make directly empowers handloom weavers in Salem, Chettinad, and Phulia. All garments are backed by our 7-day hassle-free doorstep size exchange.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
