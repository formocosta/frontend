'use client';

import React, { useState } from 'react';
import { FileText, CheckCircle, XCircle, Download } from 'lucide-react';
import { Documento } from '@/shared/types/backoffice/kyc.types';
import { Badge } from '@/components/common/ui/Badge';
import { Button } from '@/components/common/form/Button';
import { Modal } from '@/components/common/ui/Modal';

interface DocumentoCardProps {
  documento: Documento;
  onAprovar: (id: string) => Promise<boolean>;
  onRejeitar: (id: string, motivo: string) => Promise<boolean>;
  onDownload: (id: string) => Promise<boolean>;
}

const statusConfig: Record<string, { label: string; variant: 'success' | 'danger' | 'warning' }> = {
  pendente: { label: 'Pendente', variant: 'warning' },
  aprovado: { label: 'Aprovado', variant: 'success' },
  rejeitado: { label: 'Rejeitado', variant: 'danger' },
};

export function DocumentoCard({ documento, onAprovar, onRejeitar, onDownload }: DocumentoCardProps) {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectMotivo, setRejectMotivo] = useState('');
  const [loading, setLoading] = useState<'aprovar' | 'rejeitar' | 'download' | null>(null);

  const status = statusConfig[documento.status] || statusConfig.pendente;

  async function handleAprovar() {
    setLoading('aprovar');
    await onAprovar(documento.id);
    setLoading(null);
  }

  async function handleRejeitar() {
    if (!rejectMotivo.trim()) return;
    setLoading('rejeitar');
    const success = await onRejeitar(documento.id, rejectMotivo);
    if (success) {
      setShowRejectModal(false);
      setRejectMotivo('');
    }
    setLoading(null);
  }

  async function handleDownload() {
    setLoading('download');
    await onDownload(documento.id);
    setLoading(null);
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">
              <FileText size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">
                {documento.tipo_documento_id || 'Documento'}
              </p>
              <p className="text-[11px] text-gray-500 font-medium">
                ID: {documento.id.slice(0, 8)}...
              </p>
            </div>
          </div>

          <Badge variant={status.variant}>{status.label}</Badge>
        </div>

        {documento.motivo_rejeicao && (
          <div className="mt-3 p-2.5 bg-red-50 rounded-lg border border-red-100">
            <p className="text-[11px] text-red-700 font-medium">
              <span className="font-bold">Motivo da rejeição:</span> {documento.motivo_rejeicao}
            </p>
          </div>
        )}

        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            isLoading={loading === 'download'}
            leftIcon={<Download size={14} />}
          >
            Visualizar / Baixar
          </Button>

          {documento.status === 'pendente' && (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={handleAprovar}
                isLoading={loading === 'aprovar'}
                leftIcon={<CheckCircle size={14} />}
              >
                Aprovar
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowRejectModal(true)}
                leftIcon={<XCircle size={14} />}
              >
                Rejeitar
              </Button>
            </>
          )}
        </div>
      </div>

      <Modal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setRejectMotivo('');
        }}
        title="Rejeitar Documento"
        size="sm"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectModal(false);
                setRejectMotivo('');
              }}
              disabled={loading === 'rejeitar'}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={handleRejeitar}
              isLoading={loading === 'rejeitar'}
              disabled={!rejectMotivo.trim()}
            >
              Rejeitar
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Indique o motivo da rejeição deste documento:
          </p>
          <textarea
            value={rejectMotivo}
            onChange={(e) => setRejectMotivo(e.target.value)}
            placeholder="Ex: Documento ilegível, documento expirado..."
            className="w-full rounded-sm border border-slate-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 bg-slate-50 focus:bg-white text-sm px-3 py-2.5 resize-none text-slate-800 placeholder:text-slate-400 outline-none"
            rows={3}
          />
        </div>
      </Modal>
    </>
  );
}
