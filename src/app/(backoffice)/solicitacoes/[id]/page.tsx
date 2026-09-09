'use client';

import { useEffect, useState, type ReactNode, type ElementType } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Package,
  MapPin,
  Calendar,
  Clock,
  FileText,
  MessageSquare,
  User,
  Wallet,
  Star,
  CheckCircle2,
  PlusCircle,
  PlayCircle,
  XCircle,
  CreditCard,
  ArrowLeftRight,
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { StatusBadge } from '@/components/common/ui/Badge';
import { useSolicitacaoDetail } from '@/hooks/solicitacoes/solicitacoes.hooks';
import { usePagamentos } from '@/hooks/finance/finance.hooks';

const formatCurrency = (value: number) =>
  Number(value).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' });

const formatDate = (iso?: string | null, withHour = false) => {
  if (!iso) return '';
  const opts: Intl.DateTimeFormatOptions = withHour
    ? { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }
    : { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' };
  return new Date(iso).toLocaleDateString('pt-AO', opts);
};

const formatModalidade = (modalidade?: string | null) =>
  !modalidade
    ? 'Não especificada'
    : modalidade.replace(/[_]+/g, ' ').replace(/\b\w/g, (ch) => ch.toUpperCase());

interface SectionCardProps {
  icon: ElementType;
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

function SectionCard({ icon: Icon, title, action, children, className }: SectionCardProps) {
  return (
    <div className={`bg-white border border-gray-100 rounded-md p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] ${className || ''}`}>
      <div className="flex items-center justify-between gap-3 pb-2.5 mb-4 border-b border-gray-50">
        <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center gap-2">
          <Icon size={15} className="text-[#42b883]" />
          {title}
        </h3>
        {action}
      </div>
      {children}
    </div>
  );
}

interface InfoRowProps {
  label: string;
  value: ReactNode;
  valueClassName?: string;
  last?: boolean;
}

function InfoRow({ label, value, valueClassName, last }: InfoRowProps) {
  return (
    <div className={`flex items-center justify-between gap-4 py-3 ${last ? '' : 'border-b border-gray-50'}`}>
      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider shrink-0">{label}</span>
      <span className={`text-[13px] font-black text-gray-800 text-right ${valueClassName || ''}`}>{value}</span>
    </div>
  );
}

function StatCell({ icon: Icon, label, value }: { icon: ElementType; label: string; value: ReactNode }) {
  return (
    <div className="px-6 py-4 flex items-start gap-3 min-w-0">
      <div className="w-8 h-8 shrink-0 rounded-md bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400">
        <Icon size={15} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
        <p className="text-[12px] font-bold text-gray-700 mt-0.5 truncate">{value || '—'}</p>
      </div>
    </div>
  );
}

interface TimelineStepProps {
  icon: ElementType;
  iconClassName: string;
  title: string;
  date: string;
  last?: boolean;
}

function TimelineStep({ icon: Icon, iconClassName, title, date, last }: TimelineStepProps) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center shrink-0">
        <div className={`w-7 h-7 rounded-md flex items-center justify-center text-white shadow-sm ${iconClassName}`}>
          <Icon size={13} />
        </div>
        {!last && <div className="w-px flex-1 bg-gray-200 my-1" />}
      </div>
      <div className={`${last ? '' : 'pb-2'} min-w-0`}>
        <p className="text-[12px] font-black text-gray-900 tracking-tight">{title}</p>
        <p className="text-[11px] text-gray-500 font-medium mt-0.5">{date}</p>
      </div>
    </div>
  );
}

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

  const { confirmarPagamento, loading: confirmingPayment } = usePagamentos();
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const handleConfirmarPagamento = async () => {
    if (!id) return;
    const ok = await confirmarPagamento(id);
    if (ok) {
      setActionSuccess('Pagamento confirmado com sucesso! O repasse pendente foi gerado automaticamente.');
      fetchSolicitacao(id);
      setTimeout(() => setActionSuccess(null), 5000);
    }
  };

  useEffect(() => {
    if (id) {
      fetchSolicitacao(id);
      fetchMensagens(id);
    }
  }, [id, fetchSolicitacao, fetchMensagens]);

  if (loading && !solicitacao) {
    return (
      <div className="bg-white rounded-md p-12 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-2 border-[#42b883] border-t-transparent rounded-md animate-spin" />
        <p className="text-sm text-gray-500 mt-4 font-black tracking-tight">A carregar detalhes da solicitação...</p>
      </div>
    );
  }

  if (error && !solicitacao) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <PageHeader
          title="Detalhes da Solicitação"
          description="Não foi possível carregar esta solicitação."
          backButton={
            <button
              onClick={() => router.back()}
              className="w-9 h-9 flex items-center justify-center rounded-md bg-white border border-gray-200 text-gray-500 hover:text-[#42b883] hover:border-[#42b883] hover:bg-[#42b883]/5 transition-all shadow-sm"
            >
              <ArrowLeft size={16} />
            </button>
          }
        />
        <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center shadow-sm">
          <XCircle size={24} className="mx-auto text-red-400 mb-2" />
          <h3 className="text-base font-black text-red-900 tracking-tight">Erro ao carregar</h3>
          <p className="text-xs text-red-700 mt-2 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!solicitacao) return null;

  const localizacao = [solicitacao.provincia, solicitacao.municipio].filter(Boolean).join(', ');
  const servico = solicitacao.servico;
  const precoAcordado = solicitacao.preco_acordado;
  const totalMensagens = solicitacao.mensagens?.length || 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <PageHeader
        title="Detalhes da Solicitação"
        description={`${servico?.titulo_servico || 'Solicitação de serviço'} • Criada em ${formatDate(solicitacao.created_at, true)}`}
        backButton={
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-md bg-white border border-gray-200 text-gray-500 hover:text-[#42b883] hover:border-[#42b883] hover:bg-[#42b883]/5 transition-all shadow-sm"
          >
            <ArrowLeft size={16} />
          </button>
        }
        action={<StatusBadge status={solicitacao.status_id} />}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-sm text-red-700 font-medium shadow-sm">
          {error}
        </div>
      )}

      {/* Overview / Resumo */}
      <div className="bg-white border border-gray-100 rounded-md shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="p-6 flex flex-col md:flex-row md:items-center gap-5 border-b border-gray-50 bg-gradient-to-r from-[#42b883]/[0.06] to-transparent">
          <div className="w-14 h-14 shrink-0 rounded-md bg-white border border-[#42b883]/25 flex items-center justify-center text-[#42b883] shadow-sm">
            <Package size={26} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Serviço Solicitado</p>
            <h2 className="text-lg font-black text-gray-900 tracking-tight truncate">
              {servico?.titulo_servico || 'Solicitação de Serviço'}
            </h2>
            {solicitacao.descricao_cliente ? (
              <p className="text-[12px] text-gray-500 font-medium mt-1 leading-relaxed line-clamp-2">
                {solicitacao.descricao_cliente}
              </p>
            ) : (
              <p className="text-[12px] text-gray-400 font-medium mt-1">Sem descrição fornecida pelo cliente.</p>
            )}
          </div>
          {precoAcordado != null && (
            <div className="shrink-0 text-left md:text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Preço Acordado</p>
              <p className="text-2xl font-black text-[#42b883] tracking-tight mt-0.5">{formatCurrency(precoAcordado)}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 divide-gray-50 sm:divide-x">
          <StatCell icon={MapPin} label="Localização" value={localizacao || 'Não definida'} />
          <StatCell icon={Calendar} label="Data Pretendida" value={solicitacao.data_pretendida ? formatDate(solicitacao.data_pretendida, false) : 'Não definida'} />
          <StatCell icon={Clock} label="Hora" value={solicitacao.hora_pretendida || 'Não definida'} />
          <StatCell icon={User} label="Prestador" value={solicitacao.prestador?.nome || 'Sem prestador'} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Descrição do cliente */}
          {solicitacao.descricao_cliente && (
            <SectionCard icon={FileText} title="Descrição do Cliente">
              <div className="bg-gray-50/80 border border-gray-100 rounded-md p-4">
                <p className="text-[13px] text-gray-600 font-medium leading-relaxed">
                  {solicitacao.descricao_cliente}
                </p>
              </div>
            </SectionCard>
          )}

          {/* Detalhes do serviço */}
          {servico && (
            <SectionCard icon={Package} title="Detalhes do Serviço">
              <div>
                <InfoRow label="Serviço" value={servico.titulo_servico} />
                <InfoRow label="Preço Base" value={formatCurrency(Number(servico.preco_base))} />
                <InfoRow
                  label="Preço para o Cliente"
                  value={formatCurrency(Number(servico.preco_cliente))}
                  valueClassName="text-[#42b883]"
                />
                <InfoRow label="Modalidade" value={formatModalidade(servico.modalidade_preco)} last />
              </div>
              {servico.descricao_detalhada && (
                <div className="mt-4 pt-4 border-t border-gray-50">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Descrição Detalhada</p>
                  <p className="text-[12px] text-gray-500 font-medium leading-relaxed">{servico.descricao_detalhada}</p>
                </div>
              )}
            </SectionCard>
          )}

          {/* Mensagens */}
          <SectionCard
            icon={MessageSquare}
            title="Mensagens"
            action={
              <span className="text-[10px] font-black text-[#42b883] bg-[#42b883]/10 px-2 py-1 rounded-md">
                {totalMensagens} {totalMensagens === 1 ? 'mensagem' : 'mensagens'}
              </span>
            }
          >
            {solicitacao.mensagens && solicitacao.mensagens.length > 0 ? (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-100">
                {solicitacao.mensagens.map((msg) => (
                  <div
                    key={msg.id}
                    className="group bg-gray-50/80 border border-gray-100 rounded-lg p-3.5 hover:border-[#42b883]/25 hover:bg-gray-50 transition-all"
                  >
                    <p className="text-[13px] text-gray-700 font-medium leading-relaxed">{msg.conteudo}</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100/80">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                        Mensagem #{String(msg.id).slice(-4)}
                      </span>
                      {msg.created_at && (
                        <span className="text-[10px] text-gray-400 font-semibold">
                          {formatDate(msg.created_at, true)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center text-gray-400 border border-dashed border-gray-100 rounded-md">
                <MessageSquare size={22} className="mb-2" />
                <p className="text-xs font-medium">Nenhuma mensagem registada nesta solicitação</p>
              </div>
            )}
          </SectionCard>
        </div>

        {/* Coluna lateral */}
        <div className="space-y-6">
          {/* Cronograma */}
          <SectionCard icon={Calendar} title="Cronograma">
            <div>
              <TimelineStep
                icon={PlusCircle}
                iconClassName="bg-gray-400"
                title="Criada"
                date={formatDate(solicitacao.created_at, true)}
              />
              {solicitacao.aceite_em && (
                <TimelineStep
                  icon={CheckCircle2}
                  iconClassName="bg-blue-500"
                  title="Aceite"
                  date={formatDate(solicitacao.aceite_em, true)}
                />
              )}
              {solicitacao.iniciado_em && (
                <TimelineStep
                  icon={PlayCircle}
                  iconClassName="bg-amber-500"
                  title="Iniciada"
                  date={formatDate(solicitacao.iniciado_em, true)}
                />
              )}
              {solicitacao.concluido_em && (
                <TimelineStep
                  icon={CheckCircle2}
                  iconClassName="bg-emerald-500"
                  title="Concluída"
                  date={formatDate(solicitacao.concluido_em, true)}
                  last
                />
              )}
              {!solicitacao.aceite_em && !solicitacao.iniciado_em && !solicitacao.concluido_em && (
                <p className="text-[11px] text-gray-400 font-medium pl-10 py-1">Sem eventos registados até ao momento.</p>
              )}
            </div>
            {solicitacao.motivo_rejeicao && (
              <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-md">
                <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-0.5">Motivo de Rejeição</p>
                <p className="text-[11px] text-red-700 font-medium leading-relaxed">{solicitacao.motivo_rejeicao}</p>
              </div>
            )}
          </SectionCard>

          {/* Prestador */}
          {solicitacao.prestador && (
            <SectionCard icon={User} title="Prestador Atribuído">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 shrink-0 rounded-md bg-gradient-to-br from-[#42b883] to-[#3aa374] flex items-center justify-center text-white font-black text-lg shadow-inner">
                  {solicitacao.prestador.nome?.charAt(0) || '?'}
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-black text-gray-900 tracking-tight truncate">
                    {solicitacao.prestador.nome}
                  </p>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">ID: {solicitacao.prestador.id}</span>
                  {solicitacao.prestador.avaliacao_media != null && (
                    <div className="flex items-center gap-1 mt-1">
                      <Star size={12} className="fill-amber-500 text-amber-500" />
                      <span className="text-[12px] font-black text-amber-600">
                        {Number(solicitacao.prestador.avaliacao_media).toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </SectionCard>
          )}

          {/* Preço acordado & Gestão Financeira */}
          {precoAcordado != null && (
            <div className="bg-[#42b883]/[0.05] border border-[#42b883]/20 rounded-md p-6 shadow-[0_4px_24px_rgba(66,184,131,0.04)] space-y-4">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Wallet size={13} />
                  Preço Acordado
                </p>
                <StatusBadge status={solicitacao.status_id} />
              </div>
              <p className="text-2xl font-black text-[#42b883] tracking-tight">{formatCurrency(precoAcordado)}</p>
              {servico && (
                <p className="text-[11px] text-gray-400 font-medium mt-1.5">
                  Preço base do serviço: {formatCurrency(Number(servico.preco_base))}
                </p>
              )}

              {/* Status do Pagamento do Cliente */}
              <div className="pt-3 border-t border-gray-200/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    <CreditCard size={13} className="text-[#42b883]" />
                    Pagamento Cliente
                  </span>
                  <span className={`text-[11px] font-black px-2 py-0.5 rounded ${
                    solicitacao.pagamento?.status === 'confirmado'
                      ? 'bg-emerald-100 text-emerald-800'
                      : solicitacao.pagamento?.status === 'pendente'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {solicitacao.pagamento?.status === 'confirmado'
                      ? 'Confirmado'
                      : solicitacao.pagamento?.status === 'pendente'
                      ? 'Em Análise (Comprovativo Recebido)'
                      : 'Pendente'}
                  </span>
                </div>

                {/* Status do Repasse ao Prestador */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    <ArrowLeftRight size={13} className="text-blue-500" />
                    Repasse Prestador
                  </span>
                  <span className={`text-[11px] font-black px-2 py-0.5 rounded ${
                    solicitacao.repasse?.status === 'pago'
                      ? 'bg-blue-100 text-blue-800'
                      : solicitacao.repasse?.status === 'pendente'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {solicitacao.repasse?.status === 'pago'
                      ? `Pago (${formatCurrency(Number(solicitacao.repasse.valor_repasse))})`
                      : solicitacao.repasse?.status === 'pendente'
                      ? `Repasse Pendente (${formatCurrency(Number(solicitacao.repasse.valor_repasse))})`
                      : 'Aguardando Confirmação'}
                  </span>
                </div>

                {/* Botão para Confirmar Pagamento do Cliente se ainda não confirmado */}
                {solicitacao.pagamento?.status !== 'confirmado' && (
                  <button
                    onClick={handleConfirmarPagamento}
                    disabled={confirmingPayment}
                    className="w-full mt-3 py-2.5 px-4 bg-[#42b883] hover:bg-[#3aa374] text-white text-[12px] font-black rounded-md shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <CheckCircle2 size={16} />
                    {confirmingPayment ? 'A confirmar...' : 'Confirmar Pagamento do Cliente'}
                  </button>
                )}

                {solicitacao.repasse?.status === 'pendente' && (
                  <button
                    onClick={() => router.push('/repasses')}
                    className="w-full mt-2 py-2 px-4 bg-amber-500 hover:bg-amber-600 text-white text-[12px] font-black rounded-md shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <ArrowLeftRight size={14} />
                    Processar Repasse ao Prestador
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Localização */}
          <SectionCard icon={MapPin} title="Localização">
            {localizacao || solicitacao.morada_execucao ? (
              <div className="space-y-0">
                {localizacao && (
                  <InfoRow label="Província / Município" value={localizacao} />
                )}
                {solicitacao.morada_execucao && (
                  <InfoRow label="Morada de Execução" value={solicitacao.morada_execucao} last={!localizacao} />
                )}
              </div>
            ) : (
              <p className="text-[11px] text-gray-400 font-medium py-1">Sem localização definida.</p>
            )}
          </SectionCard>

          {/* Agendamento */}
          <SectionCard icon={Clock} title="Agendamento">
            {solicitacao.data_pretendida || solicitacao.hora_pretendida ? (
              <div className="space-y-0">
                {solicitacao.data_pretendida && (
                  <InfoRow label="Data Pretendida" value={formatDate(solicitacao.data_pretendida, false)} />
                )}
                {solicitacao.hora_pretendida && (
                  <InfoRow label="Hora Pretendida" value={solicitacao.hora_pretendida} last={!solicitacao.data_pretendida} />
                )}
              </div>
            ) : (
              <p className="text-[11px] text-gray-400 font-medium py-1">Sem data definida.</p>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}