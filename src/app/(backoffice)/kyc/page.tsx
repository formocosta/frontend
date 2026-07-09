'use client';

import { useEffect, useState, useCallback } from 'react';
import { FileCheck, Search, Filter, ChevronRight, Mail, Phone, MapPin, Building, User } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { useCandidaturas } from '@/hooks/kyc/kyc.hooks';
import { Input } from '@/components/common/form/Input';
import { Select, SelectOption } from '@/components/common/form/Select';
import { StatusBadge } from '@/components/common/ui/Badge';
import Link from 'next/link';

const statusOptions: SelectOption[] = [
  { value: '', label: 'Todos os status' },
  { value: 'pendente', label: 'Pendente' },
  { value: 'em_analise', label: 'Em Análise' },
  { value: 'aprovado', label: 'Aprovado' },
  { value: 'rejeitado', label: 'Rejeitado' },
];

const tipoLabels: Record<string, string> = {
  singular: 'Pessoa Singular',
  coletivo: 'Pessoa Coletiva',
};

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
      c.user.telefone.includes(query) ||
      (c.nif && c.nif.toLowerCase().includes(query))
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
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-md">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="hidden sm:flex items-center gap-2 text-gray-500 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
            <Filter size={16} />
            <span className="text-[13px] font-semibold">Filtros</span>
          </div>
          <div className="w-full sm:w-56">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full sm:w-[350px]">
          <Input
            placeholder="Pesquisar por nome, email, telefone ou NIF..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search size={16} className="text-gray-400" />}
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

      {/* Table Content */}
      {!loading && candidaturas.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="px-5 py-4">Utilizador</th>
                  <th className="px-5 py-4">Contactos</th>
                  <th className="px-5 py-4">Detalhes Profissionais</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Data Submissão</th>
                  <th className="px-5 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredCandidaturas.map((candidatura) => {
                  const localizacao = [candidatura.provincia, candidatura.municipio, candidatura.bairro]
                    .filter(Boolean)
                    .join(', ');

                  return (
                    <tr key={candidatura.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-5 py-4 align-top">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#42b883] to-[#3aa374] flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
                            {candidatura.user.nome_completo.charAt(0)}
                          </div>
                          <div>
                            <p className="text-[13px] font-bold text-gray-900 group-hover:text-[#42b883] transition-colors">
                              {candidatura.user.nome_completo}
                            </p>
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-500 mt-0.5 bg-gray-100/80 px-2 py-0.5 rounded">
                              <User size={10} />
                              {tipoLabels[candidatura.tipo_prestador] || candidatura.tipo_prestador}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 align-top">
                        <div className="space-y-1.5 text-[12px] font-medium text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <Mail size={12} className="text-gray-400" />
                            <span className="truncate max-w-[150px]" title={candidatura.user.email}>{candidatura.user.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Phone size={12} className="text-gray-400" />
                            <span>{candidatura.user.telefone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 align-top">
                        <div className="space-y-1.5 text-[12px] font-medium text-gray-600">
                          {candidatura.nome_comercial && (
                            <div className="flex items-center gap-1.5">
                              <Building size={12} className="text-gray-400" />
                              <span className="truncate max-w-[150px]">{candidatura.nome_comercial}</span>
                            </div>
                          )}
                          {localizacao && (
                            <div className="flex items-center gap-1.5">
                              <MapPin size={12} className="text-gray-400" />
                              <span className="truncate max-w-[150px]" title={localizacao}>{localizacao}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 align-top">
                        <StatusBadge status={candidatura.status_verificacao} />
                      </td>
                      <td className="px-5 py-4 align-top text-[12px] text-gray-500 font-medium">
                        {new Date(candidatura.created_at).toLocaleDateString('pt-AO', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-5 py-4 align-top text-right">
                        <Link
                          href={`/kyc/${candidatura.id}`}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-[#42b883] hover:border-[#42b883] hover:bg-[#42b883]/5 transition-all shadow-sm"
                          title="Ver Detalhes"
                        >
                          <ChevronRight size={16} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Results count & No results */}
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <p className="text-[11px] text-gray-500 font-semibold">
              {filteredCandidaturas.length} {filteredCandidaturas.length === 1 ? 'candidatura' : 'candidaturas'} encontrada{filteredCandidaturas.length !== 1 ? 's' : ''}
            </p>
            {filteredCandidaturas.length === 0 && (
              <p className="text-[11px] text-gray-500 font-medium italic">
                Nenhum resultado para "{search}"
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

