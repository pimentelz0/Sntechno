import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Search, X } from 'lucide-react';

export const SearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery } = useStore();

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 w-4 h-4 text-cyan-400 pointer-events-none" />
        <input
          id="catalog-search-input"
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Pesquisar por capinhas, películas, cabos, fones, iPhone 15, Samsung..."
          className="w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-slate-100 placeholder-slate-400 text-sm transition-all shadow-inner outline-none"
        />
        {searchQuery && (
          <button
            id="catalog-search-clear-btn"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Limpar pesquisa"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
