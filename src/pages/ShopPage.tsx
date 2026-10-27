import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/shop/ProductCard';
import { Search, Filter, X, ArrowUpDown, Check, RefreshCw } from 'lucide-react';

interface ShopPageProps {
  navigate: (path: string) => void;
  initialCategory?: string;
  initialSearch?: string;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  navigate,
  initialCategory = 'all',
  initialSearch = '',
}) => {
  const { products, categories, isLoading, refreshCatalog } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'name'>('newest');
  const [visibleCount, setVisibleCount] = useState<number>(12);

  // Sync initial query params if they change
  useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
    if (initialSearch) setSearchQuery(initialSearch);
  }, [initialCategory, initialSearch]);

  // Filter and sort catalog
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Must be published
      if (product.status !== 'published') return false;

      // Category check
      if (selectedCategory !== 'all') {
        const cat = categories.find((c) => c.slug === selectedCategory || c.id === selectedCategory);
        if (cat && product.categoryId !== cat.id) {
          return false;
        }
      }

      // Stock check
      if (inStockOnly && product.stockQuantity <= 0) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesSku = product.sku.toLowerCase().includes(q);
        const matchesDesc = product.shortDescription.toLowerCase().includes(q);
        const matchesTags = product.tags.some((t) => t.toLowerCase().includes(q));

        if (!matchesName && !matchesSku && !matchesDesc && !matchesTags) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.priceKobo - b.priceKobo;
      if (sortBy === 'price_desc') return b.priceKobo - a.priceKobo;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return Number(b.createdAt) - Number(a.createdAt);
    });
  }, [products, categories, selectedCategory, searchQuery, inStockOnly, sortBy]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setInStockOnly(false);
    setSortBy('newest');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' || searchQuery.trim().length > 0 || inStockOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title & Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Product Catalog
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Browse certified power banks, ultra-fast UK 3-pin chargers, heavy-duty braided cables, audio, and gadgets.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Field */}
          <div className="relative w-full md:max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, SKU (e.g. PPT-120W), or feature..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 placeholder-slate-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Controls: Stock Toggle & Sort */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <span>In Stock Only</span>
            </label>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="newest">Sort: Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name">Product Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 scrollbar-none text-xs font-bold">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Products ({products.filter((p) => p.status === 'published').length})
          </button>
          {categories.map((cat) => {
            const count = products.filter(
              (p) => p.categoryId === cat.id && p.status === 'published'
            ).length;
            const isSelected = selectedCategory === cat.slug || selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Active Filter Clear Bar */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-500">
              Showing {filteredProducts.length} of {products.filter((p) => p.status === 'published').length} products
            </span>
            <button
              onClick={handleClearFilters}
              className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div
              key={n}
              className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4 animate-pulse"
            >
              <div className="aspect-square bg-slate-200 rounded-xl"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              <div className="h-6 bg-slate-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">No matching products found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search terms, clearing category filters, or showing out-of-stock items.
            </p>
          </div>
          <button
            onClick={handleClearFilters}
            className="px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        /* Product Grid */
        <div className="space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} navigate={navigate} />
            ))}
          </div>

          {/* Load More Button */}
          {filteredProducts.length > visibleCount && (
            <div className="text-center pt-4">
              <button
                onClick={() => setVisibleCount((prev) => prev + 12)}
                className="px-8 py-3 bg-white border border-slate-300 hover:border-blue-600 text-slate-800 hover:text-blue-600 font-bold text-xs rounded-xl shadow-xs transition-all"
              >
                Load More Products ({filteredProducts.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
