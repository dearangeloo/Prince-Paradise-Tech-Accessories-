import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/shop/ProductCard';
import { ArrowLeft, ArrowRight, ShoppingBag } from 'lucide-react';

interface CategoryPageProps {
  slug: string;
  navigate: (path: string) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ slug, navigate }) => {
  const { categories, products } = useStore();

  const category = categories.find((c) => c.slug === slug || c.id === slug);

  if (!category || !category.active) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Category Not Found</h2>
        <p className="text-sm text-slate-500">
          The category you requested is either unavailable or has been archived.
        </p>
        <button
          onClick={() => navigate('/shop')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Categories</span>
        </button>
      </div>
    );
  }

  const categoryProducts = products.filter(
    (p) => p.categoryId === category.id && p.status === 'published'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb & Navigation */}
      <button
        onClick={() => navigate('/shop')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Full Catalog</span>
      </button>

      {/* Hero Category Banner */}
      <div className="bg-gradient-to-r from-[#0B192C] to-[#163359] text-white p-8 sm:p-12 rounded-3xl overflow-hidden relative shadow-lg">
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
            Category Collection
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {category.name}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {category.description}
          </p>
          <div className="pt-2 text-xs text-slate-400 font-medium">
            Showing {categoryProducts.length} certified {category.name.toLowerCase()}
          </div>
        </div>

        {category.image && (
          <div className="hidden md:block absolute -right-4 -bottom-6 w-56 h-56 rounded-2xl overflow-hidden opacity-25 pointer-events-none">
            <img
              src={category.image.url}
              alt={category.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Category Product Grid */}
      {categoryProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <p className="text-sm text-slate-500">
            No products are currently published under {category.name}. Check back soon as new shipments arrive!
          </p>
          <button
            onClick={() => navigate('/shop')}
            className="px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl"
          >
            Explore Other Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} navigate={navigate} />
          ))}
        </div>
      )}
    </div>
  );
};
