"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  Feather,
  HeartHandshake,
  Tag,
  Flame,
  Check,
  ChevronRight,
  ChevronLeft,
  Star,
  Copy,
} from "lucide-react";
import { useCartStore } from "../store/useCartStore";
import { CATALOG_PRODUCTS } from "../data/catalog";
import { ProductDTO } from "@indigo/shared";

// Quick Circular Category Bubbles (Instagram Highlights style)
const CIRCULAR_STORIES = [
  {
    title: "New In",
    tag: "Trending 2026",
    img: "https://naachiyars.in/cdn/shop/files/Nachiyars_banner1.jpg?v=1788243947",
    href: "/shop?sort=newest",
    badge: "NEW",
  },
  {
    title: "Silk Sarees",
    tag: "Banarasi & Soft Silk",
    img: "https://cdn.shopify.com/s/files/1/0851/9578/4511/files/saree9copy.jpg?v=1757064390",
    href: "/shop?category=bengal-salem-cotton-sarees",
  },
  {
    title: "Men's Dhoti",
    tag: "Wedding Border",
    img: "https://cdn.shopify.com/s/files/1/0851/9578/4511/files/N1939805-A.jpg?v=1742045506",
    href: "/shop?gender=MEN",
  },
  {
    title: "Cotton Sarees",
    tag: "Shibori & Chettinad",
    img: "https://cdn.shopify.com/s/files/1/0851/9578/4511/files/N2098694-B_2.jpg?v=1770728852",
    href: "/shop?category=bengal-salem-cotton-sarees",
  },
  {
    title: "Salwar Suits",
    tag: "Pure Chettinad",
    img: "https://cdn.shopify.com/s/files/1/0851/9578/4511/files/N2225087-C_3.jpg?v=1756464217",
    href: "/shop?gender=WOMEN",
  },
  {
    title: "Under ₹999",
    tag: "Budget Slabs",
    img: "https://cdn.shopify.com/s/files/1/0851/9578/4511/files/saree14copy.jpg?v=1757064404",
    href: "/shop?priceBracket=UNDER_1000",
    badge: "DEAL",
  },
  {
    title: "Flat 10% Off",
    tag: "Code: WELCOME10",
    img: "https://cdn.shopify.com/s/files/1/0851/9578/4511/files/N2152875-A_7.jpg?v=1762254887",
    href: "/shop?onSale=true",
    badge: "OFFER",
  },
];

// Featured Products Array (Directly matched to live database items)
const FEATURED_PRODUCTS = [
  {
    id: "p1",
    name: "The Nilgiri Indigo Handloom Shirt",
    category: "Men's Handloom Shirts",
    price: 1890,
    mrp: 2490,
    discount: "24% OFF",
    fabric: "100% Handloom Organic Cotton, 60s Count",
    img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
    slug: "the-nilgiri-indigo-handloom-shirt",
    tag: "BEST SELLER",
  },
  {
    id: "p2",
    name: "Kaveri Jamdani Handloom A-Line Kurta",
    category: "Women's Handloom Kurtas",
    price: 2490,
    mrp: 3290,
    discount: "24% OFF",
    fabric: "Ultra-fine 80s Count Pure Cotton",
    img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
    slug: "kaveri-jamdani-handloom-aline-kurta",
    tag: "NEW ARRIVAL",
  },
  {
    id: "p3",
    name: "Salem Temple Border Cotton Saree",
    category: "Bengal & Salem Cotton Sarees",
    price: 3490,
    mrp: 4500,
    discount: "22% OFF",
    fabric: "6.2m Pure Cotton with Blouse Piece",
    img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    slug: "salem-temple-border-cotton-saree",
    tag: "ROYAL WEAVE",
  },
  {
    id: "p4",
    name: "Chettinad Striped Short Kurta",
    category: "Men's Linen & Khadi Kurtas",
    price: 1490,
    mrp: 1990,
    discount: "25% OFF",
    fabric: "100% Pure Combed Handloom Cotton",
    img: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80",
    slug: "chettinad-striped-short-kurta",
    tag: "TRENDING",
  },
  {
    id: "p5",
    name: "Hand-Spun Organic Everyday Pocket Tee",
    category: "Handcrafted Overlays & Stoles",
    price: 890,
    mrp: 1290,
    discount: "31% OFF",
    fabric: "Certified Organic Slub Cotton, 180 GSM",
    img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    slug: "handspun-organic-cotton-everyday-tee",
    tag: "UNDER ₹1000",
  },
];

// Hero Carousel Slides using authentic banners from Theni Anantham, SCM Silk, and Naachiyars
const HERO_SLIDES = [
  {
    badge: "✦ THE WEDDING & FESTIVE COLLECTION ✦",
    title: "PREMIUM SILK COLLECTION",
    italicSub: "Grandeur of Heritage Weaves",
    tagline: "✦ HANDCRAFTED SOUTH INDIAN SILKS & BRIDAL WEAR ✦",
    offerTitle: "FLAT 10% OFF",
    offerSub: "USE CODE: WELCOME10",
    primaryCta: { label: "Shop Silk Sarees", href: "/shop?category=bengal-salem-cotton-sarees" },
    secondaryCta: { label: "Explore Men's Dhoti", href: "/shop?gender=MEN" },
    bannerBg: "https://www.thescmsilk.in/media/wysiwyg/WEB_BANNER_02_1.jpg",
    model1: {
      img: "https://cdn.shopify.com/s/files/1/0851/9578/4511/files/saree9copy.jpg?v=1757064390",
      tag: "BANARAS SOFTY",
    },
    model2: {
      img: "https://cdn.shopify.com/s/files/1/0851/9578/4511/files/N2152875-A_7.jpg?v=1762254887",
      tag: "SEMI SILK RAINBOW",
    },
    model3: {
      img: "https://cdn.shopify.com/s/files/1/0851/9578/4511/files/N1939805-A.jpg?v=1742045506",
      tag: "COPPER TISSUE DHOTI",
    },
    model4: {
      img: "https://cdn.shopify.com/s/files/1/0851/9578/4511/files/N2225087-C_3.jpg?v=1756464217",
      tag: "CHETTINAD CHUDI",
    },
  },
  {
    badge: "✦ WOMEN'S CELEBRATION WEAR ✦",
    title: "KANCHI & PURE TISSUE SAREES",
    italicSub: "Grace in Every Fold",
    tagline: "✦ TIMELESS DESIGNS • DIRECT FROM LOOMS ✦",
    offerTitle: "FLAT 10% OFF",
    offerSub: "EXCLUSIVE ONLINE OFFER",
    primaryCta: { label: "View Bridal Sarees", href: "/shop?category=bengal-salem-cotton-sarees" },
    secondaryCta: { label: "Shop Under ₹1,000", href: "/shop?priceBracket=UNDER_1000" },
    bannerBg: "https://www.thescmsilk.in/media/weltpixel/owlcarouselslider/images/w/o/womens_web_banner_july_2026.jpg",
    model1: {
      img: "https://cdn.shopify.com/s/files/1/0851/9578/4511/files/N1935574-A_5.jpg?v=1751027305",
      tag: "BRIDAL TISSUE SILK",
    },
    model2: {
      img: "https://cdn.shopify.com/s/files/1/0851/9578/4511/files/N2911649-J_2.jpg?v=1780568385",
      tag: "FLORAL VINES ZARI",
    },
    model3: {
      img: "https://cdn.shopify.com/s/files/1/0851/9578/4511/files/N2650592-A_11.jpg?v=1768480961",
      tag: "SEMI TUSSAR WEAVE",
    },
    model4: {
      img: "https://cdn.shopify.com/s/files/1/0851/9578/4511/files/N2914009-A_9_-Copy.jpg?v=1776688678",
      tag: "JAIPUR HAND BLOCK",
    },
  },
  {
    badge: "✦ MEN'S TRADITIONAL ETHNIC WEAR ✦",
    title: "WEDDING DHOTIS & SHIRTS",
    italicSub: "Royal Southern Splendor",
    tagline: "✦ TRADITIONAL ZARI BORDERS • PURE ART SILK ✦",
    offerTitle: "SPECIAL COMBO",
    offerSub: "DHOTI + SHIRT MATCHING",
    primaryCta: { label: "Explore Men's Wear", href: "/shop?gender=MEN" },
    secondaryCta: { label: "New Arrivals", href: "/shop?sort=newest" },
    bannerBg: "https://www.thescmsilk.in/media/weltpixel/owlcarouselslider/images/m/e/mens_web_banner_july_2026.jpg",
    model1: {
      img: "https://cdn.shopify.com/s/files/1/0851/9578/4511/files/N1944701-A.jpg?v=1742045511",
      tag: "GOLD BORDER DHOTI",
    },
    model2: {
      img: "https://cdn.shopify.com/s/files/1/0851/9578/4511/files/N1944704-A_4.jpg?v=1742045505",
      tag: "DARK GOLD SILK",
    },
    model3: {
      img: "https://cdn.shopify.com/s/files/1/0851/9578/4511/files/N2098694-B_2.jpg?v=1770728852",
      tag: "MUMBAI SOFT COTTON",
    },
    model4: {
      img: "https://cdn.shopify.com/s/files/1/0851/9578/4511/files/saree14copy.jpg?v=1757064404",
      tag: "DIGITAL SOFTY SILK",
    },
  },
];

export default function HomePage() {
  const [copiedCode, setCopiedCode] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [currentSlide, setCurrentSlide] = useState(0);

  const { addItem, openDrawer } = useCartStore();

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  const handleCopy = () => {
    navigator.clipboard.writeText("WELCOME10");
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
    }
  };

  const handleQuickAdd = (p: ProductDTO) => {
    const variant = p.variants[0];
    addItem({
      variantId: variant ? variant.id : `${p.id}_v_default`,
      productId: p.id,
      productName: p.name,
      productSlug: p.slug,
      price: variant ? variant.price : 1499,
      mrp: variant ? variant.mrp : 1999,
      size: (variant ? variant.size : "M") as any,
      colorName: variant ? variant.colorName : "Artisanal",
      image: p.images[0]?.url || "",
      quantity: 1,
      maxStock: variant ? variant.stock : 10,
    });
    openDrawer();
  };

  const allDisplayProducts: ProductDTO[] = CATALOG_PRODUCTS;

  const filteredFeatured = allDisplayProducts.filter((p) => {
    if (activeTab === "sarees") return p.category?.slug.includes("sarees") || p.name.toLowerCase().includes("saree");
    if (activeTab === "men") return p.gender === "MEN";
    if (activeTab === "kurtas") return p.category?.slug.includes("kurtas") || p.name.toLowerCase().includes("chudi") || p.name.toLowerCase().includes("suit");
    return true;
  }).slice(0, 8);

  return (
    <div className="flex flex-col min-h-screen bg-[#faf8f5]">
      {/* ============================================================== */}
      {/* 1. NAACHIYARS FULL-WIDTH HERO BANNER SLIDER (Exact match to screenshot 1 & 2) */}
      {/* ============================================================== */}
      <section className="relative w-full overflow-hidden bg-gray-900 aspect-[16/7] sm:aspect-[21/9] min-h-[380px] sm:min-h-[500px] flex items-center">
        {/* Banner Slide 1 - "Style Made for You" (Temple / Pillars Background with Saree Models) */}
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${
            currentSlide === 0 ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          {/* Main Full-Width Photographic Banner */}
          <img
            src="https://naachiyars.in/cdn/shop/files/Nachiyars_banner.jpg?v=1788243948"
            alt="Style Made for You - Naachiyars Sarees"
            className="w-full h-full object-cover object-center"
          />

          {/* Right Floating Text Content Overlay matching Screenshot 1 */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/30 flex items-center justify-end px-6 sm:px-12 md:px-20 lg:px-28">
            <div className="max-w-md sm:max-w-xl text-right sm:text-left mr-0 sm:mr-8 md:mr-16">
              <h2
                className="text-3xl sm:text-5xl md:text-6xl font-serif text-[#f5b842] drop-shadow-md font-bold tracking-tight italic"
                style={{ fontFamily: "Georgia, 'Playfair Display', serif" }}
              >
                Style Made for You
              </h2>
              <p className="mt-2 sm:mt-3 text-sm sm:text-lg md:text-xl text-white font-medium drop-shadow leading-relaxed">
                Explore premium sarees woven with heritage and heart.
              </p>
              <div className="mt-5 sm:mt-8">
                <Link
                  href="/shop?category=bengal-salem-cotton-sarees"
                  className="inline-block border border-black/80 sm:border-gray-900 bg-transparent hover:bg-black hover:text-white text-black font-semibold text-xs sm:text-sm tracking-wider uppercase px-7 py-2.5 transition duration-300 shadow-sm"
                >
                  SHOP NOW
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Banner Slide 2 - "The Art of Tradition" (Maroon Heritage Background with Seated Silk Saree Models) */}
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${
            currentSlide === 1 ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          {/* Main Full-Width Photographic Banner */}
          <img
            src="https://naachiyars.in/cdn/shop/files/Nachiyars_banner1.jpg?v=1788243947"
            alt="The Art of Tradition - Naachiyars Silk"
            className="w-full h-full object-cover object-center"
          />

          {/* Left Text Content Overlay matching Screenshot 2 */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent flex items-center justify-start px-6 sm:px-12 md:px-20 lg:px-28">
            <div className="max-w-md sm:max-w-xl text-left">
              <h2
                className="text-3xl sm:text-5xl md:text-6xl font-serif text-[#f5b842] drop-shadow-md font-bold tracking-tight italic"
                style={{ fontFamily: "Georgia, 'Playfair Display', serif" }}
              >
                The Art of Tradition
              </h2>
              <p className="mt-2 sm:mt-3 text-sm sm:text-lg md:text-xl text-white font-medium drop-shadow leading-relaxed max-w-lg">
                Premium saree collections blending tradition, luxury, comfort, and style.
              </p>
              <div className="mt-5 sm:mt-8">
                <Link
                  href="/shop?category=bengal-salem-cotton-sarees"
                  className="inline-block border border-white hover:bg-white hover:text-black text-white font-semibold text-xs sm:text-sm tracking-wider uppercase px-7 py-2.5 transition duration-300 shadow-sm"
                >
                  SHOP NOW
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Floating "AI fitting room" pill on bottom-left (Exact from Screenshot 1 & 2) */}
        <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 bg-black/80 hover:bg-black text-white text-xs px-3 py-1.5 rounded border border-white/20 shadow-lg cursor-pointer transition">
          <span className="text-sm">📷</span>
          <span className="font-medium">AI fitting room</span>
          <span className="text-gray-400 text-xs ml-1 hover:text-white">✕</span>
        </div>

        {/* Carousel Indicator Dots at bottom center */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {[0, 1].map((idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`rounded-full transition-all duration-300 ${
                currentSlide === idx ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Left / Right Nav Arrows */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev === 0 ? 1 : 0))}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center transition"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev === 0 ? 1 : 0))}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center transition"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </section>

      {/* ============================================================== */}
      {/* 3. CURATED 2-COLUMN LUXURY SPLIT BANNERS (As requested: "ரெண்டு காலம், ரெண்டு பார்ட்டா பிரிச்சு... காட்டன் கலெக்ஷன், லேட்டஸ்ட் ட்ரெண்ட், லக்சரினு போட்டு") */}
      {/* ============================================================== */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-8">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#780016] block mb-1">
            Curated Artisanal Collections
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-indigo-950">
            Crafted for Comfort, Styled for Luxury
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Column 1: Cotton Collection & Everyday Ease */}
          <Link
            href="/shop?gender=MEN"
            className="group relative rounded-3xl overflow-hidden aspect-[16/10] sm:aspect-[4/3] bg-indigo-950 shadow-lg border border-kora-300 block"
          >
            <img
              src="https://www.thescmsilk.in/media/weltpixel/owlcarouselslider/images/m/e/mens_web_banner_july_2026.jpg"
              alt="Cotton Collection and Everyday Style"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-700 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-indigo-950/40 to-transparent flex flex-col justify-end p-6 sm:p-10 text-white">
              <span className="inline-block bg-amber-400 text-indigo-950 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-fit mb-2">
                COTTON COLLECTION • EVERYDAY STYLE
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-black text-white leading-tight">
                Traditional Men&apos;s Dhoti &amp; Handloom Wear
              </h3>
              <p className="text-xs sm:text-sm text-kora-200 mt-2 line-clamp-2 max-w-md">
                Breathable art silk wedding dhotis, zari border kurtas, and festival outfits.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-amber-300 group-hover:text-white transition">
                <span>Explore Men&apos;s Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </div>
          </Link>

          {/* Column 2: Sensational Trends & Jamdani Luxury */}
          <Link
            href="/shop?category=bengal-salem-cotton-sarees"
            className="group relative rounded-3xl overflow-hidden aspect-[16/10] sm:aspect-[4/3] bg-[#780016] shadow-lg border border-kora-300 block"
          >
            <img
              src="https://naachiyars.in/cdn/shop/files/Nachiyars_banner.jpg?v=1788243948"
              alt="Sensational Trend and Luxury Sarees"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-700 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#3d000b] via-[#3d000b]/40 to-transparent flex flex-col justify-end p-6 sm:p-10 text-white">
              <span className="inline-block bg-amber-400 text-indigo-950 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-fit mb-2">
                SENSATIONAL TRENDS • LUXURY WEAVES
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-black text-white leading-tight">
                Salem Temple Borders &amp; Royal Jamdani
              </h3>
              <p className="text-xs sm:text-sm text-amber-100 mt-2 line-clamp-2 max-w-md">
                Traditional Korvai three-shuttle interlock sarees and delicate Phulia supplementary weft motifs.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-amber-300 group-hover:text-white transition">
                <span>Explore Luxury Sarees</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. BEST SELLERS & TRENDING SHOWCASE (Tabs & Real Products) */}
      {/* ============================================================== */}
      <section className="py-12 bg-white border-y border-kora-300 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#780016] block mb-1">
                Customer Favorites
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-indigo-950">
                Best Sellers &amp; Most Loved
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "All Trending" },
                { id: "sarees", label: "Sarees" },
                { id: "men", label: "Men's Handloom" },
                { id: "kurtas", label: "Kurtas & Tees" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition tracking-wider uppercase ${
                    activeTab === tab.id
                      ? "bg-[#780016] text-white shadow-sm"
                      : "bg-kora-200 text-indigo-950 hover:bg-kora-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredFeatured.map((product) => {
              const primaryVariant = product.variants[0];
              const primaryImg = product.images[0]?.url || "";
              const price = primaryVariant?.price || 1499;
              const mrp = primaryVariant?.mrp || Math.round(price * 1.3);
              const discountPercent = Math.round(((mrp - price) / mrp) * 100);

              return (
                <div
                  key={product.id}
                  className="group relative bg-[#faf8f5] rounded-3xl overflow-hidden border border-kora-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Product Image */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-kora-200">
                    <img
                      src={primaryImg}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#780016] text-amber-300 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow">
                      {product.gender === "MEN" ? "MEN'S WEAR" : "HANDLOOM"}
                    </div>
                    {discountPercent > 0 && (
                      <div className="absolute top-3 right-3 bg-emerald-700 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">
                        {discountPercent}% OFF
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-900/60 uppercase tracking-widest block">
                        {product.category?.name || "Authentic Ethnic"}
                      </span>
                      <Link
                        href={`/product/${product.slug}`}
                        className="font-serif font-bold text-indigo-950 hover:text-[#780016] text-sm mt-1 line-clamp-2 block transition"
                      >
                        {product.name}
                      </Link>
                      <p className="text-[11px] text-indigo-900/70 mt-1 line-clamp-1">{product.craftStory || product.description}</p>
                    </div>

                    {/* Pricing and CTA */}
                    <div className="mt-4 pt-3 border-t border-kora-300 flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base font-bold text-indigo-950 font-serif">₹{price}</span>
                          <span className="text-xs text-indigo-900/50 line-through">₹{mrp}</span>
                        </div>
                        <span className="text-[9px] text-emerald-800 font-semibold block">GST Inclusive</span>
                      </div>

                      <button
                        onClick={() => handleQuickAdd(product)}
                        className="bg-indigo-950 hover:bg-[#780016] text-white text-xs font-bold px-3 py-2 rounded-xl transition shadow hover:shadow-md"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#780016] hover:bg-[#5e0011] text-white text-xs sm:text-sm font-bold tracking-wider uppercase px-8 py-3.5 rounded-full shadow-md hover:shadow-lg transition"
            >
              View Complete Live Catalog ({FEATURED_PRODUCTS.length}+ Items) <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. PRICE-BASED QUICK BROWSE (Naachiyars & Theni Anantham Style) */}
      {/* ============================================================== */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-8">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#780016] block mb-1">
            Budget Friendly Slabs
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-indigo-950">
            Shop by Price Range
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/shop?priceBracket=UNDER_1000"
            className="group p-5 rounded-2xl bg-white border-2 border-kora-300 hover:border-[#780016] transition shadow-sm hover:shadow-md text-center flex flex-col items-center justify-center cursor-pointer"
          >
            <span className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl font-black mb-2 group-hover:scale-110 transition">
              ₹
            </span>
            <span className="text-sm font-bold text-indigo-950 group-hover:text-[#780016]">Under ₹999</span>
            <span className="text-[10px] text-indigo-900/60 mt-0.5">5% GST • Everyday Cotton Tees</span>
          </Link>

          <Link
            href="/shop?priceBracket=1000_2000"
            className="group p-5 rounded-2xl bg-white border-2 border-kora-300 hover:border-[#780016] transition shadow-sm hover:shadow-md text-center flex flex-col items-center justify-center cursor-pointer"
          >
            <span className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xl font-black mb-2 group-hover:scale-110 transition">
              ₹₹
            </span>
            <span className="text-sm font-bold text-indigo-950 group-hover:text-[#780016]">₹1,000 – ₹1,999</span>
            <span className="text-[10px] text-indigo-900/60 mt-0.5">Chettinad Kurtas &amp; Indigo Shirts</span>
          </Link>

          <Link
            href="/shop?priceBracket=1000_2500"
            className="group p-5 rounded-2xl bg-white border-2 border-kora-300 hover:border-[#780016] transition shadow-sm hover:shadow-md text-center flex flex-col items-center justify-center cursor-pointer"
          >
            <span className="w-12 h-12 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center text-xl font-black mb-2 group-hover:scale-110 transition">
              ₹₹₹
            </span>
            <span className="text-sm font-bold text-indigo-950 group-hover:text-[#780016]">₹2,000 – ₹2,999</span>
            <span className="text-[10px] text-indigo-900/60 mt-0.5">Jamdani A-Line Kurtas</span>
          </Link>

          <Link
            href="/shop?priceBracket=ABOVE_3000"
            className="group p-5 rounded-2xl bg-white border-2 border-kora-300 hover:border-[#780016] transition shadow-sm hover:shadow-md text-center flex flex-col items-center justify-center cursor-pointer"
          >
            <span className="w-12 h-12 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center text-xl font-black mb-2 group-hover:scale-110 transition">
              👑
            </span>
            <span className="text-sm font-bold text-indigo-950 group-hover:text-[#780016]">₹3,000 &amp; Above</span>
            <span className="text-[10px] text-indigo-900/60 mt-0.5">Pure Salem Temple Border Sarees</span>
          </Link>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. NEWSLETTER & WELCOME DISCOUNT (As requested by user) */}
      {/* ============================================================== */}
      <section className="py-12 bg-gradient-to-r from-[#780016] to-[#40000c] text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="bg-amber-400 text-indigo-950 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-3">
            SUBSCRIBE &amp; SAVE
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-black">
            Get Flat 10% Off On Your First Purchase
          </h2>
          <p className="text-xs sm:text-sm text-amber-100 mt-2 max-w-xl mx-auto leading-relaxed">
            Subscribe to our handloom story updates, secret flash sales, and new seasonal saree drop alerts. Use code{" "}
            <span className="font-mono font-bold text-white bg-black/30 px-2 py-0.5 rounded">WELCOME10</span> at checkout!
          </p>

          {subscribed ? (
            <div className="mt-6 bg-white/20 border border-amber-300 rounded-2xl p-4 max-w-md mx-auto text-amber-300 font-bold text-sm">
              🎉 Thank you for subscribing! Use coupon code <span className="underline">WELCOME10</span> to enjoy 10% off.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-4 py-3 rounded-full text-indigo-950 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white shadow-inner"
              />
              <button
                type="submit"
                className="bg-amber-400 hover:bg-amber-300 text-indigo-950 text-xs sm:text-sm font-bold tracking-wider uppercase px-6 py-3 rounded-full transition shadow-md hover:scale-105 active:scale-95 shrink-0"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 7. ARTISANAL COMMITMENT & PROMISE */}
      {/* ============================================================== */}
      <section className="py-12 bg-white border-t border-kora-300 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#780016] flex items-center justify-center shrink-0">
              <Feather className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-indigo-950 text-base">Direct From Master Weavers</h4>
              <p className="text-xs text-indigo-900/70 mt-1 leading-relaxed">
                No middle agents. We partner directly with weaver clusters in Salem, Chettinad, and Bengal, ensuring fair wages.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#780016] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-indigo-950 text-base">Handloom Mark Certified</h4>
              <p className="text-xs text-indigo-900/70 mt-1 leading-relaxed">
                Authentic chemical-free natural dyes, fermented plant indigo, and verified wooden loom weaves.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#780016] flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-indigo-950 text-base">Free Pan-India Shipping</h4>
              <p className="text-xs text-indigo-900/70 mt-1 leading-relaxed">
                Fast insured delivery across all 28 states &amp; UTs with easy exchange guarantee on standard sizes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
