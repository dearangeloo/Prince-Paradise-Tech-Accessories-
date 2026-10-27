import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import type { StoreSettings } from '../../types/index';
import { Save, Shield, Settings, Phone, Mail, FileText, CheckCircle2 } from 'lucide-react';

interface AdminSettingsPageProps {
  navigate: (path: string) => void;
}

export const AdminSettingsPage: React.FC<AdminSettingsPageProps> = () => {
  const { adminToken, showToast } = useStore();
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          setSettings(data.settings);
        }
      } catch (err) {
        console.error('Failed fetching settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    try {
      // Auto-normalize WhatsApp number
      let normalized = settings.whatsappNumber.replace(/[^0-9]/g, '');
      if (normalized.startsWith('0')) {
        normalized = `234${normalized.slice(1)}`;
      } else if (!normalized.startsWith('234')) {
        normalized = `234${normalized}`;
      }

      const payload = {
        ...settings,
        normalizedWhatsapp: normalized,
      };

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
          'x-admin-key': 'prince-paradise-master-2026',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Store settings and policies saved successfully', 'success');
        setSettings(data.settings);
      } else {
        showToast(data.error || 'Failed to update store settings', 'error');
      }
    } catch {
      showToast('Error communicating with server', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Store Settings & Policies
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Configure official brand metadata, WhatsApp ordering phone, contact channels, and warranties.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand Information */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            1. Brand Identity
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Store Name</label>
              <input
                type="text"
                required
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Brand Motto</label>
              <input
                type="text"
                required
                value={settings.motto}
                onChange={(e) => setSettings({ ...settings, motto: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-blue-700"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Logo Asset Path / URL
              </label>
              <input
                type="text"
                value={settings.logoUrl}
                onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono text-slate-700"
              />
            </div>
          </div>
        </div>

        {/* WhatsApp & Contact Channels */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            2. Verified WhatsApp Ordering & Contact Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                WhatsApp Business Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                placeholder="+234 813 572 8645"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-900"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Normalized international number for click-to-chat: <code>{settings.normalizedWhatsapp}</code>
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Official Contact Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Delivery Information Text
              </label>
              <textarea
                rows={3}
                value={settings.deliveryInformation}
                onChange={(e) => setSettings({ ...settings, deliveryInformation: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Warranty & Policies */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            3. Warranty & Policy Texts
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                12-Month Warranty and Returns Terms
              </label>
              <textarea
                rows={4}
                value={settings.policyContent?.returnsAndWarranty || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    policyContent: {
                      ...settings.policyContent,
                      returnsAndWarranty: e.target.value,
                    },
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Privacy Notice
              </label>
              <textarea
                rows={3}
                value={settings.policyContent?.privacy || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    policyContent: {
                      ...settings.policyContent,
                      privacy: e.target.value,
                    },
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Settings...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
