import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useToast } from '../../components/common/Toast';
import { StoreSettings } from '../../types';
import { cleanPhoneNumber, createWhatsAppLink } from '../../lib/utils';
import { SUPABASE_SQL_SETUP } from '../../lib/supabase';
import { 
  Settings, 
  MessageCircle, 
  Store, 
  Clock, 
  MapPin, 
  Instagram, 
  BookOpen, 
  AlertTriangle, 
  Check, 
  RotateCcw,
  ExternalLink,
  Save,
  ShieldCheck,
  Database,
  RefreshCw,
  Code2,
  Copy,
  CheckCircle2,
  Server
} from 'lucide-react';
import logoImg from '../../assets/logo.jpg';

export const AdminSettingsPage: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    resetToInitialData, 
    supabaseStatus, 
    syncToSupabaseNow, 
    testSupabase 
  } = useStore();
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState<StoreSettings>({ ...settings });
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isTestingSupabase, setIsTestingSupabase] = useState(false);
  const [isSyncingSupabase, setIsSyncingSupabase] = useState(false);
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

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

  const handleResetDefaults = () => {
    resetToInitialData();
    setFormData({ ...settings });
    setIsResetConfirmOpen(false);
    showSuccess('Dados Restaurados', 'Catálogo restaurado com produtos e categorias padrão da SN TECHNO.');
  };

  const handleTestSupabaseConn = async () => {
    setIsTestingSupabase(true);
    try {
      const res = await testSupabase();
      if (res.success) {
        showSuccess('Supabase Conectado', res.message);
      } else {
        showError('Supabase Aviso', res.message);
      }
    } catch (err: any) {
      showError('Erro', err.message || 'Falha ao testar conexão.');
    } finally {
      setIsTestingSupabase(false);
    }
  };

  const handleSyncSupabaseData = async () => {
    setIsSyncingSupabase(true);
    try {
      const res = await syncToSupabaseNow();
      if (res.success) {
        showSuccess('Sincronização Concluída', res.message);
      } else {
        showError('Erro de Sincronização', res.message);
      }
    } catch (err: any) {
      showError('Erro', err.message || 'Falha ao sincronizar com Supabase.');
    } finally {
      setIsSyncingSupabase(false);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SETUP);
    setCopiedSql(true);
    showSuccess('Copiado', 'Script SQL copiado para a área de transferência!');
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <AdminLayout currentPageTitle="Configurações da Loja">
      <div className="max-w-4xl space-y-8">
        
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
                  placeholder="Ex: 5511999999999 ou (11) 99999-9999"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm outline-none focus:border-emerald-400 font-mono"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Recomendado incluir código do país (Ex: 55 para o Brasil).
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
                  Instagram Oficial
                </label>
                <input
                  id="settings-instagram"
                  type="text"
                  value={formData.instagram || ''}
                  onChange={e => setFormData({ ...formData, instagram: e.target.value })}
                  placeholder="@sntechno"
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

          {/* Card 3: Versículo Bíblico Oficial */}
          <div className="p-6 rounded-3xl bg-[#0e1424] border border-slate-800 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Versículo Bíblico da Loja</h3>
                <p className="text-xs text-slate-400">Apresentado na identidade visual e no rodapé do catálogo.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Texto do Versículo
                </label>
                <input
                  id="settings-bible-verse"
                  type="text"
                  value={formData.bibleVerse || ''}
                  onChange={e => setFormData({ ...formData, bibleVerse: e.target.value })}
                  placeholder="Consagre ao Senhor tudo o que você faz..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs outline-none focus:border-cyan-400 italic"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Referência Bíblica
                </label>
                <input
                  id="settings-bible-ref"
                  type="text"
                  value={formData.bibleReference || ''}
                  onChange={e => setFormData({ ...formData, bibleReference: e.target.value })}
                  placeholder="Provérbios 16:3"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Card 4: Supabase Cloud Database & Vercel */}
          <div className="p-6 rounded-3xl bg-[#0e1424] border border-cyan-500/30 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-cyan-950/90 border border-cyan-500/50 text-cyan-300">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-white">Banco de Dados Supabase (Vercel Ready)</h3>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                      supabaseStatus === 'connected' 
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40' 
                        : supabaseStatus === 'syncing'
                        ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40 animate-pulse'
                        : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        supabaseStatus === 'connected' ? 'bg-emerald-400' : supabaseStatus === 'syncing' ? 'bg-cyan-400' : 'bg-amber-400'
                      }`} />
                      {supabaseStatus === 'connected' ? 'Supabase Ativo' : supabaseStatus === 'syncing' ? 'Sincronizando...' : 'Local + Supabase'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Sincronização em nuvem e persistência permanente para seu catálogo hospedado na Vercel.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="test-supabase-btn"
                  onClick={handleTestSupabaseConn}
                  disabled={isTestingSupabase}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 transition-colors disabled:opacity-50"
                >
                  <Server className={`w-3.5 h-3.5 ${isTestingSupabase ? 'animate-spin' : ''}`} />
                  <span>{isTestingSupabase ? 'Testando...' : 'Testar Conexão'}</span>
                </button>

                <button
                  type="button"
                  id="sync-supabase-btn"
                  onClick={handleSyncSupabaseData}
                  disabled={isSyncingSupabase}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingSupabase ? 'animate-spin' : ''}`} />
                  <span>{isSyncingSupabase ? 'Sincronizando...' : 'Sincronizar Nuvem'}</span>
                </button>
              </div>
            </div>

            {/* Supabase Endpoint & Key Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 block">Vite URL Supabase:</span>
                <div className="font-mono text-cyan-300 break-all select-all bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800">
                  https://zatwvmhebirtnfhhwamz.supabase.co
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 block">Vite Anon Key:</span>
                <div className="font-mono text-slate-300 break-all select-all bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800 truncate" title="sb_publishable_I1qRt-YZZrsVMTJ-a_5MEg_GPk0K2oO">
                  sb_publishable_I1qRt-YZZrsVMTJ-a_5MEg_GPk0K2oO
                </div>
              </div>
            </div>

            {/* Quick Actions & SQL Help */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
              <span className="text-slate-400 text-[11px]">
                💡 Variáveis configuradas com prefixo <code className="text-cyan-300 font-mono">VITE_SUPABASE_URL</code> e <code className="text-cyan-300 font-mono">VITE_SUPABASE_ANON_KEY</code> para a Vercel.
              </span>

              <button
                type="button"
                id="view-supabase-sql-btn"
                onClick={() => setIsSqlModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-purple-300 hover:text-white bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/40 transition-colors"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Ver Script SQL do Banco</span>
              </button>
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

        {/* Danger Zone: Restore Defaults */}
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
              Restaurar Catálogo Padrão
            </h4>
            <p className="text-xs text-slate-500">
              Recarrega a lista inicial com os 12 produtos e categorias originais da SN TECHNO.
            </p>
          </div>

          <button
            id="reset-demo-data-btn"
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-400 bg-slate-900 hover:bg-rose-950/40 border border-slate-800 transition-colors shrink-0"
          >
            Restaurar Dados Iniciais
          </button>
        </div>

      </div>

      {/* Reset Confirmation Dialog */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-[#121018] border border-amber-500/40 p-6 text-slate-100 shadow-2xl space-y-4 text-center">
            <div className="p-3 rounded-full bg-amber-950 text-amber-400 w-fit mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white font-['Space_Grotesk']">
                Restaurar Dados Padrão?
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Isso reinicializará os produtos, categorias e configurações da SN TECHNO para os valores originais.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
              >
                Cancelar
              </button>
              <button
                id="confirm-reset-defaults-btn"
                onClick={handleResetDefaults}
                className="px-4 py-2 rounded-xl font-bold text-xs text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-md"
              >
                Confirmar Restauração
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SQL Script Viewer Modal */}
      {isSqlModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[85vh] rounded-3xl bg-[#0e1424] border border-cyan-500/40 p-6 text-slate-100 shadow-2xl flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-950 text-purple-400">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white font-['Space_Grotesk']">
                    Script SQL para o Supabase
                  </h3>
                  <p className="text-xs text-slate-400">
                    Copie e cole no <strong className="text-cyan-300">SQL Editor</strong> do seu painel Supabase caso as tabelas ainda não existam.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsSqlModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm px-2 py-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Code container */}
            <div className="flex-1 overflow-auto rounded-2xl bg-slate-950 p-4 border border-slate-800 text-[11px] font-mono text-cyan-300 leading-relaxed max-h-[50vh] select-all">
              <pre className="whitespace-pre-wrap">{SUPABASE_SQL_SETUP}</pre>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-[11px] text-slate-400">
                Gera tabelas: categories, products, settings, orders + RLS policies
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsSqlModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
                >
                  Fechar
                </button>
                <button
                  type="button"
                  id="copy-sql-modal-btn"
                  onClick={handleCopySql}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-md transition-all"
                >
                  {copiedSql ? <CheckCircle2 className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSql ? 'Copiado!' : 'Copiar Script SQL'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
