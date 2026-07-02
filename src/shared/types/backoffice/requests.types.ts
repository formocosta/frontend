export type SolicitacaoStatus = 'pendente' | 'em_andamento' | 'concluida' | 'cancelada' | 'rejeitada';

export interface Solicitacao {
  id: string;
  cliente_id: string;
  prestador_servico_id?: string | null;
  categoria_id?: string;
  subcategoria_id?: string;
  titulo?: string;
  descricao?: string;
  status: SolicitacaoStatus;
  preco_estimado?: number;
  data_agendada?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

export interface Mensagem {
  id: string;
  solicitacao_id: string;
  sender_id: string;
  conteudo: string;
  tipo?: string;
  lida?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ListSolicitacoesParams {
  status?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface EncaminharSolicitacaoRequest {
  prestador_servico_id?: string | null;
}
