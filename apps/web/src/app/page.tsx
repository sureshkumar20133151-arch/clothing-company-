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
      {/* 1. CIRCULAR STORY / CATEGORY BUBBLES (Instagram / Modern Mobile Style) */}
      {/* ============================================================== */}
      <section className="bg-white border-b border-kora-300 py-4 px-4 sm:px-6 lg:px-8 overflow-x-auto no-scrollbar shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-start sm:justify-center gap-4 sm:gap-8 min-w-max">
          {CIRCULAR_STORIES.map((story) => (
            <Link
              key={story.title}
              href={story.href}
              className="group flex flex-col items-center text-center cursor-pointer transition transform hover:-translate-y-1"
            >
              <div className="relative p-1 rounded-full bg-gradient-to-tr from-[#780016] via-amber-400 to-[#b3543b] shadow-md group-hover:shadow-lg transition">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-white bg-kora-200">
                  <img
                    src={story.img}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                </div>
                {story.badge && (
                  <span className="absolute -bottom-1 -right-1 bg-[#780016] text-amber-300 text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded-full border border-amber-300 shadow">
                    {story.badge}
                  </span>
                )}
              </div>
              <span className="mt-2 text-xs font-bold text-indigo-950 group-hover:text-[#780016] transition">
                {story.title}
              </span>
              <span className="text-[10px] text-indigo-900/60 font-medium">{story.tag}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. GRAND HERO BANNER SLIDER (Themed from Theni Anantham & Pothys) */}
      {/* ============================================================== */}
      <section className="relative overflow-hidden bg-[#200008] text-white py-10 sm:py-16 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-400 transition-all duration-700">
        {/* Background Image with Deep Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 opacity-20 filter blur-[1px]"
          style={{ backgroundImage: `url(${slide.bannerBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1c0006] via-[#3d000c]/90 to-[#1c0006]/95 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Model Showcase (Real reference models) */}
          <div className="hidden lg:grid col-span-3 grid-cols-2 gap-3">
            <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-400/50 transform -rotate-1 hover:rotate-0 transition duration-500 group bg-black/40">
              <div className="w-full h-72 overflow-hidden">
                <img
                  src={slide.model1.img}
                  alt={slide.model1.tag}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-2 bg-[#780016] text-center text-[10px] font-bold text-amber-300 tracking-wider">
                {slide.model1.tag}
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-400/50 transform rotate-2 hover:rotate-0 transition duration-500 mt-6 group bg-black/40">
              <div className="w-full h-72 overflow-hidden">
                <img
                  src={slide.model2.img}
                  alt={slide.model2.tag}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-2 bg-[#780016] text-center text-[10px] font-bold text-amber-300 tracking-wider">
                {slide.model2.tag}
              </div>
            </div>
          </div>

          {/* Center Main Headline & Grand Offer Emblem (Like Theni Anantham) */}
          <div className="col-span-1 lg:col-span-6 text-center flex flex-col items-center">
            {/* Slider Switcher Dots */}
            <div className="flex items-center gap-2 mb-3">
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentSlide === idx ? "w-8 bg-amber-400" : "w-2 bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Upper Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 border border-amber-300/50 text-amber-300 text-xs font-bold tracking-widest uppercase mb-4 shadow">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{slide.badge}</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </div>

            {/* Regal Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight leading-tight text-white uppercase drop-shadow-md">
              {slide.title}
            </h1>

            {/* Cursive Subtitle */}
            <p className="font-serif italic text-2xl sm:text-3xl text-amber-200 mt-1 mb-2 tracking-wide font-normal">
              {slide.italicSub}
            </p>

            <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-white/80 mb-6">
              {slide.tagline}
            </p>

            {/* Center Royal Gold / Maroon Discount Badge (Exact copy of screenshot badge) */}
            <div className="relative bg-gradient-to-b from-[#3a000b] to-[#1a0005] border-2 border-amber-400 rounded-3xl p-6 sm:p-8 shadow-2xl max-w-md w-full my-2 text-center group">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-indigo-950 text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-md">
                EXCLUSIVE OFFER
              </div>

              <div className="text-3xl sm:text-4xl font-serif font-black text-amber-300 tracking-tight my-1">
                {slide.offerTitle}
              </div>

              <div className="mt-3 flex items-center justify-center gap-2">
                <span className="text-xs text-amber-100 font-medium">USE CODE:</span>
                <span className="bg-[#780016] border border-amber-300/60 text-amber-300 font-mono font-black text-base px-3 py-1 rounded-lg tracking-widest">
                  WELCOME10
                </span>
                <button
                  onClick={handleCopy}
                  className="bg-amber-400 hover:bg-amber-300 text-indigo-950 p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1"
                  title="Copy Code"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-800" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {copiedCode && (
                <p className="text-[11px] text-amber-300 font-bold mt-2 animate-pulse">
                  ✓ Code WELCOME10 copied to clipboard!
                </p>
              )}
            </div>

            {/* Action Buttons & Prev/Next Arrows */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1))}
                className="w-10 h-10 rounded-full border border-white/30 bg-black/40 hover:bg-[#780016] text-white flex items-center justify-center transition"
                title="Previous Slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <Link
                href={slide.primaryCta.href}
                className="bg-amber-400 text-indigo-950 hover:bg-amber-300 px-8 py-3.5 rounded-full font-bold transition text-xs sm:text-sm tracking-wider uppercase inline-flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95"
              >
                {slide.primaryCta.label} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={slide.secondaryCta.href}
                className="bg-white/10 hover:bg-white/20 border-2 border-white/40 text-white px-8 py-3.5 rounded-full font-bold transition text-xs sm:text-sm tracking-wider uppercase inline-flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95"
              >
                {slide.secondaryCta.label} <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
                className="w-10 h-10 rounded-full border border-white/30 bg-black/40 hover:bg-[#780016] text-white flex items-center justify-center transition"
                title="Next Slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Model Showcase (Real reference models) */}
          <div className="hidden lg:grid col-span-3 grid-cols-2 gap-3">
            <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-400/50 transform -rotate-2 hover:rotate-0 transition duration-500 group bg-black/40">
              <div className="w-full h-72 overflow-hidden">
                <img
                  src={slide.model3.img}
                  alt={slide.model3.tag}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-2 bg-[#780016] text-center text-[10px] font-bold text-amber-300 tracking-wider">
                {slide.model3.tag}
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-400/50 transform rotate-1 hover:rotate-0 transition duration-500 mt-6 group bg-black/40">
              <div className="w-full h-72 overflow-hidden">
                <img
                  src={slide.model4.img}
                  alt={slide.model4.tag}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-2 bg-[#780016] text-center text-[10px] font-bold text-amber-300 tracking-wider">
                {slide.model4.tag}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom 4 Feature Pillars (Exact match from screenshot footer) */}
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="flex flex-col items-center justify-center p-2">
            <span className="text-2xl mb-1">🌿</span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">PREMIUM FABRICS</span>
            <span className="text-[10px] text-white/70">100% Handloom Cotton &amp; Silk</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2">
            <span className="text-2xl mb-1">✨</span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">TRENDING DESIGNS</span>
            <span className="text-[10px] text-white/70">Rooted Heritage &amp; Modern Cuts</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2">
            <span className="text-2xl mb-1">🪡</span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">EVERY OCCASION</span>
            <span className="text-[10px] text-white/70">Festive, Casual &amp; Bridal</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2">
            <span className="text-2xl mb-1">🛡️</span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">TRUSTED QUALITY</span>
            <span className="text-[10px] text-white/70">Handloom Mark Certified</span>
          </div>
        </div>
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
