'use client';

import Link from 'next/link';
import { Info, ChevronRight } from 'lucide-react';
import { ServicoMetricasData } from '@/shared/types/backoffice/dashboard.types';

interface ServicoMetricsCardProps {
  data?: ServicoMetricasData;
}

export default function ServicoMetricsCard({ data }: ServicoMetricsCardProps) {
  const items = [
    {
      title: 'Taxa de cancelamentos por parte da loja',
      tooltip: 'Percentual de cancelamentos ocorridos no período analisado.',
      value: data?.taxa_cancelamento?.formatado ?? '13,64%',
    },
    {
      title: 'Valor da perda por cancelamentos por parte da loja',
      tooltip: 'Soma total dos valores monetários dos cancelamentos.',
      value: data?.valor_perda_cancelamentos?.formatado ?? 'R$0,00',
    },
    {
      title: 'Taxa de pedidos com itens incorretos/faltando',
      tooltip: 'Índice de ocorrências e disputas abertas por inconformidades.',
      value: data?.taxa_itens_incorretos?.formatado ?? '0,00%',
    },
    {
      title: 'Taxa de pedidos não preparados no prazo',
      tooltip: 'Percentual de solicitações com atraso em relação ao horário estimado.',
      value: data?.taxa_pedidos_atrasados?.formatado ?? '10,53%',
    },
    {
      title: 'Tempo médio de preparação de pedidos',
      tooltip: 'Tempo médio decorrido entre a aceitação e a conclusão do serviço.',
      value: data?.tempo_medio_preparacao?.formatado ?? '5,33mins',
    },
    {
      title: 'Horário de funcionamento diário',
      tooltip: 'Média de horas ativas dos serviços no período.',
      value: data?.horario_funcionamento_diario?.formatado ?? '0,92h',
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-5 shadow-2xs space-y-3">
      {/* Header with Title and "Ver mais >" */}
      <div className="flex items-center justify-between">
        <h3 className="text-[16px] font-bold text-gray-900 tracking-tight">Serviço</h3>
        <Link
          href="/solicitacoes"
          className="inline-flex items-center text-[13px] text-gray-500 hover:text-gray-900 font-normal transition-colors gap-0.5"
        >
          <span>Ver mais</span>
          <ChevronRight size={14} />
        </Link>
      </div>

      {/* Metrics List */}
      <div className="space-y-2.5 pt-1">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="bg-gray-50/60 rounded-md p-3 px-3.5 flex flex-col justify-between hover:bg-gray-100/60 transition-colors"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[12px] text-gray-600 font-medium">
                {item.title}
              </span>
              <div className="relative group cursor-pointer text-gray-300 hover:text-gray-500 shrink-0">
                <Info size={13} />
                <div className="absolute right-0 bottom-full mb-1.5 hidden group-hover:block z-30 w-48 p-2 bg-gray-900 text-white text-[11px] rounded shadow-lg">
                  {item.tooltip}
                </div>
              </div>
            </div>

            <div className="text-[18px] font-extrabold text-gray-900 tracking-tight mt-1">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
