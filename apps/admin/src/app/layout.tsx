import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "../providers/query-provider";
import { AdminSidebar } from "../components/layout/AdminSidebar";
import { AdminNavbar } from "../components/layout/AdminNavbar";

export const metadata: Metadata = {
  title: "Operations & Admin Portal | Indigo & Thread",
  description:
    "E-Commerce Fulfillment, Handloom Inventory & Indian GST Invoicing for Indigo & Thread.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased flex">
        <QueryProvider>
          <AdminSidebar />
          <div className="flex-1 flex flex-col min-w-0 bg-slate-900/50">
            <AdminNavbar />
            <main className="flex-1 p-6 sm:p-8 overflow-y-auto">{children}</main>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
