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
  cliente_id: string;
  valor_total: string;
  valor_comissao: string;
  valor_prestador: string;
  metodo_pagamento: string;
  referencia_externa: string | null;
  status: string;
  confirmado_em: string | null;
  criado_em: string;
  atualizado_em: string;
}

export interface Repasse {
  id: string;
  pagamento_id: string;
  prestador_id: string;
  valor_repasse: string;
  metodo_id: string;
  iban_destino: string | null;
  referencia_repasse: string | null;
  status: string;
  operador_id: string | null;
  pago_em: string | null;
  criado_em: string;
  atualizado_em: string;
}

export interface ProcessarRepasseRequest {
  referencia_repasse: string;
  iban_destino?: string;
}

export interface ConfirmarPagamentoRequest {
  referencia_externa?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  links?: any;
  meta?: any;
}
