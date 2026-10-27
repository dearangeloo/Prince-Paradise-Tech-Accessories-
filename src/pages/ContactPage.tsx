import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { MessageCircle, Mail, Phone, Clock, MapPin, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings, showToast } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const whatsappNum = settings?.normalizedWhatsapp || '2348135728645';

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      showToast('Please type your question or inquiry', 'error');
      return;
    }

    const text =
      `Hello Prince Paradise Tech Accessories,\n\n` +
      `My name is ${name || 'A Customer'}.\n` +
      (phone ? `Phone: ${phone}\n` : '') +
      `Inquiry:\n${message.trim()}\n\n` +
      `Thank you.`;

    window.open(`https://wa.me/${whatsappNum}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
          Direct Customer Support
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Contact Prince Paradise
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Have a question about product specifications, bulk orders, warranty coverage, or delivery in your area? Our verified sales staff is on standby.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          {/* WhatsApp Direct Card */}
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <MessageCircle className="w-6 h-6 fill-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-emerald-950">
                Official WhatsApp Sales Channel
              </h3>
              <p className="text-xs text-emerald-800 mt-1">
                Fastest response for order quotes, stock checks, and dispatch tracking.
              </p>
            </div>
            <a
              href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(
                'Hello Prince Paradise Tech Accessories, I have an inquiry.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
            >
              <span>Chat on WhatsApp (+234 813 572 8645)</span>
            </a>
          </div>

          {/* Email & Phone Details */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-5">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</div>
                <a
                  href="mailto:accessories.princeparadisetech@gmail.com"
                  className="text-sm font-semibold text-slate-900 hover:text-blue-600 break-all"
                >
                  accessories.princeparadisetech@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Direct Telephone</div>
                <div className="text-sm font-semibold text-slate-900">
                  +234 813 572 8645
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Operating Hours</div>
                <div className="text-sm font-semibold text-slate-900">
                  Monday – Saturday: 8:00 AM – 7:00 PM (WAT)
                </div>
                <div className="text-xs text-slate-500">
                  Sunday: WhatsApp Inquiries Monitored
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Logistics & Hub</div>
                <div className="text-sm font-semibold text-slate-900">
                  Lagos Hub & Nationwide Dispatch Network across all Nigerian states
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <form onSubmit={handleSendInquiry} className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Send a Message to Our Team
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Samuel Okafor"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone / WhatsApp</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 0813..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Message / Inquired Products <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about specific tech models, request quotes for bulk retail orders, or check delivery timelines..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Send via WhatsApp Chat</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
