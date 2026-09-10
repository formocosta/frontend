export interface FinancialSummary {
  receitas_totais: number;
  comissoes_totais: number;
  valor_repasses_pendentes: number;
  quantidade_repasses_pendentes: number;
}

export interface Categoria {
  id: string;
  nome: string;
  descricao: string | null;
  icone_url: string | null;
  activa: boolean;
  ordem: number;
  subcategorias: Subcategoria[];
  created_at: string;
  updated_at: string;
}

export interface Subcategoria {
  id: string;
  categoria_id: string;
  nome: string;
  descricao: string | null;
  activa: boolean;
  created_at: string;
  updated_at: string;
}

export interface Pagamento {
  id: string;
  solicitacao_id: string;
  solicitacao?: {
    id: string;
    titulo: string;
    estado: string;
  } | null;
  cliente_id: string;
  cliente?: {
    id: string;
    nome: string;
    email: string;
    telefone: string;
  } | null;
  valor_total: number | string;
  valor_comissao: number | string;
  valor_prestador: number | string;
  metodo_pagamento: string;
  referencia_externa: string | null;
  comprovativo_path?: string | null;
  comprovativo_url?: string | null;
  status: string;
  confirmado_em: string | null;
  criado_em: string;
  atualizado_em?: string;
}

export interface PagamentosStats {
  total_transacionado: number;
  total_pagamentos: number;
  total_pendentes: number;
  total_confirmados: number;
}

export interface Repasse {
  id: string;
  pagamento_id: string;
  pagamento?: {
    id: string;
    solicitacao_id: string;
    valor_total: number;
    status: string;
  } | null;
  prestador_id: string;
  prestador?: {
    id: string;
    nome: string;
    email: string;
    telefone: string;
  } | null;
  valor_repasse: string | number;
  metodo_id: string;
  iban_destino: string | null;
  referencia_repasse: string | null;
  status: string;
  operador_id: string | null;
  pago_em: string | null;
  criado_em: string;
  atualizado_em?: string;
}

export interface ProcessarRepasseRequest {
  referencia_repasse: string;
  iban_destino?: string;
}

export interface ConfirmarPagamentoRequest {
  referencia_externa?: string;
}

export interface PagamentosMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  links?: Record<string, unknown> | null;
  meta?: PagamentosMeta | Record<string, any> | null;
  stats?: PagamentosStats;
}
