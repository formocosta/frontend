'use client';

import { useEffect, useState, useCallback } from 'react';
import { ClipboardList, Search } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { SolicitacaoCard } from '@/components/solicitacoes/SolicitacaoCard';
import { useSolicitacoes } from '@/hooks/solicitacoes/solicitacoes.hooks';
import { Input } from '@/components/common/form/Input';
import { Select, SelectOption } from '@/components/common/form/Select';
import { Button } from '@/components/common/form/Button';

const statusOptions: SelectOption[] = [
  { value: '', label: 'Todos os status' },
  { value: 'submetida', label: 'Submetida' },
  { value: 'em_analise', label: 'Em Análise' },
  { value: 'encaminhada', label: 'Encaminhada' },
  { value: 'aceite', label: 'Aceite' },
  { value: 'em_execucao', label: 'Em Execução' },
  { value: 'concluida', label: 'Concluída' },
  { value: 'cancelada', label: 'Cancelada' },
  { value: 'rejeitada', label: 'Rejeitada' },
  { value: 'em_disputa', label: 'Em Disputa' },
];

export default function SolicitacoesPage() {
  const { solicitacoes, meta, loading, error, fetchSolicitacoes } = useSolicitacoes();
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const loadData = useCallback(() => {
    const params: Record<string, any> = { page: currentPage, limit };
    if (statusFilter) params.status = statusFilter;
    fetchSolicitacoes(params);
  }, [statusFilter, currentPage, fetchSolicitacoes]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const filteredSolicitacoes = solicitacoes.filter((s) => {
    if (!search) return true;
    const query = search.toLowerCase();
    return (
      s.servico?.titulo_servico?.toLowerCase().includes(query) ||
      s.descricao_cliente?.toLowerCase().includes(query) ||
      s.prestador?.nome?.toLowerCase().includes(query) ||
      s.provincia?.toLowerCase().includes(query) ||
      s.municipio?.toLowerCase().includes(query)
    );
  });

  const totalPages = meta ? Math.ceil(meta.total / limit) : 1;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Solicitações"
        description="Gestão de pedidos de serviço dos clientes"
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-56">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full sm:w-80">
          <Input
            placeholder="Pesquisar por serviço, descrição..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search size={15} />}
            className="text-[13px]"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 font-medium">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && solicitacoes.length === 0 && (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100/80 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-2 border-[#42b883] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 mt-4 font-medium">A carregar solicitações...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && solicitacoes.length === 0 && (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100/80 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mb-4">
            <ClipboardList size={28} />
          </div>
          <h3 className="text-base font-bold text-gray-900">Sem solicitações</h3>
          <p className="text-xs text-gray-500 mt-1.5 max-w-sm font-medium">
            {statusFilter
              ? 'Nenhuma solicitação encontrada com o filtro seleccionado.'
              : 'Ainda não existem solicitações registadas no sistema.'}
          </p>
        </div>
      )}

      {/* Results count */}
      {!loading && solicitacoes.length > 0 && (
        <p className="text-[11px] text-gray-500 font-semibold">
          {meta?.total || solicitacoes.length} {meta?.total === 1 || solicitacoes.length === 1 ? 'solicitação' : 'solicitações'} encontrada{meta?.total !== 1 && solicitacoes.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* List */}
      {!loading && filteredSolicitacoes.length > 0 && (
        <div className="space-y-3">
          {filteredSolicitacoes.map((solicitacao) => (
            <SolicitacaoCard key={solicitacao.id} solicitacao={solicitacao} />
          ))}
        </div>
      )}

      {/* No search results */}
      {!loading && solicitacoes.length > 0 && filteredSolicitacoes.length === 0 && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100/80 text-center">
          <p className="text-sm text-gray-500 font-medium">
            Nenhum resultado para &quot;{search}&quot;
          </p>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-[11px] text-gray-500 font-medium">
            Página {currentPage} de {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
