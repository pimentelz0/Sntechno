import React from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Layers, 
  Shield, 
  Sparkles, 
  Cable, 
  Zap, 
  Headphones, 
  Smartphone, 
  SlidersHorizontal, 
  Box 
} from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  Shield: <Shield className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />,
  Cable: <Cable className="w-4 h-4" />,
  Zap: <Zap className="w-4 h-4" />,
  Headphones: <Headphones className="w-4 h-4" />,
  Smartphone: <Smartphone className="w-4 h-4" />,
  SlidersHorizontal: <SlidersHorizontal className="w-4 h-4" />,
  Box: <Box className="w-4 h-4" />,
};

export const CategoryFilter: React.FC = () => {
  const { 
    activeCategories, 
    selectedCategoryId, 
    setSelectedCategoryId,
    publicProducts,
    selectedBrandFilter,
    setSelectedBrandFilter
  } = useStore();

  const getProductCountForCategory = (catId: string) => {
    if (catId === 'all') return publicProducts.length;
    return publicProducts.filter(p => p.categoryId === catId).length;
  };

  return (
    <div className="space-y-3">
      {/* Category Pills (Horizontal Scroll on Mobile) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent no-scrollbar">
        {/* All Products Pill */}
        <button
          id="cat-pill-all"
          onClick={() => setSelectedCategoryId('all')}
          className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
            selectedCategoryId === 'all'
              ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 shadow-md shadow-cyan-500/25 scale-[1.02]'
              : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Todos</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
            selectedCategoryId === 'all' ? 'bg-slate-950/30 text-slate-950' : 'bg-slate-800 text-slate-400'
          }`}>
            {publicProducts.length}
          </span>
        </button>

        {/* Dynamic Categories */}
        {activeCategories.map(cat => {
          const isSelected = selectedCategoryId === cat.id;
          const count = getProductCountForCategory(cat.id);
          const icon = cat.iconName && ICON_MAP[cat.iconName] ? ICON_MAP[cat.iconName] : <Box className="w-4 h-4" />;

          return (
            <button
              key={cat.id}
              id={`cat-pill-${cat.id}`}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 shadow-md shadow-cyan-500/25 scale-[1.02]'
                  : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {icon}
              <span className="whitespace-nowrap">{cat.name}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                isSelected ? 'bg-slate-950/30 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Secondary Quick Compatibility Filter (Apple / Android / Universal) */}
      <div className="flex items-center gap-2 pt-1 text-xs">
        <span className="text-slate-400 text-xs font-medium">Compatibilidade:</span>
        <div className="inline-flex rounded-lg p-0.5 bg-slate-900/80 border border-slate-800">
          {(['all', 'apple', 'android', 'universal'] as const).map(brand => (
            <button
              key={brand}
              id={`brand-filter-${brand}`}
              onClick={() => setSelectedBrandFilter(brand)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold capitalize transition-all ${
                selectedBrandFilter === brand
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {brand === 'all' ? 'Todas' : brand === 'apple' ? ' Apple' : brand === 'android' ? 'Android' : 'Universal'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
