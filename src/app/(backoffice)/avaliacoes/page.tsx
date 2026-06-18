'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Star, Check, X, RotateCw, AlertTriangle, Inbox,
  Loader, CheckCircle2, ChevronLeft, ChevronRight,
  ChevronDown, Search, TrendingDown, MessageSquare,
  ThumbsUp, ThumbsDown, Clock,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

type StatusAvaliacao = 'pendente' | 'aprovada' | 'rejeitada';

interface Avaliacao {
  id: string;
  prestadorNome: string;
  prestadorId: string;
  clienteNome: string;
  solicitacaoId: string;
  nota: number;
  comentario: string;
  data: string;
  status: StatusAvaliacao;
  motivoRejeicao: string | null;
}

// ─────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────

const STATUS_CFG: Record<StatusAvaliacao, { label: string; classes: string; dot: string }> = {
  pendente:  { label: 'Pendente',  classes: 'bg-amber-50 text-amber-700 border border-amber-100',       dot: 'bg-amber-400' },
  aprovada:  { label: 'Aprovada',  classes: 'bg-emerald-50 text-emerald-700 border border-emerald-100', dot: 'bg-emerald-500' },
  rejeitada: { label: 'Rejeitada', classes: 'bg-red-50 text-red-600 border border-red-100',             dot: 'bg-red-500' },
};

const NOTA_OPTIONS = [
  { value: '',  label: 'Todas as notas' },
  { value: '5', label: '★★★★★ (5)' },
  { value: '4', label: '★★★★☆ (4)' },
  { value: '3', label: '★★★☆☆ (3)' },
  { value: '2', label: '★★☆☆☆ (2)' },
  { value: '1', label: '★☆☆☆☆ (1)' },
];

const ITEMS_PER_PAGE = 12;
const ALERTA_THRESHOLD = 2.5;

// ─────────────────────────────────────────────────────────────
// Mock data
// ─────────────────────────────────────────────────────────────

const MOCK_RAW: Omit<Avaliacao, 'id'>[] = [];

const MOCK_AVALIACOES: Avaliacao[] = MOCK_RAW.map((a, i) => ({
  ...a,
  id: `AVA-${String(i + 1).padStart(3, '0')}`,
}));

let _store: Avaliacao[] | null = null;
function getStore(): Avaliacao[] {
  if (!_store) _store = MOCK_AVALIACOES.map(a => ({ ...a }));
  return _store;
}
function patchStore(id: string, updater: (a: Avaliacao) => Avaliacao) {
  if (!_store) return;
  _store = _store.map(a => a.id === id ? updater(a) : a);
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  try {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch { return iso; }
}

function StarRating({ nota, size = 13 }: { nota: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={size}
          className={i < nota ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}
        />
      ))}
    </div>
  );
}

function notaColor(nota: number): string {
  if (nota >= 4) return 'text-emerald-600';
  if (nota === 3) return 'text-amber-600';
  return 'text-red-500';
}

// ─────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────

function Select<T extends string>({
  value, onChange, options, className,
}: {
  value: T; onChange: (v: T) => void;
  options: Array<{ value: T; label: string }>; className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={e => onChange(e.target.value as T)}
        className="w-full appearance-none pl-3 pr-8 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-xl outline-none focus:border-emerald-400 transition-colors cursor-pointer [color-scheme:light]"
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  );
}

function KpiCard({ label, value, sub, icon: Icon, color }: {
  label: string; value: string; sub?: string;
  icon: React.ElementType; color: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="text-lg font-bold text-gray-900 mt-0.5 truncate">{value}</p>
        {sub && <p className="text-[10px] text-gray-400 font-medium mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Aprovar Modal
// ─────────────────────────────────────────────────────────────

function AprovarModal({
  avaliacao, onClose, onConfirm,
}: { avaliacao: Avaliacao; onClose: () => void; onConfirm: () => void }) {
  const [busy, setBusy] = useState(false);
  const submit = () => { setBusy(true); setTimeout(onConfirm, 450); };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={!busy ? onClose : undefined} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0">
              <ThumbsUp size={15} className="text-emerald-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Aprovar Avaliação</h3>
              <p className="text-xs text-gray-500 mt-0.5">{avaliacao.id}</p>
            </div>
          </div>
          <button onClick={onClose} disabled={busy} className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer shrink-0 disabled:opacity-40">
            <X size={14} />
          </button>
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-2.5">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Prestador</span>
            <span className="font-semibold text-gray-800">{avaliacao.prestadorNome}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Cliente</span>
            <span className="font-semibold text-gray-800">{avaliacao.clienteNome}</span>
          </div>
          <div className="flex justify-between text-xs items-center">
            <span className="text-gray-500">Nota</span>
            <div className="flex items-center gap-1.5">
              <StarRating nota={avaliacao.nota} size={11} />
              <span className={`font-bold text-xs ${notaColor(avaliacao.nota)}`}>{avaliacao.nota}/5</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500">
          A avaliação será <span className="font-bold text-emerald-600">publicada</span> e ficará visível no perfil do prestador.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button onClick={onClose} disabled={busy} className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:border-gray-400 transition-colors cursor-pointer disabled:opacity-50">
            Cancelar
          </button>
          <button onClick={submit} disabled={busy} className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl disabled:opacity-50 transition-colors cursor-pointer">
            {busy ? <Loader size={11} className="animate-spin" /> : <Check size={11} />}
            Aprovar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Rejeitar Modal
// ─────────────────────────────────────────────────────────────

function RejeitarModal({
  avaliacao, onClose, onConfirm,
}: { avaliacao: Avaliacao; onClose: () => void; onConfirm: (motivo: string) => void }) {
  const [motivo, setMotivo]   = useState('');
  const [busy, setBusy]       = useState(false);
  const [touched, setTouched] = useState(false);
  const textareaRef           = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { setTimeout(() => textareaRef.current?.focus(), 80); }, []);

  const invalid = touched && !motivo.trim();

  const submit = () => {
    setTouched(true);
    if (!motivo.trim() || busy) return;
    setBusy(true);
    setTimeout(() => onConfirm(motivo.trim()), 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={!busy ? onClose : undefined} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
              <ThumbsDown size={15} className="text-red-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Rejeitar Avaliação</h3>
              <p className="text-xs text-gray-500 mt-0.5">{avaliacao.id}</p>
            </div>
          </div>
          <button onClick={onClose} disabled={busy} className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer shrink-0 disabled:opacity-40">
            <X size={14} />
          </button>
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-2.5">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Prestador</span>
            <span className="font-semibold text-gray-800">{avaliacao.prestadorNome}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Cliente</span>
            <span className="font-semibold text-gray-800">{avaliacao.clienteNome}</span>
          </div>
          <div className="flex justify-between text-xs items-center">
            <span className="text-gray-500">Nota</span>
            <div className="flex items-center gap-1.5">
              <StarRating nota={avaliacao.nota} size={11} />
              <span className={`font-bold text-xs ${notaColor(avaliacao.nota)}`}>{avaliacao.nota}/5</span>
            </div>
          </div>
          <div className="pt-2 border-t border-gray-200">
            <p className="text-[10px] text-gray-500 italic leading-relaxed line-clamp-3">"{avaliacao.comentario}"</p>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
            Motivo da Rejeição <span className="text-red-500">*</span>
          </label>
          <textarea
            ref={textareaRef}
            value={motivo}
            onChange={e => setMotivo(e.target.value)}
            onBlur={() => setTouched(true)}
            rows={3}
            placeholder="Descreva o motivo da rejeição desta avaliação..."
            className={`w-full px-3.5 py-2.5 text-xs text-gray-800 bg-white border rounded-xl outline-none transition-all placeholder:text-gray-400 resize-none leading-relaxed ${invalid ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-red-300'}`}
          />
          {invalid && <p className="text-[10px] text-red-500 mt-1 font-medium">O motivo da rejeição é obrigatório.</p>}
        </div>

        <div className="flex items-center justify-end gap-3">
          <button onClick={onClose} disabled={busy} className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:border-gray-400 transition-colors cursor-pointer disabled:opacity-50">
            Cancelar
          </button>
          <button onClick={submit} disabled={busy} className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl disabled:opacity-50 transition-colors cursor-pointer">
            {busy ? <Loader size={11} className="animate-spin" /> : <X size={11} />}
            Rejeitar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Expandable comment cell
// ─────────────────────────────────────────────────────────────

function Comentario({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > 100;
  return (
    <div className="space-y-1">
      <p className={`text-xs text-gray-600 leading-relaxed ${!expanded && isLong ? 'line-clamp-2' : ''}`}>
        {text}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded(e => !e)}
          className="text-[10px] font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer transition-colors"
        >
          {expanded ? 'Ver menos' : 'Ver mais'}
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Skeleton
// ─────────────────────────────────────────────────────────────

function PageSkeleton() {
  return (
    <div className="flex flex-col h-full gap-5 animate-pulse">
      <div className="shrink-0 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-gray-100 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-2.5 bg-gray-100 rounded w-1/2" />
              <div className="h-5 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
      <div className="shrink-0 bg-white rounded-2xl border border-gray-200 p-4">
        <div className="flex gap-3 flex-wrap">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 bg-gray-100 rounded-xl w-36" />
          ))}
        </div>
      </div>
      <div className="flex-1 min-h-0 bg-white rounded-2xl border border-gray-200 flex flex-col">
        <div className="shrink-0 px-6 py-4 border-b border-gray-100">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
        </div>
        <div className="flex-1 p-4 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border border-gray-100 rounded-xl p-4 flex gap-4">
              <div className="w-8 h-8 bg-gray-100 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-1/3" />
                <div className="h-2.5 bg-gray-100 rounded w-1/2" />
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-4/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Alert section
// ─────────────────────────────────────────────────────────────

function AlertasSection({ avaliacoes }: { avaliacoes: Avaliacao[] }) {
  const aprovadas = avaliacoes.filter(a => a.status === 'aprovada');

  const porPrestador: Record<string, { nome: string; notas: number[] }> = {};
  aprovadas.forEach(a => {
    if (!porPrestador[a.prestadorId]) porPrestador[a.prestadorId] = { nome: a.prestadorNome, notas: [] };
    porPrestador[a.prestadorId].notas.push(a.nota);
  });

  const alertas = Object.entries(porPrestador)
    .map(([, v]) => ({
      nome: v.nome,
      media: v.notas.reduce((s, n) => s + n, 0) / v.notas.length,
      total: v.notas.length,
    }))
    .filter(p => p.media < ALERTA_THRESHOLD)
    .sort((a, b) => a.media - b.media);

  if (alertas.length === 0) return null;

  return (
    <div className="shrink-0 bg-white rounded-2xl border border-amber-200 shadow-xs overflow-hidden">
      <div className="px-5 py-3.5 border-b border-amber-100 bg-amber-50 flex items-center gap-2.5">
        <TrendingDown size={14} className="text-amber-600 shrink-0" />
        <div>
          <p className="text-xs font-bold text-amber-800">Prestadores com desempenho crítico</p>
          <p className="text-[10px] text-amber-600 font-medium mt-0.5">
            {alertas.length} prestador{alertas.length !== 1 ? 'es' : ''} com média abaixo de {ALERTA_THRESHOLD} ★
          </p>
        </div>
      </div>
      <div className="p-4 flex flex-wrap gap-3">
        {alertas.map(p => (
          <div key={p.nome} className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5">
            <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <AlertTriangle size={12} className="text-red-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800">{p.nome}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <StarRating nota={Math.round(p.media)} size={10} />
                <span className="text-[10px] font-bold text-red-600">{p.media.toFixed(1)}</span>
                <span className="text-[10px] text-gray-400">· {p.total} avaliação{p.total !== 1 ? 'ões' : ''}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Inner page
// ─────────────────────────────────────────────────────────────

function AvaliacoesContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const urlTab    = (searchParams.get('tab')    ?? 'pendentes') as 'pendentes' | 'todas';
  const urlNota   = searchParams.get('nota')    ?? '';
  const urlSearch = searchParams.get('q')       ?? '';
  const urlPage   = Math.max(1, Number(searchParams.get('page') ?? '1'));

  const [avaliacoes,    setAvaliacoes]    = useState<Avaliacao[]>([]);
  const [isLoading,     setIsLoading]     = useState(true);
  const [error,         setError]         = useState<string | null>(null);
  const [success,       setSuccess]       = useState<string | null>(null);
  const [modalAprovar,  setModalAprovar]  = useState<Avaliacao | null>(null);
  const [modalRejeitar, setModalRejeitar] = useState<Avaliacao | null>(null);

  const loadRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const successRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(() => {
    setIsLoading(true); setError(null);
    if (loadRef.current) clearTimeout(loadRef.current);
    loadRef.current = setTimeout(() => {
      try { setAvaliacoes([...getStore()]); setIsLoading(false); }
      catch { setError('Erro ao carregar avaliações.'); setIsLoading(false); }
    }, 350);
  }, []);

  useEffect(() => {
    load();
    return () => {
      if (loadRef.current)    clearTimeout(loadRef.current);
      if (successRef.current) clearTimeout(successRef.current);
      if (searchRef.current)  clearTimeout(searchRef.current);
    };
  }, [load]);

  const pushUrl = useCallback((patch: Record<string, string>) => {
    const p = new URLSearchParams(searchParams.toString());
    Object.entries(patch).forEach(([k, v]) => {
      if (v) p.set(k, v); else p.delete(k);
    });
    p.delete('page');
    router.push('?' + p.toString());
  }, [searchParams, router]);

  const setPage = (n: number) => {
    const p = new URLSearchParams(searchParams.toString());
    p.set('page', String(n));
    router.push('?' + p.toString());
  };

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    if (successRef.current) clearTimeout(successRef.current);
    successRef.current = setTimeout(() => setSuccess(null), 3500);
  };

  const handleAprovar = () => {
    if (!modalAprovar) return;
    const id = modalAprovar.id;
    patchStore(id, a => ({ ...a, status: 'aprovada' }));
    setAvaliacoes([...getStore()]);
    setModalAprovar(null);
    showSuccess(`Avaliação ${id} aprovada com sucesso.`);
  };

  const handleRejeitar = (motivo: string) => {
    if (!modalRejeitar) return;
    const id = modalRejeitar.id;
    patchStore(id, a => ({ ...a, status: 'rejeitada', motivoRejeicao: motivo }));
    setAvaliacoes([...getStore()]);
    setModalRejeitar(null);
    showSuccess(`Avaliação ${id} rejeitada.`);
  };

  // ── Filtering ─────────────────────────────────────────────

  const baseList = urlTab === 'pendentes'
    ? avaliacoes.filter(a => a.status === 'pendente')
    : avaliacoes;

  const filtered = baseList.filter(a => {
    const q = urlSearch.toLowerCase();
    const matchQ = !q
      || a.id.toLowerCase().includes(q)
      || a.prestadorNome.toLowerCase().includes(q)
      || a.clienteNome.toLowerCase().includes(q)
      || a.solicitacaoId.toLowerCase().includes(q)
      || a.comentario.toLowerCase().includes(q);
    const matchN = !urlNota || a.nota === Number(urlNota);
    return matchQ && matchN;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const page       = Math.min(urlPage, totalPages);
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // ── KPIs ─────────────────────────────────────────────────
  const pendentes = avaliacoes.filter(a => a.status === 'pendente');
  const aprovadas = avaliacoes.filter(a => a.status === 'aprovada');
  const mediaNota = aprovadas.length
    ? (aprovadas.reduce((s, a) => s + a.nota, 0) / aprovadas.length).toFixed(1)
    : '—';

  const hasFilters = !!(urlNota || urlSearch);

  if (isLoading) return <PageSkeleton />;

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
          <button onClick={load} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:border-gray-400 transition-colors cursor-pointer shadow-sm">
            <RotateCw size={12} /> Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-5 max-w-[1400px] mx-auto">

        {/* Success toast */}
        {success && (
          <div className="shrink-0 flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
            <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
            <p className="text-xs font-semibold text-emerald-700">{success}</p>
          </div>
        )}

        {/* KPIs */}
        <div className="shrink-0 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <KpiCard
            label="Pendentes de Moderação"
            value={String(pendentes.length)}
            sub="Aguardam revisão do operador"
            icon={Clock}
            color="bg-amber-50 text-amber-600"
          />
          <KpiCard
            label="Total Aprovadas"
            value={String(aprovadas.length)}
            sub="Publicadas no perfil"
            icon={ThumbsUp}
            color="bg-emerald-50 text-emerald-600"
          />
          <KpiCard
            label="Média Geral"
            value={mediaNota === '—' ? '—' : `${mediaNota} ★`}
            sub="Avaliações aprovadas"
            icon={Star}
            color="bg-blue-50 text-blue-600"
          />
        </div>

        {/* Alertas */}
        <AlertasSection avaliacoes={avaliacoes} />

        {/* Tabs */}
        <div className="shrink-0 flex items-center gap-1 bg-gray-100 rounded-xl p-1 w-fit">
          {([
            { key: 'pendentes', label: 'Pendentes', icon: Clock,      badge: pendentes.length },
            { key: 'todas',     label: 'Todas',     icon: MessageSquare, badge: null },
          ] as const).map(({ key, label, icon: Icon, badge }) => (
            <button
              key={key}
              onClick={() => pushUrl({ tab: key })}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${urlTab === key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Icon size={12} />
              {label}
              {badge !== null && badge > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${urlTab === key ? 'bg-amber-100 text-amber-700' : 'bg-gray-200 text-gray-500'}`}>
                  {badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="shrink-0 bg-white rounded-2xl border border-gray-200 shadow-xs p-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[180px]">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                defaultValue={urlSearch}
                onChange={e => {
                  const v = e.target.value;
                  if (searchRef.current) clearTimeout(searchRef.current);
                  searchRef.current = setTimeout(() => pushUrl({ q: v }), 300);
                }}
                placeholder="Prestador, cliente, comentário..."
                className="w-full pl-8 pr-8 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-400 focus:bg-white transition-colors placeholder:text-gray-400"
              />
              {urlSearch && (
                <button onClick={() => pushUrl({ q: '' })} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                  <X size={11} />
                </button>
              )}
            </div>

            <Select
              value={urlNota as string}
              onChange={v => pushUrl({ nota: v })}
              options={NOTA_OPTIONS as Array<{ value: string; label: string }>}
              className="w-44"
            />

            {hasFilters && (
              <button
                onClick={() => pushUrl({ q: '', nota: '' })}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
              >
                <X size={11} /> Limpar
              </button>
            )}
          </div>
        </div>

        {/* Cards list */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden flex flex-col">

          {/* Card header */}
          <div className="shrink-0 px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-sm font-bold text-gray-900">
                {urlTab === 'pendentes' ? 'Avaliações Pendentes' : 'Todas as Avaliações'}
              </h2>
              <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
                {hasFilters && ' (filtrado)'}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {(['pendente', 'aprovada', 'rejeitada'] as StatusAvaliacao[]).map(s => {
                const count = avaliacoes.filter(a => a.status === s).length;
                const cfg   = STATUS_CFG[s];
                return (
                  <span key={s} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${cfg.classes}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    {cfg.label} ({count})
                  </span>
                );
              })}
            </div>
          </div>

          {/* Scrollable content */}
          <div>
            {paginated.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                  <Inbox size={20} className="text-gray-300" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-600">
                    {urlTab === 'pendentes' ? 'Nenhuma avaliação pendente' : 'Nenhuma avaliação encontrada'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {hasFilters ? 'Tente ajustar os filtros.' : urlTab === 'pendentes' ? 'Todas as avaliações foram moderadas.' : 'Não existem avaliações registadas.'}
                  </p>
                </div>
                {hasFilters && (
                  <button onClick={() => pushUrl({ q: '', nota: '' })} className="text-xs text-emerald-600 font-semibold hover:text-emerald-700 cursor-pointer">
                    Limpar filtros
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {paginated.map(a => {
                  const scfg = STATUS_CFG[a.status];
                  const isPendente = a.status === 'pendente';
                  return (
                    <div key={a.id} className="px-6 py-4 hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-white ${a.nota >= 4 ? 'bg-emerald-500' : a.nota === 3 ? 'bg-amber-400' : 'bg-red-400'}`}>
                          {a.clienteNome.split(' ').slice(0, 2).map(n => n[0]).join('')}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-bold text-gray-900">{a.clienteNome}</span>
                                <span className="text-[10px] text-gray-400">→</span>
                                <span className="text-xs font-semibold text-gray-700">{a.prestadorNome}</span>
                                <span className="text-[10px] text-gray-400 font-mono">{a.solicitacaoId}</span>
                              </div>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <StarRating nota={a.nota} size={12} />
                                <span className={`text-xs font-bold ${notaColor(a.nota)}`}>{a.nota}/5</span>
                                <span className="text-[10px] text-gray-400">{fmtDate(a.data)}</span>
                                <span className="text-[10px] text-gray-400 font-mono">{a.id}</span>
                              </div>
                            </div>

                            {/* Status + Actions */}
                            <div className="flex items-center gap-2 shrink-0 flex-wrap">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${scfg.classes}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${scfg.dot}`} />
                                {scfg.label}
                              </span>
                              {isPendente && (
                                <>
                                  <button
                                    onClick={() => setModalAprovar(a)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg hover:bg-emerald-100 hover:border-emerald-200 transition-colors cursor-pointer"
                                  >
                                    <ThumbsUp size={10} /> Aprovar
                                  </button>
                                  <button
                                    onClick={() => setModalRejeitar(a)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 hover:border-red-200 transition-colors cursor-pointer"
                                  >
                                    <ThumbsDown size={10} /> Rejeitar
                                  </button>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Comentário */}
                          <div className="mt-2.5 bg-gray-50 border border-gray-100 rounded-xl px-3.5 py-2.5">
                            <Comentario text={a.comentario} />
                          </div>

                          {/* Motivo de rejeição */}
                          {a.status === 'rejeitada' && a.motivoRejeicao && (
                            <div className="mt-2 flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5">
                              <AlertTriangle size={11} className="text-red-400 shrink-0 mt-0.5" />
                              <div>
                                <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider mb-0.5">Motivo da rejeição</p>
                                <p className="text-xs text-red-700 leading-relaxed">{a.motivoRejeicao}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="shrink-0 px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-4">
              <p className="text-[10px] text-gray-400 font-medium">
                {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} de {filtered.length}
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="w-7 h-7 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-500 disabled:opacity-40 transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={13} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                  .reduce<(number | 'ellipsis')[]>((acc, n, i, arr) => {
                    if (i > 0 && n - (arr[i - 1] as number) > 1) acc.push('ellipsis');
                    acc.push(n); return acc;
                  }, [])
                  .map((n, i) => n === 'ellipsis'
                    ? <span key={`e${i}`} className="text-[10px] text-gray-400 px-1">…</span>
                    : (
                      <button
                        key={n}
                        onClick={() => setPage(n as number)}
                        className={`w-7 h-7 rounded-lg border text-[10px] font-bold transition-colors cursor-pointer ${page === n ? 'bg-[#06241C] text-white border-[#06241C]' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}
                      >
                        {n}
                      </button>
                    )
                  )}
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="w-7 h-7 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-500 disabled:opacity-40 transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {modalAprovar && (
        <AprovarModal
          avaliacao={modalAprovar}
          onClose={() => setModalAprovar(null)}
          onConfirm={handleAprovar}
        />
      )}
      {modalRejeitar && (
        <RejeitarModal
          avaliacao={modalRejeitar}
          onClose={() => setModalRejeitar(null)}
          onConfirm={handleRejeitar}
        />
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Page export
// ─────────────────────────────────────────────────────────────

export default function AvaliacoesPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <AvaliacoesContent />
    </Suspense>
  );
}
