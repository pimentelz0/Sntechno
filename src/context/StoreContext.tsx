import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Product, PublicProduct, Category, StoreSettings, CartItem, OrderRecord } from '../types';
import { StorageService } from '../services/storage';
import { SupabaseService, isSupabaseConfigured } from '../lib/supabase';
import { generateWhatsAppOrderMessage, createWhatsAppLink } from '../lib/utils';

interface StoreContextType {
  // Products & Categories
  products: Product[];
  publicProducts: PublicProduct[];
  categories: Category[];
  activeCategories: Category[];
  settings: StoreSettings;
  
  // Cart
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (productId: string, quantity?: number) => { success: boolean; message?: string };
  updateCartQty: (productId: string, quantity: number) => { success: boolean; message?: string };
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  checkoutWhatsApp: (customerName: string, observation?: string) => { success: boolean; message?: string; url?: string };

  // Navigation & Routing (Single-Domain SPA)
  currentRoute: string;
  navigate: (route: string) => void;

  // Search & Filter state for Public
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategoryId: string;
  setSelectedCategoryId: (catId: string) => void;
  selectedBrandFilter: 'all' | 'apple' | 'android' | 'universal';
  setSelectedBrandFilter: (filter: 'all' | 'apple' | 'android' | 'universal') => void;

  // Modals
  selectedProductForModal: PublicProduct | null;
  setSelectedProductForModal: (product: PublicProduct | null) => void;
  
  // Admin Operations
  addProduct: (productData: Partial<Product> & { name: string; price: number; categoryId: string }) => Product;
  updateProduct: (productData: Partial<Product> & { id: string; name: string; price: number; categoryId: string }) => Product;
  deleteProduct: (id: string) => boolean;
  updateStock: (id: string, newStock: number) => boolean;
  toggleProductActive: (id: string) => boolean;

  addCategory: (categoryData: Partial<Category> & { name: string }) => Category;
  updateCategory: (categoryData: Partial<Category> & { id: string; name: string }) => Category;
  deleteCategory: (id: string) => boolean;

  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  resetDatabase: () => void;
  resetToInitialData: () => void;

  // Supabase Sync
  supabaseStatus: 'connected' | 'syncing' | 'error' | 'idle';
  syncToSupabaseNow: () => Promise<{ success: boolean; message: string }>;
  testSupabase: () => Promise<{ success: boolean; message: string }>;

  // Orders
  orders: OrderRecord[];
  refreshData: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(StorageService.getSettings());
  const [supabaseStatus, setSupabaseStatus] = useState<'connected' | 'syncing' | 'error' | 'idle'>('idle');
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('sn_techno_cart_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<'all' | 'apple' | 'android' | 'universal'>('all');
  const [selectedProductForModal, setSelectedProductForModal] = useState<PublicProduct | null>(null);

  // Helper to extract current route from window location (supports both pathname and hash)
  const getPathFromLocation = useCallback(() => {
    if (typeof window === 'undefined') return '/';
    const pathname = window.location.pathname || '/';
    const hash = window.location.hash || '';

    // Check pathname first
    if (pathname.startsWith('/admin')) {
      return pathname;
    }
    // Also support hash-based direct routing (e.g. #/admin or #admin)
    if (hash.startsWith('#/admin') || hash.startsWith('#admin')) {
      return hash.replace(/^#\/?/, '/');
    }
    return pathname;
  }, []);

  // Routing State for Single Domain
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname || '/';
      const hash = window.location.hash || '';
      if (pathname.startsWith('/admin')) return pathname;
      if (hash.startsWith('#/admin') || hash.startsWith('#admin')) return hash.replace(/^#\/?/, '/');
      return pathname;
    }
    return '/';
  });

  // Sync route with browser history
  const navigate = useCallback((route: string) => {
    setCurrentRoute(route);
    if (typeof window !== 'undefined') {
      if (window.location.pathname !== route) {
        window.history.pushState({}, '', route);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const handleUrlChange = () => {
      setCurrentRoute(getPathFromLocation());
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, [getPathFromLocation]);

  // Load all initial data from local storage first (instant responsiveness)
  const refreshData = useCallback(() => {
    const localProds = StorageService.getProducts();
    const localCats = StorageService.getCategories();
    const localSet = StorageService.getSettings();
    const localOrd = StorageService.getOrders();

    setProducts(localProds);
    setCategories(localCats);
    setSettings(localSet);
    setOrders(localOrd);
  }, []);

  // Sync from Supabase on mount
  useEffect(() => {
    refreshData();

    if (!isSupabaseConfigured) return;

    let isMounted = true;
    const fetchFromSupabase = async () => {
      try {
        setSupabaseStatus('syncing');
        const [sbCategories, sbProducts, sbSettings] = await Promise.all([
          SupabaseService.fetchCategories(),
          SupabaseService.fetchProducts(),
          SupabaseService.fetchSettings(),
        ]);

        if (!isMounted) return;

        let hasDataInSupabase = false;

        if (sbCategories && sbCategories.length > 0) {
          setCategories(sbCategories);
          StorageService.saveCategories(sbCategories);
          hasDataInSupabase = true;
        }

        if (sbProducts && sbProducts.length > 0) {
          setProducts(sbProducts);
          StorageService.saveProducts(sbProducts);
          hasDataInSupabase = true;
        }

        if (sbSettings) {
          setSettings(sbSettings);
          StorageService.saveSettings(sbSettings);
          hasDataInSupabase = true;
        }

        // If Supabase was empty, attempt initial seed from local data
        if (!hasDataInSupabase) {
          const currentProds = StorageService.getProducts();
          const currentCats = StorageService.getCategories();
          const currentSet = StorageService.getSettings();
          await SupabaseService.syncAllToSupabase(currentProds, currentCats, currentSet);
        }

        setSupabaseStatus('connected');
      } catch (err) {
        console.warn('Supabase initial fetch/sync notice:', err);
        if (isMounted) setSupabaseStatus('error');
      }
    };

    fetchFromSupabase();

    return () => {
      isMounted = false;
    };
  }, [refreshData]);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('sn_techno_cart_v1', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to persist cart:', e);
    }
  }, [cart]);

  // Derived: Public Safe Products (strictly no stock counts exposed to client)
  const publicProducts: PublicProduct[] = useMemo(() => {
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
  }, [products]);

  // Derived: Active categories only
  const activeCategories: Category[] = useMemo(() => {
    return categories
      .filter(c => c.active)
      .sort((a, b) => a.order - b.order);
  }, [categories]);

  // Cart Calculations
  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  // Cart Actions with Server-side/Stock validation
  const addToCart = useCallback((productId: string, quantity: number = 1) => {
    const product = products.find(p => p.id === productId);
    if (!product || !product.active) {
      return { success: false, message: 'Produto não disponível para compra.' };
    }

    if (product.stock <= 0) {
      return { success: false, message: 'Este produto está esgotado no momento.' };
    }

    const existingIndex = cart.findIndex(item => item.product.id === productId);
    const currentQtyInCart = existingIndex >= 0 ? cart[existingIndex].quantity : 0;
    const newQty = currentQtyInCart + quantity;

    if (newQty > product.stock) {
      return {
        success: false,
        message: `Limite de estoque atingido para este item.`,
      };
    }

    setCart(prev => {
      if (existingIndex >= 0) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: newQty,
        };
        return next;
      }
      return [...prev, { product, quantity }];
    });

    return { success: true, message: 'Produto adicionado ao carrinho!' };
  }, [products, cart]);

  const updateCartQty = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => item.product.id !== productId));
      return { success: true };
    }

    const product = products.find(p => p.id === productId);
    if (!product) {
      setCart(prev => prev.filter(item => item.product.id !== productId));
      return { success: false, message: 'Produto não encontrado.' };
    }

    if (quantity > product.stock) {
      return {
        success: false,
        message: `Quantidade solicitada indisponível no estoque.`,
      };
    }

    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
    return { success: true };
  }, [products]);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // WhatsApp Checkout + Supabase Order record
  const checkoutWhatsApp = useCallback((customerName: string, observation?: string) => {
    if (!customerName || !customerName.trim()) {
      return { success: false, message: 'Por favor, informe seu nome para o pedido.' };
    }

    if (cart.length === 0) {
      return { success: false, message: 'Seu carrinho está vazio.' };
    }

    // Re-validate all items against latest stock
    for (const item of cart) {
      const liveProduct = products.find(p => p.id === item.product.id);
      if (!liveProduct || !liveProduct.active || liveProduct.stock <= 0) {
        return {
          success: false,
          message: `O item "${item.product.name}" não está mais disponível em nosso estoque.`,
        };
      }
      if (item.quantity > liveProduct.stock) {
        return {
          success: false,
          message: `A quantidade do item "${item.product.name}" excede o estoque disponível.`,
        };
      }
    }

    // Build payload
    const payload = {
      storeName: settings.storeName || 'SN TECHNO',
      customerName: customerName.trim(),
      observation: observation ? observation.trim() : undefined,
      items: cart.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      })),
      total: cartTotal,
    };

    const message = generateWhatsAppOrderMessage(payload);
    const targetPhone = settings.whatsappNumber || '5511999999999';
    const whatsappUrl = createWhatsAppLink(targetPhone, message);

    // Save order record locally
    const newRecord = StorageService.recordOrder({
      customerName: customerName.trim(),
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        subtotal: item.product.price * item.quantity,
      })),
      total: cartTotal,
      observation: observation?.trim(),
      status: 'sent_whatsapp',
    });

    setOrders(prev => [newRecord, ...prev]);

    // Asynchronously save to Supabase
    SupabaseService.saveOrder(newRecord).catch(err => {
      console.warn('Supabase saveOrder non-blocking notice:', err);
    });

    // Open WhatsApp in new tab/window
    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }

    // Clear cart and close drawer
    clearCart();
    setIsCartOpen(false);

    return {
      success: true,
      message: 'Pedido formatado e direcionado para o WhatsApp com sucesso!',
      url: whatsappUrl,
    };
  }, [cart, products, settings, cartTotal, clearCart]);

  // Product CRUD (Optimistic Local + Supabase async sync)
  const addProduct = useCallback((productData: Partial<Product> & { name: string; price: number; categoryId: string }) => {
    const saved = StorageService.saveProduct(productData);
    refreshData();
    SupabaseService.upsertProduct(saved).catch(err => console.warn('Supabase addProduct notice:', err));
    return saved;
  }, [refreshData]);

  const updateProduct = useCallback((productData: Partial<Product> & { id: string; name: string; price: number; categoryId: string }) => {
    const saved = StorageService.saveProduct(productData);
    refreshData();
    SupabaseService.upsertProduct(saved).catch(err => console.warn('Supabase updateProduct notice:', err));
    return saved;
  }, [refreshData]);

  const deleteProduct = useCallback((id: string) => {
    const deleted = StorageService.deleteProduct(id);
    if (deleted) {
      setCart(prev => prev.filter(item => item.product.id !== id));
      refreshData();
      SupabaseService.deleteProduct(id).catch(err => console.warn('Supabase deleteProduct notice:', err));
    }
    return deleted;
  }, [refreshData]);

  const updateStock = useCallback((id: string, newStock: number) => {
    const updated = StorageService.updateStock(id, newStock);
    if (updated) {
      refreshData();
      SupabaseService.updateStock(id, newStock).catch(err => console.warn('Supabase updateStock notice:', err));
    }
    return updated;
  }, [refreshData]);

  const toggleProductActive = useCallback((id: string) => {
    const prod = products.find(p => p.id === id);
    if (prod) {
      const updated = {
        ...prod,
        active: !prod.active,
      };
      StorageService.saveProduct(updated);
      refreshData();
      SupabaseService.upsertProduct(updated).catch(err => console.warn('Supabase toggleActive notice:', err));
      return true;
    }
    return false;
  }, [products, refreshData]);

  // Category CRUD
  const addCategory = useCallback((categoryData: Partial<Category> & { name: string }) => {
    const saved = StorageService.saveCategory(categoryData);
    refreshData();
    SupabaseService.upsertCategory(saved).catch(err => console.warn('Supabase addCategory notice:', err));
    return saved;
  }, [refreshData]);

  const updateCategory = useCallback((categoryData: Partial<Category> & { id: string; name: string }) => {
    const saved = StorageService.saveCategory(categoryData);
    refreshData();
    SupabaseService.upsertCategory(saved).catch(err => console.warn('Supabase updateCategory notice:', err));
    return saved;
  }, [refreshData]);

  const deleteCategory = useCallback((id: string) => {
    const deleted = StorageService.deleteCategory(id);
    if (deleted) {
      refreshData();
      SupabaseService.deleteCategory(id).catch(err => console.warn('Supabase deleteCategory notice:', err));
    }
    return deleted;
  }, [refreshData]);

  // Settings
  const updateSettings = useCallback((newSettings: Partial<StoreSettings>) => {
    const current = StorageService.getSettings();
    const merged = { ...current, ...newSettings };
    StorageService.saveSettings(merged);
    setSettings(merged);
    SupabaseService.upsertSettings(merged).catch(err => console.warn('Supabase updateSettings notice:', err));
  }, []);

  const resetDatabase = useCallback(() => {
    StorageService.resetToDefaults();
    refreshData();
    clearCart();
    const defaultProds = StorageService.getProducts();
    const defaultCats = StorageService.getCategories();
    const defaultSet = StorageService.getSettings();
    SupabaseService.syncAllToSupabase(defaultProds, defaultCats, defaultSet).catch(err => console.warn('Supabase reset sync notice:', err));
  }, [refreshData, clearCart]);

  // Supabase Manual Sync & Test
  const syncToSupabaseNow = useCallback(async () => {
    setSupabaseStatus('syncing');
    const result = await SupabaseService.syncAllToSupabase(products, categories, settings);
    setSupabaseStatus(result.success ? 'connected' : 'error');
    return result;
  }, [products, categories, settings]);

  const testSupabase = useCallback(async () => {
    return await SupabaseService.testConnection();
  }, []);

  return (
    <StoreContext.Provider
      value={{
        products,
        publicProducts,
        categories,
        activeCategories,
        settings,
        cart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        checkoutWhatsApp,
        currentRoute,
        navigate,
        searchQuery,
        setSearchQuery,
        selectedCategoryId,
        setSelectedCategoryId,
        selectedBrandFilter,
        setSelectedBrandFilter,
        selectedProductForModal,
        setSelectedProductForModal,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
        toggleProductActive,
        addCategory,
        updateCategory,
        deleteCategory,
        updateSettings,
        resetDatabase,
        resetToInitialData: resetDatabase,
        supabaseStatus,
        syncToSupabaseNow,
        testSupabase,
        orders,
        refreshData,
      }}
    >
      {children}
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

