import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../components/common/Toast';
import { Lock, Mail, ArrowRight, ShieldCheck, Key, Eye, EyeOff, Store } from 'lucide-react';
import logoImg from '../../assets/logo.jpg';

export const AdminLogin: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const { navigate } = useStore();
  const { showSuccess, showError } = useToast();

  const [email, setEmail] = useState('sntechno@gmail.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // If already logged in, redirect immediately to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      showSuccess('Autenticado com Sucesso', 'Bem-vindo ao painel da SN TECHNO!');
      navigate('/admin/dashboard');
    } else {
      setErrorMessage(result.error || 'Credenciais inválidas. Tente novamente.');
      showError('Falha no Login', result.error);
    }
    setIsLoading(false);
  };

  const handleFillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center p-4 sm:p-6 text-slate-100 relative overflow-hidden">
      
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="relative inline-block">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-75 blur-xs"></div>
            <img
              src={logoImg}
              alt="SN TECHNO"
              className="relative w-20 h-20 rounded-full object-cover border-2 border-cyan-400 mx-auto shadow-xl"
              referrerPolicy="no-referrer"
            />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight">
              Acesso Administrativo
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Painel de Gestão e Controle de Estoque • SN TECHNO
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1322]/90 border border-slate-800 shadow-2xl shadow-black/60 backdrop-blur-xl space-y-5">
          
          <div className="flex items-center gap-2 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Área restrita exclusivamente ao proprietário autorizado.</span>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                E-mail Administrativo
              </label>
              <input
                id="admin-login-email-input"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="sntechno@gmail.com"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-slate-100 text-sm outline-none transition-all placeholder-slate-500"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-purple-400" />
                Senha de Acesso
              </label>
              <div className="relative">
                <input
                  id="admin-login-password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-slate-100 text-sm outline-none transition-all placeholder-slate-500 pr-10"
                />
                <button
                  type="button"
                  id="admin-toggle-password-visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="admin-login-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 hover:from-cyan-300 hover:to-purple-300 transition-all shadow-lg shadow-cyan-500/25 active:scale-98 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-slate-950" />
                  <span>Entrar no Painel</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Info for Testing & Safety */}
          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-1.5">
            <span className="font-semibold text-slate-300 block">Credenciais Administrativas:</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                id="quick-fill-admin-btn"
                onClick={() => handleFillDemo('sntechno@gmail.com', 'admin123')}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 font-mono text-[10px] transition-colors"
              >
                sntechno@gmail.com / admin123
              </button>
            </div>
          </div>

        </div>

        {/* Back to Public Store */}
        <div className="text-center">
          <button
            id="login-back-to-catalog-btn"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <Store className="w-4 h-4" />
            <span>Voltar ao Catálogo Público para Clientes</span>
          </button>
        </div>

      </div>

    </div>
  );
};
