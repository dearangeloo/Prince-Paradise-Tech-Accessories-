import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

interface AdminLoginPageProps {
  navigate: (path: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ navigate }) => {
  const { loginAdmin, showToast } = useStore();

  const [email, setEmail] = useState('angelo.smm.uk@gmail.com');
  const [password, setPassword] = useState('PrinceParadise2026!');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        loginAdmin(data.token, data.adminUser);
        navigate('/admin');
      } else {
        setError(data.error || 'Invalid administrator credentials');
      }
    } catch (err: any) {
      setError('Network error authenticating administrator');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-100">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-8 shadow-xl space-y-6">
        {/* Brand Crest */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-white p-1 border-2 border-blue-600 mx-auto shadow-md">
            <img
              src="/assets/aistudio/1793004952388_f4038399.jpg"
              alt="Prince Paradise Shield Lion"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Prince Paradise Control Panel
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Authorized administrative access only
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Administrator Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Sign In as Administrator'}</span>
          </button>
        </form>

        <div className="pt-2 border-t border-slate-100 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium"
          >
            ← Return to Public Storefront
          </button>
        </div>
      </div>
    </div>
  );
};
