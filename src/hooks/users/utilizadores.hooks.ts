import { useState, useCallback } from 'react';
import { UtilizadoresService } from '@/service/utilizadores.service';
import {
  Utilizador,
  ListUtilizadoresParams,
  CriarUtilizadorPayload,
  ActualizarUtilizadorPayload,
  UtilizadoresPaginationMeta,
} from '@/shared/types/backoffice/utilizadores.types';
import { AxiosError } from 'axios';

export function useUtilizadores() {
  const [utilizadores, setUtilizadores] = useState<Utilizador[]>([]);
  const [meta, setMeta] = useState<UtilizadoresPaginationMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUtilizadores = useCallback(async (params?: ListUtilizadoresParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await UtilizadoresService.listUtilizadores(params);
      setUtilizadores(response.data || []);
      if (response.meta) {
        setMeta(response.meta);
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Erro ao carregar utilizadores do backoffice.');
    } finally {
      setLoading(false);
    }
  }, []);

  const criarUtilizador = useCallback(async (payload: CriarUtilizadorPayload): Promise<boolean> => {
    setActionLoading(true);
    setError(null);
    try {
      await UtilizadoresService.criarUtilizador(payload);
      return true;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Erro ao criar utilizador.');
      return false;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const actualizarUtilizador = useCallback(async (id: string, payload: ActualizarUtilizadorPayload): Promise<boolean> => {
    setActionLoading(true);
    setError(null);
    try {
      await UtilizadoresService.actualizarUtilizador(id, payload);
      return true;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Erro ao atualizar utilizador.');
      return false;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const eliminarUtilizador = useCallback(async (id: string): Promise<boolean> => {
    setActionLoading(true);
    setError(null);
    try {
      await UtilizadoresService.eliminarUtilizador(id);
      return true;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Erro ao remover utilizador.');
      return false;
    } finally {
      setActionLoading(false);
    }
  }, []);

  return {
    utilizadores,
    meta,
    loading,
    actionLoading,
    error,
    fetchUtilizadores,
    criarUtilizador,
    actualizarUtilizador,
    eliminarUtilizador,
  };
}
