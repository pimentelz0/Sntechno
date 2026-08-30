export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName?: string;
  description?: string;
  active: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  stock: number;
  active: boolean;
  featured?: boolean;
  brandCompat?: 'apple' | 'android' | 'universal';
  modelCompat?: string;
  createdAt: string;
  updatedAt: string;
}

// Client-safe product type that NEVER exposes numerical stock
export interface PublicProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  isAvailable: boolean; // Computed: stock > 0 && active
  active: boolean;
  featured?: boolean;
  brandCompat?: 'apple' | 'android' | 'universal';
  modelCompat?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  whatsappNumber: string; // e.g., '5511999999999'
  presentationText: string;
  lowStockThreshold: number;
  address: string;
  businessHours: string;
  instagram: string;
  enableAssistanceTab: boolean;
  bibleVerse: string;
  bibleReference: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin';
  lastLogin?: string;
}

export interface OrderRecord {
  id: string;
  customerName: string;
  customerPhone?: string;
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    subtotal: number;
  }[];
  total: number;
  observation?: string;
  status: 'pending' | 'sent_whatsapp' | 'completed' | 'cancelled';
  createdAt: string;
}
