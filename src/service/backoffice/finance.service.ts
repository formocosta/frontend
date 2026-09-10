import apiClient from '../../shared/utils/api.utils';
import {
  FinancialSummary,
  Categoria,
  Subcategoria,
  Pagamento,
  Repasse,
  ProcessarRepasseRequest,
  ConfirmarPagamentoRequest,
  PaginatedResponse,
} from '../../shared/types/backoffice/finance.types';

export const FinanceBackofficeService = {
  // Resumo financeiro (Dashboard + Repasses)
  getResumoFinanceiro: async () => {
    const response = await apiClient.get<{ data: FinancialSummary }>('/v1/backoffice/financeiro/resumo');
    return response.data;
  },

  // Repasses
  getRepasses: async (params?: { search?: string; status?: string; page?: number }) => {
    const response = await apiClient.get<PaginatedResponse<Repasse>>('/v1/backoffice/repasses', { params });
    return response.data;
  },

  processarRepasse: async (id: string, data: ProcessarRepasseRequest) => {
    const response = await apiClient.post<{ data: Repasse }>(`/v1/backoffice/repasses/${id}/processar`, data);
    return response.data;
  },
};

export const CatalogoBackofficeService = {
  // Listar categorias (público, com subcategorias)
  getCategorias: async () => {
    const response = await apiClient.get<{ data: Categoria[] }>('/v1/categorias');
    return response.data;
  },

  criarCategoria: async (data: FormData) => {
    const response = await apiClient.post<{ data: Categoria }>('/v1/backoffice/categorias', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  actualizarCategoria: async (id: string, data: FormData) => {
    const response = await apiClient.patch<{ data: Categoria }>(`/v1/backoffice/categorias/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  eliminarCategoria: async (id: string) => {
    const response = await apiClient.delete(`/v1/backoffice/categorias/${id}`);
    return response.data;
  },

  criarSubcategoria: async (categoriaId: string, data: { nome: string; descricao?: string }) => {
    const response = await apiClient.post<{ data: Subcategoria }>(
      `/v1/backoffice/categorias/${categoriaId}/subcategorias`,
      data
    );
    return response.data;
  },

  actualizarSubcategoria: async (id: string, data: { nome?: string; descricao?: string }) => {
    const response = await apiClient.patch<{ data: Subcategoria }>(`/v1/backoffice/subcategorias/${id}`, data);
    return response.data;
  },
};

export const PagamentosBackofficeService = {
  getPagamentos: async (params?: { search?: string; status?: string; metodo?: string; page?: number }) => {
    const response = await apiClient.get<PaginatedResponse<Pagamento>>('/v1/backoffice/pagamentos', { params });
    return response.data;
  },

  confirmarPagamento: async (solicitacaoId: string, data?: ConfirmarPagamentoRequest) => {
    const response = await apiClient.post<{ data: Pagamento }>(
      `/v1/solicitacoes/${solicitacaoId}/pagamento/confirmar`,
      data || {}
    );
    return response.data;
  },

  downloadComprovativo: async (pagamentoId: string) => {
    const response = await apiClient.get(`/v1/pagamentos/${pagamentoId}/comprovativo-pdf`, {
      responseType: 'blob',
    });
    return response;
  },
};
