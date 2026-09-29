"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../../lib/api";
import {
  Ticket,
  Plus,
  Trash2,
  Calendar,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  Tag,
  Percent,
} from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number | null;
  usageLimit?: number | null;
  usageCount: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string | null;
  createdAt: string;
}

export default function CouponsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"PERCENTAGE" | "FIXED">("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState("");
  const [minOrderAmount, setMinOrderAmount] = useState("");
  const [maxDiscountAmount, setMaxDiscountAmount] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [endDate, setEndDate] = useState("");
  const [formError, setFormError] = useState("");

  const { data: coupons, isLoading, error } = useQuery<Coupon[]>({
    queryKey: ["admin-coupons"],
    queryFn: async () => {
      const res = await adminApi.get<Coupon[]>("/coupons");
      return res.data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      return adminApi.post("/coupons", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      setIsModalOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      setFormError(err.message || "Failed to create coupon");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return adminApi.delete(`/coupons/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
    },
    onError: (err: any) => {
      alert(err.message || "Failed to delete coupon");
    },
  });

  const resetForm = () => {
    setCode("");
    setDiscountType("PERCENTAGE");
    setDiscountValue("");
    setMinOrderAmount("");
    setMaxDiscountAmount("");
    setUsageLimit("");
    setEndDate("");
    setFormError("");
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!code.trim()) {
      setFormError("Coupon code is required");
      return;
    }
    if (!discountValue || Number(discountValue) <= 0) {
      setFormError("Valid discount value is required");
      return;
    }

    createMutation.mutate({
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      minOrderAmount: minOrderAmount ? Number(minOrderAmount) : 0,
      maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : undefined,
      usageLimit: usageLimit ? Number(usageLimit) : undefined,
      endDate: endDate ? new Date(endDate).toISOString() : undefined,
    });
  };

  const handleDelete = (id: string, couponCode: string) => {
    if (confirm(`Are you sure you want to deactivate and remove coupon "${couponCode}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white flex items-center gap-2.5">
            <Ticket className="w-6 h-6 text-amber-400" />
            Promo Coupons & Discounts
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Create promotional codes and festive discounts across the Indian handloom storefront.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Promo Code</span>
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>Failed to load coupons. Please ensure your admin session is active.</span>
        </div>
      )}

      {/* Coupons Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin text-amber-400 mx-auto mb-2" />
            <span className="text-xs">Loading promotional vouchers...</span>
          </div>
        ) : coupons?.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Tag className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-white">No Coupons Configured</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Create your first promotional discount code like "WELCOME10" or "FESTIVE500".
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/60 uppercase font-semibold text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Coupon Code</th>
                  <th className="py-3.5 px-4">Discount</th>
                  <th className="py-3.5 px-4">Min Order</th>
                  <th className="py-3.5 px-4">Redemptions</th>
                  <th className="py-3.5 px-4">Expiry Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {coupons?.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                      {coupon.code}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {coupon.discountType === "PERCENTAGE" ? (
                        <span>
                          {coupon.discountValue}% OFF
                          {coupon.maxDiscountAmount && (
                            <span className="text-slate-400 text-[10px] ml-1">
                              (Up to ₹{coupon.maxDiscountAmount})
                            </span>
                          )}
                        </span>
                      ) : (
                        <span>₹{coupon.discountValue} FLAT OFF</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {coupon.minOrderAmount > 0 ? `₹${coupon.minOrderAmount}` : "None"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-200">{coupon.usageCount}</span>
                      {coupon.usageLimit && (
                        <span className="text-slate-500"> / {coupon.usageLimit}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 flex items-center gap-1.5">
                      {coupon.endDate ? (
                        <>
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>{new Date(coupon.endDate).toLocaleDateString("en-IN")}</span>
                        </>
                      ) : (
                        <span>No Expiry</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {coupon.isActive ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                          <CheckCircle className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                          <XCircle className="w-3 h-3" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(coupon.id, coupon.code)}
                        className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/60 hover:text-rose-300 transition"
                        title="Delete coupon"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl text-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Ticket className="w-4 h-4 text-amber-400" />
                New Promotional Code
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500 hover:text-slate-300 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              {/* Code */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HANDLOOM15, FESTIVE500"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full text-xs font-mono uppercase px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-amber-400 text-white"
                />
              </div>

              {/* Discount Type & Value */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Discount Type
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-amber-400 text-white"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Value * ({discountType === "PERCENTAGE" ? "%" : "₹"})
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder={discountType === "PERCENTAGE" ? "10" : "500"}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-amber-400 text-white"
                  />
                </div>
              </div>

              {/* Min Order & Max Discount */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Min Order (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-amber-400 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Max Discount (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="No cap"
                    disabled={discountType === "FIXED"}
                    value={maxDiscountAmount}
                    onChange={(e) => setMaxDiscountAmount(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-amber-400 text-white disabled:opacity-40"
                  />
                </div>
              </div>

              {/* Usage Limit & Expiry */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Total Redemptions
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Unlimited"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-amber-400 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Valid Until
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-amber-400 text-white"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow"
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Create Code</span>
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
