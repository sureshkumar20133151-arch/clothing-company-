import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "../providers/query-provider";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { CartDrawer } from "../components/cart/CartDrawer";

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
      <body className="min-h-screen bg-kora-100 text-indigo-950 antialiased flex flex-col">
        <QueryProvider>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
          <CartDrawer />
        </QueryProvider>
      </body>
    </html>
  );
}
