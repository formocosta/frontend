'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search, X, ChevronLeft, ChevronRight, RotateCw,
  AlertTriangle, Inbox, Loader, CheckCircle2,
  CreditCard, TrendingUp, Clock, Check,
  FileText, Eye, ChevronDown, Calendar,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

type StatusPagamento = 'pendente' | 'processando' | 'confirmado' | 'falhado';
type MetodoPagamento = 'transferencia' | 'multicaixa' | 'cartao' | 'referencia';

interface Pagamento {
  id: string;
  solicitacaoId: string;
  clienteNome: string;
  valor: number;
  comissao: number;
  metodo: MetodoPagamento;
  status: StatusPagamento;
  data: string;
  referenciaExterna: string | null;
  temComprovativo: boolean;
}

// ─────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────

const STATUS_CFG: Record<StatusPagamento, { label: string; classes: string; dot: string }> = {
  pendente:    { label: 'Pendente',    classes: 'bg-amber-50 text-amber-700 border border-amber-100',     dot: 'bg-amber-400' },
  processando: { label: 'Processando', classes: 'bg-blue-50 text-blue-700 border border-blue-100',        dot: 'bg-blue-400' },
  confirmado:  { label: 'Confirmado',  classes: 'bg-emerald-50 text-emerald-700 border border-emerald-100', dot: 'bg-emerald-500' },
  falhado:     { label: 'Falhado',     classes: 'bg-red-50 text-red-600 border border-red-100',           dot: 'bg-red-500' },
};

const METODO_CFG: Record<MetodoPagamento, { label: string; icon: string }> = {
  transferencia: { label: 'Transferência', icon: '🏦' },
  multicaixa:    { label: 'Multicaixa',    icon: '💳' },
  cartao:        { label: 'Cartão',        icon: '💰' },
  referencia:    { label: 'Referência',    icon: '📄' },
};

const STATUS_OPTIONS: Array<{ value: StatusPagamento | ''; label: string }> = [
  { value: '',            label: 'Todos os estados' },
  { value: 'pendente',    label: 'Pendente' },
  { value: 'processando', label: 'Processando' },
  { value: 'confirmado',  label: 'Confirmado' },
  { value: 'falhado',     label: 'Falhado' },
];

const METODO_OPTIONS: Array<{ value: MetodoPagamento | ''; label: string }> = [
  { value: '',             label: 'Todos os métodos' },
  { value: 'transferencia', label: 'Transferência' },
  { value: 'multicaixa',   label: 'Multicaixa' },
  { value: 'cartao',       label: 'Cartão' },
  { value: 'referencia',   label: 'Referência' },
];

const ITEMS_PER_PAGE = 15;

// ─────────────────────────────────────────────────────────────
// Mock data
// ─────────────────────────────────────────────────────────────

const RAW: Omit<Pagamento, 'id' | 'comissao'>[] = [
  { solicitacaoId: 'SS-030', clienteNome: 'Felicidade Amélia Pires',   valor: 25000, metodo: 'multicaixa',    status: 'confirmado',  data: '2026-06-15', referenciaExterna: 'MCX-2026-001', temComprovativo: true },
  { solicitacaoId: 'SS-031', clienteNome: 'Gracindo Estêvão Lima',     valor: 18000, metodo: 'transferencia', status: 'confirmado',  data: '2026-06-14', referenciaExterna: 'TRF-2026-045', temComprovativo: true },
  { solicitacaoId: 'SS-032', clienteNome: 'Teresinha Dulce Sousa',     valor: 12000, metodo: 'cartao',        status: 'confirmado',  data: '2026-06-13', referenciaExterna: 'CRT-2026-012', temComprovativo: true },
  { solicitacaoId: 'SS-033', clienteNome: 'Amâncio Bruno Rodrigues',   valor: 9500,  metodo: 'referencia',    status: 'confirmado',  data: '2026-06-12', referenciaExterna: 'REF-2026-089', temComprovativo: false },
  { solicitacaoId: 'SS-024', clienteNome: 'Jacinto Afonso Pereira',    valor: 35000, metodo: 'transferencia', status: 'pendente',    data: '2026-06-18', referenciaExterna: null,           temComprovativo: false },
  { solicitacaoId: 'SS-025', clienteNome: 'Gertrudes Piedade Costa',   valor: 22000, metodo: 'multicaixa',    status: 'pendente',    data: '2026-06-18', referenciaExterna: null,           temComprovativo: false },
  { solicitacaoId: 'SS-026', clienteNome: 'Domingos Paulo Azevedo',    valor: 16500, metodo: 'cartao',        status: 'pendente',    data: '2026-06-17', referenciaExterna: null,           temComprovativo: true },
  { solicitacaoId: 'SS-027', clienteNome: 'Esperança Sofia Ribeiro',   valor: 28000, metodo: 'transferencia', status: 'processando', data: '2026-06-17', referenciaExterna: 'TRF-2026-046', temComprovativo: true },
  { solicitacaoId: 'SS-028', clienteNome: 'Virgílio Gonçalo Neto',     valor: 14000, metodo: 'multicaixa',    status: 'processando', data: '2026-06-16', referenciaExterna: null,           temComprovativo: false },
  { solicitacaoId: 'SS-029', clienteNome: 'Adalgisa Helena Matos',     valor: 19500, metodo: 'referencia',    status: 'processando', data: '2026-06-16', referenciaExterna: 'REF-2026-090', temComprovativo: false },
  { solicitacaoId: 'SS-016', clienteNome: 'Soraia Patrícia Mendes',    valor: 11000, metodo: 'cartao',        status: 'falhado',     data: '2026-06-15', referenciaExterna: null,           temComprovativo: false },
  { solicitacaoId: 'SS-017', clienteNome: 'Benedito Carlos Lemos',     valor: 8500,  metodo: 'multicaixa',    status: 'falhado',     data: '2026-06-14', referenciaExterna: null,           temComprovativo: false },
  { solicitacaoId: 'SS-018', clienteNome: 'Celeste Amélia Mota',       valor: 31000, metodo: 'transferencia', status: 'confirmado',  data: '2026-06-11', referenciaExterna: 'TRF-2026-040', temComprovativo: true },
  { solicitacaoId: 'SS-019', clienteNome: 'Horácio Manuel Teixeira',   valor: 7500,  metodo: 'referencia',    status: 'confirmado',  data: '2026-06-10', referenciaExterna: 'REF-2026-085', temComprovativo: true },
  { solicitacaoId: 'SS-020', clienteNome: 'Emília Francisca Rocha',    valor: 42000, metodo: 'transferencia', status: 'pendente',    data: '2026-06-17', referenciaExterna: null,           temComprovativo: false },
  { solicitacaoId: 'SS-021', clienteNome: 'Ivone Graça Santos',        valor: 15000, metodo: 'multicaixa',    status: 'pendente',    data: '2026-06-16', referenciaExterna: null,           temComprovativo: false },
  { solicitacaoId: 'SS-022', clienteNome: 'Luís Filipe Correia',       valor: 20000, metodo: 'cartao',        status: 'pendente',    data: '2026-06-16', referenciaExterna: null,           temComprovativo: true },
  { solicitacaoId: 'SS-023', clienteNome: 'Perpétua Josefina Dias',    valor: 13000, metodo: 'referencia',    status: 'processando', data: '2026-06-15', referenciaExterna: null,           temComprovativo: false },
  { solicitacaoId: 'SS-009', clienteNome: 'Joaquim Pedro Ferreira',    valor: 17000, metodo: 'multicaixa',    status: 'processando', data: '2026-06-15', referenciaExterna: null,           temComprovativo: false },
  { solicitacaoId: 'SS-010', clienteNome: 'Olívia Raquel Marques',     valor: 24000, metodo: 'transferencia', status: 'confirmado',  data: '2026-06-08', referenciaExterna: 'TRF-2026-035', temComprovativo: true },
  { solicitacaoId: 'SS-011', clienteNome: 'Gabriel Augusto Lima',      valor: 38000, metodo: 'cartao',        status: 'confirmado',  data: '2026-06-07', referenciaExterna: 'CRT-2026-008', temComprovativo: true },
  { solicitacaoId: 'SS-012', clienteNome: 'Flávia Mariana Torres',     valor: 10000, metodo: 'referencia',    status: 'falhado',     data: '2026-06-12', referenciaExterna: null,           temComprovativo: false },
  { solicitacaoId: 'SS-013', clienteNome: 'Dário Esteves Cunha',       valor: 26000, metodo: 'transferencia', status: 'falhado',     data: '2026-06-11', referenciaExterna: null,           temComprovativo: false },
  { solicitacaoId: 'SS-014', clienteNome: 'Marta Sofia Neves',         valor: 9000,  metodo: 'multicaixa',    status: 'pendente',    data: '2026-06-15', referenciaExterna: null,           temComprovativo: false },
  { solicitacaoId: 'SS-015', clienteNome: 'Rui Bernardo Alves',        valor: 14500, metodo: 'cartao',        status: 'pendente',    data: '2026-06-14', referenciaExterna: null,           temComprovativo: true },
  { solicitacaoId: 'SS-001', clienteNome: 'Eduardo Filipe Neto',       valor: 6000,  metodo: 'referencia',    status: 'confirmado',  data: '2026-06-05', referenciaExterna: 'REF-2026-070', temComprovativo: false },
  { solicitacaoId: 'SS-002', clienteNome: 'Rosa Maria Carvalho',       valor: 21000, metodo: 'transferencia', status: 'confirmado',  data: '2026-06-04', referenciaExterna: 'TRF-2026-028', temComprovativo: true },
  { solicitacaoId: 'SS-003', clienteNome: 'Simão Augusto Pinto',       valor: 33000, metodo: 'multicaixa',    status: 'confirmado',  data: '2026-06-03', referenciaExterna: 'MCX-2026-005', temComprovativo: true },
  { solicitacaoId: 'SS-004', clienteNome: 'Bela Fernanda Gomes',       valor: 11500, metodo: 'cartao',        status: 'confirmado',  data: '2026-06-02', referenciaExterna: 'CRT-2026-004', temComprovativo: false },
  { solicitacaoId: 'SS-005', clienteNome: 'Custódio Albano Sousa',     valor: 8000,  metodo: 'referencia',    status: 'falhado',     data: '2026-06-10', referenciaExterna: null,           temComprovativo: false },
];

const MOCK_PAGAMENTOS: Pagamento[] = RAW.map((p, i) => ({
  ...p,
  id: `PAG-${String(i + 1).padStart(3, '0')}`,
  comissao: Math.round(p.valor * 0.15),
}));

let _store: Pagamento[] | null = null;
function getStore(): Pagamento[] {
  if (!_store) _store = MOCK_PAGAMENTOS.map(p => ({ ...p }));
  return _store;
}
function patchStore(id: string, updater: (p: Pagamento) => Pagamento) {
  if (!_store) return;
  _store = _store.map(p => p.id === id ? updater(p) : p);
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function fmtAOA(v: number) {
  return v.toLocaleString('pt-PT') + ' AOA';
}

function fmtDate(iso: string) {
  try {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch { return iso; }
}

// ─────────────────────────────────────────────────────────────
// Select component
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

// ─────────────────────────────────────────────────────────────
// KPI Card
// ─────────────────────────────────────────────────────────────

function KpiCard({
  label, value, sub, icon: Icon, color,
}: {
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
// Confirm modal
// ─────────────────────────────────────────────────────────────

function ConfirmarModal({
  pagamento,
  onClose,
  onConfirm,
}: {
  pagamento: Pagamento;
  onClose: () => void;
  onConfirm: (referencia: string) => void;
}) {
  const [ref, setRef]         = useState('');
  const [busy, setBusy]       = useState(false);
  const [touched, setTouched] = useState(false);
  const inputRef              = useRef<HTMLInputElement>(null);

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 80); }, []);

  const invalid = touched && !ref.trim();

  const submit = () => {
    setTouched(true);
    if (!ref.trim() || busy) return;
    setBusy(true);
    setTimeout(() => onConfirm(ref.trim()), 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={!busy ? onClose : undefined} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0">
              <Check size={16} className="text-emerald-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Confirmar Pagamento</h3>
              <p className="text-xs text-gray-500 mt-0.5">{pagamento.id} · {fmtAOA(pagamento.valor)}</p>
            </div>
          </div>
          <button onClick={onClose} disabled={busy} className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer shrink-0 disabled:opacity-40">
            <X size={14} />
          </button>
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Solicitação</span>
            <Link href={`/solicitacoes/${pagamento.solicitacaoId}`} className="font-bold text-emerald-700 hover:underline font-mono">{pagamento.solicitacaoId}</Link>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Cliente</span>
            <span className="font-semibold text-gray-800">{pagamento.clienteNome}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Método</span>
            <span className="font-semibold text-gray-800">{METODO_CFG[pagamento.metodo].label}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Valor</span>
            <span className="font-bold text-gray-900">{fmtAOA(pagamento.valor)}</span>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
            Referência Externa <span className="text-red-500">*</span>
          </label>
          <input
            ref={inputRef}
            type="text"
            value={ref}
            onChange={e => setRef(e.target.value)}
            onBlur={() => setTouched(true)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            placeholder="Ex: TRF-2026-123, MCX-ABC-456..."
            className={`w-full px-3.5 py-2.5 text-xs text-gray-800 bg-white border rounded-xl outline-none transition-all placeholder:text-gray-400 ${invalid ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-emerald-400'}`}
          />
          {invalid && <p className="text-[10px] text-red-500 mt-1 font-medium">A referência externa é obrigatória.</p>}
        </div>

        <div className="flex items-center justify-end gap-3">
          <button onClick={onClose} disabled={busy} className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:border-gray-400 transition-colors cursor-pointer disabled:opacity-50">
            Cancelar
          </button>
          <button
            onClick={submit}
            disabled={busy}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl disabled:opacity-50 transition-colors cursor-pointer"
          >
            {busy ? <Loader size={11} className="animate-spin" /> : <Check size={11} />}
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Comprovativo modal
// ─────────────────────────────────────────────────────────────

function ComprovaModal({ pagamento, onClose }: { pagamento: Pagamento; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
              <FileText size={16} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Comprovativo de Pagamento</h3>
              <p className="text-xs text-gray-500 mt-0.5">{pagamento.id} · {pagamento.solicitacaoId}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
            <X size={14} />
          </button>
        </div>

        {pagamento.temComprovativo ? (
          /* PDF placeholder */
          <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex items-center gap-2">
              <FileText size={13} className="text-gray-500" />
              <span className="text-xs font-semibold text-gray-700">
                comprovativo_{pagamento.id}.pdf
              </span>
              <span className="ml-auto text-[10px] text-gray-400">Pré-visualização</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-4 py-16 px-8 text-center">
              <div className="w-14 h-14 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center">
                <FileText size={24} className="text-red-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-700">comprovativo_{pagamento.id}.pdf</p>
                <p className="text-[10px] text-gray-400 mt-1">
                  O visualizador de PDF será integrado aqui quando o backend estiver disponível.
                </p>
              </div>
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:border-gray-400 transition-colors cursor-pointer">
                <FileText size={11} /> Descarregar PDF
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl flex flex-col items-center gap-3 py-12 text-center">
            <FileText size={24} className="text-gray-300" />
            <div>
              <p className="text-xs font-bold text-gray-600">Sem comprovativo</p>
              <p className="text-[10px] text-gray-400 mt-1">Nenhum ficheiro anexado a este pagamento.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Valor</p>
            <p className="text-sm font-bold text-gray-900">{fmtAOA(pagamento.valor)}</p>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Comissão</p>
            <p className="text-sm font-bold text-gray-900">{fmtAOA(pagamento.comissao)}</p>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Método</p>
            <p className="text-xs font-semibold text-gray-700">{METODO_CFG[pagamento.metodo].label}</p>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Referência</p>
            <p className="text-xs font-semibold text-gray-700 font-mono">{pagamento.referenciaExterna ?? '—'}</p>
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:border-gray-400 transition-colors cursor-pointer">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Loading skeleton
// ─────────────────────────────────────────────────────────────

function PageSkeleton() {
  return (
    <div className="flex flex-col h-full gap-5 animate-pulse">
      {/* KPI row */}
      <div className="shrink-0 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-gray-100 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-2.5 bg-gray-100 rounded w-1/2" />
              <div className="h-5 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
      {/* Filters */}
      <div className="shrink-0 bg-white rounded-2xl border border-gray-200 shadow-xs p-4">
        <div className="flex gap-3 flex-wrap">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 bg-gray-100 rounded-xl w-36" />
          ))}
        </div>
      </div>
      {/* Table */}
      <div className="flex-1 min-h-0 bg-white rounded-2xl border border-gray-200 shadow-xs flex flex-col">
        <div className="shrink-0 px-6 py-4 border-b border-gray-100">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
        </div>
        <div className="flex-1 min-h-0 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-gray-50">
              <div className="h-3 bg-gray-200 rounded w-20" />
              <div className="h-3 bg-gray-100 rounded flex-1" />
              <div className="h-3 bg-gray-100 rounded w-24" />
              <div className="h-3 bg-gray-100 rounded w-20" />
              <div className="h-5 bg-gray-100 rounded-full w-20" />
              <div className="h-3 bg-gray-100 rounded w-20" />
              <div className="h-6 bg-gray-100 rounded-lg w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Inner page (needs useSearchParams)
// ─────────────────────────────────────────────────────────────

function PagamentosContent() {
  const router        = useRouter();
  const searchParams  = useSearchParams();

  const urlStatus  = (searchParams.get('status')  ?? '') as StatusPagamento | '';
  const urlMetodo  = (searchParams.get('metodo')  ?? '') as MetodoPagamento | '';
  const urlDataIni = searchParams.get('dataIni')  ?? '';
  const urlDataFim = searchParams.get('dataFim')  ?? '';
  const urlSearch  = searchParams.get('q')        ?? '';
  const urlPage    = Math.max(1, Number(searchParams.get('page') ?? '1'));

  const [pagamentos,  setPagamentos]  = useState<Pagamento[]>([]);
  const [isLoading,   setIsLoading]   = useState(true);
  const [error,       setError]       = useState<string | null>(null);
  const [success,     setSuccess]     = useState<string | null>(null);
  const [modalConfirm, setModalConfirm] = useState<Pagamento | null>(null);
  const [modalComprov, setModalComprov] = useState<Pagamento | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [draftStatus, setDraftStatus] = useState(urlStatus);
  const [draftMetodo, setDraftMetodo] = useState(urlMetodo);
  const [draftDataIni, setDraftDataIni] = useState(urlDataIni);
  const [draftDataFim, setDraftDataFim] = useState(urlDataFim);

  const loadRef      = useRef<ReturnType<typeof setTimeout> | null>(null);
  const successRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchInput  = useRef(urlSearch);

  // ── Load ──────────────────────────────────────────────────
  const load = useCallback(() => {
    setIsLoading(true); setError(null);
    if (loadRef.current) clearTimeout(loadRef.current);
    loadRef.current = setTimeout(() => {
      try { setPagamentos([...getStore()]); setIsLoading(false); }
      catch { setError('Erro ao carregar pagamentos.'); setIsLoading(false); }
    }, 350);
  }, []);

  useEffect(() => {
    load();
    return () => {
      if (loadRef.current)   clearTimeout(loadRef.current);
      if (successRef.current) clearTimeout(successRef.current);
      if (searchRef.current)  clearTimeout(searchRef.current);
    };
  }, [load]);

  // ── URL helpers ───────────────────────────────────────────
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

  const handleSearch = (v: string) => {
    searchInput.current = v;
    if (searchRef.current) clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => pushUrl({ q: v }), 300);
  };

  const openFilters = () => {
    setDraftStatus(urlStatus);
    setDraftMetodo(urlMetodo);
    setDraftDataIni(urlDataIni);
    setDraftDataFim(urlDataFim);
    setFiltersOpen(v => !v);
  };

  const applyFilters = () => {
    pushUrl({
      status: draftStatus,
      metodo: draftMetodo,
      dataIni: draftDataIni,
      dataFim: draftDataFim,
    });
    setFiltersOpen(false);
  };

  const clearFilters = () => {
    setDraftStatus('');
    setDraftMetodo('');
    setDraftDataIni('');
    setDraftDataFim('');
    router.push(urlSearch ? `?q=${encodeURIComponent(urlSearch)}` : '?');
    setFiltersOpen(false);
  };

  // ── Confirm payment ───────────────────────────────────────
  const handleConfirmar = (referencia: string) => {
    if (!modalConfirm) return;
    const id = modalConfirm.id;
    patchStore(id, p => ({ ...p, status: 'confirmado', referenciaExterna: referencia }));
    setPagamentos([...getStore()]);
    setModalConfirm(null);
    setSuccess(`Pagamento ${id} confirmado com sucesso.`);
    if (successRef.current) clearTimeout(successRef.current);
    successRef.current = setTimeout(() => setSuccess(null), 3500);
  };

  // ── Filter & paginate ─────────────────────────────────────
  const filtered = pagamentos.filter(p => {
    const q = urlSearch.toLowerCase();
    const matchQ = !q
      || p.id.toLowerCase().includes(q)
      || p.solicitacaoId.toLowerCase().includes(q)
      || p.clienteNome.toLowerCase().includes(q)
      || (p.referenciaExterna?.toLowerCase().includes(q) ?? false);
    const matchS = !urlStatus || p.status === urlStatus;
    const matchM = !urlMetodo || p.metodo === urlMetodo;
    const matchI = !urlDataIni || p.data >= urlDataIni;
    const matchF = !urlDataFim || p.data <= urlDataFim;
    return matchQ && matchS && matchM && matchI && matchF;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const page       = Math.min(urlPage, totalPages);
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // ── KPIs (from full store, no filter) ────────────────────
  const confirmados  = pagamentos.filter(p => p.status === 'confirmado');
  const pendentes    = pagamentos.filter(p => p.status === 'pendente' || p.status === 'processando');
  const receitaTotal = confirmados.reduce((s, p) => s + p.valor, 0);
  const comissaoTotal = confirmados.reduce((s, p) => s + p.comissao, 0);
  const pendentesValor = pendentes.reduce((s, p) => s + p.valor, 0);

  const hasFilters = !!(urlStatus || urlMetodo || urlDataIni || urlDataFim || urlSearch);

  // ─────────────────────────────────────────────────────────
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
      <div className="flex flex-col h-full gap-5 max-w-[1400px] mx-auto">

        {/* Success */}
        {success && (
          <div className="shrink-0 flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
            <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
            <p className="text-xs font-semibold text-emerald-700">{success}</p>
          </div>
        )}

        {/* KPIs */}
        <div className="shrink-0 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <KpiCard
            label="Receita Total"
            value={fmtAOA(receitaTotal)}
            sub={`${confirmados.length} pagamentos confirmados`}
            icon={TrendingUp}
            color="bg-emerald-50 text-emerald-600"
          />
          <KpiCard
            label="Total de Comissões"
            value={fmtAOA(comissaoTotal)}
            sub="15% sobre receita confirmada"
            icon={CreditCard}
            color="bg-blue-50 text-blue-600"
          />
          <KpiCard
            label="Pagamentos Pendentes"
            value={fmtAOA(pendentesValor)}
            sub={`${pendentes.length} pagamentos por processar`}
            icon={Clock}
            color="bg-amber-50 text-amber-600"
          />
        </div>

        {/* Filters */}
          <div className="shrink-0 bg-white rounded-2xl border border-gray-200 shadow-xs p-4">
            <div className="flex flex-col lg:flex-row lg:items-start gap-3">
              <div className="relative flex-1 min-w-[180px]">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  defaultValue={urlSearch}
                  onChange={e => handleSearch(e.target.value)}
                  placeholder="ID, cliente, referência..."
                  className="w-full pl-8 pr-8 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-400 focus:bg-white transition-colors placeholder:text-gray-400"
                />
                {urlSearch && (
                  <button onClick={() => pushUrl({ q: '' })} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                    <X size={11} />
                  </button>
                )}
              </div>

              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={openFilters}
                  className={`inline-flex items-center justify-between gap-2 px-4 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                    filtersOpen || hasFilters
                      ? 'border-emerald-300 bg-emerald-50 text-[#06241C]'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>Filtros</span>
                  <ChevronDown size={12} className={`transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
                </button>

                {filtersOpen && (
                  <div className="absolute right-0 top-full mt-2 z-20 w-[min(92vw,32rem)] rounded-2xl border border-gray-200 bg-white shadow-xl p-4">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <h3 className="text-sm font-semibold text-gray-900">Filtros</h3>
                        <p className="text-xs text-gray-500">Mostra apenas o que precisas e mantém a tabela limpa.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Status</label>
                          <Select
                            value={draftStatus}
                            onChange={setDraftStatus}
                            options={STATUS_OPTIONS}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Método</label>
                          <Select
                            value={draftMetodo}
                            onChange={setDraftMetodo}
                            options={METODO_OPTIONS}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Data inicial</label>
                          <div className="relative">
                            <Calendar size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            <input
                              type="date"
                              value={draftDataIni}
                              onChange={e => setDraftDataIni(e.target.value)}
                              className="w-full pl-8 pr-3 py-2 text-xs text-gray-700 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-400 focus:bg-white transition-colors cursor-pointer [color-scheme:light]"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Data final</label>
                          <div className="relative">
                            <Calendar size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            <input
                              type="date"
                              value={draftDataFim}
                              onChange={e => setDraftDataFim(e.target.value)}
                              className="w-full pl-8 pr-3 py-2 text-xs text-gray-700 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-400 focus:bg-white transition-colors cursor-pointer [color-scheme:light]"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={clearFilters}
                          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-600 border border-gray-200 rounded-xl hover:border-gray-300 hover:text-gray-900 transition-colors cursor-pointer"
                        >
                          <X size={11} />
                          Limpar
                        </button>
                        <button
                          onClick={applyFilters}
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#06241C] rounded-xl hover:bg-[#0B392E] transition-colors cursor-pointer"
                        >
                          Aplicar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        {/* Table card */}
        <div className="flex-1 min-h-0 bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden flex flex-col">

          {/* Card header */}
          <div className="shrink-0 px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Pagamentos</h2>
              <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
                {hasFilters && ' (filtrado)'}
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-[10px] text-gray-400 font-medium">
              {hasFilters ? 'Filtros activos' : 'Pesquisa sempre visível; filtros avançados recolhidos'}
            </div>
          </div>

          {/* Scrollable table */}
          <div className="flex-1 min-h-0 overflow-auto">
            {paginated.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                  <Inbox size={20} className="text-gray-300" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-600">Nenhum pagamento encontrado</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {hasFilters ? 'Tente ajustar os filtros aplicados.' : 'Não existem pagamentos registados.'}
                  </p>
                </div>
                {hasFilters && (
                  <button onClick={() => router.push('?')} className="text-xs text-emerald-600 font-semibold hover:text-emerald-700 cursor-pointer">
                    Limpar filtros
                  </button>
                )}
              </div>
            ) : (
              <table className="w-full text-xs min-w-[700px]">
                <thead className="sticky top-0 z-10">
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {['Solicitação', 'Cliente', 'Valor', 'Comissão', 'Método', 'Status', 'Data', 'Ações'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap last:text-right">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginated.map(p => {
                    const scfg = STATUS_CFG[p.status];
                    const canConfirm = p.status === 'pendente' || p.status === 'processando';
                    return (
                      <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <Link href={`/solicitacoes/${p.solicitacaoId}`} className="font-bold text-emerald-700 hover:text-emerald-900 hover:underline underline-offset-2 font-mono transition-colors">
                            {p.solicitacaoId}
                          </Link>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="font-medium text-gray-700 truncate block max-w-[160px]">{p.clienteNome}</span>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="font-bold text-gray-900">{fmtAOA(p.valor)}</span>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="font-medium text-gray-500">{fmtAOA(p.comissao)}</span>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="text-gray-600 font-medium">{METODO_CFG[p.metodo].label}</span>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${scfg.classes}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${scfg.dot}`} />
                            {scfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="text-gray-500">{fmtDate(p.data)}</span>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            {canConfirm && (
                              <button
                                onClick={() => setModalConfirm(p)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg hover:bg-emerald-100 hover:border-emerald-200 transition-colors cursor-pointer"
                              >
                                <Check size={10} /> Confirmar
                              </button>
                            )}
                            <button
                              onClick={() => setModalComprov(p)}
                              title="Ver comprovativo"
                              className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                            >
                              <Eye size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
      {modalConfirm && (
        <ConfirmarModal
          pagamento={modalConfirm}
          onClose={() => setModalConfirm(null)}
          onConfirm={handleConfirmar}
        />
      )}
      {modalComprov && (
        <ComprovaModal
          pagamento={modalComprov}
          onClose={() => setModalComprov(null)}
        />
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Page export
// ─────────────────────────────────────────────────────────────

export default function PagamentosPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PagamentosContent />
    </Suspense>
  );
}
