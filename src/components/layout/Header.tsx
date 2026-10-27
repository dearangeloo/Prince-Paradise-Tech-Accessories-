import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  MessageCircle,
  ShieldCheck,
  ChevronRight,
  User,
} from 'lucide-react';

interface HeaderProps {
  currentPath: string;
  navigate: (path: string) => void;
  openCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, navigate, openCart }) => {
  const { settings, cartCount, adminUser } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Shop Catalog', path: '/shop' },
    { label: 'Power Banks', path: '/category/power-banks' },
    { label: 'Chargers & Cables', path: '/category/chargers-and-cables' },
    { label: 'Contact', path: '/contact' },
  ];

  const logoSrc = settings?.logoUrl || '/assets/aistudio/1793004952388_f4038399.jpg';
  const whatsappNum = settings?.normalizedWhatsapp || '2348135728645';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all duration-200">
      {/* Top Brand Notification Bar */}
      <div className="bg-[#0B192C] text-slate-200 text-xs py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>POWER YOUR WORLD • Fast Nationwide Dispatch across Nigeria</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-slate-300">
            <a
              href={`https://wa.me/${whatsappNum}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp: +234 813 572 8645</span>
            </a>
            {adminUser && (
              <button
                onClick={() => navigate('/admin')}
                className="text-blue-300 hover:text-white flex items-center gap-1 font-semibold"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand Identity */}
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-white shadow-sm border border-slate-200 p-0.5 group-hover:border-blue-600 transition-colors">
              <img
                src={logoSrc}
                alt="Prince Paradise Shield Lion Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors">
                PRINCE PARADISE
              </div>
              <div className="text-[10px] sm:text-xs font-semibold tracking-wider text-slate-500 uppercase">
                Tech Accessories
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive =
                currentPath === link.path ||
                (link.path !== '/' && currentPath.startsWith(link.path));
              return (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`text-sm font-semibold transition-colors py-1 relative ${
                    isActive
                      ? 'text-blue-700'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search Catalog"
              className="p-2 sm:p-2.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Direct WhatsApp Action Button */}
            <a
              href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(
                'Hello Prince Paradise Tech Accessories, I have an inquiry about your products.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WhatsApp Chat</span>
            </a>

            {/* Cart / Order Inquiry Icon */}
            <button
              onClick={openCart}
              aria-label="Order Inquiry Cart"
              className="relative p-2 sm:p-2.5 rounded-full text-slate-700 hover:text-blue-700 hover:bg-blue-50 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-blue-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-sm animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin or Login Shortcut */}
            <button
              onClick={() => navigate(adminUser ? '/admin' : '/admin/login')}
              aria-label="Admin Portal"
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title={adminUser ? 'Admin Dashboard' : 'Admin Login'}
            >
              <User className="w-4 h-4" />
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Search Input */}
      {searchOpen && (
        <div className="bg-slate-50 border-t border-b border-slate-200 px-4 py-3 animate-in slide-in-from-top-2">
          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by name, SKU (e.g. PPT-PB-20K), or features..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-400"
                autoFocus
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-colors shadow-sm"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="px-3 py-2.5 text-slate-500 hover:text-slate-700 text-sm font-medium"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  navigate(link.path);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-blue-700"
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <a
              href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(
                'Hello Prince Paradise Tech Accessories, I would like to make an inquiry.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-lg shadow-sm"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Chat on WhatsApp (+234 813 572 8645)</span>
            </a>

            {adminUser ? (
              <button
                onClick={() => {
                  navigate('/admin');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-blue-600 text-blue-700 text-sm font-bold rounded-lg"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  navigate('/admin/login');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center text-xs text-slate-500 hover:text-slate-800 py-1"
              >
                Administrator Portal
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
