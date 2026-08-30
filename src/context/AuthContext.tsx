import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AdminUser } from '../types';
import { StorageService } from '../services/storage';

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string, remember?: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateAdminUser: (userData: Partial<AdminUser>) => void;
  updatePassword: (currentPass: string, newPass: string) => { success: boolean; error?: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize session on mount
  useEffect(() => {
    try {
      const session = StorageService.getSession();
      if (session && session.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error('Session validation error:', e);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, pass: string, remember: boolean = true) => {
    setIsLoading(true);
    // Simulate brief network authentication check
    await new Promise(r => setTimeout(r, 400));

    const admin = StorageService.getAdminUser();
    const validPass = StorageService.getAdminPassword();

    const normalizedEmail = email.trim().toLowerCase();
    const adminEmail = admin.email.trim().toLowerCase();

    // Check credentials (allows configured admin email OR project owner email)
    const isEmailValid = normalizedEmail === adminEmail || normalizedEmail === 'admin@sntechno.com' || normalizedEmail === 'vicecityprojeto@gmail.com';
    const isPassValid = pass === validPass || (pass === 'admin123' && validPass === 'admin123');

    if (!isEmailValid) {
      setIsLoading(false);
      return { success: false, error: 'E-mail administrativo não reconhecido.' };
    }

    if (!isPassValid) {
      setIsLoading(false);
      return { success: false, error: 'Senha incorreta. Verifique suas credenciais.' };
    }

    const updatedUser: AdminUser = {
      ...admin,
      email: normalizedEmail,
      lastLogin: new Date().toISOString(),
    };

    StorageService.createSession(updatedUser, remember);
    setUser(updatedUser);
    setIsLoading(false);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    StorageService.clearSession();
    setUser(null);
  }, []);

  const updateAdminUser = useCallback((userData: Partial<AdminUser>) => {
    if (!user) return;
    const updated = { ...user, ...userData };
    setUser(updated);
    StorageService.createSession(updated, true);
  }, [user]);

  const updatePassword = useCallback((currentPass: string, newPass: string) => {
    const validPass = StorageService.getAdminPassword();
    if (currentPass !== validPass) {
      return { success: false, error: 'A senha atual informada está incorreta.' };
    }
    if (newPass.length < 6) {
      return { success: false, error: 'A nova senha deve ter no mínimo 6 caracteres.' };
    }
    StorageService.setAdminPassword(newPass);
    return { success: true };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateAdminUser,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
