'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  FileCheck,
  Search,
  Filter,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Building,
  User,
  Eye,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { useCandidaturas } from '@/hooks/kyc/kyc.hooks';
import { Button } from '@/components/common/form/Button';
import { SelectOption } from '@/components/common/form/Select';
import { StatusBadge } from '@/components/common/ui/Badge';
import { FilterBar } from '@/components/common/FilterBar';

const statusOptions: SelectOption[] = [
  { value: '', label: 'Todos os Status' },
  { value: 'pendente', label: 'Pendente' },
  { value: 'em_analise', label: 'Em Análise' },
  { value: 'entrevista_agendada', label: 'Entrevista Agendada' },
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
      (c.nif && c.nif.toLowerCase().includes(query)) ||
      (c.nome_comercial && c.nome_comercial.toLowerCase().includes(query))
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
        title="Gestão de Candidaturas KYC"
        description="Auditoria e verificação de identidade dos prestadores de serviço da plataforma"
        action={
          <Button
            variant="outline"
            onClick={loadData}
            isLoading={loading}
            className="border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold rounded-md"
            leftIcon={<RefreshCw size={14} className={loading ? 'animate-spin' : ''} />}
          >
            Atualizar Candidaturas
          </Button>
        }
      />

      {/* Interactive KPI Filter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        {[
          { label: 'Pendentes', value: statusCounts['pendente'] || 0, icon: Clock, color: 'amber', filter: 'pendente' },
          { label: 'Em Análise', value: statusCounts['em_analise'] || 0, icon: Eye, color: 'blue', filter: 'em_analise' },
          { label: 'Entrevista', value: statusCounts['entrevista_agendada'] || 0, icon: Calendar, color: 'indigo', filter: 'entrevista_agendada' },
          { label: 'Aprovados', value: statusCounts['aprovado'] || 0, icon: CheckCircle2, color: 'emerald', filter: 'aprovado' },
          { label: 'Rejeitados', value: statusCounts['rejeitado'] || 0, icon: AlertCircle, color: 'rose', filter: 'rejeitado' },
        ].map((stat) => {
          const isSelected = statusFilter === stat.filter;
          const IconComponent = stat.icon;

          return (
            <button
              key={stat.filter}
              onClick={() => setStatusFilter(isSelected ? '' : stat.filter)}
              className={`bg-white rounded-md border p-4 text-left transition-all duration-200 flex flex-col justify-between shadow-sm relative overflow-hidden group ${
                isSelected
                  ? 'border-[#42b883] ring-2 ring-[#42b883]/20 shadow-md bg-emerald-50/10'
                  : 'border-gray-100 hover:border-gray-200 hover:shadow'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                  {stat.label}
                </span>
                <div className={`p-1.5 rounded-md ${
                  stat.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                  stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                  stat.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' :
                  stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                  'bg-rose-50 text-rose-600'
                }`}>
                  <IconComponent size={14} />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-black text-gray-900 tracking-tight">{stat.value}</p>
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                  {isSelected ? 'Filtro ativo' : 'Clique para filtrar'}
                </p>
              </div>
              {isSelected && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#42b883]" />}
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <FilterBar
        searchPlaceholder="Pesquisar por prestador, email, telefone, NIF ou empresa..."
        searchValue={search}
        onSearchChange={setSearch}
        selectOptions={statusOptions}
        selectValue={statusFilter}
        onSelectChange={setStatusFilter}
      />

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-sm text-red-700 font-bold shadow-sm">
          {error}
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && candidaturas.length === 0 && (
        <div className="bg-white rounded-md p-12 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-2 border-[#42b883] border-t-transparent rounded-md animate-spin" />
          <p className="text-sm text-gray-500 mt-4 font-bold">A carregar candidaturas KYC...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && candidaturas.length === 0 && (
        <div className="bg-white rounded-md p-12 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#42b883] flex items-center justify-center mx-auto">
            <FileCheck size={28} />
          </div>
          <h3 className="text-base font-bold text-gray-900">Sem candidaturas para apresentar</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto font-medium">
            {statusFilter
              ? 'Não existem candidaturas com o status selecionado.'
              : 'Não há registos de candidaturas KYC submetidas no momento.'}
          </p>
        </div>
      )}

      {/* Main Content Table & Cards */}
      {!loading && candidaturas.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-md shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden space-y-0">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-black uppercase tracking-wider text-gray-400">
                  <th className="px-5 py-4">Prestador Beneficiário</th>
                  <th className="px-5 py-4">Contactos</th>
                  <th className="px-5 py-4">Empresa / NIF</th>
                  <th className="px-5 py-4">Status Verificação</th>
                  <th className="px-5 py-4">Submissão</th>
                  <th className="px-5 py-4 text-right">Ação de Auditoria</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredCandidaturas.map((candidatura) => {
                  const localizacao = [candidatura.provincia, candidatura.municipio, candidatura.bairro]
                    .filter(Boolean)
                    .join(', ');

                  return (
                    <tr key={candidatura.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-md bg-gradient-to-br from-[#42b883] to-[#3aa374] flex items-center justify-center text-white font-black text-sm shrink-0 shadow-sm">
                            {candidatura.user.nome_completo.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 group-hover:text-[#42b883] transition-colors">
                              {candidatura.user.nome_completo}
                            </p>
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-gray-500 mt-0.5 bg-gray-100 px-2 py-0.5 rounded">
                              <User size={10} />
                              {tipoLabels[candidatura.tipo_prestador] || candidatura.tipo_prestador}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="space-y-1 text-gray-600 font-medium">
                          <div className="flex items-center gap-1.5">
                            <Mail size={12} className="text-gray-400 shrink-0" />
                            <span className="truncate max-w-[160px]" title={candidatura.user.email}>{candidatura.user.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Phone size={12} className="text-gray-400 shrink-0" />
                            <span>{candidatura.user.telefone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="space-y-1 text-gray-600 font-medium">
                          {candidatura.nome_comercial ? (
                            <div className="flex items-center gap-1.5 font-bold text-gray-800">
                              <Building size={12} className="text-gray-400 shrink-0" />
                              <span className="truncate max-w-[160px]">{candidatura.nome_comercial}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400 italic text-[11px]">Sem nome comercial</span>
                          )}
                          {candidatura.nif && (
                            <p className="text-[10px] font-mono text-gray-400">NIF: {candidatura.nif}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={candidatura.status_verificacao} />
                      </td>
                      <td className="px-5 py-4 text-gray-500 font-medium text-[11px]">
                        {new Date(candidatura.created_at).toLocaleDateString('pt-AO')}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/kyc/${candidatura.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#42b883] hover:bg-[#3aa374] rounded-md transition-colors shadow-sm"
                        >
                          <Eye size={14} />
                          <span>Analisar Dossiê</span>
                          <ChevronRight size={14} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="block lg:hidden divide-y divide-gray-100">
            {filteredCandidaturas.map((candidatura) => {
              const localizacao = [candidatura.provincia, candidatura.municipio, candidatura.bairro]
                .filter(Boolean)
                .join(', ');

              return (
                <div key={candidatura.id} className="p-4 space-y-3 bg-white">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-md bg-gradient-to-br from-[#42b883] to-[#3aa374] flex items-center justify-center text-white font-black text-sm shrink-0 shadow-sm">
                        {candidatura.user.nome_completo.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {candidatura.user.nome_completo}
                        </p>
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-gray-500 mt-0.5 bg-gray-100 px-2 py-0.5 rounded">
                          <User size={10} />
                          {tipoLabels[candidatura.tipo_prestador] || candidatura.tipo_prestador}
                        </span>
                      </div>
                    </div>
                    <StatusBadge status={candidatura.status_verificacao} />
                  </div>

                  <div className="bg-gray-50/80 p-3 rounded-md border border-gray-100 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-gray-600">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">E-mail:</span>
                      <span className="truncate max-w-[180px] font-medium">{candidatura.user.email}</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-600">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Telefone:</span>
                      <span className="font-semibold">{candidatura.user.telefone}</span>
                    </div>
                    {candidatura.nif && (
                      <div className="flex items-center justify-between text-gray-600">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">NIF:</span>
                        <span className="font-mono font-bold text-gray-800">{candidatura.nif}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-[11px] text-gray-400 font-medium">
                      {new Date(candidatura.created_at).toLocaleDateString('pt-AO')}
                    </span>
                    <Link
                      href={`/kyc/${candidatura.id}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-[#42b883] hover:bg-[#3aa374] rounded-md transition-colors shadow-sm"
                    >
                      <Eye size={14} />
                      <span>Analisar Dossiê</span>
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Results Summary Footer */}
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center text-xs text-gray-500 font-semibold">
            <span>
              A mostrar <strong className="text-gray-900">{filteredCandidaturas.length}</strong> candidatura{filteredCandidaturas.length !== 1 ? 's' : ''}
            </span>
            {search && (
              <span className="italic text-gray-400">
                Filtro de busca: "{search}"
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
