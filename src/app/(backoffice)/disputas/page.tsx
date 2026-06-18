'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search, X, ChevronLeft, ChevronRight, RotateCw,
  AlertTriangle, Inbox, Loader, Scale,
  ChevronDown, Calendar, Clock, CheckCircle2,
  AlertOctagon, Shield, TrendingDown, ArrowRight,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export type StatusDisputa  = 'aberta' | 'em_analise' | 'resolvida' | 'encerrada';
export type MotivoDisputa  =
  | 'qualidade' | 'nao_compareceu' | 'cobranca_indevida'
  | 'dano_propriedade' | 'atraso' | 'outro';

export interface Disputa {
  id: string;
  solicitacaoId: string;
  clienteNome: string;
  prestadorNome: string;
  servico: string;
  motivo: MotivoDisputa;
  descricao: string;
  status: StatusDisputa;
  dataAbertura: string;
  dataUltimaAtualizacao: string;
  resolucao: string | null;
  dataResolucao: string | null;
  partesNotificadas: boolean;
  valorEmDisputa: number | null;
}

// ─────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────

export const STATUS_CFG: Record<StatusDisputa, { label: string; classes: string; dot: string }> = {
  aberta:     { label: 'Aberta',      classes: 'bg-red-50 text-red-600 border border-red-100',         dot: 'bg-red-500' },
  em_analise: { label: 'Em Análise',  classes: 'bg-amber-50 text-amber-700 border border-amber-100',   dot: 'bg-amber-400' },
  resolvida:  { label: 'Resolvida',   classes: 'bg-emerald-50 text-emerald-700 border border-emerald-100', dot: 'bg-emerald-500' },
  encerrada:  { label: 'Encerrada',   classes: 'bg-gray-100 text-gray-500 border border-gray-200',     dot: 'bg-gray-400' },
};

export const MOTIVO_CFG: Record<MotivoDisputa, { label: string }> = {
  qualidade:         { label: 'Qualidade do serviço' },
  nao_compareceu:    { label: 'Prestador não compareceu' },
  cobranca_indevida: { label: 'Cobrança indevida' },
  dano_propriedade:  { label: 'Dano em propriedade' },
  atraso:            { label: 'Atraso na execução' },
  outro:             { label: 'Outro motivo' },
};

const STATUS_OPTIONS: Array<{ value: StatusDisputa | ''; label: string }> = [
  { value: '',           label: 'Todos os estados' },
  { value: 'aberta',     label: 'Aberta' },
  { value: 'em_analise', label: 'Em Análise' },
  { value: 'resolvida',  label: 'Resolvida' },
  { value: 'encerrada',  label: 'Encerrada' },
];

const MOTIVO_OPTIONS: Array<{ value: MotivoDisputa | ''; label: string }> = [
  { value: '',                  label: 'Todos os motivos' },
  { value: 'qualidade',         label: 'Qualidade do serviço' },
  { value: 'nao_compareceu',    label: 'Não compareceu' },
  { value: 'cobranca_indevida', label: 'Cobrança indevida' },
  { value: 'dano_propriedade',  label: 'Dano em propriedade' },
  { value: 'atraso',            label: 'Atraso na execução' },
  { value: 'outro',             label: 'Outro motivo' },
];

const ITEMS_PER_PAGE = 12;

// ─────────────────────────────────────────────────────────────
// Mock data
// ─────────────────────────────────────────────────────────────

const RAW: Omit<Disputa, 'id'>[] = [
  {
    solicitacaoId: 'SS-024', clienteNome: 'Jacinto Afonso Pereira',   prestadorNome: 'Rui Manuel Santos',
    servico: 'Pintura interior de moradia',      motivo: 'atraso',
    descricao: 'O prestador chegou com 3 dias de atraso sem qualquer aviso. A obra ficou inacabada e o cliente teve prejuízos.',
    status: 'em_analise', dataAbertura: '2026-06-14', dataUltimaAtualizacao: '2026-06-16',
    resolucao: null, dataResolucao: null, partesNotificadas: false, valorEmDisputa: 35000,
  },
  {
    solicitacaoId: 'SS-025', clienteNome: 'Gertrudes Piedade Costa',  prestadorNome: 'Sandra Maria Costa',
    servico: 'Limpeza industrial de armazém',    motivo: 'qualidade',
    descricao: 'O serviço de limpeza foi realizado de forma superficial. Diversas áreas não foram cobertas conforme o contrato.',
    status: 'aberta', dataAbertura: '2026-06-17', dataUltimaAtualizacao: '2026-06-17',
    resolucao: null, dataResolucao: null, partesNotificadas: false, valorEmDisputa: 22000,
  },
  {
    solicitacaoId: 'SS-026', clienteNome: 'Domingos Paulo Azevedo',   prestadorNome: 'Catarina Isabel Lopes',
    servico: 'Instalação de sistema de rega',    motivo: 'cobranca_indevida',
    descricao: 'O prestador cobrou 15.000 AOA adicionais não constantes no orçamento inicial aprovado pelo cliente.',
    status: 'resolvida', dataAbertura: '2026-06-10', dataUltimaAtualizacao: '2026-06-15',
    resolucao: 'Após análise das evidências, o valor adicional cobrado não tem fundamentação contratual. O prestador foi notificado para reembolsar os 15.000 AOA no prazo de 5 dias úteis.',
    dataResolucao: '2026-06-15', partesNotificadas: true, valorEmDisputa: 15000,
  },
  {
    solicitacaoId: 'SS-027', clienteNome: 'Esperança Sofia Ribeiro',  prestadorNome: 'Filipe Alberto Dias',
    servico: 'Substituição de quadro eléctrico', motivo: 'dano_propriedade',
    descricao: 'Durante a instalação, o prestador danificou o quadro de cerâmica na parede. O cliente pede indemnização pelo dano causado.',
    status: 'encerrada', dataAbertura: '2026-06-08', dataUltimaAtualizacao: '2026-06-12',
    resolucao: 'Disputa encerrada após acordo directo entre as partes. O prestador comprometeu-se a reparar o dano causado no prazo de 48 horas.',
    dataResolucao: '2026-06-12', partesNotificadas: true, valorEmDisputa: 8500,
  },
  {
    solicitacaoId: 'SS-028', clienteNome: 'Virgílio Gonçalo Neto',    prestadorNome: 'Paulo Eduardo Costa',
    servico: 'Manutenção de ar condicionado',    motivo: 'nao_compareceu',
    descricao: 'O prestador não compareceu na data e hora agendadas. Não contactou o cliente nem justificou a ausência.',
    status: 'aberta', dataAbertura: '2026-06-18', dataUltimaAtualizacao: '2026-06-18',
    resolucao: null, dataResolucao: null, partesNotificadas: false, valorEmDisputa: null,
  },
  {
    solicitacaoId: 'SS-029', clienteNome: 'Adalgisa Helena Matos',    prestadorNome: 'João Carlos Teles',
    servico: 'Limpeza profunda de cozinha',      motivo: 'qualidade',
    descricao: 'Os produtos utilizados danificaram a superfície de granito da bancada da cozinha. O cliente exige reposição.',
    status: 'em_analise', dataAbertura: '2026-06-15', dataUltimaAtualizacao: '2026-06-17',
    resolucao: null, dataResolucao: null, partesNotificadas: false, valorEmDisputa: 42000,
  },
  {
    solicitacaoId: 'SS-030', clienteNome: 'Felicidade Amélia Pires',  prestadorNome: 'Vanessa Sofia Lima',
    servico: 'Limpeza pós-evento',               motivo: 'atraso',
    descricao: 'O serviço só foi concluído 6 horas além do prazo acordado, causando dificuldades ao cliente.',
    status: 'resolvida', dataAbertura: '2026-06-09', dataUltimaAtualizacao: '2026-06-11',
    resolucao: 'Verificado atraso de 6 horas por questões logísticas do prestador. Aplicada penalidade de 10% sobre o valor do serviço, conforme cláusula contratual.',
    dataResolucao: '2026-06-11', partesNotificadas: true, valorEmDisputa: 2500,
  },
  {
    solicitacaoId: 'SS-031', clienteNome: 'Gracindo Estêvão Lima',    prestadorNome: 'António Ferreira Silva',
    servico: 'Reparação de caldeira',            motivo: 'outro',
    descricao: 'O cliente alega que o prestador deixou resíduos e ferramentas na propriedade após conclusão do serviço.',
    status: 'encerrada', dataAbertura: '2026-06-05', dataUltimaAtualizacao: '2026-06-08',
    resolucao: 'Disputa encerrada. Prestador recolheu os materiais deixados. Cliente confirmou resolução satisfatória.',
    dataResolucao: '2026-06-08', partesNotificadas: true, valorEmDisputa: null,
  },
  {
    solicitacaoId: 'SS-032', clienteNome: 'Teresinha Dulce Sousa',    prestadorNome: 'Rui Manuel Santos',
    servico: 'Instalação de lustre',             motivo: 'qualidade',
    descricao: 'O lustre instalado apresenta oscilação. O prestador utilizou suportes inadequados para o tecto de gesso.',
    status: 'aberta', dataAbertura: '2026-06-18', dataUltimaAtualizacao: '2026-06-18',
    resolucao: null, dataResolucao: null, partesNotificadas: false, valorEmDisputa: 6000,
  },
  {
    solicitacaoId: 'SS-033', clienteNome: 'Amâncio Bruno Rodrigues',  prestadorNome: 'Nelson Augusto Pires',
    servico: 'Tratamento de plantas ornamentais', motivo: 'cobranca_indevida',
    descricao: 'Cobrado o dobro do preço acordado. O cliente tem o orçamento assinado como prova.',
    status: 'em_analise', dataAbertura: '2026-06-16', dataUltimaAtualizacao: '2026-06-17',
    resolucao: null, dataResolucao: null, partesNotificadas: false, valorEmDisputa: 18000,
  },
];

const MOCK_DISPUTAS: Disputa[] = RAW.map((d, i) => ({
  ...d,
  id: `DIS-${String(i + 1).padStart(3, '0')}`,
}));

let _store: Disputa[] | null = null;
export function getDisputasStore(): Disputa[] {
  if (!_store) _store = MOCK_DISPUTAS.map(d => ({ ...d }));
  return _store;
}
export function patchDisputasStore(id: string, updater: (d: Disputa) => Disputa) {
  if (!_store) getDisputasStore();
  _store = _store!.map(d => d.id === id ? updater(d) : d);
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

function fmtAOA(v: number) {
  return v.toLocaleString('pt-PT') + ' AOA';
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

function PageSkeleton() {
  return (
    <div className="flex flex-col h-full gap-5 animate-pulse">
      <div className="shrink-0 grid grid-cols-1 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
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
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 bg-gray-100 rounded-xl w-36" />
          ))}
        </div>
      </div>
      <div className="flex-1 min-h-0 bg-white rounded-2xl border border-gray-200 flex flex-col">
        <div className="shrink-0 px-6 py-4 border-b border-gray-100">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
        </div>
        <div className="flex-1 min-h-0 overflow-hidden">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-gray-50">
              <div className="h-3 bg-gray-200 rounded w-20" />
              <div className="h-3 bg-gray-100 rounded w-16" />
              <div className="h-3 bg-gray-100 rounded flex-1" />
              <div className="h-3 bg-gray-100 rounded w-28" />
              <div className="h-5 bg-gray-100 rounded-full w-20" />
              <div className="h-3 bg-gray-100 rounded w-20" />
              <div className="h-7 bg-gray-100 rounded-lg w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Inner page
// ─────────────────────────────────────────────────────────────

function DisputasContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const urlStatus  = (searchParams.get('status')  ?? '') as StatusDisputa | '';
  const urlMotivo  = (searchParams.get('motivo')  ?? '') as MotivoDisputa | '';
  const urlDataIni = searchParams.get('dataIni')  ?? '';
  const urlDataFim = searchParams.get('dataFim')  ?? '';
  const urlSearch  = searchParams.get('q')        ?? '';
  const urlPage    = Math.max(1, Number(searchParams.get('page') ?? '1'));

  const [disputas,  setDisputas]  = useState<Disputa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState<string | null>(null);

  const loadRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(() => {
    setIsLoading(true); setError(null);
    if (loadRef.current) clearTimeout(loadRef.current);
    loadRef.current = setTimeout(() => {
      try { setDisputas([...getDisputasStore()]); setIsLoading(false); }
      catch { setError('Erro ao carregar disputas.'); setIsLoading(false); }
    }, 350);
  }, []);

  useEffect(() => {
    load();
    return () => {
      if (loadRef.current)  clearTimeout(loadRef.current);
      if (searchRef.current) clearTimeout(searchRef.current);
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

  // ── Filtering ─────────────────────────────────────────────
  const filtered = disputas.filter(d => {
    const q = urlSearch.toLowerCase();
    const matchQ = !q
      || d.id.toLowerCase().includes(q)
      || d.solicitacaoId.toLowerCase().includes(q)
      || d.clienteNome.toLowerCase().includes(q)
      || d.prestadorNome.toLowerCase().includes(q)
      || d.descricao.toLowerCase().includes(q);
    const matchS = !urlStatus || d.status === urlStatus;
    const matchM = !urlMotivo || d.motivo === urlMotivo;
    const matchI = !urlDataIni || d.dataAbertura >= urlDataIni;
    const matchF = !urlDataFim || d.dataAbertura <= urlDataFim;
    return matchQ && matchS && matchM && matchI && matchF;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const page       = Math.min(urlPage, totalPages);
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // ── KPIs ─────────────────────────────────────────────────
  const abertas    = disputas.filter(d => d.status === 'aberta').length;
  const emAnalise  = disputas.filter(d => d.status === 'em_analise').length;
  const resolvidas = disputas.filter(d => d.status === 'resolvida' || d.status === 'encerrada').length;
  const valorTotal = disputas
    .filter(d => d.valorEmDisputa !== null && (d.status === 'aberta' || d.status === 'em_analise'))
    .reduce((s, d) => s + (d.valorEmDisputa ?? 0), 0);

  const hasFilters = !!(urlStatus || urlMotivo || urlDataIni || urlDataFim || urlSearch);

  if (isLoading) return <PageSkeleton />;

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-gray-200 p-12 flex flex-col items-center gap-4 text-center max-w-sm w-full">
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
    <div className="flex flex-col h-full gap-5 max-w-[1400px] mx-auto">

      {/* KPIs */}
      <div className="shrink-0 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Abertas"          value={String(abertas)}    sub="Aguardam análise"         icon={AlertOctagon}  color="bg-red-50 text-red-500" />
        <KpiCard label="Em Análise"       value={String(emAnalise)}  sub="Em processo de mediação"  icon={Clock}         color="bg-amber-50 text-amber-600" />
        <KpiCard label="Resolvidas"        value={String(resolvidas)} sub="Encerradas com sucesso"   icon={CheckCircle2}  color="bg-emerald-50 text-emerald-600" />
        <KpiCard label="Valor em Disputa" value={valorTotal > 0 ? fmtAOA(valorTotal) : '—'} sub="Disputas activas" icon={TrendingDown} color="bg-blue-50 text-blue-600" />
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
              placeholder="ID, cliente, prestador..."
              className="w-full pl-8 pr-8 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-400 focus:bg-white transition-colors placeholder:text-gray-400"
            />
            {urlSearch && (
              <button onClick={() => pushUrl({ q: '' })} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                <X size={11} />
              </button>
            )}
          </div>

          <Select value={urlStatus} onChange={v => pushUrl({ status: v })} options={STATUS_OPTIONS} className="w-44" />
          <Select value={urlMotivo} onChange={v => pushUrl({ motivo: v })} options={MOTIVO_OPTIONS} className="w-52" />

          <div className="relative">
            <Calendar size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input type="date" value={urlDataIni} onChange={e => pushUrl({ dataIni: e.target.value })}
              className="pl-8 pr-3 py-2 text-xs text-gray-700 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-400 focus:bg-white transition-colors cursor-pointer [color-scheme:light]" />
          </div>
          <div className="relative">
            <Calendar size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input type="date" value={urlDataFim} onChange={e => pushUrl({ dataFim: e.target.value })}
              className="pl-8 pr-3 py-2 text-xs text-gray-700 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-400 focus:bg-white transition-colors cursor-pointer [color-scheme:light]" />
          </div>

          {hasFilters && (
            <button onClick={() => router.push('?')} className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer">
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
            <h2 className="text-sm font-bold text-gray-900">Disputas</h2>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">
              {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}{hasFilters && ' (filtrado)'}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {(['aberta', 'em_analise', 'resolvida', 'encerrada'] as StatusDisputa[]).map(s => {
              const count = disputas.filter(d => d.status === s).length;
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
                <p className="text-sm font-bold text-gray-600">Nenhuma disputa encontrada</p>
                <p className="text-xs text-gray-400 mt-1">
                  {hasFilters ? 'Tente ajustar os filtros aplicados.' : 'Não existem disputas registadas.'}
                </p>
              </div>
              {hasFilters && (
                <button onClick={() => router.push('?')} className="text-xs text-emerald-600 font-semibold hover:text-emerald-700 cursor-pointer">
                  Limpar filtros
                </button>
              )}
            </div>
          ) : (
            <table className="w-full text-xs min-w-[820px]">
              <thead className="sticky top-0 z-10">
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['ID', 'Solicitação', 'Cliente', 'Prestador', 'Motivo', 'Status', 'Aberta em', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap last:text-right">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.map(d => {
                  const scfg = STATUS_CFG[d.status];
                  const mcfg = MOTIVO_CFG[d.motivo];
                  return (
                    <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="font-bold text-gray-700 font-mono text-[11px]">{d.id}</span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <Link href={`/solicitacoes/${d.solicitacaoId}`} className="font-bold text-emerald-700 hover:underline underline-offset-2 font-mono transition-colors">
                          {d.solicitacaoId}
                        </Link>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-medium text-gray-700 truncate block max-w-[130px]">{d.clienteNome}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-medium text-gray-600 truncate block max-w-[130px]">{d.prestadorNome}</span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="text-gray-600">{mcfg.label}</span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${scfg.classes}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${scfg.dot}`} />
                          {scfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="text-gray-500">{fmtDate(d.dataAbertura)}</span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-right">
                        <Link
                          href={`/disputas/${d.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-colors cursor-pointer"
                        >
                          Ver detalhe <ArrowRight size={10} />
                        </Link>
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
              <button onClick={() => setPage(page - 1)} disabled={page === 1}
                className="w-7 h-7 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-500 disabled:opacity-40 transition-colors cursor-pointer disabled:cursor-not-allowed">
                <ChevronLeft size={13} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                .reduce<(number | 'e')[]>((acc, n, i, arr) => {
                  if (i > 0 && n - (arr[i - 1] as number) > 1) acc.push('e');
                  acc.push(n); return acc;
                }, [])
                .map((n, i) => n === 'e'
                  ? <span key={`e${i}`} className="text-[10px] text-gray-400 px-1">…</span>
                  : <button key={n} onClick={() => setPage(n as number)}
                      className={`w-7 h-7 rounded-lg border text-[10px] font-bold transition-colors cursor-pointer ${page === n ? 'bg-[#06241C] text-white border-[#06241C]' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}>
                      {n}
                    </button>
                )}
              <button onClick={() => setPage(page + 1)} disabled={page === totalPages}
                className="w-7 h-7 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-500 disabled:opacity-40 transition-colors cursor-pointer disabled:cursor-not-allowed">
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Page export
// ─────────────────────────────────────────────────────────────

export default function DisputasPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <DisputasContent />
    </Suspense>
  );
}
