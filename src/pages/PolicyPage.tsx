import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Shield, Truck, HelpCircle, FileText, Lock, ChevronDown, ChevronUp } from 'lucide-react';

interface PolicyPageProps {
  initialTab?: 'faq' | 'shipping' | 'returns' | 'privacy' | 'terms';
  navigate: (path: string) => void;
}

export const PolicyPage: React.FC<PolicyPageProps> = ({ initialTab = 'shipping', navigate }) => {
  const { settings } = useStore();
  const [activeTab, setActiveTab] = useState<'faq' | 'shipping' | 'returns' | 'privacy' | 'terms'>(
    initialTab
  );

  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does WhatsApp ordering work without online card payments?',
      a: 'We intentionally prioritize WhatsApp ordering so customers can verify stock, double-check device compatibility, and get accurate delivery quotes directly with verified staff. Once you confirm your request in WhatsApp, staff will provide our official Nigerian corporate bank account details. Your package is packed and dispatched immediately after transfer confirmation.',
    },
    {
      q: 'What is the 12-Month Prince Paradise Warranty?',
      a: 'All flagship chargers, power banks, and smart devices carry a 12-month manufacturer warranty covering defects in internal electronics, battery cell degradation, or failure under standard usage conditions. If your device malfunctions, we repair or exchange it swiftly upon inspection.',
    },
    {
      q: 'How fast is nationwide delivery across Nigeria?',
      a: 'Orders in Lagos, Abuja, Port Harcourt, and Ibadan can receive same-day or next-day express delivery depending on time of order confirmation. Other states across the South-West, South-East, South-South, North-Central, and Northern regions are delivered within 2 to 4 business days via reputable insured logistics partners.',
    },
    {
      q: 'Why are your chargers fitted with UK 3-pin standard plugs?',
      a: 'Nigeria’s standard electrical wall sockets adhere to the British Standard BS 1363 (3-pin with earth pin and integrated safety fuse). Using authentic UK 3-pin plugs protects your devices against household voltage fluctuations and loose, hazardous connection sparking commonly found with two-pin round adapters.',
    },
    {
      q: 'Are Prince Paradise products authentic?',
      a: 'Yes! Prince Paradise Tech Accessories designs and manufactures every power accessory under strict quality assurance standards, marked by our genuine Prince Paradise shield and lion emblem.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs sm:text-sm font-bold">
        <button
          onClick={() => setActiveTab('shipping')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'shipping'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Delivery Information</span>
        </button>

        <button
          onClick={() => setActiveTab('returns')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'returns'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Warranty & Returns</span>
        </button>

        <button
          onClick={() => setActiveTab('faq')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'faq'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>FAQs</span>
        </button>

        <button
          onClick={() => setActiveTab('privacy')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'privacy'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Privacy Notice</span>
        </button>

        <button
          onClick={() => setActiveTab('terms')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'terms'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Terms of Use</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        {activeTab === 'shipping' && (
          <div className="space-y-5">
            <h1 className="text-2xl font-extrabold text-slate-900">
              Shipping & Delivery Information
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              {settings?.deliveryInformation ||
                'Nationwide delivery across all 36 Nigerian states and the FCT.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-xs text-blue-700 uppercase">Major Cities</div>
                <div className="text-sm font-semibold text-slate-900">Lagos, Abuja, PH, Ibadan</div>
                <div className="text-xs text-slate-500">Same-Day to Next-Day Express Delivery</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-xs text-blue-700 uppercase">Inter-State Logistics</div>
                <div className="text-sm font-semibold text-slate-900">All Other 33 States</div>
                <div className="text-xs text-slate-500">2 to 4 Business Days via Tracked Couriers</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
              <strong>Delivery Cost Confirmation:</strong> Delivery fees depend on your exact city, parcel weight, and urgency. Our sales staff will calculate and provide the exact delivery fee during your WhatsApp order confirmation before you make payment.
            </div>
          </div>
        )}

        {activeTab === 'returns' && (
          <div className="space-y-5">
            <h1 className="text-2xl font-extrabold text-slate-900">
              Warranty & Returns Policy
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {settings?.policyContent?.returnsAndWarranty ||
                'Prince Paradise provides a 12-Month Manufacturer Warranty on chargers, power banks, and smart devices against manufacturing defects.'}
            </p>

            <div className="border-t border-slate-200 pt-4 space-y-3">
              <h3 className="text-sm font-bold text-slate-900">How to Claim Warranty</h3>
              <ol className="list-decimal list-inside text-xs sm:text-sm text-slate-600 space-y-2 leading-relaxed">
                <li>Contact our WhatsApp support team at <strong>+234 813 572 8645</strong> with your order reference number or receipt.</li>
                <li>Send a brief 10-second video illustrating the fault (e.g. failure to charge or display issue).</li>
                <li>Upon initial verification, dispatch the item to our Lagos inspection depot.</li>
                <li>Once verified, a replacement or repair is issued within 3 business days.</li>
              </ol>
            </div>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">
                Frequently Asked Questions
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Everything you need to know about purchasing, warranty, and WhatsApp ordering.
              </p>
            </div>

            <div className="divide-y divide-slate-200">
              {faqs.map((faq, idx) => {
                const isOpen = expandedFaq === idx;
                return (
                  <div key={idx} className="py-4">
                    <button
                      onClick={() => setExpandedFaq(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between text-left font-bold text-sm sm:text-base text-slate-900 hover:text-blue-600 transition-colors"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-slate-400 shrink-0 ml-2" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400 shrink-0 ml-2" />
                      )}
                    </button>
                    {isOpen && (
                      <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed animate-in fade-in">
                        {faq.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-4">
            <h1 className="text-2xl font-extrabold text-slate-900">Privacy Notice</h1>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {settings?.policyContent?.privacy ||
                'We respect your privacy. Customer names, telephone numbers, and delivery addresses collected during the WhatsApp order flow are used strictly for order verification, dispatch, and customer service.'}
            </p>
          </div>
        )}

        {activeTab === 'terms' && (
          <div className="space-y-4">
            <h1 className="text-2xl font-extrabold text-slate-900">Terms of Use</h1>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {settings?.policyContent?.terms ||
                'All product descriptions, specifications, and prices are listed in Nigerian Naira. Submitting an order request on this website creates a non-binding reservation inquiry.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
