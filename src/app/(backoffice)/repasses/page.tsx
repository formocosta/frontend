'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeftRight,
  RefreshCw,
  CheckCircle,
  Clock,
  DollarSign,
  Wallet,
  User,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/common/form/Button';
import { Input } from '@/components/common/form/Input';
import { Badge } from '@/components/common/ui/Badge';
import { Modal } from '@/components/common/ui/Modal';
import { useRepasses, useFinanceiro } from '@/hooks/finance/finance.hooks';
import { Repasse } from '@/shared/types/backoffice/finance.types';
import { processarRepasseSchema, ProcessarRepasseFormData } from '@/shared/schemas/finance.schema';

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
    const params: { page: number; status?: string; search?: string } = { page: currentPage };
    if (statusFilter) params.status = statusFilter;
    if (search.trim()) params.search = search.trim();
    fetchRepasses(params);
    fetchResumo();
  }, [statusFilter, search, currentPage, fetchRepasses, fetchResumo]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // When modal opens, pre-fill IBAN if available
  useEffect(() => {
    if (selectedRepasse) {
      processarForm.setValue('iban_destino', selectedRepasse.iban_destino || '');
      if (selectedRepasse.referencia_repasse) {
        processarForm.setValue('referencia_repasse', selectedRepasse.referencia_repasse);
      }
    }
  }, [selectedRepasse, processarForm]);

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

  const formatCurrency = (val: number | string) => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    if (isNaN(num)) return '0,00 Kz';
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      maximumFractionDigits: 2,
    }).format(num).replace('AOA', 'Kz');
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pago':
      case 'confirmado':
      case 'concluido':
        return (
          <span className="px-2.5 py-1 text-[11px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 rounded-md border border-emerald-200 inline-flex items-center gap-1">
            <CheckCircle2 size={12} />
            Pago
          </span>
        );
      case 'pendente':
        return (
          <span className="px-2.5 py-1 text-[11px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 rounded-md border border-amber-200 inline-flex items-center gap-1">
            <Clock size={12} />
            Pendente
          </span>
        );
      case 'falhado':
      case 'recusado':
        return (
          <span className="px-2.5 py-1 text-[11px] font-black uppercase tracking-wider bg-red-100 text-red-800 rounded-md border border-red-200 inline-flex items-center gap-1">
            <AlertCircle size={12} />
            Falhado
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-[11px] font-black uppercase tracking-wider bg-gray-100 text-gray-700 rounded-md border border-gray-200">
            {status}
          </span>
        );
    }
  };

  const totalCount = meta && 'total' in meta ? Number(meta.total) : repasses.length;
  const lastPage = meta && 'last_page' in meta ? Number(meta.last_page) : 1;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Gestão de Repasses Financeiros"
        description="Monitorize e processe as transferências bancárias e comissões devidas aos prestadores de serviço."
        action={
          <Button
            variant="outline"
            className="rounded-md font-bold shadow-sm bg-white hover:bg-gray-50 border-gray-200 text-xs"
            onClick={loadData}
            isLoading={loading}
            leftIcon={<RefreshCw size={14} className={loading ? 'animate-spin' : ''} />}
          >
            Actualizar Dados
          </Button>
        }
      />

      {/* Alert Banners */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-[13px] text-red-700 font-bold shadow-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-md p-4 text-[13px] text-emerald-700 font-bold shadow-sm flex items-center gap-2">
          <CheckCircle2 size={16} />
          {success}
        </div>
      )}

      {/* KPI Stats Cards */}
      {resumo && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-md border border-amber-100 p-5 shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-all hover:border-amber-200 group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-md bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                <Clock size={22} strokeWidth={2.5} />
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
                <DollarSign size={22} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 font-black uppercase tracking-widest">Valor Total Pendente</p>
                <p className="text-2xl font-black text-amber-600 tracking-tight">{formatCurrency(resumo.valor_repasses_pendentes)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-md border border-emerald-100 p-5 shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-all hover:border-emerald-200 group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-md bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                <Wallet size={22} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 font-black uppercase tracking-widest">Comissões Globais da Plataforma</p>
                <p className="text-2xl font-black text-emerald-600 tracking-tight">{formatCurrency(resumo.comissoes_totais)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-gray-100 p-4 rounded-md shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Pesquisar por prestador, IBAN, referência ou ID do repasse..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 text-xs border border-gray-200 rounded-md outline-none focus:ring-1 focus:ring-[#42b883] focus:border-[#42b883] bg-gray-50/50"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5">
              <Filter size={14} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-xs font-bold text-gray-700 outline-none cursor-pointer"
              >
                <option value="">Todos os Estados</option>
                <option value="pendente">Pendente</option>
                <option value="pago">Pago / Liquidado</option>
                <option value="falhado">Falhado</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && repasses.length === 0 ? (
        <div className="bg-white rounded-md p-12 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-2 border-[#42b883] border-t-transparent rounded-md animate-spin" />
          <p className="text-sm text-gray-500 mt-4 font-black tracking-tight">A carregar registos de repasses...</p>
        </div>
      ) : repasses.length === 0 ? (
        <div className="bg-white rounded-md p-12 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-14 h-14 rounded-md bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 shadow-inner">
            <ArrowLeftRight size={28} />
          </div>
          <h3 className="text-[15px] font-black text-gray-900 tracking-tight">Zero Repasses Encontrados</h3>
          <p className="text-[12px] text-gray-500 max-w-sm font-semibold">
            {statusFilter || search
              ? 'Não existem repasses que correspondam aos filtros aplicados.'
              : 'O sistema ainda não possui registos de repasses emitidos.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-md border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-black uppercase tracking-wider text-gray-400">
                  <th className="py-3.5 px-4">Prestador Beneficiário</th>
                  <th className="py-3.5 px-4">Valor Repasse</th>
                  <th className="py-3.5 px-4">Destino (IBAN & Ref)</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-4">Data Emissão</th>
                  <th className="py-3.5 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {repasses.map((rep) => (
                  <tr key={rep.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-black flex items-center justify-center text-xs shrink-0">
                          {rep.prestador?.nome?.charAt(0) || 'P'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 truncate">{rep.prestador?.nome || 'Prestador ID: ' + rep.prestador_id.slice(0, 8)}</p>
                          <p className="text-[11px] text-gray-400 font-medium truncate">{rep.prestador?.email || ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-black text-gray-900 text-sm">
                        {formatCurrency(rep.valor_repasse)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <p className="font-mono font-bold text-gray-800 text-[11px]">
                          {rep.iban_destino || 'Sem IBAN registado'}
                        </p>
                        {rep.referencia_repasse && (
                          <p className="text-[10px] text-gray-400 font-semibold">Ref: {rep.referencia_repasse}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">{getStatusBadge(rep.status)}</td>
                    <td className="py-3.5 px-4 text-gray-500 font-medium text-[11px]">
                      {rep.criado_em ? new Date(rep.criado_em).toLocaleDateString('pt-AO') : '-'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {rep.status?.toLowerCase() === 'pendente' ? (
                        <Button
                          variant="primary"
                          className="rounded-md font-bold text-xs bg-[#42b883] hover:bg-[#3aa374] h-8 px-3"
                          onClick={() => {
                            setSelectedRepasse(rep);
                            setShowProcessarModal(true);
                          }}
                          leftIcon={<CheckCircle size={13} strokeWidth={2.5} />}
                        >
                          Pagar Agora
                        </Button>
                      ) : (
                        <span className="text-[11px] text-gray-400 font-bold bg-gray-100 px-2 py-1 rounded">
                          Liquidado
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="block lg:hidden divide-y divide-gray-100">
            {repasses.map((rep) => (
              <div key={rep.id} className="p-4 space-y-3 bg-white">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-black flex items-center justify-center text-xs shrink-0">
                      {rep.prestador?.nome?.charAt(0) || 'P'}
                    </div>
                    <span className="font-bold text-xs text-gray-900 truncate max-w-[150px]">
                      {rep.prestador?.nome || 'Prestador'}
                    </span>
                  </div>
                  {getStatusBadge(rep.status)}
                </div>

                <div className="bg-gray-50/80 p-3 rounded-md border border-gray-100 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Valor a Liquidar:</span>
                    <span className="font-black text-gray-900 text-sm">{formatCurrency(rep.valor_repasse)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">IBAN Destino:</span>
                    <span className="font-mono font-bold text-gray-800 text-[11px] truncate max-w-[180px]">
                      {rep.iban_destino || 'Não definido'}
                    </span>
                  </div>
                  {rep.referencia_repasse && (
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-400 font-bold uppercase">Referência:</span>
                      <span className="font-semibold text-gray-600 text-[11px]">{rep.referencia_repasse}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                  <span className="text-[11px] text-gray-400 font-medium">
                    {rep.criado_em ? new Date(rep.criado_em).toLocaleDateString('pt-AO') : ''}
                  </span>
                  {rep.status?.toLowerCase() === 'pendente' ? (
                    <Button
                      variant="primary"
                      className="rounded-md font-bold text-xs bg-[#42b883] hover:bg-[#3aa374] h-8 px-3"
                      onClick={() => {
                        setSelectedRepasse(rep);
                        setShowProcessarModal(true);
                      }}
                      leftIcon={<CheckCircle size={14} strokeWidth={2.5} />}
                    >
                      Pagar Agora
                    </Button>
                  ) : (
                    <span className="text-[11px] text-gray-400 font-bold bg-gray-100 px-2 py-0.5 rounded">Liquidado</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Footer */}
          {lastPage > 1 && (
            <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-gray-500 font-medium">
                Página <strong className="text-gray-900">{currentPage}</strong> de{' '}
                <strong className="text-gray-900">{lastPage}</strong> ({totalCount} registos)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1 || loading}
                  className="rounded-md font-bold text-xs"
                >
                  <ChevronLeft size={14} />
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, lastPage))}
                  disabled={currentPage === lastPage || loading}
                  className="rounded-md font-bold text-xs"
                >
                  Próxima
                  <ChevronRight size={14} />
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
        title="Liquidar Transferência ao Prestador"
        size="sm"
        footer={
          <>
            <Button
              variant="outline"
              className="rounded-md font-bold text-xs"
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
              className="rounded-md font-bold text-xs bg-[#42b883] hover:bg-[#3aa374]"
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
              {selectedRepasse ? formatCurrency(selectedRepasse.valor_repasse) : '—'}
            </p>
            {selectedRepasse?.prestador?.nome && (
              <p className="text-xs font-bold text-gray-600 mt-1">Beneficiário: {selectedRepasse.prestador.nome}</p>
            )}
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
