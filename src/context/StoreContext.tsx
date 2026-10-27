import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  Product,
  Category,
  StoreSettings,
  CartItem,
  AdminUser,
  OrderRequest,
} from '../types/index';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface StoreContextType {
  settings: StoreSettings | null;
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  cartCount: number;
  cartTotalKobo: number;
  isLoading: boolean;
  adminUser: AdminUser | null;
  adminToken: string | null;
  toasts: Toast[];
  addToCart: (product: Product, quantity?: number, variant?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, variant?: string) => void;
  removeFromCart: (productId: string, variant?: string) => void;
  clearCart: () => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
  formatNaira: (kobo: number) => string;
  loginAdmin: (token: string, user: AdminUser) => void;
  logoutAdmin: () => void;
  refreshCatalog: () => Promise<void>;
  submitOrderRequest: (orderData: {
    customerName: string;
    customerPhone: string;
    deliveryArea?: string;
    customerInstructions?: string;
  }) => Promise<{ success: boolean; whatsappUrl?: string; reference?: string; error?: string }>;
}

const StoreContext = createContext<StoreContextType | null>(null);

const CART_STORAGE_KEY = 'prince_paradise_cart';
const ADMIN_TOKEN_KEY = 'prince_paradise_admin_token';
const ADMIN_USER_KEY = 'prince_paradise_admin_user';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Cart persistence in localStorage for customer convenience
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Admin authentication state
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(ADMIN_TOKEN_KEY);
    } catch {
      return null;
    }
  });

  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem(ADMIN_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('Unable to persist cart in local storage');
    }
  }, [cart]);

  // Initial data fetch
  const refreshCatalog = async () => {
    try {
      setIsLoading(true);
      const [settingsRes, categoriesRes, productsRes] = await Promise.all([
        fetch('/api/settings'),
        fetch('/api/categories'),
        fetch('/api/products'),
      ]);

      if (settingsRes.ok) {
        const data = await settingsRes.json();
        setSettings(data.settings);
      }

      if (categoriesRes.ok) {
        const data = await categoriesRes.json();
        setCategories(data.categories || []);
      }

      if (productsRes.ok) {
        const data = await productsRes.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error('Failed fetching store data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshCatalog();
  }, []);

  // Toast notifications
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Currency Formatter: Kobo to Naira
  const formatNaira = (kobo: number): string => {
    const naira = kobo / 100;
    return `₦${naira.toLocaleString('en-NG', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, variant?: string) => {
    if (product.stockQuantity <= 0) {
      showToast(`${product.name} is currently out of stock.`, 'error');
      return;
    }

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.selectedVariant === variant
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = Math.min(product.stockQuantity, updated[existingIndex].quantity + quantity);
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        return updated;
      } else {
        const initialQty = Math.min(product.stockQuantity, Math.max(1, quantity));
        return [...prev, { productId: product.id, product, quantity: initialQty, selectedVariant: variant }];
      }
    });

    showToast(`Added "${product.name}" to order inquiry`, 'success');
  };

  const updateCartQuantity = (productId: string, quantity: number, variant?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variant);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item.productId === productId && item.selectedVariant === variant) {
          const maxStock = item.product.stockQuantity;
          return { ...item, quantity: Math.min(maxStock, quantity) };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string, variant?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.productId === productId && item.selectedVariant === variant)
      )
    );
    showToast('Item removed from order', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartTotalKobo = cart.reduce((sum, item) => {
    return sum + item.product.priceKobo * item.quantity;
  }, 0);

  // Admin authentication handlers
  const loginAdmin = (token: string, user: AdminUser) => {
    setAdminToken(token);
    setAdminUser(user);
    try {
      localStorage.setItem(ADMIN_TOKEN_KEY, token);
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
    } catch {}
    showToast(`Welcome back, ${user.displayName}!`, 'success');
  };

  const logoutAdmin = () => {
    setAdminToken(null);
    setAdminUser(null);
    try {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem(ADMIN_USER_KEY);
    } catch {}
    showToast('Signed out of admin dashboard', 'info');
  };

  // Submit Order Request to backend (server-side validated, returns WhatsApp URL)
  const submitOrderRequest = async (orderData: {
    customerName: string;
    customerPhone: string;
    deliveryArea?: string;
    customerInstructions?: string;
  }) => {
    if (cart.length === 0) {
      return { success: false, error: 'Your order is empty.' };
    }

    try {
      const itemsPayload = cart.map((item) => ({
        productId: item.productId,
        variantSnapshot: item.selectedVariant,
        quantity: item.quantity,
      }));

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...orderData,
          items: itemsPayload,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to submit order request.' };
      }

      // Success: clear cart and return WhatsApp URL & reference
      clearCart();
      return {
        success: true,
        whatsappUrl: data.whatsappUrl,
        reference: data.reference,
      };
    } catch (err: any) {
      console.error('Order submission failed:', err);
      return { success: false, error: 'Network error submitting order request. Please try again.' };
    }
  };

  return (
    <StoreContext.Provider
      value={{
        settings,
        products,
        categories,
        cart,
        cartCount,
        cartTotalKobo,
        isLoading,
        adminUser,
        adminToken,
        toasts,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        showToast,
        removeToast,
        formatNaira,
        loginAdmin,
        logoutAdmin,
        refreshCatalog,
        submitOrderRequest,
      }}
    >
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-20 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl shadow-lg border text-sm font-medium flex items-center justify-between transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${
              toast.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-800'
                : toast.type === 'info'
                ? 'bg-blue-50 border-blue-200 text-blue-800'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
