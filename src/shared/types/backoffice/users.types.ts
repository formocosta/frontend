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
 
export interface Documento {
  id: string;
  tipo_documento: string;
  status: string;
  url_arquivo: string;
}
 
export interface Entrevista {
  id: string;
  tipo: string;
  status: string;
  agendada_para: string;
  realizada_em: string | null;
  resultado: string | null;
}
 
export interface Servico {
  id: string;
  preco_hora: number | string;
  nome: string;
}
 
export interface PrestadorProfile {
  tipo_prestador: string | null;
  nome_comercial: string | null;
  nif: string | null;
  iban: string | null;
  provincia: string | null;
  municipio: string | null;
  bairro: string | null;
  morada_detalhe: string | null;
  status_verificacao: string | null;
  status_perfil: string | null;
  avaliacao_media: string | number;
  total_servicos_concluidos: number;
  bio: string | null;
  documentos?: Documento[] | null;
  entrevistas?: Entrevista[] | null;
  servicos?: Servico[] | null;
}
 
export interface Prestador {
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
  prestador?: PrestadorProfile | null;
}
 
export interface ListClientesParams {
  search?: string;
  status?: string;
  page?: number;
  page_size?: number;
}
 
export interface ListPrestadoresParams {
  search?: string;
  status?: string;
  status_verificacao?: string;
  status_perfil?: string;
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
