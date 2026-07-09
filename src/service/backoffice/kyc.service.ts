import apiClient from '../../shared/utils/api.utils';
import {
  Candidatura,
  Entrevista,
  ListCandidaturasRequest,
  RejeitarCandidaturaRequest,
  UpdateCandidaturaNotaRequest,
  ReviewDocumentoRequest,
  AgendarEntrevistaRequest,
  AtualizarEntrevistaRequest
} from '../../shared/types/backoffice/kyc.types';

export const KycBackofficeService = {
  getCandidaturas: async (params?: ListCandidaturasRequest) => {
    const response = await apiClient.get<{ data: Candidatura[] }>('/v1/backoffice/kyc/candidaturas', { params });
    return response.data;
  },

  getCandidaturaById: async (prestadorId: string) => {
    const response = await apiClient.get<{ data: Candidatura }>(`/v1/backoffice/kyc/candidaturas/${prestadorId}`);
    return response.data;
  },

  aprovarCandidatura: async (prestadorId: string) => {
    const response = await apiClient.post(`/v1/backoffice/kyc/candidaturas/${prestadorId}/aprovar`);
    return response.data;
  },

  rejeitarCandidatura: async (prestadorId: string, data: RejeitarCandidaturaRequest) => {
    const response = await apiClient.post(`/v1/backoffice/kyc/candidaturas/${prestadorId}/rejeitar`, data);
    return response.data;
  },

  resubmeterCandidatura: async (prestadorId: string) => {
    const response = await apiClient.post(`/v1/backoffice/kyc/candidaturas/${prestadorId}/resubmeter`);
    return response.data;
  },

  atualizarNotas: async (prestadorId: string, data: UpdateCandidaturaNotaRequest) => {
    const response = await apiClient.patch(`/v1/backoffice/kyc/candidaturas/${prestadorId}/notas`, data);
    return response.data;
  },

  aprovarDocumento: async (documentoId: string) => {
    const response = await apiClient.post(`/v1/backoffice/kyc/documentos/${documentoId}/aprovar`);
    return response.data;
  },

  rejeitarDocumento: async (documentoId: string, data: ReviewDocumentoRequest) => {
    const response = await apiClient.post(`/v1/backoffice/kyc/documentos/${documentoId}/rejeitar`, data);
    return response.data;
  },

  agendarEntrevista: async (prestadorId: string, data: AgendarEntrevistaRequest) => {
    const response = await apiClient.post<{ data: Entrevista }>(`/v1/backoffice/kyc/candidaturas/${prestadorId}/entrevistas`, data);
    return response.data;
  },

  listarEntrevistas: async (prestadorId: string) => {
    const response = await apiClient.get<{ data: Entrevista[] }>(`/v1/backoffice/kyc/candidaturas/${prestadorId}/entrevistas`);
    return response.data;
  },

  atualizarEntrevista: async (entrevistaId: string, data: AtualizarEntrevistaRequest) => {
    const response = await apiClient.patch<{ data: Entrevista }>(`/v1/backoffice/kyc/entrevistas/${entrevistaId}`, data);
    return response.data;
  },

  downloadDocumento: async (documentoId: string) => {
    const response = await apiClient.get(`/v1/prestador/kyc/documentos/${documentoId}`, {
      responseType: 'blob',
    });
    return response;
  },
};
