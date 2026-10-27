import React from 'react';
import { useStore } from '../../context/StoreContext';
import { MessageCircle, Mail, Phone, MapPin, Shield, CheckCircle } from 'lucide-react';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const { settings } = useStore();
  const whatsappNum = settings?.normalizedWhatsapp || '2348135728645';

  return (
    <footer className="bg-[#0B192C] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info & Motto */}
          <div className="space-y-4">
            <div
              onClick={() => navigate('/')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white p-0.5 border border-slate-700 shadow">
                <img
                  src={settings?.logoUrl || '/assets/aistudio/1793004952388_f4038399.jpg'}
                  alt="Prince Paradise Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="text-lg font-extrabold text-white tracking-tight">
                  PRINCE PARADISE
                </div>
                <div className="text-xs font-semibold text-blue-400 tracking-wider uppercase">
                  Tech Accessories
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed">
              <strong className="text-white">POWER YOUR WORLD.</strong> Premium tech accessories,
              high-capacity power banks, and UK-fused fast chargers engineered for reliable everyday life.
            </p>

            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/60 px-3 py-2 rounded-lg w-fit">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>12-Month Manufacturer Warranty on Flagship Items</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => navigate('/category/power-banks')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  High-Capacity Power Banks
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/category/chargers-and-cables')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  UK Fast Chargers & Cables
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/category/earbuds-and-headphones')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  ANC Earbuds & Audio
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/category/phone-accessories')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Phone & Car Accessories
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/category/smart-devices')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Smart Watches & Tech
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/category/other-electronics')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  USB-C Hubs & Electronics
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service & Policies */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Customer Support
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => navigate('/order')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Order Inquiry Flow
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/shipping')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Nationwide Delivery Info
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/returns')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Warranty & Returns Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/faq')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/privacy')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Privacy Notice
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/terms')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Terms of Use
                </button>
              </li>
            </ul>
          </div>

          {/* Direct Verified Contact */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Direct Contact
            </h4>
            <div className="space-y-3 text-sm">
              <a
                href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(
                  'Hello Prince Paradise Tech Accessories, I have an inquiry.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-emerald-900/30 hover:bg-emerald-900/50 border border-emerald-700/50 text-emerald-300 font-medium transition-all group"
              >
                <MessageCircle className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="text-xs text-emerald-400/80">WhatsApp Sales & Support</div>
                  <div className="font-bold text-white">+234 813 572 8645</div>
                </div>
              </a>

              <a
                href="mailto:accessories.princeparadisetech@gmail.com"
                className="flex items-start gap-3 text-slate-300 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
                <span className="break-all text-xs">accessories.princeparadisetech@gmail.com</span>
              </a>

              <div className="flex items-start gap-3 text-slate-300">
                <MapPin className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
                <span className="text-xs">Dispatch centers in Lagos & nationwide express courier across Nigeria</span>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-center sm:text-left leading-relaxed max-w-2xl">
            Order requests made on this website are transmitted directly to Prince Paradise via WhatsApp for stock validation, delivery fee calculation, and payment confirmation prior to dispatch.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>© {new Date().getFullYear()} Prince Paradise Tech Accessories. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
