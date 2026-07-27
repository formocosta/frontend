import apiClient from '../../shared/utils/api.utils';
import {
  Cliente,
  ListClientesParams,
  PrestadorUser,
  ListPrestadoresParams,
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

  getPrestadores: async (params?: ListPrestadoresParams) => {
    const response = await apiClient.get<PaginatedResponse<PrestadorUser>>('/v1/backoffice/prestadores', { params });
    return response.data;
  },

  getPrestadorById: async (id: string) => {
    const response = await apiClient.get<{ data: PrestadorUser }>(`/v1/backoffice/prestadores/${id}`);
    return response.data;
  },
};
