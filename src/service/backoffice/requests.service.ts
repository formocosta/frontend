import apiClient from '../../shared/utils/api.utils';
import {
  Solicitacao,
  Mensagem,
  ListSolicitacoesParams,
  PaginatedResponse,
  EncaminharSolicitacaoRequest
} from '../../shared/types/backoffice/requests.types';

export const RequestsBackofficeService = {
  getSolicitacoes: async (params?: ListSolicitacoesParams) => {
    const response = await apiClient.get<PaginatedResponse<Solicitacao>>('/v1/backoffice/solicitacoes', { params });
    return response.data;
  },

  getSolicitacaoById: async (id: string) => {
    const response = await apiClient.get<{ data: Solicitacao }>(`/v1/solicitacoes/${id}`);
    return response.data;
  },

  encaminharSolicitacao: async (id: string, data: EncaminharSolicitacaoRequest) => {
    const response = await apiClient.post<{ data: Solicitacao }>(`/v1/backoffice/solicitacoes/${id}/encaminhar`, data);
    return response.data;
  },

  getMensagens: async (solicitacaoId: string) => {
    const response = await apiClient.get<{ data: Mensagem[] }>(`/v1/backoffice/solicitacoes/${solicitacaoId}/mensagens`);
    return response.data;
  },
};
