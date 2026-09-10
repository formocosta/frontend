import apiClient from '../../shared/utils/api.utils';
import {
  DashboardOverviewResponse,
  PerformanceHojeData,
  VendasGraficoData,
  ServicoMetricasData,
  AvaliacoesData,
  ClientesData,
} from '../../shared/types/backoffice/dashboard.types';

export const DashboardBackofficeService = {
  // Obter visão geral consolidada completa
  getOverview: async (params?: {
    periodo?: string;
    start_date?: string;
    end_date?: string;
    prestador_id?: string;
  }) => {
    const response = await apiClient.get<{ data: DashboardOverviewResponse }>(
      '/v1/backoffice/dashboard/overview',
      { params }
    );
    return response.data.data;
  },

  // Performance do dia
  getPerformanceHoje: async (prestadorId?: string) => {
    const response = await apiClient.get<{ data: PerformanceHojeData }>(
      '/v1/backoffice/dashboard/performance-hoje',
      { params: { prestador_id: prestadorId } }
    );
    return response.data.data;
  },

  // Gráfico comparativo de vendas
  getVendasComparativo: async (params?: {
    periodo?: string;
    start_date?: string;
    end_date?: string;
    prestador_id?: string;
  }) => {
    const response = await apiClient.get<{ data: VendasGraficoData }>(
      '/v1/backoffice/dashboard/vendas-comparativo',
      { params }
    );
    return response.data.data;
  },

  // Métricas operacionais de serviço
  getServicoMetricas: async (params?: { periodo?: string; prestador_id?: string }) => {
    const response = await apiClient.get<{ data: ServicoMetricasData }>(
      '/v1/backoffice/dashboard/servico',
      { params }
    );
    return response.data.data;
  },

  // Estatísticas de avaliações
  getAvaliacoesStats: async (prestadorId?: string) => {
    const response = await apiClient.get<{ data: AvaliacoesData }>(
      '/v1/backoffice/dashboard/avaliacoes',
      { params: { prestador_id: prestadorId } }
    );
    return response.data.data;
  },

  // Distribuição de clientes
  getClientesStats: async (periodo?: string) => {
    const response = await apiClient.get<{ data: ClientesData }>(
      '/v1/backoffice/dashboard/clientes',
      { params: { periodo } }
    );
    return response.data.data;
  },
};
