import React from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Wrench, 
  Smartphone, 
  BatteryCharging, 
  Cpu, 
  Droplets, 
  ShieldCheck, 
  MessageSquare, 
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { createWhatsAppLink } from '../../lib/utils';

export const RepairSection: React.FC = () => {
  const { settings } = useStore();

  const services = [
    {
      title: 'Troca de Tela / Display',
      desc: 'Telas originais e premium com alta taxa de resposta ao toque e cores vivas.',
      icon: <Smartphone className="w-5 h-5 text-cyan-400" />,
    },
    {
      title: 'Troca de Bateria',
      desc: 'Substituição com baterias de alta densidade e 100% de saúde com garantia.',
      icon: <BatteryCharging className="w-5 h-5 text-emerald-400" />,
    },
    {
      title: 'Conector de Carga',
      desc: 'Reparo em conectores USB-C, Lightning e Micro-USB que não carregam.',
      icon: <Wrench className="w-5 h-5 text-purple-400" />,
    },
    {
      title: 'Reparo Avançado de Placa',
      desc: 'Diagnóstico com microscópio térmico e micro-soldagem em circuitos SMD.',
      icon: <Cpu className="w-5 h-5 text-sky-400" />,
    },
    {
      title: 'Desoxidação / Celular Molhou',
      desc: 'Banho químico ultrassônico para recuperação de aparelhos que caíram na água.',
      icon: <Droplets className="w-5 h-5 text-cyan-300" />,
    },
    {
      title: 'Câmeras e Alto-falantes',
      desc: 'Troca de lentes de câmera, módulos fotográficos e alto-falantes chiando.',
      icon: <Sparkles className="w-5 h-5 text-pink-400" />,
    },
  ];

  const handleConsultService = (serviceName: string) => {
    const msg = `Olá SN TECHNO! Gostaria de um orçamento para o serviço de: *${serviceName}* no meu celular.`;
    const url = createWhatsAppLink(settings.whatsappNumber, msg);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="assistencia" className="py-12 sm:py-16 bg-[#090d16] border-t border-slate-800/80 relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
            <Wrench className="w-3.5 h-3.5 text-cyan-400" />
            Assistência Técnica Especializada
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight">
            Consertos em Celulares <br />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">
              Android & Apple
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Seu celular quebrou ou parou de funcionar? Nossa equipe na SN TECHNO realiza diagnósticos precisos e reparos com peças selecionadas e garantia de serviço.
          </p>
        </div>

        {/* Services Grid */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {services.map((srv, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-gradient-to-b from-[#111726] to-[#0d121e] border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2.5">
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 w-fit group-hover:scale-110 transition-transform">
                  {srv.icon}
                </div>
                <h3 className="font-bold text-base text-slate-100 group-hover:text-cyan-300 transition-colors">
                  {srv.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {srv.desc}
                </p>
              </div>

              <button
                id={`repair-quote-btn-${idx}`}
                onClick={() => handleConsultService(srv.title)}
                className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-cyan-300 hover:text-slate-950 bg-cyan-950/60 hover:bg-cyan-400 border border-cyan-500/40 hover:border-cyan-400 transition-all duration-200"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Pedir Orçamento</span>
              </button>
            </div>
          ))}
        </div>

        {/* Quality Banner */}
        <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-purple-950/40 to-slate-900/90 border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h4 className="font-extrabold text-lg sm:text-xl text-white font-['Space_Grotesk']">
              Precisa de um diagnóstico rápido no seu aparelho?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Traga seu celular na SN TECHNO ou envie uma mensagem no WhatsApp com o modelo e o defeito relatado para um atendimento prioritário.
            </p>
          </div>

          <button
            id="repair-whatsapp-direct-btn"
            onClick={() => handleConsultService('Orçamento Geral')}
            className="shrink-0 px-6 py-3.5 rounded-2xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
          >
            Falar com Técnico no WhatsApp
          </button>
        </div>

      </div>
    </section>
  );
};
