"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Shirt,
  PlusCircle,
  Warehouse,
  ExternalLink,
  ShieldCheck,
  Ticket,
  MessageSquareQuote,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/orders", label: "Orders & Dispatch", icon: ShoppingCart },
    { href: "/products", label: "Apparel Catalog", icon: Shirt },
    { href: "/products/new", label: "Add Handloom Piece", icon: PlusCircle },
    { href: "/inventory", label: "Inventory Matrix", icon: Warehouse },
    { href: "/coupons", label: "Promo Coupons", icon: Ticket },
    { href: "/reviews", label: "Customer Reviews", icon: MessageSquareQuote },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 min-h-screen text-slate-300">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800">
        <Link href="/" className="block">
          <span className="text-xl font-serif font-bold text-amber-400 tracking-wider">
            INDIGO & THREAD
          </span>
          <span className="text-[10px] block text-slate-400 uppercase tracking-widest mt-0.5">
            Operations & Fulfillment
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5">
        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-3 mb-2">
          Management
        </div>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                isActive
                  ? "bg-amber-500 text-slate-950 shadow"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{link.label}</span>
            </Link>
          );
        })}

        <div className="pt-6">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-3 mb-2">
            Storefront
          </div>
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <span className="flex items-center gap-2">
              <Shirt className="w-4 h-4 text-amber-400" />
              Customer Web Shop
            </span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </nav>

      {/* Compliance Footer */}
      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-500 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
        <span>GST & HSN Compliant Billing (Tamil Nadu)</span>
      </div>
    </aside>
  );
}
