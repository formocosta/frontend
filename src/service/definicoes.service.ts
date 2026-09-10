import apiClient from '../shared/utils/api.utils';
import { User } from '../shared/types/auth.types';

export interface Preferencias {
  notificacoes_email: boolean;
  notificacoes_sistema: boolean;
  relatorios_semanais: boolean;
  tema: string;
  idioma: string;
}

export interface DefinicoesResponse {
  user: User;
  preferencias: Preferencias;
}

export interface UpdateDefinicoesPayload {
  nome_completo?: string;
  email?: string;
  telefone?: string;
  password?: string;
  notificacoes_email?: boolean;
  notificacoes_sistema?: boolean;
}

export interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: string;
  lida: boolean;
  link: string;
  created_at: string;
}

export interface SuporteInfo {
  contacto_emergencia: {
    telefone: string;
    email: string;
    horario: string;
  };
  faqs: Array<{ pergunta: string; resposta: string }>;
  documentacao_url: string;
}

export const DefinicoesService = {
  getDefinicoes: async () => {
    const response = await apiClient.get<{ data: DefinicoesResponse }>('/v1/backoffice/definicoes');
    return response.data.data;
  },

  updateDefinicoes: async (payload: UpdateDefinicoesPayload) => {
    const response = await apiClient.put<{ data: DefinicoesResponse; message?: string }>('/v1/backoffice/definicoes', payload);
    return response.data;
  },

  getNotificacoes: async () => {
    const response = await apiClient.get<{ data: { data: Notificacao[]; total_nao_lidas: number } }>('/v1/backoffice/notificacoes');
    return response.data.data;
  },

  markNotificacaoAsRead: async (id: string) => {
    const response = await apiClient.put<{ message: string }>(`/v1/backoffice/notificacoes/${id}/lida`);
    return response.data;
  },

  markAllNotificacoesAsRead: async () => {
    const response = await apiClient.post<{ message: string }>('/v1/backoffice/notificacoes/ler-todas');
    return response.data;
  },

  getSuporteInfo: async () => {
    const response = await apiClient.get<{ data: SuporteInfo }>('/v1/backoffice/suporte');
    return response.data.data;
  },

  enviarMensagemSuporte: async (payload: { assunto: string; mensagem: string }) => {
    const response = await apiClient.post<{ message: string; data: { ticket_id: string } }>('/v1/backoffice/suporte/contacto', payload);
    return response.data;
  },
};
