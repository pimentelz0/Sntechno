import React from 'react';
import { PublicProduct } from '../../types';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../common/Toast';
import { formatBRL } from '../../lib/utils';
import { ShoppingBag, Eye, CheckCircle2, XCircle, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: PublicProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, categories, setSelectedProductForModal } = useStore();
  const { showSuccess, showError } = useToast();

  const category = categories.find(c => c.id === product.categoryId);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.isAvailable) {
      showError('Produto Esgotado', 'Este item não pode ser adicionado ao carrinho no momento.');
      return;
    }

    const result = addToCart(product.id, 1);
    if (result.success) {
      showSuccess('Adicionado ao Carrinho', product.name);
    } else {
      showError('Aviso', result.message);
    }
  };

  const handleOpenDetails = () => {
    setSelectedProductForModal(product);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={handleOpenDetails}
      className={`group relative flex flex-col justify-between rounded-2xl bg-gradient-to-b from-[#111726] to-[#0d121e] border transition-all duration-300 overflow-hidden cursor-pointer ${
        product.isAvailable
          ? 'border-slate-800 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1'
          : 'border-slate-800/60 opacity-80'
      }`}
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-950/80">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            // Fallback placeholder image
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600';
          }}
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          {category && (
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide uppercase bg-slate-950/85 text-slate-200 border border-slate-700/80 backdrop-blur-md">
              {category.name}
            </span>
          )}

          {/* Availability Status: Strictly "Disponível" or "Esgotado" - NEVER exact stock! */}
          {product.isAvailable ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 shadow-sm backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Disponível
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-rose-950/90 text-rose-300 border border-rose-500/50 shadow-sm backdrop-blur-md">
              <XCircle className="w-3 h-3 text-rose-400" />
              Esgotado
            </span>
          )}
        </div>

        {/* Brand Compat Pill */}
        {product.brandCompat && product.brandCompat !== 'universal' && (
          <div className="absolute bottom-2.5 left-2.5 pointer-events-none">
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase border backdrop-blur-md ${
              product.brandCompat === 'apple'
                ? 'bg-slate-900/90 text-slate-200 border-slate-600'
                : 'bg-emerald-950/90 text-emerald-300 border-emerald-600'
            }`}>
              {product.brandCompat === 'apple' ? ' Apple' : 'Android'}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-4 space-y-3">
        <div>
          <h3 className="font-bold text-sm sm:text-base text-slate-100 line-clamp-2 leading-snug group-hover:text-cyan-300 transition-colors">
            {product.name}
          </h3>
          <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing & Add Button */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">Preço</span>
            <span className="text-base sm:text-lg font-extrabold text-cyan-400 font-['Space_Grotesk']">
              {formatBRL(product.price)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* View Details Quick Button */}
            <button
              type="button"
              id={`prod-view-btn-${product.id}`}
              onClick={(e) => {
                e.stopPropagation();
                handleOpenDetails();
              }}
              title="Ver detalhes"
              className="p-2.5 rounded-xl text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>

            {/* Add to Cart Button */}
            <button
              type="button"
              id={`prod-add-btn-${product.id}`}
              onClick={handleAddToCart}
              disabled={!product.isAvailable}
              title={product.isAvailable ? 'Adicionar ao carrinho' : 'Produto esgotado'}
              className={`flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                product.isAvailable
                  ? 'bg-gradient-to-r from-cyan-500 to-sky-400 hover:from-cyan-400 hover:to-sky-300 text-slate-950 shadow-md shadow-cyan-500/20 active:scale-95'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{product.isAvailable ? 'Adicionar' : 'Esgotado'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
