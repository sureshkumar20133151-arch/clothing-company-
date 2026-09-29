"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../../lib/api";
import { formatINR } from "../../lib/utils";
import { ProductDTO } from "@indigo/shared";
import {
  Shirt,
  PlusCircle,
  Search,
  Trash2,
  ExternalLink,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedGender, setSelectedGender] = useState("");

  const { data: apiData, isLoading } = useQuery({
    queryKey: ["admin-products", search, selectedGender],
    queryFn: async () => {
      const params: Record<string, any> = {};
      if (search) params.search = search;
      if (selectedGender) params.gender = selectedGender;
      return adminApi.get<ProductDTO[]>("/products", params);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return adminApi.delete(`/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });

  const products: ProductDTO[] = apiData?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Apparel Catalog & SKUs</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage handloom garments, size variants, HSN codes, and pricing.
          </p>
        </div>

        <Link
          href="/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition shadow"
        >
          <PlusCircle className="w-4 h-4" /> Add Handloom Piece
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2">
          {["", "MEN", "WOMEN", "UNISEX"].map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGender(g)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedGender === g
                  ? "bg-amber-500 text-slate-950"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {g === "" ? "All Genders" : g}
            </button>
          ))}
        </div>

        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search garment name, SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] text-slate-400 uppercase tracking-wider bg-slate-950/60 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Garment</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Gender</th>
                <th className="py-3 px-4">Variants</th>
                <th className="py-3 px-4">Price Range (₹)</th>
                <th className="py-3 px-4">Total Stock</th>
                <th className="py-3 px-4">HSN Code</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-500" />
                    Loading apparel catalog...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No garments found. Click "+ Add Handloom Piece" to create one.
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const minPrice = Math.min(...p.variants.map((v) => v.price));
                  const maxPrice = Math.max(...p.variants.map((v) => v.price));
                  const totalStock = p.variants.reduce((acc, v) => acc + v.stock, 0);

                  return (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0]?.url || "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=100&q=80"}
                            alt={p.name}
                            className="w-10 h-12 object-cover rounded-lg bg-slate-800 shrink-0 border border-slate-700"
                          />
                          <div>
                            <span className="font-semibold text-white block">{p.name}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{p.slug}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-300">{p.category?.name || "General"}</td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {p.gender}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-medium text-slate-300">
                        {p.variants.length} variant{p.variants.length === 1 ? "" : "s"}
                      </td>

                      <td className="py-3 px-4 font-bold text-white">
                        {minPrice === maxPrice
                          ? formatINR(minPrice)
                          : `${formatINR(minPrice)} - ${formatINR(maxPrice)}`}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`font-semibold ${
                            totalStock <= 5 ? "text-rose-400" : "text-emerald-400"
                          }`}
                        >
                          {totalStock} units
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-400">{p.hsnCode}</td>

                      <td className="py-3 px-4 text-right space-x-2">
                        <a
                          href={`http://localhost:3000/product/${p.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition inline-block"
                          title="Preview in Storefront"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete ${p.name}?`)) {
                              deleteMutation.mutate(p.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-400 transition"
                          title="Delete Garment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
