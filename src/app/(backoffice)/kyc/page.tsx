'use client';

import { useEffect, useState, useCallback } from 'react';
import { FileCheck, Search, Filter, ChevronRight, Mail, Phone, MapPin, Building, User } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { useCandidaturas } from '@/hooks/kyc/kyc.hooks';
import { Input } from '@/components/common/form/Input';
import { Select, SelectOption } from '@/components/common/form/Select';
import { StatusBadge } from '@/components/common/ui/Badge';
import { FilterBar } from '@/components/common/FilterBar';
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
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Candidaturas KYC"
        description="Gestão de candidaturas de verificação de identidade dos prestadores"
      />

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Pendentes', value: statusCounts['pendente'] || 0, textColor: 'text-amber-600', bgColor: 'bg-amber-50', filter: 'pendente' },
          { label: 'Em Análise', value: statusCounts['em_analise'] || 0, textColor: 'text-blue-600', bgColor: 'bg-blue-50', filter: 'em_analise' },
          { label: 'Aprovados', value: statusCounts['aprovado'] || 0, textColor: 'text-emerald-600', bgColor: 'bg-emerald-50', filter: 'aprovado' },
          { label: 'Rejeitados', value: statusCounts['rejeitado'] || 0, textColor: 'text-red-600', bgColor: 'bg-red-50', filter: 'rejeitado' },
        ].map((stat) => (
          <button
            key={stat.filter}
            onClick={() => setStatusFilter(statusFilter === stat.filter ? '' : stat.filter)}
            className={`relative bg-white rounded-md border p-4 text-left transition-all duration-300 flex flex-col justify-between min-h-[90px] overflow-hidden group ${statusFilter === stat.filter
              ? 'border-[#42b883] shadow-md ring-1 ring-[#42b883]'
              : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
          >
            {/* Detalhe de fundo */}
            <div className={`absolute -right-4 -top-4 w-16 h-16 rounded-md opacity-50 transition-transform duration-300 group-hover:scale-125 ${stat.bgColor}`} />

            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider relative z-10">{stat.label}</p>
            <div className="flex items-baseline gap-2 relative z-10 mt-1">
              <p className={`text-3xl font-black tracking-tight ${stat.textColor}`}>{stat.value}</p>
            </div>

            {statusFilter === stat.filter && (
              <div className="absolute left-0 bottom-0 w-full h-1 bg-[#42b883]" />
            )}
          </button>
        ))}
      </div>

      {/* Filters */}
      <FilterBar
        searchPlaceholder="Pesquisar por nome, email, telefone ou NIF..."
        searchValue={search}
        onSearchChange={setSearch}
        selectOptions={statusOptions}
        selectValue={statusFilter}
        onSelectChange={setStatusFilter}
      />

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-sm text-red-700 font-medium">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && candidaturas.length === 0 && (
        <div className="bg-white rounded-md p-12 shadow-sm border border-gray-100/80 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-2 border-[#42b883] border-t-transparent rounded-md animate-spin" />
          <p className="text-sm text-gray-500 mt-4 font-medium">A carregar candidaturas...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && candidaturas.length === 0 && (
        <div className="bg-white rounded-md p-12 shadow-sm border border-gray-100/80 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-md bg-gray-50 flex items-center justify-center text-gray-400 mb-4">
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
        <div className="bg-white border border-gray-100 rounded-md shadow-sm overflow-hidden">
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
                          <div className="w-10 h-10 rounded-md bg-gradient-to-br from-[#42b883] to-[#3aa374] flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
                            {candidatura.user.nome_completo.charAt(0)}
                          </div>
                          <div>
                            <p className="text-[13px] font-bold text-gray-900 group-hover:text-[#42b883] transition-colors">
                              {candidatura.user.nome_completo}
                            </p>
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-500 mt-0.5 bg-gray-100/80 px-2 py-0.5 rounded-md">
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
                          className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-white border border-gray-200 text-gray-500 hover:text-[#42b883] hover:border-[#42b883] hover:bg-[#42b883]/5 transition-all shadow-sm"
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

