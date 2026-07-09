'use client';

import { useState, useCallback } from 'react';
import { FinanceBackofficeService, CatalogoBackofficeService, PagamentosBackofficeService } from '@/service/backoffice/finance.service';
import { FinancialSummary, Categoria, Repasse } from '@/shared/types/backoffice/finance.types';

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
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao carregar resumo financeiro');
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
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  }, []);

  const criarCategoria = useCallback(async (data: FormData): Promise<boolean> => {
    try {
      await CatalogoBackofficeService.criarCategoria(data);
      await fetchCategorias();
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao criar categoria');
      return false;
    }
  }, [fetchCategorias]);

  const actualizarCategoria = useCallback(async (id: string, data: FormData): Promise<boolean> => {
    try {
      await CatalogoBackofficeService.actualizarCategoria(id, data);
      await fetchCategorias();
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao actualizar categoria');
      return false;
    }
  }, [fetchCategorias]);

  const eliminarCategoria = useCallback(async (id: string): Promise<boolean> => {
    try {
      await CatalogoBackofficeService.eliminarCategoria(id);
      await fetchCategorias();
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao eliminar categoria');
      return false;
    }
  }, [fetchCategorias]);

  const criarSubcategoria = useCallback(async (categoriaId: string, data: { nome: string; descricao?: string }): Promise<boolean> => {
    try {
      await CatalogoBackofficeService.criarSubcategoria(categoriaId, data);
      await fetchCategorias();
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao criar subcategoria');
      return false;
    }
  }, [fetchCategorias]);

  const actualizarSubcategoria = useCallback(async (id: string, data: { nome?: string; descricao?: string }): Promise<boolean> => {
    try {
      await CatalogoBackofficeService.actualizarSubcategoria(id, data);
      await fetchCategorias();
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao actualizar subcategoria');
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
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRepasses = useCallback(async (params?: { status?: string; page?: number }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await FinanceBackofficeService.getRepasses(params);
      setRepasses(response.data || []);
      setMeta(response.meta || null);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao carregar repasses');
    } finally {
      setLoading(false);
    }
  }, []);

  const processarRepasse = useCallback(async (id: string, data: { referencia_repasse: string; iban_destino?: string }): Promise<boolean> => {
    try {
      await FinanceBackofficeService.processarRepasse(id, data);
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao processar repasse');
      return false;
    }
  }, []);

  return { repasses, meta, loading, error, fetchRepasses, processarRepasse };
}

// Pagamentos hooks
export function usePagamentos() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirmarPagamento = useCallback(async (solicitacaoId: string, referencia?: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await PagamentosBackofficeService.confirmarPagamento(solicitacaoId, referencia ? { referencia_externa: referencia } : undefined);
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao confirmar pagamento');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const downloadComprovativo = useCallback(async (pagamentoId: string): Promise<boolean> => {
    try {
      const response = await PagamentosBackofficeService.downloadComprovativo(pagamentoId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `comprovativo_${pagamentoId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao descarregar comprovativo');
      return false;
    }
  }, []);

  return { loading, error, confirmarPagamento, downloadComprovativo };
}
