import apiClient from '../../shared/utils/api.utils';
import {
  Repasse,
  ResumoFinanceiro,
  ListRepassesParams,
  ProcessarRepasseRequest
} from '../../shared/types/backoffice/finance.types';
import { PaginatedResponse } from '../../shared/types/backoffice/requests.types';

export const FinanceBackofficeService = {
  getRepasses: async (params?: ListRepassesParams) => {
    const response = await apiClient.get<PaginatedResponse<Repasse>>('/v1/backoffice/repasses', { params });
    return response.data;
  },

  processarRepasse: async (id: string, data: ProcessarRepasseRequest) => {
    const response = await apiClient.post<{ data: Repasse }>(`/v1/backoffice/repasses/${id}/processar`, data);
    return response.data;
  },

  getResumoFinanceiro: async () => {
    const response = await apiClient.get<{ data: ResumoFinanceiro }>('/v1/backoffice/financeiro/resumo');
    return response.data;
  },
};
