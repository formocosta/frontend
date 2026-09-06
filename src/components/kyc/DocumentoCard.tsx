'use client';

import React, { useState } from 'react';
import {
  FileText,
  CheckCircle,
  XCircle,
  Download,
  FileSignature,
  Landmark,
  IdCard,
  Eye,
  CalendarClock,
} from 'lucide-react';
import { Documento } from '@/shared/types/backoffice/kyc.types';
import { Button } from '@/components/common/form/Button';
import { Modal } from '@/components/common/ui/Modal';

interface DocumentoCardProps {
  documento: Documento;
  onAprovar: (id: string) => Promise<boolean>;
  onRejeitar: (id: string, motivo: string) => Promise<boolean>;
  onDownload: (id: string) => Promise<boolean>;
  onVisualizar?: (id: string) => Promise<{ url: string; type: string } | null>;
}

const statusConfig: Record<string, { label: string; variant: 'success' | 'danger' | 'warning'; dot: string; pill: string }> = {
  pendente: { label: 'Pendente', variant: 'warning', dot: 'bg-amber-400', pill: 'bg-amber-50 text-amber-700 border-amber-200' },
  aprovado: { label: 'Aprovado', variant: 'success', dot: 'bg-emerald-500', pill: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  rejeitado: { label: 'Rejeitado', variant: 'danger', dot: 'bg-red-500', pill: 'bg-red-50 text-red-700 border-red-200' },
};

const DOCUMENT_TYPE_META: Record<string, { label: string; icon: React.ElementType; color: string; bg: string; ring: string }> = {
  bi: { label: 'BI / Passaporte', icon: IdCard, color: 'text-blue-600', bg: 'bg-blue-50', ring: 'ring-blue-100' },
  nif: { label: 'NIF', icon: FileSignature, color: 'text-violet-600', bg: 'bg-violet-50', ring: 'ring-violet-100' },
  certificado_registo: { label: 'Certificado de Registo', icon: FileText, color: 'text-teal-600', bg: 'bg-teal-50', ring: 'ring-teal-100' },
  comprovativo_iban: { label: 'Comprovativo de IBAN', icon: Landmark, color: 'text-cyan-600', bg: 'bg-cyan-50', ring: 'ring-cyan-100' },
  outros: { label: 'Outro Documento', icon: FileText, color: 'text-gray-600', bg: 'bg-gray-50', ring: 'ring-gray-100' },
};

function formatFileName(caminho?: string) {
  if (!caminho) return null;
  const base = caminho.split('/').pop() || caminho;
  return base.length > 28 ? `${base.slice(0, 26)}…` : base;
}

export function DocumentoCard({ documento, onAprovar, onRejeitar, onDownload, onVisualizar }: DocumentoCardProps) {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectMotivo, setRejectMotivo] = useState('');
  const [loading, setLoading] = useState<'aprovar' | 'rejeitar' | 'download' | 'visualizar' | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewUrl, setViewUrl] = useState<string | null>(null);
  const [viewType, setViewType] = useState<string>('');

  const status = statusConfig[documento.status] || statusConfig.pendente;
  const tipo = documento.tipo_documento || documento.tipo_documento_id || 'outros';
  const meta = DOCUMENT_TYPE_META[tipo] || DOCUMENT_TYPE_META.outros;
  const TypeIcon = meta.icon;
  const docLabel = meta.label;
  const fileName = formatFileName(documento.caminho_arquivo);

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

  async function handleVisualizar() {
    if (!onVisualizar) return;
    setLoading('visualizar');
    const res = await onVisualizar(documento.id);
    if (res) {
      setViewUrl(res.url);
      setViewType(res.type);
      setShowViewModal(true);
    }
    setLoading(null);
  }

  function handleCloseViewModal() {
    setShowViewModal(false);
    if (viewUrl) {
      window.URL.revokeObjectURL(viewUrl);
      setViewUrl(null);
    }
  }

  return (
    <>
      <div className={`relative bg-white rounded-xl border border-gray-100 p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)] hover:border-gray-200 transition-all duration-200 overflow-hidden group`}>
        {/* Top accent color bar by doc type */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${meta.color} opacity-90`}></div>

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`relative w-12 h-12 rounded-xl ${meta.bg} ${meta.ring} ring-2 flex items-center justify-center shrink-0 ${meta.color}`}>
              <TypeIcon size={22} />
              {documento.status === 'pendente' && (
                <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${status.dot} ring-2 ring-white`}></span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 leading-tight">{docLabel}</p>
              {fileName ? (
                <p className="text-[11px] text-gray-500 font-medium truncate mt-0.5">{fileName}</p>
              ) : (
                <p className="text-[11px] text-gray-400 font-medium mt-0.5">ID: {documento.id.slice(0, 10)}…</p>
              )}
              <div className="mt-1.5 flex items-center gap-3">
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-gray-400">
                  <CalendarClock size={11} />
                  {documento.created_at
                    ? new Date(documento.created_at).toLocaleDateString('pt-AO')
                    : '—'}
                </span>
              </div>
            </div>
          </div>

          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border shrink-0 ${status.pill}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
            {status.label}
          </span>
        </div>

        {documento.motivo_rejeicao && (
          <div className="mt-3 p-2.5 bg-red-50 rounded-lg border border-red-100 flex items-start gap-2">
            <XCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-red-700 font-medium">
              <span className="font-bold">Motivo da rejeição:</span> {documento.motivo_rejeicao}
            </p>
          </div>
        )}

        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-50 flex-wrap">
          {onVisualizar && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleVisualizar}
              isLoading={loading === 'visualizar'}
              leftIcon={<Eye size={14} />}
              className="flex-1 min-w-[86px]"
            >
              Ver
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            isLoading={loading === 'download'}
            leftIcon={<Download size={14} />}
            className="flex-1 min-w-[86px]"
          >
            Baixar
          </Button>

          {documento.status === 'pendente' && (
            <div className="flex items-center gap-2 w-full mt-1">
              <Button
                variant="primary"
                size="sm"
                onClick={handleAprovar}
                isLoading={loading === 'aprovar'}
                leftIcon={<CheckCircle size={14} />}
                className="flex-1"
              >
                Aprovar
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowRejectModal(true)}
                leftIcon={<XCircle size={14} />}
                className="flex-1"
              >
                Rejeitar
              </Button>
            </div>
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

      <Modal
        isOpen={showViewModal}
        onClose={handleCloseViewModal}
        title={`Visualizar Documento: ${docLabel}`}
        size="lg"
      >
        <div className="flex flex-col items-center justify-center min-h-[300px] w-full">
          {viewUrl && viewType.startsWith('image/') && (
            <img src={viewUrl} alt="Visualização do documento" className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-sm" />
          )}
          {viewUrl && viewType.includes('pdf') && (
            <iframe src={viewUrl} className="w-full h-[65vh] border border-gray-100 rounded-lg" title="Documento PDF" />
          )}
          {viewUrl && !viewType.startsWith('image/') && !viewType.includes('pdf') && (
            <div className="text-center p-6 space-y-4">
              <FileText size={48} className="mx-auto text-gray-300" />
              <p className="text-sm text-gray-500">Este tipo de ficheiro ({viewType}) não pode ser pré-visualizado diretamente.</p>
              <Button variant="primary" onClick={handleDownload}>Descarregar Ficheiro</Button>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
