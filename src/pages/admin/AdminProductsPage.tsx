import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import type { Product } from '../../types/index';
import {
  Plus,
  Search,
  Filter,
  Copy,
  Edit,
  Archive,
  Download,
  Upload,
  AlertCircle,
  CheckCircle2,
  X,
  FileSpreadsheet,
} from 'lucide-react';

interface AdminProductsPageProps {
  navigate: (path: string) => void;
}

export const AdminProductsPage: React.FC<AdminProductsPageProps> = ({ navigate }) => {
  const { adminToken, formatNaira, showToast } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // CSV Import Modal
  const [showImportModal, setShowImportModal] = useState(false);
  const [csvText, setCsvText] = useState('');
  const [importing, setImporting] = useState(false);

  const fetchAdminProducts = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        fetch('/api/products?status=all'),
        fetch('/api/categories?all=true'),
      ]);

      if (prodRes.ok) {
        const data = await prodRes.json();
        setProducts(data.products || []);
      }
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData.categories || []);
      }
    } catch (err) {
      console.error('Failed fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminProducts();
  }, []);

  const handleDuplicate = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}/duplicate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'x-admin-key': 'prince-paradise-master-2026',
        },
      });
      if (res.ok) {
        showToast('Product successfully duplicated as draft', 'success');
        fetchAdminProducts();
      } else {
        showToast('Failed to duplicate product', 'error');
      }
    } catch {
      showToast('Error communicating with server', 'error');
    }
  };

  const handleArchive = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to soft-archive "${name}"? It will be hidden from the storefront while safely preserving past order histories.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'x-admin-key': 'prince-paradise-master-2026',
        },
      });
      if (res.ok) {
        showToast(`"${name}" has been archived`, 'info');
        fetchAdminProducts();
      } else {
        showToast('Failed to archive product', 'error');
      }
    } catch {
      showToast('Error archiving product', 'error');
    }
  };

  const handleBulkImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvText.trim()) return;

    setImporting(true);
    try {
      const res = await fetch('/api/products/bulk-import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
          'x-admin-key': 'prince-paradise-master-2026',
        },
        body: JSON.stringify({ csvContent: csvText }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Successfully imported/updated ${data.importedCount} products`, 'success');
        setShowImportModal(false);
        setCsvText('');
        fetchAdminProducts();
      } else {
        showToast(data.error || 'Failed to import CSV', 'error');
      }
    } catch {
      showToast('Network error importing CSV', 'error');
    } finally {
      setImporting(false);
    }
  };

  // Filtered list
  const filtered = products.filter((p) => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && p.categoryId !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Product Catalog Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Create, edit, soft-archive, or bulk import accessories.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl shadow-2xs transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Bulk CSV Import</span>
          </button>

          <a
            href="/api/products-export/csv"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </a>

          <button
            onClick={() => navigate('/admin/products/new')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Product</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by SKU, product name..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price (Naira)</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Loading products...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No matching products found.
                  </td>
                </tr>
              ) : (
                filtered.map((prod) => {
                  const cat = categories.find((c) => c.id === prod.categoryId);
                  const isOutOfStock = prod.stockQuantity <= 0;
                  const isLowStock = !isOutOfStock && prod.stockQuantity <= prod.lowStockThreshold;
                  const img = prod.images[0]?.url || '/assets/aistudio/1793004952388_f4038399.jpg';

                  return (
                    <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                            <img src={img} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 line-clamp-1 max-w-xs">
                              {prod.name}
                            </div>
                            {prod.featured && (
                              <span className="text-[10px] bg-amber-100 text-amber-800 font-extrabold px-1.5 py-0.2 rounded">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-600 font-semibold">
                        {prod.sku}
                      </td>

                      <td className="py-3 px-4 text-slate-600">
                        {cat?.name || 'Unassigned'}
                      </td>

                      <td className="py-3 px-4 font-extrabold text-blue-700">
                        {formatNaira(prod.priceKobo)}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`font-bold ${
                            isOutOfStock
                              ? 'text-red-600'
                              : isLowStock
                              ? 'text-amber-600'
                              : 'text-slate-800'
                          }`}
                        >
                          {prod.stockQuantity} units
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                            prod.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800'
                              : prod.status === 'draft'
                              ? 'bg-slate-200 text-slate-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {prod.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => navigate(`/admin/products/${prod.id}/edit`)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDuplicate(prod.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                            title="Duplicate Product"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          {prod.status !== 'archived' && (
                            <button
                              onClick={() => handleArchive(prod.id, prod.name)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Soft-Archive"
                            >
                              <Archive className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CSV Bulk Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Bulk CSV Product Import
                </h3>
              </div>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Paste CSV text below with headers: <code>name,sku,category,price,stock,short description</code>.
              Existing SKUs will have their prices and stock updated; new SKUs will be added to the catalog.
            </p>

            <form onSubmit={handleBulkImportSubmit} className="space-y-4">
              <textarea
                rows={8}
                required
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder={`name,sku,category,price,stock,short description\nPrince Paradise Dual GaN Charger,PPT-CH-DUAL-GAN,chargers-and-cables,15500,30,Ultra-fast dual port charger`}
                className="w-full p-3 font-mono text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={importing}
                  className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs disabled:opacity-50"
                >
                  {importing ? 'Processing Import...' : 'Import Products'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
