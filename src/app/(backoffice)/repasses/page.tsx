'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeftRight, RefreshCw, CheckCircle, Clock, DollarSign, Wallet } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/common/form/Button';
import { Input } from '@/components/common/form/Input';
import { SelectOption } from '@/components/common/form/Select';
import { Badge } from '@/components/common/ui/Badge';
import { Modal } from '@/components/common/ui/Modal';
import { FilterBar } from '@/components/common/FilterBar';
import { useRepasses, useFinanceiro } from '@/hooks/finance/finance.hooks';
import { Repasse } from '@/shared/types/backoffice/finance.types';
import { processarRepasseSchema, ProcessarRepasseFormData } from '@/shared/schemas/finance.schema';

const statusOptions: SelectOption[] = [
  { value: '', label: 'Todos os Status' },
  { value: 'pendente', label: 'Pendente' },
  { value: 'pago', label: 'Pago' },
  { value: 'falhado', label: 'Falhado' },
];

function formatCurrency(value: number) {
  return value.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' });
}

export default function RepassesPage() {
  const { repasses, meta, loading, error, fetchRepasses, processarRepasse } = useRepasses();
  const { resumo, fetchResumo } = useFinanceiro();
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showProcessarModal, setShowProcessarModal] = useState(false);
  const [selectedRepasse, setSelectedRepasse] = useState<Repasse | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const processarForm = useForm<ProcessarRepasseFormData>({
    resolver: zodResolver(processarRepasseSchema),
  });

  const loadData = useCallback(() => {
    const params: { page: number; status?: string } = { page: currentPage };
    if (statusFilter) params.status = statusFilter;
    fetchRepasses(params);
    fetchResumo();
  }, [statusFilter, currentPage, fetchRepasses, fetchResumo]);

  useEffect(() => {
    loadData();
  }, [loadData]);



  async function handleProcessar(data: ProcessarRepasseFormData) {
    if (!selectedRepasse) return;
    setActionLoading(true);
    const successResult = await processarRepasse(selectedRepasse.id, data);
    if (successResult) {
      setShowProcessarModal(false);
      setSelectedRepasse(null);
      processarForm.reset();
      setSuccess('Repasse processado e transferido com sucesso!');
      setTimeout(() => setSuccess(null), 4000);
      loadData();
    }
    setActionLoading(false);
  }

  const totalPages = meta ? Math.ceil(Number(meta.total) / 15) : 1;

  // Filtro Local baseado na Pesquisa (IBAN, Referência ou ID)
  const filteredRepasses = useMemo(() => {
    if (!search.trim()) return repasses;
    const lowerSearch = search.toLowerCase();
    return repasses.filter((rep) =>
      rep.id.toLowerCase().includes(lowerSearch) ||
      (rep.referencia_repasse && rep.referencia_repasse.toLowerCase().includes(lowerSearch)) ||
      (rep.iban_destino && rep.iban_destino.toLowerCase().includes(lowerSearch))
    );
  }, [repasses, search]);

  const totalCount = meta?.total !== undefined ? Number(meta.total) : filteredRepasses.length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Gestão de Repasses"
        description="Monitorize e processe os pagamentos devidos aos prestadores de serviços."
        action={
          <Button
            variant="outline"
            className="rounded-md font-bold shadow-sm bg-white hover:bg-gray-50 border-gray-200"
            onClick={loadData}
            leftIcon={<RefreshCw size={14} strokeWidth={2.5} />}
          >
            Actualizar Dados
          </Button>
        }
      />

      {/* Alertas */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-[13px] text-red-700 font-bold shadow-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-md p-4 text-[13px] text-emerald-700 font-bold shadow-sm">
          {success}
        </div>
      )}

      {/* Estatísticas Financeiras Premium */}
      {resumo && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-md border border-amber-100 p-5 shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-all hover:border-amber-200 group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-md bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                <Clock size={20} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 font-black uppercase tracking-widest">Repasses Pendentes</p>
                <p className="text-2xl font-black text-amber-600 tracking-tight">{resumo.quantidade_repasses_pendentes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-md border border-amber-100 p-5 shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-all hover:border-amber-200 group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-md bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                <DollarSign size={20} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 font-black uppercase tracking-widest">Valor Pendente</p>
                <p className="text-2xl font-black text-amber-600 tracking-tight">{formatCurrency(resumo.valor_repasses_pendentes)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-md border border-emerald-100 p-5 shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-all hover:border-emerald-200 group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-md bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                <Wallet size={20} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 font-black uppercase tracking-widest">Comissões Globais</p>
                <p className="text-2xl font-black text-emerald-600 tracking-tight">{formatCurrency(resumo.comissoes_totais)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Componente Genérico de Filtro */}
      <FilterBar
        searchPlaceholder="Pesquisar por IBAN, Ref, ou ID..."
        searchValue={search}
        onSearchChange={setSearch}
        selectOptions={statusOptions}
        selectValue={statusFilter}
        onSelectChange={setStatusFilter}
      />

      {/* Carregamento */}
      {loading && repasses.length === 0 && (
        <div className="bg-white rounded-md p-12 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-2 border-[#42b883] border-t-transparent rounded-md animate-spin" />
          <p className="text-sm text-gray-500 mt-4 font-black tracking-tight">A carregar registos de repasses...</p>
        </div>
      )}

      {/* Estado Vazio (Sem Dados) */}
      {!loading && repasses.length === 0 && (
        <div className="bg-white rounded-md p-12 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-md bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 mb-4 shadow-inner">
            <ArrowLeftRight size={28} />
          </div>
          <h3 className="text-[15px] font-black text-gray-900 tracking-tight">Zero Repasses</h3>
          <p className="text-[12px] text-gray-500 mt-1.5 max-w-sm font-semibold">
            {statusFilter
              ? 'Não existem repasses com o status seleccionado.'
              : 'O sistema ainda não possui repasses registados.'}
          </p>
        </div>
      )}

      {/* Estado Vazio (Sem Resultados de Pesquisa) */}
      {!loading && repasses.length > 0 && filteredRepasses.length === 0 && (
        <div className="bg-white rounded-md p-12 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col items-center justify-center text-center">
          <p className="text-[12px] text-gray-500 font-bold">Nenhum repasse encontrado para a pesquisa "{search}".</p>
        </div>
      )}

      {/* Tabela de Resultados */}
      {!loading && filteredRepasses.length > 0 && (
        <div className="space-y-4">
          <p className="text-[11px] text-gray-500 font-black uppercase tracking-widest bg-gray-50 inline-block px-2.5 py-1 rounded-md border border-gray-100">
            {totalCount} repasse{(totalCount !== 1) ? 's' : ''} {search ? '(Filtrados)' : ''}
          </p>

          <div className="bg-white rounded-md border border-gray-200 shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left text-[11px] font-black text-gray-600 uppercase tracking-widest px-5 py-4">Status & Valor</th>
                    <th className="text-left text-[11px] font-black text-gray-600 uppercase tracking-widest px-5 py-4">ID Transação</th>
                    <th className="text-left text-[11px] font-black text-gray-600 uppercase tracking-widest px-5 py-4">Destino (IBAN & Ref)</th>
                    <th className="text-left text-[11px] font-black text-gray-600 uppercase tracking-widest px-5 py-4">Data</th>
                    <th className="text-right text-[11px] font-black text-gray-600 uppercase tracking-widest px-5 py-4">Acções</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRepasses.map((rep) => (
                    <tr key={rep.id} className="hover:bg-[#42b883]/5 transition-colors group">
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1.5 items-start">
                          <span className="text-[14px] text-gray-900 font-black tracking-tight">
                            {formatCurrency(Number(rep.valor_repasse))}
                          </span>
                          <Badge
                            variant={rep.status === 'pago' ? 'success' : rep.status === 'pendente' ? 'warning' : 'danger'}
                            size="sm"
                          >
                            {rep.status === 'pago' ? 'Pago' : rep.status === 'pendente' ? 'Pendente' : 'Falhado'}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-[12px] text-gray-600 font-mono font-bold bg-gray-50 px-2 py-1 rounded-md border border-gray-100">{rep.id.slice(0, 13)}...</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-[12px] text-gray-900 font-black tracking-tight">{rep.iban_destino || 'Sem IBAN'}</span>
                          <span className="text-[11px] text-gray-500 font-semibold">{rep.referencia_repasse || 'Sem Referência'}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-[12px] text-gray-600 font-bold">
                          {new Date(rep.criado_em).toLocaleDateString('pt-AO')}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        {rep.status === 'pendente' ? (
                          <Button
                            variant="primary"
                            className="rounded-md font-bold shadow-sm h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              setSelectedRepasse(rep);
                              setShowProcessarModal(true);
                            }}
                            leftIcon={<CheckCircle size={14} strokeWidth={2.5} />}
                          >
                            Pagar Agora
                          </Button>
                        ) : (
                          <span className="text-[11px] text-gray-400 font-bold">Processado</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="block md:hidden divide-y divide-gray-100">
              {filteredRepasses.map((rep) => (
                <div key={rep.id} className="p-4 space-y-3 bg-white hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[16px] text-gray-900 font-black tracking-tight block">
                        {formatCurrency(Number(rep.valor_repasse))}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono font-bold">
                        ID: {rep.id.slice(0, 13)}...
                      </span>
                    </div>
                    <Badge
                      variant={rep.status === 'pago' ? 'success' : rep.status === 'pendente' ? 'warning' : 'danger'}
                      size="sm"
                    >
                      {rep.status === 'pago' ? 'Pago' : rep.status === 'pendente' ? 'Pendente' : 'Falhado'}
                    </Badge>
                  </div>

                  <div className="bg-gray-50/80 p-3 rounded-md border border-gray-100 space-y-1 text-[12px]">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">IBAN Destino:</span>
                      <span className="font-mono font-bold text-gray-800">{rep.iban_destino || 'Sem IBAN'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Referência:</span>
                      <span className="font-semibold text-gray-600">{rep.referencia_repasse || 'Sem Referência'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-gray-500 font-bold">
                      {new Date(rep.criado_em).toLocaleDateString('pt-AO')}
                    </span>
                    {rep.status === 'pendente' ? (
                      <Button
                        variant="primary"
                        className="rounded-md font-bold shadow-sm h-8 text-[12px] px-3"
                        onClick={() => {
                          setSelectedRepasse(rep);
                          setShowProcessarModal(true);
                        }}
                        leftIcon={<CheckCircle size={14} strokeWidth={2.5} />}
                      >
                        Pagar Agora
                      </Button>
                    ) : (
                      <span className="text-[11px] text-gray-400 font-bold bg-gray-100 px-2 py-0.5 rounded">Processado</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Paginação */}
          {totalPages > 1 && !search && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <p className="text-[12px] text-gray-500 font-bold">
                Página {currentPage} de {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="rounded-md font-bold h-8" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                  Anterior
                </Button>
                <Button variant="outline" className="rounded-md font-bold h-8" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal: Processar Repasse */}
      <Modal
        isOpen={showProcessarModal}
        onClose={() => {
          setShowProcessarModal(false);
          setSelectedRepasse(null);
          processarForm.reset();
        }}
        title="Liquidar Repasse ao Prestador"
        size="sm"
        footer={
          <>
            <Button
              variant="outline"
              className="rounded-md font-bold"
              onClick={() => {
                setShowProcessarModal(false);
                setSelectedRepasse(null);
                processarForm.reset();
              }}
              disabled={actionLoading}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              className="rounded-md font-bold bg-[#42b883] hover:bg-[#3aa374]"
              onClick={processarForm.handleSubmit(handleProcessar)}
              isLoading={actionLoading}
              leftIcon={<CheckCircle size={14} strokeWidth={2.5} />}
            >
              Liquidar Transferência
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <div className="bg-[#42b883]/5 rounded-md p-4 border border-[#42b883]/20 flex flex-col items-center justify-center">
            <p className="text-[11px] text-[#42b883] font-black uppercase tracking-widest mb-1">Montante a Liquidar</p>
            <p className="text-3xl font-black text-gray-900 tracking-tight">
              {selectedRepasse ? formatCurrency(Number(selectedRepasse.valor_repasse)) : '—'}
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <Input
              label="Referência da Transferência (Obrigatória)"
              placeholder="Ex: TPA-2026-X1Y2"
              error={processarForm.formState.errors.referencia_repasse?.message}
              {...processarForm.register('referencia_repasse')}
              className="rounded-md"
            />
            <Input
              label="IBAN de Destino (Opcional)"
              placeholder="AO06 0040 0000 ..."
              error={processarForm.formState.errors.iban_destino?.message}
              {...processarForm.register('iban_destino')}
              className="rounded-md font-mono text-[13px]"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
