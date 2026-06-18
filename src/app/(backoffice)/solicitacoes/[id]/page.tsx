'use client';

import { use, useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft, AlertTriangle, RotateCw, Send, X,
  CheckCircle2, XCircle, Clock, User, Users, CreditCard,
  Activity, MessageSquare, Loader, MapPin, FileText,
  Tag, Calendar, Info, Shield, AlertOctagon, CheckCheck,
  Paperclip, ExternalLink, Check, ChevronDown, Search,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────

type StatusSolicitacao =
  | 'submetida' | 'em_analise' | 'encaminhada'
  | 'em_execucao' | 'concluida' | 'cancelada';

type StatusPagamento = 'pendente' | 'pago' | 'reembolsado' | 'cancelado';
type StatusRepasse   = 'pendente' | 'processado' | 'cancelado';
type PapelMensagem   = 'operador' | 'cliente' | 'prestador' | 'sistema';
type TipoAuditoria   = 'criacao' | 'status' | 'mensagem' | 'encaminhamento' | 'disputa' | 'encerramento' | 'pagamento';

interface Prestador { id: string; nome: string }

interface TimelineItem {
  id: string; status: string; label: string;
  timestamp: string; operador?: string;
}

interface Mensagem {
  id: string; autor: string; papel: PapelMensagem;
  conteudo: string; timestamp: string;
}

interface AuditoriaItem {
  id: string; timestamp: string; utilizador: string;
  tipo: TipoAuditoria; descricao: string;
}

interface SolicitacaoDetalhe {
  id: string;
  status: StatusSolicitacao;
  servico: string;
  categoria: string;
  descricao: string;
  localizacao: string;
  observacoes: string;
  dataSubmissao: string;
  dataPretendida: string;
  dataUltimaAtualizacao: string;
  prestadorNome: string | null;
  operadorResponsavel: string | null;
  cliente: { nome: string; email: string; telefone: string };
  prestadorInfo: { nome: string; email: string; telefone: string; estadoCandidatura: string } | null;
  timeline: TimelineItem[];
  mensagens: Mensagem[];
  pagamento: { id: string; status: StatusPagamento; valor: number } | null;
  repasse:   { id: string; status: StatusRepasse;   valor: number } | null;
  auditoria: AuditoriaItem[];
}

// ── Config ─────────────────────────────────────────────────

const STATUS_CONFIG: Record<StatusSolicitacao, { label: string; classes: string }> = {
  submetida:   { label: 'Submetida',   classes: 'bg-amber-50 text-amber-700 border border-amber-100' },
  em_analise:  { label: 'Em Análise',  classes: 'bg-blue-50 text-blue-700 border border-blue-100' },
  encaminhada: { label: 'Encaminhada', classes: 'bg-violet-50 text-violet-700 border border-violet-100' },
  em_execucao: { label: 'Em Execução', classes: 'bg-indigo-50 text-indigo-700 border border-indigo-100' },
  concluida:   { label: 'Concluída',   classes: 'bg-emerald-50 text-emerald-700 border border-emerald-100' },
  cancelada:   { label: 'Cancelada',   classes: 'bg-red-50 text-red-600 border border-red-100' },
};

const PAGAMENTO_CONFIG: Record<StatusPagamento, { label: string; classes: string }> = {
  pendente:    { label: 'Pendente',    classes: 'bg-amber-50 text-amber-700 border border-amber-100' },
  pago:        { label: 'Pago',        classes: 'bg-emerald-50 text-emerald-700 border border-emerald-100' },
  reembolsado: { label: 'Reembolsado', classes: 'bg-blue-50 text-blue-700 border border-blue-100' },
  cancelado:   { label: 'Cancelado',   classes: 'bg-red-50 text-red-600 border border-red-100' },
};

const REPASSE_CONFIG: Record<StatusRepasse, { label: string; classes: string }> = {
  pendente:   { label: 'Pendente',   classes: 'bg-amber-50 text-amber-700 border border-amber-100' },
  processado: { label: 'Processado', classes: 'bg-emerald-50 text-emerald-700 border border-emerald-100' },
  cancelado:  { label: 'Cancelado',  classes: 'bg-red-50 text-red-600 border border-red-100' },
};

const TIMELINE_DOT: Record<string, string> = {
  submetida:   'bg-amber-400',
  em_analise:  'bg-blue-400',
  encaminhada: 'bg-violet-500',
  aceite:      'bg-indigo-400',
  em_execucao: 'bg-indigo-500',
  concluida:   'bg-emerald-500',
  cancelada:   'bg-red-500',
  em_disputa:  'bg-orange-500',
  fechada:     'bg-gray-400',
};

const AUDITORIA_DOT: Record<TipoAuditoria, string> = {
  criacao:        'bg-emerald-500',
  status:         'bg-blue-400',
  mensagem:       'bg-gray-400',
  encaminhamento: 'bg-violet-500',
  disputa:        'bg-orange-500',
  encerramento:   'bg-gray-600',
  pagamento:      'bg-indigo-500',
};

const CAN_ENCAMINHAR: StatusSolicitacao[] = ['submetida', 'em_analise'];
const CAN_CANCELAR:   StatusSolicitacao[] = ['submetida', 'em_analise', 'encaminhada'];
const CAN_DISPUTA:    StatusSolicitacao[] = ['em_execucao', 'concluida'];
const CAN_FECHAR:     StatusSolicitacao[] = ['concluida'];

const MOCK_PRESTADORES: Prestador[] = [
  { id: 'PR-01', nome: 'João Carlos Teles' },
  { id: 'PR-02', nome: 'Maria Conceição Neto' },
  { id: 'PR-03', nome: 'António Ferreira Silva' },
  { id: 'PR-04', nome: 'Paulo Eduardo Costa' },
  { id: 'PR-05', nome: 'Catarina Isabel Lopes' },
  { id: 'PR-06', nome: 'Rui Manuel Santos' },
  { id: 'PR-07', nome: 'Filipe Alberto Dias' },
  { id: 'PR-08', nome: 'Sandra Maria Costa' },
  { id: 'PR-09', nome: 'Nelson Augusto Pires' },
  { id: 'PR-10', nome: 'Vanessa Sofia Lima' },
];

// ── Mock data builder ──────────────────────────────────────

const BASE_DATA: Record<string, {
  status: StatusSolicitacao; servico: string; categoria: string;
  clienteNome: string; prestador: string | null; operador: string | null;
  dataPretendida: string; localizacao: string;
}> = {
  'SS-001': { status: 'submetida',   servico: 'Limpeza geral de apartamento',      categoria: 'Limpeza',      clienteNome: 'Eduardo Filipe Neto',     prestador: null,                   operador: null,              dataPretendida: '2026-06-20', localizacao: 'Bairro Rangel, Luanda' },
  'SS-002': { status: 'submetida',   servico: 'Reparação de canalização',           categoria: 'Canalização',  clienteNome: 'Rosa Maria Carvalho',     prestador: null,                   operador: null,              dataPretendida: '2026-06-21', localizacao: 'Boavista, Benguela' },
  'SS-003': { status: 'submetida',   servico: 'Instalação de tomadas eléctricas',   categoria: 'Eletricidade', clienteNome: 'Simão Augusto Pinto',     prestador: null,                   operador: null,              dataPretendida: '2026-06-22', localizacao: 'Miramar, Luanda' },
  'SS-004': { status: 'submetida',   servico: 'Poda e manutenção de jardim',        categoria: 'Jardinagem',   clienteNome: 'Bela Fernanda Gomes',     prestador: null,                   operador: null,              dataPretendida: '2026-06-23', localizacao: 'Lubango, Huíla' },
  'SS-005': { status: 'submetida',   servico: 'Montagem de móveis',                 categoria: 'Outros',       clienteNome: 'Custódio Albano Sousa',   prestador: null,                   operador: null,              dataPretendida: '2026-06-24', localizacao: 'Huambo Centro' },
  'SS-006': { status: 'submetida',   servico: 'Limpeza pós-obra',                   categoria: 'Limpeza',      clienteNome: 'Helena Isabel Dias',      prestador: null,                   operador: null,              dataPretendida: '2026-06-25', localizacao: 'Talatona, Luanda' },
  'SS-007': { status: 'submetida',   servico: 'Reparação de infiltração',            categoria: 'Canalização',  clienteNome: 'Artur Manuel Vieira',     prestador: null,                   operador: null,              dataPretendida: '2026-06-26', localizacao: 'Benguela Centro' },
  'SS-008': { status: 'submetida',   servico: 'Reparação de disjuntores',            categoria: 'Eletricidade', clienteNome: 'Nádia Cristina Borges',   prestador: null,                   operador: null,              dataPretendida: '2026-06-27', localizacao: 'Viana, Luanda' },
  'SS-009': { status: 'em_analise',  servico: 'Limpeza de escritório semanal',       categoria: 'Limpeza',      clienteNome: 'Joaquim Pedro Ferreira',  prestador: 'João Carlos Teles',    operador: 'Operador Maria',  dataPretendida: '2026-06-18', localizacao: 'Ingombota, Luanda' },
  'SS-010': { status: 'em_analise',  servico: 'Substituição de cano principal',      categoria: 'Canalização',  clienteNome: 'Olívia Raquel Marques',   prestador: null,                   operador: 'Operador Carlos', dataPretendida: '2026-06-19', localizacao: 'Maianga, Luanda' },
  'SS-011': { status: 'em_analise',  servico: 'Instalação de painel solar',          categoria: 'Eletricidade', clienteNome: 'Gabriel Augusto Lima',    prestador: 'Rui Manuel Santos',    operador: 'Operador Maria',  dataPretendida: '2026-06-20', localizacao: 'Lubango, Huíla' },
  'SS-012': { status: 'em_analise',  servico: 'Jardinagem e relvado',                categoria: 'Jardinagem',   clienteNome: 'Flávia Mariana Torres',   prestador: null,                   operador: 'Operador Kwame',  dataPretendida: '2026-06-21', localizacao: 'Benguela Centro' },
  'SS-013': { status: 'em_analise',  servico: 'Pintura de fachada',                  categoria: 'Outros',       clienteNome: 'Dário Esteves Cunha',     prestador: null,                   operador: 'Operador Carlos', dataPretendida: '2026-06-22', localizacao: 'Huambo Centro' },
  'SS-014': { status: 'em_analise',  servico: 'Desentupimento de sanita',            categoria: 'Canalização',  clienteNome: 'Marta Sofia Neves',       prestador: 'António Ferreira Silva',operador: 'Operador Kwame', dataPretendida: '2026-06-17', localizacao: 'Miramar, Luanda' },
  'SS-015': { status: 'em_analise',  servico: 'Limpeza de caleiras',                 categoria: 'Limpeza',      clienteNome: 'Rui Bernardo Alves',      prestador: null,                   operador: 'Operador Maria',  dataPretendida: '2026-06-18', localizacao: 'Viana, Luanda' },
  'SS-016': { status: 'encaminhada', servico: 'Limpeza doméstica quinzenal',         categoria: 'Limpeza',      clienteNome: 'Soraia Patrícia Mendes',  prestador: 'Sandra Maria Costa',   operador: 'Operador Carlos', dataPretendida: '2026-06-17', localizacao: 'Talatona, Luanda' },
  'SS-017': { status: 'encaminhada', servico: 'Instalação de chuveiro',              categoria: 'Canalização',  clienteNome: 'Benedito Carlos Lemos',   prestador: 'João Carlos Teles',    operador: 'Operador Maria',  dataPretendida: '2026-06-18', localizacao: 'Benguela Centro' },
  'SS-018': { status: 'encaminhada', servico: 'Revisão eléctrica completa',          categoria: 'Eletricidade', clienteNome: 'Celeste Amélia Mota',     prestador: 'Filipe Alberto Dias',  operador: 'Operador Kwame',  dataPretendida: '2026-06-19', localizacao: 'Lubango, Huíla' },
  'SS-019': { status: 'encaminhada', servico: 'Plantação de árvores fruteiras',      categoria: 'Jardinagem',   clienteNome: 'Horácio Manuel Teixeira', prestador: 'Catarina Isabel Lopes',operador: 'Operador Carlos', dataPretendida: '2026-06-20', localizacao: 'Ingombota, Luanda' },
  'SS-020': { status: 'encaminhada', servico: 'Impermeabilização de telhado',        categoria: 'Outros',       clienteNome: 'Emília Francisca Rocha',  prestador: 'Paulo Eduardo Costa',  operador: 'Operador Maria',  dataPretendida: '2026-06-21', localizacao: 'Huambo Centro' },
  'SS-021': { status: 'encaminhada', servico: 'Desinfestação e controlo de pragas',  categoria: 'Outros',       clienteNome: 'Ivone Graça Santos',      prestador: 'Nelson Augusto Pires', operador: 'Operador Kwame',  dataPretendida: '2026-06-22', localizacao: 'Benguela Centro' },
  'SS-022': { status: 'encaminhada', servico: 'Limpeza de piscina',                  categoria: 'Limpeza',      clienteNome: 'Luís Filipe Correia',     prestador: 'Vanessa Sofia Lima',   operador: 'Operador Carlos', dataPretendida: '2026-06-18', localizacao: 'Miramar, Luanda' },
  'SS-023': { status: 'encaminhada', servico: 'Reparação de torneiras',              categoria: 'Canalização',  clienteNome: 'Perpétua Josefina Dias',  prestador: 'Maria Conceição Neto', operador: 'Operador Maria',  dataPretendida: '2026-06-19', localizacao: 'Viana, Luanda' },
  'SS-024': { status: 'em_execucao', servico: 'Pintura interior de moradia',         categoria: 'Outros',       clienteNome: 'Jacinto Afonso Pereira',  prestador: 'Rui Manuel Santos',    operador: 'Operador Kwame',  dataPretendida: '2026-06-16', localizacao: 'Viana, Luanda' },
  'SS-025': { status: 'em_execucao', servico: 'Limpeza industrial de armazém',       categoria: 'Limpeza',      clienteNome: 'Gertrudes Piedade Costa', prestador: 'Sandra Maria Costa',   operador: 'Operador Carlos', dataPretendida: '2026-06-15', localizacao: 'Benguela Centro' },
  'SS-026': { status: 'em_execucao', servico: 'Instalação de sistema de rega',       categoria: 'Jardinagem',   clienteNome: 'Domingos Paulo Azevedo',  prestador: 'Catarina Isabel Lopes',operador: 'Operador Maria',  dataPretendida: '2026-06-14', localizacao: 'Lubango, Huíla' },
  'SS-027': { status: 'em_execucao', servico: 'Substituição de quadro eléctrico',    categoria: 'Eletricidade', clienteNome: 'Esperança Sofia Ribeiro', prestador: 'Filipe Alberto Dias',  operador: 'Operador Kwame',  dataPretendida: '2026-06-13', localizacao: 'Miramar, Luanda' },
  'SS-028': { status: 'em_execucao', servico: 'Manutenção de ar condicionado',       categoria: 'Outros',       clienteNome: 'Virgílio Gonçalo Neto',   prestador: 'Paulo Eduardo Costa',  operador: 'Operador Carlos', dataPretendida: '2026-06-12', localizacao: 'Huambo Centro' },
  'SS-029': { status: 'em_execucao', servico: 'Limpeza profunda de cozinha',         categoria: 'Limpeza',      clienteNome: 'Adalgisa Helena Matos',   prestador: 'João Carlos Teles',    operador: 'Operador Maria',  dataPretendida: '2026-06-11', localizacao: 'Talatona, Luanda' },
  'SS-030': { status: 'concluida',   servico: 'Limpeza pós-evento',                  categoria: 'Limpeza',      clienteNome: 'Felicidade Amélia Pires', prestador: 'Vanessa Sofia Lima',   operador: 'Operador Kwame',  dataPretendida: '2026-06-10', localizacao: 'Ingombota, Luanda' },
  'SS-031': { status: 'concluida',   servico: 'Reparação de caldeira',               categoria: 'Canalização',  clienteNome: 'Gracindo Estêvão Lima',   prestador: 'António Ferreira Silva',operador: 'Operador Carlos', dataPretendida: '2026-06-09', localizacao: 'Benguela Centro' },
  'SS-032': { status: 'concluida',   servico: 'Instalação de lustre',                categoria: 'Eletricidade', clienteNome: 'Teresinha Dulce Sousa',   prestador: 'Rui Manuel Santos',    operador: 'Operador Maria',  dataPretendida: '2026-06-08', localizacao: 'Lubango, Huíla' },
  'SS-033': { status: 'concluida',   servico: 'Tratamento de plantas ornamentais',   categoria: 'Jardinagem',   clienteNome: 'Amâncio Bruno Rodrigues', prestador: 'Nelson Augusto Pires', operador: 'Operador Kwame',  dataPretendida: '2026-06-07', localizacao: 'Maianga, Luanda' },
  'SS-034': { status: 'cancelada',   servico: 'Limpeza de vidros exteriores',        categoria: 'Limpeza',      clienteNome: 'Virgínia Rosa Teles',     prestador: null,                   operador: 'Operador Carlos', dataPretendida: '2026-06-15', localizacao: 'Viana, Luanda' },
  'SS-035': { status: 'cancelada',   servico: 'Instalação de aquecedor',             categoria: 'Eletricidade', clienteNome: 'Hélder Augusto Carvalho', prestador: null,                   operador: 'Operador Maria',  dataPretendida: '2026-06-13', localizacao: 'Huambo Centro' },
};

function getBase(id: string) {
  return BASE_DATA[id] ?? {
    status: 'submetida' as StatusSolicitacao,
    servico: 'Serviço não especificado',
    categoria: 'Outros',
    clienteNome: 'Cliente Anónimo',
    prestador: null,
    operador: null,
    dataPretendida: '2026-06-30',
    localizacao: 'Angola',
  };
}

function buildTimeline(status: StatusSolicitacao, dataPretendida: string): TimelineItem[] {
  const items: TimelineItem[] = [
    { id: 't1', status: 'submetida', label: 'Solicitação submetida pelo cliente', timestamp: '2026-06-10T09:00:00Z' },
  ];
  if (['em_analise', 'encaminhada', 'em_execucao', 'concluida', 'cancelada'].includes(status))
    items.push({ id: 't2', status: 'em_analise', label: 'Solicitação aberta para análise', timestamp: '2026-06-11T10:30:00Z', operador: 'Operador Maria' });
  if (['encaminhada', 'em_execucao', 'concluida'].includes(status)) {
    items.push({ id: 't3', status: 'encaminhada', label: 'Encaminhada ao prestador', timestamp: '2026-06-12T14:00:00Z', operador: 'Operador Carlos' });
    items.push({ id: 't4', status: 'aceite', label: 'Aceite pelo prestador', timestamp: '2026-06-13T09:00:00Z' });
  }
  if (['em_execucao', 'concluida'].includes(status))
    items.push({ id: 't5', status: 'em_execucao', label: 'Serviço em execução', timestamp: `${dataPretendida}T08:00:00Z` });
  if (status === 'concluida')
    items.push({ id: 't6', status: 'concluida', label: 'Serviço concluído com sucesso', timestamp: `${dataPretendida}T17:00:00Z` });
  if (status === 'cancelada')
    items.push({ id: 't7', status: 'cancelada', label: 'Solicitação cancelada', timestamp: '2026-06-14T11:00:00Z', operador: 'Operador Carlos' });
  return items.reverse();
}

function buildMensagens(status: StatusSolicitacao, clienteNome: string, prestador: string | null): Mensagem[] {
  const msgs: Mensagem[] = [
    { id: 'm1', autor: 'Sistema', papel: 'sistema', conteudo: 'Solicitação recebida e registada no sistema.', timestamp: '2026-06-10T09:01:00Z' },
  ];
  if (status === 'submetida') return msgs;
  msgs.push(
    { id: 'm2', autor: clienteNome, papel: 'cliente', conteudo: 'Bom dia, existe alguma atualização sobre a minha solicitação?', timestamp: '2026-06-11T09:30:00Z' },
    { id: 'm3', autor: 'Operador Maria', papel: 'operador', conteudo: `Bom dia, ${clienteNome.split(' ')[0]}. A sua solicitação está em análise. Entraremos em contacto brevemente.`, timestamp: '2026-06-11T10:45:00Z' },
  );
  if (prestador && ['encaminhada', 'em_execucao', 'concluida'].includes(status)) {
    msgs.push(
      { id: 'm4', autor: prestador, papel: 'prestador', conteudo: 'Recebi a solicitação e confirmo disponibilidade para a data pretendida.', timestamp: '2026-06-13T09:15:00Z' },
      { id: 'm5', autor: 'Operador Carlos', papel: 'operador', conteudo: `${clienteNome.split(' ')[0]}, o prestador confirmou disponibilidade. Por favor esteja disponível na data acordada.`, timestamp: '2026-06-13T10:00:00Z' },
    );
  }
  return msgs;
}

function buildAuditoria(status: StatusSolicitacao, clienteNome: string, operador: string | null, prestador: string | null): AuditoriaItem[] {
  const items: AuditoriaItem[] = [
    { id: 'a1', timestamp: '2026-06-10T09:00:00Z', utilizador: 'Sistema', tipo: 'criacao', descricao: `Solicitação criada por ${clienteNome}` },
    { id: 'a2', timestamp: '2026-06-11T10:30:00Z', utilizador: 'Operador Maria', tipo: 'status', descricao: 'Status alterado: Submetida → Em Análise' },
  ];
  if (['encaminhada', 'em_execucao', 'concluida'].includes(status) && prestador) {
    items.push(
      { id: 'a3', timestamp: '2026-06-11T10:45:00Z', utilizador: 'Operador Maria', tipo: 'mensagem', descricao: 'Mensagem enviada ao cliente' },
      { id: 'a4', timestamp: '2026-06-12T14:00:00Z', utilizador: operador ?? 'Operador', tipo: 'encaminhamento', descricao: `Solicitação encaminhada para ${prestador}` },
      { id: 'a5', timestamp: '2026-06-12T14:00:00Z', utilizador: operador ?? 'Operador', tipo: 'status', descricao: 'Status alterado: Em Análise → Encaminhada' },
    );
  }
  if (['em_execucao', 'concluida'].includes(status)) {
    items.push(
      { id: 'a6', timestamp: '2026-06-14T08:00:00Z', utilizador: 'Sistema', tipo: 'status', descricao: 'Status alterado: Encaminhada → Em Execução' },
      { id: 'a7', timestamp: '2026-06-14T08:00:00Z', utilizador: 'Sistema', tipo: 'pagamento', descricao: 'Pagamento registado — Pendente' },
    );
  }
  if (status === 'concluida') {
    items.push(
      { id: 'a8', timestamp: '2026-06-15T17:00:00Z', utilizador: 'Sistema', tipo: 'status', descricao: 'Status alterado: Em Execução → Concluída' },
      { id: 'a9', timestamp: '2026-06-15T17:30:00Z', utilizador: 'Sistema', tipo: 'pagamento', descricao: 'Pagamento confirmado — Pago' },
      { id: 'a10', timestamp: '2026-06-15T18:00:00Z', utilizador: 'Sistema', tipo: 'pagamento', descricao: 'Repasse processado ao prestador' },
    );
  }
  if (status === 'cancelada') {
    items.push(
      { id: 'a3c', timestamp: '2026-06-14T11:00:00Z', utilizador: operador ?? 'Operador', tipo: 'status', descricao: 'Status alterado: Em Análise → Cancelada' },
      { id: 'a4c', timestamp: '2026-06-14T11:00:00Z', utilizador: operador ?? 'Operador', tipo: 'encerramento', descricao: 'Solicitação cancelada pelo operador' },
    );
  }
  return items.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

function buildMockDetalhe(id: string): SolicitacaoDetalhe {
  const b = getBase(id);
  const slug = (s: string) => s.toLowerCase().replace(/\s+/g, '.').replace(/[^\w.]/g, '');
  return {
    id,
    status: b.status,
    servico: b.servico,
    categoria: b.categoria,
    descricao: `O cliente necessita de ${b.servico.toLowerCase()} com qualidade profissional. O trabalho deve ser realizado com atenção aos detalhes e seguindo as normas aplicáveis. É necessário coordenar a disponibilidade com antecedência mínima de 48 horas.`,
    localizacao: b.localizacao,
    observacoes: b.status !== 'submetida' ? 'Horário preferencial: manhã (08h–12h). Preferência por profissional com experiência comprovada.' : '',
    dataSubmissao: '2026-06-10T09:00:00Z',
    dataPretendida: `${b.dataPretendida}T08:00:00Z`,
    dataUltimaAtualizacao: new Date().toISOString(),
    prestadorNome: b.prestador,
    operadorResponsavel: b.operador,
    cliente: {
      nome: b.clienteNome,
      email: `${slug(b.clienteNome)}@gmail.com`,
      telefone: '+244 923 456 789',
    },
    prestadorInfo: b.prestador ? {
      nome: b.prestador,
      email: `${slug(b.prestador)}@prestador.ao`,
      telefone: '+244 912 345 678',
      estadoCandidatura: 'Aprovado',
    } : null,
    timeline: buildTimeline(b.status, b.dataPretendida),
    mensagens: buildMensagens(b.status, b.clienteNome, b.prestador),
    pagamento: ['em_execucao', 'concluida'].includes(b.status) ? {
      id: `PAG-${id.replace('SS-', '')}`,
      status: b.status === 'concluida' ? 'pago' : 'pendente',
      valor: 25000,
    } : null,
    repasse: b.status === 'concluida' ? {
      id: `REP-${id.replace('SS-', '')}`,
      status: 'processado',
      valor: 20000,
    } : null,
    auditoria: buildAuditoria(b.status, b.clienteNome, b.operador, b.prestador),
  };
}

// ── Module-level cache ─────────────────────────────────────

const _cache: Record<string, SolicitacaoDetalhe> = {};

function getDetalhe(id: string): SolicitacaoDetalhe {
  if (!_cache[id]) _cache[id] = buildMockDetalhe(id);
  return _cache[id];
}

function patchCache(id: string, updater: (d: SolicitacaoDetalhe) => SolicitacaoDetalhe) {
  if (_cache[id]) _cache[id] = updater(_cache[id]);
}

// ── Helpers ────────────────────────────────────────────────

function fmtDate(iso: string): string {
  try {
    const d = iso.length === 10 ? (() => { const [y,m,d] = iso.split('-').map(Number); return new Date(y,m-1,d); })() : new Date(iso);
    return d.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch { return iso; }
}

function fmtDateTime(iso: string): string {
  try { return new Date(iso).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); }
  catch { return iso; }
}

function fmtTime(iso: string): string {
  try { return new Date(iso).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }); }
  catch { return ''; }
}

function uid(): string { return `${Date.now()}-${Math.random().toString(36).slice(2,6)}`; }

function initials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

// ── Primitive components ───────────────────────────────────

function StatusBadge({ status }: { status: StatusSolicitacao }) {
  const cfg = STATUS_CONFIG[status];
  return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${cfg.classes}`}>{cfg.label}</span>;
}

function Field({ label, value, mono, className }: { label: string; value: string; mono?: boolean; className?: string }) {
  return (
    <div className={className}>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-xs font-semibold text-gray-800 ${mono ? 'font-mono' : ''}`}>{value}</p>
    </div>
  );
}

// ── Loading skeleton ───────────────────────────────────────

function PageSkeleton() {
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-8 px-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-4 bg-gray-100 rounded w-44" />
        <div className="h-6 bg-gray-100 rounded-full w-24" />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-5 bg-gray-200 rounded w-2/3" />
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="h-2.5 bg-gray-100 rounded w-1/2" />
                  <div className="h-3.5 bg-gray-200 rounded w-3/4" />
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-20 bg-gray-100 rounded-xl" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-12 bg-gray-100 rounded-xl" />
              <div className="h-12 bg-gray-100 rounded-xl" />
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-xl" />)}
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
            <div className="h-28 bg-gray-100 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Encaminhar modal ───────────────────────────────────────

function EncaminharModal({
  currentPrestador,
  onClose,
  onConfirm,
}: {
  currentPrestador: string | null;
  onClose: () => void;
  onConfirm: (p: Prestador) => void;
}) {
  const initial = currentPrestador ? (MOCK_PRESTADORES.find(p => p.nome === currentPrestador) ?? null) : null;
  const [selected, setSelected] = useState<Prestador | null>(initial);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false); setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = MOCK_PRESTADORES.filter(p => p.nome.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={!isSubmitting ? onClose : undefined} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in duration-200">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0">
              <Send size={16} className="text-emerald-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Encaminhar Solicitação</h3>
              <p className="text-xs text-gray-500 mt-0.5">Atribuir prestador responsável</p>
            </div>
          </div>
          <button onClick={onClose} disabled={isSubmitting} className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer shrink-0 disabled:opacity-40">
            <X size={14} />
          </button>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
            Prestador <span className="text-red-500">*</span>
          </label>
          <div ref={wrapRef} className="relative">
            <button
              type="button"
              onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
              className="w-full flex items-center justify-between px-3 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl hover:border-emerald-400 hover:bg-white focus:border-emerald-400 focus:bg-white transition-all cursor-pointer outline-none"
            >
              <span className={selected ? 'text-gray-800 font-semibold' : 'text-gray-400'}>
                {selected ? selected.nome : 'Selecionar prestador...'}
              </span>
              <ChevronDown size={13} className={`text-gray-400 transition-transform shrink-0 ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
              <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                <div className="p-2 border-b border-gray-100">
                  <div className="relative">
                    <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input ref={inputRef} type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Pesquisar..." className="w-full pl-7 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-400 focus:bg-white transition-all placeholder:text-gray-400" />
                  </div>
                </div>
                <div className="max-h-44 overflow-y-auto">
                  {filtered.length === 0
                    ? <p className="px-3 py-3 text-xs text-gray-400 text-center">Nenhum resultado</p>
                    : filtered.map(p => (
                      <button key={p.id} type="button" onClick={() => { setSelected(p); setOpen(false); setSearch(''); }}
                        className={`w-full text-left px-3 py-2.5 text-xs hover:bg-emerald-50 flex items-center justify-between transition-colors ${selected?.id === p.id ? 'text-emerald-700 font-semibold bg-emerald-50/60' : 'text-gray-700'}`}>
                        <span>{p.nome}</span>
                        {selected?.id === p.id && <Check size={11} className="text-emerald-600 shrink-0" />}
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {selected && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 flex items-start gap-2.5 animate-in fade-in duration-200">
            <Check size={13} className="text-emerald-600 mt-0.5 shrink-0" />
            <p className="text-xs text-emerald-700 font-medium leading-relaxed">
              Encaminhar esta solicitação para <span className="font-bold">{selected.nome}</span>?
            </p>
          </div>
        )}

        <div className="flex items-center justify-end gap-3">
          <button onClick={onClose} disabled={isSubmitting} className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:border-gray-400 transition-colors cursor-pointer disabled:opacity-50">Cancelar</button>
          <button
            onClick={() => { if (!selected || isSubmitting) return; setIsSubmitting(true); setTimeout(() => onConfirm(selected), 400); }}
            disabled={!selected || isSubmitting}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {isSubmitting ? <Loader size={11} className="animate-spin" /> : <Send size={11} />}
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Confirm modal ──────────────────────────────────────────

function ConfirmModal({
  titulo, descricao, confirmLabel, variant, onClose, onConfirm, children,
}: {
  titulo: string; descricao: string; confirmLabel: string;
  variant: 'danger' | 'primary'; onClose: () => void; onConfirm: () => void;
  children?: React.ReactNode;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={!busy ? onClose : undefined} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in duration-200">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${variant === 'danger' ? 'bg-red-50' : 'bg-emerald-50'}`}>
              {variant === 'danger'
                ? <AlertOctagon size={16} className="text-red-500" />
                : <CheckCheck size={16} className="text-emerald-600" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">{titulo}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{descricao}</p>
            </div>
          </div>
          <button onClick={onClose} disabled={busy} className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer shrink-0">
            <X size={14} />
          </button>
        </div>
        {children}
        <div className="flex items-center justify-end gap-3">
          <button onClick={onClose} disabled={busy} className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:border-gray-400 transition-colors cursor-pointer disabled:opacity-50">Cancelar</button>
          <button
            onClick={() => { setBusy(true); setTimeout(() => { onConfirm(); setBusy(false); }, 400); }}
            disabled={busy}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white rounded-xl transition-colors cursor-pointer disabled:opacity-50 ${variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
          >
            {busy && <Loader size={11} className="animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────

export default function DetalheSolicitacaoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [detalhe, setDetalhe] = useState<SolicitacaoDetalhe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<'encaminhar' | 'cancelar' | 'disputa' | 'fechar' | null>(null);
  const [disputaMotivo, setDisputaMotivo] = useState('');
  const [msgInput, setMsgInput] = useState('');
  const [isSendingMsg, setIsSendingMsg] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const loadTimerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const msgListRef      = useRef<HTMLDivElement>(null);

  const loadData = useCallback(() => {
    setIsLoading(true);
    setError(null);
    if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
    loadTimerRef.current = setTimeout(() => {
      try {
        setDetalhe({ ...getDetalhe(id) });
        setIsLoading(false);
      } catch {
        setError('Erro ao carregar os detalhes desta solicitação.');
        setIsLoading(false);
      }
    }, 500);
  }, [id]);

  useEffect(() => {
    loadData();
    return () => {
      if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
    };
  }, [loadData]);

  useEffect(() => {
    if (msgListRef.current) msgListRef.current.scrollTop = msgListRef.current.scrollHeight;
  }, [detalhe?.mensagens.length]);

  const showSuccess = (msg: string) => {
    setSuccessBanner(msg);
    if (successTimerRef.current) clearTimeout(successTimerRef.current);
    successTimerRef.current = setTimeout(() => setSuccessBanner(null), 3500);
  };

  const patch = (updater: (d: SolicitacaoDetalhe) => SolicitacaoDetalhe) => {
    setDetalhe(prev => { if (!prev) return prev; const next = updater(prev); patchCache(id, () => next); return next; });
  };

  const handleEncaminhar = (p: Prestador) => {
    patch(d => ({
      ...d,
      status: 'encaminhada',
      prestadorNome: p.nome,
      prestadorInfo: { nome: p.nome, email: `${p.nome.toLowerCase().replace(/\s+/g,'.')}@prestador.ao`, telefone: '+244 912 345 678', estadoCandidatura: 'Aprovado' },
      dataUltimaAtualizacao: new Date().toISOString(),
      timeline: [{ id: uid(), status: 'encaminhada', label: `Encaminhada para ${p.nome}`, timestamp: new Date().toISOString(), operador: 'Operador Atual' }, ...d.timeline],
      auditoria: [{ id: uid(), timestamp: new Date().toISOString(), utilizador: 'Operador Atual', tipo: 'encaminhamento', descricao: `Solicitação encaminhada para ${p.nome}` }, { id: uid(), timestamp: new Date().toISOString(), utilizador: 'Operador Atual', tipo: 'status', descricao: `Status alterado: ${STATUS_CONFIG[d.status].label} → Encaminhada` }, ...d.auditoria],
    }));
    setModal(null);
    showSuccess(`Solicitação ${id} encaminhada com sucesso para ${p.nome}.`);
  };

  const handleCancelar = () => {
    patch(d => ({
      ...d,
      status: 'cancelada',
      dataUltimaAtualizacao: new Date().toISOString(),
      timeline: [{ id: uid(), status: 'cancelada', label: 'Solicitação cancelada', timestamp: new Date().toISOString(), operador: 'Operador Atual' }, ...d.timeline],
      auditoria: [{ id: uid(), timestamp: new Date().toISOString(), utilizador: 'Operador Atual', tipo: 'status', descricao: `Status alterado: ${STATUS_CONFIG[d.status].label} → Cancelada` }, { id: uid(), timestamp: new Date().toISOString(), utilizador: 'Operador Atual', tipo: 'encerramento', descricao: 'Solicitação cancelada pelo operador' }, ...d.auditoria],
    }));
    setModal(null);
    showSuccess('Solicitação cancelada com sucesso.');
  };

  const handleAbrirDisputa = () => {
    if (!disputaMotivo.trim()) return;
    const motivo = disputaMotivo.trim();
    patch(d => ({
      ...d,
      dataUltimaAtualizacao: new Date().toISOString(),
      timeline: [{ id: uid(), status: 'em_disputa', label: 'Disputa aberta', timestamp: new Date().toISOString(), operador: 'Operador Atual' }, ...d.timeline],
      auditoria: [{ id: uid(), timestamp: new Date().toISOString(), utilizador: 'Operador Atual', tipo: 'disputa', descricao: `Disputa aberta: ${motivo}` }, ...d.auditoria],
    }));
    setModal(null);
    setDisputaMotivo('');
    showSuccess('Disputa aberta. O processo de mediação foi iniciado.');
  };

  const handleFechar = () => {
    patch(d => ({
      ...d,
      dataUltimaAtualizacao: new Date().toISOString(),
      timeline: [{ id: uid(), status: 'fechada', label: 'Solicitação encerrada', timestamp: new Date().toISOString(), operador: 'Operador Atual' }, ...d.timeline],
      auditoria: [{ id: uid(), timestamp: new Date().toISOString(), utilizador: 'Operador Atual', tipo: 'encerramento', descricao: 'Solicitação encerrada pelo operador' }, ...d.auditoria],
    }));
    setModal(null);
    showSuccess('Solicitação encerrada com sucesso.');
  };

  const handleEnviarMsg = () => {
    if (!msgInput.trim() || isSendingMsg) return;
    const texto = msgInput.trim();
    setMsgInput('');
    setIsSendingMsg(true);
    setTimeout(() => {
      const nova: Mensagem = { id: uid(), autor: 'Operador Atual', papel: 'operador', conteudo: texto, timestamp: new Date().toISOString() };
      patch(d => ({
        ...d,
        mensagens: [...d.mensagens, nova],
        auditoria: [{ id: uid(), timestamp: new Date().toISOString(), utilizador: 'Operador Atual', tipo: 'mensagem', descricao: 'Mensagem enviada' }, ...d.auditoria],
      }));
      setIsSendingMsg(false);
    }, 300);
  };

  // ── Loading ─────────────────────────────────────────────

  if (isLoading) return <PageSkeleton />;

  if (error || !detalhe) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 pb-8 space-y-6">
        <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors cursor-pointer group">
          <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Voltar às solicitações
        </button>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-16 flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
            <AlertTriangle size={22} className="text-red-500" />
          </div>
          <div className="max-w-sm">
            <h3 className="text-sm font-semibold text-gray-900">Solicitação não encontrada</h3>
            <p className="text-xs text-gray-500 mt-1">{error ?? 'Não foi possível carregar esta solicitação.'}</p>
          </div>
          <button onClick={loadData} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:border-gray-400 transition-colors shadow-sm cursor-pointer">
            <RotateCw size={12} /> Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  const canEncaminhar = CAN_ENCAMINHAR.includes(detalhe.status);
  const canCancelar   = CAN_CANCELAR.includes(detalhe.status);
  const canDisputa    = CAN_DISPUTA.includes(detalhe.status);
  const canFechar     = CAN_FECHAR.includes(detalhe.status);

  // ── Render ──────────────────────────────────────────────

  return (
    <>
      <div className="space-y-6 max-w-[1400px] mx-auto pb-8 px-4">

        {/* Success banner */}
        {successBanner && (
          <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl animate-in fade-in duration-200">
            <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
            <p className="text-xs font-semibold text-emerald-700">{successBanner}</p>
          </div>
        )}

        {/* Top bar */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors cursor-pointer group">
            <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            Voltar às solicitações
          </button>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 font-mono">{id}</span>
            <StatusBadge status={detalhe.status} />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* ─── Left column ──────────────────────────────── */}
          <div className="xl:col-span-2 space-y-6">

            {/* 1. Cabeçalho */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">Cabeçalho da Solicitação</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Informação principal do processo</p>
                </div>
                <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <Activity size={16} className="text-emerald-600" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-base font-bold text-gray-900 mb-5">{detalhe.servico}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  <Field label="ID" value={id} mono />
                  <Field label="Categoria" value={detalhe.categoria} />
                  <Field label="Status" value={STATUS_CONFIG[detalhe.status].label} />
                  <Field label="Prestador" value={detalhe.prestadorNome ?? '—'} />
                  <Field label="Data de Submissão" value={fmtDateTime(detalhe.dataSubmissao)} />
                  <Field label="Data Pretendida" value={fmtDate(detalhe.dataPretendida)} />
                  <Field label="Última Atualização" value={fmtDateTime(detalhe.dataUltimaAtualizacao)} />
                  <Field label="Operador Responsável" value={detalhe.operadorResponsavel ?? '—'} />
                </div>
              </div>
            </section>

            {/* 2. Dados da Solicitação */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">Dados da Solicitação</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Informação submetida pelo cliente</p>
                </div>
                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                  <FileText size={16} className="text-blue-600" />
                </div>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Descrição</p>
                  <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 border border-gray-100 rounded-xl p-4">{detalhe.descricao}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Localização</p>
                    <div className="flex items-start gap-2 bg-gray-50 border border-gray-100 rounded-xl p-3.5">
                      <MapPin size={13} className="text-gray-400 mt-0.5 shrink-0" />
                      <p className="text-xs font-medium text-gray-700">{detalhe.localizacao}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Categoria</p>
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl p-3.5">
                      <Tag size={13} className="text-gray-400 shrink-0" />
                      <p className="text-xs font-medium text-gray-700">{detalhe.categoria}</p>
                    </div>
                  </div>
                </div>
                {detalhe.observacoes && (
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Observações</p>
                    <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl p-3.5">
                      <Info size={13} className="text-amber-500 mt-0.5 shrink-0" />
                      <p className="text-xs text-amber-700 leading-relaxed">{detalhe.observacoes}</p>
                    </div>
                  </div>
                )}
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Anexos</p>
                  <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl px-4 py-6 flex flex-col items-center gap-2">
                    <Paperclip size={18} className="text-gray-300" />
                    <p className="text-xs text-gray-400">Nenhum anexo submetido.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Dados Internos */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">Dados Internos</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Visível apenas para operadores — não partilhar entre partes</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Confidencial</span>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Cliente */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
                        <User size={13} className="text-blue-600" />
                      </div>
                      <p className="text-xs font-bold text-gray-800">Cliente</p>
                    </div>
                    <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 space-y-3">
                      <Field label="Nome Completo" value={detalhe.cliente.nome} />
                      <Field label="Email" value={detalhe.cliente.email} />
                      <Field label="Telefone" value={detalhe.cliente.telefone} />
                    </div>
                  </div>
                  {/* Prestador */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 bg-violet-50 rounded-lg flex items-center justify-center">
                        <Users size={13} className="text-violet-600" />
                      </div>
                      <p className="text-xs font-bold text-gray-800">Prestador</p>
                    </div>
                    {detalhe.prestadorInfo ? (
                      <div className="bg-violet-50/50 border border-violet-100 rounded-xl p-4 space-y-3">
                        <Field label="Nome Completo" value={detalhe.prestadorInfo.nome} />
                        <Field label="Email" value={detalhe.prestadorInfo.email} />
                        <Field label="Telefone" value={detalhe.prestadorInfo.telefone} />
                        <Field label="Estado da Candidatura" value={detalhe.prestadorInfo.estadoCandidatura} />
                      </div>
                    ) : (
                      <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center gap-2 text-center h-full">
                        <Users size={18} className="text-gray-300" />
                        <p className="text-xs text-gray-400">Nenhum prestador atribuído.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Timeline de Estados */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">Timeline de Estados</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Evolução cronológica da solicitação</p>
                </div>
                <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center">
                  <Calendar size={16} className="text-indigo-600" />
                </div>
              </div>
              <div className="p-6">
                {detalhe.timeline.length === 0
                  ? <p className="text-xs text-gray-400 text-center py-6">Sem eventos registados.</p>
                  : (
                    <div>
                      {detalhe.timeline.map((item, idx) => (
                        <div key={item.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <span className={`w-3 h-3 rounded-full shrink-0 mt-0.5 ring-2 ring-white ${TIMELINE_DOT[item.status] ?? 'bg-gray-300'}`} />
                            {idx < detalhe.timeline.length - 1 && <span className="w-px flex-1 bg-gray-100 my-1.5" style={{ minHeight: 20 }} />}
                          </div>
                          <div className="pb-5 flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-800">{item.label}</p>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              {item.operador && <><span className="text-[10px] text-gray-500">{item.operador}</span><span className="text-[10px] text-gray-300">·</span></>}
                              <span className="text-[10px] text-gray-400">{fmtDateTime(item.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            </section>

            {/* 5 + 6. Canal de Mensagens */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">Canal de Mensagens</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Comunicação intermediada — as partes não trocam contactos entre si</p>
                </div>
                <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <MessageSquare size={16} className="text-emerald-600" />
                </div>
              </div>

              {/* Histórico */}
              <div ref={msgListRef} className="max-h-80 overflow-y-auto px-5 py-4 space-y-3 bg-gray-50/20">
                {detalhe.mensagens.length === 0
                  ? (
                    <div className="flex flex-col items-center gap-2 py-10 text-center">
                      <MessageSquare size={20} className="text-gray-300" />
                      <p className="text-xs text-gray-400">Nenhuma mensagem ainda.</p>
                    </div>
                  )
                  : detalhe.mensagens.map(msg => {
                    const isOp  = msg.papel === 'operador';
                    const isSys = msg.papel === 'sistema';
                    if (isSys) return (
                      <div key={msg.id} className="flex justify-center">
                        <span className="text-[10px] text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{msg.conteudo}</span>
                      </div>
                    );
                    return (
                      <div key={msg.id} className={`flex gap-2.5 ${isOp ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${isOp ? 'bg-[#06241C] text-white' : msg.papel === 'cliente' ? 'bg-blue-500 text-white' : 'bg-violet-500 text-white'}`}>
                          {initials(msg.autor)}
                        </div>
                        <div className={`max-w-[70%] space-y-1 flex flex-col ${isOp ? 'items-end' : 'items-start'}`}>
                          <div className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${isOp ? 'bg-[#06241C] text-white rounded-tr-sm' : msg.papel === 'cliente' ? 'bg-blue-50 text-blue-900 border border-blue-100 rounded-tl-sm' : 'bg-violet-50 text-violet-900 border border-violet-100 rounded-tl-sm'}`}>
                            {msg.conteudo}
                          </div>
                          <div className={`flex items-center gap-1.5 px-1 ${isOp ? 'flex-row-reverse' : ''}`}>
                            <span className="text-[10px] text-gray-400 font-medium">{msg.autor}</span>
                            <span className="text-[10px] text-gray-300">·</span>
                            <span className="text-[10px] text-gray-400">{fmtTime(msg.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Compose */}
              <div className="px-5 py-4 border-t border-gray-100">
                <div className="flex gap-3 items-end">
                  <textarea
                    value={msgInput}
                    onChange={e => setMsgInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleEnviarMsg(); } }}
                    placeholder="Escreva uma mensagem intermediada... (Enter para enviar)"
                    rows={2}
                    className="flex-1 px-3.5 py-2.5 text-xs text-gray-800 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-400 focus:bg-white resize-none transition-all placeholder:text-gray-400"
                  />
                  <button
                    onClick={handleEnviarMsg}
                    disabled={!msgInput.trim() || isSendingMsg}
                    className="h-10 px-4 bg-[#06241C] hover:bg-[#0B392E] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0"
                  >
                    {isSendingMsg ? <Loader size={12} className="animate-spin" /> : <Send size={12} />}
                    Enviar
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 mt-1.5">Os contactos de cliente e prestador são confidenciais e nunca partilhados entre si.</p>
              </div>
            </section>

          </div>

          {/* ─── Right column ──────────────────────────────── */}
          <div className="space-y-6">

            {/* 7. Ações */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-900">Ações Disponíveis</h2>
                <Shield size={15} className="text-gray-400" />
              </div>
              <div className="p-5 space-y-3">
                {/* Encaminhar */}
                <button
                  onClick={() => canEncaminhar && setModal('encaminhar')}
                  disabled={!canEncaminhar}
                  className={`w-full flex items-center gap-3 px-4 py-3 border rounded-xl transition-all text-left ${canEncaminhar ? 'bg-white border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/30 cursor-pointer group' : 'bg-gray-50/50 border-gray-100 cursor-not-allowed opacity-50'}`}
                >
                  <div className={`w-8 h-8 border rounded-lg flex items-center justify-center shrink-0 ${canEncaminhar ? 'bg-emerald-50 border-emerald-100 group-hover:bg-emerald-100 transition-colors' : 'bg-gray-100 border-gray-200'}`}>
                    <Send size={13} className={canEncaminhar ? 'text-emerald-600' : 'text-gray-400'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-800">Encaminhar</p>
                    <p className="text-[10px] text-gray-400 font-medium">
                      {canEncaminhar ? 'Atribuir prestador responsável' : `Indisponível no estado "${STATUS_CONFIG[detalhe.status].label}"`}
                    </p>
                  </div>
                </button>

                {/* Cancelar */}
                <button
                  onClick={() => canCancelar && setModal('cancelar')}
                  disabled={!canCancelar}
                  className={`w-full flex items-center gap-3 px-4 py-3 border rounded-xl transition-all text-left ${canCancelar ? 'bg-white border-gray-200 hover:border-red-200 hover:bg-red-50/30 cursor-pointer group' : 'bg-gray-50/50 border-gray-100 cursor-not-allowed opacity-50'}`}
                >
                  <div className={`w-8 h-8 border rounded-lg flex items-center justify-center shrink-0 ${canCancelar ? 'bg-red-50 border-red-100 group-hover:bg-red-100 transition-colors' : 'bg-gray-100 border-gray-200'}`}>
                    <XCircle size={13} className={canCancelar ? 'text-red-500' : 'text-gray-400'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-800">Cancelar</p>
                    <p className="text-[10px] text-gray-400 font-medium">
                      {canCancelar ? 'Cancelar esta solicitação' : `Indisponível no estado "${STATUS_CONFIG[detalhe.status].label}"`}
                    </p>
                  </div>
                </button>

                {/* Abrir Disputa */}
                <button
                  onClick={() => canDisputa && setModal('disputa')}
                  disabled={!canDisputa}
                  className={`w-full flex items-center gap-3 px-4 py-3 border rounded-xl transition-all text-left ${canDisputa ? 'bg-white border-gray-200 hover:border-orange-200 hover:bg-orange-50/30 cursor-pointer group' : 'bg-gray-50/50 border-gray-100 cursor-not-allowed opacity-50'}`}
                >
                  <div className={`w-8 h-8 border rounded-lg flex items-center justify-center shrink-0 ${canDisputa ? 'bg-orange-50 border-orange-100 group-hover:bg-orange-100 transition-colors' : 'bg-gray-100 border-gray-200'}`}>
                    <AlertOctagon size={13} className={canDisputa ? 'text-orange-500' : 'text-gray-400'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-800">Abrir Disputa</p>
                    <p className="text-[10px] text-gray-400 font-medium">
                      {canDisputa ? 'Iniciar processo de mediação' : 'Disponível em execução ou concluída'}
                    </p>
                  </div>
                </button>

                {/* Fechar */}
                <button
                  onClick={() => canFechar && setModal('fechar')}
                  disabled={!canFechar}
                  className={`w-full flex items-center gap-3 px-4 py-3 border rounded-xl transition-all text-left ${canFechar ? 'bg-white border-gray-200 hover:border-gray-400 hover:bg-gray-50 cursor-pointer group' : 'bg-gray-50/50 border-gray-100 cursor-not-allowed opacity-50'}`}
                >
                  <div className={`w-8 h-8 border rounded-lg flex items-center justify-center shrink-0 ${canFechar ? 'bg-gray-100 border-gray-200 group-hover:bg-gray-200 transition-colors' : 'bg-gray-100 border-gray-200'}`}>
                    <CheckCheck size={13} className={canFechar ? 'text-gray-600' : 'text-gray-400'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-800">Fechar</p>
                    <p className="text-[10px] text-gray-400 font-medium">
                      {canFechar ? 'Encerrar solicitação concluída' : 'Disponível apenas quando concluída'}
                    </p>
                  </div>
                </button>
              </div>
            </section>

            {/* 8. Financeiro */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-900">Pagamento & Repasse</h2>
                <CreditCard size={15} className="text-gray-400" />
              </div>
              <div className="p-5 space-y-4">
                {/* Pagamento */}
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">Pagamento</p>
                  {detalhe.pagamento ? (
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Estado</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${PAGAMENTO_CONFIG[detalhe.pagamento.status].classes}`}>{PAGAMENTO_CONFIG[detalhe.pagamento.status].label}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Valor</span>
                        <span className="text-xs font-bold text-gray-800">{detalhe.pagamento.valor.toLocaleString('pt-PT')} AOA</span>
                      </div>
                      <Link href={`/pagamentos?ref=${detalhe.pagamento.id}`} className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                        <ExternalLink size={10} /> {detalhe.pagamento.id}
                      </Link>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl px-4 py-4 text-center">
                      <p className="text-[10px] text-gray-400">Nenhum pagamento registado.</p>
                    </div>
                  )}
                </div>
                <div className="w-full h-px bg-gray-100" />
                {/* Repasse */}
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">Repasse</p>
                  {detalhe.repasse ? (
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Estado</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${REPASSE_CONFIG[detalhe.repasse.status].classes}`}>{REPASSE_CONFIG[detalhe.repasse.status].label}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Valor</span>
                        <span className="text-xs font-bold text-gray-800">{detalhe.repasse.valor.toLocaleString('pt-PT')} AOA</span>
                      </div>
                      <Link href={`/repasses?ref=${detalhe.repasse.id}`} className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                        <ExternalLink size={10} /> {detalhe.repasse.id}
                      </Link>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl px-4 py-4 text-center">
                      <p className="text-[10px] text-gray-400">Nenhum repasse registado.</p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* 9. Auditoria */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">Auditoria</h2>
                  <p className="text-xs text-gray-500 mt-0.5">{detalhe.auditoria.length} registos</p>
                </div>
                <Clock size={15} className="text-gray-400" />
              </div>
              <div className="p-5">
                {detalhe.auditoria.length === 0
                  ? <p className="text-xs text-gray-400 text-center py-6">Sem registos de auditoria.</p>
                  : (
                    <div>
                      {detalhe.auditoria.map((item, idx) => (
                        <div key={item.id} className="flex gap-3">
                          <div className="flex flex-col items-center pt-1">
                            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${AUDITORIA_DOT[item.tipo]}`} />
                            {idx < detalhe.auditoria.length - 1 && <span className="w-px flex-1 bg-gray-100 my-1" style={{ minHeight: 14 }} />}
                          </div>
                          <div className="pb-4 flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-800 leading-snug">{item.descricao}</p>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                              <span className="text-[10px] text-gray-400">{item.utilizador}</span>
                              <span className="text-[10px] text-gray-300">·</span>
                              <span className="text-[10px] text-gray-400">{fmtDateTime(item.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            </section>

          </div>
        </div>
      </div>

      {/* ── Modals ────────────────────────────────────────── */}

      {modal === 'encaminhar' && (
        <EncaminharModal currentPrestador={detalhe.prestadorNome} onClose={() => setModal(null)} onConfirm={handleEncaminhar} />
      )}

      {modal === 'cancelar' && (
        <ConfirmModal titulo="Cancelar Solicitação" descricao="Esta ação não pode ser desfeita. A solicitação será marcada como cancelada." confirmLabel="Confirmar Cancelamento" variant="danger" onClose={() => setModal(null)} onConfirm={handleCancelar} />
      )}

      {modal === 'fechar' && (
        <ConfirmModal titulo="Fechar Solicitação" descricao="Confirma que deseja encerrar esta solicitação?" confirmLabel="Confirmar Encerramento" variant="primary" onClose={() => setModal(null)} onConfirm={handleFechar} />
      )}

      {modal === 'disputa' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in duration-200">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center shrink-0">
                  <AlertOctagon size={16} className="text-orange-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Abrir Disputa</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Indique o motivo da disputa com clareza.</p>
                </div>
              </div>
              <button onClick={() => setModal(null)} className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer shrink-0">
                <X size={14} />
              </button>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Motivo <span className="text-red-500">*</span></label>
              <textarea
                value={disputaMotivo}
                onChange={e => setDisputaMotivo(e.target.value)}
                placeholder="Descreva o motivo da disputa..."
                rows={4}
                autoFocus
                className="w-full px-3 py-2.5 text-xs text-gray-800 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-orange-300 focus:bg-white resize-none transition-all placeholder:text-gray-400"
              />
            </div>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setModal(null)} className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:border-gray-400 transition-colors cursor-pointer">Cancelar</button>
              <button onClick={handleAbrirDisputa} disabled={!disputaMotivo.trim()} className="px-4 py-2 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer">
                Abrir Disputa
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
