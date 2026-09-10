'use client';

import { useEffect, useState, useCallback } from 'react';
import { ClipboardList, ChevronRight, User, MapPin, Calendar, Clock } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { useSolicitacoes } from '@/hooks/solicitacoes/solicitacoes.hooks';
import { ListSolicitacoesParams } from '@/shared/types/backoffice/requests.types';
import { Button } from '@/components/common/form/Button';
import { FilterBar } from '@/components/common/FilterBar';
import { StatusBadge } from '@/components/common/ui/Badge';
import Link from 'next/link';
import { SelectOption } from '@/components/common/form/Select';

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
    const params: ListSolicitacoesParams = { page: currentPage, limit };
    if (statusFilter) params.status = statusFilter;
    fetchSolicitacoes(params);
  }, [statusFilter, currentPage, fetchSolicitacoes]);

  useEffect(() => {
    loadData();
  }, [loadData]);



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
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Solicitações de Serviço"
        description="Acompanhamento e gestão de todos os pedidos submetidos pelos clientes na plataforma."
      />

      {/* Filters */}
      <FilterBar
        searchPlaceholder="Pesquisar por serviço, descrição ou localização..."
        searchValue={search}
        onSearchChange={setSearch}
        selectOptions={statusOptions}
        selectValue={statusFilter}
        onSelectChange={setStatusFilter}
      />

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-sm text-red-700 font-bold shadow-sm">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && solicitacoes.length === 0 && (
        <div className="bg-white rounded-md p-12 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-2 border-[#42b883] border-t-transparent rounded-md animate-spin" />
          <p className="text-sm text-gray-500 mt-4 font-black tracking-tight">A carregar solicitações...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && solicitacoes.length === 0 && (
        <div className="bg-white rounded-md p-12 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-md bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 mb-4 shadow-inner">
            <ClipboardList size={28} />
          </div>
          <h3 className="text-[15px] font-black text-gray-900 tracking-tight">Sem solicitações</h3>
          <p className="text-[12px] text-gray-500 mt-1.5 max-w-sm font-semibold">
            {statusFilter
              ? 'Nenhuma solicitação encontrada com o filtro seleccionado.'
              : 'Ainda não existem solicitações registadas no sistema.'}
          </p>
        </div>
      )}

      {/* Table Content */}
      {!loading && solicitacoes.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-md shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-black text-gray-500 uppercase tracking-widest">
                  <th className="px-5 py-4">Serviço & Cliente</th>
                  <th className="px-5 py-4">Agendamento & Local</th>
                  <th className="px-5 py-4">Prestador & Preço</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredSolicitacoes.length > 0 ? (
                  filteredSolicitacoes.map((solicitacao) => {
                    const localizacao = [solicitacao.provincia, solicitacao.municipio].filter(Boolean).join(', ');
                    const dataFormatada = solicitacao.data_pretendida
                      ? new Date(solicitacao.data_pretendida).toLocaleDateString('pt-AO', { day: '2-digit', month: 'short', year: 'numeric' })
                      : null;

                    return (
                      <tr key={solicitacao.id} className="hover:bg-gray-50/50 transition-colors group">
                        {/* Serviço & Cliente */}
                        <td className="px-5 py-4 align-top">
                          <p className="text-[13px] font-black text-gray-900 group-hover:text-[#42b883] transition-colors tracking-tight line-clamp-1">
                            {solicitacao.servico?.titulo_servico || 'Solicitação'}
                          </p>
                          {solicitacao.descricao_cliente && (
                            <p className="text-[11px] font-semibold text-gray-500 mt-1 line-clamp-2 leading-relaxed max-w-[250px]">
                              {solicitacao.descricao_cliente}
                            </p>
                          )}
                        </td>

                        {/* Agendamento & Local */}
                        <td className="px-5 py-4 align-top">
                          <div className="space-y-1.5 text-[11px] font-bold text-gray-600">
                            {(dataFormatada || solicitacao.hora_pretendida) && (
                              <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md border border-gray-100 w-fit">
                                <Calendar size={12} className="text-[#42b883]" />
                                <span>{dataFormatada} {solicitacao.hora_pretendida && `às ${solicitacao.hora_pretendida}`}</span>
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

                        {/* Prestador & Preço */}
                        <td className="px-5 py-4 align-top">
                          <div className="space-y-1.5 text-[11px] font-bold">
                            {solicitacao.prestador ? (
                              <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100 w-fit">
                                <User size={12} />
                                <span className="truncate max-w-[150px]">{solicitacao.prestador.nome}</span>
                              </div>
                            ) : (
                              <span className="text-gray-400 font-semibold italic">Sem prestador atribuído</span>
                            )}

                            {solicitacao.preco_acordado != null && (
                              <div className="text-[13px] font-black text-[#42b883] tracking-tight mt-1">
                                {Number(solicitacao.preco_acordado).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4 align-top">
                          <StatusBadge status={solicitacao.status_id} />
                          <div className="text-[10px] text-gray-400 font-semibold mt-2 flex items-center gap-1">
                            <Clock size={10} />
                            {new Date(solicitacao.created_at).toLocaleDateString('pt-AO', { day: '2-digit', month: 'short' })}
                          </div>
                        </td>

                        {/* Ações */}
                        <td className="px-5 py-4 align-top text-right">
                          <Link
                            href={`/solicitacoes/${solicitacao.id}`}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-white border border-gray-200 text-gray-500 hover:text-[#42b883] hover:border-[#42b883] hover:bg-[#42b883]/10 transition-all shadow-sm group-hover:border-[#42b883]/50"
                            title="Ver Detalhes"
                          >
                            <ChevronRight size={16} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center">
                      <p className="text-[12px] text-gray-500 font-bold">
                        Nenhum resultado encontrado para "{search}"
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="block md:hidden divide-y divide-gray-100">
            {filteredSolicitacoes.length > 0 ? (
              filteredSolicitacoes.map((solicitacao) => {
                const localizacao = [solicitacao.provincia, solicitacao.municipio].filter(Boolean).join(', ');
                const dataFormatada = solicitacao.data_pretendida
                  ? new Date(solicitacao.data_pretendida).toLocaleDateString('pt-AO', { day: '2-digit', month: 'short', year: 'numeric' })
                  : null;

                return (
                  <div key={solicitacao.id} className="p-4 space-y-3 bg-white hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 min-w-0 flex-1">
                        <p className="text-[14px] font-black text-gray-900 tracking-tight">
                          {solicitacao.servico?.titulo_servico || 'Solicitação'}
                        </p>
                        {solicitacao.descricao_cliente && (
                          <p className="text-[11px] font-semibold text-gray-500 line-clamp-2 leading-relaxed">
                            {solicitacao.descricao_cliente}
                          </p>
                        )}
                      </div>
                      <div className="shrink-0">
                        <StatusBadge status={solicitacao.status_id} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-bold bg-gray-50/80 p-3 rounded-md border border-gray-100">
                      <div className="space-y-1.5 text-gray-600">
                        {(dataFormatada || solicitacao.hora_pretendida) && (
                          <div className="flex items-center gap-1.5">
                            <Calendar size={12} className="text-[#42b883] shrink-0" />
                            <span>{dataFormatada} {solicitacao.hora_pretendida && `às ${solicitacao.hora_pretendida}`}</span>
                          </div>
                        )}
                        {localizacao && (
                          <div className="flex items-center gap-1.5">
                            <MapPin size={12} className="text-gray-400 shrink-0" />
                            <span className="truncate" title={localizacao}>{localizacao}</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-1.5 border-t sm:border-t-0 border-gray-100 pt-1.5 sm:pt-0">
                        {solicitacao.prestador ? (
                          <div className="flex items-center gap-1.5 text-blue-600">
                            <User size={12} className="shrink-0" />
                            <span className="truncate">{solicitacao.prestador.nome}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 font-semibold italic">Sem prestador</span>
                        )}
                        {solicitacao.preco_acordado != null && (
                          <div className="text-[13px] font-black text-[#42b883] tracking-tight">
                            {Number(solicitacao.preco_acordado).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="text-[10px] text-gray-400 font-semibold flex items-center gap-1">
                        <Clock size={10} />
                        <span>Criado em {new Date(solicitacao.created_at).toLocaleDateString('pt-AO')}</span>
                      </div>
                      <Link
                        href={`/solicitacoes/${solicitacao.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-[12px] font-bold rounded-md bg-white border border-gray-200 text-gray-700 hover:text-[#42b883] hover:border-[#42b883] hover:bg-[#42b883]/5 transition-all shadow-sm"
                      >
                        <span>Ver Detalhes</span>
                        <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="px-5 py-8 text-center">
                <p className="text-[12px] text-gray-500 font-bold">
                  Nenhum resultado encontrado para "{search}"
                </p>
              </div>
            )}
          </div>

          {/* Pagination Footer */}
          <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-[11px] text-gray-500 font-black tracking-widest uppercase">
              {meta?.total || solicitacoes.length} {meta?.total === 1 || solicitacoes.length === 1 ? 'solicitação' : 'solicitações'}
            </p>

            {totalPages > 1 && (
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-gray-500 font-bold">
                  Página {currentPage} de {totalPages}
                </span>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    className="h-7 px-3 text-[11px] rounded-md bg-white border-gray-200 text-gray-600 font-bold hover:bg-gray-50 hover:text-gray-900"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    className="h-7 px-3 text-[11px] rounded-md bg-white border-gray-200 text-gray-600 font-bold hover:bg-gray-50 hover:text-gray-900"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Próxima
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
