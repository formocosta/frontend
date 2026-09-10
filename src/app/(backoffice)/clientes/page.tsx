'use client';

import { useEffect, useState, useCallback } from 'react';
import { Users, Mail, Phone, MapPin, ClipboardList, ChevronRight } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { useClientes } from '@/hooks/users/users.hooks';
import { StatusBadge } from '@/components/common/ui/Badge';
import { FilterBar } from '@/components/common/FilterBar';
import Link from 'next/link';

const statusOptions = [
  { value: '', label: 'Todos os status' },
  { value: 'activo', label: 'Ativo' },
  { value: 'suspenso', label: 'Suspenso' },
  { value: 'pendente', label: 'Pendente' },
];

export default function ClientesPage() {
  const { clientes, meta, loading, error, fetchClientes } = useClientes();
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const loadData = useCallback(() => {
    fetchClientes({
      search,
      status: statusFilter,
      page,
      page_size: 10,
    });
  }, [search, statusFilter, page, fetchClientes]);

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
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Clientes"
        description="Gestão de clientes registados na plataforma"
      />

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total de Clientes', value: meta?.total || 0, textColor: 'text-emerald-600', bgColor: 'bg-emerald-50' },
          { label: 'Ativos', value: clientes.filter(c => c.status === 'activo').length || 0, textColor: 'text-blue-600', bgColor: 'bg-blue-50' },
          { label: 'Suspensos', value: clientes.filter(c => c.status === 'suspenso').length || 0, textColor: 'text-red-600', bgColor: 'bg-red-50' },
        ].map((stat, i) => (
          <div
            key={i}
            className="relative bg-white rounded-md border border-gray-200/80 p-4 flex flex-col justify-between min-h-[90px] overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300"
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
        searchPlaceholder="Pesquisar por nome, email, telefone ou NIF..."
        searchValue={search}
        onSearchChange={handleSearchChange}
        selectOptions={statusOptions}
        selectValue={statusFilter}
        onSelectChange={handleStatusChange}
      />

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-sm text-red-700 font-medium">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && clientes.length === 0 && (
        <div className="bg-white rounded-md p-12 shadow-sm border border-gray-100/80 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-2 border-[#42b883] border-t-transparent rounded-md animate-spin" />
          <p className="text-sm text-gray-500 mt-4 font-medium">A carregar clientes...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && clientes.length === 0 && (
        <div className="bg-white rounded-md p-12 shadow-sm border border-gray-100/80 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-md bg-gray-50 flex items-center justify-center text-gray-400 mb-4">
            <Users size={28} />
          </div>
          <h3 className="text-base font-bold text-gray-900">Sem clientes</h3>
          <p className="text-xs text-gray-500 mt-1.5 max-w-sm font-medium">
            {search || statusFilter
              ? 'Nenhum cliente encontrado com os filtros selecionados.'
              : 'Ainda não existem clientes registados na plataforma.'}
          </p>
        </div>
      )}

      {/* Table Content */}
      {!loading && clientes.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-md shadow-sm overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="px-5 py-4">Cliente</th>
                  <th className="px-5 py-4">Contactos</th>
                  <th className="px-5 py-4">Localização / NIF</th>
                  <th className="px-5 py-4">Serviços Solicitados</th>
                  <th className="px-5 py-4">Status Conta</th>
                  <th className="px-5 py-4">Data Registo</th>
                  <th className="px-5 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {clientes.map((c) => {
                  const localizacao = c.cliente
                    ? [c.cliente.provincia, c.cliente.municipio].filter(Boolean).join(', ')
                    : '';

                  return (
                    <tr key={c.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-5 py-4 align-top">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md bg-gradient-to-br from-[#42b883] to-[#3aa374] flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
                            {c.nome_completo.charAt(0)}
                          </div>
                          <div>
                            <p className="text-[13px] font-bold text-gray-900 group-hover:text-[#42b883] transition-colors">
                              {c.nome_completo}
                            </p>
                            <span className="text-[10px] text-gray-400 font-medium block">
                              ID: {c.id.substring(0, 8)}...
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 align-top">
                        <div className="space-y-1.5 text-[12px] font-medium text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <Mail size={12} className="text-gray-400" />
                            <span className="truncate max-w-[150px]" title={c.email}>{c.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Phone size={12} className="text-gray-400" />
                            <span>{c.telefone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 align-top">
                        <div className="space-y-1.5 text-[12px] font-medium text-gray-600">
                          {c.cliente?.nif && (
                            <div className="font-bold text-gray-700">NIF: {c.cliente.nif}</div>
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
                        <div className="flex items-center gap-1.5 text-[12px] font-bold text-gray-700">
                          <ClipboardList size={14} className="text-gray-400" />
                          <span>{c.cliente?.total_servicos || 0}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 align-top">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="px-5 py-4 align-top text-[12px] text-gray-500 font-medium">
                        {new Date(c.created_at).toLocaleDateString('pt-AO', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-5 py-4 align-top text-right">
                        <Link
                          href={`/clientes/${c.id}`}
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

          {/* Mobile Cards View */}
          <div className="block md:hidden divide-y divide-gray-100">
            {clientes.map((c) => {
              const localizacao = c.cliente
                ? [c.cliente.provincia, c.cliente.municipio].filter(Boolean).join(', ')
                : '';

              return (
                <div key={c.id} className="p-4 space-y-3 bg-white hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-md bg-gradient-to-br from-[#42b883] to-[#3aa374] flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
                        {c.nome_completo.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[14px] font-bold text-gray-900 truncate">
                          {c.nome_completo}
                        </p>
                        <span className="text-[10px] text-gray-400 font-medium block">
                          ID: {c.id.substring(0, 8)}...
                        </span>
                      </div>
                    </div>
                    <StatusBadge status={c.status} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px] bg-gray-50/80 p-3 rounded-md border border-gray-100">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Mail size={12} className="text-gray-400 shrink-0" />
                        <span className="truncate" title={c.email}>{c.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Phone size={12} className="text-gray-400 shrink-0" />
                        <span>{c.telefone}</span>
                      </div>
                    </div>
                    <div className="space-y-1.5 border-t sm:border-t-0 border-gray-100 pt-1.5 sm:pt-0">
                      {c.cliente?.nif && (
                        <div className="font-bold text-gray-700">NIF: {c.cliente.nif}</div>
                      )}
                      {localizacao ? (
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <MapPin size={12} className="text-gray-400 shrink-0" />
                          <span className="truncate" title={localizacao}>{localizacao}</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-gray-400 italic">Sem localização</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-semibold">
                      <ClipboardList size={13} className="text-gray-400" />
                      <span>{c.cliente?.total_servicos || 0} serviço(s)</span>
                      <span className="text-gray-300">•</span>
                      <span>{new Date(c.created_at).toLocaleDateString('pt-AO')}</span>
                    </div>
                    <Link
                      href={`/clientes/${c.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-[12px] font-bold rounded-md bg-white border border-gray-200 text-gray-700 hover:text-[#42b883] hover:border-[#42b883] hover:bg-[#42b883]/5 transition-all shadow-sm"
                    >
                      <span>Ver Detalhes</span>
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {meta && meta.last_page > 1 && (
            <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-[11px] text-gray-500 font-semibold">
                A mostrar {meta.from} a {meta.to} de {meta.total} clientes
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-3 py-1.5 text-[11px] font-bold bg-white border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Anterior
                </button>
                <span className="text-[11px] font-bold text-gray-700 px-2">
                  Página {meta.current_page} de {meta.last_page}
                </span>
                <button
                  disabled={page === meta.last_page}
                  onClick={() => setPage(page + 1)}
                  className="px-3 py-1.5 text-[11px] font-bold bg-white border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
