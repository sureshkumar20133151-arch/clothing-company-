"use client";

import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export function FloatingWhatsApp() {
  const [tooltipVisible, setTooltipVisible] = useState(true);

  const phoneNumber = "919876543210";
  const defaultMessage = encodeURIComponent(
    "Namaste! 🙏 I'm visiting Indigo & Thread online store. I would like to know more about your Handloom Saree and Kurta collections."
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3 pointer-events-auto">
      {/* Tooltip speech bubble */}
      {tooltipVisible && (
        <div className="hidden sm:flex items-center gap-2 bg-white text-indigo-950 text-xs font-medium py-2 px-3.5 rounded-2xl shadow-xl border border-kora-300 animate-bounce duration-1000">
          <span>Need help styling or sizing? Chat with us!</span>
          <button
            onClick={() => setTooltipVisible(false)}
            className="text-indigo-900/40 hover:text-indigo-900 transition ml-1"
            aria-label="Dismiss message"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="group relative flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-400"></span>
        </span>
        <MessageCircle className="w-7 h-7 fill-white" />
      </a>
    </div>
  );
}
