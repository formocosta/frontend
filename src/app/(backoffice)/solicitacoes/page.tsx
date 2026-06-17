'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search, AlertTriangle, Inbox, RotateCw,
  ChevronLeft, ChevronRight, ClipboardList,
  Send, Check, X, ChevronDown, CheckCircle2,
  Loader,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────

type StatusSolicitacao =
  | 'submetida'
  | 'em_analise'
  | 'encaminhada'
  | 'em_execucao'
  | 'concluida'
  | 'cancelada';

type Categoria = 'limpeza' | 'canalizacao' | 'eletricidade' | 'jardinagem' | 'outros';
type Provincia = 'luanda' | 'benguela' | 'huila' | 'huambo' | 'outras';

interface Solicitacao {
  id: string;
  clienteNome: string;
  servico: string;
  categoria: Categoria;
  prestador: string | null;
  dataPretendida: string; // YYYY-MM-DD
  status: StatusSolicitacao;
  operadorResponsavel: string | null;
  provincia: Provincia;
}

interface Prestador {
  id: string;
  nome: string;
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

const CATEGORIA_LABELS: Record<Categoria, string> = {
  limpeza:      'Limpeza',
  canalizacao:  'Canalização',
  eletricidade: 'Eletricidade',
  jardinagem:   'Jardinagem',
  outros:       'Outros',
};

const STATUS_OPTIONS: Array<{ value: StatusSolicitacao | ''; label: string }> = [
  { value: '',            label: 'Todos os estados' },
  { value: 'submetida',   label: 'Submetida' },
  { value: 'em_analise',  label: 'Em Análise' },
  { value: 'encaminhada', label: 'Encaminhada' },
  { value: 'em_execucao', label: 'Em Execução' },
  { value: 'concluida',   label: 'Concluída' },
  { value: 'cancelada',   label: 'Cancelada' },
];

const CATEGORIA_OPTIONS: Array<{ value: Categoria | ''; label: string }> = [
  { value: '',             label: 'Todas as categorias' },
  { value: 'limpeza',      label: 'Limpeza' },
  { value: 'canalizacao',  label: 'Canalização' },
  { value: 'eletricidade', label: 'Eletricidade' },
  { value: 'jardinagem',   label: 'Jardinagem' },
  { value: 'outros',       label: 'Outros' },
];

const PROVINCIA_OPTIONS: Array<{ value: Provincia | ''; label: string }> = [
  { value: '',         label: 'Todas as províncias' },
  { value: 'luanda',   label: 'Luanda' },
  { value: 'benguela', label: 'Benguela' },
  { value: 'huila',    label: 'Huíla' },
  { value: 'huambo',   label: 'Huambo' },
  { value: 'outras',   label: 'Outras' },
];

const ITEMS_PER_PAGE = 20;
const CAN_ENCAMINHAR: StatusSolicitacao[] = ['submetida', 'em_analise'];

// ── Mock Prestadores ──────────────────────────────────────

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

// ── Mock Solicitações (~35 entries to test pagination) ────

const MOCK_SOLICITACOES: Solicitacao[] = [
  // Submetidas (8)
  { id: 'SS-001', clienteNome: 'Eduardo Filipe Neto',      servico: 'Limpeza geral de apartamento',        categoria: 'limpeza',      prestador: null,                     dataPretendida: '2026-06-20', status: 'submetida',   operadorResponsavel: null,           provincia: 'luanda' },
  { id: 'SS-002', clienteNome: 'Rosa Maria Carvalho',      servico: 'Reparação de canalização',             categoria: 'canalizacao',  prestador: null,                     dataPretendida: '2026-06-21', status: 'submetida',   operadorResponsavel: null,           provincia: 'benguela' },
  { id: 'SS-003', clienteNome: 'Simão Augusto Pinto',      servico: 'Instalação de tomadas eléctricas',    categoria: 'eletricidade', prestador: null,                     dataPretendida: '2026-06-22', status: 'submetida',   operadorResponsavel: null,           provincia: 'luanda' },
  { id: 'SS-004', clienteNome: 'Bela Fernanda Gomes',      servico: 'Poda e manutenção de jardim',          categoria: 'jardinagem',   prestador: null,                     dataPretendida: '2026-06-23', status: 'submetida',   operadorResponsavel: null,           provincia: 'huila' },
  { id: 'SS-005', clienteNome: 'Custódio Albano Sousa',    servico: 'Montagem de móveis',                   categoria: 'outros',       prestador: null,                     dataPretendida: '2026-06-24', status: 'submetida',   operadorResponsavel: null,           provincia: 'huambo' },
  { id: 'SS-006', clienteNome: 'Helena Isabel Dias',       servico: 'Limpeza pós-obra',                     categoria: 'limpeza',      prestador: null,                     dataPretendida: '2026-06-25', status: 'submetida',   operadorResponsavel: null,           provincia: 'luanda' },
  { id: 'SS-007', clienteNome: 'Artur Manuel Vieira',      servico: 'Reparação de infiltração',             categoria: 'canalizacao',  prestador: null,                     dataPretendida: '2026-06-26', status: 'submetida',   operadorResponsavel: null,           provincia: 'benguela' },
  { id: 'SS-008', clienteNome: 'Nádia Cristina Borges',    servico: 'Reparação de disjuntores',             categoria: 'eletricidade', prestador: null,                     dataPretendida: '2026-06-27', status: 'submetida',   operadorResponsavel: null,           provincia: 'outras' },
  // Em análise (7)
  { id: 'SS-009', clienteNome: 'Joaquim Pedro Ferreira',   servico: 'Limpeza de escritório semanal',        categoria: 'limpeza',      prestador: 'João Carlos Teles',      dataPretendida: '2026-06-18', status: 'em_analise',  operadorResponsavel: 'Operador Maria',   provincia: 'luanda' },
  { id: 'SS-010', clienteNome: 'Olívia Raquel Marques',    servico: 'Substituição de cano principal',       categoria: 'canalizacao',  prestador: null,                     dataPretendida: '2026-06-19', status: 'em_analise',  operadorResponsavel: 'Operador Carlos',  provincia: 'luanda' },
  { id: 'SS-011', clienteNome: 'Gabriel Augusto Lima',     servico: 'Instalação de painel solar',           categoria: 'eletricidade', prestador: 'Rui Manuel Santos',      dataPretendida: '2026-06-20', status: 'em_analise',  operadorResponsavel: 'Operador Maria',   provincia: 'huila' },
  { id: 'SS-012', clienteNome: 'Flávia Mariana Torres',    servico: 'Jardinagem e relvado',                 categoria: 'jardinagem',   prestador: null,                     dataPretendida: '2026-06-21', status: 'em_analise',  operadorResponsavel: 'Operador Kwame',   provincia: 'benguela' },
  { id: 'SS-013', clienteNome: 'Dário Esteves Cunha',      servico: 'Pintura de fachada',                   categoria: 'outros',       prestador: null,                     dataPretendida: '2026-06-22', status: 'em_analise',  operadorResponsavel: 'Operador Carlos',  provincia: 'huambo' },
  { id: 'SS-014', clienteNome: 'Marta Sofia Neves',        servico: 'Desentupimento de sanita',             categoria: 'canalizacao',  prestador: 'António Ferreira Silva', dataPretendida: '2026-06-17', status: 'em_analise',  operadorResponsavel: 'Operador Kwame',   provincia: 'luanda' },
  { id: 'SS-015', clienteNome: 'Rui Bernardo Alves',       servico: 'Limpeza de caleiras',                  categoria: 'limpeza',      prestador: null,                     dataPretendida: '2026-06-18', status: 'em_analise',  operadorResponsavel: 'Operador Maria',   provincia: 'outras' },
  // Encaminhadas (8)
  { id: 'SS-016', clienteNome: 'Soraia Patrícia Mendes',   servico: 'Limpeza doméstica quinzenal',          categoria: 'limpeza',      prestador: 'Sandra Maria Costa',     dataPretendida: '2026-06-17', status: 'encaminhada', operadorResponsavel: 'Operador Carlos',  provincia: 'luanda' },
  { id: 'SS-017', clienteNome: 'Benedito Carlos Lemos',    servico: 'Instalação de chuveiro',               categoria: 'canalizacao',  prestador: 'João Carlos Teles',      dataPretendida: '2026-06-18', status: 'encaminhada', operadorResponsavel: 'Operador Maria',   provincia: 'benguela' },
  { id: 'SS-018', clienteNome: 'Celeste Amélia Mota',      servico: 'Revisão eléctrica completa',           categoria: 'eletricidade', prestador: 'Filipe Alberto Dias',    dataPretendida: '2026-06-19', status: 'encaminhada', operadorResponsavel: 'Operador Kwame',   provincia: 'huila' },
  { id: 'SS-019', clienteNome: 'Horácio Manuel Teixeira',  servico: 'Plantação de árvores fruteiras',       categoria: 'jardinagem',   prestador: 'Catarina Isabel Lopes',  dataPretendida: '2026-06-20', status: 'encaminhada', operadorResponsavel: 'Operador Carlos',  provincia: 'luanda' },
  { id: 'SS-020', clienteNome: 'Emília Francisca Rocha',   servico: 'Impermeabilização de telhado',         categoria: 'outros',       prestador: 'Paulo Eduardo Costa',    dataPretendida: '2026-06-21', status: 'encaminhada', operadorResponsavel: 'Operador Maria',   provincia: 'huambo' },
  { id: 'SS-021', clienteNome: 'Ivone Graça Santos',       servico: 'Desinfestação e controlo de pragas',   categoria: 'outros',       prestador: 'Nelson Augusto Pires',   dataPretendida: '2026-06-22', status: 'encaminhada', operadorResponsavel: 'Operador Kwame',   provincia: 'benguela' },
  { id: 'SS-022', clienteNome: 'Luís Filipe Correia',      servico: 'Limpeza de piscina',                   categoria: 'limpeza',      prestador: 'Vanessa Sofia Lima',     dataPretendida: '2026-06-18', status: 'encaminhada', operadorResponsavel: 'Operador Carlos',  provincia: 'luanda' },
  { id: 'SS-023', clienteNome: 'Perpétua Josefina Dias',   servico: 'Reparação de torneiras',               categoria: 'canalizacao',  prestador: 'Maria Conceição Neto',   dataPretendida: '2026-06-19', status: 'encaminhada', operadorResponsavel: 'Operador Maria',   provincia: 'outras' },
  // Em execução (6)
  { id: 'SS-024', clienteNome: 'Jacinto Afonso Pereira',   servico: 'Pintura interior de moradia',          categoria: 'outros',       prestador: 'Rui Manuel Santos',      dataPretendida: '2026-06-16', status: 'em_execucao', operadorResponsavel: 'Operador Kwame',   provincia: 'luanda' },
  { id: 'SS-025', clienteNome: 'Gertrudes Piedade Costa',  servico: 'Limpeza industrial de armazém',        categoria: 'limpeza',      prestador: 'Sandra Maria Costa',     dataPretendida: '2026-06-15', status: 'em_execucao', operadorResponsavel: 'Operador Carlos',  provincia: 'benguela' },
  { id: 'SS-026', clienteNome: 'Domingos Paulo Azevedo',   servico: 'Instalação de sistema de rega',        categoria: 'jardinagem',   prestador: 'Catarina Isabel Lopes',  dataPretendida: '2026-06-14', status: 'em_execucao', operadorResponsavel: 'Operador Maria',   provincia: 'huila' },
  { id: 'SS-027', clienteNome: 'Esperança Sofia Ribeiro',  servico: 'Substituição de quadro eléctrico',    categoria: 'eletricidade', prestador: 'Filipe Alberto Dias',    dataPretendida: '2026-06-13', status: 'em_execucao', operadorResponsavel: 'Operador Kwame',   provincia: 'luanda' },
  { id: 'SS-028', clienteNome: 'Virgílio Gonçalo Neto',    servico: 'Manutenção de ar condicionado',        categoria: 'outros',       prestador: 'Paulo Eduardo Costa',    dataPretendida: '2026-06-12', status: 'em_execucao', operadorResponsavel: 'Operador Carlos',  provincia: 'huambo' },
  { id: 'SS-029', clienteNome: 'Adalgisa Helena Matos',    servico: 'Limpeza profunda de cozinha',          categoria: 'limpeza',      prestador: 'João Carlos Teles',      dataPretendida: '2026-06-11', status: 'em_execucao', operadorResponsavel: 'Operador Maria',   provincia: 'outras' },
  // Concluídas (4)
  { id: 'SS-030', clienteNome: 'Felicidade Amélia Pires',  servico: 'Limpeza pós-evento',                   categoria: 'limpeza',      prestador: 'Vanessa Sofia Lima',     dataPretendida: '2026-06-10', status: 'concluida',   operadorResponsavel: 'Operador Kwame',   provincia: 'luanda' },
  { id: 'SS-031', clienteNome: 'Gracindo Estêvão Lima',    servico: 'Reparação de caldeira',                categoria: 'canalizacao',  prestador: 'António Ferreira Silva', dataPretendida: '2026-06-09', status: 'concluida',   operadorResponsavel: 'Operador Carlos',  provincia: 'benguela' },
  { id: 'SS-032', clienteNome: 'Teresinha Dulce Sousa',    servico: 'Instalação de lustre',                 categoria: 'eletricidade', prestador: 'Rui Manuel Santos',      dataPretendida: '2026-06-08', status: 'concluida',   operadorResponsavel: 'Operador Maria',   provincia: 'huila' },
  { id: 'SS-033', clienteNome: 'Amâncio Bruno Rodrigues',  servico: 'Tratamento de plantas ornamentais',   categoria: 'jardinagem',   prestador: 'Nelson Augusto Pires',   dataPretendida: '2026-06-07', status: 'concluida',   operadorResponsavel: 'Operador Kwame',   provincia: 'luanda' },
  // Canceladas (2)
  { id: 'SS-034', clienteNome: 'Virgínia Rosa Teles',      servico: 'Limpeza de vidros exteriores',         categoria: 'limpeza',      prestador: null,                     dataPretendida: '2026-06-15', status: 'cancelada',   operadorResponsavel: 'Operador Carlos',  provincia: 'outras' },
  { id: 'SS-035', clienteNome: 'Hélder Augusto Carvalho',  servico: 'Instalação de aquecedor',              categoria: 'eletricidade', prestador: null,                     dataPretendida: '2026-06-13', status: 'cancelada',   operadorResponsavel: 'Operador Maria',   provincia: 'huambo' },
];

// ── Module-level cache (persists changes across navigations) ──

let _cache: Solicitacao[] | null = null;

function getSolicitacoes(): Solicitacao[] {
  if (!_cache) _cache = MOCK_SOLICITACOES.map(s => ({ ...s }));
  return _cache;
}

function patchEncaminhar(id: string, prestadorNome: string): void {
  const list = getSolicitacoes();
  const idx = list.findIndex(s => s.id === id);
  if (idx !== -1 && CAN_ENCAMINHAR.includes(list[idx].status)) {
    list[idx] = {
      ...list[idx],
      status: 'encaminhada',
      prestador: prestadorNome,
      operadorResponsavel: 'Operador Atual',
    };
  }
}

// ── Helpers ────────────────────────────────────────────────

function formatDate(yyyyMmDd: string): string {
  try {
    const [y, m, d] = yyyyMmDd.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('pt-PT', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  } catch { return yyyyMmDd; }
}

// ── Primitive display components ───────────────────────────

function StatusBadge({ status }: { status: StatusSolicitacao }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${cfg.classes}`}>
      {cfg.label}
    </span>
  );
}

// ── Styled select wrapper ──────────────────────────────────

function FilterSelect({
  value,
  onChange,
  options,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
  className?: string;
}) {
  return (
    <div className={`relative ${className ?? ''}`}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full appearance-none px-3 py-2 pr-8 text-xs text-gray-800 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-400 focus:bg-white transition-all cursor-pointer [color-scheme:light]"
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  );
}

// ── Table skeleton ─────────────────────────────────────────

function TableSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="border-b border-gray-100 bg-gray-50/30">
        <div className="grid grid-cols-8 gap-3 px-4 py-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-3 bg-gray-200 rounded w-3/4" />
          ))}
        </div>
      </div>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="border-b border-gray-100 last:border-0">
          <div className="flex items-center gap-4 px-4 py-4">
            <div className="w-20 h-3 bg-gray-100 rounded font-mono" />
            <div className="w-28 h-3 bg-gray-100 rounded flex-1" />
            <div className="w-36 h-3 bg-gray-100 rounded" />
            <div className="w-24 h-3 bg-gray-100 rounded" />
            <div className="w-20 h-3 bg-gray-100 rounded" />
            <div className="w-20 h-5 bg-gray-100 rounded-full" />
            <div className="w-24 h-3 bg-gray-100 rounded" />
            <div className="w-24 h-7 bg-gray-100 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="py-16 flex flex-col items-center justify-center text-center gap-3">
      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 border border-gray-100">
        <Inbox size={22} />
      </div>
      <div className="max-w-sm">
        <h3 className="text-sm font-semibold text-gray-950">
          {hasFilters ? 'Nenhum resultado encontrado' : 'Nenhuma solicitação encontrada'}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {hasFilters
            ? 'Tente ajustar os filtros ou o termo de pesquisa.'
            : 'Não existem solicitações de serviço de momento.'}
        </p>
      </div>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="py-16 flex flex-col items-center justify-center text-center gap-3">
      <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500">
        <AlertTriangle size={24} />
      </div>
      <div className="max-w-sm">
        <h3 className="text-sm font-semibold text-gray-950">Erro ao carregar dados</h3>
        <p className="text-xs text-gray-500 mt-1">Ocorreu um erro ao carregar as solicitações. Por favor, tente novamente.</p>
      </div>
      <button
        onClick={onRetry}
        className="mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:border-gray-400 transition-colors shadow-sm cursor-pointer"
      >
        <RotateCw size={12} />
        Tentar Novamente
      </button>
    </div>
  );
}

// ── Prestador searchable select ────────────────────────────

function PrestadorSelect({
  value,
  onChange,
}: {
  value: Prestador | null;
  onChange: (p: Prestador | null) => void;
}) {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filtered = MOCK_PRESTADORES.filter(p =>
    p.nome.toLowerCase().includes(search.toLowerCase()),
  );

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={handleOpen}
        className="w-full flex items-center justify-between px-3 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none hover:border-emerald-400 hover:bg-white focus:border-emerald-400 focus:bg-white transition-all cursor-pointer"
      >
        <span className={value ? 'text-gray-800 font-semibold' : 'text-gray-400'}>
          {value ? value.nome : 'Selecionar prestador...'}
        </span>
        <ChevronDown size={13} className={`text-gray-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden animate-in fade-in duration-150">
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Pesquisar prestador..."
                className="w-full pl-7 pr-3 py-1.5 text-xs text-gray-800 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-400 focus:bg-white transition-all placeholder:text-gray-400"
              />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="px-3 py-3 text-xs text-gray-400 text-center">Nenhum prestador encontrado</p>
            ) : (
              filtered.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => { onChange(p); setIsOpen(false); setSearch(''); }}
                  className={`w-full text-left px-3 py-2.5 text-xs transition-colors hover:bg-emerald-50 flex items-center justify-between ${value?.id === p.id ? 'text-emerald-700 font-semibold bg-emerald-50/60' : 'text-gray-700'}`}
                >
                  <span>{p.nome}</span>
                  {value?.id === p.id && <Check size={11} className="text-emerald-600 shrink-0" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Encaminhar modal ───────────────────────────────────────

function EncaminharModal({
  solicitacao,
  onClose,
  onConfirm,
}: {
  solicitacao: Solicitacao;
  onClose: () => void;
  onConfirm: (prestador: Prestador) => void;
}) {
  const initialPrestador = solicitacao.prestador
    ? (MOCK_PRESTADORES.find(p => p.nome === solicitacao.prestador) ?? null)
    : null;

  const [selectedPrestador, setSelectedPrestador] = useState<Prestador | null>(initialPrestador);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canConfirm = selectedPrestador !== null && !isSubmitting;

  const handleConfirm = () => {
    if (!selectedPrestador || isSubmitting) return;
    setIsSubmitting(true);
    setTimeout(() => onConfirm(selectedPrestador), 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={!isSubmitting ? onClose : undefined} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in duration-200">

        {/* Header */}
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
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer shrink-0 disabled:opacity-40"
          >
            <X size={14} />
          </button>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Resumo da Solicitação</p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">ID</p>
              <p className="text-xs font-bold text-gray-800 font-mono">{solicitacao.id}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Cliente</p>
              <p className="text-xs font-semibold text-gray-800">{solicitacao.clienteNome}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Serviço</p>
              <p className="text-xs font-semibold text-gray-800">{solicitacao.servico}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Data Pretendida</p>
              <p className="text-xs font-semibold text-gray-800">{formatDate(solicitacao.dataPretendida)}</p>
            </div>
          </div>
        </div>

        {/* Prestador field */}
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
            Prestador <span className="text-red-500">*</span>
          </label>
          <PrestadorSelect value={selectedPrestador} onChange={setSelectedPrestador} />
          {solicitacao.prestador && (
            <p className="text-[10px] text-gray-400 mt-1.5">
              Prestador atual:{' '}
              <span className="font-semibold text-gray-600">{solicitacao.prestador}</span>
            </p>
          )}
        </div>

        {/* Confirmation message */}
        {selectedPrestador && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 flex items-start gap-2.5 animate-in fade-in duration-200">
            <Check size={13} className="text-emerald-600 mt-0.5 shrink-0" />
            <p className="text-xs text-emerald-700 font-medium leading-relaxed">
              Tem certeza que deseja encaminhar a solicitação{' '}
              <span className="font-bold">{solicitacao.id}</span> para{' '}
              <span className="font-bold">{selectedPrestador.nome}</span>?
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:border-gray-400 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canConfirm}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {isSubmitting
              ? <Loader size={11} className="animate-spin" />
              : <Send size={11} />}
            Confirmar Encaminhamento
          </button>
        </div>

      </div>
    </div>
  );
}

// ── Page content (uses useSearchParams — must be inside Suspense) ──

function SolicitacoesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlSearch    = searchParams.get('q')         ?? '';
  const urlStatus    = searchParams.get('status')    ?? '';
  const urlCategoria = searchParams.get('categoria') ?? '';
  const urlProvincia = searchParams.get('provincia') ?? '';
  const urlData      = searchParams.get('data')      ?? '';
  const urlPage      = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));

  const [searchInput, setSearchInput] = useState(urlSearch);
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [encaminharModal, setEncaminharModal] = useState<Solicitacao | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const loadTimerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debounceRef     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadData = useCallback(() => {
    setIsLoading(true);
    setError(null);
    if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
    loadTimerRef.current = setTimeout(() => {
      try {
        setSolicitacoes([...getSolicitacoes()]);
        setIsLoading(false);
      } catch {
        setError('Falha ao carregar dados.');
        setIsLoading(false);
      }
    }, 500);
  }, []);

  useEffect(() => {
    loadData();
    return () => {
      if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
    };
  }, [loadData]);

  useEffect(() => { setSearchInput(urlSearch); }, [urlSearch]);

  const updateUrl = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, val] of Object.entries(updates)) {
        if (!val) params.delete(key);
        else params.set(key, val);
      }
      const qs = params.toString();
      router.push(qs ? `?${qs}` : '?');
    },
    [router, searchParams],
  );

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateUrl({ q: value || null, page: '1' });
    }, 300);
  };

  const clearFilters = () => {
    updateUrl({ status: null, categoria: null, provincia: null, data: null, page: '1' });
  };

  const handlePageChange = (newPage: number) => {
    updateUrl({ page: newPage.toString() });
  };

  const showSuccess = (msg: string) => {
    setSuccessBanner(msg);
    if (successTimerRef.current) clearTimeout(successTimerRef.current);
    successTimerRef.current = setTimeout(() => setSuccessBanner(null), 3500);
  };

  const handleConfirmarEncaminhamento = (prestador: Prestador) => {
    if (!encaminharModal) return;
    const { id } = encaminharModal;
    patchEncaminhar(id, prestador.nome);
    setSolicitacoes(prev =>
      prev.map(s =>
        s.id === id
          ? { ...s, status: 'encaminhada' as const, prestador: prestador.nome, operadorResponsavel: 'Operador Atual' }
          : s,
      ),
    );
    setEncaminharModal(null);
    showSuccess(`Solicitação ${id} encaminhada com sucesso para ${prestador.nome}.`);
  };

  // ── Filter + paginate ──────────────────────────────────────

  const filtered = solicitacoes.filter(s => {
    const q = urlSearch.toLowerCase();
    const matchSearch    = !q || s.id.toLowerCase().includes(q);
    const matchStatus    = !urlStatus    || s.status    === urlStatus;
    const matchCategoria = !urlCategoria || s.categoria === urlCategoria;
    const matchProvincia = !urlProvincia || s.provincia === urlProvincia;
    const matchData      = !urlData      || s.dataPretendida === urlData;
    return matchSearch && matchStatus && matchCategoria && matchProvincia && matchData;
  });

  const totalItems  = filtered.length;
  const totalPages  = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const currentPage = Math.min(urlPage, totalPages);
  const pageStart   = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated   = filtered.slice(pageStart, pageStart + ITEMS_PER_PAGE);
  const hasFilters  = !!urlSearch || !!urlStatus || !!urlCategoria || !!urlProvincia || !!urlData;
  const hasSelectFilters = !!urlStatus || !!urlCategoria || !!urlProvincia || !!urlData;

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
    .reduce<(number | 'gap')[]>((acc, p, idx, arr) => {
      if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('gap');
      acc.push(p);
      return acc;
    }, []);

  // ── Render ────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full max-w-[1400px] mx-auto gap-5">

      {/* Success banner */}
      {successBanner && (
        <div className="shrink-0 flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl animate-in fade-in duration-200">
          <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
          <p className="text-xs font-semibold text-emerald-700">{successBanner}</p>
        </div>
      )}

      {/* Filters */}
      <div className="shrink-0 bg-white rounded-2xl border border-gray-200 shadow-xs p-5">
        <div className="flex flex-col gap-3">
          {/* Search */}
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar por ID da solicitação (ex: SS-001)..."
              value={searchInput}
              onChange={e => handleSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs text-gray-800 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-400 focus:bg-white transition-all duration-200 placeholder:text-gray-400"
            />
          </div>
          {/* Select filters */}
          <div className="flex flex-wrap gap-3">
            <FilterSelect
              value={urlStatus}
              onChange={v => updateUrl({ status: v || null, page: '1' })}
              options={STATUS_OPTIONS as Array<{ value: string; label: string }>}
              className="flex-1 min-w-[160px]"
            />
            <FilterSelect
              value={urlCategoria}
              onChange={v => updateUrl({ categoria: v || null, page: '1' })}
              options={CATEGORIA_OPTIONS as Array<{ value: string; label: string }>}
              className="flex-1 min-w-[160px]"
            />
            <FilterSelect
              value={urlProvincia}
              onChange={v => updateUrl({ provincia: v || null, page: '1' })}
              options={PROVINCIA_OPTIONS as Array<{ value: string; label: string }>}
              className="flex-1 min-w-[160px]"
            />
            <div className="flex-1 min-w-[160px]">
              <input
                type="date"
                value={urlData}
                onChange={e => updateUrl({ data: e.target.value || null, page: '1' })}
                className="w-full px-3 py-2 text-xs text-gray-800 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-400 focus:bg-white transition-all [color-scheme:light]"
              />
            </div>
            {hasSelectFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-3 py-2 text-xs text-gray-500 hover:text-gray-800 border border-gray-200 hover:border-gray-400 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
              >
                <X size={11} />
                Limpar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table card */}
      <div className="flex-1 min-h-0 bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden flex flex-col">

        {/* Card header */}
        <div className="shrink-0 px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Lista de Solicitações</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {isLoading
                ? 'A carregar...'
                : `${totalItems} solicitaç${totalItems !== 1 ? 'ões' : 'ão'} encontrada${totalItems !== 1 ? 's' : ''}`}
            </p>
          </div>
          <ClipboardList size={16} className="text-gray-400" />
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 min-h-0 overflow-auto">
          {isLoading ? (
            <TableSkeleton />
          ) : error ? (
            <ErrorState onRetry={loadData} />
          ) : filtered.length === 0 ? (
            <EmptyState hasFilters={hasFilters} />
          ) : (
            <div className="animate-in fade-in duration-300">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 z-10">
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">ID</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Cliente</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Serviço</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Prestador</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Data Pretendida</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Operador Resp.</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginated.map(s => (
                    <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">

                      {/* ID */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-xs font-bold text-gray-800 font-mono">{s.id}</span>
                        <p className="text-[10px] text-gray-400 font-medium mt-0.5">{CATEGORIA_LABELS[s.categoria]}</p>
                      </td>

                      {/* Cliente — nome only, no contact */}
                      <td className="px-4 py-4 min-w-[160px]">
                        <span className="text-xs font-semibold text-gray-800">{s.clienteNome}</span>
                      </td>

                      {/* Serviço */}
                      <td className="px-4 py-4 min-w-[180px] max-w-[220px]">
                        <span className="text-xs text-gray-600 line-clamp-2">{s.servico}</span>
                      </td>

                      {/* Prestador */}
                      <td className="px-4 py-4 min-w-[150px]">
                        {s.prestador
                          ? <span className="text-xs font-medium text-gray-700">{s.prestador}</span>
                          : <span className="text-xs text-gray-400 italic">Não atribuído</span>}
                      </td>

                      {/* Data Pretendida */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-xs text-gray-500 font-medium">{formatDate(s.dataPretendida)}</span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <StatusBadge status={s.status} />
                      </td>

                      {/* Operador */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        {s.operadorResponsavel
                          ? <span className="text-xs font-medium text-gray-700">{s.operadorResponsavel}</span>
                          : <span className="text-xs text-gray-300">—</span>}
                      </td>

                      {/* Ações */}
                      <td className="px-4 py-4">
                        {CAN_ENCAMINHAR.includes(s.status) ? (
                          <button
                            onClick={() => setEncaminharModal(s)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#06241C] hover:bg-[#0B392E] text-white text-xs font-bold rounded-lg transition-all duration-150 shadow-sm active:scale-[0.98] cursor-pointer whitespace-nowrap"
                          >
                            <Send size={11} />
                            Encaminhar
                          </button>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && !error && totalPages > 1 && (
          <div className="shrink-0 px-4 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between gap-4 flex-wrap">
            <span className="text-xs text-gray-500 font-medium">
              A mostrar {Math.min(pageStart + 1, totalItems)}–{Math.min(pageStart + ITEMS_PER_PAGE, totalItems)} de {totalItems} resultados
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Página anterior"
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-emerald-400 hover:text-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-600 transition-colors cursor-pointer"
              >
                <ChevronLeft size={14} />
              </button>

              {pageNumbers.map((item, idx) =>
                item === 'gap' ? (
                  <span key={`gap-${idx}`} className="w-8 h-8 flex items-center justify-center text-xs text-gray-400">
                    …
                  </span>
                ) : (
                  <button
                    key={item}
                    onClick={() => handlePageChange(item as number)}
                    aria-label={`Página ${item}`}
                    aria-current={currentPage === item ? 'page' : undefined}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      currentPage === item
                        ? 'bg-[#06241C] text-white border border-[#06241C]'
                        : 'border border-gray-200 text-gray-700 hover:border-emerald-400 hover:text-emerald-600'
                    }`}
                  >
                    {item}
                  </button>
                ),
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Próxima página"
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-emerald-400 hover:text-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-600 transition-colors cursor-pointer"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Encaminhar modal */}
      {encaminharModal && (
        <EncaminharModal
          solicitacao={encaminharModal}
          onClose={() => setEncaminharModal(null)}
          onConfirm={handleConfirmarEncaminhamento}
        />
      )}

    </div>
  );
}

// ── Suspense fallback ──────────────────────────────────────

function PageSkeleton() {
  return (
    <div className="flex flex-col h-full max-w-[1400px] mx-auto gap-5">
      <div className="shrink-0 bg-white rounded-2xl border border-gray-200 shadow-xs p-5 animate-pulse space-y-3">
        <div className="h-9 bg-gray-100 rounded-xl w-full" />
        <div className="flex gap-3">
          <div className="h-9 bg-gray-100 rounded-xl flex-1" />
          <div className="h-9 bg-gray-100 rounded-xl flex-1" />
          <div className="h-9 bg-gray-100 rounded-xl flex-1" />
          <div className="h-9 bg-gray-100 rounded-xl flex-1" />
        </div>
      </div>
      <div className="flex-1 min-h-0 bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden flex flex-col">
        <div className="shrink-0 px-6 py-4 border-b border-gray-100 bg-gray-50/50 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-1.5" />
          <div className="h-3 bg-gray-100 rounded w-1/6" />
        </div>
        <div className="flex-1 min-h-0 overflow-auto">
          <TableSkeleton />
        </div>
      </div>
    </div>
  );
}

// ── Export ─────────────────────────────────────────────────

export default function SolicitacoesPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <SolicitacoesContent />
    </Suspense>
  );
}
