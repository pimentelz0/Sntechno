import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { ToastProvider } from './components/common/Toast';
import { PublicCatalog } from './pages/PublicCatalog';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminStock } from './pages/admin/AdminStock';
import { AdminSettingsPage } from './pages/admin/AdminSettings';

const AppRouter: React.FC = () => {
  const { currentRoute, navigate } = useStore();
  const { isAuthenticated, isLoading } = useAuth();

  // If loading auth state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-semibold text-cyan-300">Carregando SN TECHNO...</span>
        </div>
      </div>
    );
  }

  // Admin Login route
  if (currentRoute === '/admin/login') {
    return <AdminLogin />;
  }

  // Protected Admin Routes Guard
  if (currentRoute.startsWith('/admin')) {
    if (!isAuthenticated) {
      return <AdminLogin />;
    }

    switch (currentRoute) {
      case '/admin':
      case '/admin/dashboard':
        return <AdminDashboard />;
      case '/admin/produtos':
        return <AdminProducts />;
      case '/admin/categorias':
        return <AdminCategories />;
      case '/admin/estoque':
        return <AdminStock />;
      case '/admin/configuracoes':
        return <AdminSettingsPage />;
      default:
        return <AdminDashboard />;
    }
  }

  // Public Catalog by default
  return <PublicCatalog />;
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <StoreProvider>
          <AppRouter />
        </StoreProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
