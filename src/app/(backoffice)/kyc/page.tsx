'use client';

import { useEffect, useState, useCallback } from 'react';
import { FileCheck, Search, Filter } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { CandidaturaCard } from '@/components/kyc/CandidaturaCard';
import { useCandidaturas } from '@/hooks/kyc/kyc.hooks';
import { Input } from '@/components/common/form/Input';
import { Select, SelectOption } from '@/components/common/form/Select';

const statusOptions: SelectOption[] = [
  { value: '', label: 'Todos os status' },
  { value: 'pendente', label: 'Pendente' },
  { value: 'em_analise', label: 'Em Análise' },
  { value: 'aprovado', label: 'Aprovado' },
  { value: 'rejeitado', label: 'Rejeitado' },
];


export default function KycPage() {
  const { candidaturas, loading, error, fetchCandidaturas } = useCandidaturas();
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  const loadData = useCallback(() => {
    const params: Record<string, string> = {};
    if (statusFilter) params.status = statusFilter;
    fetchCandidaturas(params);
  }, [statusFilter, fetchCandidaturas]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredCandidaturas = candidaturas.filter((c) => {
    if (!search) return true;
    const query = search.toLowerCase();
    return (
      c.user.nome_completo.toLowerCase().includes(query) ||
      c.user.email.toLowerCase().includes(query) ||
      c.user.telefone.includes(query)
    );
  });

  // Count statuses
  const statusCounts = candidaturas.reduce((acc, c) => {
    acc[c.status_verificacao] = (acc[c.status_verificacao] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Candidaturas KYC"
        description="Gestão de candidaturas de verificação de identidade dos prestadores"
      />

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Pendentes', value: statusCounts['pendente'] || 0, color: 'amber', filter: 'pendente' },
          { label: 'Em Análise', value: statusCounts['em_analise'] || 0, color: 'blue', filter: 'em_analise' },
          { label: 'Aprovados', value: statusCounts['aprovado'] || 0, color: 'emerald', filter: 'aprovado' },
          { label: 'Rejeitados', value: statusCounts['rejeitado'] || 0, color: 'red', filter: 'rejeitado' },
        ].map((stat) => (
          <button
            key={stat.filter}
            onClick={() => setStatusFilter(statusFilter === stat.filter ? '' : stat.filter)}
            className={`bg-white rounded-xl border p-4 text-left transition-all duration-200 ${
              statusFilter === stat.filter
                ? 'border-[#42b883] shadow-md shadow-[#42b883]/10'
                : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'
            }`}
          >
            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide">{stat.label}</p>
            <p className={`text-2xl font-extrabold mt-1 text-${stat.color}-600`}>{stat.value}</p>
          </button>
        ))}
      </div>

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
            placeholder="Pesquisar por nome, email ou telefone..."
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
      {loading && candidaturas.length === 0 && (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100/80 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-2 border-[#42b883] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 mt-4 font-medium">A carregar candidaturas...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && candidaturas.length === 0 && (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100/80 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mb-4">
            <FileCheck size={28} />
          </div>
          <h3 className="text-base font-bold text-gray-900">Sem candidaturas</h3>
          <p className="text-xs text-gray-500 mt-1.5 max-w-sm font-medium">
            {statusFilter
              ? 'Nenhuma candidatura encontrada com o filtro seleccionado.'
              : 'Ainda não existem candidaturas KYC registadas no sistema.'}
          </p>
        </div>
      )}

      {/* Results count */}
      {!loading && candidaturas.length > 0 && (
        <p className="text-[11px] text-gray-500 font-semibold">
          {filteredCandidaturas.length} {filteredCandidaturas.length === 1 ? 'candidatura' : 'candidaturas'} encontrada{filteredCandidaturas.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* List */}
      {!loading && filteredCandidaturas.length > 0 && (
        <div className="space-y-3">
          {filteredCandidaturas.map((candidatura) => (
            <CandidaturaCard key={candidatura.id} candidatura={candidatura} />
          ))}
        </div>
      )}

      {/* No search results */}
      {!loading && candidaturas.length > 0 && filteredCandidaturas.length === 0 && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100/80 text-center">
          <p className="text-sm text-gray-500 font-medium">
            Nenhum resultado para &quot;{search}&quot;
          </p>
        </div>
      )}
    </div>
  );
}
