export type SolicitacaoStatus =
  | 'submetida'
  | 'em_analise'
  | 'encaminhada'
  | 'aceite'
  | 'rejeitada'
  | 'em_execucao'
  | 'concluida'
  | 'cancelada'
  | 'em_disputa';

export interface SolicitacaoServico {
  id: string;
  titulo_servico: string;
  descricao_detalhada: string;
  preco_base: number;
  preco_cliente: number;
  modalidade_preco: string;
}

export interface SolicitacaoPrestador {
  id: string;
  nome: string | null;
  foto_perfil_url: string | null;
  avaliacao_media: number | null;
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

export interface Solicitacao {
  id: string;
  cliente_id: string;
  prestador_servico_id: string | null;
  operador_id: string | null;
  status_id: SolicitacaoStatus;
  data_pretendida: string | null;
  hora_pretendida: string | null;
  descricao_cliente: string | null;
  provincia: string | null;
  municipio: string | null;
  morada_execucao: string | null;
  preco_acordado: number | null;
  motivo_rejeicao: string | null;
  aceite_em: string | null;
  iniciado_em: string | null;
  concluido_em: string | null;
  created_at: string;
  updated_at: string;
  servico: SolicitacaoServico | null;
  prestador: SolicitacaoPrestador | null;
  pagamento?: import('./finance.types').Pagamento | null;
  repasse?: import('./finance.types').Repasse | null;
  mensagens?: Mensagem[];
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
  prestador_servico_id: string;
}
