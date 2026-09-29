import React from "react";
import Link from "next/link";
import { ShieldCheck, Truck, RefreshCw, HeartHandshake } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-indigo-950 text-kora-200 border-t border-indigo-900 mt-auto">
      {/* Trust bar */}
      <div className="border-b border-indigo-900/60 py-8 bg-indigo-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <HeartHandshake className="w-6 h-6 text-terracotta-400 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-white">Direct Weaver Support</p>
              <p className="text-[11px] text-kora-300/70">Fair remuneration across Tamil Nadu & Bengal clusters</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-white">GST Invoicing & Genuine Cotton</p>
              <p className="text-[11px] text-kora-300/70">Tax compliant B2C invoices (5% & 12% apparel slabs)</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Truck className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-white">Pan-India Express Dispatch</p>
              <p className="text-[11px] text-kora-300/70">Delivered within 3-5 business days via trusted couriers</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RefreshCw className="w-6 h-6 text-indigo-300 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-white">7-Day Hassle-Free Exchange</p>
              <p className="text-[11px] text-kora-300/70">Easy size swap or returns right at your doorstep</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <span className="text-xl font-serif font-bold text-white tracking-wider">
              INDIGO <span className="text-terracotta-400">&</span> THREAD
            </span>
            <p className="text-xs text-kora-300/80 mt-3 leading-relaxed">
              Rooted in artisanal heritage, we craft pure handloom cotton and linen garments sourced directly from weavers in Tamil Nadu and Bengal, tailored for timeless comfort in the Indian climate.
            </p>
            <p className="text-xs text-amber-300 font-medium mt-3">GSTIN: 33AAAAA0000A1Z5 (Tamil Nadu)</p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Shop Collections</h4>
            <ul className="space-y-2 text-xs text-kora-300/80">
              <li><Link href="/shop?gender=MEN" className="hover:text-white transition">Men's Handloom Shirts</Link></li>
              <li><Link href="/shop?gender=MEN" className="hover:text-white transition">Linen & Khadi Kurtas</Link></li>
              <li><Link href="/shop?gender=WOMEN" className="hover:text-white transition">Women's Jamdani Kurtas</Link></li>
              <li><Link href="/shop?gender=WOMEN" className="hover:text-white transition">Salem Temple Cotton Sarees</Link></li>
              <li><Link href="/shop?gender=UNISEX" className="hover:text-white transition">Unisex Organic Stoles & Overlays</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Customer Care</h4>
            <ul className="space-y-2 text-xs text-kora-300/80">
              <li><Link href="/account" className="hover:text-white transition">Track Your Order</Link></li>
              <li><Link href="/shop" className="hover:text-white transition">Shipping Policy (Free above ₹1,500)</Link></li>
              <li><Link href="/shop" className="hover:text-white transition">Returns & Exchanges</Link></li>
              <li><Link href="/shop" className="hover:text-white transition">Apparel Sizing Guide</Link></li>
              <li><span className="text-kora-300/60">Email: orders@indigothread.in</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Artisanal Promise</h4>
            <p className="text-xs text-kora-300/80 leading-relaxed mb-3">
              We never use chemical sulfur baths for natural indigo. Hand-spun yarn, natural dyes, and coconut shell buttons reflect our devotion to sustainable Indian slow fashion.
            </p>
            <div className="flex gap-2">
              <span className="text-[10px] px-2 py-1 bg-indigo-900 rounded text-kora-200">Razorpay Secured</span>
              <span className="text-[10px] px-2 py-1 bg-indigo-900 rounded text-kora-200">COD Available</span>
            </div>
          </div>
        </div>

        <div className="border-t border-indigo-900 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-kora-300/60 gap-4">
          <p>© {new Date().getFullYear()} Indigo & Thread Pvt. Ltd. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/" className="hover:text-white transition">Terms of Service</Link>
            <Link href="/" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/" className="hover:text-white transition">GST & Tax Compliance</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
