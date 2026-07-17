'use client';

import { useEffect, useState, useMemo } from 'react';
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
  User,
  ShieldCheck,
  AlertTriangle
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
    obterDocumentoBlob,
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

  const validacaoAprovacao = useMemo(() => {
    const docs = candidatura?.documentos || [];
    const entrevistas = candidatura?.entrevistas || [];

    const hasVideoApproved = entrevistas.some(e => e.tipo === 'video_chamada' && e.status === 'realizada' && e.resultado === 'aprovado');
    const hasPresencialApproved = entrevistas.some(e => e.tipo === 'presencial' && e.status === 'realizada' && e.resultado === 'aprovado');

    const hasBi = docs.some(d => (d.tipo_documento === 'bi' || d.tipo_documento_id === 'bi') && d.status === 'aprovado');
    const hasNif = docs.some(d => (d.tipo_documento === 'nif' || d.tipo_documento_id === 'nif') && d.status === 'aprovado');
    const hasIban = docs.some(d => (d.tipo_documento === 'comprovativo_iban' || d.tipo_documento_id === 'comprovativo_iban') && d.status === 'aprovado');
    const hasCertificado = candidatura?.tipo_prestador === 'coletivo'
      ? docs.some(d => (d.tipo_documento === 'certificado_registo' || d.tipo_documento_id === 'certificado_registo') && d.status === 'aprovado')
      : true;

    const allDocsApproved = hasBi && hasNif && hasIban && hasCertificado;
    const allInterviewsApproved = hasVideoApproved && hasPresencialApproved;

    return {
      isAprovavel: allDocsApproved && allInterviewsApproved,
      reasons: [
        !allInterviewsApproved ? 'Ambas as entrevistas (vídeo e presencial) devem estar aprovadas.' : null,
        !allDocsApproved ? 'Todos os documentos obrigatórios devem estar submetidos e aprovados.' : null
      ].filter(Boolean) as string[]
    };
  }, [candidatura]);

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
    // Clean payload: remove empty link_video so backend doesn't validate it as a URL
    const payload = {
      ...data,
      link_video: data.link_video?.trim() || undefined,
    };
    const success = await agendarEntrevista(id, payload);
    if (success) {
      setShowAgendarModal(false);
      agendarForm.reset();
    }
    setActionLoading(false);
  }

  if (loading && !candidatura) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-2 border-[#42b883] border-t-transparent rounded-sm animate-spin" />
      </div>
    );
  }

  if (error && !candidatura) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => router.back()} leftIcon={<ArrowLeft size={16} />}>
          Voltar
        </Button>
        <div className="bg-red-50 border border-red-200 rounded-sm p-6 text-center">
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!candidatura) return null;

  const user = candidatura.user;
  const canAct = candidatura.status_verificacao === 'pendente' || 
                 candidatura.status_verificacao === 'em_analise' || 
                 candidatura.status_verificacao === 'entrevista_agendada';
  const localizacao = [candidatura.provincia, candidatura.municipio, candidatura.bairro]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <PageHeader
        title="Dossiê de Verificação KYC"
        description={`Submetido em ${new Date(candidatura.created_at).toLocaleDateString('pt-AO')}`}
        backButton={
          <button 
            onClick={() => router.back()} 
            className="w-9 h-9 flex items-center justify-center rounded-sm bg-white border border-gray-200 text-gray-500 hover:text-[#42b883] hover:border-[#42b883] hover:bg-[#42b883]/5 transition-all shadow-sm"
          >
            <ArrowLeft size={16} />
          </button>
        }
        action={<StatusBadge status={candidatura.status_verificacao} />}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-sm p-4 text-sm text-red-700 font-medium shadow-sm">
          {error}
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* LEFTSIDE COLUMN (Profile & Actions) */}
        <div className="w-full lg:w-[35%] flex flex-col gap-6">
          
          {/* Creative Profile Card */}
          <div className="bg-white rounded-sm border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden relative">
            <div className="h-24 bg-gradient-to-r from-[#42b883] to-[#3aa374]"></div>
            <div className="px-6 pb-6 pt-0 relative">
              <div className="w-20 h-20 rounded-sm bg-white border-4 border-white flex items-center justify-center -mt-10 mb-3 shadow-md mx-auto">
                <div className="w-full h-full bg-[#42b883]/10 text-[#42b883] font-black text-2xl flex items-center justify-center rounded-sm">
                  {user.nome_completo.charAt(0)}
                </div>
              </div>
              <div className="text-center mb-6">
                <h2 className="text-lg font-black text-gray-900 tracking-tight">{user.nome_completo}</h2>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-gray-50 text-gray-600 px-2.5 py-1 rounded-sm mt-1.5 border border-gray-100">
                  <User size={12} />
                  {tipoLabels[candidatura.tipo_prestador] || candidatura.tipo_prestador}
                </span>
              </div>
              
              <div className="space-y-4 pt-4 border-t border-gray-50">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-sm bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                    <Mail size={14} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400">Email</p>
                    <p className="text-[13px] font-semibold text-gray-900 break-all">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-sm bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                    <Phone size={14} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400">Telefone</p>
                    <p className="text-[13px] font-semibold text-gray-900">{user.telefone}</p>
                  </div>
                </div>
                
                {candidatura.nif && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-sm bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                      <FileText size={14} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400">NIF</p>
                      <p className="text-[13px] font-semibold text-gray-900">{candidatura.nif}</p>
                    </div>
                  </div>
                )}

                {candidatura.nome_comercial && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-sm bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                      <Building size={14} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400">Nome Comercial</p>
                      <p className="text-[13px] font-semibold text-gray-900">{candidatura.nome_comercial}</p>
                    </div>
                  </div>
                )}
                
                {localizacao && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-sm bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                      <MapPin size={14} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400">Localização</p>
                      <p className="text-[13px] font-semibold text-gray-900">{localizacao}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Panel */}
          {canAct && (
            <div className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-100 px-5 py-3">
                <h3 className="text-[13px] font-black text-gray-900 uppercase flex items-center gap-2 tracking-wider">
                  <ShieldCheck size={16} className="text-[#42b883]" />
                  Ações de Auditoria
                </h3>
              </div>
              <div className="p-5 flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setShowConfirmAprovar(true)}
                    disabled={!validacaoAprovacao.isAprovavel}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-sm font-bold text-[13px] transition-colors shadow-sm ${
                      validacaoAprovacao.isAprovavel
                        ? 'bg-[#42b883] hover:bg-[#3aa374] text-white'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <CheckCircle size={16} />
                    Aprovar Candidatura
                  </button>
                  {!validacaoAprovacao.isAprovavel && (
                    <div className="text-[11px] text-amber-700 bg-amber-50 p-2.5 rounded-sm border border-amber-200 flex flex-col gap-1">
                      <span className="font-bold flex items-center gap-1.5"><AlertTriangle size={13}/> Requisitos Pendentes:</span>
                      <ul className="list-disc pl-5 space-y-1 mt-1 font-medium">
                        {validacaoAprovacao.reasons.map((reason, i) => (
                          <li key={i}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setShowRejeitarModal(true)}
                    className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-2.5 rounded-sm font-bold text-[13px] transition-colors"
                  >
                    <XCircle size={16} />
                    Rejeitar
                  </button>
                  <button
                    onClick={() => setShowConfirmResubmeter(true)}
                    className="flex items-center justify-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200 py-2.5 rounded-sm font-bold text-[13px] transition-colors"
                  >
                    <RotateCcw size={16} />
                    Ressubmeter
                  </button>
                </div>
                <div className="border-t border-gray-100 mt-2 pt-4 flex flex-col gap-2">
                  <button
                    onClick={() => setShowAgendarModal(true)}
                    className="flex items-center justify-between px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-sm font-semibold text-[13px] transition-colors"
                  >
                    <span className="flex items-center gap-2"><Plus size={16} className="text-gray-400"/> Agendar Entrevista</span>
                  </button>
                  <button
                    onClick={() => setShowNotasModal(true)}
                    className="flex items-center justify-between px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-sm font-semibold text-[13px] transition-colors"
                  >
                    <span className="flex items-center gap-2"><StickyNote size={16} className="text-gray-400"/> {candidatura.nota_operador ? 'Editar Nota Interna' : 'Adicionar Nota Interna'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Operator note display */}
          {candidatura.nota_operador && (
            <div className="bg-blue-50 border border-blue-200 rounded-sm p-5 relative shadow-sm">
              <div className="absolute top-0 right-0 w-8 h-8 bg-blue-100 rounded-bl-sm" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>
              <div className="flex items-center justify-between mb-3 relative z-10">
                <h3 className="text-[13px] font-black text-blue-900 uppercase tracking-wider flex items-center gap-2">
                  <StickyNote size={14} className="text-blue-500" />
                  Nota do Operador
                </h3>
                {canAct && (
                  <button
                    onClick={() => setShowNotasModal(true)}
                    className="text-[11px] bg-white border border-blue-100 text-blue-600 px-2 py-1 rounded-sm hover:bg-blue-600 hover:text-white font-bold transition-colors shadow-sm"
                  >
                    Editar
                  </button>
                )}
              </div>
              <p className="text-[13px] text-blue-800 font-medium leading-relaxed bg-white/50 p-3 rounded-sm border border-blue-100/50">
                {candidatura.nota_operador}
              </p>
            </div>
          )}

        </div>

        {/* RIGHTSIDE COLUMN (Process & Audit) */}
        <div className="w-full lg:w-[65%] flex flex-col gap-6">
          
          {/* Documents Section */}
          <div className="bg-white rounded-sm border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2 tracking-tight">
                <FileText size={20} className="text-[#42b883]" />
                Documentação Analisada
              </h3>
              <span className="bg-gray-100 text-gray-600 text-[11px] font-bold px-3 py-1 rounded-sm">
                {candidatura.documentos?.length || 0} anexos
              </span>
            </div>
            
            {candidatura.documentos && candidatura.documentos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {candidatura.documentos.map((doc) => (
                  <DocumentoCard
                    key={doc.id}
                    documento={doc}
                    onAprovar={aprovarDocumento}
                    onRejeitar={rejeitarDocumento}
                    onDownload={downloadDocumento}
                    onVisualizar={obterDocumentoBlob}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-sm p-12 text-center border border-dashed border-gray-200">
                <FileText size={32} className="mx-auto text-gray-300 mb-3" />
                <p className="text-sm text-gray-900 font-bold">Sem Documentação</p>
                <p className="text-[12px] text-gray-500 font-medium mt-1">O prestador ainda não submeteu ou não existem ficheiros anexados a esta candidatura.</p>
              </div>
            )}
          </div>

          {/* Interviews Section */}
          <div className="bg-white rounded-sm border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2 tracking-tight">
                <Calendar size={20} className="text-[#42b883]" />
                Registo de Entrevistas
              </h3>
              {canAct && (
                <button
                  onClick={() => setShowAgendarModal(true)}
                  className="text-[11px] bg-gray-900 border border-gray-900 text-white px-3 py-1 rounded-sm hover:bg-gray-800 font-bold transition-colors shadow-sm flex items-center gap-1"
                >
                  <Plus size={14}/> Nova
                </button>
              )}
            </div>
            
            {candidatura.entrevistas && candidatura.entrevistas.length > 0 ? (
              <div className="space-y-4">
                {candidatura.entrevistas.map((ent, i) => (
                  <div key={ent.id} className="relative">
                    {/* Timeline line connecting items */}
                    {i !== candidatura.entrevistas!.length - 1 && (
                       <div className="absolute left-6 top-10 bottom-[-20px] w-[2px] bg-gray-100 z-0"></div>
                    )}
                    <div className="relative z-10">
                      <EntrevistaCard
                        entrevista={ent}
                        onAtualizar={async (entId, data) => {
                          return atualizarEntrevista(entId, data);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-sm p-12 text-center border border-dashed border-gray-200">
                <Calendar size={32} className="mx-auto text-gray-300 mb-3" />
                <p className="text-sm text-gray-900 font-bold">Sem Entrevistas</p>
                <p className="text-[12px] text-gray-500 font-medium mt-1">Não existe histórico de agendamentos ou entrevistas realizadas para esta candidatura.</p>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Modals (No changes to modal structure except styling properties) */}
      <ConfirmModal
        isOpen={showConfirmAprovar}
        onClose={() => setShowConfirmAprovar(false)}
        onConfirm={handleAprovar}
        title="Aprovar Candidatura"
        message="Tem a certeza que deseja aprovar esta candidatura? O prestador será notificado e ganhará acesso completo."
        confirmLabel="Confirmar Aprovação"
        variant="success"
        loading={actionLoading}
      />

      <ConfirmModal
        isOpen={showConfirmResubmeter}
        onClose={() => setShowConfirmResubmeter(false)}
        onConfirm={handleResubmeter}
        title="Ressubmeter Candidatura"
        message="Isto irá devolver a candidatura ao estado pendente para o prestador fazer correcções. Ele será notificado da alteração."
        confirmLabel="Devolver ao Prestador"
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
              Confirmar Rejeição
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <div className="bg-red-50 text-red-700 p-3 rounded-sm flex items-start gap-2 mb-2 text-[12px] font-medium border border-red-100">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            Esta ação é irreversível. O prestador será imediatamente notificado com o motivo especificado.
          </div>
          <Textarea
            label="Motivo da rejeição"
            placeholder="Especifique detalhadamente por que razão esta candidatura foi negada..."
            error={rejeitarForm.formState.errors.motivo_rejeicao?.message}
            rows={4}
            {...rejeitarForm.register('motivo_rejeicao')}
          />
        </form>
      </Modal>

      <Modal
        isOpen={showNotasModal}
        onClose={() => setShowNotasModal(false)}
        title={candidatura.nota_operador ? 'Editar Nota Interna' : 'Adicionar Nota Interna'}
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
              Gravar Nota
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <Textarea
            label="Conteúdo da nota"
            placeholder="Anotações privadas para a equipa de auditoria..."
            error={notasForm.formState.errors.nota_operador?.message}
            rows={5}
            {...notasForm.register('nota_operador')}
          />
          <p className="text-[11px] text-gray-500 font-medium">
            Estas notas não são visíveis para o prestador. Máximo 1000 caracteres.
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
              Confirmar Agendamento
            </Button>
          </>
        }
      >
        <form className="space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-sm text-[13px] font-medium">
              {error}
            </div>
          )}
          <Select
            label="Tipo de Entrevista"
            options={entrevistaTipoOptions}
            placeholder="Como será realizada a entrevista?"
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
            label="Link de Acesso (opcional)"
            placeholder="Ex: https://meet.google.com/..."
            error={agendarForm.formState.errors.link_video?.message}
            {...agendarForm.register('link_video')}
          />
        </form>
      </Modal>
    </div>
  );
}
