import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "../providers/query-provider";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { CartDrawer } from "../components/cart/CartDrawer";
import { FloatingWhatsApp } from "../components/layout/FloatingWhatsApp";
import { CouponNotification } from "../components/layout/CouponNotification";

export const metadata: Metadata = {
  title: "Indigo & Thread | Artisanal Handloom Clothing India",
  description:
    "Rooted in artisanal heritage, Indigo & Thread crafts authentic handloom cotton and linen apparel sourced directly from master weavers across Tamil Nadu, Bengal, and Andhra Pradesh.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#faf8f5] text-indigo-950 antialiased flex flex-col font-sans selection:bg-[#780016] selection:text-white">
        <QueryProvider>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
          <CartDrawer />
          <FloatingWhatsApp />
          <CouponNotification />
        </QueryProvider>
      </body>
    </html>
  );
}
