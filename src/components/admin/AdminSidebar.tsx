import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

interface AdminSidebarProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentPath, navigate }) => {
  const { logoutAdmin, adminUser } = useStore();

  const links = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Categories', path: '/admin/categories', icon: Layers },
    { label: 'Order Requests', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Store Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0B192C] text-slate-300 flex flex-col justify-between shrink-0 min-h-screen border-r border-slate-800">
      <div>
        {/* Admin Header / Logo */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-white p-0.5 border border-slate-700">
            <img
              src="/assets/aistudio/1793004952388_f4038399.jpg"
              alt="Prince Paradise Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="text-sm font-extrabold text-white tracking-tight">
              PRINCE PARADISE
            </div>
            <div className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">
              Control Panel
            </div>
          </div>
        </div>

        {/* User Card */}
        {adminUser && (
          <div className="px-6 py-4 border-b border-slate-800/60 bg-slate-900/40">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <div className="text-xs font-bold text-white truncate">
                {adminUser.displayName || 'Administrator'}
              </div>
            </div>
            <div className="text-[11px] text-slate-400 truncate mt-0.5">
              {adminUser.email}
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="p-4 space-y-1">
          {links.map((link) => {
            const isActive =
              currentPath === link.path ||
              (link.path !== '/admin' && currentPath.startsWith(link.path));
            const Icon = link.icon;
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions: View Storefront & Logout */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Public Storefront</span>
          </span>
          <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
            Live
          </span>
        </button>

        <button
          onClick={logoutAdmin}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
