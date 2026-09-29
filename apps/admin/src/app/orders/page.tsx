"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../../lib/api";
import { formatINR } from "../../lib/utils";
import { OrderDTO, OrderStatus, ORDER_STATUS } from "@indigo/shared";
import {
  ShoppingCart,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Filter,
  Eye,
  Edit3,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";

const DEMO_ORDERS: OrderDTO[] = [
  {
    id: "ord_1",
    orderNumber: "IND-2026-849120",
    userId: "u1",
    user: { id: "u1", name: "Ananya Sharma", email: "ananya@example.com", phone: "9876543210" },
    status: "PROCESSING",
    paymentMethod: "RAZORPAY",
    paymentStatus: "PAID",
    subtotal: 1890,
    discountAmount: 0,
    taxableAmount: 1687.5,
    cgst: 101.25,
    sgst: 101.25,
    igst: 0,
    totalGst: 202.5,
    shippingFee: 0,
    totalAmount: 1890,
    shippingAddress: {
      id: "a1",
      userId: "u1",
      fullName: "Ananya Sharma",
      phone: "9876543210",
      addressLine1: "Flat 402, Kaveri Apartments, Gandhi Nagar",
      city: "Chennai",
      state: "Tamil Nadu",
      postalCode: "600020",
      isDefault: true,
    },
    billingAddress: {
      id: "a1",
      userId: "u1",
      fullName: "Ananya Sharma",
      phone: "9876543210",
      addressLine1: "Flat 402, Kaveri Apartments, Gandhi Nagar",
      city: "Chennai",
      state: "Tamil Nadu",
      postalCode: "600020",
      isDefault: true,
    },
    items: [
      {
        id: "item1",
        orderId: "ord_1",
        productVariantId: "v1_m",
        productName: "The Nilgiri Indigo Handloom Shirt",
        variantInfo: "Size: M, Color: Deep Indigo",
        sku: "NIL-IND-M",
        price: 1890,
        quantity: 1,
        gstRate: 12,
        gstAmount: 202.5,
        total: 1890,
      },
    ],
    trackingNumber: "BLUEDART-89214710",
    courierPartner: "Bluedart Express",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "ord_2",
    orderNumber: "IND-2026-921430",
    userId: "u2",
    user: { id: "u2", name: "Vikram Malhotra", email: "vikram@example.com", phone: "9819283746" },
    status: "CONFIRMED",
    paymentMethod: "COD",
    paymentStatus: "PENDING",
    subtotal: 2490,
    discountAmount: 0,
    taxableAmount: 2223.2,
    cgst: 0,
    sgst: 0,
    igst: 266.8,
    totalGst: 266.8,
    shippingFee: 0,
    totalAmount: 2490,
    shippingAddress: {
      id: "a2",
      userId: "u2",
      fullName: "Vikram Malhotra",
      phone: "9819283746",
      addressLine1: "B-12, Green Park Extension",
      city: "New Delhi",
      state: "Delhi",
      postalCode: "110016",
      isDefault: true,
    },
    billingAddress: {
      id: "a2",
      userId: "u2",
      fullName: "Vikram Malhotra",
      phone: "9819283746",
      addressLine1: "B-12, Green Park Extension",
      city: "New Delhi",
      state: "Delhi",
      postalCode: "110016",
      isDefault: true,
    },
    items: [
      {
        id: "item2",
        orderId: "ord_2",
        productVariantId: "v2_m",
        productName: "Kaveri Jamdani Handloom A-Line Kurta",
        variantInfo: "Size: M, Color: Ivory White",
        sku: "KAV-JAM-M",
        price: 2490,
        quantity: 1,
        gstRate: 12,
        gstAmount: 266.8,
        total: 2490,
      },
    ],
    createdAt: new Date(Date.now() - 3600000),
    updatedAt: new Date(Date.now() - 3600000),
  },
];

function OrdersContent() {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrderForDispatch, setSelectedOrderForDispatch] = useState<OrderDTO | null>(null);

  // Dispatch modal form
  const [newStatus, setNewStatus] = useState<OrderStatus>("PROCESSING");
  const [courierPartner, setCourierPartner] = useState("Bluedart Express");
  const [trackingNumber, setTrackingNumber] = useState("");

  const { data: apiData, isLoading } = useQuery({
    queryKey: ["admin-orders", selectedStatus, searchQuery],
    queryFn: async () => {
      const params: Record<string, any> = {};
      if (selectedStatus !== "ALL") params.status = selectedStatus;
      if (searchQuery) params.search = searchQuery;
      return adminApi.get<OrderDTO[]>("/orders", params);
    },
  });

  const orders: OrderDTO[] = apiData?.data && apiData.data.length > 0 ? apiData.data : DEMO_ORDERS;

  // Filter client-side if fallback demo orders are used
  const filteredOrders = orders.filter((o) => {
    if (selectedStatus !== "ALL" && o.status !== selectedStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchNum = o.orderNumber.toLowerCase().includes(q);
      const matchCustomer = o.user?.name.toLowerCase().includes(q) || false;
      const matchEmail = o.user?.email.toLowerCase().includes(q) || false;
      if (!matchNum && !matchCustomer && !matchEmail) return false;
    }
    return true;
  });

  // Mutation to update order status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, data }: { orderId: string; data: any }) => {
      return adminApi.patch(`/orders/${orderId}/status`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      setSelectedOrderForDispatch(null);
    },
  });

  const handleOpenDispatchModal = (order: OrderDTO) => {
    setSelectedOrderForDispatch(order);
    setNewStatus(order.status === "CONFIRMED" ? "PROCESSING" : order.status);
    setCourierPartner(order.courierPartner || "Bluedart Express");
    setTrackingNumber(order.trackingNumber || "");
  };

  const handleUpdateStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForDispatch) return;

    updateStatusMutation.mutate({
      orderId: selectedOrderForDispatch.id,
      data: {
        status: newStatus,
        courierPartner: courierPartner || null,
        trackingNumber: trackingNumber || null,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Order Fulfillment & Logistics</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Process Indian customer shipments, generate courier tracking numbers & handle COD dispatch.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex overflow-x-auto gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          {["ALL", "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((s) => (
            <button
              key={s}
              onClick={() => setSelectedStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedStatus === s
                  ? "bg-amber-500 text-slate-950 shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search Order #, Customer, Email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] text-slate-400 uppercase tracking-wider bg-slate-950/60 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Customer & Contact</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Amount & Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Courier / AWB</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-500" />
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-amber-400 block">{o.orderNumber}</span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(o.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-white block">{o.user?.name || "Guest Customer"}</span>
                      <span className="text-[11px] text-slate-400 block">{o.user?.phone || o.shippingAddress?.phone}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-white block">{o.shippingAddress?.city}</span>
                      <span className="text-[10px] text-slate-400 block font-medium">
                        {o.shippingAddress?.state} ({o.shippingAddress?.postalCode})
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-white block">{formatINR(o.totalAmount)}</span>
                      <span className={`text-[10px] font-semibold ${o.paymentMethod === "COD" ? "text-amber-400" : "text-emerald-400"}`}>
                        {o.paymentMethod} • {o.paymentStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                          o.status === "DELIVERED"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : o.status === "SHIPPED"
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                            : o.status === "PROCESSING"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                            : o.status === "CONFIRMED"
                            ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
                            : "bg-slate-800 text-slate-400 border-slate-700"
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {o.trackingNumber ? (
                        <div>
                          <span className="text-white font-mono text-[11px] block">{o.trackingNumber}</span>
                          <span className="text-[10px] text-slate-400 block">{o.courierPartner}</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-500">Unassigned</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenDispatchModal(o)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold transition"
                      >
                        Status / AWB
                      </button>
                      <Link
                        href={`/orders/${o.id}`}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition inline-block"
                      >
                        Invoice
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dispatch / Update Status Modal */}
      {selectedOrderForDispatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Update Fulfillment & Tracking
                </h3>
                <span className="text-xs text-amber-400 font-mono">
                  {selectedOrderForDispatch.orderNumber}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrderForDispatch(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatusSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Order Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="CONFIRMED">CONFIRMED (Awaiting Packing)</option>
                  <option value="PROCESSING">PROCESSING (Artisan Steam Press & Packing)</option>
                  <option value="SHIPPED">SHIPPED (Handed to Courier - Sends Email)</option>
                  <option value="DELIVERED">DELIVERED (Doorstep Received)</option>
                  <option value="CANCELLED">CANCELLED</option>
                  <option value="RETURN_REQUESTED">RETURN_REQUESTED</option>
                  <option value="RETURNED">RETURNED</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Indian Courier Partner
                </label>
                <select
                  value={courierPartner}
                  onChange={(e) => setCourierPartner(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="Bluedart Express">Bluedart Express</option>
                  <option value="Delhivery Surface / Express">Delhivery Express</option>
                  <option value="Shiprocket">Shiprocket Prime</option>
                  <option value="DTDC India">DTDC India</option>
                  <option value="India Post Speed Post">India Post Speed Post</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Courier AWB / Tracking Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. BLUEDART-84910398"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  When marked as SHIPPED, an automated dispatch email will be sent to the customer with this AWB.
                </p>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForDispatch(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateStatusMutation.isPending}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow"
                >
                  {updateStatusMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Save & Notify"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <React.Suspense fallback={<div className="text-center py-20 text-slate-400">Loading orders...</div>}>
      <OrdersContent />
    </React.Suspense>
  );
}
