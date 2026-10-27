import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/shop/ProductCard';
import {
  Shield,
  Truck,
  MessageCircle,
  ShoppingBag,
  Share2,
  Check,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Zap,
} from 'lucide-react';

interface ProductDetailPageProps {
  slug: string;
  navigate: (path: string) => void;
  openCart: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  slug,
  navigate,
  openCart,
}) => {
  const { products, categories, formatNaira, addToCart, showToast, settings } = useStore();

  const product = products.find((p) => p.slug === slug || p.id === slug);

  // States
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedImageIndex(0);
      setQuantity(1);
      if (product.variants && product.variants.length > 0 && product.variants[0].options.length > 0) {
        setSelectedVariant(product.variants[0].options[0]);
      } else {
        setSelectedVariant('');
      }
    }
  }, [product, slug]);

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Product Not Found</h2>
        <p className="text-sm text-slate-500">
          The requested product may have been discontinued or moved.
        </p>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-3 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-blue-700"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  // Stock status
  const isOutOfStock = product.stockQuantity <= 0;
  const isLowStock = !isOutOfStock && product.stockQuantity <= product.lowStockThreshold;

  // Category
  const category = categories.find((c) => c.id === product.categoryId);

  // Discount
  const discountPercent =
    product.compareAtPriceKobo && product.compareAtPriceKobo > product.priceKobo
      ? Math.round(
          ((product.compareAtPriceKobo - product.priceKobo) / product.compareAtPriceKobo) * 100
        )
      : null;

  // Related products
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.categoryId === product.categoryId && p.status === 'published')
    .slice(0, 4);

  // Handlers
  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant || undefined);
    openCart();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      showToast('Product link copied to clipboard!', 'info');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleInstantWhatsApp = () => {
    const whatsappNum = settings?.normalizedWhatsapp || '2348135728645';
    const variantPart = selectedVariant ? `\nVariant: ${selectedVariant}` : '';
    const text =
      `Hello Prince Paradise Tech Accessories,\n\n` +
      `I would like to place an order inquiry for:\n` +
      `Product: ${product.name}\n` +
      `SKU: ${product.sku}${variantPart}\n` +
      `Quantity: ${quantity}\n` +
      `Unit Price: ${formatNaira(product.priceKobo)}\n` +
      `Estimated Subtotal: ${formatNaira(product.priceKobo * quantity)}\n\n` +
      `Please confirm stock availability and delivery options.\nThank you.`;

    window.open(`https://wa.me/${whatsappNum}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const images = product.images.length > 0 ? product.images : [{ url: '/assets/aistudio/1793004952388_f4038399.jpg', altText: product.name, storagePath: '', sortOrder: 1 }];
  const currentImage = images[selectedImageIndex] || images[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/shop')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{copied ? 'Link Copied' : 'Share Product'}</span>
        </button>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-square w-full rounded-3xl bg-slate-100 overflow-hidden border border-slate-200 relative flex items-center justify-center shadow-xs">
            <img
              src={currentImage.url}
              alt={currentImage.altText || product.name}
              className="w-full h-full object-cover"
            />
            {discountPercent && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-blue-600 text-white font-extrabold text-xs rounded-lg uppercase tracking-wide shadow-sm">
                Save {discountPercent}%
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 bg-slate-100 shrink-0 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-blue-600 shadow-sm scale-102'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.altText || `View ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Information, Pricing, Variants & CTAs */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-2">
              {category && (
                <span
                  onClick={() => navigate(`/category/${category.slug}`)}
                  className="text-blue-600 font-semibold hover:underline cursor-pointer"
                >
                  {category.name}
                </span>
              )}
              <span>•</span>
              <span>SKU: {product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {product.name}
            </h1>

            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              {product.shortDescription}
            </p>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-baseline justify-between">
            <div>
              <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                Price in Nigerian Naira
              </div>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-3xl font-extrabold text-blue-700">
                  {formatNaira(product.priceKobo)}
                </span>
                {product.compareAtPriceKobo && (
                  <span className="text-base text-slate-400 line-through">
                    {formatNaira(product.compareAtPriceKobo)}
                  </span>
                )}
              </div>
            </div>

            {/* Stock indicator badge */}
            <div>
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-100 text-red-800 text-xs font-bold border border-red-200">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span>Out of Stock</span>
                </span>
              ) : isLowStock ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200">
                  <span>Only {product.stockQuantity} Left</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>In Stock</span>
                </span>
              )}
            </div>
          </div>

          {/* Product Variants (Color, Capacity, Package) */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Select {product.variants[0].name}:
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants[0].options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSelectedVariant(opt)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedVariant === opt
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white border border-slate-300 text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          {!isOutOfStock && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Quantity:
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="px-3.5 py-2 hover:bg-slate-100 text-slate-600 disabled:opacity-40 transition-colors font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-sm font-bold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))}
                    disabled={quantity >= product.stockQuantity}
                    className="px-3.5 py-2 hover:bg-slate-100 text-slate-600 disabled:opacity-40 transition-colors font-bold text-sm"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-slate-500">
                  (Estimated Subtotal: <strong>{formatNaira(product.priceKobo * quantity)}</strong>)
                </span>
              </div>
            </div>
          )}

          {/* CTAs: Add to Order & Direct WhatsApp */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl shadow-md disabled:opacity-40 disabled:pointer-events-none transition-all"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Add to Order Inquiry</span>
            </button>

            <button
              onClick={handleInstantWhatsApp}
              disabled={isOutOfStock}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-md disabled:opacity-40 disabled:pointer-events-none transition-all"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>Inquire & Order on WhatsApp</span>
            </button>
          </div>

          {/* Trust Guarantees on Product Detail */}
          <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-3 text-xs text-slate-600">
            {product.warrantyText && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <Shield className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="font-semibold text-slate-800">{product.warrantyText}</span>
              </div>
            )}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold text-slate-800">Nationwide Express Dispatch</span>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Specifications & Long Description */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 space-y-8">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 mb-4">
            Product Description
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>

        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="pt-6 border-t border-slate-200">
            <h2 className="text-xl font-extrabold text-slate-900 mb-4">
              Technical Specifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.specifications).map(([key, val]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm"
                >
                  <span className="font-semibold text-slate-600">{key}</span>
                  <span className="font-bold text-slate-900 text-right">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900">
              Related Tech Accessories
            </h2>
            <button
              onClick={() => navigate('/shop')}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              View More
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} navigate={navigate} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
