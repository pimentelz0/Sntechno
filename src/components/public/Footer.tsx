import React from 'react';
import { useStore } from '../../context/StoreContext';
import { createWhatsAppLink } from '../../lib/utils';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings } = useStore();

  const handleWhatsApp = () => {
    const msg = `Olá! Gostaria de informações sobre a loja ${settings.storeName || 'SN TECHNO'}.`;
    const url = createWhatsAppLink(settings.whatsappNumber, msg);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="bg-[#070a12] border-t border-slate-800/80 text-slate-400 text-xs py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Navigation & Quick Links */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider font-['Space_Grotesk']">
              Navegação
            </h4>
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
              <li>
                <a href="#produtos" className="text-slate-400 hover:text-cyan-300 transition-colors">
                  Catálogo de Acessórios
                </a>
              </li>
              <li>
                <a href="#assistencia" className="text-slate-400 hover:text-cyan-300 transition-colors">
                  Assistência Técnica Especializada
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="text-slate-400 hover:text-emerald-300 transition-colors text-left"
                >
                  Solicitar Atendimento
                </button>
              </li>
            </ul>
          </div>

          <div className="inline-flex items-center gap-1.5 text-[11px] text-cyan-400/80">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Garantia & Procedência SN TECHNO</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} {settings.storeName || 'SN TECHNO'}. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <span>Catálogo Digital</span>
            <span>Atendimento Personalizado</span>
          </div>
        </div>

      </div>
    </footer>
  );
};


