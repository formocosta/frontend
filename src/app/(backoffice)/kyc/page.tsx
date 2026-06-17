'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search, AlertTriangle, Inbox, RotateCw, Eye,
  ChevronLeft, ChevronRight, FileText,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────

type StatusVerificacao = 'pendente' | 'em_analise' | 'entrevista_agendada';

interface Candidatura {
  id: string;
  nome: string;
  bi: string;
  dataSubmissao: string;
  statusVerificacao: StatusVerificacao;
  documentosEnviados: number;
  operadorAtribuido: string | null;
}

// ── Config ─────────────────────────────────────────────────

const STATUS_CONFIG: Record<StatusVerificacao, { label: string; classes: string }> = {
  pendente: {
    label: 'Pendente',
    classes: 'bg-amber-50 text-amber-700 border border-amber-100',
  },
  em_analise: {
    label: 'Em Análise',
    classes: 'bg-blue-50 text-blue-700 border border-blue-100',
  },
  entrevista_agendada: {
    label: 'Entrevista Agendada',
    classes: 'bg-violet-50 text-violet-700 border border-violet-100',
  },
};

const STATUS_FILTERS: Array<{ value: StatusVerificacao | 'todos'; label: string }> = [
  { value: 'todos', label: 'Todos' },
  { value: 'pendente', label: 'Pendente' },
  { value: 'em_analise', label: 'Em Análise' },
  { value: 'entrevista_agendada', label: 'Entrevista Agendada' },
];

const ITEMS_PER_PAGE = 20;

// ── Mock Data ──────────────────────────────────────────────
// Today = 2026-06-16. Urgent = pendente + submitted before 2026-06-13

const MOCK_CANDIDATURAS: Candidatura[] = [
  // Urgent pending (> 3 days ago)
  { id: 'AP-001', nome: 'João Manuel Pereira',      bi: '005432876LA041', dataSubmissao: '2026-06-10T09:00:00Z', statusVerificacao: 'pendente',              documentosEnviados: 4, operadorAtribuido: null },
  { id: 'AP-002', nome: 'Maria Fernanda Costa',     bi: '008762341LA042', dataSubmissao: '2026-06-08T14:30:00Z', statusVerificacao: 'pendente',              documentosEnviados: 3, operadorAtribuido: null },
  { id: 'AP-003', nome: 'António dos Santos Neto',  bi: '003218764LA039', dataSubmissao: '2026-06-09T11:15:00Z', statusVerificacao: 'pendente',              documentosEnviados: 5, operadorAtribuido: null },
  { id: 'AP-004', nome: 'Beatriz Lopes Domingos',   bi: '007654321LA040', dataSubmissao: '2026-06-07T16:45:00Z', statusVerificacao: 'pendente',              documentosEnviados: 2, operadorAtribuido: null },
  { id: 'AP-005', nome: 'Carlos Alberto Gomes',     bi: '009876543LA038', dataSubmissao: '2026-06-11T08:20:00Z', statusVerificacao: 'pendente',              documentosEnviados: 4, operadorAtribuido: null },
  { id: 'AP-022', nome: 'Marcos Vinícius Ferreira', bi: '009901234LA024', dataSubmissao: '2026-06-12T10:00:00Z', statusVerificacao: 'pendente',              documentosEnviados: 3, operadorAtribuido: null },
  { id: 'AP-023', nome: 'Cátia Margarida Pinto',    bi: '000012345LA023', dataSubmissao: '2026-06-12T14:00:00Z', statusVerificacao: 'pendente',              documentosEnviados: 4, operadorAtribuido: null },
  { id: 'AP-028', nome: 'Fábio Alexandre Dias',     bi: '005567890LA018', dataSubmissao: '2026-06-11T16:20:00Z', statusVerificacao: 'pendente',              documentosEnviados: 5, operadorAtribuido: null },
  { id: 'AP-031', nome: 'Liliana Patrícia Ramos',   bi: '008890123LA015', dataSubmissao: '2026-06-09T09:30:00Z', statusVerificacao: 'pendente',              documentosEnviados: 2, operadorAtribuido: null },
  { id: 'AP-034', nome: 'Tiago Fernando Barros',    bi: '001123456LA012', dataSubmissao: '2026-06-08T10:30:00Z', statusVerificacao: 'pendente',              documentosEnviados: 3, operadorAtribuido: null },
  // Recent pending (<= 3 days)
  { id: 'AP-006', nome: 'Sofia Isabel Monteiro',    bi: '001234567LA043', dataSubmissao: '2026-06-14T10:00:00Z', statusVerificacao: 'pendente',              documentosEnviados: 6, operadorAtribuido: null },
  { id: 'AP-007', nome: 'Rui Filipe Alves',         bi: '006543219LA044', dataSubmissao: '2026-06-15T12:30:00Z', statusVerificacao: 'pendente',              documentosEnviados: 3, operadorAtribuido: null },
  { id: 'AP-008', nome: 'Ana Paula Rodrigues',      bi: '002345678LA045', dataSubmissao: '2026-06-16T09:10:00Z', statusVerificacao: 'pendente',              documentosEnviados: 4, operadorAtribuido: null },
  { id: 'AP-027', nome: 'Graça Amélia Cunha',       bi: '004456789LA019', dataSubmissao: '2026-06-13T08:45:00Z', statusVerificacao: 'pendente',              documentosEnviados: 3, operadorAtribuido: null },
  // Em análise
  { id: 'AP-009', nome: 'Pedro Miguel Ferreira',    bi: '004567890LA036', dataSubmissao: '2026-06-05T13:00:00Z', statusVerificacao: 'em_analise',            documentosEnviados: 5, operadorAtribuido: 'Operador Kwame' },
  { id: 'AP-010', nome: 'Teresa Maria Caetano',     bi: '003456789LA037', dataSubmissao: '2026-06-06T15:20:00Z', statusVerificacao: 'em_analise',            documentosEnviados: 4, operadorAtribuido: 'Operador Maria' },
  { id: 'AP-011', nome: 'Luís André da Silva',      bi: '005678901LA035', dataSubmissao: '2026-06-04T10:45:00Z', statusVerificacao: 'em_analise',            documentosEnviados: 6, operadorAtribuido: 'Operador Kwame' },
  { id: 'AP-012', nome: 'Sandra Regina Teixeira',   bi: '007890123LA034', dataSubmissao: '2026-06-03T09:30:00Z', statusVerificacao: 'em_analise',            documentosEnviados: 3, operadorAtribuido: 'Operador Carlos' },
  { id: 'AP-013', nome: 'Miguel Ângelo Baptista',   bi: '009012345LA033', dataSubmissao: '2026-06-02T14:00:00Z', statusVerificacao: 'em_analise',            documentosEnviados: 5, operadorAtribuido: 'Operador Maria' },
  { id: 'AP-014', nome: 'Paula Cristina Vieira',    bi: '001123456LA032', dataSubmissao: '2026-06-01T11:20:00Z', statusVerificacao: 'em_analise',            documentosEnviados: 4, operadorAtribuido: 'Operador Carlos' },
  { id: 'AP-015', nome: 'David José Mendes',        bi: '002234567LA031', dataSubmissao: '2026-05-30T16:00:00Z', statusVerificacao: 'em_analise',            documentosEnviados: 7, operadorAtribuido: 'Operador Kwame' },
  { id: 'AP-024', nome: 'Bruno Henrique Castro',    bi: '001123456LA022', dataSubmissao: '2026-05-16T09:30:00Z', statusVerificacao: 'em_analise',            documentosEnviados: 5, operadorAtribuido: 'Operador Carlos' },
  { id: 'AP-029', nome: 'Mariana Sofia Rocha',      bi: '006678901LA017', dataSubmissao: '2026-05-10T10:00:00Z', statusVerificacao: 'em_analise',            documentosEnviados: 4, operadorAtribuido: 'Operador Carlos' },
  { id: 'AP-032', nome: 'Hugo Daniel Cardoso',      bi: '009901234LA014', dataSubmissao: '2026-05-06T12:00:00Z', statusVerificacao: 'em_analise',            documentosEnviados: 5, operadorAtribuido: 'Operador Kwame' },
  { id: 'AP-035', nome: 'Cristina Elsa Marques',    bi: '002234567LA011', dataSubmissao: '2026-05-02T11:00:00Z', statusVerificacao: 'em_analise',            documentosEnviados: 4, operadorAtribuido: 'Operador Maria' },
  // Entrevista agendada
  { id: 'AP-016', nome: 'Filipe Nuno Borges',       bi: '003345678LA030', dataSubmissao: '2026-05-28T09:00:00Z', statusVerificacao: 'entrevista_agendada',   documentosEnviados: 6, operadorAtribuido: 'Operador Maria' },
  { id: 'AP-017', nome: 'Vanessa Sónia Lima',       bi: '004456789LA029', dataSubmissao: '2026-05-26T14:30:00Z', statusVerificacao: 'entrevista_agendada',   documentosEnviados: 5, operadorAtribuido: 'Operador Carlos' },
  { id: 'AP-018', nome: 'Ricardo Augusto Pires',    bi: '005567890LA028', dataSubmissao: '2026-05-24T10:15:00Z', statusVerificacao: 'entrevista_agendada',   documentosEnviados: 4, operadorAtribuido: 'Operador Kwame' },
  { id: 'AP-019', nome: 'Carla Susana Neves',       bi: '006678901LA027', dataSubmissao: '2026-05-22T15:45:00Z', statusVerificacao: 'entrevista_agendada',   documentosEnviados: 6, operadorAtribuido: 'Operador Maria' },
  { id: 'AP-020', nome: 'Nelson Eduardo Correia',   bi: '007789012LA026', dataSubmissao: '2026-05-20T11:30:00Z', statusVerificacao: 'entrevista_agendada',   documentosEnviados: 5, operadorAtribuido: 'Operador Carlos' },
  { id: 'AP-021', nome: 'Inês Helena Sousa',        bi: '008890123LA025', dataSubmissao: '2026-05-18T09:00:00Z', statusVerificacao: 'entrevista_agendada',   documentosEnviados: 7, operadorAtribuido: 'Operador Kwame' },
  { id: 'AP-025', nome: 'Joana Mariana Torres',     bi: '002234567LA021', dataSubmissao: '2026-05-14T11:00:00Z', statusVerificacao: 'entrevista_agendada',   documentosEnviados: 6, operadorAtribuido: 'Operador Maria' },
  { id: 'AP-026', nome: 'Sérgio Paulo Matos',       bi: '003345678LA020', dataSubmissao: '2026-05-12T15:30:00Z', statusVerificacao: 'entrevista_agendada',   documentosEnviados: 4, operadorAtribuido: 'Operador Kwame' },
  { id: 'AP-030', nome: 'Alexandre João Azevedo',   bi: '007789012LA016', dataSubmissao: '2026-05-08T14:15:00Z', statusVerificacao: 'entrevista_agendada',   documentosEnviados: 6, operadorAtribuido: 'Operador Maria' },
  { id: 'AP-033', nome: 'Andreia Raquel Moreira',   bi: '000012345LA013', dataSubmissao: '2026-05-04T15:45:00Z', statusVerificacao: 'entrevista_agendada',   documentosEnviados: 7, operadorAtribuido: 'Operador Carlos' },
];

// ── Module-level cache (persists status changes across navigations) ────

let _cache: Candidatura[] | null = null;

function getCandidaturas(): Candidatura[] {
  if (!_cache) _cache = MOCK_CANDIDATURAS.map(c => ({ ...c }));
  return _cache;
}

function markAsEmAnalise(id: string): void {
  const list = getCandidaturas();
  const idx = list.findIndex(c => c.id === id);
  if (idx !== -1 && list[idx].statusVerificacao === 'pendente') {
    list[idx] = { ...list[idx], statusVerificacao: 'em_analise' };
  }
}

// ── Helpers ────────────────────────────────────────────────

function isUrgent(c: Candidatura): boolean {
  if (c.statusVerificacao !== 'pendente') return false;
  const diffDays = (Date.now() - new Date(c.dataSubmissao).getTime()) / 86_400_000;
  return diffDays > 3;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

// ── Sub-components ──────────────────────────────────────────

function StatusBadge({ status }: { status: StatusVerificacao }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${cfg.classes}`}>
      {cfg.label}
    </span>
  );
}

function TableSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="border-b border-gray-100 bg-gray-50/30">
        <div className="grid grid-cols-6 gap-4 px-4 py-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-3 bg-gray-200 rounded w-2/3" />
          ))}
        </div>
      </div>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="border-b border-gray-100">
          <div className="grid grid-cols-6 gap-4 px-4 py-4 items-center">
            <div className="space-y-1.5">
              <div className="h-3 bg-gray-100 rounded w-3/4" />
              <div className="h-2.5 bg-gray-50 rounded w-1/2" />
            </div>
            <div className="h-3 bg-gray-100 rounded w-2/3" />
            <div className="h-5 bg-gray-100 rounded-full w-24" />
            <div className="h-7 w-7 bg-gray-100 rounded-lg mx-auto" />
            <div className="h-3 bg-gray-100 rounded w-2/3" />
            <div className="h-7 bg-gray-100 rounded-lg w-16" />
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
          {hasFilters ? 'Nenhum resultado encontrado' : 'Nenhuma candidatura encontrada'}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {hasFilters
            ? 'Tente ajustar os filtros ou o termo de pesquisa.'
            : 'Não existem candidaturas de prestadores de momento.'}
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
        <p className="text-xs text-gray-500 mt-1">
          Ocorreu um erro ao carregar as candidaturas. Por favor, tente novamente.
        </p>
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

// ── Page Content (uses useSearchParams — must be inside Suspense) ───

function CandidaturasContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlSearch = searchParams.get('q') ?? '';
  const urlStatus = (searchParams.get('status') ?? 'todos') as StatusVerificacao | 'todos';
  const urlPage = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));

  const [searchInput, setSearchInput] = useState(urlSearch);
  const [candidaturas, setCandidaturas] = useState<Candidatura[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadData = useCallback(() => {
    setIsLoading(true);
    setError(null);
    if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
    loadTimerRef.current = setTimeout(() => {
      try {
        setCandidaturas([...getCandidaturas()]);
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
    };
  }, [loadData]);

  // Keep local input in sync when navigating back
  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

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

  const handleStatusChange = (status: StatusVerificacao | 'todos') => {
    updateUrl({ status: status === 'todos' ? null : status, page: '1' });
  };

  const handlePageChange = (newPage: number) => {
    updateUrl({ page: newPage.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVerCandidatura = (id: string) => {
    markAsEmAnalise(id);
    setCandidaturas(prev =>
      prev.map(c =>
        c.id === id && c.statusVerificacao === 'pendente'
          ? { ...c, statusVerificacao: 'em_analise' }
          : c,
      ),
    );
    router.push(`/kyc/${id}`);
  };

  // ── Filter + paginate ──────────────────────────────────────

  const filtered = candidaturas.filter(c => {
    const q = urlSearch.toLowerCase();
    const matchSearch = !q || c.nome.toLowerCase().includes(q) || c.bi.toLowerCase().includes(q);
    const matchStatus = urlStatus === 'todos' || c.statusVerificacao === urlStatus;
    return matchSearch && matchStatus;
  });

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const currentPage = Math.min(urlPage, totalPages);
  const pageStart = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(pageStart, pageStart + ITEMS_PER_PAGE);
  const hasFilters = !!urlSearch || urlStatus !== 'todos';

  // ── Pagination page numbers ────────────────────────────────

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
    .reduce<(number | 'gap')[]>((acc, p, idx, arr) => {
      if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('gap');
      acc.push(p);
      return acc;
    }, []);

  // ── Render ────────────────────────────────────────────────

  return (
    <div className="space-y-5 max-w-[1400px] mx-auto pb-8 px-4">

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar por nome ou número de BI..."
              value={searchInput}
              onChange={e => handleSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs text-gray-800 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-400 focus:bg-white transition-all duration-200 placeholder:text-gray-400"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {STATUS_FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => handleStatusChange(f.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  urlStatus === f.value
                    ? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700'
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-emerald-400'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">

        {/* Card header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Lista de Candidaturas</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {isLoading
                ? 'A carregar...'
                : `${totalItems} candidatura${totalItems !== 1 ? 's' : ''} encontrada${totalItems !== 1 ? 's' : ''}`}
            </p>
          </div>
          <FileText size={16} className="text-gray-400" />
        </div>

        {/* States */}
        {isLoading ? (
          <TableSkeleton />
        ) : error ? (
          <ErrorState onRetry={loadData} />
        ) : filtered.length === 0 ? (
          <EmptyState hasFilters={hasFilters} />
        ) : (
          <div className="overflow-x-auto animate-in fade-in duration-300">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/30">
                  <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Data de Submissão</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Documentos</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Operador Atribuído</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">

                    {/* Nome + BI + urgência */}
                    <td className="px-4 py-4 min-w-[200px]">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold text-gray-800">{c.nome}</span>
                          {isUrgent(c) && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-red-50 text-red-600 border border-red-100">
                              Urgente
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium font-mono">{c.bi}</span>
                      </div>
                    </td>

                    {/* Data */}
                    <td className="px-4 py-4 text-xs text-gray-500 font-medium whitespace-nowrap">
                      {formatDate(c.dataSubmissao)}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <StatusBadge status={c.statusVerificacao} />
                    </td>

                    {/* Documentos */}
                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 text-xs font-bold text-gray-700">
                        {c.documentosEnviados}
                      </span>
                    </td>

                    {/* Operador */}
                    <td className="px-4 py-4">
                      {c.operadorAtribuido
                        ? <span className="text-xs font-medium text-gray-700">{c.operadorAtribuido}</span>
                        : <span className="text-xs text-gray-400 italic">Não atribuído</span>}
                    </td>

                    {/* Ações */}
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleVerCandidatura(c.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#06241C] hover:bg-[#0B392E] text-white text-xs font-bold rounded-lg transition-all duration-150 shadow-sm active:scale-[0.98] cursor-pointer"
                      >
                        <Eye size={12} />
                        Ver Candidatura
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !error && totalPages > 1 && (
          <div className="px-4 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between gap-4 flex-wrap">
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
    </div>
  );
}

// ── Suspense fallback (shown while useSearchParams resolves) ──

function PageSkeleton() {
  return (
    <div className="space-y-5 max-w-[1400px] mx-auto pb-8 px-4">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 animate-pulse">
        <div className="h-9 bg-gray-100 rounded-xl w-full" />
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-1.5" />
          <div className="h-3 bg-gray-100 rounded w-1/6" />
        </div>
        <TableSkeleton />
      </div>
    </div>
  );
}

// ── Export ─────────────────────────────────────────────────

export default function CandidaturasKYCPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <CandidaturasContent />
    </Suspense>
  );
}
