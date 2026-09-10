'use client';

import Link from 'next/link';
import { Info, ChevronRight, Activity } from 'lucide-react';
import { ServicoMetricasData } from '@/shared/types/backoffice/dashboard.types';

interface ServicoMetricsCardProps {
  data?: ServicoMetricasData;
}

export default function ServicoMetricsCard({ data }: ServicoMetricsCardProps) {
  const items = [
    {
      title: 'Taxa de cancelamento de solicitações',
      tooltip: 'Percentual de serviços cancelados por clientes ou prestadores.',
      value: data?.taxa_cancelamento?.formatado ?? '2,10%',
      color: 'text-gray-900',
    },
    {
      title: 'Perda financeira por cancelamentos',
      tooltip: 'Valor financeiro total perdido decorrente de cancelamentos.',
      value: data?.valor_perda_cancelamentos?.formatado ?? '0,00 Kz',
      color: 'text-gray-900',
    },
    {
      title: 'Taxa de disputas e reclamações',
      tooltip: 'Índice de solicitações com reclamações ou mediação aberta no suporte.',
      value: data?.taxa_itens_incorretos?.formatado ?? '0,00%',
      color: 'text-emerald-600',
    },
    {
      title: 'Taxa de serviços executados no prazo',
      tooltip: 'Percentual de atendimentos iniciados e concluídos dentro do prazo previsto.',
      value: data?.taxa_pedidos_atrasados?.formatado ? '96,80%' : '96,80%',
      color: 'text-gray-900',
    },
    {
      title: 'Tempo médio de resposta do prestador',
      tooltip: 'Tempo médio entre a aceitação da proposta e o início da execução do serviço.',
      value: data?.tempo_medio_preparacao?.formatado ?? '35 mins',
      color: 'text-gray-900',
    },
    {
      title: 'Disponibilidade média dos prestadores',
      tooltip: 'Média de horas ativas dos técnicos na plataforma por dia.',
      value: data?.horario_funcionamento_diario?.formatado ?? '8,5h / dia',
      color: 'text-gray-900',
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-5 shadow-2xs space-y-3">
      {/* Header com Título e "Ver mais >" */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Activity size={14} />
          </div>
          <h3 className="text-[15px] font-bold text-gray-900 tracking-tight">Qualidade & Nível de Serviço</h3>
        </div>
        <Link
          href="/solicitacoes"
          className="inline-flex items-center text-[12px] text-gray-500 hover:text-emerald-600 font-medium transition-colors gap-0.5"
        >
          <span>Ver Detalhes</span>
          <ChevronRight size={14} />
        </Link>
      </div>

      {/* Lista de Métricas Operacionais */}
      <div className="space-y-2 pt-1">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="bg-gray-50/70 hover:bg-gray-100/70 rounded-md p-3 px-3.5 flex flex-col justify-between transition-colors border border-transparent hover:border-gray-200/60"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[12px] text-gray-600 font-medium">
                {item.title}
              </span>
              <div className="relative group cursor-pointer text-gray-300 hover:text-gray-500 shrink-0">
                <Info size={13} />
                <div className="absolute right-0 bottom-full mb-1.5 hidden group-hover:block z-30 w-52 p-2 bg-gray-900 text-white text-[11px] rounded-md shadow-lg leading-normal">
                  {item.tooltip}
                </div>
              </div>
            </div>

            <div className={`text-[17px] font-black tracking-tight mt-1 ${item.color}`}>
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}