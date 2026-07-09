import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import { User } from '../types/auth.types';

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

          const data = response.data as any;

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
          if (!ALLOWED_ROLES.includes(user.role)) {
            return {
              success: false,
              error: 'Acesso negado. Apenas administradores e operadores podem aceder ao backoffice.',
            };
          }

          get().setAuth(user, data.access_token, data.refresh_token);
          return { success: true };
        } catch (error: any) {
          const message = error?.response?.data?.message || 'Erro ao efetuar login';
          return { success: false, error: message };
        }
      },

      setAuth: (user, accessToken, refreshToken) => {
        set({ user, accessToken, refreshToken, isAuthenticated: true });
        get().setupAutoRefresh();
      },

      setUser: (user) => set({ user }),

      logout: () => {
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
          const decoded: any = jwtDecode(accessToken);
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
