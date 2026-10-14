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
      {/* 1. Header (Navbar) - Naachiyars Style */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm transition">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-800 hover:text-black"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Naachiyars Style Brand Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Geometric warm orange/mustard stepped logo mark */}
            <div className="flex flex-col gap-0.5 justify-center">
              <div className="flex gap-0.5">
                <div className="w-2.5 h-4 bg-[#e57a22] transform -skew-y-12 rounded-sm" />
                <div className="w-2.5 h-6 bg-[#f39c12] transform -skew-y-12 rounded-sm -mt-1" />
                <div className="w-2.5 h-4 bg-[#e57a22] transform -skew-y-12 rounded-sm" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-[#780016] font-sans">
                  NAACHIYARS
                </span>
                <span className="text-[10px] text-gray-500 font-bold ml-0.5 align-super">®</span>
              </div>
              <span className="text-[8px] sm:text-[9px] tracking-wider text-gray-700 font-medium -mt-0.5">
                Silk | Textiles | Readymade
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Exact from User Screenshot) */}
          <nav className="hidden lg:flex items-center space-x-7 text-[13px] font-semibold text-gray-800">
            {/* Home */}
            <Link
              href="/"
              className={`hover:text-[#780016] transition pb-1 border-b-2 ${
                pathname === "/" ? "border-gray-900 text-black font-bold" : "border-transparent text-gray-700"
              }`}
            >
              Home
            </Link>

            {/* Silk Saree */}
            <Link
              href="/shop?category=bengal-salem-cotton-sarees"
              className="hover:text-[#780016] transition text-gray-700 hover:font-semibold"
            >
              Silk Saree
            </Link>

            {/* Sarees Dropdown */}
            <div
              className="relative group py-4"
              onMouseEnter={() => setSareeDropdownOpen(true)}
              onMouseLeave={() => setSareeDropdownOpen(false)}
            >
              <Link
                href="/shop?category=bengal-salem-cotton-sarees"
                className="flex items-center gap-1 hover:text-[#780016] transition text-gray-700"
              >
                <span>Sarees</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500 transition group-hover:rotate-180" />
              </Link>

              {sareeDropdownOpen && (
                <div className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2.5 px-2 z-50 animate-in fade-in slide-in-from-top-1">
                  <Link
                    href="/shop?category=bengal-salem-cotton-sarees"
                    className="block px-3 py-2 text-xs font-medium text-gray-700 hover:bg-amber-50 hover:text-[#780016] rounded-lg transition"
                  >
                    Kanchipuram Pure Silk Sarees
                  </Link>
                  <Link
                    href="/shop?category=bengal-salem-cotton-sarees"
                    className="block px-3 py-2 text-xs font-medium text-gray-700 hover:bg-amber-50 hover:text-[#780016] rounded-lg transition"
                  >
                    Banaras Digital &amp; Soft Silk
                  </Link>
                  <Link
                    href="/shop?category=bengal-salem-cotton-sarees"
                    className="block px-3 py-2 text-xs font-medium text-gray-700 hover:bg-amber-50 hover:text-[#780016] rounded-lg transition"
                  >
                    Salem Temple Border Sarees
                  </Link>
                  <Link
                    href="/shop?category=bengal-salem-cotton-sarees"
                    className="block px-3 py-2 text-xs font-medium text-gray-700 hover:bg-amber-50 hover:text-[#780016] rounded-lg transition"
                  >
                    Bridal Tissue Silk Sarees
                  </Link>
                </div>
              )}
            </div>

            {/* Heritage Cottons Dropdown */}
            <div className="relative group py-4">
              <Link
                href="/shop?category=bengal-salem-cotton-sarees"
                className="flex items-center gap-1 hover:text-[#780016] transition text-gray-700"
              >
                <span>Heritage Cottons</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500 transition group-hover:rotate-180" />
              </Link>
              <div className="hidden group-hover:block absolute top-full left-0 w-60 bg-white rounded-xl shadow-xl border border-gray-100 py-2.5 px-2 z-50">
                <Link
                  href="/shop?category=bengal-salem-cotton-sarees"
                  className="block px-3 py-2 text-xs font-medium text-gray-700 hover:bg-amber-50 hover:text-[#780016] rounded-lg"
                >
                  Chettinad Cotton Sarees
                </Link>
                <Link
                  href="/shop?category=bengal-salem-cotton-sarees"
                  className="block px-3 py-2 text-xs font-medium text-gray-700 hover:bg-amber-50 hover:text-[#780016] rounded-lg"
                >
                  Bengal Handloom Cottons
                </Link>
                <Link
                  href="/shop?category=bengal-salem-cotton-sarees"
                  className="block px-3 py-2 text-xs font-medium text-gray-700 hover:bg-amber-50 hover:text-[#780016] rounded-lg"
                >
                  Jaipur Hand Block Prints
                </Link>
              </div>
            </div>

            {/* Cotton Collective Dropdown */}
            <div className="relative group py-4">
              <Link
                href="/shop?category=womens-handloom-kurtas"
                className="flex items-center gap-1 hover:text-[#780016] transition text-gray-700"
              >
                <span>Cotton Collective</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500 transition group-hover:rotate-180" />
              </Link>
              <div className="hidden group-hover:block absolute top-full left-0 w-60 bg-white rounded-xl shadow-xl border border-gray-100 py-2.5 px-2 z-50">
                <Link
                  href="/shop?category=womens-handloom-kurtas"
                  className="block px-3 py-2 text-xs font-medium text-gray-700 hover:bg-amber-50 hover:text-[#780016] rounded-lg"
                >
                  Everyday Cotton Kurtis
                </Link>
                <Link
                  href="/shop?category=womens-handloom-kurtas"
                  className="block px-3 py-2 text-xs font-medium text-gray-700 hover:bg-amber-50 hover:text-[#780016] rounded-lg"
                >
                  Cotton Dupattas &amp; Stoles
                </Link>
              </div>
            </div>

            {/* Unstitched Suits */}
            <Link
              href="/shop?gender=WOMEN"
              className="hover:text-[#780016] transition text-gray-700 hover:font-semibold"
            >
              Unstitched Suits
            </Link>

            {/* Mens Dothi */}
            <Link
              href="/shop?gender=MEN"
              className="hover:text-[#780016] transition text-gray-700 hover:font-semibold"
            >
              Mens Dothi
            </Link>
          </nav>

          {/* Right Action Icons (Search, User, Cart - Naachiyars style clean outline) */}
          <div className="flex items-center space-x-3 sm:space-x-5 text-gray-800">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-1 hover:text-[#780016] transition"
              title="Search collection"
              aria-label="Search collection"
            >
              <Search className="w-5 h-5 stroke-[1.8]" />
            </button>

            {/* Account Profile */}
            {mounted && isAuthenticated && user ? (
              <Link
                href="/account"
                className="flex items-center gap-1 p-1 hover:text-[#780016] transition text-xs font-medium"
              >
                <User className="w-5 h-5 stroke-[1.8]" />
                <span className="hidden xl:inline">{user.name.split(" ")[0]}</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="p-1 hover:text-[#780016] transition"
                title="Sign In / Register"
                aria-label="Sign In"
              >
                <User className="w-5 h-5 stroke-[1.8]" />
              </Link>
            )}

            {/* Shopping Bag Cart Icon */}
            <button
              onClick={openDrawer}
              className="relative p-1 hover:text-[#780016] transition"
              title="View Cart"
              aria-label="Shopping bag"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
              {totalQty > 0 && (
                <span className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center bg-[#780016] text-white rounded-full text-[10px] font-bold w-4 h-4 shadow-sm">
                  {totalQty}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 2. Slim Maroon Banner strip right under the navbar (Exact from Naachiyars Screenshot) */}
        <div className="bg-[#6b1426] text-white text-center py-2 px-4 shadow-inner">
          <p className="text-xs sm:text-sm font-medium tracking-wide">
            Prepaid orders only. 100% secure payments
          </p>
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
