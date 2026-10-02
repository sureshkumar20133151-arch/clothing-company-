"use client";

import React, { useState } from "react";
import { Tag, Check, X } from "lucide-react";

export function CouponNotification() {
  const [copied, setCopied] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const copyCode = () => {
    navigator.clipboard.writeText("WELCOME10");
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <aside
      aria-label="Promotional offer"
      className="fixed bottom-6 left-6 z-40 max-w-sm bg-indigo-950 text-white rounded-2xl p-4 shadow-2xl border border-amber-400/30 flex items-center gap-3.5 backdrop-blur-md animate-fade-in"
    >
      <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
        <Tag className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
          First Order Offer • Flat 10% OFF
        </p>
        <p className="text-xs text-kora-200 truncate mt-0.5">
          Use code <span className="font-mono font-bold text-white tracking-widest bg-indigo-900/80 px-1.5 py-0.5 rounded border border-indigo-700">WELCOME10</span>
        </p>
      </div>

      <button
        onClick={copyCode}
        className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-indigo-950 text-xs font-bold transition shrink-0 flex items-center gap-1 shadow-sm"
        title="Copy coupon code"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-700" />
            <span>Copied!</span>
          </>
        ) : (
          <span>Copy</span>
        )}
      </button>

      <button
        onClick={() => setDismissed(true)}
        className="text-kora-200/50 hover:text-white transition p-1"
        aria-label="Dismiss coupon notification"
      >
        <X className="w-4 h-4" />
      </button>
    </aside>
  );
}
