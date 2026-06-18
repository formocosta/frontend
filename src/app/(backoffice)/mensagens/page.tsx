'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  MessageSquare, Search, Send, Paperclip, X,
  User, Users, AlertTriangle, Loader, FileText,
  CheckCheck, ArrowLeft,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

type EstadoConversa = 'ativa' | 'arquivada' | 'pendente';
type PapelRemetente = 'cliente' | 'prestador' | 'operador' | 'sistema';

interface Participante { nome: string }

interface Anexo {
  id: string; nome: string; tamanho: number; tipo: string; progresso: number;
}

interface Mensagem {
  id: string; remetente: string; papel: PapelRemetente;
  conteudo: string; timestamp: string; anexos?: Anexo[];
}

interface Conversa {
  id: string; solicitacaoId: string;
  cliente: Participante; prestador: Participante | null;
  ultimaMensagem: string; ultimaAt: string;
  naoLidas: number; estado: EstadoConversa;
  mensagens: Mensagem[];
}

interface PendingFile { id: string; file: File; progresso: number }

// ─────────────────────────────────────────────────────────────
// Mock data
// ─────────────────────────────────────────────────────────────

const MOCK: Conversa[] = [
  {
    id: 'conv-001', solicitacaoId: 'SS-009',
    cliente: { nome: 'Joaquim Pedro Ferreira' }, prestador: { nome: 'João Carlos Teles' },
    ultimaMensagem: 'Pode confirmar o horário para amanhã?', ultimaAt: '2026-06-18T10:45:00Z',
    naoLidas: 3, estado: 'ativa',
    mensagens: [
      { id: 'm1', remetente: 'Sistema',               papel: 'sistema',   conteudo: 'Conversa iniciada após encaminhamento da solicitação.', timestamp: '2026-06-11T10:30:00Z' },
      { id: 'm2', remetente: 'Joaquim Pedro Ferreira', papel: 'cliente',   conteudo: 'Bom dia, preciso que o serviço seja realizado de manhã. Conseguem?', timestamp: '2026-06-12T09:00:00Z' },
      { id: 'm3', remetente: 'Operador Maria',         papel: 'operador',  conteudo: 'Bom dia, Joaquim. Vou verificar a disponibilidade do prestador e respondo brevemente.', timestamp: '2026-06-12T09:15:00Z' },
      { id: 'm4', remetente: 'João Carlos Teles',      papel: 'prestador', conteudo: 'Tenho disponibilidade das 08h às 12h. Posso ir na quarta-feira.', timestamp: '2026-06-12T10:00:00Z' },
      { id: 'm5', remetente: 'Operador Maria',         papel: 'operador',  conteudo: 'Joaquim, o prestador tem disponibilidade na quarta-feira de manhã. Confirma?', timestamp: '2026-06-12T10:10:00Z' },
      { id: 'm6', remetente: 'Joaquim Pedro Ferreira', papel: 'cliente',   conteudo: 'Perfeito! Quarta de manhã está óptimo.', timestamp: '2026-06-12T11:00:00Z' },
      { id: 'm7', remetente: 'Joaquim Pedro Ferreira', papel: 'cliente',   conteudo: 'Pode confirmar o horário para amanhã?', timestamp: '2026-06-18T10:45:00Z' },
    ],
  },
  {
    id: 'conv-002', solicitacaoId: 'SS-016',
    cliente: { nome: 'Soraia Patrícia Mendes' }, prestador: { nome: 'Sandra Maria Costa' },
    ultimaMensagem: 'O trabalho foi iniciado esta manhã.', ultimaAt: '2026-06-18T08:30:00Z',
    naoLidas: 1, estado: 'ativa',
    mensagens: [
      { id: 'm1', remetente: 'Sistema',              papel: 'sistema',   conteudo: 'Conversa iniciada automaticamente.', timestamp: '2026-06-10T14:00:00Z' },
      { id: 'm2', remetente: 'Soraia Patrícia Mendes', papel: 'cliente', conteudo: 'Olá, quando podem começar?', timestamp: '2026-06-11T09:00:00Z' },
      { id: 'm3', remetente: 'Operador Carlos',      papel: 'operador',  conteudo: 'Bom dia Soraia. A prestadora tem disponibilidade a partir de segunda-feira.', timestamp: '2026-06-11T09:30:00Z' },
      { id: 'm4', remetente: 'Sandra Maria Costa',   papel: 'prestador', conteudo: 'Posso iniciar na segunda-feira às 09h.', timestamp: '2026-06-11T10:00:00Z' },
      { id: 'm5', remetente: 'Sandra Maria Costa',   papel: 'prestador', conteudo: 'O trabalho foi iniciado esta manhã.', timestamp: '2026-06-18T08:30:00Z' },
    ],
  },
  {
    id: 'conv-003', solicitacaoId: 'SS-022',
    cliente: { nome: 'Luís Filipe Correia' }, prestador: { nome: 'Vanessa Sofia Lima' },
    ultimaMensagem: 'Trouxe o equipamento necessário.', ultimaAt: '2026-06-17T16:20:00Z',
    naoLidas: 0, estado: 'ativa',
    mensagens: [
      { id: 'm1', remetente: 'Sistema',           papel: 'sistema',   conteudo: 'Conversa iniciada.', timestamp: '2026-06-15T10:00:00Z' },
      { id: 'm2', remetente: 'Luís Filipe Correia', papel: 'cliente', conteudo: 'Precisam de trazer equipamento de limpeza profunda?', timestamp: '2026-06-16T09:00:00Z' },
      { id: 'm3', remetente: 'Operador Kwame',    papel: 'operador',  conteudo: 'Transmiti o pedido à prestadora.', timestamp: '2026-06-16T09:15:00Z' },
      { id: 'm4', remetente: 'Vanessa Sofia Lima', papel: 'prestador', conteudo: 'Trouxe o equipamento necessário.', timestamp: '2026-06-17T16:20:00Z' },
    ],
  },
  {
    id: 'conv-004', solicitacaoId: 'SS-024',
    cliente: { nome: 'Jacinto Afonso Pereira' }, prestador: { nome: 'Rui Manuel Santos' },
    ultimaMensagem: 'O cliente pediu alteração na cor da sala.', ultimaAt: '2026-06-17T14:00:00Z',
    naoLidas: 2, estado: 'ativa',
    mensagens: [
      { id: 'm1', remetente: 'Sistema',              papel: 'sistema',   conteudo: 'Conversa iniciada.', timestamp: '2026-06-13T08:00:00Z' },
      { id: 'm2', remetente: 'Jacinto Afonso Pereira', papel: 'cliente', conteudo: 'Gostaria de mudar a cor da sala de branco para bege claro.', timestamp: '2026-06-17T13:00:00Z' },
      { id: 'm3', remetente: 'Operador Kwame',       papel: 'operador',  conteudo: 'O cliente pediu alteração na cor da sala.', timestamp: '2026-06-17T14:00:00Z' },
    ],
  },
  {
    id: 'conv-005', solicitacaoId: 'SS-011',
    cliente: { nome: 'Gabriel Augusto Lima' }, prestador: { nome: 'Rui Manuel Santos' },
    ultimaMensagem: 'Qual o prazo de instalação?', ultimaAt: '2026-06-17T11:30:00Z',
    naoLidas: 0, estado: 'ativa',
    mensagens: [
      { id: 'm1', remetente: 'Sistema',           papel: 'sistema',  conteudo: 'Conversa iniciada.', timestamp: '2026-06-14T09:00:00Z' },
      { id: 'm2', remetente: 'Gabriel Augusto Lima', papel: 'cliente', conteudo: 'Qual o prazo de instalação?', timestamp: '2026-06-17T11:30:00Z' },
    ],
  },
  {
    id: 'conv-006', solicitacaoId: 'SS-019',
    cliente: { nome: 'Horácio Manuel Teixeira' }, prestador: { nome: 'Catarina Isabel Lopes' },
    ultimaMensagem: 'Terminei a plantação. Tudo conforme solicitado.', ultimaAt: '2026-06-16T17:00:00Z',
    naoLidas: 0, estado: 'ativa',
    mensagens: [
      { id: 'm1', remetente: 'Sistema',               papel: 'sistema',   conteudo: 'Conversa iniciada.', timestamp: '2026-06-13T10:00:00Z' },
      { id: 'm2', remetente: 'Catarina Isabel Lopes', papel: 'prestador', conteudo: 'Terminei a plantação. Tudo conforme solicitado.', timestamp: '2026-06-16T17:00:00Z' },
    ],
  },
  {
    id: 'conv-007', solicitacaoId: 'SS-030',
    cliente: { nome: 'Felicidade Amélia Pires' }, prestador: { nome: 'Vanessa Sofia Lima' },
    ultimaMensagem: 'Serviço concluído. Obrigada pela preferência!', ultimaAt: '2026-06-15T18:00:00Z',
    naoLidas: 0, estado: 'arquivada',
    mensagens: [
      { id: 'm1', remetente: 'Sistema',              papel: 'sistema',   conteudo: 'Conversa iniciada.', timestamp: '2026-06-10T09:00:00Z' },
      { id: 'm2', remetente: 'Felicidade Amélia Pires', papel: 'cliente', conteudo: 'Quando chegam?', timestamp: '2026-06-10T10:00:00Z' },
      { id: 'm3', remetente: 'Vanessa Sofia Lima',   papel: 'prestador', conteudo: 'Chegamos às 09h como combinado.', timestamp: '2026-06-10T08:45:00Z' },
      { id: 'm4', remetente: 'Vanessa Sofia Lima',   papel: 'prestador', conteudo: 'Serviço concluído. Obrigada pela preferência!', timestamp: '2026-06-15T18:00:00Z' },
      { id: 'm5', remetente: 'Sistema',              papel: 'sistema',   conteudo: 'Conversa arquivada automaticamente após conclusão.', timestamp: '2026-06-15T18:01:00Z' },
    ],
  },
  {
    id: 'conv-008', solicitacaoId: 'SS-014',
    cliente: { nome: 'Marta Sofia Neves' }, prestador: { nome: 'António Ferreira Silva' },
    ultimaMensagem: 'Precisamos de reagendar a visita.', ultimaAt: '2026-06-15T09:00:00Z',
    naoLidas: 1, estado: 'pendente',
    mensagens: [
      { id: 'm1', remetente: 'Sistema',         papel: 'sistema',  conteudo: 'Conversa iniciada.', timestamp: '2026-06-14T14:00:00Z' },
      { id: 'm2', remetente: 'Marta Sofia Neves', papel: 'cliente', conteudo: 'Precisamos de reagendar a visita.', timestamp: '2026-06-15T09:00:00Z' },
    ],
  },
  {
    id: 'conv-009', solicitacaoId: 'SS-026',
    cliente: { nome: 'Domingos Paulo Azevedo' }, prestador: { nome: 'Catarina Isabel Lopes' },
    ultimaMensagem: 'Sistema de rega instalado com sucesso.', ultimaAt: '2026-06-14T16:30:00Z',
    naoLidas: 0, estado: 'ativa',
    mensagens: [
      { id: 'm1', remetente: 'Sistema',               papel: 'sistema',   conteudo: 'Conversa iniciada.', timestamp: '2026-06-12T09:00:00Z' },
      { id: 'm2', remetente: 'Catarina Isabel Lopes', papel: 'prestador', conteudo: 'Sistema de rega instalado com sucesso.', timestamp: '2026-06-14T16:30:00Z' },
    ],
  },
  {
    id: 'conv-010', solicitacaoId: 'SS-021',
    cliente: { nome: 'Ivone Graça Santos' }, prestador: { nome: 'Nelson Augusto Pires' },
    ultimaMensagem: 'O prestador ainda não respondeu.', ultimaAt: '2026-06-13T10:00:00Z',
    naoLidas: 0, estado: 'pendente',
    mensagens: [
      { id: 'm1', remetente: 'Sistema',         papel: 'sistema',   conteudo: 'Conversa iniciada.', timestamp: '2026-06-13T09:00:00Z' },
      { id: 'm2', remetente: 'Ivone Graça Santos', papel: 'cliente', conteudo: 'Olá, quando podem vir?', timestamp: '2026-06-13T09:30:00Z' },
      { id: 'm3', remetente: 'Operador Carlos', papel: 'operador',  conteudo: 'O prestador ainda não respondeu.', timestamp: '2026-06-13T10:00:00Z' },
    ],
  },
];

// Module-level store so state persists across React remounts within session
let _store: Conversa[] | null = null;
function getStore(): Conversa[] {
  if (!_store) _store = MOCK.map(c => ({ ...c, mensagens: [...c.mensagens] }));
  return _store;
}
function patchStore(id: string, updater: (c: Conversa) => Conversa) {
  if (!_store) return;
  _store = _store.map(c => c.id === id ? updater(c) : c);
}

// ─────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────

const ESTADO_CFG: Record<EstadoConversa, { label: string; dot: string; badge: string }> = {
  ativa:     { label: 'Ativa',     dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border border-emerald-100' },
  pendente:  { label: 'Pendente',  dot: 'bg-amber-400',   badge: 'bg-amber-50 text-amber-700 border border-amber-100' },
  arquivada: { label: 'Arquivada', dot: 'bg-gray-300',    badge: 'bg-gray-100 text-gray-500 border border-gray-200' },
};

const PAPEL_CFG: Record<PapelRemetente, { avatar: string; bubble: string; badge: string; label: string }> = {
  cliente:   { avatar: 'bg-blue-500 text-white',   bubble: 'bg-blue-50 text-blue-900 border border-blue-100 rounded-tl-sm',     badge: 'bg-blue-50 text-blue-600 border border-blue-100',     label: 'Cliente' },
  prestador: { avatar: 'bg-violet-500 text-white', bubble: 'bg-violet-50 text-violet-900 border border-violet-100 rounded-tl-sm', badge: 'bg-violet-50 text-violet-600 border border-violet-100', label: 'Prestador' },
  operador:  { avatar: 'bg-[#06241C] text-white',  bubble: 'bg-[#06241C] text-white rounded-tr-sm',                               badge: 'bg-gray-100 text-gray-600 border border-gray-200',    label: 'Operador' },
  sistema:   { avatar: 'bg-gray-200 text-gray-600', bubble: '',                                                                   badge: '',                                                     label: 'Sistema' },
};

// ─────────────────────────────────────────────────────────────
// Real-time abstraction
// ─────────────────────────────────────────────────────────────
//
// Replace the body of this hook with a real connection when the backend is ready.
//
// WebSocket example:
//   const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/mensagens/${conversaId}`);
//   ws.onmessage = e => onMessage(JSON.parse(e.data));
//   return () => ws.close();
//
// Polling example (every 5 s):
//   const timer = setInterval(() => {
//     fetch(`/api/mensagens/${conversaId}/poll`).then(r => r.json()).then(msgs => msgs.forEach(onMessage));
//   }, 5000);
//   return () => clearInterval(timer);
//
function useRealtimeMessages(conversaId: string | null, onMessage: (m: Mensagem) => void) {
  useEffect(() => {
    if (!conversaId) return;
    // No-op in mock mode — replace with real subscription above
    return () => { /* cleanup subscription */ };
  }, [conversaId, onMessage]);
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function uid() { return `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`; }

function initials(name: string) {
  return name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function fmtTime(iso: string) {
  try { return new Date(iso).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }); }
  catch { return ''; }
}

function fmtDateTime(iso: string) {
  try { return new Date(iso).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); }
  catch { return iso; }
}

function fmtRelative(iso: string) {
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1)  return 'agora';
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs  < 24) return `${hrs}h`;
    const days = Math.floor(hrs / 24);
    if (days === 1) return 'ontem';
    if (days < 7)  return `${days}d`;
    return new Date(iso).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' });
  } catch { return ''; }
}

function fmtBytes(b: number) {
  if (b < 1024)         return `${b} B`;
  if (b < 1024 * 1024)  return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
}

// ─────────────────────────────────────────────────────────────
// ConversaItem
// ─────────────────────────────────────────────────────────────

function ConversaItem({ conversa, active, onClick }: {
  conversa: Conversa; active: boolean; onClick: () => void;
}) {
  const cfg = ESTADO_CFG[conversa.estado];
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3.5 border-b border-gray-100 transition-colors last:border-0 ${active ? 'bg-emerald-50/70 border-l-2 border-l-emerald-500' : 'hover:bg-gray-50 bg-white border-l-2 border-l-transparent'}`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${active ? 'bg-[#06241C] text-white' : 'bg-emerald-100 text-emerald-800'}`}>
          {initials(conversa.cliente.nome)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1.5 mb-0.5">
            <span className={`text-xs font-bold font-mono truncate ${active ? 'text-emerald-800' : 'text-gray-900'}`}>
              {conversa.solicitacaoId}
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[10px] text-gray-400">{fmtRelative(conversa.ultimaAt)}</span>
              {conversa.naoLidas > 0 && (
                <span className="min-w-[16px] h-4 rounded-full bg-emerald-500 text-white text-[9px] font-bold flex items-center justify-center px-1">
                  {conversa.naoLidas > 9 ? '9+' : conversa.naoLidas}
                </span>
              )}
            </div>
          </div>
          <p className="text-[10px] text-gray-500 font-medium truncate mb-1">
            {conversa.cliente.nome}
            {conversa.prestador && <> · {conversa.prestador.nome}</>}
          </p>
          <p className={`text-[10px] truncate leading-relaxed ${conversa.naoLidas > 0 ? 'text-gray-700 font-semibold' : 'text-gray-400'}`}>
            {conversa.ultimaMensagem}
          </p>
          <div className="mt-1.5 flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
            <span className="text-[9px] text-gray-400 font-medium">{cfg.label}</span>
          </div>
        </div>
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// MsgBubble
// ─────────────────────────────────────────────────────────────

function MsgBubble({ msg }: { msg: Mensagem }) {
  const isOp  = msg.papel === 'operador';
  const isSys = msg.papel === 'sistema';
  const cfg   = PAPEL_CFG[msg.papel];

  if (isSys) {
    return (
      <div className="flex justify-center my-1">
        <span className="text-[10px] text-gray-400 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
          {msg.conteudo}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex gap-2.5 ${isOp ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${cfg.avatar}`}>
        {initials(msg.remetente)}
      </div>

      <div className={`flex flex-col max-w-[72%] gap-1 ${isOp ? 'items-end' : 'items-start'}`}>
        {/* Meta row */}
        <div className={`flex items-center gap-2 px-0.5 flex-wrap ${isOp ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-[10px] font-bold text-gray-700">{msg.remetente}</span>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${cfg.badge}`}>
            {cfg.label}
          </span>
          <span className="text-[10px] text-gray-400">{fmtTime(msg.timestamp)}</span>
        </div>

        {/* Bubble */}
        <div className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${cfg.bubble}`}>
          {msg.conteudo}
          {msg.anexos && msg.anexos.length > 0 && (
            <div className="mt-2 space-y-1.5">
              {msg.anexos.map(a => (
                <div key={a.id} className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-2.5 py-1.5">
                  <FileText size={11} className="shrink-0 opacity-70" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold truncate">{a.nome}</p>
                    <p className="text-[9px] opacity-60">{fmtBytes(a.tamanho)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Datetime */}
        <span className="text-[9px] text-gray-400 px-0.5">{fmtDateTime(msg.timestamp)}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// FileProgress
// ─────────────────────────────────────────────────────────────

function FileProgress({ file, progresso, onRemove }: {
  file: File; progresso: number; onRemove: () => void;
}) {
  const pct      = Math.min(100, Math.round(progresso));
  const complete = pct >= 100;
  return (
    <div className="flex items-center gap-2.5 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl">
      <div className="w-7 h-7 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
        <FileText size={12} className="text-emerald-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold text-gray-800 truncate">{file.name}</p>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-200 ${complete ? 'bg-emerald-500' : 'bg-emerald-400'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-[9px] font-mono text-gray-400 shrink-0 w-7 text-right">
            {complete ? <CheckCheck size={9} className="text-emerald-500 inline" /> : `${pct}%`}
          </span>
        </div>
        <p className="text-[9px] text-gray-400 mt-0.5">{fmtBytes(file.size)}</p>
      </div>
      <button
        onClick={onRemove}
        className="w-5 h-5 rounded-md hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer shrink-0"
      >
        <X size={10} />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Skeleton
// ─────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="h-full flex gap-4 animate-pulse">
      <div className="w-[320px] shrink-0 bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
          <div className="h-8 bg-gray-100 rounded-xl" />
        </div>
        <div className="flex-1 divide-y divide-gray-100">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex gap-3 px-4 py-3.5">
              <div className="w-9 h-9 rounded-full bg-gray-200 shrink-0" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-2.5 bg-gray-100 rounded w-full" />
                <div className="h-2.5 bg-gray-100 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-xs flex flex-col">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gray-100" />
          <div className="h-3 bg-gray-100 rounded w-40" />
          <div className="h-2.5 bg-gray-100 rounded w-56" />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────

export default function MensagensPage() {
  const [conversas,   setConversas]   = useState<Conversa[]>([]);
  const [isLoading,   setIsLoading]   = useState(true);
  const [error,       setError]       = useState<string | null>(null);
  const [selectedId,  setSelectedId]  = useState<string | null>(null);
  const [search,      setSearch]      = useState('');
  const [filtro,      setFiltro]      = useState<EstadoConversa | 'todas'>('todas');
  const [msgInput,    setMsgInput]    = useState('');
  const [isSending,   setIsSending]   = useState(false);
  const [pending,     setPending]     = useState<PendingFile[]>([]);
  const [mobileView,  setMobileView]  = useState<'lista' | 'painel'>('lista');

  const msgListRef   = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const loadRef      = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Load ─────────────────────────────────────────────────
  const load = useCallback(() => {
    setIsLoading(true); setError(null);
    if (loadRef.current) clearTimeout(loadRef.current);
    loadRef.current = setTimeout(() => {
      try { setConversas([...getStore()]); setIsLoading(false); }
      catch { setError('Erro ao carregar conversas.'); setIsLoading(false); }
    }, 400);
  }, []);

  useEffect(() => {
    load();
    return () => { if (loadRef.current) clearTimeout(loadRef.current); };
  }, [load]);

  // ── Scroll to bottom on new messages ────────────────────
  useEffect(() => {
    if (msgListRef.current) msgListRef.current.scrollTop = msgListRef.current.scrollHeight;
  }, [selectedId, conversas]);

  // ── Real-time hook (pluggable) ───────────────────────────
  const handleRealtime = useCallback((msg: Mensagem) => {
    patchStore(selectedId!, c => ({
      ...c,
      mensagens: [...c.mensagens, msg],
      ultimaMensagem: msg.conteudo,
      ultimaAt: msg.timestamp,
    }));
    setConversas([...getStore()]);
  }, [selectedId]);

  useRealtimeMessages(selectedId, handleRealtime);

  // ── File upload simulation ───────────────────────────────
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const newPending: PendingFile[] = files.map(f => ({ id: uid(), file: f, progresso: 0 }));
    setPending(prev => [...prev, ...newPending]);
    newPending.forEach(pf => {
      let pct = 0;
      const iv = setInterval(() => {
        pct += Math.random() * 30 + 10;
        if (pct >= 100) { pct = 100; clearInterval(iv); }
        setPending(prev => prev.map(p => p.id === pf.id ? { ...p, progresso: pct } : p));
      }, 180);
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Send ─────────────────────────────────────────────────
  const handleSend = useCallback(() => {
    const texto = msgInput.trim();
    if ((!texto && pending.length === 0) || isSending || !selectedId) return;
    setMsgInput('');
    setPending([]);
    setIsSending(true);
    const readyFiles = pending.filter(p => p.progresso >= 100);
    setTimeout(() => {
      const nova: Mensagem = {
        id: uid(),
        remetente: 'Operador Atual',
        papel: 'operador',
        conteudo: texto || '(ficheiro anexado)',
        timestamp: new Date().toISOString(),
        anexos: readyFiles.map(pf => ({
          id: pf.id, nome: pf.file.name,
          tamanho: pf.file.size, tipo: pf.file.type, progresso: 100,
        })),
      };
      patchStore(selectedId, c => ({
        ...c,
        mensagens: [...c.mensagens, nova],
        ultimaMensagem: nova.conteudo,
        ultimaAt: nova.timestamp,
      }));
      setConversas([...getStore()]);
      setIsSending(false);
    }, 280);
  }, [msgInput, pending, isSending, selectedId]);

  // ── Select conversation ──────────────────────────────────
  const selectConversa = (c: Conversa) => {
    patchStore(c.id, x => ({ ...x, naoLidas: 0 }));
    setConversas([...getStore()]);
    setSelectedId(c.id);
    setMobileView('painel');
  };

  const selected = conversas.find(c => c.id === selectedId) ?? null;

  const filtered = conversas.filter(c => {
    const q = search.toLowerCase();
    const matchQ = !q
      || c.solicitacaoId.toLowerCase().includes(q)
      || c.cliente.nome.toLowerCase().includes(q)
      || (c.prestador?.nome.toLowerCase().includes(q) ?? false)
      || c.ultimaMensagem.toLowerCase().includes(q);
    const matchE = filtro === 'todas' || c.estado === filtro;
    return matchQ && matchE;
  });

  const totalNaoLidas = conversas.reduce((s, c) => s + c.naoLidas, 0);

  // ─────────────────────────────────────────────────────────
  if (isLoading) return <Skeleton />;

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-12 flex flex-col items-center gap-4 text-center max-w-sm w-full">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
            <AlertTriangle size={20} className="text-red-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Erro ao carregar</h3>
            <p className="text-xs text-gray-500 mt-1">{error}</p>
          </div>
          <button onClick={load} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:border-gray-400 transition-colors cursor-pointer">
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────
  return (
    <div className="h-full flex flex-col gap-4">

      {/* Filter tabs */}
      <div className="shrink-0 flex items-center gap-1.5 flex-wrap">
        {(['todas', 'ativa', 'pendente', 'arquivada'] as const).map(e => (
          <button
            key={e}
            onClick={() => setFiltro(e)}
            className={`px-3 py-1.5 text-[10px] font-bold rounded-lg border transition-colors cursor-pointer ${
              filtro === e
                ? 'bg-[#06241C] text-white border-[#06241C]'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-800'
            }`}
          >
            {e === 'todas' ? 'Todas' : ESTADO_CFG[e].label}
          </button>
        ))}
      </div>

      {/* Split layout */}
      <div className="flex-1 min-h-0 flex gap-4">

        {/* ── Left: list ─────────────────────────────────── */}
        <div className={`${mobileView === 'painel' ? 'hidden md:flex' : 'flex'} w-full md:w-[320px] lg:w-[360px] shrink-0 flex-col bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden`}>

          {/* Search */}
          <div className="shrink-0 px-4 py-3 border-b border-gray-100 bg-gray-50/50">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="ID, cliente, prestador..."
                className="w-full pl-8 pr-8 py-2 text-xs bg-white border border-gray-200 rounded-xl outline-none focus:border-emerald-400 transition-colors placeholder:text-gray-400"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X size={11} />
                </button>
              )}
            </div>
          </div>

          {/* Count */}
          {(search || filtro !== 'todas') && (
            <div className="shrink-0 px-4 py-2 border-b border-gray-100 bg-gray-50/30">
              <span className="text-[10px] text-gray-400 font-medium">
                {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}

          {/* Conversation list */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 px-4 text-center">
                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                  <MessageSquare size={18} className="text-gray-300" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-600">Sem conversas</p>
                  <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">
                    {search ? 'Nenhum resultado para a pesquisa.' : 'Não existem conversas nesta categoria.'}
                  </p>
                </div>
                {(search || filtro !== 'todas') && (
                  <button
                    onClick={() => { setSearch(''); setFiltro('todas'); }}
                    className="text-[10px] text-emerald-600 font-semibold hover:text-emerald-700 cursor-pointer"
                  >
                    Limpar filtros
                  </button>
                )}
              </div>
            ) : (
              filtered.map(c => (
                <ConversaItem
                  key={c.id}
                  conversa={c}
                  active={c.id === selectedId}
                  onClick={() => selectConversa(c)}
                />
              ))
            )}
          </div>
        </div>

        {/* ── Right: panel ───────────────────────────────── */}
        <div className={`${mobileView === 'lista' ? 'hidden md:flex' : 'flex'} flex-1 min-w-0 flex-col bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden`}>

          {!selected ? (
            /* Empty / no selection */
            <div className="flex-1 flex flex-col items-center justify-center gap-5 text-center p-8">
              <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center">
                <MessageSquare size={28} className="text-emerald-400" />
              </div>
              <div className="max-w-xs">
                <h3 className="text-sm font-bold text-gray-900">Selecione uma conversa</h3>
                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                  Escolha uma conversa na lista para visualizar o histórico e enviar mensagens como operador intermediário.
                </p>
              </div>
              {/* Legend */}
              <div className="flex items-center gap-5 text-[10px] text-gray-400 font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                  <span>Cliente</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-400" />
                  <span>Prestador</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#06241C]" />
                  <span>Operador</span>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Panel header */}
              <div className="shrink-0 px-5 py-3.5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                {/* Mobile back */}
                <button
                  className="md:hidden w-7 h-7 rounded-lg hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors cursor-pointer shrink-0"
                  onClick={() => setMobileView('lista')}
                >
                  <ArrowLeft size={15} />
                </button>
                <div className="w-9 h-9 rounded-full bg-[#06241C] flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                  {initials(selected.cliente.nome)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-gray-900 font-mono">{selected.solicitacaoId}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${ESTADO_CFG[selected.estado].badge}`}>
                      {ESTADO_CFG[selected.estado].label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                    <div className="flex items-center gap-1 min-w-0">
                      <User size={10} className="text-blue-400 shrink-0" />
                      <span className="text-[10px] text-gray-500 font-medium truncate">{selected.cliente.nome}</span>
                    </div>
                    {selected.prestador && (
                      <>
                        <span className="text-gray-300 text-[10px]">·</span>
                        <div className="flex items-center gap-1 min-w-0">
                          <Users size={10} className="text-violet-400 shrink-0" />
                          <span className="text-[10px] text-gray-500 font-medium truncate">{selected.prestador.nome}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 hidden sm:block shrink-0">
                  {selected.mensagens.length} mensagens
                </span>
              </div>

              {/* Colour legend */}
              <div className="shrink-0 px-5 py-1.5 border-b border-gray-100 bg-gray-50/20 flex items-center gap-5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  <span className="text-[9px] text-gray-400 font-medium">Cliente</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-violet-400" />
                  <span className="text-[9px] text-gray-400 font-medium">Prestador</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#06241C]" />
                  <span className="text-[9px] text-gray-400 font-medium">Operador</span>
                </div>
              </div>

              {/* Messages */}
              <div
                ref={msgListRef}
                className="flex-1 min-h-0 overflow-y-auto px-5 py-5 space-y-4 bg-gray-50/20"
              >
                {selected.mensagens.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center gap-3 text-center">
                    <MessageSquare size={24} className="text-gray-300" />
                    <p className="text-xs text-gray-400">Nenhuma mensagem nesta conversa ainda.</p>
                  </div>
                ) : (
                  selected.mensagens.map(msg => <MsgBubble key={msg.id} msg={msg} />)
                )}
              </div>

              {/* Pending file previews */}
              {pending.length > 0 && (
                <div className="shrink-0 px-5 py-2.5 border-t border-gray-100 space-y-1.5 bg-gray-50/30">
                  {pending.map(pf => (
                    <FileProgress
                      key={pf.id}
                      file={pf.file}
                      progresso={pf.progresso}
                      onRemove={() => setPending(prev => prev.filter(p => p.id !== pf.id))}
                    />
                  ))}
                </div>
              )}

              {/* Compose */}
              <div className="shrink-0 px-5 py-4 border-t border-gray-100">
                <div className="flex gap-2.5 items-end">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    title="Anexar ficheiro"
                    className="w-9 h-9 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all cursor-pointer shrink-0"
                  >
                    <Paperclip size={14} />
                  </button>
                  <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileSelect} />

                  <textarea
                    value={msgInput}
                    onChange={e => setMsgInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
                    }}
                    placeholder="Escreva como operador intermediário... (Enter para enviar, Shift+Enter para nova linha)"
                    rows={2}
                    className="flex-1 px-3.5 py-2.5 text-xs text-gray-800 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-400 focus:bg-white resize-none transition-all placeholder:text-gray-400"
                  />

                  <button
                    onClick={handleSend}
                    disabled={(!msgInput.trim() && pending.length === 0) || isSending}
                    className="w-9 h-9 bg-[#06241C] hover:bg-[#0B392E] text-white rounded-xl transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shrink-0"
                  >
                    {isSending
                      ? <Loader size={13} className="animate-spin" />
                      : <Send size={13} />}
                  </button>
                </div>
                <p className="text-[9px] text-gray-400 mt-1.5">
                  A comunicar como operador intermediário · Os contactos nunca são partilhados entre as partes
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
