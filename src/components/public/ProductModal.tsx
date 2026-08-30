import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../common/Toast';
import { formatBRL, createWhatsAppLink } from '../../lib/utils';
import { X, ShoppingBag, Plus, Minus, CheckCircle2, XCircle, MessageCircle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProductModal: React.FC = () => {
  const { selectedProductForModal, setSelectedProductForModal, categories, addToCart, settings } = useStore();
  const { showSuccess, showError } = useToast();
  const [quantity, setQuantity] = useState<number>(1);

  if (!selectedProductForModal) return null;

  const product = selectedProductForModal;
  const category = categories.find(c => c.id === product.categoryId);

  const handleClose = () => {
    setSelectedProductForModal(null);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (!product.isAvailable) {
      showError('Produto Esgotado', 'Este item não pode ser adicionado ao carrinho.');
      return;
    }

    const result = addToCart(product.id, quantity);
    if (result.success) {
      showSuccess('Adicionado ao Carrinho', `${quantity}x ${product.name}`);
      handleClose();
    } else {
      showError('Aviso', result.message);
    }
  };

  const handleDirectWhatsAppInquiry = () => {
    const msg = `Olá SN TECHNO! Tenho interesse no produto: "${product.name}" (${formatBRL(product.price)}). Poderiam me informar mais detalhes?`;
    const url = createWhatsAppLink(settings.whatsappNumber, msg);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      <div 
        id="product-details-modal-overlay"
        onClick={handleClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl rounded-3xl bg-[#0e1320] border border-slate-700/80 shadow-2xl shadow-cyan-950/40 overflow-hidden text-slate-100 my-auto"
        >
          {/* Close Button */}
          <button
            id="product-modal-close-btn"
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
            
            {/* Image Column */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              
              {/* Category Badge */}
              {category && (
                <span className="absolute top-3 left-3 px-3 py-1 rounded-lg text-xs font-bold uppercase bg-slate-950/90 text-cyan-300 border border-cyan-500/40 backdrop-blur-md">
                  {category.name}
                </span>
              )}
            </div>

            {/* Details Column */}
            <div className="flex flex-col justify-between space-y-4">
              
              <div className="space-y-3">
                {/* Availability Badge: Never shows exact stock! */}
                <div>
                  {product.isAvailable ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Disponível na Loja
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-950/90 text-rose-300 border border-rose-500/50 shadow-sm">
                      <XCircle className="w-3.5 h-3.5 text-rose-400" />
                      Produto Esgotado
                    </span>
                  )}
                </div>

                <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight font-['Space_Grotesk']">
                  {product.name}
                </h2>

                {/* Compatibility Info if any */}
                {product.modelCompat && (
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
                    <span className="font-semibold text-cyan-400">Compatibilidade: </span>
                    {product.modelCompat}
                  </div>
                )}

                <div className="text-sm text-slate-300 leading-relaxed max-h-36 overflow-y-auto pr-2 scrollbar-thin">
                  <p>{product.description}</p>
                </div>
              </div>

              {/* Price & Quantity & Action Controls */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Valor Unitário</span>
                  <span className="text-2xl font-extrabold text-cyan-400 font-['Space_Grotesk']">
                    {formatBRL(product.price)}
                  </span>
                </div>

                {product.isAvailable ? (
                  <div className="space-y-3">
                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-300">Quantidade:</span>
                      <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-700/80 rounded-xl p-1">
                        <button
                          id="modal-qty-minus-btn"
                          type="button"
                          onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-6 text-center font-bold text-sm text-white">{quantity}</span>
                        <button
                          id="modal-qty-plus-btn"
                          type="button"
                          onClick={() => setQuantity(prev => prev + 1)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="flex items-center justify-between text-xs font-medium text-slate-400">
                      <span>Subtotal ({quantity}x):</span>
                      <span className="text-sm font-bold text-slate-200">{formatBRL(product.price * quantity)}</span>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      id="modal-add-to-cart-btn"
                      type="button"
                      onClick={handleAddToCart}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-300 hover:from-cyan-300 hover:to-sky-200 transition-all shadow-lg shadow-cyan-500/25 active:scale-98"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Adicionar ao Carrinho</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-center space-y-2">
                    <p className="text-xs text-rose-300 font-semibold">
                      Este produto está temporariamente fora de estoque.
                    </p>
                    <button
                      id="modal-out-of-stock-inquiry-btn"
                      type="button"
                      onClick={handleDirectWhatsAppInquiry}
                      className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:underline"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Consultar previsão de reposição no WhatsApp
                    </button>
                  </div>
                )}

                {/* Direct WhatsApp Question Link */}
                <button
                  id="modal-ask-whatsapp-btn"
                  type="button"
                  onClick={handleDirectWhatsAppInquiry}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-800 transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Dúvidas sobre este produto? Chamar no WhatsApp</span>
                </button>
              </div>

            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
