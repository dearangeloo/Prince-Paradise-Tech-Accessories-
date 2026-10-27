import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  MessageCircle,
  Plus,
  Minus,
  Trash2,
  ShieldAlert,
  CheckCircle2,
  ArrowLeft,
  Copy,
  Check,
  Phone,
  User,
  MapPin,
  FileText,
  ShoppingBag,
} from 'lucide-react';

interface OrderSummaryPageProps {
  navigate: (path: string) => void;
}

export const OrderSummaryPage: React.FC<OrderSummaryPageProps> = ({ navigate }) => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    cartTotalKobo,
    formatNaira,
    submitOrderRequest,
    showToast,
  } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryArea, setDeliveryArea] = useState('');
  const [customerInstructions, setCustomerInstructions] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<{
    reference: string;
    whatsappUrl: string;
  } | null>(null);

  const [copiedRef, setCopiedRef] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      showToast('Please enter your full name', 'error');
      return;
    }

    if (!customerPhone.trim() || customerPhone.trim().length < 8) {
      showToast('Please enter a valid phone number for WhatsApp verification', 'error');
      return;
    }

    if (cart.length === 0) {
      showToast('Your order inquiry is empty', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitOrderRequest({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        deliveryArea: deliveryArea.trim() || undefined,
        customerInstructions: customerInstructions.trim() || undefined,
      });

      if (result.success && result.whatsappUrl && result.reference) {
        setSubmittedOrder({
          reference: result.reference,
          whatsappUrl: result.whatsappUrl,
        });

        // Open WhatsApp automatically upon explicit click
        window.open(result.whatsappUrl, '_blank');
      } else {
        showToast(result.error || 'Failed to submit order request. Please retry.', 'error');
      }
    } catch (err: any) {
      showToast('Network error submitting order request', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyRef = () => {
    if (submittedOrder?.reference && navigator.clipboard) {
      navigator.clipboard.writeText(submittedOrder.reference);
      setCopiedRef(true);
      showToast('Order reference copied!', 'info');
      setTimeout(() => setCopiedRef(false), 2500);
    }
  };

  // If order was just submitted, display confirmation view
  if (submittedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Order Request Created!
          </h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Your inquiry has been safely saved in our database. Complete the inquiry by sending your message in WhatsApp.
          </p>
        </div>

        {/* Order Reference Box */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 max-w-md mx-auto text-left space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Order Reference
            </span>
            <button
              onClick={handleCopyRef}
              className="inline-flex items-center gap-1 text-xs text-blue-600 font-bold hover:underline"
            >
              {copiedRef ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedRef ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="text-xl font-mono font-extrabold text-blue-700">
            {submittedOrder.reference}
          </div>

          <div className="text-xs text-slate-500 space-y-1">
            <p><strong>Customer:</strong> {customerName}</p>
            <p><strong>Phone:</strong> {customerPhone}</p>
            {deliveryArea && <p><strong>Delivery Area:</strong> {deliveryArea}</p>}
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
            <strong>Important Notice:</strong> Opening WhatsApp does not mean your order is finalized or paid. Please send the generated WhatsApp message to our verified sales representative so we can confirm current stock, calculate delivery fees for your address, and share payment details.
          </div>

          <a
            href={submittedOrder.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-md transition-all"
          >
            <MessageCircle className="w-5 h-5 fill-white" />
            <span>Re-open WhatsApp Message</span>
          </a>
        </div>

        <div className="pt-4">
          <button
            onClick={() => navigate('/shop')}
            className="text-xs font-bold text-slate-600 hover:text-blue-600"
          >
            ← Continue Browsing Accessories
          </button>
        </div>
      </div>
    );
  }

  // Empty cart view
  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Your Order Request Is Empty</h2>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          Please select products from the catalog before continuing to WhatsApp ordering.
        </p>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-3 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-blue-700"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <button
        onClick={() => navigate('/shop')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Continue Shopping</span>
      </button>

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Review Order Request
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Review your items and provide contact details to generate your official WhatsApp order inquiry.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Items Breakdown */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Selected Accessories ({cart.length})
            </h2>

            <div className="divide-y divide-slate-100">
              {cart.map((item) => {
                const product = item.product;
                const mainImage = product.images[0]?.url || '/assets/aistudio/1793004952388_f4038399.jpg';
                const lineTotalKobo = product.priceKobo * item.quantity;

                return (
                  <div key={`${item.productId}-${item.selectedVariant || ''}`} className="py-4 flex gap-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                      <img
                        src={mainImage}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span>SKU: {product.sku}</span>
                          {item.selectedVariant && (
                            <span className="text-blue-600 font-semibold">• {item.selectedVariant}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQuantity(item.productId, item.quantity - 1, item.selectedVariant)
                            }
                            className="p-1 text-slate-600 hover:bg-slate-200 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQuantity(item.productId, item.quantity + 1, item.selectedVariant)
                            }
                            disabled={item.quantity >= product.stockQuantity}
                            className="p-1 text-slate-600 hover:bg-slate-200 disabled:opacity-30 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-sm font-extrabold text-slate-900">
                            {formatNaira(lineTotalKobo)}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.productId, item.selectedVariant)}
                            className="text-slate-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery & Warranty Advisory */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <span>Delivery & Confirmation Process</span>
            </div>
            <p className="text-blue-800/90 leading-relaxed">
              We dispatch via express couriers across all 36 Nigerian states and the FCT. Same-day & next-day delivery available for Lagos, Abuja, and Port Harcourt orders once verified on WhatsApp.
            </p>
          </div>
        </div>

        {/* Right Column: Customer Info & WhatsApp Flow */}
        <div className="lg:col-span-5 space-y-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4"
          >
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Customer Contact Information
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Chukwuma Adeleke"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  WhatsApp Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. 0813 572 8645 or +234..."
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  We verify stock and send dispatch updates to this number.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Delivery Area / State (Optional)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={deliveryArea}
                    onChange={(e) => setDeliveryArea(e.target.value)}
                    placeholder="e.g. Lekki Phase 1, Lagos or Maitama, Abuja"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
                  />
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Special Instructions or Notes (Optional)
                </label>
                <div className="relative">
                  <textarea
                    rows={2}
                    value={customerInstructions}
                    onChange={(e) => setCustomerInstructions(e.target.value)}
                    placeholder="Any specific delivery instructions or questions..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
                  />
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>
            </div>

            {/* Price Calculations */}
            <div className="pt-4 border-t border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-900">{formatNaira(cartTotalKobo)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Estimated Delivery Fee</span>
                <span className="text-emerald-700 font-semibold">Confirmed on WhatsApp</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">Estimated Total</span>
                <span className="text-lg font-extrabold text-blue-700">
                  {formatNaira(cartTotalKobo)}
                </span>
              </div>
            </div>

            {/* Mandatory Non-binding Disclaimer */}
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-950 leading-relaxed">
              <strong>Order Disclaimer:</strong> Submitting this request creates an order inquiry in our system. Final product pricing, variant stock availability, and exact delivery fees require staff confirmation on WhatsApp prior to payment. No payment is processed online right now.
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-md transition-all active:scale-[0.99] disabled:opacity-50"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>{isSubmitting ? 'Creating Request...' : 'Continue to WhatsApp'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
