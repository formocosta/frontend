import apiClient from '../shared/utils/api.utils';
import {
  Utilizador,
  ListUtilizadoresParams,
  CriarUtilizadorPayload,
  ActualizarUtilizadorPayload,
  UtilizadoresPaginationMeta,
} from '../shared/types/backoffice/utilizadores.types';

export const UtilizadoresService = {
  /**
   * List backoffice users (Admins & Operadores)
   */
  listUtilizadores: async (params?: ListUtilizadoresParams) => {
    const response = await apiClient.get<{
      data: Utilizador[];
      meta?: UtilizadoresPaginationMeta;
    }>('/v1/backoffice/utilizadores', { params });
    return response.data;
  },

  /**
   * Get single backoffice user
   */
  getUtilizador: async (id: string) => {
    const response = await apiClient.get<{ data: Utilizador }>(`/v1/backoffice/utilizadores/${id}`);
    return response.data;
  },

  /**
   * Create a new backoffice user (Admin only)
   */
  criarUtilizador: async (payload: CriarUtilizadorPayload) => {
    const response = await apiClient.post<{ data: Utilizador }>('/v1/backoffice/utilizadores', payload);
    return response.data;
  },

  /**
   * Update an existing backoffice user (Admin only)
   */
  actualizarUtilizador: async (id: string, payload: ActualizarUtilizadorPayload) => {
    const response = await apiClient.put<{ data: Utilizador }>(`/v1/backoffice/utilizadores/${id}`, payload);
    return response.data;
  },

  /**
   * Delete / Deactivate a backoffice user (Admin only)
   */
  eliminarUtilizador: async (id: string) => {
    const response = await apiClient.delete<{ message: string }>(`/v1/backoffice/utilizadores/${id}`);
    return response.data;
  },
};
