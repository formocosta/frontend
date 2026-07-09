'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  FileText,
  MessageSquare,
  User,
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/common/form/Button';
import { StatusBadge } from '@/components/common/ui/Badge';
import { useSolicitacaoDetail } from '@/hooks/solicitacoes/solicitacoes.hooks';

export default function SolicitacaoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const {
    solicitacao,
    loading,
    error,
    fetchSolicitacao,
    fetchMensagens,
  } = useSolicitacaoDetail();

  useEffect(() => {
    fetchSolicitacao(id);
    fetchMensagens(id);
  }, [id, fetchSolicitacao, fetchMensagens]);

  if (loading && !solicitacao) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-2 border-[#42b883] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error && !solicitacao) {
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

  if (!solicitacao) return null;

  const localizacao = [solicitacao.provincia, solicitacao.municipio].filter(Boolean).join(', ');
  const endereco = [solicitacao.morada_execucao, solicitacao.municipio, solicitacao.provincia].filter(Boolean).join(', ');
  const dataFormatada = solicitacao.data_pretendida
    ? new Date(solicitacao.data_pretendida).toLocaleDateString('pt-AO', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()} leftIcon={<ArrowLeft size={16} />}>
          Voltar
        </Button>
        <PageHeader
          title={solicitacao.servico?.titulo_servico || 'Solicitação'}
          description={`Criada em ${new Date(solicitacao.created_at).toLocaleDateString('pt-AO')}`}
          action={<StatusBadge status={solicitacao.status_id} />}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          {solicitacao.descricao_cliente && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-3">
                <FileText size={16} />
                Descrição do Cliente
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {solicitacao.descricao_cliente}
              </p>
            </div>
          )}

          {/* Service details */}
          {solicitacao.servico && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Detalhes do Serviço</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="text-[12px] text-gray-500 font-medium">Serviço</span>
                  <span className="text-[12px] text-gray-900 font-bold">{solicitacao.servico.titulo_servico}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="text-[12px] text-gray-500 font-medium">Preço Base</span>
                  <span className="text-[12px] text-gray-900 font-bold">
                    {Number(solicitacao.servico.preco_base).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="text-[12px] text-gray-500 font-medium">Preço Cliente</span>
                  <span className="text-[12px] text-[#42b883] font-bold">
                    {Number(solicitacao.servico.preco_cliente).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-[12px] text-gray-500 font-medium">Modalidade</span>
                  <span className="text-[12px] text-gray-900 font-bold capitalize">{solicitacao.servico.modalidade_preco}</span>
                </div>
              </div>
              {solicitacao.servico.descricao_detalhada && (
                <p className="text-[12px] text-gray-500 mt-3 pt-3 border-t border-gray-50">
                  {solicitacao.servico.descricao_detalhada}
                </p>
              )}
            </div>
          )}

          {/* Messages */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4">
              <MessageSquare size={16} />
              Mensagens ({solicitacao.mensagens?.length || 0})
            </h3>
            {solicitacao.mensagens && solicitacao.mensagens.length > 0 ? (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {solicitacao.mensagens.map((msg) => (
                  <div key={msg.id} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-[12px] text-gray-700">{msg.conteudo}</p>
                    <p className="text-[10px] text-gray-400 font-medium mt-1">
                      {new Date(msg.created_at || '').toLocaleDateString('pt-AO', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 font-medium text-center py-4">
                Nenhuma mensagem nesta solicitação
              </p>
            )}
          </div>
        </div>

        {/* Sidebar info */}
        <div className="space-y-6">
          {/* Location */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-3">
              <MapPin size={16} />
              Localização
            </h3>
            <div className="space-y-2 text-[12px]">
              {localizacao && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={12} className="text-gray-400" />
                  <span>{localizacao}</span>
                </div>
              )}
              {solicitacao.morada_execucao && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={12} className="text-gray-400" />
                  <span>{solicitacao.morada_execucao}</span>
                </div>
              )}
              {!localizacao && !solicitacao.morada_execucao && (
                <p className="text-gray-400 font-medium">Sem localização definida</p>
              )}
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-3">
              <Calendar size={16} />
              Agendamento
            </h3>
            <div className="space-y-2 text-[12px]">
              {dataFormatada ? (
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={12} className="text-gray-400" />
                  <span>{dataFormatada}</span>
                </div>
              ) : (
                <p className="text-gray-400 font-medium">Sem data definida</p>
              )}
              {solicitacao.hora_pretendida && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock size={12} className="text-gray-400" />
                  <span>{solicitacao.hora_pretendida}</span>
                </div>
              )}
            </div>
          </div>

          {/* Provider */}
          {solicitacao.prestador && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-3">
                <User size={16} />
                Prestador
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#42b883] to-[#3aa374] flex items-center justify-center text-white font-bold text-sm">
                  {solicitacao.prestador.nome?.charAt(0) || '?'}
                </div>
                <div>
                  <p className="text-[13px] font-bold text-gray-900">{solicitacao.prestador.nome}</p>
                  {solicitacao.prestador.avaliacao_media != null && (
                    <div className="flex items-center gap-1 text-[11px] text-amber-600 font-semibold">
                      <span>{Number(solicitacao.prestador.avaliacao_media).toFixed(1)}</span>
                      <span>★</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Price */}
          {solicitacao.preco_acordado != null && (
            <div className="bg-[#42b883]/5 border border-[#42b883]/20 rounded-xl p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-2">Preço Acordado</h3>
              <p className="text-xl font-extrabold text-[#42b883]">
                {Number(solicitacao.preco_acordado).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
              </p>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Cronograma</h3>
            <div className="space-y-3 text-[11px]">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-gray-300" />
                <div>
                  <p className="text-gray-900 font-bold">Criada</p>
                  <p className="text-gray-500">{new Date(solicitacao.created_at).toLocaleDateString('pt-AO', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
              {solicitacao.aceite_em && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <div>
                    <p className="text-gray-900 font-bold">Aceite</p>
                    <p className="text-gray-500">{new Date(solicitacao.aceite_em).toLocaleDateString('pt-AO', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              )}
              {solicitacao.iniciado_em && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <div>
                    <p className="text-gray-900 font-bold">Iniciada</p>
                    <p className="text-gray-500">{new Date(solicitacao.iniciado_em).toLocaleDateString('pt-AO', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              )}
              {solicitacao.concluido_em && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <div>
                    <p className="text-gray-900 font-bold">Concluída</p>
                    <p className="text-gray-500">{new Date(solicitacao.concluido_em).toLocaleDateString('pt-AO', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              )}
              {solicitacao.motivo_rejeicao && (
                <div className="mt-2 p-2 bg-red-50 rounded-lg border border-red-100">
                  <p className="text-[11px] text-red-700 font-medium">
                    <span className="font-bold">Motivo rejeição:</span> {solicitacao.motivo_rejeicao}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
