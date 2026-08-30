import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Clock, MapPin, MessageCircle, Instagram } from 'lucide-react';
import { createWhatsAppLink, getInstagramUrl } from '../../lib/utils';

export const StoreInfoTop: React.FC = () => {
  const { settings } = useStore();

  const handleWhatsApp = () => {
    const msg = `Olá! Gostaria de informações e atendimento na loja ${settings.storeName || 'SN TECHNO'}.`;
    const url = createWhatsAppLink(settings.whatsappNumber, msg);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const instagramUrl = getInstagramUrl(settings.instagram);

  return (
    <section 
      id="top-store-info"
      aria-label="Atendimento e Informações da Loja"
      className="w-full bg-[#0d1322]/90 border-b border-slate-800/80 backdrop-blur-md py-3 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4">
        
        {/* Atendimento & Informações da Loja */}
        <div className="space-y-1 sm:space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <h3 className="font-bold text-white text-xs sm:text-sm uppercase tracking-wider font-['Space_Grotesk']">
              Atendimento & Loja
            </h3>
          </div>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">{settings.businessHours || 'Segunda a Sexta: 09h às 18h | Sábado: 09h às 13h'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">{settings.address || 'Atendimento e Retirada na Loja Física'}</span>
            </div>
          </div>
        </div>

        {/* Botões Oficiais WhatsApp e Instagram */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 w-full sm:w-auto pt-1 md:pt-0">
          
          {/* Botão WhatsApp */}
          <button
            id="top-whatsapp-btn"
            type="button"
            onClick={handleWhatsApp}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/90 text-emerald-300 hover:text-emerald-200 border border-emerald-500/40 text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-95"
            title="Conversar no WhatsApp"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>WhatsApp</span>
          </button>

          {/* Botão Instagram */}
          <a
            id="top-instagram-btn"
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-pink-950/70 hover:bg-pink-900/90 text-pink-300 hover:text-pink-200 border border-pink-500/40 text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-95"
            title="Acessar Instagram Oficial @sntechno_aracape"
          >
            <Instagram className="w-4 h-4 text-pink-400 shrink-0" />
            <span>Instagram</span>
          </a>

        </div>

      </div>
    </section>
  );
};
