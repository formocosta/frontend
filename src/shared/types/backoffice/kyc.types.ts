export type DocumentStatus = 'pendente' | 'aprovado' | 'rejeitado';
export type InterviewStatus = 'agendada' | 'realizada' | 'cancelada';
export type InterviewType = 'presencial' | 'video' | 'telefone';

export interface Documento {
  id: string;
  tipo_documento_id?: string;
  status: DocumentStatus;
  motivo_rejeicao?: string;
  caminho_arquivo?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Entrevista {
  id: string;
  prestador_id: string;
  operador_id?: string;
  tipo: InterviewType;
  agendada_para: string; // date string
  realizada_em?: string;
  link_video?: string;
  status: InterviewStatus;
  resultado?: 'aprovado' | 'reprovado' | 'inconclusivo';
  notas?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Candidatura {
  id: string; // prestador_id
  nome_completo: string;
  status: string;
  nota_operador?: string;
  documentos?: Documento[];
  entrevistas?: Entrevista[];
  created_at?: string;
  updated_at?: string;
}

export interface ListCandidaturasRequest {
  status?: string;
  page_size?: number;
}

export interface RejeitarCandidaturaRequest {
  motivo_rejeicao: string;
}

export interface UpdateCandidaturaNotaRequest {
  nota_operador: string;
}

export interface ReviewDocumentoRequest {
  motivo?: string;
}

export interface AgendarEntrevistaRequest {
  tipo: InterviewType;
  agendada_para: string;
  link_video?: string;
}

export interface AtualizarEntrevistaRequest {
  status?: InterviewStatus;
  resultado?: 'aprovado' | 'reprovado' | 'inconclusivo';
  notas?: string;
  realizada_em?: string;
}
