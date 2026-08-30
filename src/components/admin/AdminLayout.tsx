import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  Boxes, 
  Settings, 
  LogOut, 
  ExternalLink, 
  Menu, 
  X, 
  ShieldCheck, 
  ChevronRight,
  User,
  Sparkles
} from 'lucide-react';
import logoImg from '../../assets/logo.jpg';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPageTitle: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, currentPageTitle }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { currentRoute, navigate, settings } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', route: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Produtos', route: '/admin/produtos', icon: <Package className="w-4 h-4" /> },
    { label: 'Categorias', route: '/admin/categorias', icon: <Layers className="w-4 h-4" /> },
    { label: 'Estoque', route: '/admin/estoque', icon: <Boxes className="w-4 h-4" /> },
    { label: 'Configurações', route: '/admin/configuracoes', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col md:flex-row">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0a0f1c] border-r border-slate-800/80 p-5 shrink-0 justify-between">
        
        {/* Top Brand Section */}
        <div className="space-y-6">
          <div 
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img
              src={logoImg}
              alt="SN TECHNO"
              className="w-10 h-10 rounded-full object-cover border border-cyan-400/40 shadow-sm"
              referrerPolicy="no-referrer"
            />
            <div>
              <span className="font-extrabold text-lg text-white font-['Space_Grotesk'] tracking-tight block leading-tight">
                SN TECHNO
              </span>
              <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-cyan-400" />
                Painel Admin
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map(item => {
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  id={`admin-nav-${item.label.toLowerCase()}`}
                  onClick={() => navigate(item.route)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/10 text-cyan-300 border border-cyan-500/40 shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User & Actions Section */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          
          {/* Public Catalog Link */}
          <button
            id="admin-sidebar-view-catalog-btn"
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-cyan-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Ver Catálogo Público</span>
          </button>

          {/* Admin Profile Info */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-300 font-medium truncate">
              <User className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">{user?.email || 'admin@sntechno.com'}</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">
              ● Sessão Ativa & Protegida
            </span>
          </div>

          {/* Logout Button */}
          <button
            id="admin-logout-btn"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-950 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair do Painel</span>
          </button>

        </div>

      </aside>

      {/* Mobile Top Navbar */}
      <header className="md:hidden sticky top-0 z-40 bg-[#0a0f1c]/95 backdrop-blur-md border-b border-slate-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5" onClick={() => navigate('/admin/dashboard')}>
          <img
            src={logoImg}
            alt="SN TECHNO"
            className="w-8 h-8 rounded-full object-cover border border-cyan-400/40"
            referrerPolicy="no-referrer"
          />
          <div>
            <span className="font-extrabold text-sm text-white font-['Space_Grotesk'] leading-none block">
              SN TECHNO
            </span>
            <span className="text-[9px] text-cyan-400 font-semibold">Painel Admin</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold"
            title="Ver catálogo"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Slide-down Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0d1322] border-b border-slate-800 p-4 space-y-3 z-30">
          <nav className="space-y-1">
            {navItems.map(item => (
              <button
                key={item.route}
                onClick={() => {
                  navigate(item.route);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold ${
                  currentRoute === item.route
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              </button>
            ))}
          </nav>

          <div className="pt-2 border-t border-slate-800 flex gap-2">
            <button
              onClick={() => {
                navigate('/');
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-slate-300 border border-slate-800"
            >
              Catálogo
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 py-2 rounded-xl text-xs font-semibold bg-rose-950/60 text-rose-300 border border-rose-900"
            >
              Sair
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top bar with Breadcrumbs & Title */}
        <div className="bg-[#0a0f1c]/50 border-b border-slate-800/80 px-4 sm:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Admin</span>
              <span>/</span>
              <span className="text-cyan-400 font-semibold">{currentPageTitle}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white font-['Space_Grotesk'] mt-0.5">
              {currentPageTitle}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ver Loja ao Vivo</span>
            </button>
          </div>
        </div>

        {/* Child Page Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

      </div>

    </div>
  );
};
