import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import type { OrderRequest, OrderRequestStatus } from '../../types/index';
import {
  ShoppingBag,
  Search,
  MessageCircle,
  CheckCircle,
  Clock,
  Check,
  X,
  Edit3,
  Phone,
  User,
  MapPin,
  FileText,
} from 'lucide-react';

interface AdminOrdersPageProps {
  navigate: (path: string) => void;
}

export const AdminOrdersPage: React.FC<AdminOrdersPageProps> = () => {
  const { adminToken, formatNaira, showToast } = useStore();
  const [orders, setOrders] = useState<OrderRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Selected Order for Modal View & Status Update
  const [selectedOrder, setSelectedOrder] = useState<OrderRequest | null>(null);
  const [newStatus, setNewStatus] = useState<OrderRequestStatus>('pending');
  const [staffNotes, setStaffNotes] = useState('');
  const [reduceInventory, setReduceInventory] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/orders', {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'x-admin-key': 'prince-paradise-master-2026',
        },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Failed fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpenDetail = (order: OrderRequest) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStaffNotes(order.staffNotes || '');
    setReduceInventory(false);
  };

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
          'x-admin-key': 'prince-paradise-master-2026',
        },
        body: JSON.stringify({
          status: newStatus,
          staffNotes,
          reduceInventory,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Order ${selectedOrder.reference} updated to ${newStatus}`, 'success');
        setSelectedOrder(null);
        fetchOrders();
      } else {
        showToast(data.error || 'Failed to update order status', 'error');
      }
    } catch {
      showToast('Error communicating with server', 'error');
    } finally {
      setUpdating(false);
    }
  };

  // WhatsApp chat with customer
  const handleChatCustomer = (order: OrderRequest) => {
    // Clean Nigerian phone number
    let cleanPhone = order.customerPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = `234${cleanPhone.slice(1)}`;
    } else if (!cleanPhone.startsWith('234')) {
      cleanPhone = `234${cleanPhone}`;
    }

    const message =
      `Hello ${order.customerName},\n\n` +
      `This is Prince Paradise Tech Accessories regarding your order inquiry ${order.reference}.\n\n` +
      `We have reviewed your request and confirmed stock availability. Please let us know if you are ready for delivery confirmation.`;

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const filtered = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        o.reference.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          WhatsApp Order Inquiries
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Review customer inquiries, record staff notes, and manage status transitions safely.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by reference, name, phone..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="contacted">Contacted</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Delivery Area</th>
                <th className="py-3 px-4">Items Breakdown</th>
                <th className="py-3 px-4">Estimated Subtotal</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Loading order inquiries...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No order inquiries found.
                  </td>
                </tr>
              ) : (
                filtered.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-blue-700">
                      {ord.reference}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{ord.customerName}</div>
                      <div className="text-slate-500 text-[11px] font-mono">
                        {ord.customerPhone}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-600 max-w-[150px] truncate">
                      {ord.deliveryArea || 'Unspecified'}
                    </td>

                    <td className="py-3 px-4 text-slate-700">
                      <div className="max-w-xs truncate">
                        {ord.items.map((it) => `${it.quantity}x ${it.productNameSnapshot}`).join(', ')}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-extrabold text-slate-900">
                      {formatNaira(ord.estimatedSubtotalKobo)}
                    </td>

                    <td className="py-3 px-4">
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
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleChatCustomer(ord)}
                          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                          title="Message Customer on WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4 fill-emerald-600" />
                        </button>

                        <button
                          onClick={() => handleOpenDetail(ord)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-bold rounded-lg transition-colors"
                        >
                          Review & Update
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review & Status Management Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                  Order Management
                </span>
                <h3 className="text-base font-extrabold text-blue-700">
                  {selectedOrder.reference}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Items Review */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 font-medium">Customer:</span>
                <div className="font-bold text-slate-900">{selectedOrder.customerName}</div>
                <div className="font-mono text-slate-600">{selectedOrder.customerPhone}</div>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Delivery Destination:</span>
                <div className="font-bold text-slate-900">
                  {selectedOrder.deliveryArea || 'Not specified'}
                </div>
              </div>
            </div>

            {/* Line items breakdown */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Requested Products
              </h4>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {selectedOrder.items.map((it, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 border border-slate-200"
                  >
                    <div>
                      <span className="font-bold text-slate-900">
                        {it.quantity}x {it.productNameSnapshot}
                      </span>
                      {it.variantSnapshot && (
                        <span className="text-blue-600 font-medium"> ({it.variantSnapshot})</span>
                      )}
                      <div className="text-[10px] text-slate-400 font-mono">
                        SKU: {it.skuSnapshot}
                      </div>
                    </div>
                    <span className="font-bold text-slate-900">
                      {formatNaira(it.unitPriceKobo * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs font-extrabold text-slate-900 pt-1 border-t border-slate-100">
                <span>Estimated Items Subtotal:</span>
                <span className="text-blue-700 text-sm">
                  {formatNaira(selectedOrder.estimatedSubtotalKobo)}
                </span>
              </div>
            </div>

            {/* Update Form */}
            <form onSubmit={handleStatusUpdate} className="space-y-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Change Order Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="pending">Pending (Unreviewed)</option>
                  <option value="contacted">Contacted (WhatsApp chat initiated)</option>
                  <option value="confirmed">Confirmed (Stock & Price validated)</option>
                  <option value="completed">Completed (Dispatched & Delivered)</option>
                  <option value="cancelled">Cancelled (Out of stock or customer retracted)</option>
                </select>
              </div>

              {/* Deduct inventory checkbox if confirming */}
              {newStatus === 'confirmed' && selectedOrder.status !== 'confirmed' && (
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-slate-800 p-2.5 rounded-xl bg-blue-50 border border-blue-200">
                  <input
                    type="checkbox"
                    checked={reduceInventory}
                    onChange={(e) => setReduceInventory(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span>Deduct stock quantities for these items from live inventory</span>
                </label>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Internal Staff Notes (Restricted)
                </label>
                <textarea
                  rows={2}
                  value={staffNotes}
                  onChange={(e) => setStaffNotes(e.target.value)}
                  placeholder="e.g. Spoke with customer on WhatsApp. Delivery to Lekki Phase 1 confirmed. Bank transfer receipt verified."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs disabled:opacity-50"
                >
                  {updating ? 'Updating...' : 'Save Order Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
