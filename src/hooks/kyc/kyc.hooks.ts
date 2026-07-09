'use client';

import { useState, useCallback } from 'react';
import { KycBackofficeService } from '@/service/backoffice/kyc.service';
import {
  Candidatura,
  Entrevista,
  ListCandidaturasRequest,
  RejeitarCandidaturaRequest,
  UpdateCandidaturaNotaRequest,
  AgendarEntrevistaRequest,
  AtualizarEntrevistaRequest,
} from '@/shared/types/backoffice/kyc.types';

export interface UseCandidaturasReturn {
  candidaturas: Candidatura[];
  loading: boolean;
  error: string | null;
  fetchCandidaturas: (params?: ListCandidaturasRequest) => Promise<void>;
}

export function useCandidaturas(): UseCandidaturasReturn {
  const [candidaturas, setCandidaturas] = useState<Candidatura[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCandidaturas = useCallback(async (params?: ListCandidaturasRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await KycBackofficeService.getCandidaturas(params);
      setCandidaturas(response.data || []);
    } catch (err) {
      setError((err as any)?.response?.data?.message || 'Erro ao carregar candidaturas');
    } finally {
      setLoading(false);
    }
  }, []);

  return { candidaturas, loading, error, fetchCandidaturas };
}

export interface UseCandidaturaDetailReturn {
  candidatura: Candidatura | null;
  loading: boolean;
  error: string | null;
  fetchCandidatura: (id: string) => Promise<void>;
  aprovar: (id: string) => Promise<boolean>;
  rejeitar: (id: string, data: RejeitarCandidaturaRequest) => Promise<boolean>;
  resubmeter: (id: string) => Promise<boolean>;
  atualizarNotas: (id: string, data: UpdateCandidaturaNotaRequest) => Promise<boolean>;
  aprovarDocumento: (documentoId: string) => Promise<boolean>;
  rejeitarDocumento: (documentoId: string, motivo: string) => Promise<boolean>;
  agendarEntrevista: (id: string, data: AgendarEntrevistaRequest) => Promise<boolean>;
  listarEntrevistas: (id: string) => Promise<Entrevista[]>;
  atualizarEntrevista: (entrevistaId: string, data: AtualizarEntrevistaRequest) => Promise<boolean>;
  downloadDocumento: (documentoId: string) => Promise<boolean>;
}

export function useCandidaturaDetail(): UseCandidaturaDetailReturn {
  const [candidatura, setCandidatura] = useState<Candidatura | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCandidatura = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await KycBackofficeService.getCandidaturaById(id);
      setCandidatura(response.data);
    } catch (err) {
      setError((err as any)?.response?.data?.message || 'Erro ao carregar candidatura');
    } finally {
      setLoading(false);
    }
  }, []);

  const aprovar = useCallback(async (id: string): Promise<boolean> => {
    try {
      await KycBackofficeService.aprovarCandidatura(id);
      await fetchCandidatura(id);
      return true;
    } catch (err) {
      setError((err as any)?.response?.data?.message || 'Erro ao aprovar candidatura');
      return false;
    }
  }, [fetchCandidatura]);

  const rejeitar = useCallback(async (id: string, data: RejeitarCandidaturaRequest): Promise<boolean> => {
    try {
      await KycBackofficeService.rejeitarCandidatura(id, data);
      await fetchCandidatura(id);
      return true;
    } catch (err) {
      setError((err as any)?.response?.data?.message || 'Erro ao rejeitar candidatura');
      return false;
    }
  }, [fetchCandidatura]);

  const resubmeter = useCallback(async (id: string): Promise<boolean> => {
    try {
      await KycBackofficeService.resubmeterCandidatura(id);
      await fetchCandidatura(id);
      return true;
    } catch (err) {
      setError((err as any)?.response?.data?.message || 'Erro ao ressubmeter candidatura');
      return false;
    }
  }, [fetchCandidatura]);

  const atualizarNotas = useCallback(async (id: string, data: UpdateCandidaturaNotaRequest): Promise<boolean> => {
    try {
      await KycBackofficeService.atualizarNotas(id, data);
      await fetchCandidatura(id);
      return true;
    } catch (err) {
      setError((err as any)?.response?.data?.message || 'Erro ao actualizar notas');
      return false;
    }
  }, [fetchCandidatura]);

  const aprovarDocumento = useCallback(async (documentoId: string): Promise<boolean> => {
    try {
      await KycBackofficeService.aprovarDocumento(documentoId);
      if (candidatura) {
        await fetchCandidatura(candidatura.id);
      }
      return true;
    } catch (err) {
      setError((err as any)?.response?.data?.message || 'Erro ao aprovar documento');
      return false;
    }
  }, [candidatura, fetchCandidatura]);

  const rejeitarDocumento = useCallback(async (documentoId: string, motivo: string): Promise<boolean> => {
    try {
      await KycBackofficeService.rejeitarDocumento(documentoId, { motivo });
      if (candidatura) {
        await fetchCandidatura(candidatura.id);
      }
      return true;
    } catch (err) {
      setError((err as any)?.response?.data?.message || 'Erro ao rejeitar documento');
      return false;
    }
  }, [candidatura, fetchCandidatura]);

  const agendarEntrevista = useCallback(async (id: string, data: AgendarEntrevistaRequest): Promise<boolean> => {
    try {
      await KycBackofficeService.agendarEntrevista(id, data);
      await fetchCandidatura(id);
      return true;
    } catch (err) {
      setError((err as any)?.response?.data?.message || 'Erro ao agendar entrevista');
      return false;
    }
  }, [fetchCandidatura]);

  const listarEntrevistas = useCallback(async (id: string): Promise<Entrevista[]> => {
    try {
      const response = await KycBackofficeService.listarEntrevistas(id);
      return response.data || [];
    } catch (err) {
      setError((err as any)?.response?.data?.message || 'Erro ao listar entrevistas');
      return [];
    }
  }, []);

  const atualizarEntrevista = useCallback(async (entrevistaId: string, data: AtualizarEntrevistaRequest): Promise<boolean> => {
    try {
      await KycBackofficeService.atualizarEntrevista(entrevistaId, data);
      if (candidatura) {
        await fetchCandidatura(candidatura.id);
      }
      return true;
    } catch (err) {
      setError((err as any)?.response?.data?.message || 'Erro ao actualizar entrevista');
      return false;
    }
  }, [candidatura, fetchCandidatura]);

  const downloadDocumento = useCallback(async (documentoId: string): Promise<boolean> => {
    try {
      const response = await KycBackofficeService.downloadDocumento(documentoId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      const contentDisposition = response.headers['content-disposition'];
      let filename = `documento_${documentoId}`;
      if (contentDisposition) {
        const matches = /filename="?([^"]+)"?/.exec(contentDisposition);
        if (matches && matches[1]) {
          filename = matches[1];
        }
      }

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      return true;
    } catch (err) {
      setError((err as any)?.response?.data?.message || 'Erro ao descarregar documento');
      return false;
    }
  }, []);

  return {
    candidatura,
    loading,
    error,
    fetchCandidatura,
    aprovar,
    rejeitar,
    resubmeter,
    atualizarNotas,
    aprovarDocumento,
    rejeitarDocumento,
    agendarEntrevista,
    listarEntrevistas,
    atualizarEntrevista,
    downloadDocumento,
  };
}
