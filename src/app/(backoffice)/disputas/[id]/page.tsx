'use client';

import { use, useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft, AlertTriangle, RotateCw, Send, X,
  CheckCircle2, Clock, User, CreditCard, Activity,
  MessageSquare, Loader, FileText, Shield, AlertOctagon,
  CheckCheck, Bell, Scale, ChevronDown, ChevronUp,
  User2, Banknote, History,
} from 'lucide-react';
import {
  getDisputasStore, patchDisputasStore,
  STATUS_CFG, MOTIVO_CFG,
  type Disputa, type StatusDisputa,
} from '../page';

// ─────────────────────────────────────────────────────────────
// Local types (dispute-level detail)
// ─────────────────────────────────────────────────────────────

type PapelMsg = 'operador' | 'cliente' | 'prestador' | 'sistema';

interface MsgDisputa {
  id: string;
  autor: string;
  papel: PapelMsg;
  conteudo: string;
  timestamp: string;
}

type TipoAudit =
  | 'abertura' | 'status' | 'mensagem' | 'resolucao'
  | 'notificacao' | 'encerramento' | 'atribuicao';

interface AuditItem {
  id: string;
  timestamp: string;
  utilizador: string;
  tipo: TipoAudit;
  descricao: string;
}

interface DisputaDetalhe extends Disputa {
  operadorResponsavel: string | null;
  servico: string;
  mensagensDisputa: MsgDisputa[];
  auditoria: AuditItem[];
  solicitacaoPagamento: { id: string; valor: number; status: string } | null;
  solicitacaoRepasse:   { id: string; valor: number; status: string } | null;
  solicitacaoTimeline:  Array<{ label: string; timestamp: string; color: string }>;
}

// ─────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────

const PAPEL_CFG: Record<PapelMsg, { bubble: string; label: string; avatarBg: string; align: 'left' | 'right' | 'center' }> = {
  sistema:   { bubble: 'bg-gray-100 text-gray-600',                         label: 'Sistema',   avatarBg: 'bg-gray-400',   align: 'center' },
  cliente:   { bubble: 'bg-blue-50 border border-blue-100 text-gray-800',    label: 'Cliente',   avatarBg: 'bg-blue-500',   align: 'left' },
  prestador: { bubble: 'bg-violet-50 border border-violet-100 text-gray-800',label: 'Prestador', avatarBg: 'bg-violet-500', align: 'left' },
  operador:  { bubble: 'bg-[#06241C] text-white',                            label: 'Operador',  avatarBg: 'bg-emerald-700',align: 'right' },
};

const AUDIT_CFG: Record<TipoAudit, { dot: string; icon: React.ElementType }> = {
  abertura:    { dot: 'bg-red-500',     icon: AlertOctagon },
  status:      { dot: 'bg-blue-400',    icon: Activity },
  mensagem:    { dot: 'bg-gray-400',    icon: MessageSquare },
  resolucao:   { dot: 'bg-emerald-500', icon: CheckCheck },
  notificacao: { dot: 'bg-indigo-400',  icon: Bell },
  encerramento:{ dot: 'bg-gray-600',    icon: Shield },
  atribuicao:  { dot: 'bg-violet-500',  icon: User },
};

// ─────────────────────────────────────────────────────────────
// Mock builder
// ─────────────────────────────────────────────────────────────

function buildMsgsPorStatus(status: StatusDisputa, clienteNome: string, prestadorNome: string): MsgDisputa[] {
  const base: MsgDisputa[] = [
    { id: 'md1', autor: 'Sistema', papel: 'sistema', conteudo: 'Disputa registada e atribuída para análise.', timestamp: '2026-06-14T09:00:00Z' },
    { id: 'md2', autor: clienteNome, papel: 'cliente', conteudo: 'Bom dia, vim aqui reportar um problema sério com o serviço que recebi. Espero uma resolução rápida.', timestamp: '2026-06-14T09:15:00Z' },
    { id: 'md3', autor: 'Operador Carlos', papel: 'operador', conteudo: `Bom dia, ${clienteNome.split(' ')[0]}. Recebemos a sua reclamação e já iniciámos o processo de análise. Iremos contactar o prestador brevemente.`, timestamp: '2026-06-14T10:00:00Z' },
  ];
  if (['em_analise', 'resolvida', 'encerrada'].includes(status)) {
    base.push(
      { id: 'md4', autor: prestadorNome, papel: 'prestador', conteudo: 'Bom dia. Lamento a situação. Posso explicar o que aconteceu do meu lado.', timestamp: '2026-06-15T08:30:00Z' },
      { id: 'md5', autor: 'Operador Carlos', papel: 'operador', conteudo: 'Agradecemos a resposta. Pedimos que forneça evidências do serviço prestado no prazo de 48 horas.', timestamp: '2026-06-15T09:00:00Z' },
      { id: 'md6', autor: prestadorNome, papel: 'prestador', conteudo: 'Enviei as fotografias e o contrato assinado pelo cliente. Confirmo que o serviço foi realizado conforme acordado.', timestamp: '2026-06-15T14:00:00Z' },
    );
  }
  if (['resolvida', 'encerrada'].includes(status)) {
    base.push(
      { id: 'md7', autor: 'Operador Carlos', papel: 'operador', conteudo: 'Após análise de todas as evidências, chegámos a uma decisão. A resolução será comunicada a ambas as partes.', timestamp: '2026-06-16T10:00:00Z' },
      { id: 'md8', autor: 'Sistema', papel: 'sistema', conteudo: 'Disputa resolvida. Ambas as partes foram notificadas por email.', timestamp: '2026-06-16T10:30:00Z' },
    );
  }
  return base;
}

function buildAuditoriaPorStatus(status: StatusDisputa, dataAbertura: string, dataResolucao: string | null): AuditItem[] {
  const items: AuditItem[] = [
    { id: 'a1', timestamp: `${dataAbertura}T09:00:00Z`, utilizador: 'Sistema',          tipo: 'abertura',   descricao: 'Disputa aberta e registada no sistema' },
    { id: 'a2', timestamp: `${dataAbertura}T09:05:00Z`, utilizador: 'Sistema',          tipo: 'atribuicao', descricao: 'Disputa atribuída ao Operador Carlos' },
    { id: 'a3', timestamp: `${dataAbertura}T10:00:00Z`, utilizador: 'Operador Carlos',  tipo: 'mensagem',   descricao: 'Mensagem enviada ao cliente' },
  ];
  if (['em_analise', 'resolvida', 'encerrada'].includes(status)) {
    const d2 = dataAbertura.replace(/\d{2}$/, '15');
    items.push(
      { id: 'a4', timestamp: `${d2}T08:30:00Z`, utilizador: 'Sistema',         tipo: 'status',    descricao: 'Status alterado: Aberta → Em Análise' },
      { id: 'a5', timestamp: `${d2}T09:00:00Z`, utilizador: 'Operador Carlos', tipo: 'mensagem',  descricao: 'Mensagem enviada ao prestador solicitando evidências' },
      { id: 'a6', timestamp: `${d2}T14:00:00Z`, utilizador: 'Sistema',         tipo: 'mensagem',  descricao: 'Prestador submeteu evidências' },
    );
  }
  if ((status === 'resolvida' || status === 'encerrada') && dataResolucao) {
    items.push(
      { id: 'a7', timestamp: `${dataResolucao}T10:00:00Z`, utilizador: 'Operador Carlos', tipo: 'resolucao',    descricao: 'Resolução registada pelo operador' },
      { id: 'a8', timestamp: `${dataResolucao}T10:00:00Z`, utilizador: 'Sistema',          tipo: 'status',       descricao: 'Status alterado: Em Análise → Resolvida' },
      { id: 'a9', timestamp: `${dataResolucao}T10:30:00Z`, utilizador: 'Sistema',          tipo: 'notificacao',  descricao: 'Partes notificadas por email (cliente + prestador)' },
    );
  }
  if (status === 'encerrada') {
    const dEnc = dataResolucao ?? dataAbertura;
    items.push(
      { id: 'a10', timestamp: `${dEnc}T11:00:00Z`, utilizador: 'Operador Carlos', tipo: 'encerramento', descricao: 'Disputa encerrada definitivamente' },
      { id: 'a11', timestamp: `${dEnc}T11:00:00Z`, utilizador: 'Sistema',          tipo: 'status',       descricao: 'Status alterado: Resolvida → Encerrada' },
    );
  }
  return items.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

let _detailCache: Record<string, DisputaDetalhe> = {};

function getDisputaDetalhe(id: string): DisputaDetalhe | null {
  if (_detailCache[id]) return _detailCache[id];
  const store = getDisputasStore();
  const base  = store.find(d => d.id === id);
  if (!base) return null;

  const detail: DisputaDetalhe = {
    ...base,
    operadorResponsavel: 'Operador Carlos',
    mensagensDisputa: buildMsgsPorStatus(base.status, base.clienteNome, base.prestadorNome),
    auditoria: buildAuditoriaPorStatus(base.status, base.dataAbertura, base.dataResolucao),
    solicitacaoPagamento: base.valorEmDisputa !== null
      ? { id: `PAG-${id.slice(-3)}`, valor: base.valorEmDisputa, status: base.status === 'resolvida' || base.status === 'encerrada' ? 'reembolsado' : 'em_disputa' }
      : null,
    solicitacaoRepasse: null,
    solicitacaoTimeline: [
      { label: 'Solicitação submetida',   timestamp: '2026-06-10T09:00:00Z', color: 'bg-amber-400' },
      { label: 'Em análise pelo operador', timestamp: '2026-06-11T10:00:00Z', color: 'bg-blue-400' },
      { label: 'Encaminhada ao prestador', timestamp: '2026-06-12T14:00:00Z', color: 'bg-violet-500' },
      { label: 'Serviço em execução',      timestamp: base.dataAbertura + 'T08:00:00Z', color: 'bg-indigo-500' },
      { label: 'Disputa aberta',           timestamp: base.dataAbertura + 'T09:00:00Z', color: 'bg-red-500' },
    ],
  };
  _detailCache[id] = detail;
  return detail;
}

function patchDetailCache(id: string, updater: (d: DisputaDetalhe) => DisputaDetalhe) {
  if (_detailCache[id]) _detailCache[id] = updater(_detailCache[id]);
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function fmtTs(iso: string) {
  try {
    return new Date(iso).toLocaleString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch { return iso; }
}
function fmtDate(iso: string) {
  try {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' });
  } catch { return iso; }
}
function fmtAOA(v: number) { return v.toLocaleString('pt-PT') + ' AOA'; }
function initials(nome: string) { return nome.split(' ').slice(0, 2).map(n => n[0]).join(''); }

// ─────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────

function SectionCard({ title, icon: Icon, children, defaultOpen = true }: {
  title: string; icon: React.ElementType; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50/60 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <Icon size={14} className="text-gray-500 shrink-0" />
          <span className="text-sm font-bold text-gray-900">{title}</span>
        </div>
        {open ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
      </button>
      {open && <div className="border-t border-gray-100">{children}</div>}
    </div>
  );
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 text-xs py-2.5 border-b border-gray-50 last:border-0">
      <span className="text-gray-500 shrink-0">{label}</span>
      <div className="text-right font-semibold text-gray-800">{children}</div>
    </div>
  );
}

function MsgBubble({ msg }: { msg: MsgDisputa }) {
  const cfg = PAPEL_CFG[msg.papel];
  if (cfg.align === 'center') {
    return (
      <div className="flex justify-center">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-medium ${cfg.bubble}`}>
          <span className="text-gray-400">{fmtTs(msg.timestamp)}</span>
          <span>·</span>
          <span>{msg.conteudo}</span>
        </div>
      </div>
    );
  }
  const isRight = cfg.align === 'right';
  return (
    <div className={`flex items-end gap-2 ${isRight ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${cfg.avatarBg}`}>
        {initials(msg.autor)}
      </div>
      <div className={`max-w-[75%] ${isRight ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
        <div className={`flex items-center gap-1.5 text-[10px] text-gray-400 ${isRight ? 'flex-row-reverse' : ''}`}>
          <span className="font-semibold text-gray-600">{msg.autor}</span>
          <span>·</span>
          <span>{fmtTs(msg.timestamp)}</span>
        </div>
        <div className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${cfg.bubble} ${isRight ? 'rounded-br-sm' : 'rounded-bl-sm'}`}>
          {msg.conteudo}
        </div>
      </div>
    </div>
  );
}

function AuditRow({ item }: { item: AuditItem }) {
  const cfg = AUDIT_CFG[item.tipo];
  const Icon = cfg.icon;
  return (
    <div className="flex gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="flex flex-col items-center gap-1 shrink-0">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${cfg.dot}`}>
          <Icon size={11} className="text-white" />
        </div>
        <div className="w-px flex-1 bg-gray-100" />
      </div>
      <div className="flex-1 min-w-0 pb-1">
        <p className="text-xs font-medium text-gray-800 leading-snug">{item.descricao}</p>
        <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400">
          <span className="font-semibold text-gray-500">{item.utilizador}</span>
          <span>·</span>
          <span>{fmtTs(item.timestamp)}</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Resolution panel
// ─────────────────────────────────────────────────────────────

function ResolutionPanel({
  disputa,
  onResolved,
  onNotified,
}: {
  disputa: DisputaDetalhe;
  onResolved: (resolucao: string) => void;
  onNotified: () => void;
}) {
  const [resolucao,   setResolucao]   = useState(disputa.resolucao ?? '');
  const [busyResolve, setBusyResolve] = useState(false);
  const [busyNotify,  setBusyNotify]  = useState(false);
  const [touched,     setTouched]     = useState(false);

  const isResolved   = disputa.status === 'resolvida' || disputa.status === 'encerrada';
  const canClose     = disputa.status === 'aberta' || disputa.status === 'em_analise';
  const canNotify    = isResolved && !disputa.partesNotificadas;
  const invalid      = touched && !resolucao.trim();

  const handleClose = () => {
    setTouched(true);
    if (!resolucao.trim() || busyResolve) return;
    setBusyResolve(true);
    setTimeout(() => { onResolved(resolucao.trim()); setBusyResolve(false); }, 600);
  };

  const handleNotify = () => {
    setBusyNotify(true);
    setTimeout(() => { onNotified(); setBusyNotify(false); }, 700);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100">
        <Scale size={14} className="text-gray-500 shrink-0" />
        <span className="text-sm font-bold text-gray-900">Resolução da Disputa</span>
        {isResolved && (
          <span className={`ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${STATUS_CFG[disputa.status].classes}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CFG[disputa.status].dot}`} />
            {STATUS_CFG[disputa.status].label}
          </span>
        )}
      </div>

      <div className="p-5 space-y-4">
        {/* Resolved notice */}
        {isResolved && (
          <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
            <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-emerald-800">Disputa encerrada</p>
              {disputa.dataResolucao && (
                <p className="text-[10px] text-emerald-600 mt-0.5">Resolvida em {fmtDate(disputa.dataResolucao)}</p>
              )}
            </div>
          </div>
        )}

        {/* Resolution field */}
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
            {isResolved ? 'Resolução registada' : 'Resolução'}
            {!isResolved && <span className="text-red-500 ml-1">*</span>}
          </label>
          <textarea
            value={isResolved ? (disputa.resolucao ?? '') : resolucao}
            onChange={e => !isResolved && setResolucao(e.target.value)}
            onBlur={() => setTouched(true)}
            readOnly={isResolved}
            rows={4}
            placeholder="Descreva a resolução da disputa com detalhe. Este campo é obrigatório para encerrar a disputa."
            className={`w-full px-3.5 py-2.5 text-xs text-gray-800 bg-white border rounded-xl outline-none transition-all placeholder:text-gray-400 resize-none leading-relaxed
              ${isResolved ? 'bg-gray-50 text-gray-600 cursor-default border-gray-100' : invalid ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-emerald-400'}`}
          />
          {invalid && (
            <p className="text-[10px] text-red-500 mt-1 font-medium">
              A resolução é obrigatória para encerrar a disputa.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          {canClose && (
            <button
              onClick={handleClose}
              disabled={busyResolve}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl disabled:opacity-50 transition-colors cursor-pointer"
            >
              {busyResolve ? <Loader size={11} className="animate-spin" /> : <CheckCheck size={11} />}
              Fechar Disputa
            </button>
          )}

          {canNotify && (
            <button
              onClick={handleNotify}
              disabled={busyNotify}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl disabled:opacity-50 transition-colors cursor-pointer"
            >
              {busyNotify ? <Loader size={11} className="animate-spin" /> : <Bell size={11} />}
              Notificar Partes
            </button>
          )}

          {isResolved && disputa.partesNotificadas && (
            <div className="inline-flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-xl">
              <Bell size={10} />
              Partes notificadas
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────

export default function DisputaDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router  = useRouter();

  const [disputa,   setDisputa]   = useState<DisputaDetalhe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState<string | null>(null);
  const [success,   setSuccess]   = useState<string | null>(null);
  const [newMsg,    setNewMsg]     = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  const loadRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const successRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const msgEndRef  = useRef<HTMLDivElement | null>(null);

  const load = useCallback(() => {
    setIsLoading(true); setError(null);
    if (loadRef.current) clearTimeout(loadRef.current);
    loadRef.current = setTimeout(() => {
      const d = getDisputaDetalhe(id);
      if (d) { setDisputa({ ...d }); setIsLoading(false); }
      else   { setError('Disputa não encontrada.'); setIsLoading(false); }
    }, 350);
  }, [id]);

  useEffect(() => {
    load();
    return () => { if (loadRef.current) clearTimeout(loadRef.current); if (successRef.current) clearTimeout(successRef.current); };
  }, [load]);

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [disputa?.mensagensDisputa.length]);

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    if (successRef.current) clearTimeout(successRef.current);
    successRef.current = setTimeout(() => setSuccess(null), 3500);
  };

  const handleResolved = (resolucao: string) => {
    if (!disputa) return;
    const today = new Date().toISOString().slice(0, 10);
    const nowIso = new Date().toISOString();
    const newAudit: AuditItem[] = [
      { id: `a-res-1`, timestamp: nowIso, utilizador: 'Operador Carlos', tipo: 'resolucao',    descricao: 'Resolução registada pelo operador' },
      { id: `a-res-2`, timestamp: nowIso, utilizador: 'Sistema',          tipo: 'status',       descricao: 'Status alterado: Em Análise → Resolvida' },
    ];
    const updated: DisputaDetalhe = {
      ...disputa,
      status: 'resolvida',
      resolucao,
      dataResolucao: today,
      dataUltimaAtualizacao: today,
      auditoria: [...newAudit, ...disputa.auditoria],
    };
    patchDetailCache(id, () => updated);
    patchDisputasStore(id, d => ({ ...d, status: 'resolvida', resolucao, dataResolucao: today }));
    setDisputa(updated);
    showSuccess('Disputa encerrada com sucesso.');
  };

  const handleNotified = () => {
    if (!disputa) return;
    const nowIso = new Date().toISOString();
    const newAudit: AuditItem = { id: `a-not`, timestamp: nowIso, utilizador: 'Sistema', tipo: 'notificacao', descricao: 'Partes notificadas por email (cliente + prestador)' };
    const updated: DisputaDetalhe = {
      ...disputa,
      partesNotificadas: true,
      auditoria: [newAudit, ...disputa.auditoria],
    };
    patchDetailCache(id, () => updated);
    patchDisputasStore(id, d => ({ ...d, partesNotificadas: true }));
    setDisputa(updated);
    showSuccess('Partes notificadas com sucesso.');
  };

  const handleSendMsg = () => {
    if (!newMsg.trim() || !disputa || sendingMsg) return;
    setSendingMsg(true);
    setTimeout(() => {
      const msg: MsgDisputa = {
        id: `md-${Date.now()}`,
        autor: 'Operador Carlos',
        papel: 'operador',
        conteudo: newMsg.trim(),
        timestamp: new Date().toISOString(),
      };
      const auditEntry: AuditItem = {
        id: `a-msg-${Date.now()}`,
        timestamp: new Date().toISOString(),
        utilizador: 'Operador Carlos',
        tipo: 'mensagem',
        descricao: 'Mensagem enviada na thread da disputa',
      };
      const updated: DisputaDetalhe = {
        ...disputa,
        mensagensDisputa: [...disputa.mensagensDisputa, msg],
        auditoria: [auditEntry, ...disputa.auditoria],
      };
      patchDetailCache(id, () => updated);
      setDisputa(updated);
      setNewMsg('');
      setSendingMsg(false);
    }, 400);
  };

  // ── Loading / error ───────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5 animate-pulse max-w-[1100px] mx-auto">
        <div className="h-8 bg-gray-200 rounded-xl w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 h-28" />
          ))}
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 h-64" />
        <div className="bg-white rounded-2xl border border-gray-200 h-80" />
      </div>
    );
  }

  if (error || !disputa) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-gray-200 p-12 flex flex-col items-center gap-4 text-center max-w-sm w-full">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
            <AlertTriangle size={20} className="text-red-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Disputa não encontrada</h3>
            <p className="text-xs text-gray-500 mt-1">{error}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={load} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:border-gray-400 transition-colors cursor-pointer">
              <RotateCw size={12} /> Tentar novamente
            </button>
            <Link href="/disputas" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:border-gray-400 transition-colors">
              <ChevronLeft size={12} /> Voltar
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const scfg = STATUS_CFG[disputa.status];
  const mcfg = MOTIVO_CFG[disputa.motivo];

  return (
    <div className="flex flex-col gap-5 max-w-[1100px] mx-auto pb-6">

      {/* Back + success */}
      <div className="flex items-center gap-3 flex-wrap">
        <Link href="/disputas" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors cursor-pointer">
          <ChevronLeft size={14} /> Todas as disputas
        </Link>
        {success && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl ml-auto">
            <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
            <p className="text-xs font-semibold text-emerald-700">{success}</p>
          </div>
        )}
      </div>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-base font-extrabold text-gray-900">{disputa.id}</h1>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${scfg.classes}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${scfg.dot}`} />
                {scfg.label}
              </span>
              <Link href={`/solicitacoes/${disputa.solicitacaoId}`} className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full hover:bg-emerald-100 transition-colors">
                {disputa.solicitacaoId}
              </Link>
            </div>
            <p className="text-xs text-gray-500 mt-1.5 font-medium">{disputa.servico}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-orange-700 bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-full">
                <AlertOctagon size={9} /> {mcfg.label}
              </span>
            </div>
          </div>
          <div className="text-right text-[10px] text-gray-400 font-medium space-y-0.5">
            <p>Aberta em <span className="font-semibold text-gray-600">{fmtDate(disputa.dataAbertura)}</span></p>
            {disputa.operadorResponsavel && <p>Operador: <span className="font-semibold text-gray-600">{disputa.operadorResponsavel}</span></p>}
            <p>Última atualização: <span className="font-semibold text-gray-600">{fmtDate(disputa.dataUltimaAtualizacao)}</span></p>
          </div>
        </div>

        {/* Parties */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl px-3.5 py-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
              {initials(disputa.clienteNome)}
            </div>
            <div>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Cliente</p>
              <p className="text-xs font-semibold text-gray-800">{disputa.clienteNome}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-violet-50 border border-violet-100 rounded-xl px-3.5 py-3">
            <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
              {initials(disputa.prestadorNome)}
            </div>
            <div>
              <p className="text-[10px] font-bold text-violet-600 uppercase tracking-wider">Prestador</p>
              <p className="text-xs font-semibold text-gray-800">{disputa.prestadorNome}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 items-start">

        {/* Left column */}
        <div className="flex flex-col gap-5">

          {/* Descrição */}
          <SectionCard title="Descrição da Disputa" icon={FileText}>
            <div className="px-5 py-4">
              <p className="text-xs text-gray-700 leading-relaxed">{disputa.descricao}</p>
            </div>
          </SectionCard>

          {/* Timeline da solicitação */}
          <SectionCard title="Histórico da Solicitação" icon={Activity}>
            <div className="px-5 py-4">
              <div className="space-y-0">
                {disputa.solicitacaoTimeline.map((t, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center shrink-0">
                      <div className={`w-2.5 h-2.5 rounded-full mt-1 ${t.color} shrink-0`} />
                      {i < disputa.solicitacaoTimeline.length - 1 && (
                        <div className="w-px flex-1 bg-gray-100 my-1" />
                      )}
                    </div>
                    <div className={`pb-4 ${i === disputa.solicitacaoTimeline.length - 1 ? '' : ''}`}>
                      <p className="text-xs font-semibold text-gray-800 leading-snug">{t.label}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{fmtTs(t.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

          {/* Mensagens da disputa */}
          <SectionCard title="Comunicações da Disputa" icon={MessageSquare}>
            <div className="flex flex-col">
              <div className="px-5 py-4 space-y-4 max-h-[380px] overflow-y-auto">
                {disputa.mensagensDisputa.map(m => (
                  <MsgBubble key={m.id} msg={m} />
                ))}
                <div ref={msgEndRef} />
              </div>
              {/* Send message */}
              {(disputa.status === 'aberta' || disputa.status === 'em_analise') && (
                <div className="border-t border-gray-100 px-5 py-3 flex gap-2 items-end">
                  <textarea
                    value={newMsg}
                    onChange={e => setNewMsg(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMsg(); } }}
                    placeholder="Escreva uma mensagem... (Enter para enviar)"
                    rows={2}
                    className="flex-1 px-3 py-2 text-xs text-gray-800 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-400 focus:bg-white transition-colors placeholder:text-gray-400 resize-none"
                  />
                  <button
                    onClick={handleSendMsg}
                    disabled={!newMsg.trim() || sendingMsg}
                    className="w-9 h-9 bg-[#06241C] hover:bg-[#0B392E] rounded-xl flex items-center justify-center text-white disabled:opacity-40 transition-colors cursor-pointer disabled:cursor-not-allowed shrink-0"
                  >
                    {sendingMsg ? <Loader size={13} className="animate-spin" /> : <Send size={13} />}
                  </button>
                </div>
              )}
            </div>
          </SectionCard>

          {/* Resolução */}
          <ResolutionPanel
            disputa={disputa}
            onResolved={handleResolved}
            onNotified={handleNotified}
          />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">

          {/* Partes */}
          <SectionCard title="Informações das Partes" icon={User2}>
            <div className="px-5 py-4 space-y-3">
              <div>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2">Cliente</p>
                <InfoRow label="Nome">{disputa.clienteNome}</InfoRow>
              </div>
              <div className="pt-2 border-t border-gray-50">
                <p className="text-[10px] font-bold text-violet-600 uppercase tracking-wider mb-2">Prestador</p>
                <InfoRow label="Nome">{disputa.prestadorNome}</InfoRow>
              </div>
              {disputa.operadorResponsavel && (
                <div className="pt-2 border-t border-gray-50">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-2">Operador</p>
                  <InfoRow label="Responsável">{disputa.operadorResponsavel}</InfoRow>
                </div>
              )}
            </div>
          </SectionCard>

          {/* Pagamento */}
          {disputa.solicitacaoPagamento && (
            <SectionCard title="Pagamento em Disputa" icon={Banknote}>
              <div className="px-5 py-4 space-y-1">
                <InfoRow label="ID">{disputa.solicitacaoPagamento.id}</InfoRow>
                <InfoRow label="Valor em disputa">
                  <span className="font-bold text-gray-900">{fmtAOA(disputa.solicitacaoPagamento.valor)}</span>
                </InfoRow>
                <InfoRow label="Estado">
                  <span className={`font-semibold ${disputa.solicitacaoPagamento.status === 'reembolsado' ? 'text-blue-600' : 'text-amber-600'}`}>
                    {disputa.solicitacaoPagamento.status === 'reembolsado' ? 'Reembolsado' : 'Em disputa'}
                  </span>
                </InfoRow>
              </div>
            </SectionCard>
          )}

          {/* Audit log */}
          <SectionCard title="Audit Log" icon={History} defaultOpen={false}>
            <div className="px-5 py-4 max-h-[400px] overflow-y-auto">
              {disputa.auditoria.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">Sem registos de auditoria.</p>
              ) : (
                disputa.auditoria.map(a => <AuditRow key={a.id} item={a} />)
              )}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
