import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useToast } from '../../components/common/Toast';
import { StoreSettings } from '../../types';
import { createWhatsAppLink } from '../../lib/utils';
import { 
  MessageCircle, 
  Store, 
  ExternalLink,
  Save
} from 'lucide-react';
import logoImg from '../../assets/logo.jpg';

export const AdminSettingsPage: React.FC = () => {
  const { 
    settings, 
    updateSettings
  } = useStore();
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState<StoreSettings>({ ...settings });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.whatsappNumber.trim()) {
      showError('Erro', 'O número do WhatsApp é obrigatório para o funcionamento dos pedidos.');
      return;
    }

    updateSettings(formData);
    showSuccess('Configurações Salvas', 'Os dados da loja e do WhatsApp foram atualizados com sucesso.');
  };

  const handleTestWhatsApp = () => {
    const testMsg = `Olá! Este é um teste de comunicação do catálogo da ${formData.storeName || 'SN TECHNO'}.`;
    const url = createWhatsAppLink(formData.whatsappNumber, testMsg);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <AdminLayout currentPageTitle="Configurações da Loja">
      <div className="max-w-4xl space-y-6">
        
        {/* Brand Reference Reminder */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-[#0e1424] to-purple-950/30 border border-cyan-500/30 flex items-center gap-4">
          <img
            src={logoImg}
            alt="SN TECHNO"
            className="w-14 h-14 rounded-full object-cover border-2 border-cyan-400 shrink-0"
            referrerPolicy="no-referrer"
          />
          <div>
            <h3 className="font-extrabold text-white font-['Space_Grotesk'] text-base">
              Identidade Visual Oficial: SN TECHNO
            </h3>
            <p className="text-xs text-slate-300">
              Especialistas em consertos de celulares e vendas de acessórios. O WhatsApp configurado abaixo receberá todos os carrinhos e pedidos dos clientes.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Card 1: WhatsApp Oficial de Pedidos */}
          <div className="p-6 rounded-3xl bg-[#0e1424] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">
                    WhatsApp de Recebimento de Pedidos
                  </h3>
                  <p className="text-xs text-slate-400">
                    Número que receberá a mensagem estruturada quando o cliente clicar em finalizar pedido.
                  </p>
                </div>
              </div>

              <button
                type="button"
                id="test-whatsapp-link-btn"
                onClick={handleTestWhatsApp}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Testar Envio</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Número de WhatsApp (DDD + Número) <span className="text-rose-400">*</span>
                </label>
                <input
                  id="settings-whatsapp-input"
                  type="text"
                  required
                  value={formData.whatsappNumber}
                  onChange={e => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  placeholder="Ex: 85920094668 ou (85) 92009-4668"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm outline-none focus:border-emerald-400 font-mono"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Ex: 85920094668.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Alerta de Estoque Baixo (Quantidade)
                </label>
                <input
                  id="settings-stock-threshold-input"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.lowStockThreshold}
                  onChange={e => setFormData({ ...formData, lowStockThreshold: parseInt(e.target.value, 10) || 5 })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm outline-none focus:border-cyan-400 font-mono"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Produtos com estoque menor ou igual a este valor acionarão o aviso no dashboard.
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Dados Gerais da Loja */}
          <div className="p-6 rounded-3xl bg-[#0e1424] border border-slate-800 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Informações da Loja</h3>
                <p className="text-xs text-slate-400">Nome e descrição exibidos no cabeçalho e rodapé.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nome da Empresa
                </label>
                <input
                  id="settings-store-name"
                  type="text"
                  value={formData.storeName}
                  onChange={e => setFormData({ ...formData, storeName: e.target.value })}
                  placeholder="SN TECHNO"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Instagram Oficial (URL ou @usuario)
                </label>
                <input
                  id="settings-instagram"
                  type="text"
                  value={formData.instagram || ''}
                  onChange={e => setFormData({ ...formData, instagram: e.target.value })}
                  placeholder="https://www.instagram.com/sntechno_aracape"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm outline-none focus:border-cyan-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Texto de Apresentação / Slogan
                </label>
                <textarea
                  id="settings-presentation-text"
                  rows={2}
                  value={formData.presentationText}
                  onChange={e => setFormData({ ...formData, presentationText: e.target.value })}
                  placeholder="Manutenção especializada em celulares e os melhores acessórios..."
                  className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Horário de Funcionamento
                </label>
                <input
                  id="settings-hours"
                  type="text"
                  value={formData.businessHours || ''}
                  onChange={e => setFormData({ ...formData, businessHours: e.target.value })}
                  placeholder="Seg a Sex: 09h às 18h | Sáb: 09h às 13h"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Endereço / Retirada
                </label>
                <input
                  id="settings-address"
                  type="text"
                  value={formData.address || ''}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Atendimento e Retirada na Loja"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-4 pt-2">
            <button
              type="submit"
              id="save-settings-submit-btn"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-xl shadow-cyan-500/20 active:scale-98 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Configurações</span>
            </button>
          </div>

        </form>

      </div>
    </AdminLayout>
  );
};
