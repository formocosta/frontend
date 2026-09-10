export interface Utilizador {
  id: string;
  nome_completo: string;
  email: string;
  telefone: string;
  role: 'admin' | 'operador';
  status: 'activo' | 'inactivo' | 'suspenso';
  email_verified_at?: string | null;
  telefone_verificado_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ListUtilizadoresParams {
  page?: number;
  page_size?: number;
  search?: string;
  role?: string;
  status?: string;
}

export interface CriarUtilizadorPayload {
  nome_completo: string;
  email: string;
  telefone: string;
  password: string;
  role: 'admin' | 'operador';
  status?: 'activo' | 'inactivo' | 'suspenso';
}

export interface ActualizarUtilizadorPayload {
  nome_completo?: string;
  email?: string;
  telefone?: string;
  password?: string;
  role?: 'admin' | 'operador';
  status?: 'activo' | 'inactivo' | 'suspenso';
}

export interface UtilizadoresPaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}
