import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ShoppingBag, Search, MessageCircle, Wrench, Shield } from 'lucide-react';
import { createWhatsAppLink } from '../../lib/utils';
import logoImg from '../../assets/logo.jpg';

export const Header: React.FC = () => {
  const { cartCount, setIsCartOpen, settings, navigate, setSearchQuery } = useStore();

  const handleWhatsAppContact = () => {
    const msg = `Olá! Vim pelo catálogo da ${settings.storeName || 'SN TECHNO'} e gostaria de mais informações.`;
    const url = createWhatsAppLink(settings.whatsappNumber, msg);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#090d16]/90 border-b border-slate-800/80 shadow-lg shadow-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          
          {/* Brand Logo & Name */}
          <div 
            id="header-brand-link"
            onClick={() => {
              setSearchQuery('');
              navigate('/');
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-60 blur-xs group-hover:opacity-100 transition-opacity duration-300"></div>
              <img
                src={logoImg}
                alt="SN TECHNO Logo Oficial"
                className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-cyan-400/50 shadow-md"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-2xl tracking-tight bg-gradient-to-r from-cyan-400 via-sky-200 to-purple-400 bg-clip-text text-transparent font-['Space_Grotesk']">
                  SN TECHNO
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
                  OFICIAL
                </span>
              </div>
              <span className="text-[10px] sm:text-xs text-slate-400 font-medium tracking-tight truncate max-w-[190px] sm:max-w-none">
                Consertos em Celulares • Acessórios
              </span>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick WhatsApp Support */}
            <button
              id="header-whatsapp-btn"
              onClick={handleWhatsAppContact}
              title="Falar no WhatsApp"
              className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/30 transition-all hover:scale-[1.02]"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp</span>
            </button>

            {/* Quick Assistance Tab Link */}
            <a
              href="#assistencia"
              id="header-repair-link"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-cyan-400 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 transition-all"
            >
              <Wrench className="w-3.5 h-3.5 text-cyan-400" />
              <span>Consertos</span>
            </a>

            {/* Cart Button */}
            <button
              id="header-cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-300 hover:from-cyan-300 hover:to-sky-200 transition-all shadow-md shadow-cyan-500/20 active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 text-slate-950" />
              <span className="hidden sm:inline">Carrinho</span>
              
              {cartCount > 0 && (
                <span 
                  id="cart-badge-count"
                  className="flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full text-[11px] font-bold bg-purple-900 text-purple-100 border border-purple-400 shadow-sm animate-pulse"
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
