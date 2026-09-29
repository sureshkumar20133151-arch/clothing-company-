"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../../lib/api";
import { formatINR } from "../../lib/utils";
import {
  Warehouse,
  AlertTriangle,
  Plus,
  Minus,
  CheckCircle2,
  Search,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface VariantInventoryItem {
  id: string;
  sku: string;
  size: string;
  colorName: string;
  colorHex: string;
  price: number;
  stock: number;
  updatedAt: string;
  product: {
    id: string;
    name: string;
    slug: string;
    category?: { id: string; name: string };
  };
}

export default function InventoryPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterLowOnly, setFilterLowOnly] = useState(false);

  const { data: apiData, isLoading } = useQuery({
    queryKey: ["admin-inventory"],
    queryFn: async () => {
      return adminApi.get("/inventory");
    },
  });

  const variants: VariantInventoryItem[] = apiData?.data?.variants || [];
  const summary = apiData?.data?.summary || { totalVariants: 0, lowStockCount: 0, outOfStockCount: 0 };

  // Adjust Stock Mutation
  const adjustMutation = useMutation({
    mutationFn: async ({ variantId, delta }: { variantId: string; delta: number }) => {
      return adminApi.patch(`/inventory/${variantId}/adjust`, { delta });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-inventory"] });
    },
  });

  const filteredVariants = variants.filter((v) => {
    if (filterLowOnly && v.stock > 5) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchName = v.product.name.toLowerCase().includes(q);
      const matchSku = v.sku.toLowerCase().includes(q);
      const matchColor = v.colorName.toLowerCase().includes(q);
      if (!matchName && !matchSku && !matchColor) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Inventory & Stock Control</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor workshop stock levels, restock weaver clusters, and prevent backorders.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Tracked SKUs</span>
          <h3 className="text-2xl font-bold text-white mt-1">{summary.totalVariants || variants.length}</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Across Salem & Bengal workshops</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-400">Critical Low Stock (≤ 5)</span>
          <h3 className="text-2xl font-bold text-rose-400 mt-1">{summary.lowStockCount}</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Immediate loom replenishment needed</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">Out of Stock (0)</span>
          <h3 className="text-2xl font-bold text-amber-400 mt-1">{summary.outOfStockCount}</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Temporarily delisted on storefront</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setFilterLowOnly(!filterLowOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              filterLowOnly
                ? "bg-rose-500 text-white shadow"
                : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Show Critical Low Stock (≤ 5)</span>
          </button>
        </div>

        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search garment, SKU, color..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] text-slate-400 uppercase tracking-wider bg-slate-950/60 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Garment Title</th>
                <th className="py-3 px-4">SKU Code</th>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Color</th>
                <th className="py-3 px-4">Unit Price</th>
                <th className="py-3 px-4 text-center">Current Stock</th>
                <th className="py-3 px-4">Stock Status</th>
                <th className="py-3 px-4 text-right">Quick Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-500" />
                    Loading inventory matrix...
                  </td>
                </tr>
              ) : filteredVariants.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No variants match your search filter.
                  </td>
                </tr>
              ) : (
                filteredVariants.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4">
                      <span className="font-semibold text-white block">{v.product.name}</span>
                      <span className="text-[10px] text-slate-500">{v.product.category?.name || "General"}</span>
                    </td>

                    <td className="py-3 px-4 font-mono font-semibold text-amber-400">{v.sku}</td>

                    <td className="py-3 px-4">
                      <span className="font-bold px-2 py-0.5 rounded bg-slate-800 text-white border border-slate-700">
                        {v.size}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-3 h-3 rounded-full border border-slate-700 shrink-0"
                          style={{ backgroundColor: v.colorHex }}
                        />
                        <span>{v.colorName}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-bold text-white">{formatINR(v.price)}</td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-sm font-bold ${
                          v.stock === 0
                            ? "text-rose-500 font-extrabold"
                            : v.stock <= 5
                            ? "text-rose-400"
                            : "text-emerald-400"
                        }`}
                      >
                        {v.stock}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {v.stock === 0 ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-950/60 text-rose-400 border border-rose-800">
                          Out of Stock
                        </span>
                      ) : v.stock <= 5 ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-400 border border-amber-800 flex items-center gap-1 w-fit">
                          <AlertTriangle className="w-3 h-3" /> Low Stock
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800">
                          In Stock
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => adjustMutation.mutate({ variantId: v.id, delta: -1 })}
                          disabled={v.stock <= 0 || adjustMutation.isPending}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30"
                          title="Decrease 1"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => adjustMutation.mutate({ variantId: v.id, delta: 1 })}
                          disabled={adjustMutation.isPending}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                          title="Increase 1"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => adjustMutation.mutate({ variantId: v.id, delta: 10 })}
                          disabled={adjustMutation.isPending}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-400 font-bold text-[10px] transition ml-1"
                          title="Restock +10 units"
                        >
                          +10
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
