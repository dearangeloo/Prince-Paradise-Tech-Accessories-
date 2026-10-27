import React from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  navigate: (path: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, navigate }) => {
  const { cart, updateCartQuantity, removeFromCart, cartTotalKobo, formatNaira } = useStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Order Inquiry Cart
              </h2>
              <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                {cart.length} {cart.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Your order is empty</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    Explore our high-performance power banks, chargers, and audio accessories.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    navigate('/shop');
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold text-xs rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
                >
                  <span>Explore Products</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const product = item.product;
                const mainImage = product.images[0]?.url || '/assets/aistudio/1793004952388_f4038399.jpg';
                const lineTotalKobo = product.priceKobo * item.quantity;

                return (
                  <div
                    key={`${item.productId}-${item.selectedVariant || 'default'}`}
                    className="flex gap-4 p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors"
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      <img
                        src={mainImage}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4
                          onClick={() => {
                            onClose();
                            navigate(`/product/${product.slug}`);
                          }}
                          className="text-xs sm:text-sm font-bold text-slate-900 truncate hover:text-blue-600 cursor-pointer"
                        >
                          {product.name}
                        </h4>
                        {item.selectedVariant && (
                          <div className="text-[11px] text-blue-700 font-medium">
                            Variant: {item.selectedVariant}
                          </div>
                        )}
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          SKU: {product.sku}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                          <button
                            onClick={() =>
                              updateCartQuantity(item.productId, item.quantity - 1, item.selectedVariant)
                            }
                            className="p-1 hover:bg-slate-200 text-slate-600 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateCartQuantity(item.productId, item.quantity + 1, item.selectedVariant)
                            }
                            disabled={item.quantity >= product.stockQuantity}
                            className="p-1 hover:bg-slate-200 text-slate-600 disabled:opacity-30 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Price and delete */}
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-xs font-bold text-slate-900">
                              {formatNaira(lineTotalKobo)}
                            </div>
                            {item.quantity > 1 && (
                              <div className="text-[10px] text-slate-400">
                                {formatNaira(product.priceKobo)} each
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => removeFromCart(item.productId, item.selectedVariant)}
                            className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Summary & Action */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-slate-200 bg-slate-50 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Estimated Items Total</span>
                  <span className="font-bold text-slate-900">{formatNaira(cartTotalKobo)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Delivery Charges</span>
                  <span className="text-emerald-700 font-semibold">Calculated on WhatsApp</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">Estimated Subtotal</span>
                  <span className="text-base font-extrabold text-blue-700">
                    {formatNaira(cartTotalKobo)}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900 leading-snug">
                <strong>WhatsApp Order Inquiry:</strong> Stock availability, delivery fee, and payment details are verified directly by Prince Paradise sales staff via WhatsApp.
              </div>

              <button
                onClick={() => {
                  onClose();
                  navigate('/order');
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-[0.99]"
              >
                <span>Continue to Order Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
