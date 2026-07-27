export interface ClienteProfile {
  data_nascimento: string | null;
  genero: string | null;
  nif: string | null;
  tipo_cliente: string | null;
  provincia: string | null;
  municipio: string | null;
  bairro: string | null;
  morada_detalhe: string | null;
  total_servicos: number;
}
 
export interface Cliente {
  id: string;
  nome_completo: string;
  email: string;
  telefone: string;
  foto_perfil_url: string | null;
  status: string;
  role: string;
  email_verified_at: string | null;
  telefone_verificado_at: string | null;
  created_at: string;
  updated_at: string;
  cliente?: ClienteProfile | null;
}
 
export interface ListClientesParams {
  search?: string;
  status?: string;
  page?: number;
  page_size?: number;
}
 
export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}
