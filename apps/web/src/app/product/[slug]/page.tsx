"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../lib/api";
import { useCartStore } from "../../../store/useCartStore";
import { useWishlistStore } from "../../../store/useWishlistStore";
import { useAuthStore } from "../../../store/useAuthStore";
import { formatINR, calculateDiscountPercent } from "../../../lib/utils";
import { ProductDTO, ProductVariantDTO, ClothingSize } from "@indigo/shared";
import {
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Info,
  Check,
  ChevronRight,
  Loader2,
  Heart,
  Star,
  User,
  ThumbsUp,
  MessageSquare,
  Camera,
} from "lucide-react";

// Fallback product data if server is offline during initial preview
const FALLBACK_PRODUCT: ProductDTO = {
  id: "p1",
  name: "The Nilgiri Indigo Handloom Shirt",
  slug: "the-nilgiri-indigo-handloom-shirt",
  description:
    "Hand-dyed in authentic fermented plant indigo, this relaxed-fit shirt is woven on traditional wooden pit-looms in Tamil Nadu. The open weave lets air circulate effortlessly, keeping you cool through peak Indian summers.",
  craftStory:
    "Crafted in partnership with a weaver cooperative in Salem, Tamil Nadu. Each batch of indigo pigment is fermented naturally without synthetic sulfur baths.",
  fabricDetails: "100% Handloom Organic Cotton, 60s count yarn. Natural coconut shell buttons.",
  careInstructions:
    "First wash dry clean or separate cold hand wash with mild ph-neutral soap. Natural indigo may bleed lightly in the first 2 washes.",
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
      url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=80",
      altText: "Front view of Nilgiri Indigo Handloom Shirt",
      isPrimary: true,
      displayOrder: 1,
    },
    {
      id: "img2",
      productId: "p1",
      url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=80",
      altText: "Artisanal stitch and texture detail of Nilgiri Indigo Shirt",
      isPrimary: false,
      displayOrder: 2,
    },
    {
      id: "img3",
      productId: "p1",
      url: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1200&q=80",
      altText: "Natural dye texture",
      isPrimary: false,
      displayOrder: 3,
    },
  ],
  variants: [
    { id: "v1_s", productId: "p1", sku: "NIL-IND-S", size: "S", colorName: "Deep Indigo", colorHex: "#1a2a4b", price: 1890, mrp: 2490, stock: 15 },
    { id: "v1_m", productId: "p1", sku: "NIL-IND-M", size: "M", colorName: "Deep Indigo", colorHex: "#1a2a4b", price: 1890, mrp: 2490, stock: 25 },
    { id: "v1_l", productId: "p1", sku: "NIL-IND-L", size: "L", colorName: "Deep Indigo", colorHex: "#1a2a4b", price: 1890, mrp: 2490, stock: 4 },
    { id: "v1_xl", productId: "p1", sku: "NIL-IND-XL", size: "XL", colorName: "Deep Indigo", colorHex: "#1a2a4b", price: 1890, mrp: 2490, stock: 8 },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const queryClient = useQueryClient();
  const { addItem, openDrawer } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();

  const { data: apiData, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      return api.get<ProductDTO>(`/products/slug/${slug}`);
    },
    retry: 1,
  });

  const product: ProductDTO = apiData?.data || FALLBACK_PRODUCT;
  const inWishlist = isInWishlist(product.id);

  // Reviews Query
  const { data: reviewsData, isLoading: reviewsLoading } = useQuery({
    queryKey: ["reviews", product.id],
    queryFn: async () => {
      return api.get<any>(`/reviews/product/${product.id}`);
    },
    enabled: !!product.id,
  });

  const reviewsList = reviewsData?.data?.reviews || [];
  const averageRating = reviewsData?.data?.averageRating || 5.0;
  const totalReviewsCount = reviewsData?.data?.totalReviews ?? reviewsData?.data?.count ?? 0;

  // Review Form State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewPhotos, setReviewPhotos] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [helpfulVotingId, setHelpfulVotingId] = useState<string | null>(null);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);
    setReviewError("");
    setReviewSuccess(false);

    try {
      const photosArray = reviewPhotos
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);

      const res = await api.post("/reviews", {
        productId: product.id,
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
        photos: photosArray.length > 0 ? photosArray : undefined,
      });

      if (res.success) {
        setReviewSuccess(true);
        setReviewTitle("");
        setReviewComment("");
        setReviewPhotos("");
        queryClient.invalidateQueries({ queryKey: ["reviews", product.id] });
      } else {
        setReviewError(typeof res.error === "string" ? res.error : "Failed to submit review");
      }
    } catch (err: any) {
      setReviewError(err.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleHelpfulVote = async (reviewId: string) => {
    setHelpfulVotingId(reviewId);
    try {
      const res = await api.post(`/reviews/${reviewId}/helpful`, {});
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["reviews", product.id] });
      }
    } catch (err: any) {
      // Ignore or handled
    } finally {
      setHelpfulVotingId(null);
    }
  };

  // Selected State
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariantDTO>(
    product.variants[0] || ({} as ProductVariantDTO)
  );
  const [activeTab, setActiveTab] = useState<"craft" | "fabric" | "care">("craft");
  const [addedToast, setAddedToast] = useState(false);

  React.useEffect(() => {
    if (apiData?.data && apiData.data.variants && apiData.data.variants.length > 0) {
      setSelectedVariant(apiData.data.variants[0]);
      setSelectedImageIndex(0);
    }
  }, [apiData]);

  // Group variants by color & size
  const uniqueSizes = Array.from(new Set(product.variants.map((v) => v.size)));
  const uniqueColors = Array.from(
    new Set(product.variants.map((v) => JSON.stringify({ name: v.colorName, hex: v.colorHex })))
  ).map((str) => JSON.parse(str));

  const handleSizeSelect = (size: ClothingSize) => {
    const match = product.variants.find(
      (v) => v.size === size && v.colorName === selectedVariant.colorName
    ) || product.variants.find((v) => v.size === size);

    if (match) setSelectedVariant(match);
  };

  const handleColorSelect = (colorName: string) => {
    const match = product.variants.find(
      (v) => v.colorName === colorName && v.size === selectedVariant.size
    ) || product.variants.find((v) => v.colorName === colorName);

    if (match) setSelectedVariant(match);
  };

  const price = selectedVariant?.price || 1890;
  const mrp = selectedVariant?.mrp || 2490;
  const discountPercent = calculateDiscountPercent(price, mrp);

  // Indian GST Calculation Breakdown for Transparency
  const gstRate = price <= 1000 ? 5 : 12;
  const taxableAmount = price / (1 + gstRate / 100);
  const gstAmount = price - taxableAmount;

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      size: selectedVariant.size,
      colorName: selectedVariant.colorName,
      price: selectedVariant.price,
      mrp: selectedVariant.mrp,
      image: product.images[0]?.url || "",
      quantity: 1,
      maxStock: selectedVariant.stock,
    });

    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-terracotta-500 mr-3" />
        <span className="text-sm font-medium text-indigo-900">Loading handloom details...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs text-indigo-900/60 mb-8 font-medium">
        <Link href="/" className="hover:text-indigo-950 transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/shop" className="hover:text-indigo-950 transition">Apparel</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/shop?category=${product.category?.slug}`} className="hover:text-indigo-950 transition">
          {product.category?.name || product.gender}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-indigo-950 font-bold truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Product Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-kora-200 border border-kora-300 shadow-sm">
            <img
              src={product.images[selectedImageIndex]?.url || product.images[0]?.url}
              alt={product.images[selectedImageIndex]?.altText || product.name}
              className="w-full h-full object-cover object-top transition duration-300"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-terracotta-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                Save {discountPercent}%
              </span>
            )}
            <span className="absolute top-4 right-4 bg-indigo-950/80 backdrop-blur-md text-white text-xs font-medium px-3 py-1 rounded-lg">
              HSN {product.hsnCode} • {gstRate}% GST
            </span>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-24 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                    selectedImageIndex === idx
                      ? "border-indigo-950 shadow-md scale-105"
                      : "border-kora-300 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img.url} alt={img.altText} className="w-full h-full object-cover object-top" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Actions */}
        <div className="flex flex-col justify-between space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-terracotta-600 uppercase tracking-widest">
                Handloom Certified
              </span>
              <span className="text-kora-400">•</span>
              <span className="text-xs text-indigo-900/60 font-semibold uppercase">
                {product.gender}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-indigo-950 tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Rating Stars Summary */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      star <= Math.round(averageRating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-kora-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-indigo-950">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-xs text-indigo-900/50">
                ({totalReviewsCount} {totalReviewsCount === 1 ? "artisan review" : "artisan reviews"})
              </span>
            </div>

            {/* Price block with Indian GST transparency */}
            <div className="mt-4 p-4 rounded-2xl bg-white border border-kora-300 shadow-sm">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-serif font-bold text-indigo-950">
                  {formatINR(price)}
                </span>
                {mrp > price && (
                  <span className="text-base text-indigo-900/40 line-through">
                    {formatINR(mrp)}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* GST breakdown note */}
              <div className="mt-2 text-xs text-indigo-900/70 flex items-center gap-1.5 pt-2 border-t border-kora-200">
                <Info className="w-3.5 h-3.5 text-indigo-900/60 shrink-0" />
                <span>
                  Inclusive of all taxes: <strong>{formatINR(taxableAmount)}</strong> (Base price) +{" "}
                  <strong>{formatINR(gstAmount)}</strong> ({gstRate}% Indian Apparel GST).
                </span>
              </div>
            </div>

            {/* Color Selector */}
            {uniqueColors.length > 0 && (
              <div className="mt-6">
                <div className="flex justify-between items-center text-xs font-bold text-indigo-950 uppercase tracking-wider mb-2">
                  <span>Color: {selectedVariant.colorName}</span>
                </div>
                <div className="flex gap-2.5">
                  {uniqueColors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => handleColorSelect(color.name)}
                      className={`relative w-8 h-8 rounded-full border-2 transition ${
                        selectedVariant.colorName === color.name
                          ? "border-indigo-950 ring-2 ring-indigo-950/20 scale-110"
                          : "border-kora-400 hover:scale-105"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {selectedVariant.colorName === color.name && (
                        <Check className="w-4 h-4 mx-auto text-white drop-shadow stroke-[3]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            <div className="mt-6">
              <div className="flex justify-between items-center text-xs font-bold text-indigo-950 uppercase tracking-wider mb-2">
                <span>Select Size (Chest / Fit)</span>
                <span className="text-indigo-900/50 hover:underline cursor-pointer font-normal">
                  View Size Guide
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {uniqueSizes.map((size) => {
                  const variantForSize = product.variants.find(
                    (v) => v.size === size && v.colorName === selectedVariant.colorName
                  );
                  const isOutOfStock = !variantForSize || variantForSize.stock <= 0;
                  const isSelected = selectedVariant.size === size;

                  return (
                    <button
                      key={size}
                      onClick={() => handleSizeSelect(size as ClothingSize)}
                      disabled={isOutOfStock}
                      className={`min-w-12 h-11 px-3 rounded-xl text-xs font-bold border transition ${
                        isSelected
                          ? "bg-indigo-950 text-white border-indigo-950 shadow-sm"
                          : isOutOfStock
                          ? "bg-kora-200 text-indigo-900/30 border-kora-300 cursor-not-allowed line-through"
                          : "bg-white text-indigo-950 border-kora-300 hover:border-indigo-900"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>

              {/* Stock Warning */}
              {selectedVariant.stock > 0 && selectedVariant.stock <= 5 && (
                <p className="text-xs text-amber-700 font-semibold mt-2">
                  ⚠️ Only {selectedVariant.stock} units remaining in our Salem artisan workshop!
                </p>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={selectedVariant.stock <= 0}
                  className="py-4 px-6 rounded-2xl bg-indigo-950 hover:bg-indigo-900 text-white text-sm font-semibold transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-40"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {selectedVariant.stock > 0 ? "Add to Handloom Bag" : "Out of Stock"}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={selectedVariant.stock <= 0}
                  className="py-4 px-6 rounded-2xl bg-terracotta-500 hover:bg-terracotta-600 text-white text-sm font-semibold transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-40"
                >
                  Buy Now with Express Delivery
                </button>
              </div>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`w-full py-3.5 px-4 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                  inWishlist
                    ? "bg-rose-50 text-rose-700 border-rose-300"
                    : "bg-white text-indigo-950 border-kora-300 hover:border-indigo-950 hover:bg-kora-50"
                }`}
              >
                <Heart className={`w-4 h-4 ${inWishlist ? "fill-rose-600 text-rose-600" : ""}`} />
                <span>{inWishlist ? "Saved in Your Wishlist" : "Save to Artisanal Wishlist"}</span>
              </button>

              {addedToast && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center justify-between">
                  <span>✓ Added to bag! Check your cart for free shipping qualification.</span>
                  <button onClick={openDrawer} className="underline font-bold text-emerald-900 ml-2">
                    Open Bag
                  </button>
                </div>
              )}
            </div>

            {/* Trust highlights */}
            <div className="mt-8 pt-6 border-t border-kora-300 grid grid-cols-2 gap-4 text-xs text-indigo-900/80">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-terracotta-500 shrink-0" />
                <span>Free shipping on ₹1,500+ orders</span>
              </div>
              <div className="flex items-center gap-2.5">
                <RotateCcw className="w-4 h-4 text-terracotta-500 shrink-0" />
                <span>7-Day doorstep size exchange</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-terracotta-500 shrink-0" />
                <span>Cash on Delivery & Razorpay UPI</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-terracotta-500 shrink-0" />
                <span>Direct weaver fair-wage certified</span>
              </div>
            </div>
          </div>

          {/* Artisanal Heritage Tabs */}
          <div className="mt-8 pt-8 border-t border-kora-300">
            <div className="flex border-b border-kora-300 text-xs font-bold uppercase tracking-wider">
              <button
                onClick={() => setActiveTab("craft")}
                className={`pb-3 mr-6 border-b-2 transition ${
                  activeTab === "craft" ? "border-indigo-950 text-indigo-950" : "border-transparent text-indigo-900/50"
                }`}
              >
                Artisan Story
              </button>
              <button
                onClick={() => setActiveTab("fabric")}
                className={`pb-3 mr-6 border-b-2 transition ${
                  activeTab === "fabric" ? "border-indigo-950 text-indigo-950" : "border-transparent text-indigo-900/50"
                }`}
              >
                Fabric & Weave
              </button>
              <button
                onClick={() => setActiveTab("care")}
                className={`pb-3 border-b-2 transition ${
                  activeTab === "care" ? "border-indigo-950 text-indigo-950" : "border-transparent text-indigo-900/50"
                }`}
              >
                Washing & Care
              </button>
            </div>

            <div className="pt-4 text-xs leading-relaxed text-indigo-900/80">
              {activeTab === "craft" && (
                <div>
                  <p className="mb-2 font-medium text-indigo-950">
                    {product.craftStory || "Woven on wooden shuttle looms by master artisan weavers."}
                  </p>
                  <p>
                    Every garment supports multigenerational weaving families, ensuring indigenous Indian textile crafts thrive sustainably.
                  </p>
                </div>
              )}
              {activeTab === "fabric" && (
                <div>
                  <p className="font-medium text-indigo-950 mb-1">
                    {product.fabricDetails || "100% Handloom Organic Cotton, breathable open weave."}
                  </p>
                  <p>
                    Lightweight, breathable, and cut specifically to keep you cool across humid and tropical climates.
                  </p>
                </div>
              )}
              {activeTab === "care" && (
                <div>
                  <p className="font-medium text-indigo-950 mb-1">
                    {product.careInstructions || "Gentle cold water hand wash with mild ph-neutral soap. Dry in shade."}
                  </p>
                  <p>
                    Natural plant indigo dyes mature gracefully with each wash, imparting an authentic, vintage patina over time.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews & Craft Experience Section */}
      <section className="mt-16 pt-12 border-t border-kora-300">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-terracotta-600 block mb-1">
              Real Craft Feedback
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-indigo-950">
              Customer Reviews ({totalReviewsCount})
            </h2>
          </div>
          <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-kora-300 shadow-sm">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(averageRating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-kora-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-bold text-indigo-950">
              {averageRating.toFixed(1)} out of 5
            </span>
            <span className="text-xs text-indigo-900/50">
              ({totalReviewsCount} {totalReviewsCount === 1 ? "review" : "reviews"})
            </span>
          </div>
        </div>

        {/* Rating Breakdown Bar Chart */}
        <div className="bg-white p-6 rounded-3xl border border-kora-300 shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="text-center md:border-r border-kora-200 pr-0 md:pr-6">
              <div className="text-4xl font-serif font-bold text-indigo-950">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex items-center justify-center gap-1 my-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.round(averageRating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-kora-300"
                    }`}
                  />
                ))}
              </div>
              <div className="text-xs text-indigo-900/60 font-medium">
                Based on {totalReviewsCount} {totalReviewsCount === 1 ? "review" : "reviews"}
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = reviewsList.filter((r: any) => r.rating === stars).length;
                const percentage =
                  totalReviewsCount > 0 ? Math.round((count / totalReviewsCount) * 100) : 0;

                return (
                  <div key={stars} className="flex items-center gap-3 text-xs">
                    <span className="w-12 font-semibold text-indigo-950 flex items-center gap-1 shrink-0">
                      {stars} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    </span>
                    <div className="flex-1 h-2.5 bg-kora-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-14 text-right text-indigo-900/60 text-[11px] shrink-0 font-medium">
                      {count} ({percentage}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-4">
            {reviewsLoading ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-kora-300">
                <Loader2 className="w-6 h-6 animate-spin text-terracotta-500 mx-auto mb-2" />
                <p className="text-xs text-indigo-900/60 font-medium">Loading artisan reviews...</p>
              </div>
            ) : reviewsList.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-kora-300 text-indigo-900/60">
                <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                <h4 className="font-serif font-bold text-indigo-950 text-base mb-1">
                  Be the First to Review
                </h4>
                <p className="text-xs max-w-sm mx-auto">
                  Share your experience with the weave, drape, and feel of this authentic Salem handloom piece.
                </p>
              </div>
            ) : (
              reviewsList.map((rev: any) => (
                <div
                  key={rev.id}
                  className="p-5 bg-white rounded-2xl border border-kora-300 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-950 font-bold text-xs flex items-center justify-center">
                        {rev.user?.name ? rev.user.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                          <span>{rev.user?.name || "Verified Customer"}</span>
                          {rev.isVerifiedPurchase !== false && (
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                              Verified Buyer
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-indigo-900/50">
                          {rev.createdAt
                            ? new Date(rev.createdAt).toLocaleDateString("en-IN", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : ""}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= rev.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-kora-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {rev.title && (
                    <h4 className="text-xs font-bold text-indigo-950">{rev.title}</h4>
                  )}

                  <p className="text-xs text-indigo-900/80 leading-relaxed">
                    {rev.comment}
                  </p>

                  {/* Customer Submitted Photos */}
                  {rev.photos && Array.isArray(rev.photos) && rev.photos.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {rev.photos.map((photo: string, idx: number) => (
                        <a
                          key={idx}
                          href={photo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-16 h-16 rounded-xl overflow-hidden border border-kora-200 relative block hover:opacity-90 transition shadow-sm bg-kora-50"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={photo}
                            alt={`Review photo ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Admin Artisan Reply */}
                  {rev.adminReply && (
                    <div className="mt-3 p-3.5 bg-kora-100/90 rounded-xl border border-kora-300 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-indigo-950 mb-1">
                        <MessageSquare className="w-3.5 h-3.5 text-terracotta-500" />
                        <span>Artisan Team Response</span>
                      </div>
                      <p className="text-indigo-900/80 italic leading-relaxed">
                        &ldquo;{rev.adminReply}&rdquo;
                      </p>
                    </div>
                  )}

                  {/* Helpful Voting Action */}
                  <div className="flex items-center justify-between pt-2 border-t border-kora-100 text-xs text-indigo-900/60">
                    <span className="text-[11px]">Was this feedback helpful?</span>
                    <button
                      type="button"
                      onClick={() => handleHelpfulVote(rev.id)}
                      disabled={helpfulVotingId === rev.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-kora-300 hover:border-indigo-900 hover:bg-kora-50 text-[11px] font-semibold text-indigo-950 transition active:scale-95 disabled:opacity-50"
                    >
                      <ThumbsUp className="w-3 h-3 text-indigo-900" />
                      <span>Helpful ({rev.helpfulCount || 0})</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Write a Review Card */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-kora-300 shadow-sm sticky top-28">
              <h3 className="font-serif font-bold text-indigo-950 text-base mb-1">
                Write an Artisan Review
              </h3>
              <p className="text-xs text-indigo-900/60 mb-4">
                Help other lovers of handloom make informed choices.
              </p>

              {reviewSuccess && (
                <div className="p-3 mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl">
                  ✓ Thank you! Your review has been submitted for verification.
                </div>
              )}

              {reviewError && (
                <div className="p-3 mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                  {reviewError}
                </div>
              )}

              {isAuthenticated ? (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-indigo-950 mb-1.5">
                      Your Rating
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="p-1 hover:scale-110 transition"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= reviewRating
                                ? "fill-amber-400 text-amber-400"
                                : "text-kora-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-indigo-950 mb-1">
                      Review Headline
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sublime drape & authentic plant indigo"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-kora-300 focus:outline-none focus:border-indigo-950"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-indigo-950 mb-1">
                      Your Craft Feedback
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="How does the fabric feel against the skin? How is the fit and stitch quality?"
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-kora-300 focus:outline-none focus:border-indigo-950 leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-indigo-950 mb-1 flex items-center gap-1">
                      <Camera className="w-3.5 h-3.5 text-indigo-900/60" />
                      <span>Photo URLs (comma-separated, optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..., https://..."
                      value={reviewPhotos}
                      onChange={(e) => setReviewPhotos(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-kora-300 focus:outline-none focus:border-indigo-950"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full py-3 rounded-xl bg-indigo-950 hover:bg-indigo-900 text-white text-xs font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 shadow"
                  >
                    {submittingReview ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <span>Submit Craft Review</span>
                    )}
                  </button>
                </form>
              ) : (
                <div className="p-4 bg-kora-100 rounded-xl text-center space-y-3">
                  <p className="text-xs text-indigo-900/70">
                    Have you experienced our handloom garments? Sign in to share your review.
                  </p>
                  <Link
                    href="/login"
                    className="inline-block w-full py-2.5 px-4 rounded-xl bg-indigo-950 hover:bg-indigo-900 text-white text-xs font-semibold transition shadow-sm"
                  >
                    Sign In to Leave a Review
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
