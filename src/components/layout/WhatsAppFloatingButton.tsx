import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { MessageCircle, X } from 'lucide-react';

export const WhatsAppFloatingButton: React.FC = () => {
  const { settings } = useStore();
  const [showTooltip, setShowTooltip] = useState(true);

  const whatsappNum = settings?.normalizedWhatsapp || '2348135728645';
  const whatsappUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(
    'Hello Prince Paradise Tech Accessories, I would like to inquire about your products.'
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-end gap-2 pointer-events-none">
      {/* Speech Bubble */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 pointer-events-auto bg-white border border-slate-200 text-slate-800 text-xs py-2 px-3.5 rounded-2xl shadow-xl animate-in fade-in slide-in-from-right-3">
          <span>Need help? Chat with Prince Paradise on WhatsApp</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-slate-400 hover:text-slate-600 ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Prince Paradise on WhatsApp"
        className="pointer-events-auto flex items-center justify-center w-14 h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-300"
      >
        <MessageCircle className="w-7 h-7 fill-white" />
      </a>
    </div>
  );
};
