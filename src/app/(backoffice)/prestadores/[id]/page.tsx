'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { usePrestadorDetail, usePrestadorDocumentos } from '@/hooks/users/users.hooks';
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
  CreditCard,
  Building,
  Download,
  Info,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { StatusBadge } from '@/components/common/ui/Badge';

export default function PrestadorDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { prestadorUser, loading, error, fetchPrestador } = usePrestadorDetail();
  const { loading: downloadingDocId, obterDocumentoBlob } = usePrestadorDocumentos();

  useEffect(() => {
    if (id) {
      fetchPrestador(id);
    }
  }, [id, fetchPrestador]);

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

        {/* Right Column: Contact & Interview Info */}
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

          {/* Interviews Section */}
          <div className="bg-white border border-gray-100 rounded-md p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 border-b border-gray-50 pb-2.5 flex items-center gap-2">
              <Video size={16} className="text-[#42b883]" />
              Entrevistas ({profile?.entrevistas?.length || 0})
            </h3>

            {profile?.entrevistas && profile.entrevistas.length > 0 ? (
              <div className="space-y-3">
                {profile.entrevistas.map((ent) => (
                  <div key={ent.id} className="p-3.5 bg-gray-50/80 rounded-md border border-gray-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase text-gray-800">
                        {ent.tipo?.replace('_', ' ') || 'Entrevista'}
                      </span>
                      <StatusBadge status={ent.status || 'pendente'} />
                    </div>
                    {ent.agendada_para && (
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-600">
                        <Clock size={12} className="text-gray-400" />
                        <span>Agendada: {new Date(ent.agendada_para).toLocaleString('pt-AO')}</span>
                      </div>
                    )}
                    {ent.resultado && (
                      <div className="text-[11px] font-bold text-gray-700 bg-white p-2 rounded-md border border-gray-100">
                        Resultado: <span className="capitalize">{ent.resultado}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 font-medium py-4 text-center">Sem histórico de entrevistas.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
