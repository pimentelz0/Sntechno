import React from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { formatBRL } from '../../lib/utils';
import { 
  Package, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Layers, 
  Plus, 
  Boxes, 
  ArrowUpRight, 
  TrendingUp, 
  Clock, 
  MessageCircle,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { products, categories, settings, navigate, updateStock, orders } = useStore();

  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.active && p.stock > 0).length;
  const outOfStockProducts = products.filter(p => p.stock === 0).length;
  const lowStockThreshold = settings.lowStockThreshold || 5;
  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= lowStockThreshold);
  const totalCategories = categories.length;

  const handleQuickAddStock = (productId: string, currentStock: number) => {
    updateStock(productId, currentStock + 5);
  };

  return (
    <AdminLayout currentPageTitle="Dashboard Geral">
      <div className="space-y-8">
        
        {/* Welcome Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-purple-950/40 to-slate-900 border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <h2 className="text-lg sm:text-xl font-bold text-white font-['Space_Grotesk']">
                Painel Administrativo da {settings.storeName || 'SN TECHNO'}
              </h2>
            </div>
            <p className="text-xs text-slate-300">
              Controle em tempo real de produtos, estoque exato, categorias e pedidos direcionados ao WhatsApp.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              id="dash-quick-add-product-btn"
              onClick={() => navigate('/admin/produtos')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-md transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Produto</span>
            </button>

            <button
              id="dash-quick-manage-stock-btn"
              onClick={() => navigate('/admin/estoque')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-all active:scale-95"
            >
              <Boxes className="w-4 h-4 text-purple-400" />
              <span>Gerenciar Estoque</span>
            </button>
          </div>
        </div>

        {/* 5 KPI Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-5">
          
          {/* Card 1: Total Produtos */}
          <div 
            onClick={() => navigate('/admin/produtos')}
            className="p-4 sm:p-5 rounded-2xl bg-[#0e1424] border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Total Produtos</span>
              <Package className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk']">
                {totalProducts}
              </span>
              <span className="text-[10px] text-cyan-400 font-semibold flex items-center">
                Ver todos <ArrowUpRight className="w-3 h-3 ml-0.5" />
              </span>
            </div>
          </div>

          {/* Card 2: Produtos Ativos / Disponíveis */}
          <div 
            onClick={() => navigate('/admin/produtos')}
            className="p-4 sm:p-5 rounded-2xl bg-[#0e1424] border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Ativos no Catálogo</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-['Space_Grotesk']">
                {activeProducts}
              </span>
              <span className="text-[10px] text-emerald-500 font-semibold">Disponíveis</span>
            </div>
          </div>

          {/* Card 3: Produtos Esgotados */}
          <div 
            onClick={() => navigate('/admin/estoque')}
            className="p-4 sm:p-5 rounded-2xl bg-[#0e1424] border border-slate-800 hover:border-rose-500/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Esgotados</span>
              <XCircle className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-['Space_Grotesk']">
                {outOfStockProducts}
              </span>
              <span className="text-[10px] text-rose-400 font-semibold">Estoque 0</span>
            </div>
          </div>

          {/* Card 4: Estoque Baixo */}
          <div 
            onClick={() => navigate('/admin/estoque')}
            className="p-4 sm:p-5 rounded-2xl bg-[#0e1424] border border-slate-800 hover:border-amber-500/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Estoque Baixo</span>
              <AlertTriangle className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-['Space_Grotesk']">
                {lowStockProducts.length}
              </span>
              <span className="text-[10px] text-amber-400 font-semibold">≤ {lowStockThreshold} un.</span>
            </div>
          </div>

          {/* Card 5: Categorias */}
          <div 
            onClick={() => navigate('/admin/categorias')}
            className="p-4 sm:p-5 rounded-2xl bg-[#0e1424] border border-slate-800 hover:border-purple-500/40 transition-all cursor-pointer group col-span-2 sm:col-span-1"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Categorias</span>
              <Layers className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-['Space_Grotesk']">
                {totalCategories}
              </span>
              <span className="text-[10px] text-purple-400 font-semibold">Gerenciar</span>
            </div>
          </div>

        </div>

        {/* Low Stock Attention Section */}
        <div className="p-6 rounded-3xl bg-[#0e1424] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="font-bold text-base text-white font-['Space_Grotesk']">
                  Produtos que Exigem Reposição de Estoque
                </h3>
                <p className="text-xs text-slate-400">
                  Itens esgotados ou com quantidade menor ou igual ao limite configurado ({lowStockThreshold} unidades).
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('/admin/estoque')}
              className="text-xs font-semibold text-cyan-400 hover:underline inline-flex items-center gap-1"
            >
              Ver Tabela Completa de Estoque <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {outOfStockProducts === 0 && lowStockProducts.length === 0 ? (
            <div className="p-6 text-center rounded-2xl bg-slate-900/50 text-slate-400 text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="font-semibold text-slate-200">Estoque Saudável!</p>
              <span>Nenhum produto está esgotado ou abaixo do limite no momento.</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-semibold">Produto</th>
                    <th className="pb-3 font-semibold">Preço</th>
                    <th className="pb-3 font-semibold">Estoque Real</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Ação Rápida</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {[...products.filter(p => p.stock === 0), ...lowStockProducts].slice(0, 6).map(prod => (
                    <tr key={prod.id} className="hover:bg-slate-900/40">
                      <td className="py-3 flex items-center gap-3">
                        <img src={prod.image} alt={prod.name} className="w-9 h-9 rounded-lg object-cover bg-slate-950 border border-slate-800 shrink-0" />
                        <span className="font-medium text-slate-200 truncate max-w-xs">{prod.name}</span>
                      </td>
                      <td className="py-3 font-semibold text-cyan-400">{formatBRL(prod.price)}</td>
                      <td className="py-3 font-bold text-white">
                        <span className={prod.stock === 0 ? 'text-rose-400' : 'text-amber-400'}>
                          {prod.stock} un.
                        </span>
                      </td>
                      <td className="py-3">
                        {prod.stock === 0 ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                            Esgotado
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                            Estoque Baixo
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          id={`dash-replenish-btn-${prod.id}`}
                          onClick={() => handleQuickAddStock(prod.id, prod.stock)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 transition-colors"
                        >
                          +5 Unidades
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Store WhatsApp Configuration Preview */}
        <div className="p-6 rounded-3xl bg-[#0e1424] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <MessageCircle className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-base text-white">
                WhatsApp Oficial de Pedidos
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Número ativo configurado para receber os pedidos dos clientes: <span className="text-emerald-400 font-mono font-bold">{settings.whatsappNumber}</span>
            </p>
          </div>

          <button
            id="dash-edit-settings-btn"
            onClick={() => navigate('/admin/configuracoes')}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 transition-all"
          >
            Alterar nas Configurações
          </button>
        </div>

      </div>
    </AdminLayout>
  );
};
