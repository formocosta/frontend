'use client';

import { useState, useCallback } from 'react';
import { RequestsBackofficeService } from '@/service/backoffice/requests.service';
import {
  Solicitacao,
  ListSolicitacoesParams,
  PaginatedResponse,
} from '@/shared/types/backoffice/requests.types';

export interface UseSolicitacoesReturn {
  solicitacoes: Solicitacao[];
  meta: { total: number; page: number; limit: number } | null;
  loading: boolean;
  error: string | null;
  fetchSolicitacoes: (params?: ListSolicitacoesParams) => Promise<void>;
}

export function useSolicitacoes(): UseSolicitacoesReturn {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [meta, setMeta] = useState<{ total: number; page: number; limit: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSolicitacoes = useCallback(async (params?: ListSolicitacoesParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await RequestsBackofficeService.getSolicitacoes(params);
      setSolicitacoes(response.data || []);
      setMeta(response.meta || null);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao carregar solicitações');
    } finally {
      setLoading(false);
    }
  }, []);

  return { solicitacoes, meta, loading, error, fetchSolicitacoes };
}

export interface UseSolicitacaoDetailReturn {
  solicitacao: Solicitacao | null;
  loading: boolean;
  error: string | null;
  fetchSolicitacao: (id: string) => Promise<void>;
  encaminhar: (id: string, prestadorServicoId: string) => Promise<boolean>;
  fetchMensagens: (id: string) => Promise<void>;
}

export function useSolicitacaoDetail(): UseSolicitacaoDetailReturn {
  const [solicitacao, setSolicitacao] = useState<Solicitacao | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSolicitacao = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await RequestsBackofficeService.getSolicitacaoById(id);
      setSolicitacao(response.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao carregar solicitação');
    } finally {
      setLoading(false);
    }
  }, []);

  const encaminhar = useCallback(async (id: string, prestadorServicoId: string): Promise<boolean> => {
    try {
      await RequestsBackofficeService.encaminharSolicitacao(id, {
        prestador_servico_id: prestadorServicoId,
      });
      await fetchSolicitacao(id);
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao encaminhar solicitação');
      return false;
    }
  }, [fetchSolicitacao]);

  const fetchMensagens = useCallback(async (id: string) => {
    try {
      const response = await RequestsBackofficeService.getMensagens(id);
      setSolicitacao((prev) => prev ? { ...prev, mensagens: response.data || [] } : null);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao carregar mensagens');
    }
  }, []);

  return { solicitacao, loading, error, fetchSolicitacao, encaminhar, fetchMensagens };
}
