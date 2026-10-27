import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Package,
  ShoppingBag,
  Layers,
  AlertTriangle,
  CheckCircle,
  Plus,
  ArrowRight,
  Clock,
  Settings,
  Shield,
  FileSpreadsheet,
} from 'lucide-react';

interface AdminDashboardPageProps {
  navigate: (path: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ navigate }) => {
  const { adminToken, formatNaira } = useStore();
  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats', {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            'x-admin-key': 'prince-paradise-master-2026',
          },
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
          setRecentOrders(data.recentOrders || []);
        }
      } catch (err) {
        console.error('Failed fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [adminToken]);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Storefront Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time catalog inventory, product availability, and WhatsApp order requests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/admin/products/new')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Products */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Catalog</span>
            <Package className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {stats ? stats.totalProducts : '-'}
          </div>
          <div className="text-[11px] text-slate-500">Total Products</div>
        </div>

        {/* Published */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Live</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">
            {stats ? stats.publishedProducts : '-'}
          </div>
          <div className="text-[11px] text-slate-500">Publicly Visible</div>
        </div>

        {/* Drafts */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Drafts</span>
            <Clock className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-700">
            {stats ? stats.draftProducts : '-'}
          </div>
          <div className="text-[11px] text-slate-500">Unpublished Drafts</div>
        </div>

        {/* Low Stock */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Low Stock</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600">
            {stats ? stats.lowStockProducts : '-'}
          </div>
          <div className="text-[11px] text-slate-500">Below Threshold</div>
        </div>

        {/* Out of Stock */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Sold Out</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-extrabold text-red-600">
            {stats ? stats.outOfStockProducts : '-'}
          </div>
          <div className="text-[11px] text-slate-500">Zero Stock</div>
        </div>

        {/* Order Inquiries */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Inquiries</span>
            <ShoppingBag className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-purple-700">
            {stats ? stats.totalOrders : '-'}
          </div>
          <div className="text-[11px] text-slate-500">
            {stats ? stats.pendingOrders : 0} Pending
          </div>
        </div>
      </div>

      {/* Quick Action Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button
          onClick={() => navigate('/admin/products')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 hover:shadow-xs transition-all text-left flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Manage Products
              </h3>
              <p className="text-xs text-slate-500">Edit, duplicate, soft-archive</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
        </button>

        <button
          onClick={() => navigate('/admin/categories')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 hover:shadow-xs transition-all text-left flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Categories
              </h3>
              <p className="text-xs text-slate-500">Organize catalog groupings</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
        </button>

        <button
          onClick={() => navigate('/admin/orders')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 hover:shadow-xs transition-all text-left flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Order Requests
              </h3>
              <p className="text-xs text-slate-500">Review WhatsApp inquiries</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
        </button>

        <button
          onClick={() => navigate('/admin/settings')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 hover:shadow-xs transition-all text-left flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Store Settings
              </h3>
              <p className="text-xs text-slate-500">WhatsApp number & policies</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
        </button>
      </div>

      {/* Recent Order Requests */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Order Requests</h2>
            <p className="text-xs text-slate-500">Transmitted via website WhatsApp checkout inquiry</p>
          </div>
          <button
            onClick={() => navigate('/admin/orders')}
            className="text-xs font-bold text-blue-600 hover:underline"
          >
            View All Orders
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No order requests received yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 overflow-x-auto">
            {recentOrders.map((ord) => (
              <div key={ord.id} className="py-3.5 flex items-center justify-between gap-4 text-xs">
                <div>
                  <div className="font-mono font-bold text-blue-700">{ord.reference}</div>
                  <div className="text-slate-600 font-medium">
                    {ord.customerName} ({ord.customerPhone})
                  </div>
                </div>

                <div className="hidden sm:block text-slate-500">
                  {ord.items.length} {ord.items.length === 1 ? 'item' : 'items'}
                </div>

                <div className="font-bold text-slate-900">
                  {formatNaira(ord.estimatedSubtotalKobo)}
                </div>

                <div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                      ord.status === 'confirmed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : ord.status === 'contacted'
                        ? 'bg-blue-100 text-blue-800'
                        : ord.status === 'completed'
                        ? 'bg-purple-100 text-purple-800'
                        : ord.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {ord.status}
                  </span>
                </div>

                <button
                  onClick={() => navigate('/admin/orders')}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Manage
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
