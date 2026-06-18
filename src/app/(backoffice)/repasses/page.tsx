'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search, X, ChevronLeft, ChevronRight, RotateCw,
  AlertTriangle, Inbox, Loader, CheckCircle2,
  ArrowLeftRight, TrendingUp, Clock, Check,
  ChevronDown, Calendar, Download, FileText,
  Send, Eye, History,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

type StatusRepasse = 'pendente' | 'processando' | 'concluido' | 'falhado';
type MetodoPagamento = 'transferencia_bancaria' | 'multicaixa_express' | 'referencia_bancaria';

interface Repasse {
  id: string;
  solicitacaoId: string;
  prestadorNome: string;
  prestadorIban: string;
  valorRepasse: number;
  metodo: MetodoPagamento;
  status: StatusRepasse;
  data: string;
  referenciaTransferencia: string | null;
  dataProcessamento: string | null;
}

// ─────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────

const STATUS_CFG: Record<StatusRepasse, { label: string; classes: string; dot: string }> = {
  pendente:    { label: 'Pendente',    classes: 'bg-amber-50 text-amber-700 border border-amber-100',       dot: 'bg-amber-400' },
  processando: { label: 'Processando', classes: 'bg-blue-50 text-blue-700 border border-blue-100',          dot: 'bg-blue-400' },
  concluido:   { label: 'Concluído',   classes: 'bg-emerald-50 text-emerald-700 border border-emerald-100', dot: 'bg-emerald-500' },
  falhado:     { label: 'Falhado',     classes: 'bg-red-50 text-red-600 border border-red-100',             dot: 'bg-red-500' },
};

const METODO_CFG: Record<MetodoPagamento, { label: string }> = {
  transferencia_bancaria:  { label: 'Transferência Bancária' },
  multicaixa_express:      { label: 'Multicaixa Express' },
  referencia_bancaria:     { label: 'Referência Bancária' },
};

const STATUS_OPTIONS: Array<{ value: StatusRepasse | ''; label: string }> = [
  { value: '',            label: 'Todos os estados' },
  { value: 'pendente',    label: 'Pendente' },
  { value: 'processando', label: 'Processando' },
  { value: 'concluido',   label: 'Concluído' },
  { value: 'falhado',     label: 'Falhado' },
];

const METODO_OPTIONS: Array<{ value: MetodoPagamento | ''; label: string }> = [
  { value: '',                     label: 'Todos os métodos' },
  { value: 'transferencia_bancaria', label: 'Transferência Bancária' },
  { value: 'multicaixa_express',   label: 'Multicaixa Express' },
  { value: 'referencia_bancaria',  label: 'Referência Bancária' },
];

const ITEMS_PER_PAGE = 15;

// ─────────────────────────────────────────────────────────────
// Mock data
// ─────────────────────────────────────────────────────────────

const RAW: Omit<Repasse, 'id'>[] = [
  { solicitacaoId: 'SS-001', prestadorNome: 'Carlos Manuel Fernandes',   prestadorIban: 'AO06.0006.0000.0000.0000.1011.3', valorRepasse: 42500, metodo: 'transferencia_bancaria',  status: 'concluido',   data: '2026-06-01', referenciaTransferencia: 'TRF-AO-2026-001', dataProcessamento: '2026-06-02' },
  { solicitacaoId: 'SS-002', prestadorNome: 'Angélica Sofia Pires',       prestadorIban: 'AO06.0006.0000.0000.0000.2022.4', valorRepasse: 18000, metodo: 'multicaixa_express',      status: 'concluido',   data: '2026-06-02', referenciaTransferencia: 'MCX-2026-009',    dataProcessamento: '2026-06-02' },
  { solicitacaoId: 'SS-003', prestadorNome: 'Domingos Paulo Azevedo',     prestadorIban: 'AO06.0040.0000.0000.0000.3033.5', valorRepasse: 31000, metodo: 'transferencia_bancaria',  status: 'concluido',   data: '2026-06-03', referenciaTransferencia: 'TRF-AO-2026-014', dataProcessamento: '2026-06-04' },
  { solicitacaoId: 'SS-004', prestadorNome: 'Felicidade Amélia Costa',    prestadorIban: 'AO06.0006.0000.0000.0000.4044.6', valorRepasse: 25000, metodo: 'referencia_bancaria',     status: 'concluido',   data: '2026-06-03', referenciaTransferencia: 'REF-BK-2026-022',  dataProcessamento: '2026-06-05' },
  { solicitacaoId: 'SS-005', prestadorNome: 'Gracindo Estêvão Lima',      prestadorIban: 'AO06.0006.0000.0000.0000.5055.7', valorRepasse: 14000, metodo: 'transferencia_bancaria',  status: 'concluido',   data: '2026-06-04', referenciaTransferencia: 'TRF-AO-2026-019', dataProcessamento: '2026-06-05' },
  { solicitacaoId: 'SS-006', prestadorNome: 'Horácio Manuel Teixeira',    prestadorIban: 'AO06.0040.0000.0000.0000.6066.8', valorRepasse: 8500,  metodo: 'multicaixa_express',      status: 'concluido',   data: '2026-06-05', referenciaTransferencia: 'MCX-2026-017',    dataProcessamento: '2026-06-05' },
  { solicitacaoId: 'SS-007', prestadorNome: 'Ivone Graça Santos',         prestadorIban: 'AO06.0006.0000.0000.0000.7077.9', valorRepasse: 55000, metodo: 'transferencia_bancaria',  status: 'concluido',   data: '2026-06-06', referenciaTransferencia: 'TRF-AO-2026-031', dataProcessamento: '2026-06-07' },
  { solicitacaoId: 'SS-008', prestadorNome: 'Joaquim Pedro Ferreira',     prestadorIban: 'AO06.0006.0000.0000.0000.8088.0', valorRepasse: 12000, metodo: 'referencia_bancaria',     status: 'concluido',   data: '2026-06-07', referenciaTransferencia: 'REF-BK-2026-041',  dataProcessamento: '2026-06-08' },
  { solicitacaoId: 'SS-009', prestadorNome: 'Luís Filipe Correia',        prestadorIban: 'AO06.0040.0000.0000.0000.9099.1', valorRepasse: 38000, metodo: 'transferencia_bancaria',  status: 'concluido',   data: '2026-06-08', referenciaTransferencia: 'TRF-AO-2026-044', dataProcessamento: '2026-06-09' },
  { solicitacaoId: 'SS-010', prestadorNome: 'Marta Sofia Neves',          prestadorIban: 'AO06.0006.0000.0000.0001.0100.2', valorRepasse: 21000, metodo: 'multicaixa_express',      status: 'falhado',     data: '2026-06-09', referenciaTransferencia: null,               dataProcessamento: null },
  { solicitacaoId: 'SS-011', prestadorNome: 'Olívia Raquel Marques',      prestadorIban: 'AO06.0006.0000.0000.0001.1111.3', valorRepasse: 16500, metodo: 'transferencia_bancaria',  status: 'falhado',     data: '2026-06-10', referenciaTransferencia: null,               dataProcessamento: null },
  { solicitacaoId: 'SS-012', prestadorNome: 'Perpétua Josefina Dias',     prestadorIban: 'AO06.0040.0000.0000.0001.2122.4', valorRepasse: 9000,  metodo: 'referencia_bancaria',     status: 'processando', data: '2026-06-16', referenciaTransferencia: 'REF-BK-2026-055',  dataProcessamento: null },
  { solicitacaoId: 'SS-013', prestadorNome: 'Rui Bernardo Alves',         prestadorIban: 'AO06.0006.0000.0000.0001.3133.5', valorRepasse: 47000, metodo: 'transferencia_bancaria',  status: 'processando', data: '2026-06-17', referenciaTransferencia: 'TRF-AO-2026-061', dataProcessamento: null },
  { solicitacaoId: 'SS-014', prestadorNome: 'Simão Augusto Pinto',        prestadorIban: 'AO06.0006.0000.0000.0001.4144.6', valorRepasse: 29000, metodo: 'multicaixa_express',      status: 'processando', data: '2026-06-17', referenciaTransferencia: null,               dataProcessamento: null },
  { solicitacaoId: 'SS-015', prestadorNome: 'Teresa Dulce Sousa',         prestadorIban: 'AO06.0040.0000.0000.0001.5155.7', valorRepasse: 13500, metodo: 'transferencia_bancaria',  status: 'pendente',    data: '2026-06-18', referenciaTransferencia: null,               dataProcessamento: null },
  { solicitacaoId: 'SS-016', prestadorNome: 'Virgílio Gonçalo Neto',      prestadorIban: 'AO06.0006.0000.0000.0001.6166.8', valorRepasse: 22000, metodo: 'referencia_bancaria',     status: 'pendente',    data: '2026-06-18', referenciaTransferencia: null,               dataProcessamento: null },
  { solicitacaoId: 'SS-017', prestadorNome: 'Carlos Manuel Fernandes',    prestadorIban: 'AO06.0006.0000.0000.0000.1011.3', valorRepasse: 18500, metodo: 'multicaixa_express',      status: 'pendente',    data: '2026-06-18', referenciaTransferencia: null,               dataProcessamento: null },
  { solicitacaoId: 'SS-018', prestadorNome: 'Angélica Sofia Pires',       prestadorIban: 'AO06.0006.0000.0000.0000.2022.4', valorRepasse: 35000, metodo: 'transferencia_bancaria',  status: 'pendente',    data: '2026-06-17', referenciaTransferencia: null,               dataProcessamento: null },
  { solicitacaoId: 'SS-019', prestadorNome: 'Domingos Paulo Azevedo',     prestadorIban: 'AO06.0040.0000.0000.0000.3033.5', valorRepasse: 11000, metodo: 'transferencia_bancaria',  status: 'pendente',    data: '2026-06-17', referenciaTransferencia: null,               dataProcessamento: null },
  { solicitacaoId: 'SS-020', prestadorNome: 'Felicidade Amélia Costa',    prestadorIban: 'AO06.0006.0000.0000.0000.4044.6', valorRepasse: 44000, metodo: 'multicaixa_express',      status: 'pendente',    data: '2026-06-16', referenciaTransferencia: null,               dataProcessamento: null },
  { solicitacaoId: 'SS-021', prestadorNome: 'Gracindo Estêvão Lima',      prestadorIban: 'AO06.0006.0000.0000.0000.5055.7', valorRepasse: 7500,  metodo: 'referencia_bancaria',     status: 'pendente',    data: '2026-06-16', referenciaTransferencia: null,               dataProcessamento: null },
  { solicitacaoId: 'SS-022', prestadorNome: 'Horácio Manuel Teixeira',    prestadorIban: 'AO06.0040.0000.0000.0000.6066.8', valorRepasse: 26000, metodo: 'transferencia_bancaria',  status: 'pendente',    data: '2026-06-15', referenciaTransferencia: null,               dataProcessamento: null },
  { solicitacaoId: 'SS-023', prestadorNome: 'Ivone Graça Santos',         prestadorIban: 'AO06.0006.0000.0000.0000.7077.9', valorRepasse: 19000, metodo: 'multicaixa_express',      status: 'pendente',    data: '2026-06-15', referenciaTransferencia: null,               dataProcessamento: null },
  { solicitacaoId: 'SS-024', prestadorNome: 'Joaquim Pedro Ferreira',     prestadorIban: 'AO06.0006.0000.0000.0000.8088.0', valorRepasse: 33000, metodo: 'transferencia_bancaria',  status: 'pendente',    data: '2026-06-14', referenciaTransferencia: null,               dataProcessamento: null },
  { solicitacaoId: 'SS-025', prestadorNome: 'Luís Filipe Correia',        prestadorIban: 'AO06.0040.0000.0000.0000.9099.1', valorRepasse: 15000, metodo: 'referencia_bancaria',     status: 'pendente',    data: '2026-06-14', referenciaTransferencia: null,               dataProcessamento: null },
];

const MOCK_REPASSES: Repasse[] = RAW.map((r, i) => ({
  ...r,
  id: `REP-${String(i + 1).padStart(3, '0')}`,
}));

let _store: Repasse[] | null = null;
function getStore(): Repasse[] {
  if (!_store) _store = MOCK_REPASSES.map(r => ({ ...r }));
  return _store;
}
function patchStore(id: string, updater: (r: Repasse) => Repasse) {
  if (!_store) return;
  _store = _store.map(r => r.id === id ? updater(r) : r);
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

function maskIban(iban: string) {
  const parts = iban.split('.');
  if (parts.length < 5) return iban;
  return parts.slice(0, 3).join('.') + '.****.' + parts[parts.length - 1];
}

function exportCsv(data: Repasse[], filename: string) {
  const headers = ['ID', 'Solicitação', 'Prestador', 'IBAN', 'Valor (AOA)', 'Método', 'Status', 'Data', 'Referência', 'Data Processamento'];
  const rows = data.map(r => [
    r.id,
    r.solicitacaoId,
    r.prestadorNome,
    r.prestadorIban,
    r.valorRepasse,
    METODO_CFG[r.metodo].label,
    STATUS_CFG[r.status].label,
    r.data,
    r.referenciaTransferencia ?? '',
    r.dataProcessamento ?? '',
  ]);
  const csv = [headers, ...rows].map(row => row.map(c => `"${c}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
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
// Processar Repasse Modal
// ─────────────────────────────────────────────────────────────

function ProcessarModal({
  repasse,
  onClose,
  onConfirm,
}: {
  repasse: Repasse;
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
              <Send size={16} className="text-emerald-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Processar Repasse</h3>
              <p className="text-xs text-gray-500 mt-0.5">{repasse.id} · {fmtAOA(repasse.valorRepasse)}</p>
            </div>
          </div>
          <button onClick={onClose} disabled={busy} className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer shrink-0 disabled:opacity-40">
            <X size={14} />
          </button>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-2.5">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Solicitação</span>
            <Link href={`/solicitacoes/${repasse.solicitacaoId}`} className="font-bold text-emerald-700 hover:underline font-mono">
              {repasse.solicitacaoId}
            </Link>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Prestador</span>
            <span className="font-semibold text-gray-800 text-right max-w-[200px]">{repasse.prestadorNome}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">IBAN</span>
            <span className="font-mono text-gray-700 text-[11px]">{maskIban(repasse.prestadorIban)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Método</span>
            <span className="font-semibold text-gray-800">{METODO_CFG[repasse.metodo].label}</span>
          </div>
          <div className="pt-2 border-t border-gray-200 flex justify-between text-xs">
            <span className="font-bold text-gray-700">Valor do Repasse</span>
            <span className="font-bold text-emerald-700 text-sm">{fmtAOA(repasse.valorRepasse)}</span>
          </div>
        </div>

        {/* Referência */}
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
            Referência da Transferência <span className="text-red-500">*</span>
          </label>
          <input
            ref={inputRef}
            type="text"
            value={ref}
            onChange={e => setRef(e.target.value)}
            onBlur={() => setTouched(true)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            placeholder="Ex: TRF-AO-2026-099, MCX-12345..."
            className={`w-full px-3.5 py-2.5 text-xs text-gray-800 bg-white border rounded-xl outline-none transition-all placeholder:text-gray-400 ${invalid ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-emerald-400'}`}
          />
          {invalid && <p className="text-[10px] text-red-500 mt-1 font-medium">A referência da transferência é obrigatória.</p>}
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
// Detalhe Modal (histórico)
// ─────────────────────────────────────────────────────────────

function DetalheModal({ repasse, onClose }: { repasse: Repasse; onClose: () => void }) {
  const scfg = STATUS_CFG[repasse.status];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
              <FileText size={16} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Detalhe do Repasse</h3>
              <p className="text-xs text-gray-500 mt-0.5">{repasse.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
            <X size={14} />
          </button>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Valor do Repasse</p>
              <p className="text-sm font-bold text-gray-900">{fmtAOA(repasse.valorRepasse)}</p>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</p>
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${scfg.classes}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${scfg.dot}`} />
                {scfg.label}
              </span>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-2.5">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Solicitação</span>
              <Link href={`/solicitacoes/${repasse.solicitacaoId}`} className="font-bold text-emerald-700 hover:underline font-mono" onClick={onClose}>
                {repasse.solicitacaoId}
              </Link>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Prestador</span>
              <span className="font-semibold text-gray-800 text-right max-w-[200px]">{repasse.prestadorNome}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">IBAN</span>
              <span className="font-mono text-gray-700 text-[10px]">{repasse.prestadorIban}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Método</span>
              <span className="font-semibold text-gray-800">{METODO_CFG[repasse.metodo].label}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Data de Criação</span>
              <span className="font-semibold text-gray-800">{fmtDate(repasse.data)}</span>
            </div>
            {repasse.dataProcessamento && (
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Data de Processamento</span>
                <span className="font-semibold text-gray-800">{fmtDate(repasse.dataProcessamento)}</span>
              </div>
            )}
            <div className="flex justify-between text-xs pt-2 border-t border-gray-200">
              <span className="text-gray-500">Referência</span>
              <span className="font-mono font-semibold text-gray-700">{repasse.referenciaTransferencia ?? '—'}</span>
            </div>
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
      <div className="shrink-0 bg-white rounded-2xl border border-gray-200 shadow-xs p-4">
        <div className="flex gap-3 flex-wrap">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 bg-gray-100 rounded-xl w-36" />
          ))}
        </div>
      </div>
      <div className="flex-1 min-h-0 bg-white rounded-2xl border border-gray-200 shadow-xs flex flex-col">
        <div className="shrink-0 px-6 py-4 border-b border-gray-100">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
        </div>
        <div className="flex-1 min-h-0 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-gray-50">
              <div className="h-3 bg-gray-200 rounded w-16" />
              <div className="h-3 bg-gray-100 rounded w-28" />
              <div className="h-3 bg-gray-100 rounded flex-1" />
              <div className="h-3 bg-gray-100 rounded w-24" />
              <div className="h-5 bg-gray-100 rounded-full w-20" />
              <div className="h-3 bg-gray-100 rounded w-20" />
              <div className="h-6 bg-gray-100 rounded-lg w-28" />
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

function RepassesContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const urlStatus  = (searchParams.get('status')  ?? '') as StatusRepasse | '';
  const urlMetodo  = (searchParams.get('metodo')  ?? '') as MetodoPagamento | '';
  const urlDataIni = searchParams.get('dataIni')  ?? '';
  const urlDataFim = searchParams.get('dataFim')  ?? '';
  const urlSearch  = searchParams.get('q')        ?? '';
  const urlTab     = (searchParams.get('tab')     ?? 'todos') as 'todos' | 'historico';
  const urlPage    = Math.max(1, Number(searchParams.get('page') ?? '1'));

  const [repasses,      setRepasses]      = useState<Repasse[]>([]);
  const [isLoading,     setIsLoading]     = useState(true);
  const [error,         setError]         = useState<string | null>(null);
  const [success,       setSuccess]       = useState<string | null>(null);
  const [modalProcessar, setModalProcessar] = useState<Repasse | null>(null);
  const [modalDetalhe,   setModalDetalhe]   = useState<Repasse | null>(null);

  const loadRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const successRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(() => {
    setIsLoading(true); setError(null);
    if (loadRef.current) clearTimeout(loadRef.current);
    loadRef.current = setTimeout(() => {
      try { setRepasses([...getStore()]); setIsLoading(false); }
      catch { setError('Erro ao carregar repasses.'); setIsLoading(false); }
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

  const handleSearch = (v: string) => {
    if (searchRef.current) clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => pushUrl({ q: v }), 300);
  };

  const handleProcessar = (referencia: string) => {
    if (!modalProcessar) return;
    const id = modalProcessar.id;
    const today = new Date().toISOString().slice(0, 10);
    patchStore(id, r => ({ ...r, status: 'concluido', referenciaTransferencia: referencia, dataProcessamento: today }));
    setRepasses([...getStore()]);
    setModalProcessar(null);
    setSuccess(`Repasse ${id} processado com sucesso.`);
    if (successRef.current) clearTimeout(successRef.current);
    successRef.current = setTimeout(() => setSuccess(null), 3500);
  };

  // ── Filtering ─────────────────────────────────────────────
  const isHistorico = (r: Repasse) => r.status === 'concluido' || r.status === 'falhado';

  const baseList = urlTab === 'historico'
    ? repasses.filter(isHistorico)
    : repasses;

  const filtered = baseList.filter(r => {
    const q = urlSearch.toLowerCase();
    const matchQ = !q
      || r.id.toLowerCase().includes(q)
      || r.solicitacaoId.toLowerCase().includes(q)
      || r.prestadorNome.toLowerCase().includes(q)
      || (r.referenciaTransferencia?.toLowerCase().includes(q) ?? false);
    const matchS = !urlStatus || r.status === urlStatus;
    const matchM = !urlMetodo || r.metodo === urlMetodo;
    const matchI = !urlDataIni || r.data >= urlDataIni;
    const matchF = !urlDataFim || r.data <= urlDataFim;
    return matchQ && matchS && matchM && matchI && matchF;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const page       = Math.min(urlPage, totalPages);
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // ── KPIs ─────────────────────────────────────────────────
  const concluidos    = repasses.filter(r => r.status === 'concluido');
  const pendentes     = repasses.filter(r => r.status === 'pendente' || r.status === 'processando');
  const totalProcessado = concluidos.reduce((s, r) => s + r.valorRepasse, 0);
  const totalPendente   = pendentes.reduce((s, r) => s + r.valorRepasse, 0);

  const hasFilters = !!(urlStatus || urlMetodo || urlDataIni || urlDataFim || urlSearch);

  const handleExport = () => {
    exportCsv(filtered, `repasses_${urlTab}_${new Date().toISOString().slice(0, 10)}.csv`);
  };

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
            label="Total Processado"
            value={fmtAOA(totalProcessado)}
            sub={`${concluidos.length} repasses concluídos`}
            icon={TrendingUp}
            color="bg-emerald-50 text-emerald-600"
          />
          <KpiCard
            label="Pendente de Envio"
            value={fmtAOA(totalPendente)}
            sub={`${pendentes.length} repasses por processar`}
            icon={Clock}
            color="bg-amber-50 text-amber-600"
          />
          <KpiCard
            label="Total de Repasses"
            value={String(repasses.length)}
            sub={`${repasses.filter(r => r.status === 'falhado').length} falhados`}
            icon={ArrowLeftRight}
            color="bg-blue-50 text-blue-600"
          />
        </div>

        {/* Tabs */}
        <div className="shrink-0 flex items-center gap-1 bg-gray-100 rounded-xl p-1 w-fit">
          {([
            { key: 'todos',     label: 'Todos os Repasses', icon: ArrowLeftRight },
            { key: 'historico', label: 'Histórico',          icon: History },
          ] as const).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => pushUrl({ tab: key })}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${urlTab === key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Icon size={12} />
              {label}
              {key === 'historico' && (
                <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${urlTab === key ? 'bg-gray-100 text-gray-600' : 'bg-gray-200 text-gray-500'}`}>
                  {concluidos.length + repasses.filter(r => r.status === 'falhado').length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="shrink-0 bg-white rounded-2xl border border-gray-200 shadow-xs p-4">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[180px]">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                defaultValue={urlSearch}
                onChange={e => handleSearch(e.target.value)}
                placeholder="Prestador, solicitação, referência..."
                className="w-full pl-8 pr-8 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-400 focus:bg-white transition-colors placeholder:text-gray-400"
              />
              {urlSearch && (
                <button onClick={() => pushUrl({ q: '' })} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                  <X size={11} />
                </button>
              )}
            </div>

            {/* Status */}
            <Select
              value={urlStatus}
              onChange={v => pushUrl({ status: v })}
              options={STATUS_OPTIONS}
              className="w-44"
            />

            {/* Método */}
            <Select
              value={urlMetodo}
              onChange={v => pushUrl({ metodo: v })}
              options={METODO_OPTIONS}
              className="w-52"
            />

            {/* Data inicial */}
            <div className="relative">
              <Calendar size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="date"
                value={urlDataIni}
                onChange={e => pushUrl({ dataIni: e.target.value })}
                className="pl-8 pr-3 py-2 text-xs text-gray-700 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-400 focus:bg-white transition-colors cursor-pointer [color-scheme:light]"
              />
            </div>

            {/* Data final */}
            <div className="relative">
              <Calendar size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="date"
                value={urlDataFim}
                onChange={e => pushUrl({ dataFim: e.target.value })}
                className="pl-8 pr-3 py-2 text-xs text-gray-700 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-400 focus:bg-white transition-colors cursor-pointer [color-scheme:light]"
              />
            </div>

            {/* Export */}
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer"
            >
              <Download size={11} /> Exportar CSV
            </button>

            {/* Clear */}
            {hasFilters && (
              <button
                onClick={() => router.push('?')}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
              >
                <X size={11} /> Limpar
              </button>
            )}
          </div>
        </div>

        {/* Table card */}
        <div className="flex-1 min-h-0 bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden flex flex-col">

          {/* Card header */}
          <div className="shrink-0 px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-sm font-bold text-gray-900">
                {urlTab === 'historico' ? 'Histórico de Repasses' : 'Repasses'}
              </h2>
              <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
                {hasFilters && ' (filtrado)'}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {(['pendente', 'processando', 'concluido', 'falhado'] as StatusRepasse[]).map(s => {
                const count = repasses.filter(r => r.status === s).length;
                const cfg   = STATUS_CFG[s];
                return (
                  <button
                    key={s}
                    onClick={() => pushUrl({ status: urlStatus === s ? '' : s })}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${urlStatus === s ? cfg.classes + ' ring-2 ring-offset-1 ring-gray-300' : cfg.classes}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    {cfg.label} ({count})
                  </button>
                );
              })}
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
                  <p className="text-sm font-bold text-gray-600">Nenhum repasse encontrado</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {hasFilters ? 'Tente ajustar os filtros aplicados.' : 'Não existem repasses registados.'}
                  </p>
                </div>
                {hasFilters && (
                  <button onClick={() => router.push('?')} className="text-xs text-emerald-600 font-semibold hover:text-emerald-700 cursor-pointer">
                    Limpar filtros
                  </button>
                )}
              </div>
            ) : (
              <table className="w-full text-xs min-w-[800px]">
                <thead className="sticky top-0 z-10">
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {['Prestador', 'Solicitação', 'Valor do Repasse', 'Método', 'IBAN', 'Status', 'Data', 'Ações'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap last:text-right">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginated.map(r => {
                    const scfg = STATUS_CFG[r.status];
                    const canProcess = r.status === 'pendente' || r.status === 'processando';
                    return (
                      <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3.5">
                          <div>
                            <p className="font-semibold text-gray-800 truncate max-w-[160px]">{r.prestadorNome}</p>
                            <p className="text-[10px] text-gray-400 font-mono mt-0.5">{r.id}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <Link href={`/solicitacoes/${r.solicitacaoId}`} className="font-bold text-emerald-700 hover:text-emerald-900 hover:underline underline-offset-2 font-mono transition-colors">
                            {r.solicitacaoId}
                          </Link>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="font-bold text-gray-900">{fmtAOA(r.valorRepasse)}</span>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="text-gray-600 font-medium">{METODO_CFG[r.metodo].label}</span>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="font-mono text-[10px] text-gray-500">{maskIban(r.prestadorIban)}</span>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${scfg.classes}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${scfg.dot}`} />
                            {scfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="text-gray-500">{fmtDate(r.data)}</span>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            {canProcess && (
                              <button
                                onClick={() => setModalProcessar(r)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg hover:bg-emerald-100 hover:border-emerald-200 transition-colors cursor-pointer"
                              >
                                <Send size={10} /> Processar
                              </button>
                            )}
                            <button
                              onClick={() => setModalDetalhe(r)}
                              title="Ver detalhes"
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
      {modalProcessar && (
        <ProcessarModal
          repasse={modalProcessar}
          onClose={() => setModalProcessar(null)}
          onConfirm={handleProcessar}
        />
      )}
      {modalDetalhe && (
        <DetalheModal
          repasse={modalDetalhe}
          onClose={() => setModalDetalhe(null)}
        />
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Page export
// ─────────────────────────────────────────────────────────────

export default function RepassesPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <RepassesContent />
    </Suspense>
  );
}
