'use client';
 
import { useState, useCallback } from 'react';
import { AxiosError } from 'axios';
import { UsersBackofficeService } from '@/service/backoffice/users.service';
import {
  Cliente,
  ListClientesParams,
  PaginatedResponse
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
