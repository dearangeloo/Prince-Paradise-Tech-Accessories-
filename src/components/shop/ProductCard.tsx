import React from 'react';
import type { Product } from '../../types/index';
import { useStore } from '../../context/StoreContext';
import { ShoppingBag, MessageCircle, Shield, CheckCircle2, AlertCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  navigate: (path: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, navigate }) => {
  const { formatNaira, addToCart, settings } = useStore();

  const mainImage = product.images[0]?.url || '/assets/aistudio/1793004952388_f4038399.jpg';
  const isOutOfStock = product.stockQuantity <= 0;
  const isLowStock = !isOutOfStock && product.stockQuantity <= product.lowStockThreshold;

  // Calculate discount percentage
  const discountPercent =
    product.compareAtPriceKobo && product.compareAtPriceKobo > product.priceKobo
      ? Math.round(
          ((product.compareAtPriceKobo - product.priceKobo) / product.compareAtPriceKobo) * 100
        )
      : null;

  const handleCardClick = () => {
    navigate(`/product/${product.slug}`);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleDirectWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const whatsappNum = settings?.normalizedWhatsapp || '2348135728645';
    const text =
      `Hello Prince Paradise Tech Accessories,\n\n` +
      `I would like to inquire about ordering:\n` +
      `Product: ${product.name}\n` +
      `SKU: ${product.sku}\n` +
      `Price: ${formatNaira(product.priceKobo)}\n\n` +
      `Please confirm stock availability and delivery options.\nThank you.`;
    window.open(`https://wa.me/${whatsappNum}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-2xl border border-slate-200 overflow-hidden card-hover-effect flex flex-col cursor-pointer transition-all duration-200"
    >
      {/* Product Image Area */}
      <div className="relative aspect-square w-full bg-slate-100 overflow-hidden flex items-center justify-center">
        <img
          src={mainImage}
          alt={product.images[0]?.altText || product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
          {discountPercent && (
            <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white font-extrabold text-[10px] tracking-wide uppercase shadow-sm">
              Save {discountPercent}%
            </span>
          )}
          {product.featured && (
            <span className="px-2 py-0.5 rounded-md bg-[#0B192C] text-amber-300 font-bold text-[10px] tracking-wide uppercase shadow-sm">
              Featured
            </span>
          )}
        </div>

        {/* Stock Status Badge */}
        <div className="absolute top-2.5 right-2.5 z-10">
          {isOutOfStock ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-100 text-red-800 text-[10px] font-bold border border-red-200">
              <AlertCircle className="w-3 h-3 text-red-600" />
              <span>Out of Stock</span>
            </span>
          ) : isLowStock ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold border border-amber-200">
              <span>Only {product.stockQuantity} left</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>In Stock</span>
            </span>
          )}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-1">
            <span>SKU: {product.sku}</span>
            {product.warrantyText && (
              <span className="text-blue-600 font-medium flex items-center gap-0.5">
                <Shield className="w-3 h-3" />
                <span>12M Warranty</span>
              </span>
            )}
          </div>

          <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* Pricing and Action Buttons */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-base sm:text-lg font-extrabold text-blue-700">
              {formatNaira(product.priceKobo)}
            </span>
            {product.compareAtPriceKobo && (
              <span className="text-xs text-slate-400 line-through">
                {formatNaira(product.compareAtPriceKobo)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleQuickAdd}
              disabled={isOutOfStock}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg border border-blue-600 text-blue-700 hover:bg-blue-50 font-bold text-xs disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Order</span>
            </button>

            <button
              onClick={handleDirectWhatsApp}
              disabled={isOutOfStock}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
