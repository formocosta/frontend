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
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  UserCheck,
  Video,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/common/form/Button';
import { Textarea } from '@/components/common/form/Textarea';
import { Input } from '@/components/common/form/Input';
import { Select, SelectOption } from '@/components/common/form/Select';
import { StatusBadge } from '@/components/common/ui/Badge';
import { Modal, ConfirmModal } from '@/components/common/ui/Modal';
import type { Documento, Entrevista } from '@/shared/types/backoffice/kyc.types';
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

  // Step wizard state (1: Perfil, 2: Documentos, 3: Entrevistas, 4: Decisão Final)
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);

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
    listarEntrevistas,
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
  const [entrevistasExtras, setEntrevistasExtras] = useState<Entrevista[]>([]);

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
    listarEntrevistas(id).then(setEntrevistasExtras);
  }, [id, fetchCandidatura, listarEntrevistas]);

  useEffect(() => {
    if (candidatura) {
      notasForm.reset({ nota_operador: candidatura.nota_operador || '' });
    }
  }, [candidatura, notasForm]);

  const entrevistasAtuais = useMemo(() => {
    return (candidatura?.entrevistas && candidatura.entrevistas.length > 0)
      ? candidatura.entrevistas
      : entrevistasExtras;
  }, [candidatura, entrevistasExtras]);

  // Validation & Step metrics
  const validacaoMetrics = useMemo(() => {
    const docs = candidatura?.documentos || [];
    const totalDocs = docs.length;
    const docsAprovados = docs.filter((d) => d.status === 'aprovado').length;
    const docsPendentes = docs.filter((d) => d.status === 'pendente').length;
    const docsRejeitados = docs.filter((d) => d.status === 'rejeitado').length;

    const hasVideoApproved = entrevistasAtuais.some(e => e.tipo === 'video_chamada' && e.status === 'realizada' && e.resultado === 'aprovado');
    const hasPresencialApproved = entrevistasAtuais.some(e => e.tipo === 'presencial' && e.status === 'realizada' && e.resultado === 'aprovado');
    const entrevistasAprovadasCount = (hasVideoApproved ? 1 : 0) + (hasPresencialApproved ? 1 : 0);

    const hasBi = docs.some(d => (d.tipo_documento === 'bi' || d.tipo_documento_id === 'bi') && d.status === 'aprovado');
    const hasNif = docs.some(d => (d.tipo_documento === 'nif' || d.tipo_documento_id === 'nif') && d.status === 'aprovado');
    const hasIban = docs.some(d => (d.tipo_documento === 'comprovativo_iban' || d.tipo_documento_id === 'comprovativo_iban') && d.status === 'aprovado');
    const hasCertificado = candidatura?.tipo_prestador === 'coletivo'
      ? docs.some(d => (d.tipo_documento === 'certificado_registo' || d.tipo_documento_id === 'certificado_registo') && d.status === 'aprovado')
      : true;

    const allDocsApproved = totalDocs > 0 && docsAprovados === totalDocs && hasBi && hasNif && hasIban && hasCertificado;
    const allInterviewsApproved = hasVideoApproved && hasPresencialApproved;
    const isAprovavel = allDocsApproved && allInterviewsApproved;

    // Step status markers
    const step1Done = Boolean(candidatura?.user?.nome_completo);
    const step2Done = allDocsApproved;
    const step3Done = allInterviewsApproved;
    const step4Done = candidatura?.status_verificacao === 'aprovado';

    // Recommendation logic
    let nextStepText = '';
    let nextStepAction: 'review_docs' | 'agendar_entrevista' | 'aguardar_entrevista' | 'aprovar' | 'concluido' | 'rejeitado' = 'review_docs';

    if (candidatura?.status_verificacao === 'aprovado') {
      nextStepText = 'Candidatura aprovada! O prestador já está ativo na plataforma.';
      nextStepAction = 'concluido';
    } else if (candidatura?.status_verificacao === 'rejeitado') {
      nextStepText = 'Candidatura rejeitada. Nenhuma ação pendente.';
      nextStepAction = 'rejeitado';
    } else if (!allDocsApproved) {
      nextStepText = `Ainda existem documentos a analisar (${docsAprovados} de ${totalDocs} aprovados). Verifique no Passo 2.`;
      nextStepAction = 'review_docs';
    } else if (!allInterviewsApproved) {
      const temAgendada = entrevistasAtuais.some(e => e.status === 'agendada');
      if (temAgendada) {
        nextStepText = 'Entrevista agendada. Registre o resultado como Aprovado após a conclusão no Passo 3.';
        nextStepAction = 'aguardar_entrevista';
      } else {
        nextStepText = 'Documentos aprovados! O próximo passo é agendar as entrevistas no Passo 3.';
        nextStepAction = 'agendar_entrevista';
      }
    } else if (isAprovavel) {
      nextStepText = 'Todos os pré-requisitos validados! Vá ao Passo 4 para Aprovar a Candidatura.';
      nextStepAction = 'aprovar';
    }

    return {
      totalDocs,
      docsAprovados,
      docsPendentes,
      docsRejeitados,
      hasVideoApproved,
      hasPresencialApproved,
      allDocsApproved,
      allInterviewsApproved,
      isAprovavel,
      step1Done,
      step2Done,
      step3Done,
      step4Done,
      nextStepText,
      nextStepAction,
      reasons: [
        !allDocsApproved ? 'Todos os documentos (BI, NIF, IBAN) devem estar submetidos e aprovados.' : null,
        !allInterviewsApproved ? 'Ambas as entrevistas (videochamada e presencial) devem estar realizadas e aprovadas.' : null,
      ].filter(Boolean) as string[],
    };
  }, [candidatura, entrevistasAtuais]);

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
    const payload = {
      ...data,
      link_video: data.link_video?.trim() || undefined,
    };
    const success = await agendarEntrevista(id, payload);
    if (success) {
      setShowAgendarModal(false);
      agendarForm.reset();
      listarEntrevistas(id).then(setEntrevistasExtras);
    }
    setActionLoading(false);
  }

  if (loading && !candidatura) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-2 border-[#42b883] border-t-transparent rounded-md animate-spin" />
      </div>
    );
  }

  if (error && !candidatura) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => router.back()} leftIcon={<ArrowLeft size={16} />}>
          Voltar
        </Button>
        <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
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

  const stepsList = [
    { id: 1, title: 'Perfil & Dados', icon: UserCheck, isDone: validacaoMetrics.step1Done, badge: 'Passo 1' },
    { id: 2, title: 'Documentos', icon: FileText, isDone: validacaoMetrics.step2Done, badge: `${validacaoMetrics.docsAprovados}/${validacaoMetrics.totalDocs}` },
    { id: 3, title: 'Entrevistas', icon: Video, isDone: validacaoMetrics.step3Done, badge: validacaoMetrics.allInterviewsApproved ? 'OK' : 'Pendente' },
    { id: 4, title: 'Decisão Final', icon: ShieldCheck, isDone: validacaoMetrics.step4Done, badge: validacaoMetrics.isAprovavel ? 'Pronto' : 'Ação' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <PageHeader
        title="Dossiê de Verificação KYC"
        description={`Candidatura submetida por ${user.nome_completo} em ${new Date(candidatura.created_at).toLocaleDateString('pt-AO')}`}
        backButton={
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-md bg-white border border-gray-200 text-gray-500 hover:text-[#42b883] hover:border-[#42b883] hover:bg-[#42b883]/5 transition-all shadow-sm"
          >
            <ArrowLeft size={16} />
          </button>
        }
        action={<StatusBadge status={candidatura.status_verificacao} />}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-sm text-red-700 font-bold shadow-sm">
          {error}
        </div>
      )}

      {/* TOP STEP-BY-STEP STEPPER NAVIGATION BAR */}
      <div className="bg-white rounded-md border border-gray-100 p-2 sm:p-3 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {stepsList.map((step) => {
            const isActive = activeStep === step.id;
            const IconComp = step.icon;

            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id as any)}
                className={`p-3 rounded-md transition-all flex items-center gap-3 text-left border ${
                  isActive
                    ? 'bg-emerald-50/80 border-[#42b883] shadow-sm ring-1 ring-[#42b883]/30'
                    : step.isDone
                    ? 'bg-white border-emerald-100 hover:bg-gray-50'
                    : 'bg-white border-gray-100 hover:bg-gray-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                  isActive
                    ? 'bg-[#42b883] text-white shadow-sm'
                    : step.isDone
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {step.isDone ? <CheckCircle2 size={16} /> : step.id}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <p className={`text-xs font-black truncate ${isActive ? 'text-[#42b883]' : 'text-gray-900'}`}>
                      {step.title}
                    </p>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                      isActive ? 'bg-[#42b883] text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {step.badge}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-semibold truncate mt-0.5">
                    {step.id === 1 && 'Dados Cadastrais'}
                    {step.id === 2 && 'Ficheiros Anexados'}
                    {step.id === 3 && 'Vídeo & Presencial'}
                    {step.id === 4 && 'Aprovar / Rejeitar'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* RECOMMENDED NEXT STEP BANNER */}
      <div className={`p-4 rounded-md border flex items-center justify-between gap-4 shadow-sm ${
        validacaoMetrics.nextStepAction === 'aprovar'
          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
          : validacaoMetrics.nextStepAction === 'agendar_entrevista'
          ? 'bg-blue-50 border-blue-200 text-blue-900'
          : 'bg-amber-50 border-amber-200 text-amber-900'
      }`}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 rounded-md bg-white shadow-sm shrink-0">
            <ArrowRight size={18} className={validacaoMetrics.nextStepAction === 'aprovar' ? 'text-emerald-600' : 'text-blue-600'} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-wider">Orientação do Passo a Passo</p>
            <p className="text-xs font-medium truncate">{validacaoMetrics.nextStepText}</p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          {validacaoMetrics.nextStepAction === 'review_docs' && activeStep !== 2 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveStep(2)}
              className="bg-white text-amber-800 border-amber-300 hover:bg-amber-100 text-xs font-bold rounded-md"
            >
              Ir para Documentos (Passo 2)
            </Button>
          )}

          {validacaoMetrics.nextStepAction === 'agendar_entrevista' && activeStep !== 3 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveStep(3)}
              className="bg-white text-blue-800 border-blue-300 hover:bg-blue-100 text-xs font-bold rounded-md"
            >
              Ir para Entrevistas (Passo 3)
            </Button>
          )}

          {validacaoMetrics.nextStepAction === 'aprovar' && activeStep !== 4 && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setActiveStep(4)}
              className="bg-[#42b883] hover:bg-[#3aa374] text-xs font-bold rounded-md shadow-sm"
            >
              Ir para Aprovação (Passo 4)
            </Button>
          )}
        </div>
      </div>

      {/* STEP 1: PERFIL & DADOS DO PRESTADOR */}
      {activeStep === 1 && (
        <div className="space-y-6">
          <div className="bg-white rounded-md border border-gray-100 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-6">
            <div className="flex items-center justify-between border-b border-gray-50 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-[#42b883]/10 text-[#42b883] font-black text-lg flex items-center justify-center">
                  {user.nome_completo.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900 tracking-tight">{user.nome_completo}</h3>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-gray-50 text-gray-600 px-2 py-0.5 rounded border border-gray-100 mt-0.5">
                    <User size={12} />
                    {tipoLabels[candidatura.tipo_prestador] || candidatura.tipo_prestador}
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNotasModal(true)}
                className="text-xs font-bold border-gray-200"
                leftIcon={<StickyNote size={14} className="text-blue-500" />}
              >
                {candidatura.nota_operador ? 'Editar Nota Interna' : 'Adicionar Nota Interna'}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50/80 p-4 rounded-md border border-gray-100 space-y-1">
                <p className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-1">
                  <Mail size={12} /> E-mail Principal
                </p>
                <p className="text-sm font-bold text-gray-900 break-all">{user.email}</p>
              </div>

              <div className="bg-gray-50/80 p-4 rounded-md border border-gray-100 space-y-1">
                <p className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-1">
                  <Phone size={12} /> Número de Telefone
                </p>
                <p className="text-sm font-bold text-gray-900">{user.telefone}</p>
              </div>

              {candidatura.nif && (
                <div className="bg-gray-50/80 p-4 rounded-md border border-gray-100 space-y-1">
                  <p className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-1">
                    <FileText size={12} /> NIF de Identificação
                  </p>
                  <p className="text-sm font-bold font-mono text-gray-900">{candidatura.nif}</p>
                </div>
              )}

              {candidatura.nome_comercial && (
                <div className="bg-gray-50/80 p-4 rounded-md border border-gray-100 space-y-1">
                  <p className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-1">
                    <Building size={12} /> Nome Comercial / Empresa
                  </p>
                  <p className="text-sm font-bold text-gray-900">{candidatura.nome_comercial}</p>
                </div>
              )}

              {localizacao && (
                <div className="bg-gray-50/80 p-4 rounded-md border border-gray-100 space-y-1 md:col-span-2">
                  <p className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-1">
                    <MapPin size={12} /> Endereço & Localização
                  </p>
                  <p className="text-sm font-bold text-gray-900">{localizacao}</p>
                </div>
              )}
            </div>

            {/* Operator Note Box */}
            {candidatura.nota_operador && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 space-y-2">
                <h4 className="text-xs font-black text-blue-900 uppercase tracking-wider flex items-center gap-2">
                  <StickyNote size={14} className="text-blue-500" />
                  Nota Interna de Auditoria
                </h4>
                <p className="text-xs text-blue-800 font-medium leading-relaxed bg-white/70 p-3 rounded border border-blue-100">
                  {candidatura.nota_operador}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              variant="primary"
              onClick={() => setActiveStep(2)}
              className="bg-[#42b883] hover:bg-[#3aa374] font-bold text-xs rounded-md shadow-sm px-6 py-2.5"
              rightIcon={<ChevronRight size={16} />}
            >
              Avançar para Documentos (Passo 2)
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: AUDITORIA DE DOCUMENTOS */}
      {activeStep === 2 && (
        <div className="space-y-6">
          <div className="bg-white rounded-md border border-gray-100 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4 border-b border-gray-50 pb-4">
              <div>
                <h3 className="text-base font-black text-gray-900 tracking-tight flex items-center gap-2">
                  <FileText size={18} className="text-[#42b883]" />
                  Auditoria de Documentos
                </h3>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  Verifique a autenticidade do BI, NIF, IBAN e certificados
                </p>
              </div>
              <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                {validacaoMetrics.docsAprovados} de {validacaoMetrics.totalDocs} Documentos Aprovados
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
              <div className="bg-gray-50 rounded-md p-12 text-center border border-dashed border-gray-200 space-y-2">
                <FileText size={28} className="mx-auto text-gray-300" />
                <p className="text-sm text-gray-900 font-bold">Sem Ficheiros Anexados</p>
                <p className="text-xs text-gray-500 font-medium">O prestador ainda não concluiu o envio de comprovativos.</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setActiveStep(1)}
              className="font-bold text-xs rounded-md border-gray-200"
              leftIcon={<ChevronLeft size={16} />}
            >
              Passo Anterior (Perfil)
            </Button>
            <Button
              variant="primary"
              onClick={() => setActiveStep(3)}
              className="bg-[#42b883] hover:bg-[#3aa374] font-bold text-xs rounded-md shadow-sm px-6 py-2.5"
              rightIcon={<ChevronRight size={16} />}
            >
              Avançar para Entrevistas (Passo 3)
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: ENTREVISTAS DE VALIDAÇÃO */}
      {activeStep === 3 && (
        <div className="space-y-6">
          <div className="bg-white rounded-md border border-gray-100 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4 border-b border-gray-50 pb-4">
              <div>
                <h3 className="text-base font-black text-gray-900 tracking-tight flex items-center gap-2">
                  <Video size={18} className="text-blue-600" />
                  Entrevistas de Validação
                </h3>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  Agende e valide as entrevistas de vídeo chamada e presenciais
                </p>
              </div>

              {canAct && (
                <Button
                  variant="primary"
                  onClick={() => setShowAgendarModal(true)}
                  className="bg-gray-900 hover:bg-gray-800 text-xs font-bold rounded-md px-4 py-2"
                  leftIcon={<Plus size={14} />}
                >
                  Agendar Nova Entrevista
                </Button>
              )}
            </div>

            {entrevistasAtuais && entrevistasAtuais.length > 0 ? (
              <div className="space-y-4">
                {entrevistasAtuais.map((ent, i) => (
                  <div key={ent.id} className="relative">
                    {i !== entrevistasAtuais.length - 1 && (
                      <div className="absolute left-6 top-10 bottom-[-20px] w-[2px] bg-gray-100 z-0"></div>
                    )}
                    <div className="relative z-10">
                      <EntrevistaCard
                        entrevista={ent}
                        onAtualizar={async (entId, data) => {
                          const success = await atualizarEntrevista(entId, data);
                          if (success) {
                            listarEntrevistas(id).then(setEntrevistasExtras);
                          }
                          return success;
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-md p-12 text-center border border-dashed border-gray-200 space-y-2">
                <Calendar size={28} className="mx-auto text-gray-300" />
                <p className="text-sm text-gray-900 font-bold">Nenhuma entrevista agendada</p>
                <p className="text-xs text-gray-500 font-medium">Clique no botão acima para agendar a entrevista com o prestador.</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setActiveStep(2)}
              className="font-bold text-xs rounded-md border-gray-200"
              leftIcon={<ChevronLeft size={16} />}
            >
              Passo Anterior (Documentos)
            </Button>
            <Button
              variant="primary"
              onClick={() => setActiveStep(4)}
              className="bg-[#42b883] hover:bg-[#3aa374] font-bold text-xs rounded-md shadow-sm px-6 py-2.5"
              rightIcon={<ChevronRight size={16} />}
            >
              Ir para Decisão Final (Passo 4)
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: DECISÃO FINAL & LIBERAÇÃO */}
      {activeStep === 4 && (
        <div className="space-y-6">
          <div className="bg-white rounded-md border border-gray-100 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-6">
            <div className="border-b border-gray-50 pb-4">
              <h3 className="text-base font-black text-gray-900 tracking-tight flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#42b883]" />
                Decisão Final de Auditoria KYC
              </h3>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Revise os pré-requisitos antes de aprovar ou rejeitar a candidatura
              </p>
            </div>

            {/* Verification Checklist */}
            <div className="bg-gray-50/80 p-5 rounded-md border border-gray-100 space-y-3">
              <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider">Checklist de Pré-requisitos</h4>

              <div className="space-y-2">
                <div className="flex items-center justify-between bg-white p-3 rounded-md border border-gray-100 text-xs font-bold">
                  <span className="flex items-center gap-2">
                    <UserCheck size={16} className="text-[#42b883]" />
                    Passo 1: Perfil & Identidade Cadastrada
                  </span>
                  <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-black">Validado</span>
                </div>

                <div className="flex items-center justify-between bg-white p-3 rounded-md border border-gray-100 text-xs font-bold">
                  <span className="flex items-center gap-2">
                    <FileText size={16} className={validacaoMetrics.allDocsApproved ? 'text-[#42b883]' : 'text-amber-500'} />
                    Passo 2: Ficheiros de BI, NIF e IBAN Aprovados
                  </span>
                  <span className={`px-2 py-0.5 rounded font-black ${
                    validacaoMetrics.allDocsApproved ? 'text-emerald-700 bg-emerald-100' : 'text-amber-700 bg-amber-100'
                  }`}>
                    {validacaoMetrics.docsAprovados}/{validacaoMetrics.totalDocs} Aprovados
                  </span>
                </div>

                <div className="flex items-center justify-between bg-white p-3 rounded-md border border-gray-100 text-xs font-bold">
                  <span className="flex items-center gap-2">
                    <Video size={16} className={validacaoMetrics.allInterviewsApproved ? 'text-[#42b883]' : 'text-blue-500'} />
                    Passo 3: Entrevistas (Vídeo & Presencial)
                  </span>
                  <span className={`px-2 py-0.5 rounded font-black ${
                    validacaoMetrics.allInterviewsApproved ? 'text-emerald-700 bg-emerald-100' : 'text-blue-700 bg-blue-100'
                  }`}>
                    {validacaoMetrics.allInterviewsApproved ? 'Aprovadas' : 'Pendente'}
                  </span>
                </div>
              </div>
            </div>

            {/* Audit Decision Buttons */}
            {canAct ? (
              <div className="space-y-4 pt-2">
                <Button
                  variant="primary"
                  onClick={() => setShowConfirmAprovar(true)}
                  disabled={!validacaoMetrics.isAprovavel}
                  className={`w-full font-bold text-sm rounded-md shadow-sm py-3.5 ${
                    validacaoMetrics.isAprovavel
                      ? 'bg-[#42b883] hover:bg-[#3aa374] text-white'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                  }`}
                  leftIcon={<CheckCircle size={18} />}
                >
                  Aprovar Candidatura & Liberação de Acesso
                </Button>

                {!validacaoMetrics.isAprovavel && (
                  <div className="text-xs text-amber-800 bg-amber-50 p-4 rounded-md border border-amber-200 space-y-1.5">
                    <span className="font-bold flex items-center gap-1.5">
                      <AlertTriangle size={16} /> Requisitos Pendentes para Liberação:
                    </span>
                    <ul className="list-disc pl-5 space-y-1 font-medium">
                      {validacaoMetrics.reasons.map((reason, i) => (
                        <li key={i}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <button
                    onClick={() => setShowRejeitarModal(true)}
                    className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-3 rounded-md font-bold text-xs transition-colors"
                  >
                    <XCircle size={16} />
                    Rejeitar Candidatura
                  </button>
                  <button
                    onClick={() => setShowConfirmResubmeter(true)}
                    className="flex items-center justify-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200 py-3 rounded-md font-bold text-xs transition-colors"
                  >
                    <RotateCcw size={16} />
                    Devolver ao Prestador para Correção
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-md bg-gray-50 border border-gray-100 text-center">
                <p className="text-xs font-bold text-gray-700">
                  Esta candidatura já se encontra no estado: <span className="uppercase text-[#42b883]">{candidatura.status_verificacao}</span>
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-start">
            <Button
              variant="outline"
              onClick={() => setActiveStep(3)}
              className="font-bold text-xs rounded-md border-gray-200"
              leftIcon={<ChevronLeft size={16} />}
            >
              Passo Anterior (Entrevistas)
            </Button>
          </div>
        </div>
      )}

      {/* Confirmation Modals */}
      <ConfirmModal
        isOpen={showConfirmAprovar}
        onClose={() => setShowConfirmAprovar(false)}
        onConfirm={handleAprovar}
        title="Aprovar Candidatura KYC"
        message="Tem a certeza que deseja aprovar esta candidatura? O prestador será notificado e ganhará acesso operacional completo à plataforma."
        confirmLabel="Confirmar Aprovação"
        variant="success"
        loading={actionLoading}
      />

      <ConfirmModal
        isOpen={showConfirmResubmeter}
        onClose={() => setShowConfirmResubmeter(false)}
        onConfirm={handleResubmeter}
        title="Ressubmeter Candidatura"
        message="Isto irá devolver a candidatura ao estado pendente para que o prestador faça as correções necessárias nos seus documentos."
        confirmLabel="Devolver ao Prestador"
        variant="warning"
        loading={actionLoading}
      />

      {/* Reject Modal */}
      <Modal
        isOpen={showRejeitarModal}
        onClose={() => {
          setShowRejeitarModal(false);
          rejeitarForm.reset();
        }}
        title="Rejeitar Candidatura KYC"
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
          <div className="bg-red-50 text-red-700 p-3 rounded-md flex items-start gap-2 text-xs font-medium border border-red-100">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            Esta ação negará formalmente o cadastro do prestador. Especifique o motivo claramente.
          </div>
          <Textarea
            label="Motivo da rejeição"
            placeholder="Especifique detalhadamente por que razão esta candidatura foi recusada..."
            error={rejeitarForm.formState.errors.motivo_rejeicao?.message}
            rows={4}
            {...rejeitarForm.register('motivo_rejeicao')}
          />
        </form>
      </Modal>

      {/* Operator Notes Modal */}
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
              className="bg-[#42b883] hover:bg-[#3aa374]"
            >
              Gravar Nota
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <Textarea
            label="Conteúdo da nota"
            placeholder="Anotações privadas de auditoria para os operadores..."
            error={notasForm.formState.errors.nota_operador?.message}
            rows={5}
            {...notasForm.register('nota_operador')}
          />
          <p className="text-[11px] text-gray-500 font-medium">
            Estas notas são privadas para a equipa interna e não ficam visíveis para o prestador.
          </p>
        </form>
      </Modal>

      {/* Schedule Interview Modal */}
      <Modal
        isOpen={showAgendarModal}
        onClose={() => {
          setShowAgendarModal(false);
          agendarForm.reset();
        }}
        title="Agendar Entrevista de Verificação"
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
              className="bg-[#42b883] hover:bg-[#3aa374]"
            >
              Confirmar Agendamento
            </Button>
          </>
        }
      >
        <form className="space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-xs font-medium">
              {error}
            </div>
          )}
          <Select
            label="Tipo de Entrevista"
            options={entrevistaTipoOptions}
            placeholder="Selecione o formato da entrevista"
            error={agendarForm.formState.errors.tipo?.message}
            {...agendarForm.register('tipo')}
          />

          <Input
            label="Data e Hora do Agendamento"
            type="datetime-local"
            error={agendarForm.formState.errors.agendada_para?.message}
            {...agendarForm.register('agendada_para')}
          />

          <Input
            label="Link da Videochamada (opcional para presencial)"
            placeholder="Ex: https://meet.google.com/..."
            error={agendarForm.formState.errors.link_video?.message}
            {...agendarForm.register('link_video')}
          />
        </form>
      </Modal>
    </div>
  );
}
