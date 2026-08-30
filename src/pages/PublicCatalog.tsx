import React, { useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { Header } from '../components/public/Header';
import { StoreInfoTop } from '../components/public/StoreInfoTop';
import { CategoryFilter } from '../components/public/CategoryFilter';
import { SearchBar } from '../components/public/SearchBar';
import { ProductCard } from '../components/public/ProductCard';
import { ProductModal } from '../components/public/ProductModal';
import { CartDrawer } from '../components/public/CartDrawer';
import { RepairSection } from '../components/public/RepairSection';
import { Footer } from '../components/public/Footer';
import { ShoppingBag, ArrowRight, FilterX } from 'lucide-react';
import { formatBRL } from '../lib/utils';

export const PublicCatalog: React.FC = () => {
  const { 
    publicProducts, 
    categories, 
    searchQuery, 
    setSearchQuery,
    selectedCategoryId, 
    setSelectedCategoryId,
    selectedBrandFilter,
    setSelectedBrandFilter,
    cartCount,
    cartTotal,
    setIsCartOpen 
  } = useStore();

  // Filter products based on search, category, brand compatibility
  const filteredProducts = useMemo(() => {
    return publicProducts.filter(product => {
      // 1. Search Query Match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        const matchesModel = product.modelCompat ? product.modelCompat.toLowerCase().includes(q) : false;
        if (!matchesName && !matchesDesc && !matchesModel) {
          return false;
        }
      }

      // 2. Category Match
      if (selectedCategoryId !== 'all' && product.categoryId !== selectedCategoryId) {
        return false;
      }

      // 3. Brand Compatibility Match
      if (selectedBrandFilter !== 'all') {
        if (product.brandCompat && product.brandCompat !== selectedBrandFilter && product.brandCompat !== 'universal') {
          return false;
        }
      }

      return true;
    });
  }, [publicProducts, searchQuery, selectedCategoryId, selectedBrandFilter]);

  const activeCategoryObj = categories.find(c => c.id === selectedCategoryId);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      
      {/* Top Header */}
      <Header />

      {/* Top Store Info Bar (Atendimento & Loja + WhatsApp & Instagram) */}
      <StoreInfoTop />

      {/* Catalog & Search Section */}
      <main id="produtos" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-3 sm:space-y-5">
        
        {/* Section Title & Search Bar */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <h2 className="text-lg sm:text-2xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight">
                {activeCategoryObj ? activeCategoryObj.name : 'Todos os Produtos'}
              </h2>
              <span className="text-xs text-slate-400 font-medium">
                ({filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'itens'})
              </span>
            </div>

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-cyan-400 hover:underline"
              >
                Limpar busca
              </button>
            )}
          </div>

          {/* Search Bar */}
          <div className="w-full">
            <SearchBar />
          </div>
        </div>

        {/* 8. Categories & 9. Compatibility Filters */}
        <CategoryFilter />

        {/* 10. Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 pt-1">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="py-12 px-4 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
            <div className="p-4 rounded-full bg-slate-800/80 w-fit mx-auto text-slate-400">
              <FilterX className="w-7 h-7" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">Nenhum produto encontrado</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Não encontramos resultados para a sua busca atual. Tente buscar por outros termos ou redefinir os filtros.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              {searchQuery && (
                <button
                  id="reset-search-btn"
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/40"
                >
                  Limpar Pesquisa
                </button>
              )}
              {selectedCategoryId !== 'all' && (
                <button
                  id="reset-category-btn"
                  onClick={() => setSelectedCategoryId('all')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-purple-300 bg-purple-950/60 hover:bg-purple-900 border border-purple-500/40"
                >
                  Ver Todas as Categorias
                </button>
              )}
            </div>
          </div>
        )}

      </main>

      {/* Maintenance & Phone Repair Services Section */}
      <RepairSection />

      {/* Footer */}
      <Footer />

      {/* Sticky Mobile Floating Cart Bar (Appears when cart has items) */}
      {cartCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 sm:hidden z-30">
          <button
            id="mobile-sticky-cart-btn"
            onClick={() => setIsCartOpen(true)}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400 text-slate-950 font-extrabold text-xs shadow-2xl shadow-cyan-500/30 active:scale-98 animate-bounce-subtle"
          >
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-950 text-white text-[11px] font-bold">
                {cartCount}
              </span>
              <span>Ver Carrinho</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>{formatBRL(cartTotal)}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* Modals & Slide-overs */}
      <ProductModal />
      <CartDrawer />

    </div>
  );
};
