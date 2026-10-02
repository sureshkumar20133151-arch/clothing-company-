import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Truck, Feather, HeartHandshake } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-kora-100 via-kora-100 to-kora-200 py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100/70 border border-indigo-200 text-indigo-900 text-xs font-semibold tracking-wide uppercase mb-6">
              <Sparkles className="w-3.5 h-3.5 text-terracotta-500" />
              Handloom Cotton & Pure Linen • Direct From Weavers
            </div>
            <h1 className="text-4xl sm:text-6xl font-serif font-bold text-indigo-950 tracking-tight leading-tight mb-6">
              Rooted in Artisanal Heritage, <br className="hidden sm:inline" />
              Cut for Everyday Indian Ease.
            </h1>
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-indigo-900/80 mb-10 leading-relaxed">
              We source authentic handloom cotton and linen directly from master weaver clusters in Tamil Nadu, Bengal, and Andhra Pradesh. Pure natural dyes, lightweight breathable weaves, tailored for timeless comfort.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/shop?gender=MEN"
                className="bg-indigo-950 text-white hover:bg-indigo-900 px-8 py-3.5 rounded-full font-medium transition inline-flex items-center gap-2 shadow-md hover:shadow-lg text-sm"
              >
                Explore Men&apos;s Collection <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/shop?gender=WOMEN"
                className="bg-terracotta-500 text-white hover:bg-terracotta-600 px-8 py-3.5 rounded-full font-medium transition inline-flex items-center gap-2 shadow-md hover:shadow-lg text-sm"
              >
                Explore Women&apos;s Kurtas & Sarees <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/shop"
                className="bg-white text-indigo-950 hover:bg-kora-100 border border-kora-300 px-8 py-3.5 rounded-full font-medium transition inline-flex items-center gap-2 shadow-sm text-sm"
              >
                View Full Catalog
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Collections Spotlight */}
        <section className="py-16 bg-white border-b border-kora-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-terracotta-600 block mb-1">
                  Artisanal Showcase
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-indigo-950">
                  Featured Handloom Weaves
                </h2>
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-900 hover:text-indigo-950 hover:underline"
              >
                View all artisanal pieces <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Category Card 1 */}
              <Link
                href="/shop?category=mens-handloom-shirts"
                className="group relative rounded-3xl overflow-hidden aspect-[4/5] bg-kora-200 border border-kora-300 shadow-sm block"
              >
                <img
                  src="https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80"
                  alt="Men's Handloom Shirts"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/80 via-indigo-950/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 mb-1">
                    Salem Pit-Looms
                  </span>
                  <h3 className="text-lg font-serif font-bold">Men&apos;s Handloom Shirts</h3>
                  <p className="text-xs text-kora-200/80 mt-1">60s count organic cotton with coconut shell buttons</p>
                </div>
              </Link>

              {/* Category Card 2 */}
              <Link
                href="/shop?category=womens-handloom-kurtas"
                className="group relative rounded-3xl overflow-hidden aspect-[4/5] bg-kora-200 border border-kora-300 shadow-sm block"
              >
                <img
                  src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80"
                  alt="Women's Jamdani Kurtas"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/80 via-indigo-950/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 mb-1">
                    Phulia, Bengal
                  </span>
                  <h3 className="text-lg font-serif font-bold">Women&apos;s Jamdani Kurtas</h3>
                  <p className="text-xs text-kora-200/80 mt-1">Supplementary weft motifs inlaid by master artisans</p>
                </div>
              </Link>

              {/* Category Card 3 */}
              <Link
                href="/shop?category=bengal-salem-cotton-sarees"
                className="group relative rounded-3xl overflow-hidden aspect-[4/5] bg-kora-200 border border-kora-300 shadow-sm block sm:col-span-2 lg:col-span-1"
              >
                <img
                  src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
                  alt="Salem Temple Cotton Sarees"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/80 via-indigo-950/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 mb-1">
                    Tamil Nadu Heritage
                  </span>
                  <h3 className="text-lg font-serif font-bold">Cotton Sarees &amp; Stoles</h3>
                  <p className="text-xs text-kora-200/80 mt-1">Lightweight zari borders with chemical-free natural indigo</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Brand Pillars */}
        <section className="py-16 bg-kora-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-start space-x-4 p-6 bg-white rounded-2xl border border-kora-300 shadow-sm">
                <div className="p-3 bg-indigo-50 text-indigo-900 rounded-xl">
                  <Feather className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-lg text-indigo-950 mb-1">100% Handloom Cotton</h3>
                  <p className="text-sm text-indigo-800/80 leading-relaxed">
                    Woven on traditional wooden shuttle looms. Open breathable structure ideal for tropical Indian weather.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-white rounded-2xl border border-kora-300 shadow-sm">
                <div className="p-3 bg-terracotta-50 text-terracotta-600 rounded-xl">
                  <ShieldCheck className="w-6 h-6 text-terracotta-500" />
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-lg text-indigo-950 mb-1">GST &amp; Fair Trade Compliant</h3>
                  <p className="text-sm text-indigo-800/80 leading-relaxed">
                    Clear transparent Indian GST billing (5% / 12% slabs) with direct compensation to artisan cooperatives.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-white rounded-2xl border border-kora-300 shadow-sm">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Truck className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-lg text-indigo-950 mb-1">Pan-India Express &amp; COD</h3>
                  <p className="text-sm text-indigo-800/80 leading-relaxed">
                    Razorpay UPI/Cards and Cash on Delivery available across 19,000+ Indian PIN codes with free delivery over ₹1,500.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
