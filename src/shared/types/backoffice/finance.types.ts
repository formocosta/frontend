import { PaginatedResponse } from './requests.types';

export type RepasseStatus = 'pendente' | 'pago' | 'cancelado';

export interface Repasse {
  id: string;
  prestador_id: string;
  pagamento_id: string;
  valor_repasse: number;
  status_id: RepasseStatus;
  referencia_repasse?: string | null;
  iban_destino?: string | null;
  data_processamento?: string | null;
  operador_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ResumoFinanceiro {
  receitas_totais: number;
  comissoes_totais: number;
  valor_repasses_pendentes: number;
  quantidade_repasses_pendentes: number;
}

export interface ListRepassesParams {
  status?: string;
  page?: number;
}

export interface ProcessarRepasseRequest {
  referencia_repasse: string;
  iban_destino?: string;
}
