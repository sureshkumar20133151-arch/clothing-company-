"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  User,
  Search,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Heart,
  ChevronRight,
  Tag,
  ArrowRight,
  Flame,
} from "lucide-react";
import { useCartStore } from "../../store/useCartStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useWishlistStore } from "../../store/useWishlistStore";
import { SearchBar } from "./SearchBar";

const ANNOUNCEMENTS = [
  { text: "🛍️ NEW ARRIVALS AVAILABLE NOW", link: "/shop?sort=newest" },
  { text: "✨ EXCLUSIVE OFFER: FLAT 10% OFF • USE CODE: WELCOME10", link: "/shop" },
  { text: "🚚 FREE SHIPPING ACROSS INDIA ON ORDERS ABOVE ₹1,499", link: "/shop" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [sareeDropdownOpen, setSareeDropdownOpen] = useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  const { getTotalQuantity, openDrawer } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const { items: wishlistItems } = useWishlistStore();

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const totalQty = mounted ? getTotalQuantity() : 0;
  const wishlistCount = mounted ? wishlistItems.length : 0;

  return (
    <>
      {/* 1. Top Announcement Bar (Maroon/Burgundy Banner as in Theni Anantham) */}
      <div className="bg-[#780016] text-white text-xs font-medium py-2 px-4 transition-all duration-500 overflow-hidden relative shadow-inner">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() =>
              setAnnouncementIndex((prev) => (prev - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length)
            }
            className="text-white/60 hover:text-white px-2 hidden sm:block text-sm"
            aria-label="Previous announcement"
          >
            ‹
          </button>

          <Link
            href={ANNOUNCEMENTS[announcementIndex].link}
            className="flex-1 text-center flex items-center justify-center gap-1.5 hover:underline tracking-wider uppercase text-[11px] sm:text-xs"
          >
            <span>{ANNOUNCEMENTS[announcementIndex].text}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>

          <button
            onClick={() => setAnnouncementIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length)}
            className="text-white/60 hover:text-white px-2 hidden sm:block text-sm"
            aria-label="Next announcement"
          >
            ›
          </button>
        </div>
      </div>

      {/* 2. Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-kora-300 shadow-sm transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-indigo-950 hover:text-indigo-700"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo (Regal Artisanal Badge) */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="group flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#780016] to-[#b3543b] text-amber-300 flex items-center justify-center font-serif font-black text-xl shadow-md border-2 border-amber-300/40">
                இ
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-serif font-extrabold tracking-tight text-indigo-950 group-hover:text-[#780016] transition leading-none">
                  INDIGO <span className="text-terracotta-500 font-sans font-light">&</span> THREAD
                </span>
                <span className="text-[9px] tracking-widest uppercase text-indigo-900/60 font-semibold mt-1">
                  Artisanal Handloom • India
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-6 text-[13px] font-semibold text-indigo-900 tracking-wide uppercase">
              {/* New Arrivals */}
              <Link
                href="/shop?sort=newest"
                className={`flex items-center gap-1 hover:text-[#780016] transition pb-1 border-b-2 ${
                  pathname.includes("sort=newest") ? "border-[#780016] text-[#780016]" : "border-transparent"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                New Arrivals
              </Link>

              {/* Best Sellers */}
              <Link
                href="/shop?featured=true"
                className={`flex items-center gap-1 hover:text-[#780016] transition pb-1 border-b-2 ${
                  pathname.includes("featured=true") ? "border-[#780016] text-[#780016]" : "border-transparent"
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-rose-500" />
                Best Sellers
              </Link>

              {/* Sarees Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => setSareeDropdownOpen(true)}
                onMouseLeave={() => setSareeDropdownOpen(false)}
              >
                <Link
                  href="/shop?category=bengal-salem-cotton-sarees"
                  className="flex items-center gap-1 hover:text-[#780016] transition pb-1 border-b-2 border-transparent py-4"
                >
                  <span>Sarees</span>
                  <ChevronDown className="w-3.5 h-3.5 transition group-hover:rotate-180" />
                </Link>

                {/* Saree Dropdown Menu */}
                {sareeDropdownOpen && (
                  <div className="absolute top-full left-0 w-72 bg-white rounded-2xl shadow-2xl border border-kora-300 py-3 px-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <Link
                      href="/shop?category=bengal-salem-cotton-sarees"
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-kora-100 text-indigo-950 font-medium transition text-xs"
                    >
                      <div>
                        <div className="font-bold">Salem Temple Border Sarees</div>
                        <div className="text-[10px] text-indigo-900/60 lowercase">Pure Korvai 3-shuttle cotton</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-indigo-400" />
                    </Link>
                    <Link
                      href="/shop?category=womens-handloom-kurtas"
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-kora-100 text-indigo-950 font-medium transition text-xs"
                    >
                      <div>
                        <div className="font-bold">Phulia Jamdani Handloom</div>
                        <div className="text-[10px] text-indigo-900/60 lowercase">80s count hand-inlaid motifs</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-indigo-400" />
                    </Link>
                    <Link
                      href="/shop?gender=WOMEN"
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-kora-100 text-indigo-950 font-medium transition text-xs"
                    >
                      <div>
                        <div className="font-bold">All Women&apos;s Festive Wear</div>
                        <div className="text-[10px] text-indigo-900/60 lowercase">Sarees, kurtas &amp; dupattas</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-indigo-400" />
                    </Link>
                    <div className="border-t border-kora-200 mt-1 pt-1.5 px-2.5">
                      <Link
                        href="/shop?category=bengal-salem-cotton-sarees"
                        className="text-[11px] font-bold text-[#780016] hover:underline flex items-center gap-1"
                      >
                        View All Sarees <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Men's Collection */}
              <Link
                href="/shop?gender=MEN"
                className={`hover:text-[#780016] transition pb-1 border-b-2 ${
                  pathname.includes("MEN") ? "border-[#780016] text-[#780016]" : "border-transparent"
                }`}
              >
                Men&apos;s Collection
              </Link>

              {/* Ready Made */}
              <Link
                href="/shop?gender=WOMEN"
                className={`hover:text-[#780016] transition pb-1 border-b-2 ${
                  pathname.includes("WOMEN") ? "border-[#780016] text-[#780016]" : "border-transparent"
                }`}
              >
                Ready Made
              </Link>

              {/* Sale */}
              <Link
                href="/shop?onSale=true"
                className="flex items-center gap-1 text-rose-600 hover:text-rose-700 transition font-bold"
              >
                <Tag className="w-3.5 h-3.5" />
                Sale
              </Link>
            </nav>
          </div>

          {/* Right Action Icons (Matching Theni Anantham header) */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Currency Selector Pill */}
            <div className="hidden md:flex items-center gap-1 text-[11px] font-bold tracking-wider text-indigo-900 bg-kora-200/80 px-2.5 py-1 rounded-full border border-kora-300">
              <span>India | INR ₹</span>
            </div>

            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-indigo-950 hover:text-[#780016] transition"
              title="Search collection"
              aria-label="Search collection"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              className="relative p-2 text-indigo-950 hover:text-[#780016] transition"
              title="Saved Wishlist"
              aria-label="Saved Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 inline-flex items-center justify-center bg-rose-500 text-white rounded-full text-[10px] font-bold w-4 h-4 shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Account Profile */}
            {mounted && isAuthenticated && user ? (
              <Link
                href="/account"
                className="flex items-center gap-1.5 text-xs font-bold text-indigo-950 hover:text-[#780016] py-1.5 px-3 rounded-full bg-kora-200/80 border border-kora-300"
              >
                <User className="w-4 h-4 text-terracotta-500" />
                <span className="hidden sm:inline">{user.name.split(" ")[0]}</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="p-2 text-indigo-950 hover:text-[#780016] transition"
                title="Sign In / Register"
                aria-label="Sign In"
              >
                <User className="w-5 h-5" />
              </Link>
            )}

            {/* Shopping Bag Cart Icon */}
            <button
              onClick={openDrawer}
              className="relative p-2 text-indigo-950 hover:text-[#780016] transition"
              title="View Cart"
              aria-label="Shopping bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalQty > 0 && (
                <span className="absolute top-1 right-1 inline-flex items-center justify-center bg-[#780016] text-white rounded-full text-[10px] font-bold w-4 h-4 shadow-sm">
                  {totalQty}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar Flyout */}
        {searchOpen && (
          <div className="border-t border-kora-300 bg-white py-4 px-4 sm:px-6 lg:px-8 animate-in slide-in-from-top duration-200">
            <div className="max-w-3xl mx-auto flex items-center gap-3">
              <div className="flex-1">
                <SearchBar onClose={() => setSearchOpen(false)} isModal />
              </div>
              <button
                onClick={() => setSearchOpen(false)}
                className="p-2 text-indigo-900/60 hover:text-indigo-950"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-kora-300 bg-white py-4 px-6 space-y-3 shadow-xl">
            <div className="pb-3 border-b border-kora-200">
              <SearchBar onClose={() => setMobileMenuOpen(false)} />
            </div>

            <nav className="flex flex-col space-y-2.5 text-sm font-semibold uppercase tracking-wider text-indigo-950">
              <Link
                href="/shop?sort=newest"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-[#780016]"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                New Arrivals
              </Link>
              <Link
                href="/shop?featured=true"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-rose-600"
              >
                <Flame className="w-4 h-4 text-rose-500" />
                Best Sellers
              </Link>
              <Link
                href="/shop?category=bengal-salem-cotton-sarees"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2"
              >
                Sarees (Salem &amp; Jamdani)
              </Link>
              <Link
                href="/shop?gender=MEN"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2"
              >
                Men&apos;s Collection
              </Link>
              <Link
                href="/shop?gender=WOMEN"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2"
              >
                Ready Made / Women
              </Link>
              <Link
                href="/shop?onSale=true"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-rose-600 font-bold"
              >
                Special Offers &amp; Sale
              </Link>
            </nav>

            <div className="pt-4 border-t border-kora-200 flex items-center justify-between text-xs font-semibold text-indigo-900">
              <span>Currency: INR (₹)</span>
              {mounted && isAuthenticated ? (
                <Link href="/account" onClick={() => setMobileMenuOpen(false)} className="text-[#780016]">
                  My Account ({user?.name.split(" ")[0]})
                </Link>
              ) : (
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-[#780016]">
                  Sign In / Register
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
