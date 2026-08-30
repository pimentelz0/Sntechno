import { createClient } from '@supabase/supabase-js';
import { Product, Category, StoreSettings, OrderRecord } from '../types';

// Environment variables with VITE_ prefix for Vite / Vercel
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zatwvmhebirtnfhhwamz.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_I1qRt-YZZrsVMTJ-a_5MEg_GPk0K2oO';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// SQL Schema for users to run in Supabase SQL editor if tables do not exist yet
export const SUPABASE_SQL_SETUP = `-- Script de Configuração Inicial do Supabase para SN TECHNO
-- Execute no SQL Editor do Supabase (https://supabase.com/dashboard/project/_/sql)

-- 1. Tabela de Categorias
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  icon_name TEXT DEFAULT 'Box',
  description TEXT,
  active BOOLEAN DEFAULT true,
  "order" INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabela de Produtos
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  image TEXT,
  category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  brand_compat TEXT DEFAULT 'universal',
  model_compat TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabela de Configurações da Loja
CREATE TABLE IF NOT EXISTS public.settings (
  id TEXT PRIMARY KEY DEFAULT 'sn_techno_default',
  store_name TEXT NOT NULL DEFAULT 'SN TECHNO',
  tagline TEXT DEFAULT 'Consertos em Celulares • Vendas de Acessórios',
  whatsapp_number TEXT DEFAULT '5511999999999',
  presentation_text TEXT,
  low_stock_threshold INTEGER DEFAULT 5,
  address TEXT DEFAULT 'Atendimento e Retirada na Loja Física • Consulte horários',
  business_hours TEXT DEFAULT 'Segunda a Sexta: 09h às 18h | Sábado: 09h às 13h',
  instagram_handle TEXT DEFAULT 'sntechno',
  bible_verse TEXT DEFAULT 'Consagre ao Senhor tudo o que você faz, e os seus planos serão bem-sucedidos.',
  bible_reference TEXT DEFAULT 'Provérbios 16:3',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Tabela de Pedidos
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar Row Level Security (RLS) e Políticas de Leitura Pública / Escrita com Anon Key
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read categories" ON public.categories;
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public write categories" ON public.categories;
CREATE POLICY "Public write categories" ON public.categories FOR ALL USING (true);

DROP POLICY IF EXISTS "Public read products" ON public.products;
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public write products" ON public.products FOR ALL USING (true);

DROP POLICY IF EXISTS "Public read settings" ON public.settings;
CREATE POLICY "Public read settings" ON public.settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public write settings" ON public.settings FOR ALL USING (true);

DROP POLICY IF EXISTS "Public read orders" ON public.orders;
CREATE POLICY "Public read orders" ON public.orders FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public write orders" ON public.orders FOR ALL USING (true);
`;

// Helper converters between TS types and DB schemas
export function mapDbCategoryToCategory(row: Record<string, any>): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug || row.name?.toLowerCase().replace(/\s+/g, '-'),
    iconName: row.icon_name || row.iconName || 'Box',
    description: row.description || '',
    active: row.active ?? true,
    order: row.order ?? 1,
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
    updatedAt: row.updated_at || row.updatedAt || new Date().toISOString(),
  };
}

export function mapCategoryToDb(cat: Category): Record<string, any> {
  return {
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    icon_name: cat.iconName,
    description: cat.description,
    active: cat.active,
    order: cat.order,
    created_at: cat.createdAt,
    updated_at: cat.updatedAt,
  };
}

export function mapDbProductToProduct(row: Record<string, any>): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description || '',
    price: Number(row.price) || 0,
    image: row.image || 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600',
    categoryId: row.category_id || row.categoryId || '',
    stock: Number(row.stock) || 0,
    active: row.active ?? true,
    featured: row.featured ?? false,
    brandCompat: row.brand_compat || row.brandCompat || 'universal',
    modelCompat: row.model_compat || row.modelCompat || '',
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
    updatedAt: row.updated_at || row.updatedAt || new Date().toISOString(),
  };
}

export function mapProductToDb(prod: Product): Record<string, any> {
  return {
    id: prod.id,
    name: prod.name,
    description: prod.description,
    price: prod.price,
    image: prod.image,
    category_id: prod.categoryId,
    stock: prod.stock,
    active: prod.active,
    featured: prod.featured,
    brand_compat: prod.brandCompat,
    model_compat: prod.modelCompat,
    created_at: prod.createdAt,
    updated_at: prod.updatedAt,
  };
}

export function mapDbSettingsToSettings(row: Record<string, any>): StoreSettings {
  return {
    storeName: row.store_name || row.storeName || 'SN TECHNO',
    tagline: row.tagline || 'Consertos em Celulares • Vendas de Acessórios',
    whatsappNumber: row.whatsapp_number || row.whatsappNumber || '5511999999999',
    presentationText: row.presentation_text ?? row.presentationText ?? '',
    lowStockThreshold: Number(row.low_stock_threshold ?? row.lowStockThreshold) || 5,
    address: row.address || 'Atendimento e Retirada na Loja Física • Consulte horários',
    businessHours: row.business_hours || row.businessHours || 'Segunda a Sexta: 09h às 18h | Sábado: 09h às 13h',
    instagram: row.instagram || row.instagram_handle || 'sntechno',
    enableAssistanceTab: row.enable_assistance_tab ?? true,
    bibleVerse: row.bible_verse || row.bibleVerse || 'Consagre ao Senhor tudo o que você faz, e os seus planos serão bem-sucedidos.',
    bibleReference: row.bible_reference || row.bibleReference || 'Provérbios 16:3',
  };
}

export function mapSettingsToDb(settings: StoreSettings): Record<string, any> {
  return {
    id: 'sn_techno_default',
    store_name: settings.storeName,
    tagline: settings.tagline,
    whatsapp_number: settings.whatsappNumber,
    presentation_text: settings.presentationText,
    low_stock_threshold: settings.lowStockThreshold,
    address: settings.address,
    business_hours: settings.businessHours,
    instagram: settings.instagram,
    instagram_handle: settings.instagram,
    enable_assistance_tab: settings.enableAssistanceTab,
    bible_verse: settings.bibleVerse,
    bible_reference: settings.bibleReference,
    updated_at: new Date().toISOString(),
  };
}

// Service methods for Supabase operations
export class SupabaseService {
  static async testConnection(): Promise<{ success: boolean; message: string; error?: any }> {
    try {
      const { data, error } = await supabase.from('settings').select('id').limit(1);
      if (error) {
        // Table might not exist yet
        return { 
          success: false, 
          message: `Conectado ao Supabase, mas as tabelas podem precisar ser criadas: ${error.message}`, 
          error 
        };
      }
      return { success: true, message: 'Conexão com o Supabase ativa e respondendo perfeitamente!' };
    } catch (e: any) {
      return { success: false, message: `Erro ao conectar com Supabase: ${e.message || e}`, error: e };
    }
  }

  // Categories
  static async fetchCategories(): Promise<Category[] | null> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('order', { ascending: true });
      if (error || !data) return null;
      return data.map(mapDbCategoryToCategory);
    } catch (e) {
      console.warn('Supabase fetchCategories error:', e);
      return null;
    }
  }

  static async upsertCategory(cat: Category): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('categories')
        .upsert(mapCategoryToDb(cat));
      if (error) {
        console.warn('Supabase upsertCategory error:', error);
        return false;
      }
      return true;
    } catch (e) {
      console.warn('Supabase upsertCategory exception:', e);
      return false;
    }
  }

  static async deleteCategory(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  }

  // Products
  static async fetchProducts(): Promise<Product[] | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (error || !data) return null;
      return data.map(mapDbProductToProduct);
    } catch (e) {
      console.warn('Supabase fetchProducts error:', e);
      return null;
    }
  }

  static async upsertProduct(prod: Product): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('products')
        .upsert(mapProductToDb(prod));
      if (error) {
        console.warn('Supabase upsertProduct error:', error);
        return false;
      }
      return true;
    } catch (e) {
      console.warn('Supabase upsertProduct exception:', e);
      return false;
    }
  }

  static async updateStock(id: string, stock: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('products')
        .update({ stock, updated_at: new Date().toISOString() })
        .eq('id', id);
      return !error;
    } catch {
      return false;
    }
  }

  static async deleteProduct(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  }

  // Settings
  static async fetchSettings(): Promise<StoreSettings | null> {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .limit(1)
        .maybeSingle();
      if (error || !data) return null;
      return mapDbSettingsToSettings(data);
    } catch (e) {
      console.warn('Supabase fetchSettings error:', e);
      return null;
    }
  }

  static async upsertSettings(settings: StoreSettings): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('settings')
        .upsert(mapSettingsToDb(settings));
      return !error;
    } catch {
      return false;
    }
  }

  // Orders
  static async saveOrder(order: OrderRecord): Promise<boolean> {
    try {
      const { error } = await supabase.from('orders').insert({
        id: order.id,
        customer_name: order.customerName,
        phone: order.customerPhone || '',
        items: order.items,
        total_amount: order.total,
        notes: order.observation || '',
        created_at: order.createdAt,
      });
      return !error;
    } catch {
      return false;
    }
  }

  // Seed / Bulk Upload Initial Data
  static async syncAllToSupabase(
    products: Product[],
    categories: Category[],
    settings: StoreSettings
  ): Promise<{ success: boolean; message: string }> {
    try {
      // 1. Categories
      if (categories.length > 0) {
        const catRows = categories.map(mapCategoryToDb);
        const { error: catErr } = await supabase.from('categories').upsert(catRows);
        if (catErr) throw new Error(`Erro ao enviar categorias: ${catErr.message}`);
      }

      // 2. Products
      if (products.length > 0) {
        const prodRows = products.map(mapProductToDb);
        const { error: prodErr } = await supabase.from('products').upsert(prodRows);
        if (prodErr) throw new Error(`Erro ao enviar produtos: ${prodErr.message}`);
      }

      // 3. Settings
      const { error: setErr } = await supabase.from('settings').upsert(mapSettingsToDb(settings));
      if (setErr) throw new Error(`Erro ao enviar configurações: ${setErr.message}`);

      return { success: true, message: 'Dados sincronizados com o Supabase com sucesso!' };
    } catch (e: any) {
      return { success: false, message: e.message || 'Erro ao sincronizar com Supabase' };
    }
  }
}
