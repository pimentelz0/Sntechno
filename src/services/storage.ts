import { Category, Product, PublicProduct, StoreSettings, AdminUser, OrderRecord } from '../types';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_SETTINGS, DEFAULT_ADMIN } from '../data/initialData';

const STORAGE_KEYS = {
  PRODUCTS: 'sn_techno_products_v1',
  CATEGORIES: 'sn_techno_categories_v1',
  SETTINGS: 'sn_techno_settings_v1',
  ADMIN_USER: 'sn_techno_admin_v1',
  ADMIN_SESSION: 'sn_techno_session_v1',
  ADMIN_PASS: 'sn_techno_admin_pass_v1',
  ORDERS: 'sn_techno_orders_v1',
};

// Safe localStorage wrapper
export class StorageService {
  private static isAvailable(): boolean {
    try {
      return typeof window !== 'undefined' && !!window.localStorage;
    } catch {
      return false;
    }
  }

  // --- SETTINGS ---
  static getSettings(): StoreSettings {
    if (!this.isAvailable()) return INITIAL_SETTINGS;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        // If it was previous placeholder phone or handle, migrate smoothly
        if (parsed.whatsappNumber === '5511999999999' || !parsed.whatsappNumber) {
          parsed.whatsappNumber = INITIAL_SETTINGS.whatsappNumber;
        }
        if (parsed.instagram === '@sntechno_oficial' || !parsed.instagram) {
          parsed.instagram = INITIAL_SETTINGS.instagram;
        }
        return { ...INITIAL_SETTINGS, ...parsed };
      }
    } catch (e) {
      console.error('Error loading settings from storage:', e);
    }
    return INITIAL_SETTINGS;
  }

  static saveSettings(settings: StoreSettings): void {
    if (!this.isAvailable()) return;
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings:', e);
    }
  }

  // --- CATEGORIES ---
  static getCategories(): Category[] {
    if (!this.isAvailable()) return INITIAL_CATEGORIES;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading categories:', e);
    }
    // Seed initial categories if not present
    this.saveCategories(INITIAL_CATEGORIES);
    return INITIAL_CATEGORIES;
  }

  static saveCategories(categories: Category[]): void {
    if (!this.isAvailable()) return;
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error('Error saving categories:', e);
    }
  }

  static saveCategory(category: Partial<Category> & { name: string }): Category {
    const categories = this.getCategories();
    const now = new Date().toISOString();
    let savedCat: Category;

    if (category.id) {
      // Update
      const index = categories.findIndex(c => c.id === category.id);
      if (index >= 0) {
        savedCat = {
          ...categories[index],
          ...category,
          updatedAt: now,
        };
        categories[index] = savedCat;
      } else {
        savedCat = {
          id: category.id,
          name: category.name,
          slug: category.slug || category.name.toLowerCase().replace(/\s+/g, '-'),
          iconName: category.iconName || 'Box',
          description: category.description || '',
          active: category.active ?? true,
          order: category.order ?? (categories.length + 1),
          createdAt: now,
          updatedAt: now,
        };
        categories.push(savedCat);
      }
    } else {
      // Create new
      savedCat = {
        id: `cat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: category.name,
        slug: category.slug || category.name.toLowerCase().replace(/\s+/g, '-'),
        iconName: category.iconName || 'Box',
        description: category.description || '',
        active: category.active ?? true,
        order: category.order ?? (categories.length + 1),
        createdAt: now,
        updatedAt: now,
      };
      categories.push(savedCat);
    }

    this.saveCategories(categories);
    return savedCat;
  }

  static deleteCategory(id: string): boolean {
    const categories = this.getCategories();
    const filtered = categories.filter(c => c.id !== id);
    if (filtered.length !== categories.length) {
      this.saveCategories(filtered);
      return true;
    }
    return false;
  }

  // --- PRODUCTS (ADMIN / INTERNAL) ---
  static getProducts(): Product[] {
    if (!this.isAvailable()) return INITIAL_PRODUCTS;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading products:', e);
    }
    // Seed initial products if not present
    this.saveProducts(INITIAL_PRODUCTS);
    return INITIAL_PRODUCTS;
  }

  static saveProducts(products: Product[]): void {
    if (!this.isAvailable()) return;
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Error saving products:', e);
    }
  }

  static saveProduct(productData: Partial<Product> & { name: string; price: number; categoryId: string }): Product {
    const products = this.getProducts();
    const now = new Date().toISOString();
    let savedProd: Product;

    if (productData.id) {
      const index = products.findIndex(p => p.id === productData.id);
      if (index >= 0) {
        savedProd = {
          ...products[index],
          ...productData,
          updatedAt: now,
        };
        products[index] = savedProd;
      } else {
        savedProd = {
          id: productData.id,
          name: productData.name,
          description: productData.description || '',
          price: Number(productData.price) || 0,
          image: productData.image || 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600',
          categoryId: productData.categoryId,
          stock: Math.max(0, Number(productData.stock) || 0),
          active: productData.active ?? true,
          featured: productData.featured ?? false,
          brandCompat: productData.brandCompat || 'universal',
          modelCompat: productData.modelCompat || '',
          createdAt: now,
          updatedAt: now,
        };
        products.push(savedProd);
      }
    } else {
      savedProd = {
        id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: productData.name,
        description: productData.description || '',
        price: Number(productData.price) || 0,
        image: productData.image || 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600',
        categoryId: productData.categoryId,
        stock: Math.max(0, Number(productData.stock) || 0),
        active: productData.active ?? true,
        featured: productData.featured ?? false,
        brandCompat: productData.brandCompat || 'universal',
        modelCompat: productData.modelCompat || '',
        createdAt: now,
        updatedAt: now,
      };
      products.push(savedProd);
    }

    this.saveProducts(products);
    return savedProd;
  }

  static deleteProduct(id: string): boolean {
    const products = this.getProducts();
    const filtered = products.filter(p => p.id !== id);
    if (filtered.length !== products.length) {
      this.saveProducts(filtered);
      return true;
    }
    return false;
  }

  static updateStock(id: string, newStock: number): boolean {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index >= 0) {
      products[index].stock = Math.max(0, Number(newStock) || 0);
      products[index].updatedAt = new Date().toISOString();
      this.saveProducts(products);
      return true;
    }
    return false;
  }

  // --- SEPARATION: PUBLIC SAFE PRODUCTS (NO NUMERICAL STOCK EXPOSURE) ---
  static getPublicProducts(): PublicProduct[] {
    const products = this.getProducts();
    // Strictly strip the stock number and return availability status only
    return products
      .filter(p => p.active)
      .map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        image: p.image,
        categoryId: p.categoryId,
        isAvailable: p.stock > 0 && p.active,
        active: p.active,
        featured: p.featured,
        brandCompat: p.brandCompat,
        modelCompat: p.modelCompat,
      }));
  }

  // Check product stock internally before cart operations or order dispatch
  static checkAvailability(productId: string, requestedQty: number = 1): { available: boolean; maxAllowed: number } {
    const products = this.getProducts();
    const prod = products.find(p => p.id === productId);
    if (!prod || !prod.active || prod.stock <= 0) {
      return { available: false, maxAllowed: 0 };
    }
    return {
      available: prod.stock >= requestedQty,
      maxAllowed: prod.stock,
    };
  }

  // --- AUTHENTICATION & SECURITY ---
  static getAdminUser(): AdminUser {
    if (!this.isAvailable()) return DEFAULT_ADMIN;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_USER);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.email === 'vicecityprojeto@gmail.com' || parsed.email === 'admin@sntechno.com') {
          parsed.email = 'sntechno@gmail.com';
          localStorage.setItem(STORAGE_KEYS.ADMIN_USER, JSON.stringify(parsed));
        }
        return parsed;
      }
    } catch (e) {
      console.error('Error loading admin user:', e);
    }
    return DEFAULT_ADMIN;
  }

  static getAdminPassword(): string {
    if (!this.isAvailable()) return 'admin123';
    try {
      const pass = localStorage.getItem(STORAGE_KEYS.ADMIN_PASS);
      if (pass) return pass;
    } catch {}
    return 'admin123';
  }

  static setAdminPassword(newPassword: string): void {
    if (!this.isAvailable()) return;
    localStorage.setItem(STORAGE_KEYS.ADMIN_PASS, newPassword);
  }

  static getSession(): { token: string; user: AdminUser; expiresAt: number } | null {
    if (!this.isAvailable()) return null;
    try {
      const sessionStr = sessionStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) || localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION);
      if (!sessionStr) return null;
      const session = JSON.parse(sessionStr);
      if (session.expiresAt && session.expiresAt > Date.now()) {
        return session;
      }
      this.clearSession();
      return null;
    } catch {
      return null;
    }
  }

  static createSession(user: AdminUser, remember: boolean = true): string {
    const token = `sn_token_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    // Session valid for 7 days if remembered, or 12 hours
    const expiresAt = Date.now() + (remember ? 7 * 24 * 60 * 60 * 1000 : 12 * 60 * 60 * 1000);
    const sessionData = { token, user, expiresAt };

    if (this.isAvailable()) {
      if (remember) {
        localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(sessionData));
      } else {
        sessionStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(sessionData));
      }
    }
    return token;
  }

  static clearSession(): void {
    if (!this.isAvailable()) return;
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
  }

  // --- ORDERS ---
  static getOrders(): OrderRecord[] {
    if (!this.isAvailable()) return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  }

  static recordOrder(order: Omit<OrderRecord, 'id' | 'createdAt'>): OrderRecord {
    const orders = this.getOrders();
    const newRecord: OrderRecord = {
      ...order,
      id: `ord-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      createdAt: new Date().toISOString(),
    };
    orders.unshift(newRecord);
    if (this.isAvailable()) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders.slice(0, 100))); // Keep last 100
    }
    return newRecord;
  }

  // Reset database back to default factory settings
  static resetToDefaults(): void {
    if (!this.isAvailable()) return;
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_PASS);
    this.saveProducts(INITIAL_PRODUCTS);
    this.saveCategories(INITIAL_CATEGORIES);
    this.saveSettings(INITIAL_SETTINGS);
  }
}
