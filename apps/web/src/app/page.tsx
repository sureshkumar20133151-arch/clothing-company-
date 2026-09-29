import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Truck, Feather } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Banner */}
      <div className="bg-indigo-900 text-kora-100 text-xs py-2 px-4 text-center tracking-wider uppercase font-medium">
        Free Shipping across India on orders above ₹1,500 • Authentic Handloom Mark Certified
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-kora-50/90 backdrop-blur-md border-b border-kora-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-serif font-bold tracking-tight text-indigo-950">
              INDIGO <span className="text-terracotta-500 font-sans font-light">&</span> THREAD
            </Link>
            <nav className="hidden md:flex space-x-6 text-sm font-medium text-indigo-900/80">
              <Link href="/men" className="hover:text-indigo-950 transition">Men</Link>
              <Link href="/women" className="hover:text-indigo-950 transition">Women</Link>
              <Link href="/sarees" className="hover:text-indigo-950 transition">Sarees</Link>
              <Link href="/craft" className="hover:text-indigo-950 transition">Our Craft</Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4 text-sm font-medium">
            <Link
              href="/login"
              className="text-indigo-900 hover:text-indigo-950 px-3 py-1.5 transition"
            >
              Sign In
            </Link>
            <Link
              href="/cart"
              className="bg-indigo-900 hover:bg-indigo-950 text-white px-4 py-2 rounded-full transition shadow-sm"
            >
              Cart (₹0)
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative bg-gradient-to-b from-kora-100 to-kora-200 py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100/70 border border-indigo-200 text-indigo-900 text-xs font-semibold tracking-wide uppercase mb-6">
              <Sparkles className="w-3.5 h-3.5 text-terracotta-500" />
              Handloom Cotton & Pure Linen • Direct From Weavers
            </div>
            <h1 className="text-4xl sm:text-6xl font-serif font-bold text-indigo-950 tracking-tight leading-tight mb-6">
              Rooted in Artisanal Heritage, <br className="hidden sm:inline" />
              Cut for Everyday Indian Ease.
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-indigo-900/80 mb-10 leading-relaxed">
              We source authentic handloom cotton and linen directly from master weaver clusters in Tamil Nadu, Bengal, and Andhra Pradesh. Pure natural dyes, lightweight breathable weaves, tailored for timeless comfort.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/shop/men"
                className="bg-indigo-900 text-white hover:bg-indigo-950 px-8 py-3.5 rounded-full font-medium transition inline-flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                Explore Men's Collection <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/shop/women"
                className="bg-terracotta-500 text-white hover:bg-terracotta-600 px-8 py-3.5 rounded-full font-medium transition inline-flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                Explore Women's Kurtas & Sarees <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Brand Pillars */}
        <section className="py-16 bg-kora-50 border-y border-kora-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-start space-x-4 p-6 bg-white rounded-2xl border border-kora-300 shadow-sm">
                <div className="p-3 bg-indigo-50 text-indigo-900 rounded-xl">
                  <Feather className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-lg text-indigo-950 mb-1">100% Handloom Cotton</h3>
                  <p className="text-sm text-indigo-800/80 leading-relaxed">
                    Woven on traditional wooden shuttle looms. Open breathable structure ideal for tropical weather.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-white rounded-2xl border border-kora-300 shadow-sm">
                <div className="p-3 bg-terracotta-50 text-terracotta-600 rounded-xl">
                  <ShieldCheck className="w-6 h-6 text-terracotta-500" />
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-lg text-indigo-950 mb-1">GST & Fair Trade Compliant</h3>
                  <p className="text-sm text-indigo-800/80 leading-relaxed">
                    Clear transparent Indian GST billing (5% / 12% slabs) with direct compensation to artisan clusters.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-white rounded-2xl border border-kora-300 shadow-sm">
                <div className="p-3 bg-ochre-50 text-ochre-600 rounded-xl">
                  <Truck className="w-6 h-6 text-ochre-500" />
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-lg text-indigo-950 mb-1">Pan-India Express & COD</h3>
                  <p className="text-sm text-indigo-800/80 leading-relaxed">
                    Razorpay UPI/Cards and Cash on Delivery available across 19,000+ Indian PIN codes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-indigo-950 text-kora-200 py-12 border-t border-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-serif font-bold text-white tracking-wide">INDIGO & THREAD</h2>
            <p className="text-xs text-kora-300/80 mt-1">Tamil Nadu • Bengal • Andhra Pradesh Artisanal Weaves</p>
          </div>
          <div className="text-xs text-kora-300/60">
            © {new Date().getFullYear()} Indigo & Thread Pvt. Ltd. All rights reserved. Prices in INR (₹) inclusive of GST.
          </div>
        </div>
      </footer>
    </div>
  );
}
