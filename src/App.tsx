import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { WhatsAppFloatingButton } from './components/layout/WhatsAppFloatingButton';
import { CartDrawer } from './components/shop/CartDrawer';
import { AdminSidebar } from './components/admin/AdminSidebar';

// Public Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { OrderSummaryPage } from './pages/OrderSummaryPage';
import { ContactPage } from './pages/ContactPage';
import { PolicyPage } from './pages/PolicyPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminProductFormPage } from './pages/admin/AdminProductFormPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

const AppContent: React.FC = () => {
  const { adminUser, adminToken } = useStore();
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || '/');
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  // Synchronize browser history
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isAdminRoute = currentPath.startsWith('/admin') && currentPath !== '/admin/login';

  // Route Dispatcher
  const renderRoute = () => {
    // 1. Admin login route
    if (currentPath === '/admin/login') {
      return <AdminLoginPage navigate={navigate} />;
    }

    // 2. Protected Admin routes
    if (isAdminRoute) {
      if (!adminUser && !adminToken) {
        return <AdminLoginPage navigate={navigate} />;
      }

      if (currentPath === '/admin') {
        return <AdminDashboardPage navigate={navigate} />;
      }
      if (currentPath === '/admin/products') {
        return <AdminProductsPage navigate={navigate} />;
      }
      if (currentPath === '/admin/products/new') {
        return <AdminProductFormPage navigate={navigate} />;
      }
      if (currentPath.startsWith('/admin/products/') && currentPath.endsWith('/edit')) {
        const id = currentPath.replace('/admin/products/', '').replace('/edit', '');
        return <AdminProductFormPage productId={id} navigate={navigate} />;
      }
      if (currentPath === '/admin/categories') {
        return <AdminCategoriesPage navigate={navigate} />;
      }
      if (currentPath === '/admin/orders') {
        return <AdminOrdersPage navigate={navigate} />;
      }
      if (currentPath === '/admin/settings') {
        return <AdminSettingsPage navigate={navigate} />;
      }

      return <AdminDashboardPage navigate={navigate} />;
    }

    // 3. Public Routes
    if (currentPath === '/') {
      return <HomePage navigate={navigate} />;
    }
    if (currentPath.startsWith('/shop')) {
      const searchParams = new URLSearchParams(window.location.search);
      const initialSearch = searchParams.get('q') || '';
      return <ShopPage navigate={navigate} initialSearch={initialSearch} />;
    }
    if (currentPath.startsWith('/category/')) {
      const slug = currentPath.replace('/category/', '');
      return <CategoryPage slug={slug} navigate={navigate} />;
    }
    if (currentPath.startsWith('/product/')) {
      const slug = currentPath.replace('/product/', '');
      return (
        <ProductDetailPage
          slug={slug}
          navigate={navigate}
          openCart={() => setCartDrawerOpen(true)}
        />
      );
    }
    if (currentPath === '/order') {
      return <OrderSummaryPage navigate={navigate} />;
    }
    if (currentPath === '/contact') {
      return <ContactPage />;
    }
    if (currentPath === '/faq') {
      return <PolicyPage initialTab="faq" navigate={navigate} />;
    }
    if (currentPath === '/shipping') {
      return <PolicyPage initialTab="shipping" navigate={navigate} />;
    }
    if (currentPath === '/returns') {
      return <PolicyPage initialTab="returns" navigate={navigate} />;
    }
    if (currentPath === '/privacy') {
      return <PolicyPage initialTab="privacy" navigate={navigate} />;
    }
    if (currentPath === '/terms') {
      return <PolicyPage initialTab="terms" navigate={navigate} />;
    }

    // Fallback default
    return <HomePage navigate={navigate} />;
  };

  // If in admin layout
  if (isAdminRoute && (adminUser || adminToken)) {
    return (
      <div className="flex min-h-screen bg-slate-100 font-sans text-slate-900">
        <AdminSidebar currentPath={currentPath} navigate={navigate} />
        <main className="flex-1 p-6 lg:p-10 overflow-y-auto max-h-screen">
          {renderRoute()}
        </main>
      </div>
    );
  }

  // Public storefront layout
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      <Header
        currentPath={currentPath}
        navigate={navigate}
        openCart={() => setCartDrawerOpen(true)}
      />

      <main className="flex-1">{renderRoute()}</main>

      <Footer navigate={navigate} />

      {/* Floating WhatsApp Action Button */}
      <WhatsAppFloatingButton />

      {/* Slide-in Cart Drawer */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        navigate={navigate}
      />
    </div>
  );
};

export function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}

export default App;
