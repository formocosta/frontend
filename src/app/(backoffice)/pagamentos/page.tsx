'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreditCard, CheckCircle, Download, Search, RefreshCw } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/common/form/Button';
import { Input } from '@/components/common/form/Input';
import { Badge } from '@/components/common/ui/Badge';
import { Modal } from '@/components/common/ui/Modal';
import { usePagamentos } from '@/hooks/finance/finance.hooks';
import { confirmarPagamentoSchema, ConfirmarPagamentoFormData } from '@/shared/schemas/finance.schema';

export default function PagamentosPage() {
  const { loading, error, confirmarPagamento, downloadComprovativo } = usePagamentos();
  const [showConfirmarModal, setShowConfirmarModal] = useState(false);
  const [selectedSolicitacaoId, setSelectedSolicitacaoId] = useState('');
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
      setSuccess('Pagamento confirmado com sucesso!');
      setTimeout(() => setSuccess(null), 3000);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pagamentos"
        description="Confirmar pagamentos e descarregar comprovativos"
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

      {/* Confirm payment section */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4">
          <CheckCircle size={16} />
          Confirmar Pagamento
        </h3>
        <p className="text-[12px] text-gray-500 font-medium mb-4">
          Insira o ID da solicitação para confirmar o pagamento associado.
        </p>
        <div className="flex items-end gap-3">
          <div className="flex-1 max-w-md">
            <Input
              label="ID da Solicitação"
              placeholder="UUID da solicitação"
              value={selectedSolicitacaoId}
              onChange={(e) => setSelectedSolicitacaoId(e.target.value)}
            />
          </div>
          <Button
            variant="primary"
            onClick={() => {
              if (selectedSolicitacaoId) setShowConfirmarModal(true);
            }}
            disabled={!selectedSolicitacaoId}
            leftIcon={<CheckCircle size={14} />}
          >
            Confirmar
          </Button>
        </div>
      </div>

      {/* Info card */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
        <h3 className="text-sm font-bold text-blue-900 mb-2">Como funciona?</h3>
        <ul className="space-y-2 text-[12px] text-blue-700 font-medium">
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">1.</span>
            O cliente submete uma solicitação de serviço.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">2.</span>
            Após a conclusão do serviço, o pagamento fica pendente de confirmação.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">3.</span>
            O operador confirma o pagamento inserindo a referência externa (opcional).
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">4.</span>
            Após confirmação, o repasse ao prestador é criado automaticamente.
          </li>
        </ul>
      </div>

      {/* Modal: Confirmar Pagamento */}
      <Modal
        isOpen={showConfirmarModal}
        onClose={() => {
          setShowConfirmarModal(false);
          setSelectedSolicitacaoId('');
          confirmarForm.reset();
        }}
        title="Confirmar Pagamento"
        size="sm"
        footer={
          <>
            <Button
              variant="outline"
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
              onClick={confirmarForm.handleSubmit(handleConfirmar)}
              isLoading={loading}
              leftIcon={<CheckCircle size={14} />}
            >
              Confirmar Pagamento
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Confirmar pagamento para a solicitação:
          </p>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-[11px] text-gray-500 font-medium">ID da Solicitação</p>
            <p className="text-[12px] text-gray-900 font-bold font-mono break-all">{selectedSolicitacaoId}</p>
          </div>
          <Input
            label="Referência Externa (opcional)"
            placeholder="Ex: REF-123456"
            error={confirmarForm.formState.errors.referencia_externa?.message}
            {...confirmarForm.register('referencia_externa')}
          />
        </div>
      </Modal>
    </div>
  );
}
