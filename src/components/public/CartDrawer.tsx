import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../common/Toast';
import { formatBRL } from '../../lib/utils';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  MessageCircle, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  User,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    cartCount, 
    cartTotal, 
    isCartOpen, 
    setIsCartOpen, 
    updateCartQty, 
    removeFromCart, 
    clearCart, 
    checkoutWhatsApp,
    settings 
  } = useStore();

  const { showError, showSuccess } = useToast();
  const [customerName, setCustomerName] = useState('');
  const [observation, setObservation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    if (!customerName.trim()) {
      showError('Nome Obrigatório', 'Por favor, digite seu nome para identificação do pedido.');
      return;
    }

    if (cart.length === 0) {
      showError('Carrinho Vazio', 'Adicione produtos antes de finalizar o pedido.');
      return;
    }

    setIsSubmitting(true);
    const result = checkoutWhatsApp(customerName, observation);

    if (result.success) {
      showSuccess('Pedido Enviado!', 'Abrindo seu WhatsApp com os detalhes do pedido.');
      setCustomerName('');
      setObservation('');
    } else {
      showError('Atenção', result.message);
    }
    setIsSubmitting(false);
  };

  return (
    <AnimatePresence>
      <div 
        id="cart-drawer-overlay"
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end"
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md bg-[#0d121f] border-l border-slate-800 text-slate-100 flex flex-col h-full shadow-2xl"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-base sm:text-lg text-white font-['Space_Grotesk']">
                  Seu Carrinho
                </h2>
                <p className="text-xs text-slate-400">
                  {cartCount} {cartCount === 1 ? 'item selecionado' : 'itens selecionados'}
                </p>
              </div>
            </div>

            <button
              id="cart-drawer-close-btn"
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 scrollbar-thin">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center space-y-3">
                <div className="p-4 rounded-full bg-slate-900 border border-slate-800 text-slate-500">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="font-bold text-base text-slate-200">Seu carrinho está vazio</h3>
                <p className="text-xs text-slate-400 max-w-xs">
                  Navegue pelo catálogo da SN TECHNO e escolha os melhores acessórios e produtos para seu aparelho.
                </p>
                <button
                  id="cart-empty-browse-btn"
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all"
                >
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Produtos</span>
                  <button
                    id="cart-clear-all-btn"
                    onClick={clearCart}
                    className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    Limpar carrinho
                  </button>
                </div>

                {cart.map(item => (
                  <div
                    key={item.product.id}
                    id={`cart-item-${item.product.id}`}
                    className="flex gap-3 p-3 rounded-2xl bg-slate-900/90 border border-slate-800/90 items-center justify-between"
                  >
                    {/* Item Image */}
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-xl object-cover bg-slate-950 border border-slate-800 shrink-0"
                    />

                    {/* Item Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-100 truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-cyan-400 font-semibold mt-0.5">
                        {formatBRL(item.product.price)} un.
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="inline-flex items-center rounded-lg bg-slate-950 border border-slate-700/80 p-0.5">
                          <button
                            id={`cart-minus-${item.product.id}`}
                            onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                            className="p-1 text-slate-400 hover:text-white transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-slate-100">
                            {item.quantity}
                          </span>
                          <button
                            id={`cart-plus-${item.product.id}`}
                            onClick={() => {
                              const res = updateCartQty(item.product.id, item.quantity + 1);
                              if (!res.success && res.message) {
                                showError('Aviso', res.message);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-white transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="text-xs font-bold text-slate-300">
                          {formatBRL(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>

                    {/* Delete Item */}
                    <button
                      id={`cart-remove-${item.product.id}`}
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-xl transition-colors shrink-0"
                      title="Remover do carrinho"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Footer & Checkout Form */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/90 space-y-4">
              
              {/* Customer Inputs */}
              <div className="space-y-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    Seu Nome <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="cart-customer-name-input"
                    type="text"
                    required
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="Digite seu nome (Ex: João Silva)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/90 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-slate-100 text-xs sm:text-sm placeholder-slate-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-purple-400" />
                    Observação <span className="text-slate-500 text-[10px]">(opcional)</span>
                  </label>
                  <textarea
                    id="cart-observation-input"
                    rows={2}
                    value={observation}
                    onChange={e => setObservation(e.target.value)}
                    placeholder="Ex: Gostaria de retirar na loja / Modelo do meu aparelho..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/90 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-slate-100 text-xs placeholder-slate-500 outline-none resize-none"
                  />
                </div>
              </div>

              {/* Total Calculation */}
              <div className="pt-2 border-t border-slate-800/80 flex items-baseline justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Valor Total</span>
                  <p className="text-[11px] text-emerald-400">Pronto para envio WhatsApp</p>
                </div>
                <span className="text-2xl font-extrabold text-cyan-400 font-['Space_Grotesk']">
                  {formatBRL(cartTotal)}
                </span>
              </div>

              {/* Finalize Button */}
              <button
                id="cart-checkout-whatsapp-btn"
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-2xl font-extrabold text-xs sm:text-sm tracking-wide uppercase text-slate-950 bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-300 hover:from-emerald-300 hover:to-cyan-300 shadow-xl shadow-emerald-500/20 active:scale-98 transition-all"
              >
                <MessageCircle className="w-5 h-5 fill-slate-950 text-emerald-400" />
                <span>FINALIZAR PEDIDO PELO WHATSAPP</span>
              </button>

              <p className="text-center text-[10px] text-slate-400">
                Você será direcionado diretamente ao WhatsApp oficial da {settings.storeName || 'SN TECHNO'}.
              </p>

            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
