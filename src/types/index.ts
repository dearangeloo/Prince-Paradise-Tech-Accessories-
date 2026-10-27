export type ProductStatus = 'draft' | 'published' | 'archived';

export interface ProductImage {
  storagePath: string;
  url: string;
  altText: string;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Color", "Capacity"
  options: string[]; // e.g. ["Lilac Purple", "Pearl White"]
  priceAdjustmentKobo?: number; // optional adjustment in kobo
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  categoryId: string;
  shortDescription: string;
  description: string;
  specifications: Record<string, string>;
  priceKobo: number; // Stored in kobo (1 NGN = 100 kobo)
  compareAtPriceKobo: number | null;
  images: ProductImage[];
  stockQuantity: number;
  lowStockThreshold: number;
  variants: ProductVariant[];
  tags: string[];
  warrantyText: string | null;
  featured: boolean;
  status: ProductStatus;
  createdAt: number | string;
  updatedAt: number | string;
  createdBy?: string;
  updatedBy?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: {
    url: string;
    altText: string;
  } | null;
  sortOrder: number;
  active: boolean;
  createdAt: number | string;
  updatedAt: number | string;
}

export type OrderRequestStatus =
  | 'pending'
  | 'contacted'
  | 'confirmed'
  | 'cancelled'
  | 'completed';

export interface OrderRequestItem {
  productId: string;
  productNameSnapshot: string;
  skuSnapshot: string;
  variantSnapshot?: string;
  quantity: number;
  unitPriceKobo: number;
}

export interface OrderRequest {
  id: string;
  reference: string;
  customerName: string;
  customerPhone: string;
  deliveryArea: string | null;
  items: OrderRequestItem[];
  estimatedSubtotalKobo: number;
  status: OrderRequestStatus;
  source: 'website_whatsapp';
  customerInstructions: string | null;
  staffNotes?: string | null;
  createdAt: number | string;
  updatedAt: number | string;
  confirmedBy?: string | null;
  confirmedAt?: number | string | null;
}

export interface AdminUser {
  uid: string;
  displayName: string;
  email: string;
  role: 'admin' | 'editor';
  active: boolean;
  createdAt: number | string;
  lastLoginAt: number | string | null;
}

export interface StoreSettings {
  storeName: string;
  motto: string;
  logoStoragePath?: string;
  logoUrl: string;
  whatsappNumber: string; // "+234 813 572 8645"
  normalizedWhatsapp: string; // "2348135728645"
  currency: string; // "NGN"
  contactEmail: string; // "accessories.princeparadisetech@gmail.com"
  publicContactPhone: string; // "+234 813 572 8645"
  socialLinks: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    linkedin?: string;
  };
  deliveryInformation: string;
  policyContent: {
    shipping: string;
    returnsAndWarranty: string;
    privacy: string;
    terms: string;
  };
}

export interface AuditLog {
  id: string;
  actorUid: string;
  action: string;
  entityType: 'product' | 'category' | 'order' | 'settings' | 'auth';
  entityId: string;
  timestamp: number | string;
  summary: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  selectedVariant?: string;
  quantity: number;
}

export interface CatalogFilterOptions {
  categoryId?: string;
  searchQuery?: string;
  inStockOnly?: boolean;
  minPriceKobo?: number;
  maxPriceKobo?: number;
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'name';
}
