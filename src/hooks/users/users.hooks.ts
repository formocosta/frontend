'use client';
 
import { useState, useCallback } from 'react';
import { AxiosError } from 'axios';
import { UsersBackofficeService } from '@/service/backoffice/users.service';
import {
  Cliente,
  ListClientesParams,
  PrestadorUser,
  ListPrestadoresParams,
  PaginatedResponse,
  RejeitarPrestadorCandidaturaRequest
} from '@/shared/types/backoffice/users.types';
 
export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [meta, setMeta] = useState<PaginatedResponse<Cliente>['meta'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
 
  const fetchClientes = useCallback(async (params?: ListClientesParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await UsersBackofficeService.getClientes(params);
      setClientes(response.data || []);
      setMeta(response.meta || null);
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  }, []);
 
  return { clientes, meta, loading, error, fetchClientes };
}
 
export function useClienteDetail() {
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
 
  const fetchCliente = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await UsersBackofficeService.getClienteById(id);
      setCliente(response.data || null);
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Erro ao carregar detalhes do cliente');
    } finally {
      setLoading(false);
    }
  }, []);
 
  return { cliente, loading, error, fetchCliente };
}
 
export function usePrestadores() {
  const [prestadores, setPrestadores] = useState<PrestadorUser[]>([]);
  const [meta, setMeta] = useState<PaginatedResponse<PrestadorUser>['meta'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrestadores = useCallback(async (params?: ListPrestadoresParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await UsersBackofficeService.getPrestadores(params);
      setPrestadores(response.data || []);
      setMeta(response.meta || null);
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Erro ao carregar prestadores');
    } finally {
      setLoading(false);
    }
  }, []);

  return { prestadores, meta, loading, error, fetchPrestadores };
}

export function usePrestadorDetail() {
  const [prestadorUser, setPrestadorUser] = useState<PrestadorUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrestador = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await UsersBackofficeService.getPrestadorById(id);
      setPrestadorUser(response.data || null);
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Erro ao carregar detalhes do prestador');
    } finally {
      setLoading(false);
    }
  }, []);

  return { prestadorUser, loading, error, fetchPrestador };
}

export function usePrestadorDocumentos() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
 
  const obterDocumentoBlob = useCallback(async (documentoId: string): Promise<{ url: string; type: string } | null> => {
    setLoading(documentoId);
    setError(null);
    try {
      const { KycBackofficeService } = await import('@/service/backoffice/kyc.service');
      const response = await KycBackofficeService.downloadDocumento(documentoId);
      const contentTypeRaw = response.headers['content-type'] || 'application/octet-stream';
      const contentType = String(contentTypeRaw);
      const url = window.URL.createObjectURL(new Blob([response.data], { type: contentType }));
      return { url, type: contentType };
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Erro ao carregar documento');
      return null;
    } finally {
      setLoading(null);
    }
  }, []);
 
  return { loading, error, obterDocumentoBlob };
}

export interface UsePrestadorCandidaturaActionsReturn {
  aprovarCandidatura: (prestadorId: string) => Promise<boolean>;
  rejeitarCandidatura: (prestadorId: string, data: RejeitarPrestadorCandidaturaRequest) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export function usePrestadorCandidaturaActions(): UsePrestadorCandidaturaActionsReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const aprovarCandidatura = useCallback(async (prestadorId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await UsersBackofficeService.aprovarPrestadorCandidatura(prestadorId);
      return true;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string; errors?: Record<string, string[]> }>;
      let errorMessage = axiosError.response?.data?.message || 'Erro ao aprovar candidatura do prestador';
      if (axiosError.response?.data?.errors) {
        const firstError = Object.values(axiosError.response.data.errors)[0]?.[0];
        if (firstError) {
          errorMessage = firstError;
        }
      }
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const rejeitarCandidatura = useCallback(async (prestadorId: string, data: RejeitarPrestadorCandidaturaRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await UsersBackofficeService.rejeitarPrestadorCandidatura(prestadorId, data);
      return true;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string; errors?: Record<string, string[]> }>;
      let errorMessage = axiosError.response?.data?.message || 'Erro ao rejeitar candidatura do prestador';
      if (axiosError.response?.data?.errors) {
        const firstError = Object.values(axiosError.response.data.errors)[0]?.[0];
        if (firstError) {
          errorMessage = firstError;
        }
      }
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { aprovarCandidatura, rejeitarCandidatura, loading, error };
}
