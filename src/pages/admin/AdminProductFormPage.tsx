import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import type { Product, ProductImage, ProductVariant } from '../../types/index';
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  Trash2,
  Save,
  CheckCircle,
  Eye,
  AlertCircle,
  Image as ImageIcon,
} from 'lucide-react';

interface AdminProductFormPageProps {
  productId?: string;
  navigate: (path: string) => void;
}

export const AdminProductFormPage: React.FC<AdminProductFormPageProps> = ({
  productId,
  navigate,
}) => {
  const { adminToken, showToast } = useStore();
  const isEditing = Boolean(productId);

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [priceNaira, setPriceNaira] = useState<number | string>('');
  const [compareAtNaira, setCompareAtNaira] = useState<number | string>('');
  const [stockQuantity, setStockQuantity] = useState<number>(10);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(5);
  const [warrantyText, setWarrantyText] = useState('12-Month Prince Paradise Warranty');
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('published');
  const [tags, setTags] = useState('');

  // Images list
  const [images, setImages] = useState<ProductImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Key-value specs
  const [specRows, setSpecRows] = useState<{ key: string; value: string }[]>([
    { key: 'Technology', value: 'High Efficiency GaN III' },
  ]);

  // Variants
  const [variantRows, setVariantRows] = useState<{ name: string; options: string }[]>([
    { name: 'Color', options: 'Lilac Purple, Pearl White' },
  ]);

  // Load initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const catRes = await fetch('/api/categories?all=true');
        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData.categories || []);
          if (!categoryId && catData.categories?.length > 0) {
            setCategoryId(catData.categories[0].id);
          }
        }

        if (productId) {
          const prodRes = await fetch(`/api/products/${productId}`);
          if (prodRes.ok) {
            const data = await prodRes.json();
            const p: Product = data.product;
            setName(p.name);
            setSku(p.sku);
            setSlug(p.slug);
            setCategoryId(p.categoryId);
            setShortDescription(p.shortDescription || '');
            setDescription(p.description || '');
            setPriceNaira(p.priceKobo / 100);
            setCompareAtNaira(p.compareAtPriceKobo ? p.compareAtPriceKobo / 100 : '');
            setStockQuantity(p.stockQuantity);
            setLowStockThreshold(p.lowStockThreshold);
            setWarrantyText(p.warrantyText || '');
            setFeatured(p.featured);
            setStatus(p.status);
            setTags(p.tags ? p.tags.join(', ') : '');
            setImages(p.images || []);

            // Specs
            if (p.specifications && Object.keys(p.specifications).length > 0) {
              setSpecRows(
                Object.entries(p.specifications).map(([k, v]) => ({ key: k, value: v }))
              );
            }

            // Variants
            if (p.variants && p.variants.length > 0) {
              setVariantRows(
                p.variants.map((v) => ({ name: v.name, options: v.options.join(', ') }))
              );
            }
          }
        }
      } catch (err) {
        console.error('Error fetching product form details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  // Auto-generate SKU & Slug when name changes if empty
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing && !slug) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
      );
    }
    if (!isEditing && !sku && val.length > 3) {
      const acronym = val
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 4);
      setSku(`PPT-${acronym}-${Math.floor(100 + Math.random() * 900)}`);
    }
  };

  // Image upload handling
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // File Reader
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Data = event.target?.result as string;
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${adminToken}`,
              'x-admin-key': 'prince-paradise-master-2026',
            },
            body: JSON.stringify({
              fileData: base64Data,
              fileName: file.name,
              fileType: file.type,
            }),
          });

          const data = await res.json();
          if (res.ok && data.url) {
            setImages((prev) => [
              ...prev,
              {
                url: data.url,
                storagePath: data.storagePath || data.url,
                altText: name || 'Product image',
                sortOrder: prev.length + 1,
              },
            ]);
            showToast(`Uploaded ${file.name}`, 'success');
          } else {
            showToast(data.error || 'Failed to upload image', 'error');
          }
        } catch {
          showToast('Image upload failed', 'error');
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    setImages((prev) => {
      const next = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= next.length) return prev;
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return next.map((img, i) => ({ ...img, sortOrder: i + 1 }));
    });
  };

  // Submit Handler
  const handleSubmit = async (targetStatus?: 'draft' | 'published' | 'archived') => {
    setError(null);

    if (!name.trim()) {
      setError('Please provide a product name');
      return;
    }
    if (!sku.trim()) {
      setError('Please provide a unique SKU');
      return;
    }
    if (!categoryId) {
      setError('Please select a category');
      return;
    }
    const parsedPrice = parseFloat(String(priceNaira));
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setError('Please enter a valid price in Naira');
      return;
    }

    setSaving(true);
    try {
      const priceKobo = Math.round(parsedPrice * 100);
      const compareAtPriceKobo =
        compareAtNaira && parseFloat(String(compareAtNaira)) > 0
          ? Math.round(parseFloat(String(compareAtNaira)) * 100)
          : null;

      // Compile specs
      const specifications: Record<string, string> = {};
      specRows.forEach((r) => {
        if (r.key.trim() && r.value.trim()) {
          specifications[r.key.trim()] = r.value.trim();
        }
      });

      // Compile variants
      const variants: ProductVariant[] = variantRows
        .filter((v) => v.name.trim() && v.options.trim())
        .map((v, idx) => ({
          id: `var-${idx}-${Date.now()}`,
          name: v.name.trim(),
          options: v.options.split(',').map((o) => o.trim()).filter(Boolean),
        }));

      // Compile tags
      const tagList = tags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      const payload = {
        name: name.trim(),
        sku: sku.trim(),
        slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        categoryId,
        shortDescription: shortDescription.trim(),
        description: description.trim(),
        priceKobo,
        compareAtPriceKobo,
        images: images.length > 0 ? images : [
          {
            storagePath: 'assets/aistudio/1793004952388_f4038399.jpg',
            url: '/assets/aistudio/1793004952388_f4038399.jpg',
            altText: name,
            sortOrder: 1,
          },
        ],
        stockQuantity: Math.max(0, parseInt(String(stockQuantity), 10) || 0),
        lowStockThreshold: Math.max(0, parseInt(String(lowStockThreshold), 10) || 5),
        specifications,
        variants,
        tags: tagList,
        warrantyText: warrantyText.trim() || null,
        featured,
        status: targetStatus || status,
      };

      const url = isEditing ? `/api/products/${productId}` : '/api/products';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
          'x-admin-key': 'prince-paradise-master-2026',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        showToast(
          isEditing
            ? `Product "${payload.name}" updated successfully`
            : `Product "${payload.name}" created successfully`,
          'success'
        );
        navigate('/admin/products');
      } else {
        setError(data.error || 'Failed to save product');
      }
    } catch (err: any) {
      setError('Network error saving product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading product editor...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/admin/products')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Product List</span>
        </button>

        {isEditing && (
          <button
            onClick={() => navigate(`/product/${slug}`)}
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview on Storefront</span>
          </button>
        )}
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {isEditing ? `Edit Product: ${name}` : 'Create New Tech Accessory'}
        </h1>
        <p className="text-xs text-slate-500">
          Save drafts or publish directly to the public live catalog.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form Cards */}
      <div className="space-y-6">
        {/* Basic Details */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            1. Core Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Product Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Prince Paradise 20,000mAh Ultra-Slim Power Bank"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Unique SKU <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. PPT-PB-20K-LILAC"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Short Description (Card summary)
              </label>
              <textarea
                rows={2}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Brief 1-2 sentence highlight for customer preview cards..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Description & Features
              </label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Comprehensive technical breakdown, materials, certifications, and device compatibility..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            2. Pricing & Inventory Management
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Selling Price (₦ Naira) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                step="500"
                value={priceNaira}
                onChange={(e) => setPriceNaira(e.target.value)}
                placeholder="e.g. 28500"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-extrabold text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Compare-at Price (₦ Naira)
              </label>
              <input
                type="number"
                min="0"
                step="500"
                value={compareAtNaira}
                onChange={(e) => setCompareAtNaira(e.target.value)}
                placeholder="e.g. 35000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                min="0"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Low-Stock Warning Level
              </label>
              <input
                type="number"
                min="1"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(parseInt(e.target.value, 10) || 5)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Product Images Uploader */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                3. Product Photography & Media
              </h2>
              <p className="text-xs text-slate-500">
                Upload images from your phone or computer. Reorder or remove images as needed.
              </p>
            </div>
          </div>

          {/* Upload Button */}
          <div className="flex items-center gap-4">
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl border border-blue-200 transition-colors">
              <Upload className="w-4 h-4" />
              <span>{isUploading ? 'Uploading file...' : 'Choose Product Images'}</span>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>
            <span className="text-[11px] text-slate-400">
              Supported: JPG, PNG, WebP (Max 5MB each)
            </span>
          </div>

          {/* Image Previews */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="group relative aspect-square rounded-xl bg-slate-100 border border-slate-200 overflow-hidden"
              >
                <img src={img.url} alt="" className="w-full h-full object-cover" />
                <div className="absolute top-1 left-1 bg-slate-900/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  #{idx + 1} {idx === 0 ? '(Main)' : ''}
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-80 hover:opacity-100 shadow-sm"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                {idx > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(idx, 'up')}
                    className="absolute bottom-1 left-1 text-[10px] bg-slate-800 text-white px-2 py-0.5 rounded font-bold"
                  >
                    ← Move Up
                  </button>
                )}
              </div>
            ))}

            {images.length === 0 && (
              <div className="col-span-2 sm:col-span-4 p-8 text-center border-2 border-dashed border-slate-200 rounded-xl space-y-2">
                <ImageIcon className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-500 font-medium">
                  No images uploaded yet. Default brand emblem will be used if left empty.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Specifications & Variants */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
          {/* Key-Value Specifications */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                4. Technical Specifications
              </h2>
              <button
                type="button"
                onClick={() => setSpecRows((prev) => [...prev, { key: '', value: '' }])}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Spec Row</span>
              </button>
            </div>

            <div className="space-y-2">
              {specRows.map((r, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={r.key}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSpecRows((prev) =>
                        prev.map((row, idx) => (idx === i ? { ...row, key: val } : row))
                      );
                    }}
                    placeholder="e.g. Battery Capacity"
                    className="w-1/3 px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                  <input
                    type="text"
                    value={r.value}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSpecRows((prev) =>
                        prev.map((row, idx) => (idx === i ? { ...row, value: val } : row))
                      );
                    }}
                    placeholder="e.g. 20,000mAh (74Wh)"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setSpecRows((prev) => prev.filter((_, idx) => idx !== i))}
                    className="text-slate-400 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Variants */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                5. Product Variants (Color, Capacity, Cable Length)
              </h2>
              <button
                type="button"
                onClick={() => setVariantRows((prev) => [...prev, { name: '', options: '' }])}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Variant Type</span>
              </button>
            </div>

            <div className="space-y-2">
              {variantRows.map((v, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={v.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setVariantRows((prev) =>
                        prev.map((row, idx) => (idx === i ? { ...row, name: val } : row))
                      );
                    }}
                    placeholder="Variant name (e.g. Color)"
                    className="w-1/3 px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                  <input
                    type="text"
                    value={v.options}
                    onChange={(e) => {
                      const val = e.target.value;
                      setVariantRows((prev) =>
                        prev.map((row, idx) => (idx === i ? { ...row, options: val } : row))
                      );
                    }}
                    placeholder="Comma-separated options (e.g. Lilac Purple, Pearl White)"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setVariantRows((prev) => prev.filter((_, idx) => idx !== i))}
                    className="text-slate-400 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Visibility, Warranty & Status */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            6. Warranty, Tags & Status
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Warranty Terms
              </label>
              <input
                type="text"
                value={warrantyText}
                onChange={(e) => setWarrantyText(e.target.value)}
                placeholder="e.g. 12-Month Prince Paradise Warranty"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Search Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="power bank, fast charge, 20000mah"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Catalog Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white"
              >
                <option value="published">Published (Visible on Storefront)</option>
                <option value="draft">Draft (Hidden)</option>
                <option value="archived">Archived (Soft-hidden)</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-6">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span>Highlight on Homepage Featured Grid</span>
              </label>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm sticky bottom-4 z-20">
          <div className="text-xs text-slate-500 font-medium">
            Changes take effect immediately on live storefront upon save.
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handleSubmit('draft')}
              disabled={saving}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs"
            >
              Save as Draft
            </button>

            <button
              type="button"
              onClick={() => handleSubmit('published')}
              disabled={saving}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Publish Product'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
