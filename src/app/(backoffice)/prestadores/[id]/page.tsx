'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePrestadorDetail, usePrestadorDocumentos, usePrestadorCandidaturaActions } from '@/hooks/users/users.hooks';
import { useCandidaturaDetail } from '@/hooks/kyc/kyc.hooks';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  MapPin,
  Star,
  Briefcase,
  FileText,
  Video,
  Building,
  Download,
  Info,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ClipboardCheck
} from 'lucide-react';
import Link from 'next/link';
import { StatusBadge } from '@/components/common/ui/Badge';
import { Button } from '@/components/common/form/Button';
import { Textarea } from '@/components/common/form/Textarea';
import { Modal, ConfirmModal } from '@/components/common/ui/Modal';
import { EntrevistaCard } from '@/components/kyc/EntrevistaCard';
import type { Entrevista, AtualizarEntrevistaRequest } from '@/shared/types/backoffice/kyc.types';
import {
  rejeitarCandidaturaSchema,
  RejeitarCandidaturaFormData,
} from '@/shared/schemas/kyc.schema';

export default function PrestadorDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { prestadorUser, loading, error, fetchPrestador } = usePrestadorDetail();
  const { loading: downloadingDocId, obterDocumentoBlob } = usePrestadorDocumentos();
  const { aprovarCandidatura, rejeitarCandidatura, loading: candidaturaLoading, error: candidaturaError } = usePrestadorCandidaturaActions();
  const {
    candidatura,
    error: kycError,
    fetchCandidatura,
    listarEntrevistas,
    atualizarEntrevista,
  } = useCandidaturaDetail();

  const [showRejeitarModal, setShowRejeitarModal] = useState(false);
  const [showConfirmAprovar, setShowConfirmAprovar] = useState(false);
  const [entrevistasExtras, setEntrevistasExtras] = useState<Entrevista[]>([]);

  const rejeitarForm = useForm<RejeitarCandidaturaFormData>({
    resolver: zodResolver(rejeitarCandidaturaSchema),
  });

  useEffect(() => {
    if (id) {
      fetchPrestador(id);
      fetchCandidatura(id);
      listarEntrevistas(id).then(setEntrevistasExtras);
    }
  }, [id, fetchPrestador, fetchCandidatura, listarEntrevistas]);

  const handleDownloadDoc = async (docId: string, tipoDoc: string) => {
    const result = await obterDocumentoBlob(docId);
    if (result) {
      const link = document.createElement('a');
      link.href = result.url;
      const ext = result.type.includes('pdf') ? 'pdf' : result.type.includes('png') ? 'png' : 'jpg';
      link.setAttribute('download', `documento_${tipoDoc}_${docId}.${ext}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  const handleAprovar = async () => {
    const success = await aprovarCandidatura(id);
    if (success) {
      setShowConfirmAprovar(false);
      fetchPrestador(id);
      fetchCandidatura(id);
    }
  };

  const handleRejeitar = async (data: RejeitarCandidaturaFormData) => {
    const success = await rejeitarCandidatura(id, data);
    if (success) {
      setShowRejeitarModal(false);
      rejeitarForm.reset();
      fetchPrestador(id);
      fetchCandidatura(id);
    }
  };

  const handleAtualizarEntrevista = useCallback(async (entrevistaId: string, data: AtualizarEntrevistaRequest): Promise<boolean> => {
    const success = await atualizarEntrevista(entrevistaId, data);
    if (success) {
      const extras = await listarEntrevistas(id);
      setEntrevistasExtras(extras);
      fetchPrestador(id);
    }
    return success;
  }, [atualizarEntrevista, listarEntrevistas, fetchPrestador, id]);

  const entrevistasAtuais = useMemo(() => {
    if (candidatura?.entrevistas && candidatura.entrevistas.length > 0) {
      return candidatura.entrevistas;
    }
    return entrevistasExtras;
  }, [candidatura, entrevistasExtras]);

  const validacaoAprovacao = useMemo(() => {
    const docs = candidatura?.documentos || [];
    const entrevistas = entrevistasAtuais;

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
        !allInterviewsApproved ? 'Ambas as entrevistas (vídeo e presencial) devem estar realizadas e aprovadas.' : null,
        !allDocsApproved ? 'Todos os documentos obrigatórios devem estar submetidos e aprovados.' : null
      ].filter(Boolean) as string[]
    };
  }, [candidatura, entrevistasAtuais]);

  if (loading) {
    return (
      <div className="bg-white rounded-md p-12 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-2 border-[#42b883] border-t-transparent rounded-md animate-spin" />
        <p className="text-sm text-gray-500 mt-4 font-black tracking-tight">A carregar detalhes do prestador...</p>
      </div>
    );
  }

  if (error || !prestadorUser) {
    return (
      <div className="space-y-4 max-w-7xl mx-auto">
        <Link href="/prestadores" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#42b883] transition-colors">
          <ArrowLeft size={14} /> Voltar para Prestadores
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
          <h3 className="text-base font-bold text-red-900">Erro ao carregar</h3>
          <p className="text-xs text-red-700 mt-2 font-medium">{error || 'Prestador não encontrado.'}</p>
        </div>
      </div>
    );
  }

  const p = prestadorUser;
  const profile = p.prestador;
  const localizacao = profile
    ? [profile.provincia, profile.municipio, profile.bairro, profile.morada_detalhe].filter(Boolean).join(', ')
    : '';

  const avaliacao = profile?.avaliacao_media != null
    ? Number(profile.avaliacao_media).toFixed(1)
    : null;

  const canAct = !!profile && (
    profile.status_verificacao === 'pendente' ||
    profile.status_verificacao === 'em_analise' ||
    profile.status_verificacao === 'entrevista_agendada'
  );

  const actionError = candidaturaError || kycError;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Back Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/prestadores"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#42b883] transition-colors"
        >
          <ArrowLeft size={14} /> Voltar para Prestadores
        </Link>
      </div>

      {actionError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-sm text-red-700 font-medium shadow-sm">
          {actionError}
        </div>
      )}

      {/* Main Profile Header Banner */}
      <div className="bg-white border border-gray-100 rounded-md p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
        <div className="flex items-center gap-5">
          {p.foto_perfil_url ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={p.foto_perfil_url}
              alt={p.nome_completo}
              className="w-20 h-20 rounded-md object-cover border border-gray-100 shadow-sm shrink-0"
            />
          ) : (
            <div className="w-20 h-20 rounded-md bg-gradient-to-br from-[#42b883] to-[#3aa374] flex items-center justify-center text-white font-black text-3xl shadow-md shrink-0">
              {p.nome_completo.charAt(0)}
            </div>
          )}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl font-black text-gray-900 tracking-tight">{p.nome_completo}</h1>
              <StatusBadge status={profile?.status_verificacao || 'pendente'} />
              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${p.status === 'activo'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                Conta {p.status === 'activo' ? 'Ativa' : 'Inativa'}
              </span>
            </div>
            {profile?.nome_comercial && (
              <p className="text-xs font-bold text-[#42b883]">{profile.nome_comercial}</p>
            )}
            <p className="text-[11px] font-medium text-gray-500">ID da Conta: {p.id}</p>
          </div>
        </div>

        {/* Quick Stats in Banner */}
        <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 w-full md:w-auto">
          <div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Avaliação</span>
            <div className="flex items-center gap-1 mt-0.5">
              <Star size={16} className="fill-amber-500 text-amber-500" />
              <span className="text-lg font-black text-gray-900">{avaliacao || '0.0'}</span>
            </div>
          </div>
          <div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Concluídos</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Briefcase size={16} className="text-[#42b883]" />
              <span className="text-lg font-black text-gray-900">{profile?.total_servicos_concluidos || 0}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols wide on desktop): Info Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Commercial & Fiscal Details */}
          <div className="bg-white border border-gray-100 rounded-md p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 border-b border-gray-50 pb-2.5 flex items-center gap-2">
              <Building size={16} className="text-[#42b883]" />
              Informações Comerciais e Fiscais
            </h3>

            {profile ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[11px] font-bold text-gray-400 block uppercase">NIF</span>
                    <span className="text-xs font-black text-gray-800">{profile.nif || 'Não informado'}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-gray-400 block uppercase">Tipo de Prestador</span>
                    <span className="text-xs font-black text-gray-800 capitalize">
                      {profile.tipo_prestador === 'singular' ? 'Pessoa Singular' : profile.tipo_prestador === 'coletivo' ? 'Pessoa Coletiva' : 'Não informado'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[11px] font-bold text-gray-400 block uppercase">IBAN para Pagamentos</span>
                    <span className="text-xs font-black text-gray-800 tracking-wider font-mono">{profile.iban || 'Não informado'}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-gray-400 block uppercase">Status do Perfil</span>
                    <span className="text-xs font-black text-gray-800 capitalize">{profile.status_perfil || 'Incompleto'}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-gray-400 block uppercase mb-1">Localização e Endereço</span>
                  <div className="flex items-start gap-2 text-xs font-semibold text-gray-700 bg-gray-50/80 p-3 rounded-md border border-gray-100">
                    <MapPin size={16} className="text-gray-400 shrink-0 mt-0.5" />
                    <span>{localizacao || 'Endereço não cadastrado'}</span>
                  </div>
                </div>

                {profile.bio && (
                  <div>
                    <span className="text-[11px] font-bold text-gray-400 block uppercase mb-1">Biografia / Apresentação</span>
                    <p className="text-xs font-medium text-gray-600 leading-relaxed bg-gray-50/80 p-3 rounded-md border border-gray-100">
                      {profile.bio}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center text-gray-400 border border-dashed border-gray-100 rounded-md">
                <Info size={24} className="mb-2" />
                <p className="text-xs font-medium">Prestador ainda não preencheu o perfil comercial complementar.</p>
              </div>
            )}
          </div>

          {/* Services Offered */}
          <div className="bg-white border border-gray-100 rounded-md p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 border-b border-gray-50 pb-2.5 flex items-center gap-2">
              <Briefcase size={16} className="text-[#42b883]" />
              Serviços Cadastrados ({profile?.servicos?.length || 0})
            </h3>

            {profile?.servicos && profile.servicos.length > 0 ? (
              <div className="space-y-3">
                {profile.servicos.map((servico) => (
                  <div key={servico.id} className="p-4 bg-gray-50/80 rounded-md border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-[13px] font-black text-gray-900">{servico.titulo_servico}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-gray-200 text-gray-700">
                          {servico.modalidade_preco?.replace('_', ' ')}
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${servico.status === 'activo' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'
                          }`}>
                          {servico.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] font-bold text-gray-400">Preço Base: {Number(servico.preco_base).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</p>
                      <p className="text-sm font-black text-[#42b883]">
                        {Number(servico.preco_cliente).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 font-medium py-4 text-center">Nenhum serviço cadastrado até ao momento.</p>
            )}
          </div>

          {/* KYC Documents */}
          <div className="bg-white border border-gray-100 rounded-md p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 border-b border-gray-50 pb-2.5 flex items-center gap-2">
              <FileText size={16} className="text-[#42b883]" />
              Documentos Submetidos no KYC ({profile?.documentos?.length || 0})
            </h3>

            {profile?.documentos && profile.documentos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profile.documentos.map((doc) => (
                  <div key={doc.id} className="p-3.5 bg-gray-50/80 rounded-md border border-gray-100 flex items-center justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <span className="text-[12px] font-black text-gray-800 uppercase block truncate">
                        {doc.tipo_documento?.replace('_', ' ') || 'Documento'}
                      </span>
                      <StatusBadge status={doc.status || 'pendente'} />
                    </div>
                    {doc.url_arquivo && (
                      <button
                        onClick={() => handleDownloadDoc(doc.id, doc.tipo_documento || 'doc')}
                        disabled={downloadingDocId === doc.id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-bold bg-white border border-gray-200 text-gray-700 hover:text-[#42b883] hover:border-[#42b883] rounded-md transition-all shadow-sm shrink-0"
                      >
                        {downloadingDocId === doc.id ? (
                          <div className="w-3 h-3 border-2 border-[#42b883] border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Download size={14} />
                        )}
                        <span>Baixar</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 font-medium py-4 text-center">Nenhum documento registado.</p>
            )}
          </div>
        </div>

        {/* Right Column: Contact, Interviews & Actions */}
        <div className="space-y-6">
          {/* Access & Contact Card */}
          <div className="bg-white border border-gray-100 rounded-md p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 border-b border-gray-50 pb-2.5">
              Contactos e Verificação
            </h3>

            <div className="space-y-3.5">
              <div className="flex items-start gap-3">
                <Mail size={16} className="text-gray-400 mt-0.5" />
                <div className="space-y-0.5 min-w-0">
                  <span className="text-[11px] font-bold text-gray-400 block uppercase">E-mail</span>
                  <span className="text-xs font-black text-gray-800 truncate block" title={p.email}>{p.email}</span>
                  {p.email_verified_at ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md mt-1">
                      <ShieldCheck size={10} /> Verificado em {new Date(p.email_verified_at).toLocaleDateString('pt-AO')}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md mt-1">
                      Não verificado
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone size={16} className="text-gray-400 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-gray-400 block uppercase">Telefone</span>
                  <span className="text-xs font-black text-gray-800">{p.telefone}</span>
                  {p.telefone_verificado_at ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md mt-1">
                      <ShieldCheck size={10} /> Verificado em {new Date(p.telefone_verificado_at).toLocaleDateString('pt-AO')}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md mt-1">
                      Não verificado
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar size={16} className="text-gray-400 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-gray-400 block uppercase">Data de Registo</span>
                  <span className="text-xs font-black text-gray-800">
                    {new Date(p.created_at).toLocaleString('pt-AO', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Panel: Aprovar / Rejeitar Candidatura */}
          {canAct && (
            <div className="bg-white border border-gray-100 rounded-md shadow-sm overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-100 px-5 py-3">
                <h3 className="text-[13px] font-black text-gray-900 uppercase flex items-center gap-2 tracking-wider">
                  <ShieldCheck size={16} className="text-[#42b883]" />
                  Aprovação da Candidatura
                </h3>
              </div>
              <div className="p-5 flex flex-col gap-3">
                <button
                  onClick={() => setShowConfirmAprovar(true)}
                  disabled={!validacaoAprovacao.isAprovavel}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-md font-bold text-[13px] transition-colors shadow-sm ${validacaoAprovacao.isAprovavel
                    ? 'bg-[#42b883] hover:bg-[#3aa374] text-white'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  <CheckCircle size={16} />
                  Aprovar e Ativar Conta
                </button>
                {!validacaoAprovacao.isAprovavel && (
                  <div className="text-[11px] text-amber-700 bg-amber-50 p-2.5 rounded-md border border-amber-200 flex flex-col gap-1">
                    <span className="font-bold flex items-center gap-1.5"><AlertTriangle size={13} /> Requisitos Pendentes:</span>
                    <ul className="list-disc pl-5 space-y-1 mt-1 font-medium">
                      {validacaoAprovacao.reasons.map((reason, i) => (
                        <li key={i}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <button
                  onClick={() => setShowRejeitarModal(true)}
                  className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-2.5 rounded-md font-bold text-[13px] transition-colors"
                >
                  <XCircle size={16} />
                  Rejeitar Candidatura
                </button>
              </div>
            </div>
          )}

          {/* Interviews Section */}
          <div className="bg-white border border-gray-100 rounded-md p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 border-b border-gray-50 pb-2.5 flex items-center gap-2">
              <Video size={16} className="text-[#42b883]" />
              Entrevistas ({entrevistasAtuais?.length || 0})
            </h3>

            {entrevistasAtuais && entrevistasAtuais.length > 0 ? (
              <div className="space-y-3">
                {entrevistasAtuais.map((ent) => (
                  <EntrevistaCard
                    key={ent.id}
                    entrevista={ent}
                    onAtualizar={handleAtualizarEntrevista}
                  />
                ))}
              </div>
            ) : (
              <div className="p-4 text-center">
                <ClipboardCheck size={24} className="mx-auto text-gray-300 mb-2" />
                <p className="text-xs text-gray-400 font-medium">Sem histórico de entrevistas.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Approve Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmAprovar}
        onClose={() => setShowConfirmAprovar(false)}
        onConfirm={handleAprovar}
        title="Aprovar e Ativar Conta"
        message="Tem a certeza que deseja aprovar esta candidatura? A conta do prestador será ativada e ele ganhará acesso completo."
        confirmLabel="Confirmar Aprovação"
        variant="success"
        loading={candidaturaLoading}
      />

      {/* Reject Modal */}
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
              disabled={candidaturaLoading}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={rejeitarForm.handleSubmit(handleRejeitar)}
              isLoading={candidaturaLoading}
            >
              Confirmar Rejeição
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <div className="bg-red-50 text-red-700 p-3 rounded-md flex items-start gap-2 mb-2 text-[12px] font-medium border border-red-100">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            Esta ação é irreversível. O prestador será imediatamente notificado com o motivo especificado e a conta ficará inativa.
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
    </div>
  );
}
