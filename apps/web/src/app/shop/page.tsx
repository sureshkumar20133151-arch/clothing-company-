"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { ProductCard } from "../../components/products/ProductCard";
import { ProductDTO, CLOTHING_SIZES, GENDERS } from "@indigo/shared";
import { Filter, SlidersHorizontal, Loader2, Sparkles, Search, X } from "lucide-react";

// Curated fallback products for immediate zero-friction preview even before DB connection
const DEMO_PRODUCTS: ProductDTO[] = [
  {
    id: "p1",
    name: "The Nilgiri Indigo Handloom Shirt",
    slug: "the-nilgiri-indigo-handloom-shirt",
    description: "Hand-dyed in authentic fermented plant indigo, this relaxed shirt is woven on traditional wooden pit-looms in Salem, Tamil Nadu.",
    craftStory: "Woven by our weaver cooperative in Salem, Tamil Nadu with 60s count pure handspun organic cotton yarn.",
    hsnCode: "6205",
    gender: "MEN",
    status: "PUBLISHED",
    isFeatured: true,
    categoryId: "c1",
    category: {
      id: "c1",
      name: "Men's Handloom Shirts",
      slug: "mens-handloom-shirts",
      gender: "MEN",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    images: [
      {
        id: "img1",
        productId: "p1",
        url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80",
        altText: "The Nilgiri Indigo Handloom Shirt",
        isPrimary: true,
        displayOrder: 1,
      },
      {
        id: "img1_2",
        productId: "p1",
        url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80",
        altText: "Texture detail",
        isPrimary: false,
        displayOrder: 2,
      },
    ],
    variants: [
      { id: "v1_s", productId: "p1", sku: "NIL-IND-S", size: "S", colorName: "Deep Indigo", colorHex: "#1a2a4b", price: 1890, mrp: 2490, stock: 15 },
      { id: "v1_m", productId: "p1", sku: "NIL-IND-M", size: "M", colorName: "Deep Indigo", colorHex: "#1a2a4b", price: 1890, mrp: 2490, stock: 25 },
      { id: "v1_l", productId: "p1", sku: "NIL-IND-L", size: "L", colorName: "Deep Indigo", colorHex: "#1a2a4b", price: 1890, mrp: 2490, stock: 20 },
      { id: "v1_xl", productId: "p1", sku: "NIL-IND-XL", size: "XL", colorName: "Deep Indigo", colorHex: "#1a2a4b", price: 1890, mrp: 2490, stock: 10 },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "p2",
    name: "Kaveri Jamdani Handloom A-Line Kurta",
    slug: "kaveri-jamdani-handloom-aline-kurta",
    description: "Flowing silhouette crafted with pure organic cotton. Each Jamdani motif is inlaid by hand on the wooden loom by master weavers in Bengal.",
    craftStory: "Crafted in Phulia, West Bengal using fine 80s count handspun yarn with supplementary weft bamboo needle craft.",
    hsnCode: "6204",
    gender: "WOMEN",
    status: "PUBLISHED",
    isFeatured: true,
    categoryId: "c2",
    category: {
      id: "c2",
      name: "Women's Handloom Kurtas",
      slug: "womens-handloom-kurtas",
      gender: "WOMEN",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    images: [
      {
        id: "img2",
        productId: "p2",
        url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80",
        altText: "Kaveri Jamdani Kurta",
        isPrimary: true,
        displayOrder: 1,
      },
      {
        id: "img2_2",
        productId: "p2",
        url: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=80",
        altText: "Detail weave",
        isPrimary: false,
        displayOrder: 2,
      },
    ],
    variants: [
      { id: "v2_s", productId: "p2", sku: "KAV-JAM-S", size: "S", colorName: "Ivory White", colorHex: "#faf8f5", price: 2490, mrp: 3290, stock: 14 },
      { id: "v2_m", productId: "p2", sku: "KAV-JAM-M", size: "M", colorName: "Ivory White", colorHex: "#faf8f5", price: 2490, mrp: 3290, stock: 22 },
      { id: "v2_l", productId: "p2", sku: "KAV-JAM-L", size: "L", colorName: "Ivory White", colorHex: "#faf8f5", price: 2490, mrp: 3290, stock: 16 },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "p3",
    name: "Salem Temple Border Cotton Saree",
    slug: "salem-temple-border-cotton-saree",
    description: "6.2 meters of authentic Tamil Nadu handloom drape with korvai interlock temple borders in terracotta madder and natural unbleached cotton body.",
    craftStory: "Three-shuttle interlock weaving technique from Salem, Tamil Nadu with complimentary unstitched blouse piece.",
    hsnCode: "5208",
    gender: "WOMEN",
    status: "PUBLISHED",
    isFeatured: true,
    categoryId: "c3",
    category: {
      id: "c3",
      name: "Bengal & Salem Cotton Sarees",
      slug: "bengal-salem-cotton-sarees",
      gender: "WOMEN",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    images: [
      {
        id: "img3",
        productId: "p3",
        url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80",
        altText: "Salem Temple Border Saree",
        isPrimary: true,
        displayOrder: 1,
      },
    ],
    variants: [
      { id: "v3_free", productId: "p3", sku: "SLM-SAR-RAW", size: "FREE_SIZE", colorName: "Terracotta & Natural", colorHex: "#b3543b", price: 3490, mrp: 4500, stock: 10 },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "p4",
    name: "Hand-Spun Organic Cotton Everyday Tee",
    slug: "handspun-organic-cotton-everyday-tee",
    description: "Lightweight textured slub cotton pocket t-shirt dyed with natural herbal extracts. Under ₹1,000 for standard 5% GST bracket.",
    craftStory: "Solar-spun handloom cotton yarn from Wardha, dyed with natural tea leaf extract and iron water.",
    hsnCode: "6109",
    gender: "UNISEX",
    status: "PUBLISHED",
    isFeatured: false,
    categoryId: "c4",
    category: {
      id: "c4",
      name: "Handcrafted Overlays & Stoles",
      slug: "handcrafted-overlays-stoles",
      gender: "UNISEX",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    images: [
      {
        id: "img4",
        productId: "p4",
        url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80",
        altText: "Handspun Organic Cotton Everyday Tee",
        isPrimary: true,
        displayOrder: 1,
      },
    ],
    variants: [
      { id: "v4_s", productId: "p4", sku: "TEE-SAG-S", size: "S", colorName: "Earth Sage", colorHex: "#8a9a86", price: 890, mrp: 1290, stock: 30 },
      { id: "v4_m", productId: "p4", sku: "TEE-SAG-M", size: "M", colorName: "Earth Sage", colorHex: "#8a9a86", price: 890, mrp: 1290, stock: 45 },
      { id: "v4_l", productId: "p4", sku: "TEE-SAG-L", size: "L", colorName: "Earth Sage", colorHex: "#8a9a86", price: 890, mrp: 1290, stock: 35 },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const initialGender = searchParams.get("gender") || "";
  const initialCategory = searchParams.get("category") || "";
  const initialQuery = searchParams.get("q") || "";
  const isFeaturedFilter = searchParams.get("featured") === "true";
  const isOnSaleFilter = searchParams.get("onSale") === "true";
  const initialPriceBracket = searchParams.get("priceBracket") || "ALL";
  const initialSort = searchParams.get("sort") || "newest";

  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [selectedGender, setSelectedGender] = useState<string>(initialGender);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [priceBracket, setPriceBracket] = useState<string>(initialPriceBracket);
  const [sortBy, setSortBy] = useState<string>(initialSort);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
    if (searchParams.get("gender")) setSelectedGender(searchParams.get("gender") || "");
    if (searchParams.get("priceBracket")) setPriceBracket(searchParams.get("priceBracket") || "ALL");
    if (searchParams.get("sort")) setSortBy(searchParams.get("sort") || "newest");
  }, [searchParams]);

  // Fetch real data from API with fallback to demo products
  const { data: apiData, isLoading } = useQuery({
    queryKey: ["products", selectedGender, selectedSize, priceBracket, sortBy, initialCategory, searchQuery, isFeaturedFilter, isOnSaleFilter],
    queryFn: async () => {
      const params: Record<string, any> = { sortBy };
      if (selectedGender) params.gender = selectedGender;
      if (selectedSize) params.size = selectedSize;
      if (initialCategory) params.category = initialCategory;
      if (searchQuery) params.q = searchQuery;
      if (isFeaturedFilter) params.isFeatured = true;

      if (priceBracket === "UNDER_1000") {
        params.maxPrice = 1000;
      } else if (priceBracket === "1000_2000" || priceBracket === "1000_2500") {
        params.minPrice = 1001;
        params.maxPrice = 2500;
      } else if (priceBracket === "ABOVE_2500" || priceBracket === "ABOVE_3000") {
        params.minPrice = 2501;
      }

      if (searchQuery) {
        return api.get<ProductDTO[]>("/search", params);
      }
      return api.get<ProductDTO[]>("/products", params);
    },
    staleTime: 60 * 1000,
  });

  const products: ProductDTO[] = Array.isArray(apiData?.data) ? apiData.data : DEMO_PRODUCTS;

  // Filter client-side if fallback data is in use or extra client params
  const filteredProducts = products.filter((p) => {
    if (isFeaturedFilter && !p.isFeatured) return false;
    if (isOnSaleFilter) {
      const hasDiscount = p.variants.some((v) => v.mrp && v.mrp > v.price);
      if (!hasDiscount) return false;
    }
    if (initialCategory) {
      const matchCat =
        p.category?.slug === initialCategory ||
        (p.category?.name && p.category.name.toLowerCase().includes(initialCategory.toLowerCase()));
      if (!matchCat) return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.craftStory && p.craftStory.toLowerCase().includes(q)) ||
        (p.category?.name && p.category.name.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (selectedGender && p.gender !== selectedGender && p.gender !== "UNISEX") return false;
    if (selectedSize && !p.variants.some((v) => v.size === selectedSize)) return false;
    const minPrice = Math.min(...p.variants.map((v) => v.price));
    if (priceBracket === "UNDER_1000" && minPrice > 1000) return false;
    if ((priceBracket === "1000_2500" || priceBracket === "1000_2000") && (minPrice < 1000 || minPrice > 2500)) return false;
    if ((priceBracket === "ABOVE_2500" || priceBracket === "ABOVE_3000") && minPrice < 2500) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Title & Header */}
      <div className="border-b border-kora-300 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100/80 text-indigo-900 text-[11px] font-semibold tracking-wider uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5 text-terracotta-500" />
            Pure Indian Handloom & Natural Dyes
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-indigo-950">
            {searchQuery
              ? `Search: \u201C${searchQuery}\u201D`
              : selectedGender === "MEN"
              ? "Men's Artisanal Handloom"
              : selectedGender === "WOMEN"
              ? "Women's Kurtas & Sarees"
              : "All Artisanal Apparel"}
          </h1>
          {searchQuery && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-indigo-900/60 font-medium">Filtering by search query:</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold">
                &ldquo;{searchQuery}&rdquo;
                <button
                  onClick={() => setSearchQuery("")}
                  className="hover:text-rose-600 transition"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            </div>
          )}
          <p className="text-sm text-indigo-900/70 mt-1 max-w-xl">
            Sourced directly from certified handloom weaving clusters in Tamil Nadu, Bengal, and Andhra Pradesh.
          </p>
        </div>

        {/* Sort & Mobile filter trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-kora-300 text-xs font-semibold text-indigo-950"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>

          <div className="flex items-center gap-2 text-xs text-indigo-950">
            <span className="text-indigo-900/60 font-medium hidden sm:inline">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-kora-300 rounded-xl px-3 py-2 text-xs font-semibold text-indigo-950 focus:outline-none focus:ring-1 focus:ring-indigo-900"
            >
              <option value="newest">Latest Arrivals</option>
              <option value="price_asc">Price: Low to High (₹)</option>
              <option value="price_desc">Price: High to Low (₹)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className={`md:block ${mobileFilterOpen ? "block" : "hidden"} space-y-6`}>
          <div className="bg-white rounded-2xl p-6 border border-kora-300 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-kora-200 pb-3">
              <h2 className="text-sm font-bold text-indigo-950 uppercase tracking-wider flex items-center gap-2">
                <Filter className="w-4 h-4 text-terracotta-500" /> Filters
              </h2>
              {(selectedGender || selectedSize || priceBracket !== "ALL") && (
                <button
                  onClick={() => {
                    setSelectedGender("");
                    setSelectedSize("");
                    setPriceBracket("ALL");
                  }}
                  className="text-xs text-terracotta-600 hover:underline font-medium"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Gender Filter */}
            <div>
              <h3 className="text-xs font-bold text-indigo-950 uppercase tracking-wider mb-2">Category</h3>
              <div className="space-y-1.5">
                {[
                  { label: "All Garments", value: "" },
                  { label: "Men's Handloom", value: "MEN" },
                  { label: "Women's Collection", value: "WOMEN" },
                  { label: "Unisex & Stoles", value: "UNISEX" },
                ].map((g) => (
                  <button
                    key={g.value}
                    onClick={() => setSelectedGender(g.value)}
                    className={`block w-full text-left text-xs py-1.5 px-2.5 rounded-lg transition ${
                      selectedGender === g.value
                        ? "bg-indigo-950 text-white font-semibold"
                        : "text-indigo-900/80 hover:bg-kora-100"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price / GST Bracket */}
            <div>
              <h3 className="text-xs font-bold text-indigo-950 uppercase tracking-wider mb-2">
                Price Slabs & GST
              </h3>
              <div className="space-y-1.5">
                {[
                  { label: "All Prices", value: "ALL" },
                  { label: "Under ₹1,000 (5% GST)", value: "UNDER_1000" },
                  { label: "₹1,000 - ₹2,500 (12% GST)", value: "1000_2500" },
                  { label: "Above ₹2,500 (Artisanal Silk/Jamdani)", value: "ABOVE_2500" },
                ].map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setPriceBracket(p.value)}
                    className={`block w-full text-left text-xs py-1.5 px-2.5 rounded-lg transition ${
                      priceBracket === p.value
                        ? "bg-indigo-950 text-white font-semibold"
                        : "text-indigo-900/80 hover:bg-kora-100"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Clothing Size Filter */}
            <div>
              <h3 className="text-xs font-bold text-indigo-950 uppercase tracking-wider mb-2">Size</h3>
              <div className="flex flex-wrap gap-1.5">
                {CLOTHING_SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(selectedSize === size ? "" : size)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition ${
                      selectedSize === size
                        ? "bg-terracotta-500 text-white border-terracotta-500"
                        : "bg-kora-50 text-indigo-950 border-kora-300 hover:border-indigo-900"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <section className="md:col-span-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-20 text-indigo-900">
              <Loader2 className="w-8 h-8 animate-spin mr-3 text-terracotta-500" />
              <span className="text-sm font-medium">Fetching artisanal handloom pieces...</span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-kora-300 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-sm">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 mx-auto flex items-center justify-center mb-4">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-indigo-950 mb-2">
                {searchQuery
                  ? `No handloom garments found for \u201C${searchQuery}\u201D`
                  : "No items match your filter criteria"}
              </h3>
              <p className="text-xs text-indigo-900/70 max-w-md mx-auto mb-6 leading-relaxed">
                {searchQuery ? (
                  <span>
                    Did you mean:{" "}
                    <button
                      type="button"
                      onClick={() => setSearchQuery("indigo")}
                      className="text-terracotta-600 font-semibold underline underline-offset-2 hover:text-terracotta-700"
                    >
                      indigo
                    </button>
                    ,{" "}
                    <button
                      type="button"
                      onClick={() => setSearchQuery("jamdani")}
                      className="text-terracotta-600 font-semibold underline underline-offset-2 hover:text-terracotta-700"
                    >
                      jamdani
                    </button>
                    ,{" "}
                    <button
                      type="button"
                      onClick={() => setSearchQuery("cotton")}
                      className="text-terracotta-600 font-semibold underline underline-offset-2 hover:text-terracotta-700"
                    >
                      cotton
                    </button>
                    , or{" "}
                    <button
                      type="button"
                      onClick={() => setSearchQuery("saree")}
                      className="text-terracotta-600 font-semibold underline underline-offset-2 hover:text-terracotta-700"
                    >
                      saree
                    </button>
                    ? Check for spelling or explore our popular handloom collections below.
                  </span>
                ) : (
                  "Try resetting size, category, or price filters to explore our full artisanal handloom inventory."
                )}
              </p>

              {/* Recommended Categories */}
              <div className="border-t border-kora-200 pt-5 mt-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-900/50 mb-3">
                  Recommended Collections
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <Link
                    href="/shop?category=mens-handloom-shirts"
                    onClick={() => setSearchQuery("")}
                    className="text-xs font-semibold px-4 py-2 rounded-full bg-kora-100 hover:bg-kora-200 text-indigo-950 transition"
                  >
                    Men&apos;s Handloom Shirts
                  </Link>
                  <Link
                    href="/shop?category=womens-handloom-kurtas"
                    onClick={() => setSearchQuery("")}
                    className="text-xs font-semibold px-4 py-2 rounded-full bg-kora-100 hover:bg-kora-200 text-indigo-950 transition"
                  >
                    Women&apos;s Jamdani Kurtas
                  </Link>
                  <Link
                    href="/shop?category=bengal-salem-cotton-sarees"
                    onClick={() => setSearchQuery("")}
                    className="text-xs font-semibold px-4 py-2 rounded-full bg-kora-100 hover:bg-kora-200 text-indigo-950 transition"
                  >
                    Salem &amp; Bengal Sarees
                  </Link>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGender("");
                    setSelectedSize("");
                    setPriceBracket("ALL");
                    setSearchQuery("");
                  }}
                  className="bg-indigo-950 text-white text-xs font-semibold px-6 py-2.5 rounded-full hover:bg-indigo-900 transition shadow"
                >
                  Clear All Filters &amp; Search
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-xs text-indigo-900/60 font-medium mb-4">
                Showing {filteredProducts.length} authentic handloom garment{filteredProducts.length === 1 ? "" : "s"}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center py-20 text-indigo-900">
          <Loader2 className="w-8 h-8 animate-spin mr-3 text-terracotta-500" />
          <span className="text-sm font-medium">Loading artisanal pieces...</span>
        </div>
      }
    >
      <ShopContent />
    </React.Suspense>
  );
}
