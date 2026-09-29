"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation } from "@tanstack/react-query";
import { adminApi } from "../../../lib/api";
import { CLOTHING_SIZES, GENDERS, ClothingSize, Gender } from "@indigo/shared";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface VariantFormItem {
  sku: string;
  size: ClothingSize;
  colorName: string;
  colorHex: string;
  price: number;
  mrp: number;
  stock: number;
}

export default function NewProductPage() {
  const router = useRouter();

  // Basic Information
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [craftStory, setCraftStory] = useState("");
  const [fabricDetails, setFabricDetails] = useState("");
  const [careInstructions, setCareInstructions] = useState("");
  const [gender, setGender] = useState<Gender>("MEN");
  const [categoryId, setCategoryId] = useState("");
  const [hsnCode, setHsnCode] = useState("6205");

  // Images
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [images, setImages] = useState<Array<{ url: string; altText: string; isPrimary: boolean }>>([
    {
      url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80",
      altText: "Handloom Front View",
      isPrimary: true,
    },
  ]);

  // Variants Matrix
  const [variants, setVariants] = useState<VariantFormItem[]>([
    {
      sku: "ART-S",
      size: "S",
      colorName: "Deep Indigo",
      colorHex: "#1a2a4b",
      price: 1890,
      mrp: 2490,
      stock: 15,
    },
    {
      sku: "ART-M",
      size: "M",
      colorName: "Deep Indigo",
      colorHex: "#1a2a4b",
      price: 1890,
      mrp: 2490,
      stock: 20,
    },
    {
      sku: "ART-L",
      size: "L",
      colorName: "Deep Indigo",
      colorHex: "#1a2a4b",
      price: 1890,
      mrp: 2490,
      stock: 12,
    },
  ]);

  const [formError, setFormError] = useState<string | null>(null);

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      return adminApi.get("/categories");
    },
  });

  const categories = categoriesData?.data || [
    { id: "c1", name: "Men's Handloom Shirts" },
    { id: "c2", name: "Women's Handloom Kurtas" },
    { id: "c3", name: "Bengal & Salem Cotton Sarees" },
    { id: "c4", name: "Handcrafted Overlays & Stoles" },
  ];

  // Auto-generate slug from name
  const handleNameChange = (val: string) => {
    setName(val);
    const generated = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setSlug(generated);
  };

  // Image Upload handler (Base64 -> Cloudinary endpoint)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setFormError(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        try {
          const res = await adminApi.post("/upload/image", { image: reader.result });
          const newUrl = res.data.url;
          setImages([...images, { url: newUrl, altText: name || "Garment", isPrimary: images.length === 0 }]);
          setIsUploading(false);
        } catch (uploadErr: any) {
          setFormError(uploadErr.message || "Failed to upload image to Cloudinary");
          setIsUploading(false);
        }
      };
    } catch (err: any) {
      setFormError("Could not process local image file");
      setIsUploading(false);
    }
  };

  const handleAddDirectUrl = () => {
    if (!imageUrl.trim()) return;
    setImages([...images, { url: imageUrl.trim(), altText: name || "Handloom", isPrimary: images.length === 0 }]);
    setImageUrl("");
  };

  const handleAddVariant = () => {
    const newVariant: VariantFormItem = {
      sku: `${slug ? slug.toUpperCase().slice(0, 3) : "IND"}-${variants.length + 1}`,
      size: "M",
      colorName: "Natural Kora",
      colorHex: "#f4f1ea",
      price: 1490,
      mrp: 1990,
      stock: 10,
    };
    setVariants([...variants, newVariant]);
  };

  const handleRemoveVariant = (index: number) => {
    if (variants.length <= 1) return;
    setVariants(variants.filter((_, idx) => idx !== index));
  };

  const handleVariantChange = (index: number, field: keyof VariantFormItem, val: any) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: val };
    setVariants(updated);
  };

  // Create Product Mutation
  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      return adminApi.post("/products", payload);
    },
    onSuccess: () => {
      router.push("/products");
    },
    onError: (err: any) => {
      setFormError(err.message || "Failed to create product");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (images.length === 0) {
      setFormError("Please add at least one product image.");
      return;
    }

    if (variants.length === 0) {
      setFormError("Please configure at least one size variant.");
      return;
    }

    const payload = {
      name,
      slug,
      description,
      craftStory: craftStory || null,
      fabricDetails: fabricDetails || null,
      careInstructions: careInstructions || null,
      gender,
      hsnCode: hsnCode || "6205",
      categoryId: categoryId || categories[0]?.id,
      images,
      variants,
    };

    createMutation.mutate(payload);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Catalog
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight">Add New Handloom Piece</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Register artisanal cotton/linen garments with Indian GST rate slabs and size matrix.
          </p>
        </div>
      </div>

      {formError && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 border-b border-slate-800 pb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> 1. Garment Details & Artisanal Craft
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-300 mb-1">Product Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. The Chettinad Striped Short Kurta"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">URL Slug (lowercase-hyphenated) *</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 font-mono text-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Apparel Category *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                {categories.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Target Gender *</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="MEN">MEN</option>
                <option value="WOMEN">WOMEN</option>
                <option value="UNISEX">UNISEX</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Apparel HSN Code (GST Compliance) *</label>
              <input
                type="text"
                value={hsnCode}
                onChange={(e) => setHsnCode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 font-mono text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                6205 (Woven shirts), 6109 (Knitted tees), 5208 (Cotton sarees)
              </span>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-300 mb-1">Product Description *</label>
              <textarea
                rows={3}
                required
                placeholder="Describe silhouette, drape, breathability, and styling advice..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-300 mb-1">Weaver Origin & Craft Story</label>
              <textarea
                rows={2}
                placeholder="e.g. Woven by Salem artisan cooperative utilizing 60s count handloom cotton and natural vegetable madder dyes."
                value={craftStory}
                onChange={(e) => setCraftStory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Media / Cloudinary Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 border-b border-slate-800 pb-3 flex items-center gap-2">
            <ImageIcon className="w-4 h-4" /> 2. Product Images (Cloudinary CDN)
          </h2>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* File upload */}
              <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-slate-950 border-2 border-dashed border-slate-700 hover:border-amber-400 text-xs text-slate-300 cursor-pointer transition">
                <Upload className="w-4 h-4 text-amber-400" />
                <span>{isUploading ? "Uploading to Cloudinary..." : "Upload Photo to Cloudinary"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>

              {/* Or paste direct URL */}
              <div className="flex-1 flex gap-2">
                <input
                  type="url"
                  placeholder="Or enter direct image URL..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={handleAddDirectUrl}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Image Preview List */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 group"
                >
                  <img src={img.url} alt={img.altText} className="w-full h-full object-cover object-top" />
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, i) => i !== idx))}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-950/80 text-rose-400 opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  {img.isPrimary && (
                    <span className="absolute bottom-2 left-2 text-[10px] font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Variant Matrix Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              3. Size & Color Variant Matrix
            </h2>
            <button
              type="button"
              onClick={handleAddVariant}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:underline"
            >
              <Plus className="w-3.5 h-3.5" /> Add Size / Color Variant
            </button>
          </div>

          <div className="space-y-4">
            {variants.map((v, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-7 gap-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 items-end text-xs"
              >
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">SKU *</label>
                  <input
                    type="text"
                    required
                    value={v.sku}
                    onChange={(e) => handleVariantChange(idx, "sku", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 font-mono text-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Size *</label>
                  <select
                    value={v.size}
                    onChange={(e) => handleVariantChange(idx, "size", e.target.value as ClothingSize)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                  >
                    {CLOTHING_SIZES.map((sz) => (
                      <option key={sz} value={sz}>
                        {sz}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Color Name *</label>
                  <input
                    type="text"
                    required
                    value={v.colorName}
                    onChange={(e) => handleVariantChange(idx, "colorName", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={v.price}
                    onChange={(e) => handleVariantChange(idx, "price", Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">MRP (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={v.mrp}
                    onChange={(e) => handleVariantChange(idx, "mrp", Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Stock Units *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={v.stock}
                    onChange={(e) => handleVariantChange(idx, "stock", Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-semibold"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(idx)}
                    disabled={variants.length <= 1}
                    className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition disabled:opacity-20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex justify-end gap-4">
          <Link
            href="/products"
            className="py-3 px-6 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="py-3 px-8 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition flex items-center gap-2 shadow-lg disabled:opacity-50"
          >
            {createMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Publishing Piece...
              </>
            ) : (
              "Save & Publish to Storefront"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
