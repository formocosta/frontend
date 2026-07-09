'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, Download, FileText, Info } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/common/form/Button';
import { Input } from '@/components/common/form/Input';
import { Modal } from '@/components/common/ui/Modal';
import { usePagamentos } from '@/hooks/finance/finance.hooks';
import { confirmarPagamentoSchema, ConfirmarPagamentoFormData } from '@/shared/schemas/finance.schema';

export default function PagamentosPage() {
  const { loading, error, confirmarPagamento, downloadComprovativo } = usePagamentos();
  const [showConfirmarModal, setShowConfirmarModal] = useState(false);
  const [selectedSolicitacaoId, setSelectedSolicitacaoId] = useState('');
  const [downloadPagamentoId, setDownloadPagamentoId] = useState('');
  const [success, setSuccess] = useState<string | null>(null);

  const confirmarForm = useForm<ConfirmarPagamentoFormData>({
    resolver: zodResolver(confirmarPagamentoSchema),
  });

  async function handleConfirmar(data: ConfirmarPagamentoFormData) {
    const successResult = await confirmarPagamento(selectedSolicitacaoId, data.referencia_externa);
    if (successResult) {
      setShowConfirmarModal(false);
      setSelectedSolicitacaoId('');
      confirmarForm.reset();
      setSuccess('Pagamento confirmado com sucesso! O repasse foi gerado automaticamente.');
      setTimeout(() => setSuccess(null), 5000);
    }
  }

  async function handleDownload() {
    if (!downloadPagamentoId) return;
    const successResult = await downloadComprovativo(downloadPagamentoId);
    if (successResult) {
      setSuccess('Comprovativo descarregado com sucesso!');
      setTimeout(() => setSuccess(null), 3000);
      setDownloadPagamentoId('');
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Gestão de Pagamentos"
        description="Confirme pagamentos de solicitações e descarregue comprovativos emitidos."
      />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-sm p-4 text-[13px] text-red-700 font-bold shadow-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-sm p-4 text-[13px] text-emerald-700 font-bold shadow-sm">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Confirm payment section */}
        <div className="bg-white rounded-sm border border-gray-100 p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-all hover:border-gray-200 group">
          <div className="w-12 h-12 rounded-sm bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <CheckCircle size={24} strokeWidth={2.5} />
          </div>
          <h3 className="text-[16px] font-black text-gray-900 tracking-tight mb-2">
            Confirmar Pagamento
          </h3>
          <p className="text-[13px] text-gray-500 font-medium mb-6 leading-relaxed">
            Insira o identificador único (ID) da solicitação de serviço para confirmar manualmente a receção do pagamento do cliente.
          </p>
          <div className="flex flex-col sm:flex-row items-end gap-3">
            <div className="flex-1 w-full">
              <Input
                label="ID da Solicitação"
                placeholder="Ex: 550e8400-e29b-41d4-a716-446655440000"
                value={selectedSolicitacaoId}
                onChange={(e) => setSelectedSolicitacaoId(e.target.value)}
                className="rounded-sm font-mono text-[13px]"
              />
            </div>
            <Button
              variant="primary"
              className="rounded-sm font-bold shadow-sm w-full sm:w-auto"
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
        <div className="bg-white rounded-sm border border-gray-100 p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-all hover:border-gray-200 group">
          <div className="w-12 h-12 rounded-sm bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <FileText size={24} strokeWidth={2.5} />
          </div>
          <h3 className="text-[16px] font-black text-gray-900 tracking-tight mb-2">
            Descarregar Comprovativo
          </h3>
          <p className="text-[13px] text-gray-500 font-medium mb-6 leading-relaxed">
            Necessita da segunda via de um comprovativo? Insira o identificador (ID) do pagamento para descarregar o PDF original.
          </p>
          <div className="flex flex-col sm:flex-row items-end gap-3">
            <div className="flex-1 w-full">
              <Input
                label="ID do Pagamento"
                placeholder="Ex: pay_abc123"
                value={downloadPagamentoId}
                onChange={(e) => setDownloadPagamentoId(e.target.value)}
                className="rounded-sm font-mono text-[13px]"
              />
            </div>
            <Button
              variant="outline"
              className="rounded-sm font-bold shadow-sm w-full sm:w-auto bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              onClick={handleDownload}
              disabled={!downloadPagamentoId || loading}
              isLoading={loading && !!downloadPagamentoId}
              leftIcon={<Download size={14} strokeWidth={2.5} />}
            >
              Descarregar
            </Button>
          </div>
        </div>
      </div>

      {/* Info card */}
      <div className="bg-gray-50/50 border border-gray-100 rounded-sm p-6 shadow-inner">
        <h3 className="text-[14px] font-black text-gray-900 mb-4 tracking-tight flex items-center gap-2">
           <Info size={16} className="text-gray-400" />
           Como funciona o fluxo de pagamentos?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           <div className="bg-white p-4 rounded-sm border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 text-gray-50 opacity-50 font-black text-7xl select-none">1</div>
              <p className="text-[12px] font-bold text-gray-700 relative z-10">O cliente submete uma solicitação de serviço na app.</p>
           </div>
           <div className="bg-white p-4 rounded-sm border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 text-gray-50 opacity-50 font-black text-7xl select-none">2</div>
              <p className="text-[12px] font-bold text-gray-700 relative z-10">Após conclusão, o pagamento fica pendente no sistema.</p>
           </div>
           <div className="bg-white p-4 rounded-sm border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 text-emerald-50 opacity-50 font-black text-7xl select-none">3</div>
              <p className="text-[12px] font-bold text-emerald-700 relative z-10">O operador confirma o pagamento manualmente neste ecrã.</p>
           </div>
           <div className="bg-white p-4 rounded-sm border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 text-blue-50 opacity-50 font-black text-7xl select-none">4</div>
              <p className="text-[12px] font-bold text-blue-700 relative z-10">O repasse para o prestador é gerado de forma automática.</p>
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
              className="rounded-sm font-bold"
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
              className="rounded-sm font-bold bg-[#42b883] hover:bg-[#3aa374]"
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
          <div className="bg-amber-50/50 border border-amber-100 rounded-sm p-4 text-center">
            <p className="text-[11px] text-amber-600 font-bold uppercase tracking-widest mb-1">Atenção</p>
            <p className="text-[12px] text-amber-800 font-medium">Esta ação confirmará que o valor do serviço foi recebido e gerará a comissão do prestador.</p>
          </div>

          <div className="bg-gray-50 rounded-sm p-3 border border-gray-100 flex flex-col items-center">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">ID da Solicitação Alvo</p>
            <p className="text-[12px] text-gray-900 font-black font-mono tracking-tight">{selectedSolicitacaoId}</p>
          </div>

          <Input
            label="Referência Externa (Opcional)"
            placeholder="Ex: REF-123456"
            error={confirmarForm.formState.errors.referencia_externa?.message}
            {...confirmarForm.register('referencia_externa')}
            className="rounded-sm"
          />
        </div>
      </Modal>
    </div>
  );
}
