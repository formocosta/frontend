'use client';

import { useState, useCallback } from 'react';
import { AxiosError } from 'axios';
import { FinanceBackofficeService, CatalogoBackofficeService, PagamentosBackofficeService } from '@/service/backoffice/finance.service';
import { FinancialSummary, Categoria, Repasse, Pagamento, PagamentosStats, PagamentosMeta } from '@/shared/types/backoffice/finance.types';

// Dashboard hook
export function useFinanceiro() {
  const [resumo, setResumo] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResumo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await FinanceBackofficeService.getResumoFinanceiro();
      setResumo(response.data);
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Erro ao carregar resumo financeiro');
    } finally {
      setLoading(false);
    }
  }, []);

  return { resumo, loading, error, fetchResumo };
}

// Catálogo hooks
export function useCatalogo() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategorias = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await CatalogoBackofficeService.getCategorias();
      setCategorias(response.data || []);
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  }, []);

  const criarCategoria = useCallback(async (data: FormData): Promise<boolean> => {
    try {
      await CatalogoBackofficeService.criarCategoria(data);
      await fetchCategorias();
      return true;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Erro ao criar categoria');
      return false;
    }
  }, [fetchCategorias]);

  const actualizarCategoria = useCallback(async (id: string, data: FormData): Promise<boolean> => {
    try {
      await CatalogoBackofficeService.actualizarCategoria(id, data);
      await fetchCategorias();
      return true;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Erro ao actualizar categoria');
      return false;
    }
  }, [fetchCategorias]);

  const eliminarCategoria = useCallback(async (id: string): Promise<boolean> => {
    try {
      await CatalogoBackofficeService.eliminarCategoria(id);
      await fetchCategorias();
      return true;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Erro ao eliminar categoria');
      return false;
    }
  }, [fetchCategorias]);

  const criarSubcategoria = useCallback(async (categoriaId: string, data: { nome: string; descricao?: string }): Promise<boolean> => {
    try {
      await CatalogoBackofficeService.criarSubcategoria(categoriaId, data);
      await fetchCategorias();
      return true;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Erro ao criar subcategoria');
      return false;
    }
  }, [fetchCategorias]);

  const actualizarSubcategoria = useCallback(async (id: string, data: { nome?: string; descricao?: string }): Promise<boolean> => {
    try {
      await CatalogoBackofficeService.actualizarSubcategoria(id, data);
      await fetchCategorias();
      return true;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Erro ao actualizar subcategoria');
      return false;
    }
  }, [fetchCategorias]);

  return {
    categorias, loading, error, fetchCategorias,
    criarCategoria, actualizarCategoria, eliminarCategoria,
    criarSubcategoria, actualizarSubcategoria,
  };
}

// Repasses hooks
export function useRepasses() {
  const [repasses, setRepasses] = useState<Repasse[]>([]);
  const [meta, setMeta] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRepasses = useCallback(async (params?: { status?: string; page?: number }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await FinanceBackofficeService.getRepasses(params);
      setRepasses(response.data || []);
      setMeta(response.meta || null);
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Erro ao carregar repasses');
    } finally {
      setLoading(false);
    }
  }, []);

  const processarRepasse = useCallback(async (id: string, data: { referencia_repasse: string; iban_destino?: string }): Promise<boolean> => {
    try {
      await FinanceBackofficeService.processarRepasse(id, data);
      return true;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Erro ao processar repasse');
      return false;
    }
  }, []);

  return { repasses, meta, loading, error, fetchRepasses, processarRepasse };
}

// Pagamentos hooks
export function usePagamentos() {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [stats, setStats] = useState<PagamentosStats | null>(null);
  const [meta, setMeta] = useState<PagamentosMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPagamentos = useCallback(async (params?: { search?: string; status?: string; metodo?: string; page?: number }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await PagamentosBackofficeService.getPagamentos(params);
      setPagamentos(response.data || []);
      setStats(response.stats || null);
      setMeta(response.meta || null);
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Erro ao carregar pagamentos');
    } finally {
      setLoading(false);
    }
  }, []);

  const confirmarPagamento = useCallback(async (solicitacaoId: string, referencia?: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await PagamentosBackofficeService.confirmarPagamento(solicitacaoId, referencia ? { referencia_externa: referencia } : undefined);
      return true;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Erro ao confirmar pagamento');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const downloadComprovativo = useCallback(async (pagamentoId: string): Promise<boolean> => {
    try {
      const response = await PagamentosBackofficeService.downloadComprovativo(pagamentoId);
      const contentTypeRaw = response.headers?.['content-type'] || 'application/pdf';
      const contentType = String(contentTypeRaw);
      const url = window.URL.createObjectURL(new Blob([response.data], { type: contentType }));
      const link = document.createElement('a');
      link.href = url;
      
      let filename = `comprovativo_${pagamentoId}`;
      if (contentType.includes('pdf')) filename += '.pdf';
      else if (contentType.includes('png')) filename += '.png';
      else if (contentType.includes('jpeg') || contentType.includes('jpg')) filename += '.jpg';
      else filename += '.pdf';

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      return true;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Erro ao descarregar comprovativo');
      return false;
    }
  }, []);

  return { pagamentos, stats, meta, loading, error, fetchPagamentos, confirmarPagamento, downloadComprovativo };
}
