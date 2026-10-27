import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/shop/ProductCard';
import {
  Zap,
  Shield,
  Truck,
  MessageCircle,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  BatteryCharging,
} from 'lucide-react';

interface HomePageProps {
  navigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const { products, categories, settings, formatNaira } = useStore();

  const featuredProducts = products.filter((p) => p.featured && p.status === 'published');
  const powerBankHighlight = products.find((p) => p.sku === 'PPT-PB-20K-LILAC') || products[0];
  const chargerHighlight = products.find((p) => p.sku === 'PPT-CH-120W-UK') || products[1];

  const whatsappNum = settings?.normalizedWhatsapp || '2348135728645';

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0B192C] via-[#0F223D] to-[#0B192C] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-900/60 border border-blue-700/60 text-blue-300 text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Prince Paradise Tech Accessories</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              POWER YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">WORLD.</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Technology, quality, and convenience for everyday life. Experience ultra-fast charging, high-capacity power banks, and certified UK-standard tech built to endure.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={() => navigate('/shop')}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-base rounded-xl shadow-lg shadow-blue-900/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Shop Catalog</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <a
                href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(
                  'Hello Prince Paradise Tech Accessories, I would like to make an inquiry.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base rounded-xl shadow-lg shadow-emerald-900/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            {/* Quick Guarantees */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-slate-300 font-semibold border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>UK 3-Pin Safety Fused</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400 shrink-0" />
                <span>12-Month Warranty</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Nationwide Dispatch</span>
              </div>
            </div>
          </div>

          {/* Hero Right Visuals: Featuring Uploaded Assets */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md bg-gradient-to-tr from-slate-900 to-slate-800 rounded-3xl p-6 border border-slate-700 shadow-2xl overflow-hidden group">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-slate-950 relative flex items-center justify-center">
                <img
                  src="/assets/aistudio/ec2c3d4b-df69-45af-a8a1-93d072dd88d7_7f06612d.png"
                  alt="Prince Paradise 20,000mAh Power Bank"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

                {/* Floating Highlight Badge */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700 text-left">
                  <div className="flex items-center justify-between text-xs text-blue-400 font-bold mb-1">
                    <span>FLAGSHIP POWER BANK</span>
                    <span className="text-emerald-400">22.5W Fast Charge</span>
                  </div>
                  <h3 className="text-sm font-extrabold text-white">
                    20,000mAh Ultra-Slim with Digital Display
                  </h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-base font-extrabold text-white">
                      {powerBankHighlight ? formatNaira(powerBankHighlight.priceKobo) : '₦28,500'}
                    </span>
                    <button
                      onClick={() => navigate('/product/prince-paradise-20000mah-ultra-slim-power-bank')}
                      className="text-xs bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-lg transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Category Navigation Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              Explore By Category
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              High-Grade Tech Categories
            </h2>
          </div>
          <button
            onClick={() => navigate('/shop')}
            className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigate(`/category/${cat.slug}`)}
              className="group bg-white p-4 rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex flex-col items-center text-center space-y-3"
            >
              <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 p-1 flex items-center justify-center group-hover:scale-105 transition-transform">
                <img
                  src={cat.image?.url || '/assets/aistudio/1793004952388_f4038399.jpg'}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              Top Performance
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Featured Tech Accessories
            </h2>
          </div>
          <button
            onClick={() => navigate('/shop')}
            className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>See Full Storefront</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} navigate={navigate} />
          ))}
        </div>
      </section>

      {/* 4. Special Product Spotlight: 120W Hyper Charge UK 3-Pin Charger */}
      {chargerHighlight && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#0B192C] to-[#122b4d] rounded-3xl text-white p-8 sm:p-12 overflow-hidden relative shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                  <Zap className="w-4 h-4 fill-amber-300" />
                  <span>Hyper Charge Technology</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  Prince Paradise 120W Hyper Charge UK 3-Pin Super Fast Charger
                </h2>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Equipped with third-generation GaN semiconductors, standard UK 3-pin fused terminals, smart heat control, and comprehensive overcharge protection. Charge from 0 to 80% in minutes safely.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-2">
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                    <div className="text-lg font-extrabold text-blue-400">120W</div>
                    <div className="text-xs text-slate-400">Max Turbo Output</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                    <div className="text-lg font-extrabold text-emerald-400">UK 3-Pin</div>
                    <div className="text-xs text-slate-400">Fused Safety Standard</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 col-span-2 sm:col-span-1">
                    <div className="text-lg font-extrabold text-amber-400">GaN III</div>
                    <div className="text-xs text-slate-400">Cool Heat Control</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    onClick={() => navigate(`/product/${chargerHighlight.slug}`)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all shadow-md"
                  >
                    View 120W Adapter Specifications
                  </button>
                  <span className="text-xl font-extrabold text-white">
                    {formatNaira(chargerHighlight.priceKobo)}
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-sm aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 p-2 shadow-2xl">
                  <img
                    src="/assets/aistudio/ChatGPT_Image_Oct_18__2026__10_30_59_PM_ce5d1274.png"
                    alt="120W Hyper Charge UK Charger"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. How WhatsApp Ordering Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
            Seamless Ordering
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            How WhatsApp Ordering Works
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            No complicated checkouts or hidden card charges. Direct verification with our dedicated team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 font-extrabold text-lg flex items-center justify-center mx-auto">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900">Select Tech Accessories</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Browse our catalog of power banks, chargers, and audio gadgets. Add items to your order inquiry with your chosen variants.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 font-extrabold text-lg flex items-center justify-center mx-auto">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900">Review & Continue to WhatsApp</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Review your estimated subtotal, provide your name and delivery area. Our system saves your inquiry and formats a direct WhatsApp order message.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 font-extrabold text-lg flex items-center justify-center mx-auto">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900">Confirm & Dispatch</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Prince Paradise sales staff confirms stock, provides exact delivery charges for your location, and arranges swift courier dispatch.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Trust Section */}
      <section className="bg-slate-100 py-16 border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">12-Month Warranty</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Real manufacturer guarantee against manufacturing defects on all flagship power items.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Zap className="w-6 h-6 fill-white" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">UK Fused Standards</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Engineered specifically for Nigerian electrical wall sockets with fuse protection.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Nationwide Delivery</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Express same-day dispatch in Lagos & swift interstate logistics across all 36 states.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-800 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Direct Support</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Dedicated sales and support reps ready to help you on WhatsApp every business day.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
