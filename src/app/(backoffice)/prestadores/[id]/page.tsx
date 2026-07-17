'use client';
 
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { usePrestadorDetail } from '@/hooks/users/users.hooks';
import { ArrowLeft, User, Mail, Phone, Calendar, ShieldCheck, MapPin, Star, Award, BookOpen, FileText, CalendarCheck } from 'lucide-react';
import Link from 'next/link';
import { StatusBadge } from '@/components/common/ui/Badge';
 
export default function PrestadorDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { prestador, loading, error, fetchPrestador } = usePrestadorDetail();
  const [activeTab, setActiveTab] = useState<'perfil' | 'documentos' | 'servicos' | 'entrevistas'>('perfil');
 
  useEffect(() => {
    if (id) {
      fetchPrestador(id);
    }
  }, [id, fetchPrestador]);
 
  if (loading) {
    return (
      <div className="bg-white rounded-sm p-12 shadow-sm border border-gray-100/80 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-2 border-[#42b883] border-t-transparent rounded-sm animate-spin" />
        <p className="text-sm text-gray-500 mt-4 font-medium">A carregar detalhes do prestador...</p>
      </div>
    );
  }
 
  if (error || !prestador) {
    return (
      <div className="space-y-4">
        <Link href="/prestadores" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#42b883] transition-colors">
          <ArrowLeft size={14} /> Voltar para Prestadores
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-sm p-6 text-center">
          <h3 className="text-base font-bold text-red-900">Erro ao carregar</h3>
          <p className="text-xs text-red-700 mt-2 font-medium">{error || 'Prestador não encontrado.'}</p>
        </div>
      </div>
    );
  }
 
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/prestadores"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#42b883] transition-colors"
        >
          <ArrowLeft size={14} /> Voltar para Prestadores
        </Link>
      </div>
 
      {/* Header Info */}
      <div className="bg-white border border-gray-100 rounded-sm p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-sm bg-gradient-to-br from-[#42b883] to-[#3aa374] flex items-center justify-center text-white font-bold text-3xl shadow-md shrink-0">
          {prestador.nome_completo.charAt(0)}
        </div>
        <div className="flex-1 text-center sm:text-left space-y-1.5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <h1 className="text-xl font-black text-gray-900 tracking-tight">{prestador.nome_completo}</h1>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <StatusBadge status={prestador.status} />
              {prestador.prestador?.status_verificacao && (
                <StatusBadge status={prestador.prestador.status_verificacao} />
              )}
            </div>
          </div>
          {prestador.prestador?.nome_comercial && (
            <p className="text-sm font-bold text-[#42b883]">{prestador.prestador.nome_comercial}</p>
          )}
          <p className="text-xs font-semibold text-gray-400">ID da Conta: {prestador.id}</p>
        </div>
      </div>
 
      {/* Tabs */}
      <div className="flex border-b border-gray-100 bg-white px-4 rounded-sm shadow-sm overflow-x-auto">
        {([
          { id: 'perfil', label: 'Perfil Geral', icon: User },
          { id: 'documentos', label: 'Documentos KYC', icon: FileText },
          { id: 'servicos', label: 'Serviços Oferecidos', icon: BookOpen },
          { id: 'entrevistas', label: 'Entrevistas KYC', icon: CalendarCheck }
        ] as const).map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-4 text-xs font-bold border-b-2 transition-all cursor-pointer shrink-0 ${
                active
                  ? 'border-[#42b883] text-[#42b883]'
                  : 'border-transparent text-gray-500 hover:text-gray-950 hover:border-gray-200'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
 
      {/* Tab Content */}
      <div className="min-h-[300px]">
        {activeTab === 'perfil' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 space-y-0">
            {/* Contacts */}
            <div className="bg-white border border-gray-100 rounded-sm p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 border-b border-gray-50 pb-2">
                Contatos e Acesso
              </h3>
              <div className="space-y-3.5">
                <div className="flex items-start gap-3">
                  <Mail size={16} className="text-gray-400 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold text-gray-400 block uppercase">E-mail</span>
                    <span className="text-xs font-semibold text-gray-700">{prestador.email}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-gray-400 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold text-gray-400 block uppercase">Telefone</span>
                    <span className="text-xs font-semibold text-gray-700">{prestador.telefone}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar size={16} className="text-gray-400 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold text-gray-400 block uppercase">Registado em</span>
                    <span className="text-xs font-semibold text-gray-700">
                      {new Date(prestador.created_at).toLocaleDateString('pt-AO', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
 
            {/* Professional Data */}
            <div className="bg-white border border-gray-100 rounded-sm p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 border-b border-gray-50 pb-2">
                Dados do Prestador
              </h3>
              {prestador.prestador ? (
                <div className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[11px] font-bold text-gray-400 block uppercase">Tipo Prestador</span>
                      <span className="text-xs font-semibold text-gray-700 capitalize">
                        {prestador.prestador.tipo_prestador === 'singular' ? 'Pessoa Singular' : 'Pessoa Coletiva'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-gray-400 block uppercase">NIF</span>
                      <span className="text-xs font-semibold text-gray-700">{prestador.prestador.nif || 'Não informado'}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-gray-400 block uppercase">IBAN</span>
                    <span className="text-xs font-semibold text-gray-700 font-mono">{prestador.prestador.iban || 'Não informado'}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-gray-400 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-bold text-gray-400 block uppercase">Endereço</span>
                      <span className="text-xs font-semibold text-gray-700">
                        {[
                          prestador.prestador.provincia,
                          prestador.prestador.municipio,
                          prestador.prestador.bairro,
                          prestador.prestador.morada_detalhe
                        ].filter(Boolean).join(', ') || 'Sem morada cadastrada'}
                      </span>
                    </div>
                  </div>
                  {prestador.prestador.bio && (
                    <div>
                      <span className="text-[11px] font-bold text-gray-400 block uppercase">Biografia</span>
                      <p className="text-xs text-gray-600 font-medium italic mt-1 bg-gray-50/50 p-2.5 rounded-sm border border-gray-100">{prestador.prestador.bio}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center p-6 text-gray-400 border border-dashed border-gray-100 rounded-sm">
                  <p className="text-xs font-medium">Este prestador não preencheu o perfil operacional.</p>
                </div>
              )}
            </div>
          </div>
        )}
 
        {activeTab === 'documentos' && (
          <div className="bg-white border border-gray-100 rounded-sm p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 border-b border-gray-50 pb-2">
              Documentação KYC Submetida
            </h3>
            {prestador.prestador?.documentos && prestador.prestador.documentos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prestador.prestador.documentos.map((doc) => (
                  <div key={doc.id} className="border border-gray-100 rounded-sm p-4 flex justify-between items-center bg-gray-50/30 hover:border-gray-200 transition-colors">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-gray-800 uppercase tracking-tight">{doc.tipo_documento.replace('_', ' ')}</p>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={doc.status} />
                      </div>
                    </div>
                    <a
                      href={doc.url_arquivo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-sm hover:text-[#42b883] hover:border-[#42b883] hover:bg-[#42b883]/5 text-[11px] font-bold shadow-sm transition-all"
                    >
                      Visualizar
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-12 text-gray-400 border border-dashed border-gray-100 rounded-sm">
                <FileText size={28} className="mx-auto mb-2 text-gray-300" />
                <p className="text-xs font-medium">Nenhum documento KYC submetido até ao momento.</p>
              </div>
            )}
          </div>
        )}
 
        {activeTab === 'servicos' && (
          <div className="bg-white border border-gray-100 rounded-sm p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 border-b border-gray-50 pb-2">
              Serviços Prestados no Catálogo
            </h3>
            {prestador.prestador?.servicos && prestador.prestador.servicos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prestador.prestador.servicos.map((s) => (
                  <div key={s.id} className="border border-gray-100 rounded-sm p-4 flex justify-between items-center bg-gray-50/30 hover:border-gray-200 transition-colors">
                    <div>
                      <p className="text-xs font-bold text-gray-900">{s.nome}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 font-bold uppercase block">Preço/Hora</span>
                      <span className="text-xs font-black text-[#42b883]">
                        {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(Number(s.preco_hora))}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-12 text-gray-400 border border-dashed border-gray-100 rounded-sm">
                <BookOpen size={28} className="mx-auto mb-2 text-gray-300" />
                <p className="text-xs font-medium">Nenhum serviço associado a este prestador no catálogo.</p>
              </div>
            )}
          </div>
        )}
 
        {activeTab === 'entrevistas' && (
          <div className="bg-white border border-gray-100 rounded-sm p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 border-b border-gray-50 pb-2">
              Histórico de Entrevistas KYC
            </h3>
            {prestador.prestador?.entrevistas && prestador.prestador.entrevistas.length > 0 ? (
              <div className="space-y-4">
                {prestador.prestador.entrevistas.map((ent) => (
                  <div key={ent.id} className="border border-gray-100 rounded-sm p-4 bg-gray-50/30 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Tipo Entrevista</span>
                        <p className="text-xs font-bold text-gray-800 capitalize">{ent.tipo}</p>
                      </div>
                      <StatusBadge status={ent.status} />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-[12px] font-semibold text-gray-600">
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">Agendada Para</span>
                        <span>{new Date(ent.agendada_para).toLocaleString('pt-AO')}</span>
                      </div>
                      {ent.realizada_em && (
                        <div>
                          <span className="text-[10px] text-gray-400 font-bold uppercase block">Realizada em</span>
                          <span>{new Date(ent.realizada_em).toLocaleString('pt-AO')}</span>
                        </div>
                      )}
                    </div>
                    {ent.resultado && (
                      <div className="text-[12px] font-semibold text-gray-600">
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">Resultado</span>
                        <p className="text-xs mt-1 font-medium bg-white p-2 rounded-sm border border-gray-100">{ent.resultado}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-12 text-gray-400 border border-dashed border-gray-100 rounded-sm">
                <CalendarCheck size={28} className="mx-auto mb-2 text-gray-300" />
                <p className="text-xs font-medium">Nenhuma entrevista ou agendamento KYC registado.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
