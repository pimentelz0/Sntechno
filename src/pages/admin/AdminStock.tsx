import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useToast } from '../../components/common/Toast';
import { formatBRL } from '../../lib/utils';
import { 
  Boxes, 
  Search, 
  Plus, 
  Minus, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Filter, 
  RotateCcw,
  DollarSign
} from 'lucide-react';

export const AdminStock: React.FC = () => {
  const { products, categories, updateStock, updateProduct, settings } = useStore();
  const { showSuccess, showError } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockStatusFilter, setStockStatusFilter] = useState<'all' | 'out' | 'low' | 'ok'>('all');

  const lowStockThreshold = settings.lowStockThreshold || 5;

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        if (!p.name.toLowerCase().includes(q)) return false;
      }

      if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) {
        return false;
      }

      if (stockStatusFilter === 'out' && p.stock !== 0) return false;
      if (stockStatusFilter === 'low' && (p.stock === 0 || p.stock > lowStockThreshold)) return false;
      if (stockStatusFilter === 'ok' && p.stock <= lowStockThreshold) return false;

      return true;
    });
  }, [products, searchTerm, selectedCategory, stockStatusFilter, lowStockThreshold]);

  const handleStockChange = (productId: string, newStock: number) => {
    const validStock = Math.max(0, newStock);
    updateStock(productId, validStock);
    showSuccess('Estoque Atualizado', `Nova quantidade: ${validStock} unidades.`);
  };

  const handleSetExactStock = (productId: string, valueStr: string) => {
    const parsed = parseInt(valueStr, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      updateStock(productId, parsed);
      showSuccess('Estoque Atualizado', `Estoque definido para ${parsed} unidades.`);
    }
  };

  return (
    <AdminLayout currentPageTitle="Controle Rápido de Estoque">
      <div className="space-y-6">
        
        {/* Header Description */}
        <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-between text-xs text-cyan-200">
          <div className="flex items-center gap-2">
            <Boxes className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              <strong>Atenção ao Cliente:</strong> O estoque exato é visível <em>apenas para você no painel</em>. Clientes no catálogo público veem apenas se o item está <strong>Disponível</strong> ou <strong>Esgotado</strong>.
            </span>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="stock-search-input"
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar por produto para alterar estoque..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs sm:text-sm placeholder-slate-500 outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Category Select */}
            <select
              id="stock-category-filter"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs outline-none"
            >
              <option value="all">Todas as Categorias</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            {/* Status Pills */}
            <div className="inline-flex rounded-xl p-1 bg-slate-900 border border-slate-800 text-xs">
              <button
                onClick={() => setStockStatusFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  stockStatusFilter === 'all' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Todos ({products.length})
              </button>
              <button
                onClick={() => setStockStatusFilter('low')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  stockStatusFilter === 'low' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Baixo ({products.filter(p => p.stock > 0 && p.stock <= lowStockThreshold).length})
              </button>
              <button
                onClick={() => setStockStatusFilter('out')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  stockStatusFilter === 'out' ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Esgotados ({products.filter(p => p.stock === 0).length})
              </button>
            </div>
          </div>
        </div>

        {/* Stock Management Table */}
        <div className="rounded-2xl bg-[#0e1424] border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[11px]">
                <tr>
                  <th className="p-4">Produto</th>
                  <th className="p-4">Preço Atual</th>
                  <th className="p-4">Estoque Atual</th>
                  <th className="p-4">Ajuste Rápido</th>
                  <th className="p-4">Ações de Estoque</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredProducts.map(p => {
                  const isOut = p.stock === 0;
                  const isLow = p.stock > 0 && p.stock <= lowStockThreshold;

                  return (
                    <tr key={p.id} className="hover:bg-slate-900/40 transition-colors">
                      
                      {/* Product */}
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-10 h-10 rounded-xl object-cover bg-slate-950 border border-slate-800 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-100 text-xs sm:text-sm truncate max-w-xs">
                            {p.name}
                          </h4>
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase mt-0.5 ${
                            isOut
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : isLow
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}>
                            {isOut ? 'Esgotado' : isLow ? 'Estoque Baixo' : 'Disponível'}
                          </span>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="p-4 font-bold text-cyan-400 text-sm">
                        {formatBRL(p.price)}
                      </td>

                      {/* Current Stock Editable Input */}
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <input
                            id={`stock-input-${p.id}`}
                            type="number"
                            min="0"
                            value={p.stock}
                            onChange={e => handleSetExactStock(p.id, e.target.value)}
                            className="w-16 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 font-bold text-white text-xs outline-none focus:border-cyan-400 text-center font-mono"
                          />
                          <span className="text-slate-400 text-xs">un.</span>
                        </div>
                      </td>

                      {/* Quick Adjust Buttons (-1, +1, +5, +10) */}
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            id={`stock-dec-${p.id}`}
                            onClick={() => handleStockChange(p.id, p.stock - 1)}
                            disabled={p.stock <= 0}
                            title="Diminuir 1"
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 disabled:opacity-40"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>

                          <button
                            id={`stock-inc-${p.id}`}
                            onClick={() => handleStockChange(p.id, p.stock + 1)}
                            title="Aumentar 1"
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>

                          <button
                            id={`stock-add5-${p.id}`}
                            onClick={() => handleStockChange(p.id, p.stock + 5)}
                            className="px-2 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-semibold text-[11px]"
                          >
                            +5
                          </button>

                          <button
                            id={`stock-add10-${p.id}`}
                            onClick={() => handleStockChange(p.id, p.stock + 10)}
                            className="px-2 py-1 rounded-lg bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-300 font-semibold text-[11px]"
                          >
                            +10
                          </button>
                        </div>
                      </td>

                      {/* Quick Out of Stock or Restock */}
                      <td className="p-4">
                        {p.stock > 0 ? (
                          <button
                            id={`stock-zerar-${p.id}`}
                            onClick={() => handleStockChange(p.id, 0)}
                            className="px-3 py-1 rounded-lg bg-rose-950/50 hover:bg-rose-900 border border-rose-800 text-rose-300 font-semibold text-[11px] transition-colors"
                          >
                            Zerar Estoque
                          </button>
                        ) : (
                          <button
                            id={`stock-repos-${p.id}`}
                            onClick={() => handleStockChange(p.id, 10)}
                            className="px-3 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-semibold text-[11px] transition-colors"
                          >
                            Repor (+10 un.)
                          </button>
                        )}
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};
