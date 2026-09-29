"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, User, Search, Menu, X, ChevronDown, Sparkles, Heart } from "lucide-react";
import { useCartStore } from "../../store/useCartStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useWishlistStore } from "../../store/useWishlistStore";
import { formatINR } from "../../lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { getTotalQuantity, getSubtotal, openDrawer } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { items: wishlistItems } = useWishlistStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalQty = mounted ? getTotalQuantity() : 0;
  const subtotal = mounted ? getSubtotal() : 0;
  const wishlistCount = mounted ? wishlistItems.length : 0;

  return (
    <>
      {/* Top Notification Bar */}
      <div className="bg-indigo-950 text-kora-200 text-xs py-2 px-4 text-center tracking-wider uppercase font-medium flex items-center justify-center gap-2 border-b border-indigo-900/50">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>Free Shipping Across India on Orders Above ₹1,500 • Handloom Mark Certified</span>
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-kora-100/95 backdrop-blur-md border-b border-kora-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-indigo-950 hover:text-indigo-700"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo */}
          <div className="flex items-center space-x-10">
            <Link href="/" className="group flex flex-col">
              <span className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-indigo-950 group-hover:text-indigo-800 transition">
                INDIGO <span className="text-terracotta-500 font-sans font-light">&</span> THREAD
              </span>
              <span className="text-[9px] tracking-widest uppercase text-indigo-900/60 font-semibold -mt-1">
                Handloom • Pure Cotton • India
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-7 text-sm font-medium text-indigo-900">
              <Link
                href="/shop?gender=MEN"
                className={`hover:text-indigo-950 transition pb-1 border-b-2 ${
                  pathname.includes("MEN") ? "border-indigo-900 text-indigo-950" : "border-transparent"
                }`}
              >
                Men
              </Link>
              <Link
                href="/shop?gender=WOMEN"
                className={`hover:text-indigo-950 transition pb-1 border-b-2 ${
                  pathname.includes("WOMEN") ? "border-indigo-900 text-indigo-950" : "border-transparent"
                }`}
              >
                Women
              </Link>
              <Link
                href="/shop?category=bengal-salem-cotton-sarees"
                className="hover:text-indigo-950 transition pb-1 border-b-2 border-transparent"
              >
                Sarees
              </Link>
              <Link
                href="/shop?category=mens-handloom-shirts"
                className="hover:text-indigo-950 transition pb-1 border-b-2 border-transparent"
              >
                Artisanal Shirts
              </Link>
              <Link
                href="/shop"
                className="hover:text-indigo-950 transition pb-1 border-b-2 border-transparent"
              >
                All Apparel
              </Link>
            </nav>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* Search link */}
            <Link
              href="/shop"
              className="p-2 text-indigo-950 hover:text-indigo-700 transition"
              title="Search collection"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* Wishlist link */}
            <Link
              href="/wishlist"
              className="relative p-2 text-indigo-950 hover:text-indigo-700 transition"
              title="Saved Items / Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 inline-flex items-center justify-center bg-rose-500 text-white rounded-full text-[10px] font-bold w-4 h-4 shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Auth / Account */}
            {mounted && isAuthenticated && user ? (
              <div className="relative group">
                <Link
                  href="/account"
                  className="flex items-center gap-1.5 text-xs font-semibold text-indigo-950 hover:text-indigo-700 py-1.5 px-3 rounded-full bg-kora-200/80 border border-kora-300"
                >
                  <User className="w-4 h-4 text-terracotta-500" />
                  <span className="hidden sm:inline">{user.name.split(" ")[0]}</span>
                </Link>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-indigo-950 hover:text-indigo-700 px-3 py-1.5 rounded-full border border-kora-300 hover:border-indigo-900 transition"
              >
                Sign In
              </Link>
            )}

            {/* Cart Trigger */}
            <button
              onClick={openDrawer}
              className="relative inline-flex items-center gap-2 bg-indigo-950 hover:bg-indigo-900 text-white text-xs font-medium px-4 py-2.5 rounded-full transition shadow-sm hover:shadow"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline font-semibold">Cart</span>
              {totalQty > 0 && (
                <span className="inline-flex items-center justify-center bg-terracotta-500 text-white rounded-full text-[11px] font-bold px-1.5 py-0.2 min-w-4 h-4">
                  {totalQty}
                </span>
              )}
              {subtotal > 0 && (
                <span className="hidden lg:inline text-kora-300 border-l border-indigo-800 pl-2">
                  {formatINR(subtotal)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-kora-50 border-b border-kora-300 px-4 pt-3 pb-6 space-y-3">
            <Link
              href="/shop?gender=MEN"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-indigo-950 border-b border-kora-200"
            >
              Men's Handloom
            </Link>
            <Link
              href="/shop?gender=WOMEN"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-indigo-950 border-b border-kora-200"
            >
              Women's Kurtas & Sarees
            </Link>
            <Link
              href="/shop?category=bengal-salem-cotton-sarees"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-indigo-950 border-b border-kora-200"
            >
              Salem & Bengal Sarees
            </Link>
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-indigo-950 border-b border-kora-200"
            >
              Browse Full Catalog
            </Link>
            <div className="pt-2 flex gap-3">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-2 text-center text-sm font-semibold rounded-lg bg-kora-200 text-indigo-950"
                  >
                    My Account
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="py-2 px-4 text-sm font-medium rounded-lg text-rose-700 bg-rose-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-sm font-semibold rounded-lg bg-indigo-950 text-white"
                >
                  Customer Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
