'use client';

import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeftRight, RefreshCw, CheckCircle, Clock, DollarSign } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/common/form/Button';
import { Input } from '@/components/common/form/Input';
import { Select, SelectOption } from '@/components/common/form/Select';
import { Badge } from '@/components/common/ui/Badge';
import { Modal } from '@/components/common/ui/Modal';
import { useRepasses, useFinanceiro } from '@/hooks/finance/finance.hooks';
import { Repasse } from '@/shared/types/backoffice/finance.types';
import { processarRepasseSchema, ProcessarRepasseFormData } from '@/shared/schemas/finance.schema';

const statusOptions: SelectOption[] = [
  { value: '', label: 'Todos os status' },
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
      setSuccess('Repasse processado com sucesso!');
      setTimeout(() => setSuccess(null), 3000);
      loadData();
    }
    setActionLoading(false);
  }

  const totalPages = meta ? Math.ceil(meta.total / 15) : 1;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Repasses"
        description="Gestão de repasses aos prestadores"
        action={
          <Button variant="outline" size="sm" onClick={loadData} leftIcon={<RefreshCw size={14} />}>
            Actualizar
          </Button>
        }
      />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-700 font-medium">
          {success}
        </div>
      )}

      {/* Stats */}
      {resumo && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-amber-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-semibold uppercase">Pendentes</p>
                <p className="text-lg font-extrabold text-amber-600">{resumo.quantidade_repasses_pendentes}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-amber-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                <DollarSign size={18} />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-semibold uppercase">Valor Pendente</p>
                <p className="text-lg font-extrabold text-amber-600">{formatCurrency(resumo.valor_repasses_pendentes)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-emerald-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <DollarSign size={18} />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-semibold uppercase">Comissões Totais</p>
                <p className="text-lg font-extrabold text-emerald-600">{formatCurrency(resumo.comissoes_totais)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="w-56">
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Loading */}
      {loading && repasses.length === 0 && (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100/80 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-2 border-[#42b883] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 mt-4 font-medium">A carregar repasses...</p>
        </div>
      )}

      {/* Empty */}
      {!loading && repasses.length === 0 && (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100/80 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mb-4">
            <ArrowLeftRight size={28} />
          </div>
          <h3 className="text-base font-bold text-gray-900">Sem repasses</h3>
          <p className="text-xs text-gray-500 mt-1.5 max-w-sm font-medium">
            {statusFilter
              ? 'Nenhum repasse encontrado com o filtro seleccionado.'
              : 'Ainda não existem repasses registados no sistema.'}
          </p>
        </div>
      )}

      {/* List */}
      {!loading && repasses.length > 0 && (
        <>
          <p className="text-[11px] text-gray-500 font-semibold">
            {meta?.total || repasses.length} repasse{meta?.total !== 1 && repasses.length !== 1 ? 's' : ''}
          </p>

          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider px-4 py-3">ID</th>
                    <th className="text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Valor</th>
                    <th className="text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
                    <th className="text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Referência</th>
                    <th className="text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider px-4 py-3">IBAN</th>
                    <th className="text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Data</th>
                    <th className="text-right text-[10px] font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Acção</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {repasses.map((rep) => (
                    <tr key={rep.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="text-[11px] text-gray-500 font-mono">{rep.id.slice(0, 8)}...</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[12px] text-gray-900 font-bold">
                          {formatCurrency(Number(rep.valor_repasse))}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={rep.status === 'pago' ? 'success' : rep.status === 'pendente' ? 'warning' : 'danger'}
                        >
                          {rep.status === 'pago' ? 'Pago' : rep.status === 'pendente' ? 'Pendente' : 'Falhado'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[11px] text-gray-600 font-medium">{rep.referencia_repasse || '—'}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[11px] text-gray-600 font-medium">{rep.iban_destino || '—'}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[11px] text-gray-500 font-medium">
                          {new Date(rep.criado_em).toLocaleDateString('pt-AO')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {rep.status === 'pendente' && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              setSelectedRepasse(rep);
                              setShowProcessarModal(true);
                            }}
                            leftIcon={<CheckCircle size={14} />}
                          >
                            Processar
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-[11px] text-gray-500 font-medium">
                Página {currentPage} de {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                  Anterior
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal: Processar Repasse */}
      <Modal
        isOpen={showProcessarModal}
        onClose={() => {
          setShowProcessarModal(false);
          setSelectedRepasse(null);
          processarForm.reset();
        }}
        title="Processar Repasse"
        size="sm"
        footer={
          <>
            <Button
              variant="outline"
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
              onClick={processarForm.handleSubmit(handleProcessar)}
              isLoading={actionLoading}
              leftIcon={<CheckCircle size={14} />}
            >
              Processar
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-[10px] text-gray-500 font-semibold uppercase mb-1">Valor do Repasse</p>
            <p className="text-lg font-extrabold text-[#42b883]">
              {selectedRepasse ? formatCurrency(Number(selectedRepasse.valor_repasse)) : '—'}
            </p>
          </div>
          <Input
            label="Referência do Repasse"
            placeholder="Ex: REP-2026-001"
            error={processarForm.formState.errors.referencia_repasse?.message}
            {...processarForm.register('referencia_repasse')}
          />
          <Input
            label="IBAN Destino (opcional)"
            placeholder="AO06 0040 0000 ..."
            error={processarForm.formState.errors.iban_destino?.message}
            {...processarForm.register('iban_destino')}
          />
        </div>
      </Modal>
    </div>
  );
}
