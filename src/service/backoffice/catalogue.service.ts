import apiClient from '../../shared/utils/api.utils';
import {
  Categoria,
  Subcategoria,
  StoreCategoriaRequest,
  UpdateCategoriaRequest,
  StoreSubcategoriaRequest,
  UpdateSubcategoriaRequest
} from '../../shared/types/backoffice/catalogue.types';

export const CatalogueBackofficeService = {
  getCategorias: async () => {
    const response = await apiClient.get<{ data: Categoria[] }>('/v1/backoffice/categorias');
    return response.data;
  },

  createCategoria: async (data: StoreCategoriaRequest) => {
    // We use FormData if there is a file (icone)
    const formData = new FormData();
    formData.append('nome', data.nome);
    if (data.descricao) formData.append('descricao', data.descricao);
    if (data.icone) formData.append('icone', data.icone);
    if (data.activa !== undefined) formData.append('activa', data.activa ? '1' : '0');
    if (data.ordem !== undefined) formData.append('ordem', data.ordem.toString());

    const response = await apiClient.post<{ data: Categoria }>('/v1/backoffice/categorias', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateCategoria: async (id: string, data: UpdateCategoriaRequest) => {
    const formData = new FormData();
    // Using method spoofing for PATCH with FormData in Laravel
    formData.append('_method', 'PATCH');
    if (data.nome) formData.append('nome', data.nome);
    if (data.descricao !== undefined) formData.append('descricao', data.descricao || '');
    if (data.icone) formData.append('icone', data.icone);
    if (data.activa !== undefined) formData.append('activa', data.activa ? '1' : '0');
    if (data.ordem !== undefined) formData.append('ordem', data.ordem.toString());

    const response = await apiClient.post<{ data: Categoria }>(`/v1/backoffice/categorias/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteCategoria: async (id: string) => {
    const response = await apiClient.delete(`/v1/backoffice/categorias/${id}`);
    return response.data;
  },

  createSubcategoria: async (categoriaId: string, data: StoreSubcategoriaRequest) => {
    const response = await apiClient.post<{ data: Subcategoria }>(`/v1/backoffice/categorias/${categoriaId}/subcategorias`, data);
    return response.data;
  },

  updateSubcategoria: async (id: string, data: UpdateSubcategoriaRequest) => {
    const response = await apiClient.patch<{ data: Subcategoria }>(`/v1/backoffice/subcategorias/${id}`, data);
    return response.data;
  },
};
