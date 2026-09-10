'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CheckCircle,
  Download,
  FileText,
  Info,
  DollarSign,
  CreditCard,
  Clock,
  CheckCircle2,
  Search,
  Filter,
  RefreshCw,
  Copy,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  User,
  ShieldCheck
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/common/form/Button';
import { Input } from '@/components/common/form/Input';
import { Modal } from '@/components/common/ui/Modal';
import { usePagamentos } from '@/hooks/finance/finance.hooks';
import { confirmarPagamentoSchema, ConfirmarPagamentoFormData } from '@/shared/schemas/finance.schema';
import { Pagamento } from '@/shared/types/backoffice/finance.types';

export default function PagamentosPage() {
  const {
    pagamentos,
    stats,
    meta,
    loading,
    error,
    fetchPagamentos,
    confirmarPagamento,
    downloadComprovativo
  } = usePagamentos();

  const [showConfirmarModal, setShowConfirmarModal] = useState(false);
  const [selectedSolicitacaoId, setSelectedSolicitacaoId] = useState('');
  const [downloadPagamentoId, setDownloadPagamentoId] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [metodoFilter, setMetodoFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const confirmarForm = useForm<ConfirmarPagamentoFormData>({
    resolver: zodResolver(confirmarPagamentoSchema),
  });

  useEffect(() => {
    fetchPagamentos({
      search: searchTerm,
      status: statusFilter,
      metodo: metodoFilter,
      page: currentPage,
    });
  }, [fetchPagamentos, searchTerm, statusFilter, metodoFilter, currentPage]);

  async function handleConfirmar(data: ConfirmarPagamentoFormData) {
    const successResult = await confirmarPagamento(selectedSolicitacaoId, data.referencia_externa);
    if (successResult) {
      setShowConfirmarModal(false);
      setSelectedSolicitacaoId('');
      confirmarForm.reset();
      setSuccess('Pagamento confirmado com sucesso! O repasse foi gerado automaticamente.');
      setTimeout(() => setSuccess(null), 5000);
      fetchPagamentos({
        search: searchTerm,
        status: statusFilter,
        metodo: metodoFilter,
        page: currentPage,
      });
    }
  }

  async function handleDirectDownload(id: string) {
    setDownloadingId(id);
    const res = await downloadComprovativo(id);
    if (res) {
      setSuccess('Comprovativo descarregado com sucesso!');
      setTimeout(() => setSuccess(null), 3000);
    }
    setDownloadingId(null);
  }

  async function handleDownloadFromInput() {
    if (!downloadPagamentoId) return;
    setDownloadingId(downloadPagamentoId);
    const successResult = await downloadComprovativo(downloadPagamentoId);
    if (successResult) {
      setSuccess('Comprovativo descarregado com sucesso!');
      setTimeout(() => setSuccess(null), 3000);
      setDownloadPagamentoId('');
    }
    setDownloadingId(null);
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
      case 'confirmado':
      case 'pago':
      case 'concluido':
        return (
          <span className="px-2.5 py-1 text-[11px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 rounded-md border border-emerald-200 inline-flex items-center gap-1">
            <CheckCircle2 size={12} />
            Confirmado
          </span>
        );
      case 'pendente':
        return (
          <span className="px-2.5 py-1 text-[11px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 rounded-md border border-amber-200 inline-flex items-center gap-1">
            <Clock size={12} />
            Pendente
          </span>
        );
      case 'recusado':
      case 'cancelado':
        return (
          <span className="px-2.5 py-1 text-[11px] font-black uppercase tracking-wider bg-red-100 text-red-800 rounded-md border border-red-200 inline-flex items-center gap-1">
            Cancelado
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Gestão Financeira & Pagamentos"
        description="Acompanhe transações em tempo real, confirme pagamentos e emita comprovativos da plataforma."
        action={
          <Button
            variant="outline"
            onClick={() => fetchPagamentos({ search: searchTerm, status: statusFilter, metodo: metodoFilter, page: currentPage })}
            isLoading={loading}
            className="border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold rounded-md"
            leftIcon={<RefreshCw size={14} className={loading ? 'animate-spin' : ''} />}
          >
            Atualizar Dados
          </Button>
        }
      />

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-md border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-gray-400">Total Transacionado</span>
            <div className="p-2 rounded-md bg-emerald-50 text-[#42b883]">
              <DollarSign size={18} />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            {formatCurrency(stats?.total_transacionado || 0)}
          </p>
          <p className="text-[11px] text-gray-400 font-semibold">Volume acumulado de pagamentos confirmados</p>
        </div>

        <div className="bg-white p-5 rounded-md border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-gray-400">Total Registado</span>
            <div className="p-2 rounded-md bg-blue-50 text-blue-600">
              <CreditCard size={18} />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            {stats?.total_pagamentos || pagamentos.length}
          </p>
          <p className="text-[11px] text-gray-400 font-semibold">Total de transações emitidas na plataforma</p>
        </div>

        <div className="bg-white p-5 rounded-md border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-gray-400">Pagamentos Confirmados</span>
            <div className="p-2 rounded-md bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            {stats?.total_confirmados || 0}
          </p>
          <p className="text-[11px] text-emerald-600 font-semibold">Transações liquidadas com sucesso</p>
        </div>

        <div className="bg-white p-5 rounded-md border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-gray-400">Pagamentos Pendentes</span>
            <div className="p-2 rounded-md bg-amber-50 text-amber-600">
              <Clock size={18} />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            {stats?.total_pendentes || 0}
          </p>
          <p className="text-[11px] text-amber-600 font-semibold">Aguardam validação ou confirmação manual</p>
        </div>
      </div>

      {/* Direct Action Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Confirm payment section */}
        <div className="bg-white rounded-md border border-gray-100 p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-all hover:border-gray-200 group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-sm font-black text-gray-900 tracking-tight">Confirmar Pagamento de Solicitação</h3>
              <p className="text-xs text-gray-500 font-medium">Validação rápida por ID da solicitação de serviço</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 pt-2">
            <div className="flex-1 w-full">
              <Input
                label="ID da Solicitação"
                placeholder="Ex: 550e8400-e29b-41d4-a716-446655440000"
                value={selectedSolicitacaoId}
                onChange={(e) => setSelectedSolicitacaoId(e.target.value)}
                className="rounded-md font-mono text-[13px]"
              />
            </div>
            <Button
              variant="primary"
              className="rounded-md font-bold shadow-sm w-full sm:w-auto h-[42px] bg-[#42b883] hover:bg-[#3aa374]"
              onClick={() => {
                if (selectedSolicitacaoId) setShowConfirmarModal(true);
              }}
              disabled={!selectedSolicitacaoId}
              leftIcon={<CheckCircle size={14} strokeWidth={2.5} />}
            >
              Processar
            </Button>
          </div>
        </div>

        {/* Download Receipt section */}
        <div className="bg-white rounded-md border border-gray-100 p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-all hover:border-gray-200 group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <FileText size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-sm font-black text-gray-900 tracking-tight">Obter 2ª Via do Comprovativo</h3>
              <p className="text-xs text-gray-500 font-medium">Download direto em PDF fornecendo o ID do pagamento</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 pt-2">
            <div className="flex-1 w-full">
              <Input
                label="ID do Pagamento"
                placeholder="Ex: pay_abc123"
                value={downloadPagamentoId}
                onChange={(e) => setDownloadPagamentoId(e.target.value)}
                className="rounded-md font-mono text-[13px]"
              />
            </div>
            <Button
              variant="outline"
              className="rounded-md font-bold shadow-sm w-full sm:w-auto h-[42px] bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              onClick={handleDownloadFromInput}
              disabled={!downloadPagamentoId || downloadingId === downloadPagamentoId}
              isLoading={downloadingId === downloadPagamentoId}
              leftIcon={<Download size={14} strokeWidth={2.5} />}
            >
              Descarregar
            </Button>
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white border border-gray-100 p-4 rounded-md shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Pesquisar por ID, cliente, e-mail ou referência..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs border border-gray-200 rounded-md outline-none focus:ring-1 focus:ring-[#42b883] focus:border-[#42b883] bg-gray-50/50"
            />
          </div>

          {/* Status & Method Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5">
              <Filter size={14} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-xs font-bold text-gray-700 outline-none cursor-pointer"
              >
                <option value="">Todos os Estados</option>
                <option value="confirmado">Confirmado</option>
                <option value="pendente">Pendente</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5">
              <CreditCard size={14} className="text-gray-400" />
              <select
                value={metodoFilter}
                onChange={(e) => setMetodoFilter(e.target.value)}
                className="bg-transparent text-xs font-bold text-gray-700 outline-none cursor-pointer"
              >
                <option value="">Todos os Métodos</option>
                <option value="multicaixa_express">Multicaixa Express</option>
                <option value="transferencia_bancaria">Transferência Bancária</option>
                <option value="tpa">TPA</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table / Mobile Cards View */}
      {loading && pagamentos.length === 0 ? (
        <div className="bg-white rounded-md p-12 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-2 border-[#42b883] border-t-transparent rounded-md animate-spin" />
          <p className="text-sm text-gray-500 mt-4 font-medium">A carregar registos de pagamentos...</p>
        </div>
      ) : pagamentos.length === 0 ? (
        <div className="bg-white rounded-md p-12 text-center border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-3">
          <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
            <CreditCard size={24} />
          </div>
          <h3 className="text-base font-bold text-gray-900">Nenhum pagamento encontrado</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto font-medium">
            Não foram encontrados registos de pagamentos correspondentes aos critérios de pesquisa selecionados.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-md border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-black uppercase tracking-wider text-gray-400">
                  <th className="py-3.5 px-4">ID Transação</th>
                  <th className="py-3.5 px-4">Cliente</th>
                  <th className="py-3.5 px-4">Solicitação / Serviço</th>
                  <th className="py-3.5 px-4">Valor Total</th>
                  <th className="py-3.5 px-4">Método / Ref</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-4">Data</th>
                  <th className="py-3.5 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {pagamentos.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                      <span className="bg-gray-100 px-2 py-1 rounded text-[11px] border border-gray-200">
                        #{item.id.substring(0, 8)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 text-[#42b883] font-black flex items-center justify-center text-xs shrink-0">
                          {item.cliente?.nome?.charAt(0) || 'C'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 truncate">{item.cliente?.nome || 'Cliente Desconhecido'}</p>
                          <p className="text-[11px] text-gray-400 font-medium truncate">{item.cliente?.email || ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-gray-700">
                      <p className="truncate max-w-[200px]">{item.solicitacao?.titulo || `Solicitação #${item.solicitacao_id?.substring(0, 8)}`}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-black text-gray-900">{formatCurrency(item.valor_total)}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <span className="capitalize font-semibold text-gray-800 text-[11px]">
                          {item.metodo_pagamento?.replace('_', ' ')}
                        </span>
                        {item.referencia_externa && (
                          <p className="text-[10px] font-mono text-gray-400">Ref: {item.referencia_externa}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">{getStatusBadge(item.status)}</td>
                    <td className="py-3.5 px-4 text-gray-500 font-medium text-[11px]">
                      {item.criado_em ? new Date(item.criado_em).toLocaleDateString('pt-AO') : '-'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {item.status?.toLowerCase() === 'pendente' && (
                          <button
                            onClick={() => {
                              setSelectedSolicitacaoId(item.solicitacao_id);
                              setShowConfirmarModal(true);
                            }}
                            className="px-2.5 py-1 text-[11px] font-bold text-white bg-[#42b883] hover:bg-[#3aa374] rounded transition-colors flex items-center gap-1"
                          >
                            <CheckCircle size={12} />
                            Confirmar
                          </button>
                        )}
                        <button
                          onClick={() => handleDirectDownload(item.id)}
                          disabled={downloadingId === item.id}
                          className="px-2.5 py-1 text-[11px] font-bold text-gray-700 hover:text-blue-600 bg-gray-100 hover:bg-gray-200 rounded transition-colors flex items-center gap-1 disabled:opacity-50"
                        >
                          <Download size={12} />
                          PDF
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="block lg:hidden divide-y divide-gray-100">
            {pagamentos.map((item) => (
              <div key={item.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                    #{item.id.substring(0, 8)}
                  </span>
                  {getStatusBadge(item.status)}
                </div>

                <div className="flex items-center gap-3 bg-gray-50/80 p-3 rounded-md border border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#42b883] font-black flex items-center justify-center text-xs shrink-0">
                    {item.cliente?.nome?.charAt(0) || 'C'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">{item.cliente?.nome || 'Cliente'}</p>
                    <p className="text-[11px] text-gray-500 font-medium truncate">{item.cliente?.email || item.solicitacao?.titulo}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-50">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Valor Transação</span>
                    <span className="font-black text-gray-900 text-sm">{formatCurrency(item.valor_total)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Método</span>
                    <span className="font-bold text-gray-700 capitalize text-xs">{item.metodo_pagamento?.replace('_', ' ')}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                  {item.status?.toLowerCase() === 'pendente' && (
                    <button
                      onClick={() => {
                        setSelectedSolicitacaoId(item.solicitacao_id);
                        setShowConfirmarModal(true);
                      }}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-[#42b883] hover:bg-[#3aa374] rounded-md transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle size={14} />
                      Confirmar Pagamento
                    </button>
                  )}
                  <button
                    onClick={() => handleDirectDownload(item.id)}
                    disabled={downloadingId === item.id}
                    className="px-3 py-1.5 text-xs font-bold text-gray-700 hover:text-blue-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Download size={14} />
                    Comprovativo
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Footer */}
          {meta && meta.last_page > 1 && (
            <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-gray-500 font-medium">
                A mostrar página <strong className="text-gray-900">{meta.current_page}</strong> de{' '}
                <strong className="text-gray-900">{meta.last_page}</strong> ({meta.total} registos)
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
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, meta.last_page))}
                  disabled={currentPage === meta.last_page || loading}
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

      {/* Info Card */}
      <div className="bg-gray-50/50 border border-gray-100 rounded-md p-4 sm:p-6 shadow-inner">
        <h3 className="text-[14px] font-black text-gray-900 mb-4 tracking-tight flex items-center gap-2">
          <Info size={16} className="text-gray-400" />
          Como funciona o fluxo de pagamentos e liquidação?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-md border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 text-gray-50 opacity-50 font-black text-7xl select-none">1</div>
            <p className="text-[12px] font-bold text-gray-700 relative z-10">O cliente submete uma solicitação de serviço na aplicação.</p>
          </div>
          <div className="bg-white p-4 rounded-md border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 text-gray-50 opacity-50 font-black text-7xl select-none">2</div>
            <p className="text-[12px] font-bold text-gray-700 relative z-10">Após conclusão do serviço, a transação fica pendente no sistema.</p>
          </div>
          <div className="bg-white p-4 rounded-md border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 text-emerald-50 opacity-50 font-black text-7xl select-none">3</div>
            <p className="text-[12px] font-bold text-emerald-700 relative z-10">O operador confirma o pagamento no painel ou via gateway.</p>
          </div>
          <div className="bg-white p-4 rounded-md border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 text-blue-50 opacity-50 font-black text-7xl select-none">4</div>
            <p className="text-[12px] font-bold text-blue-700 relative z-10">O repasse para o prestador é gerado e fica pronto para liquidação.</p>
          </div>
        </div>
      </div>

      {/* Modal: Confirmar Pagamento */}
      <Modal
        isOpen={showConfirmarModal}
        onClose={() => {
          setShowConfirmarModal(false);
          setSelectedSolicitacaoId('');
          confirmarForm.reset();
        }}
        title="Confirmar Pagamento de Serviço"
        size="sm"
        footer={
          <>
            <Button
              variant="outline"
              className="rounded-md font-bold text-xs"
              onClick={() => {
                setShowConfirmarModal(false);
                setSelectedSolicitacaoId('');
                confirmarForm.reset();
              }}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              className="rounded-md font-bold text-xs bg-[#42b883] hover:bg-[#3aa374]"
              onClick={confirmarForm.handleSubmit(handleConfirmar)}
              isLoading={loading}
              leftIcon={<CheckCircle size={14} strokeWidth={2.5} />}
            >
              Confirmar Receção
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <div className="bg-amber-50/50 border border-amber-100 rounded-md p-4 text-center">
            <p className="text-[11px] text-amber-600 font-bold uppercase tracking-widest mb-1">Atenção</p>
            <p className="text-[12px] text-amber-800 font-medium">Esta ação confirmará que o valor do serviço foi recebido e gerará a comissão do prestador.</p>
          </div>

          <div className="bg-gray-50 rounded-md p-3 border border-gray-100 flex flex-col items-center">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">ID da Solicitação Alvo</p>
            <p className="text-[12px] text-gray-900 font-black font-mono tracking-tight break-all">{selectedSolicitacaoId}</p>
          </div>

          <Input
            label="Referência Externa (Opcional)"
            placeholder="Ex: REF-123456"
            error={confirmarForm.formState.errors.referencia_externa?.message}
            {...confirmarForm.register('referencia_externa')}
            className="rounded-md"
          />
        </div>
      </Modal>
    </div>
  );
}
