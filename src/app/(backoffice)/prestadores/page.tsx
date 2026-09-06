'use client';

import { useEffect, useState, useCallback } from 'react';
import { UserCheck, Mail, Phone, MapPin, Star, Briefcase, ChevronRight, ShieldCheck } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { usePrestadores } from '@/hooks/users/users.hooks';
import { StatusBadge } from '@/components/common/ui/Badge';
import { FilterBar } from '@/components/common/FilterBar';
import Link from 'next/link';

const kycStatusOptions = [
  { value: '', label: 'Todos os status KYC' },
  { value: 'aprovado', label: 'Aprovado' },
  { value: 'pendente', label: 'Pendente' },
  { value: 'rejeitado', label: 'Rejeitado' },
];

export default function PrestadoresPage() {
  const { prestadores, meta, loading, error, fetchPrestadores } = usePrestadores();
  const [kycFilter, setKycFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const loadData = useCallback(() => {
    fetchPrestadores({
      search,
      status_verificacao: kycFilter,
      page,
      page_size: 10,
    });
  }, [search, kycFilter, page, fetchPrestadores]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleKycChange = (val: string) => {
    setKycFilter(val);
    setPage(1);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Prestadores de Serviços"
        description="Gestão e acompanhamento de prestadores aprovados e ativos na plataforma."
      />

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total de Prestadores', value: meta?.total || 0, textColor: 'text-[#42b883]', bgColor: 'bg-[#42b883]/10' },
          { label: 'KYC Aprovados', value: prestadores.filter(p => p.prestador?.status_verificacao === 'aprovado').length || 0, textColor: 'text-emerald-600', bgColor: 'bg-emerald-50' },
          { label: 'Contas Ativas', value: prestadores.filter(p => p.status === 'activo').length || 0, textColor: 'text-blue-600', bgColor: 'bg-blue-50' },
        ].map((stat, i) => (
          <div
            key={i}
            className="relative bg-white rounded-md border border-gray-100 p-5 flex flex-col justify-between min-h-[95px] overflow-hidden group shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:border-gray-200 transition-all duration-300"
          >
            <div className={`absolute -right-4 -top-4 w-16 h-16 rounded-md opacity-50 transition-transform duration-300 group-hover:scale-125 ${stat.bgColor}`} />
            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider relative z-10">{stat.label}</p>
            <div className="flex items-baseline gap-2 relative z-10 mt-1">
              <p className={`text-3xl font-black tracking-tight ${stat.textColor}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <FilterBar
        searchPlaceholder="Pesquisar por nome, email, telefone, NIF ou cidade..."
        searchValue={search}
        onSearchChange={handleSearchChange}
        selectOptions={kycStatusOptions}
        selectValue={kycFilter}
        onSelectChange={handleKycChange}
      />

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-sm text-red-700 font-bold shadow-sm">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && prestadores.length === 0 && (
        <div className="bg-white rounded-md p-12 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-2 border-[#42b883] border-t-transparent rounded-md animate-spin" />
          <p className="text-sm text-gray-500 mt-4 font-black tracking-tight">A carregar prestadores...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && prestadores.length === 0 && (
        <div className="bg-white rounded-md p-12 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-md bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 mb-4 shadow-inner">
            <UserCheck size={28} />
          </div>
          <h3 className="text-[15px] font-black text-gray-900 tracking-tight">Sem prestadores encontrados</h3>
          <p className="text-[12px] text-gray-500 mt-1.5 max-w-sm font-semibold">
            {search || kycFilter
              ? 'Nenhum prestador corresponde aos critérios de pesquisa selecionados.'
              : 'Ainda não existem prestadores registados ou aprovados no sistema.'}
          </p>
        </div>
      )}

      {/* Table Content */}
      {!loading && prestadores.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-md shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-black text-gray-500 uppercase tracking-wider">
                  <th className="px-5 py-4">Prestador</th>
                  <th className="px-5 py-4">Contactos</th>
                  <th className="px-5 py-4">NIF / Localização</th>
                  <th className="px-5 py-4">Status KYC</th>
                  <th className="px-5 py-4">Avaliação / Serviços</th>
                  <th className="px-5 py-4">Data Registo</th>
                  <th className="px-5 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {prestadores.map((p) => {
                  const localizacao = p.prestador
                    ? [p.prestador.provincia, p.prestador.municipio].filter(Boolean).join(', ')
                    : '';

                  const avaliacao = p.prestador?.avaliacao_media != null
                    ? Number(p.prestador.avaliacao_media).toFixed(1)
                    : null;

                  return (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-5 py-4 align-top">
                        <div className="flex items-center gap-3">
                          {p.foto_perfil_url ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={p.foto_perfil_url}
                              alt={p.nome_completo}
                              className="w-10 h-10 rounded-md object-cover border border-gray-100 shadow-sm shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-md bg-gradient-to-br from-[#42b883] to-[#3aa374] flex items-center justify-center text-white font-black text-sm shrink-0 shadow-sm">
                              {p.nome_completo.charAt(0)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-[13px] font-black text-gray-900 group-hover:text-[#42b883] transition-colors truncate">
                              {p.nome_completo}
                            </p>
                            {p.prestador?.nome_comercial && (
                              <p className="text-[11px] text-gray-500 font-semibold truncate">
                                {p.prestador.nome_comercial}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 align-top">
                        <div className="space-y-1 text-[12px] font-semibold text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <Mail size={12} className="text-gray-400 shrink-0" />
                            <span className="truncate max-w-[160px]" title={p.email}>{p.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Phone size={12} className="text-gray-400 shrink-0" />
                            <span>{p.telefone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 align-top">
                        <div className="space-y-1 text-[12px] font-semibold text-gray-600">
                          {p.prestador?.nif && (
                            <div className="font-black text-gray-800">NIF: {p.prestador.nif}</div>
                          )}
                          {localizacao ? (
                            <div className="flex items-center gap-1.5">
                              <MapPin size={12} className="text-gray-400 shrink-0" />
                              <span className="truncate max-w-[150px]" title={localizacao}>{localizacao}</span>
                            </div>
                          ) : (
                            <span className="text-[11px] text-gray-400 font-medium">Sem localização</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 align-top">
                        <div className="space-y-1.5">
                          <StatusBadge status={p.prestador?.status_verificacao || 'pendente'} />
                          <div className="block">
                            <span className={`text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md border ${p.status === 'activo'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-red-50 text-red-700 border-red-200'
                              }`}>
                              Conta {p.status === 'activo' ? 'Ativa' : 'Inativa'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 align-top">
                        <div className="space-y-1 text-[12px]">
                          {avaliacao ? (
                            <div className="flex items-center gap-1 text-amber-600 font-black">
                              <Star size={12} className="fill-amber-500 text-amber-500" />
                              <span>{avaliacao}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-[11px] font-semibold">Sem avaliações</span>
                          )}
                          <div className="flex items-center gap-1 text-gray-500 font-bold text-[11px]">
                            <Briefcase size={12} className="text-gray-400" />
                            <span>{p.prestador?.total_servicos_concluidos || 0} concluído(s)</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 align-top text-[12px] text-gray-500 font-semibold">
                        {new Date(p.created_at).toLocaleDateString('pt-AO', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-5 py-4 align-top text-right">
                        <Link
                          href={`/prestadores/${p.id}`}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-white border border-gray-200 text-gray-500 hover:text-[#42b883] hover:border-[#42b883] hover:bg-[#42b883]/5 transition-all shadow-sm"
                          title="Ver Detalhes do Prestador"
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
              <p className="text-[11px] text-gray-500 font-bold">
                A mostrar {meta.from} a {meta.to} de {meta.total} prestadores
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-3 py-1.5 text-[11px] font-black bg-white border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Anterior
                </button>
                <span className="text-[11px] font-black text-gray-700 px-2">
                  Página {meta.current_page} de {meta.last_page}
                </span>
                <button
                  disabled={page === meta.last_page}
                  onClick={() => setPage(page + 1)}
                  className="px-3 py-1.5 text-[11px] font-black bg-white border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
