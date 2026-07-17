'use client';
 
import { useEffect, useState, useCallback } from 'react';
import { UserCheck, Mail, Phone, MapPin, Star, Award, ChevronRight, Search } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { usePrestadores } from '@/hooks/users/users.hooks';
import { StatusBadge } from '@/components/common/ui/Badge';
import Link from 'next/link';
 
const statusOptions = [
  { value: '', label: 'Todos os status da conta' },
  { value: 'activo', label: 'Ativa' },
  { value: 'suspenso', label: 'Suspensa' },
  { value: 'pendente', label: 'Pendente' },
];
 
export default function PrestadoresPage() {
  const { prestadores, meta, loading, error, fetchPrestadores } = usePrestadores();
  const [statusFilter, setStatusFilter] = useState('');
  const [verificacaoFilter, setVerificacaoFilter] = useState('');
  const [perfilFilter, setPerfilFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
 
  const loadData = useCallback(() => {
    fetchPrestadores({
      search,
      status: statusFilter,
      status_verificacao: verificacaoFilter,
      status_perfil: perfilFilter,
      page,
      page_size: 10,
    });
  }, [search, statusFilter, verificacaoFilter, perfilFilter, page, fetchPrestadores]);
 
  useEffect(() => {
    loadData();
  }, [loadData]);
 
  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };
 
  const handleStatusChange = (val: string) => {
    setStatusFilter(val);
    setPage(1);
  };
 
  return (
    <div className="space-y-6">
      <PageHeader
        title="Prestadores"
        description="Gestão de prestadores de serviço registados na plataforma"
      />
 
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total de Prestadores', value: meta?.total || 0, textColor: 'text-[#42b883]', bgColor: 'bg-[#42b883]/5' },
          { label: 'Aprovados KYC', value: prestadores.filter(p => p.prestador?.status_verificacao === 'aprovado').length || 0, textColor: 'text-emerald-600', bgColor: 'bg-emerald-50' },
          { label: 'Aguardando KYC', value: prestadores.filter(p => p.prestador?.status_verificacao === 'pendente').length || 0, textColor: 'text-amber-600', bgColor: 'bg-amber-50' },
          { label: 'Contas Ativas', value: prestadores.filter(p => p.status === 'activo').length || 0, textColor: 'text-blue-600', bgColor: 'bg-blue-50' },
        ].map((stat, i) => (
          <div
            key={i}
            className="relative bg-white rounded-sm border border-gray-200/80 p-4 flex flex-col justify-between min-h-[90px] overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className={`absolute -right-4 -top-4 w-16 h-16 rounded-sm opacity-50 transition-transform duration-300 group-hover:scale-125 ${stat.bgColor}`} />
            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider relative z-10">{stat.label}</p>
            <div className="flex items-baseline gap-2 relative z-10 mt-1">
              <p className={`text-3xl font-black tracking-tight ${stat.textColor}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
 
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-white p-4 rounded-sm border border-gray-100 shadow-sm">
        <div className="flex-1 w-full relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Pesquisar por nome, comercial, email ou NIF..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-sm text-xs font-semibold focus:outline-none focus:border-[#42b883] placeholder-gray-400"
          />
        </div>
        <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="border border-gray-200 rounded-sm text-xs font-bold py-2 px-3 focus:outline-none focus:border-[#42b883] bg-white cursor-pointer"
          >
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <select
            value={verificacaoFilter}
            onChange={(e) => { setVerificacaoFilter(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-sm text-xs font-bold py-2 px-3 focus:outline-none focus:border-[#42b883] bg-white cursor-pointer"
          >
            <option value="">Status Verificação KYC</option>
            <option value="pendente">Pendente</option>
            <option value="em_analise">Em Análise</option>
            <option value="entrevista_agendada">Entrevista Agendada</option>
            <option value="aprovado">Aprovado</option>
            <option value="rejeitado">Rejeitado</option>
          </select>
        </div>
      </div>
 
      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-sm p-4 text-sm text-red-700 font-medium">
          {error}
        </div>
      )}
 
      {/* Loading */}
      {loading && prestadores.length === 0 && (
        <div className="bg-white rounded-sm p-12 shadow-sm border border-gray-100/80 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-2 border-[#42b883] border-t-transparent rounded-sm animate-spin" />
          <p className="text-sm text-gray-500 mt-4 font-medium">A carregar prestadores...</p>
        </div>
      )}
 
      {/* Empty state */}
      {!loading && prestadores.length === 0 && (
        <div className="bg-white rounded-sm p-12 shadow-sm border border-gray-100/80 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-sm bg-gray-50 flex items-center justify-center text-gray-400 mb-4">
            <UserCheck size={28} />
          </div>
          <h3 className="text-base font-bold text-gray-900">Sem prestadores</h3>
          <p className="text-xs text-gray-500 mt-1.5 max-w-sm font-medium">
            {search || statusFilter || verificacaoFilter || perfilFilter
              ? 'Nenhum prestador encontrado com os filtros selecionados.'
              : 'Ainda não existem prestadores registados na plataforma.'}
          </p>
        </div>
      )}
 
      {/* Table Content */}
      {!loading && prestadores.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="px-5 py-4">Prestador</th>
                  <th className="px-5 py-4">Contactos</th>
                  <th className="px-5 py-4">Localização / NIF</th>
                  <th className="px-5 py-4">Desempenho</th>
                  <th className="px-5 py-4">Verificação KYC</th>
                  <th className="px-5 py-4">Status Conta</th>
                  <th className="px-5 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {prestadores.map((p) => {
                  const localizacao = p.prestador
                    ? [p.prestador.provincia, p.prestador.municipio].filter(Boolean).join(', ')
                    : '';
 
                  return (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-5 py-4 align-top">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-[#42b883] to-[#3aa374] flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
                            {p.nome_completo.charAt(0)}
                          </div>
                          <div>
                            <p className="text-[13px] font-bold text-gray-900 group-hover:text-[#42b883] transition-colors">
                              {p.nome_completo}
                            </p>
                            {p.prestador?.nome_comercial && (
                              <span className="text-[10px] text-gray-400 font-semibold block italic mt-0.5 animate-pulse">
                                {p.prestador.nome_comercial}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 align-top">
                        <div className="space-y-1.5 text-[12px] font-medium text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <Mail size={12} className="text-gray-400" />
                            <span className="truncate max-w-[150px]" title={p.email}>{p.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Phone size={12} className="text-gray-400" />
                            <span>{p.telefone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 align-top">
                        <div className="space-y-1.5 text-[12px] font-medium text-gray-600">
                          {p.prestador?.nif && (
                            <div className="font-bold text-gray-700">NIF: {p.prestador.nif}</div>
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
                        <div className="space-y-1 text-[12px] font-semibold text-gray-600">
                          <div className="flex items-center gap-1">
                            <Star size={12} className="fill-amber-400 text-amber-400" />
                            <span>{p.prestador?.avaliacao_media || '0.00'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Award size={12} className="text-gray-400" />
                            <span>{p.prestador?.total_servicos_concluidos || 0} concluído(s)</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 align-top">
                        <StatusBadge status={p.prestador?.status_verificacao || 'pendente'} />
                      </td>
                      <td className="px-5 py-4 align-top">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="px-5 py-4 align-top text-right">
                        <Link
                          href={`/prestadores/${p.id}`}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-sm bg-white border border-gray-200 text-gray-500 hover:text-[#42b883] hover:border-[#42b883] hover:bg-[#42b883]/5 transition-all shadow-sm"
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
 
          {/* Pagination */}
          {meta && meta.last_page > 1 && (
            <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-[11px] text-gray-500 font-semibold">
                A mostrar {meta.from} a {meta.to} de {meta.total} prestadores
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-3 py-1.5 text-[11px] font-bold bg-white border border-gray-200 rounded-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Anterior
                </button>
                <span className="text-[11px] font-bold text-gray-700 px-2">
                  Página {meta.current_page} de {meta.last_page}
                </span>
                <button
                  disabled={page === meta.last_page}
                  onClick={() => setPage(page + 1)}
                  className="px-3 py-1.5 text-[11px] font-bold bg-white border border-gray-200 rounded-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Próxima
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
