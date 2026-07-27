import apiClient from '../../shared/utils/api.utils';
import {
  Cliente,
  ListClientesParams,
  PaginatedResponse
} from '../../shared/types/backoffice/users.types';
 
export const UsersBackofficeService = {
  getClientes: async (params?: ListClientesParams) => {
    const response = await apiClient.get<PaginatedResponse<Cliente>>('/v1/backoffice/clientes', { params });
    return response.data;
  },
 
  getClienteById: async (id: string) => {
    const response = await apiClient.get<{ data: Cliente }>(`/v1/backoffice/clientes/${id}`);
    return response.data;
  },
};
