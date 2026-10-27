import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import type { Category } from '../../types/index';
import { Plus, Edit, Layers, CheckCircle2, XCircle, ArrowUp, ArrowDown, Save, X } from 'lucide-react';

interface AdminCategoriesPageProps {
  navigate: (path: string) => void;
}

export const AdminCategoriesPage: React.FC<AdminCategoriesPageProps> = ({ navigate }) => {
  const { adminToken, showToast } = useStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit / Create Modal
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/categories?all=true');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error('Failed fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenNew = () => {
    setEditingCategory({
      name: '',
      slug: '',
      description: '',
      sortOrder: categories.length + 1,
      active: true,
      image: {
        url: '/assets/aistudio/1793004952388_f4038399.jpg',
        altText: 'Category thumbnail',
      },
    });
    setIsNew(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory({ ...cat });
    setIsNew(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name) return;

    setSaving(true);
    try {
      const url = isNew
        ? '/api/categories'
        : `/api/categories/${editingCategory.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
          'x-admin-key': 'prince-paradise-master-2026',
        },
        body: JSON.stringify(editingCategory),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(
          isNew
            ? `Category "${editingCategory.name}" created`
            : `Category "${editingCategory.name}" updated`,
          'success'
        );
        setEditingCategory(null);
        fetchCategories();
      } else {
        showToast(data.error || 'Failed to save category', 'error');
      }
    } catch {
      showToast('Network error saving category', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (cat: Category) => {
    try {
      const res = await fetch(`/api/categories/${cat.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
          'x-admin-key': 'prince-paradise-master-2026',
        },
        body: JSON.stringify({ active: !cat.active }),
      });
      if (res.ok) {
        showToast(`Category ${!cat.active ? 'activated' : 'deactivated'}`, 'info');
        fetchCategories();
      }
    } catch {
      showToast('Error updating category', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Category Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Create, reorganize display order, and activate or deactivate product categories.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Order</th>
              <th className="py-3 px-4">Category Name</th>
              <th className="py-3 px-4">Slug</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  Loading categories...
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-500">
                    #{cat.sortOrder}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                        <img
                          src={cat.image?.url || '/assets/aistudio/1793004952388_f4038399.jpg'}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span>{cat.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500">
                    {cat.slug}
                  </td>
                  <td className="py-3 px-4 text-slate-500 max-w-xs truncate">
                    {cat.description}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleActive(cat)}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase transition-colors ${
                        cat.active
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {cat.active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Edit Category"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit/Create Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {isNew ? 'Create New Category' : `Edit Category: ${editingCategory.name}`}
              </h3>
              <button
                onClick={() => setEditingCategory(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingCategory.name || ''}
                  onChange={(e) => {
                    const n = e.target.value;
                    setEditingCategory((prev) => ({
                      ...prev,
                      name: n,
                      slug: isNew ? n.toLowerCase().replace(/[^a-z0-9]+/g, '-') : prev?.slug,
                    }));
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">URL Slug</label>
                <input
                  type="text"
                  required
                  value={editingCategory.slug || ''}
                  onChange={(e) =>
                    setEditingCategory((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingCategory.description || ''}
                  onChange={(e) =>
                    setEditingCategory((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Display Sort Order</label>
                  <input
                    type="number"
                    value={editingCategory.sortOrder || 1}
                    onChange={(e) =>
                      setEditingCategory((prev) => ({
                        ...prev,
                        sortOrder: parseInt(e.target.value, 10) || 1,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={!!editingCategory.active}
                      onChange={(e) =>
                        setEditingCategory((prev) => ({ ...prev, active: e.target.checked }))
                      }
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span>Active on Storefront</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
