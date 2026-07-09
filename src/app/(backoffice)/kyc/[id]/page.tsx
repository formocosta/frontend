'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  RotateCcw,
  StickyNote,
  Plus,
  Calendar,
  FileText,
  Mail,
  Phone,
  MapPin,
  Building,
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/common/form/Button';
import { Textarea } from '@/components/common/form/Textarea';
import { Input } from '@/components/common/form/Input';
import { Select, SelectOption } from '@/components/common/form/Select';
import { StatusBadge } from '@/components/common/ui/Badge';
import { Modal, ConfirmModal } from '@/components/common/ui/Modal';
import { DocumentoCard } from '@/components/kyc/DocumentoCard';
import { EntrevistaCard } from '@/components/kyc/EntrevistaCard';
import { useCandidaturaDetail } from '@/hooks/kyc/kyc.hooks';
import {
  rejeitarCandidaturaSchema,
  RejeitarCandidaturaFormData,
  notasCandidaturaSchema,
  NotasCandidaturaFormData,
  agendarEntrevistaSchema,
  AgendarEntrevistaFormData,
} from '@/shared/schemas/kyc.schema';

const entrevistaTipoOptions: SelectOption[] = [
  { value: 'video_chamada', label: 'Videochamada' },
  { value: 'presencial', label: 'Presencial' },
];

const tipoLabels: Record<string, string> = {
  singular: 'Pessoa Singular',
  coletivo: 'Pessoa Coletiva',
};

export default function KycDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const {
    candidatura,
    loading,
    error,
    fetchCandidatura,
    aprovar,
    rejeitar,
    resubmeter,
    atualizarNotas,
    aprovarDocumento,
    rejeitarDocumento,
    agendarEntrevista,
    atualizarEntrevista,
    downloadDocumento,
  } = useCandidaturaDetail();

  const [showRejeitarModal, setShowRejeitarModal] = useState(false);
  const [showNotasModal, setShowNotasModal] = useState(false);
  const [showAgendarModal, setShowAgendarModal] = useState(false);
  const [showConfirmAprovar, setShowConfirmAprovar] = useState(false);
  const [showConfirmResubmeter, setShowConfirmResubmeter] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const rejeitarForm = useForm<RejeitarCandidaturaFormData>({
    resolver: zodResolver(rejeitarCandidaturaSchema),
  });

  const notasForm = useForm<NotasCandidaturaFormData>({
    resolver: zodResolver(notasCandidaturaSchema),
    defaultValues: { nota_operador: candidatura?.nota_operador || '' },
  });

  const agendarForm = useForm<AgendarEntrevistaFormData>({
    resolver: zodResolver(agendarEntrevistaSchema),
  });

  useEffect(() => {
    fetchCandidatura(id);
  }, [id, fetchCandidatura]);

  useEffect(() => {
    if (candidatura) {
      notasForm.reset({ nota_operador: candidatura.nota_operador || '' });
    }
  }, [candidatura, notasForm]);

  async function handleAprovar() {
    setActionLoading(true);
    const success = await aprovar(id);
    if (success) setShowConfirmAprovar(false);
    setActionLoading(false);
  }

  async function handleRejeitar(data: RejeitarCandidaturaFormData) {
    setActionLoading(true);
    const success = await rejeitar(id, data);
    if (success) {
      setShowRejeitarModal(false);
      rejeitarForm.reset();
    }
    setActionLoading(false);
  }

  async function handleResubmeter() {
    setActionLoading(true);
    const success = await resubmeter(id);
    if (success) setShowConfirmResubmeter(false);
    setActionLoading(false);
  }

  async function handleNotas(data: NotasCandidaturaFormData) {
    setActionLoading(true);
    const success = await atualizarNotas(id, data);
    if (success) setShowNotasModal(false);
    setActionLoading(false);
  }

  async function handleAgendar(data: AgendarEntrevistaFormData) {
    setActionLoading(true);
    const success = await agendarEntrevista(id, data);
    if (success) {
      setShowAgendarModal(false);
      agendarForm.reset();
    }
    setActionLoading(false);
  }

  if (loading && !candidatura) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-2 border-[#42b883] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error && !candidatura) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => router.back()} leftIcon={<ArrowLeft size={16} />}>
          Voltar
        </Button>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!candidatura) return null;

  const user = candidatura.user;
  const canAct = candidatura.status_verificacao === 'pendente' || candidatura.status_verificacao === 'em_analise';
  const localizacao = [candidatura.provincia, candidatura.municipio, candidatura.bairro]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()} leftIcon={<ArrowLeft size={16} />}>
          Voltar
        </Button>
        <PageHeader
          title={user.nome_completo}
          description="Candidatura KYC"
          action={<StatusBadge status={candidatura.status_verificacao} />}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 font-medium">
          {error}
        </div>
      )}

      {/* Profile card */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#42b883] to-[#3aa374] flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-md">
            {user.nome_completo.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-lg font-bold text-gray-900">{user.nome_completo}</h2>
              <span className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-semibold">
                {tipoLabels[candidatura.tipo_prestador] || candidatura.tipo_prestador}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              <div className="flex items-center gap-2 text-[12px] text-gray-600">
                <Mail size={14} className="text-gray-400" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-gray-600">
                <Phone size={14} className="text-gray-400" />
                <span>{user.telefone}</span>
              </div>
              {localizacao && (
                <div className="flex items-center gap-2 text-[12px] text-gray-600">
                  <MapPin size={14} className="text-gray-400" />
                  <span>{localizacao}</span>
                </div>
              )}
              {candidatura.nome_comercial && (
                <div className="flex items-center gap-2 text-[12px] text-gray-600">
                  <Building size={14} className="text-gray-400" />
                  <span>{candidatura.nome_comercial}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      {canAct && (
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Acções</h3>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowConfirmAprovar(true)}
              leftIcon={<CheckCircle size={14} />}
            >
              Aprovar Candidatura
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowRejeitarModal(true)}
              leftIcon={<XCircle size={14} />}
            >
              Rejeitar
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowConfirmResubmeter(true)}
              leftIcon={<RotateCcw size={14} />}
            >
              Ressubmeter
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNotasModal(true)}
              leftIcon={<StickyNote size={14} />}
            >
              {candidatura.nota_operador ? 'Editar Notas' : 'Adicionar Nota'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAgendarModal(true)}
              leftIcon={<Plus size={14} />}
            >
              Agendar Entrevista
            </Button>
          </div>
        </div>
      )}

      {/* Operator note */}
      {candidatura.nota_operador && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-blue-900 flex items-center gap-2">
              <StickyNote size={14} />
              Nota do Operador
            </h3>
            {canAct && (
              <button
                onClick={() => setShowNotasModal(true)}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
              >
                Editar
              </button>
            )}
          </div>
          <p className="text-sm text-blue-800">{candidatura.nota_operador}</p>
        </div>
      )}

      {/* Documents */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <FileText size={16} />
            Documentos ({candidatura.documentos?.length || 0})
          </h3>
        </div>
        {candidatura.documentos && candidatura.documentos.length > 0 ? (
          <div className="space-y-3">
            {candidatura.documentos.map((doc) => (
              <DocumentoCard
                key={doc.id}
                documento={doc}
                onAprovar={aprovarDocumento}
                onRejeitar={rejeitarDocumento}
                onDownload={downloadDocumento}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <p className="text-xs text-gray-500 font-medium">Nenhum documento submetido</p>
          </div>
        )}
      </div>

      {/* Interviews */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Calendar size={16} />
            Entrevistas ({candidatura.entrevistas?.length || 0})
          </h3>
          {canAct && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAgendarModal(true)}
              leftIcon={<Plus size={14} />}
            >
              Agendar
            </Button>
          )}
        </div>
        {candidatura.entrevistas && candidatura.entrevistas.length > 0 ? (
          <div className="space-y-3">
            {candidatura.entrevistas.map((ent) => (
              <EntrevistaCard
                key={ent.id}
                entrevista={ent}
                onAtualizar={async (entId, data) => {
                  return atualizarEntrevista(entId, data);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <p className="text-xs text-gray-500 font-medium">Nenhuma entrevista agendada</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <ConfirmModal
        isOpen={showConfirmAprovar}
        onClose={() => setShowConfirmAprovar(false)}
        onConfirm={handleAprovar}
        title="Aprovar Candidatura"
        message="Tem a certeza que deseja aprovar esta candidatura? O prestador será notificado."
        confirmLabel="Aprovar"
        variant="success"
        loading={actionLoading}
      />

      <ConfirmModal
        isOpen={showConfirmResubmeter}
        onClose={() => setShowConfirmResubmeter(false)}
        onConfirm={handleResubmeter}
        title="Ressubmeter Candidatura"
        message="Isto irá devolver a candidatura ao prestador para correcções. O prestador será notificado."
        confirmLabel="Ressubmeter"
        variant="warning"
        loading={actionLoading}
      />

      <Modal
        isOpen={showRejeitarModal}
        onClose={() => {
          setShowRejeitarModal(false);
          rejeitarForm.reset();
        }}
        title="Rejeitar Candidatura"
        size="sm"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejeitarModal(false);
                rejeitarForm.reset();
              }}
              disabled={actionLoading}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={rejeitarForm.handleSubmit(handleRejeitar)}
              isLoading={actionLoading}
            >
              Rejeitar
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <p className="text-sm text-gray-600">
            Indique o motivo da rejeição desta candidatura:
          </p>
          <Textarea
            label="Motivo da rejeição"
            placeholder="Descreva o motivo da rejeição..."
            error={rejeitarForm.formState.errors.motivo_rejeicao?.message}
            rows={4}
            {...rejeitarForm.register('motivo_rejeicao')}
          />
        </form>
      </Modal>

      <Modal
        isOpen={showNotasModal}
        onClose={() => setShowNotasModal(false)}
        title={candidatura.nota_operador ? 'Editar Nota' : 'Adicionar Nota'}
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowNotasModal(false)} disabled={actionLoading}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={notasForm.handleSubmit(handleNotas)}
              isLoading={actionLoading}
            >
              Guardar
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <Textarea
            label="Nota do operador"
            placeholder="Adicione uma nota sobre esta candidatura..."
            error={notasForm.formState.errors.nota_operador?.message}
            rows={4}
            {...notasForm.register('nota_operador')}
          />
          <p className="text-[10px] text-gray-400 font-medium">
            Máximo 1000 caracteres
          </p>
        </form>
      </Modal>

      <Modal
        isOpen={showAgendarModal}
        onClose={() => {
          setShowAgendarModal(false);
          agendarForm.reset();
        }}
        title="Agendar Entrevista"
        size="md"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setShowAgendarModal(false);
                agendarForm.reset();
              }}
              disabled={actionLoading}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={agendarForm.handleSubmit(handleAgendar)}
              isLoading={actionLoading}
            >
              Agendar
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <Select
            label="Tipo de Entrevista"
            options={entrevistaTipoOptions}
            placeholder="Selecione o tipo"
            error={agendarForm.formState.errors.tipo?.message}
            {...agendarForm.register('tipo')}
          />

          <Input
            label="Data e Hora"
            type="datetime-local"
            error={agendarForm.formState.errors.agendada_para?.message}
            {...agendarForm.register('agendada_para')}
          />

          <Input
            label="Link da Videchamada (opcional)"
            placeholder="https://meet.google.com/..."
            error={agendarForm.formState.errors.link_video?.message}
            {...agendarForm.register('link_video')}
          />
        </form>
      </Modal>
    </div>
  );
}
