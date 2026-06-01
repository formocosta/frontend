'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { clearTokens, getUser, storeTokens } from './auth';

type Role = 'admin' | 'operador' | 'operador_financeiro' | 'suporte' | string;

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

type AuthContextType = {
  user: User | null;
  login: (user: User, access: string, refresh: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getUser() as User | null);

  const login = useCallback((user: User, access: string, refresh: string) => {
    storeTokens(access, refresh, user);
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
