import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import { User } from '../types/auth.types';
import { AxiosError } from 'axios';

const ALLOWED_ROLES = ['admin', 'operador'] as const;

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; twoFactorPending?: boolean; tempToken?: string }>;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  setupAutoRefresh: () => void;
}

let refreshTimeoutId: NodeJS.Timeout | null = null;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      login: async (email, password) => {
        try {
          const { AuthService } = await import('../../service/auth.service');
          const response = await AuthService.login({ email, password });

          if (!response || !response.data) {
            return { success: false, error: 'Resposta inválida do servidor' };
          }

          const data = response.data as {
            two_factor_pending?: boolean;
            temp_token?: string;
            user?: User;
            access_token: string;
            refresh_token: string;
          };

          // 2FA pending response
          if (data.two_factor_pending) {
            return {
              success: true,
              twoFactorPending: true,
              tempToken: data.temp_token,
            };
          }

          // Normal login response
          const user = data.user;
          if (!user) {
            return { success: false, error: 'Dados do utilizador não encontrados' };
          }

          // Validate role - only admin and operator allowed
          if (!user.role || !(ALLOWED_ROLES as readonly string[]).includes(user.role)) {
            return {
              success: false,
              error: 'Acesso negado. Apenas administradores e operadores podem aceder ao backoffice.',
            };
          }

          get().setAuth(user, data.access_token, data.refresh_token);
          return { success: true };
        } catch (error) {
          const axiosError = error as AxiosError<{ message?: string }>;
          const message = axiosError?.response?.data?.message || 'Erro ao efetuar login';
          return { success: false, error: message };
        }
      },

      setAuth: (user, accessToken, refreshToken) => {
        if (typeof window !== 'undefined') {
          document.cookie = `access_token=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
        }
        set({ user, accessToken, refreshToken, isAuthenticated: true });
        get().setupAutoRefresh();
      },

      setUser: (user) => set({ user }),

      logout: () => {
        if (typeof window !== 'undefined') {
          document.cookie = 'access_token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
        if (refreshTimeoutId) {
          clearTimeout(refreshTimeoutId);
        }
      },

      refreshAuth: async () => {
        try {
          const { AuthService } = await import('../../service/auth.service');
          const response = await AuthService.refresh();

          if (response && response.data && response.data.access_token && response.data.refresh_token) {
            set((state) => ({
              ...state,
              accessToken: response.data.access_token,
              refreshToken: response.data.refresh_token,
            }));
            get().setupAutoRefresh();
          }
        } catch (error) {
          console.error('Falha ao atualizar o token', error);
          get().logout();
          throw error;
        }
      },

      setupAutoRefresh: () => {
        const { accessToken, refreshAuth } = get();
        if (!accessToken) return;

        try {
          const decoded = jwtDecode<{ exp?: number }>(accessToken);
          if (!decoded.exp) return;

          // Calcula tempo restante em milisegundos
          const expiresMs = decoded.exp * 1000;
          const nowMs = new Date().getTime();
          const timeUntilExpiry = expiresMs - nowMs;

          if (refreshTimeoutId) {
            clearTimeout(refreshTimeoutId);
          }

          // Define o refresh para ocorrer 1 minuto antes de expirar
          const refreshBuffer = 60 * 1000;
          const timeUntilRefresh = timeUntilExpiry - refreshBuffer;

          if (timeUntilRefresh > 0) {
            refreshTimeoutId = setTimeout(() => {
              refreshAuth();
            }, timeUntilRefresh);
          } else {
            // Se já estiver expirado ou muito perto, tenta atualizar logo (ou deixa o interceptor pegar)
            // Não vamos forçar atualização imediata para evitar loop, o interceptor do axios resolverá
          }
        } catch (error) {
          console.error('Token JWT inválido ou não pode ser lido', error);
        }
      },
    }),
    {
      name: 'auth-storage', // nome da chave no storage
      // Evita o localStorage para maior segurança usando sessionStorage. 
      // Tokens sobrevivem a reloads, mas morrem ao fechar a aba
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
