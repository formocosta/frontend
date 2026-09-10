'use client';

import { Info } from 'lucide-react';
import { PerformanceHojeData } from '@/shared/types/backoffice/dashboard.types';

interface PerformanceHojeCardsProps {
  data?: PerformanceHojeData;
  currencyPrefix?: string;
}

function formatCurrency(val: number, prefix: string = 'R$'): string {
  return `${prefix}${val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function PerformanceHojeCards({ data, currencyPrefix = 'R$' }: PerformanceHojeCardsProps) {
  const cards = [
    {
      title: 'Estimativa de pedidos finalizados',
      tooltip: 'Total de pedidos e solicitações concluídos com sucesso no dia de hoje.',
      value: data?.pedidos_finalizados?.valor ?? 7,
      comparison: data?.pedidos_finalizados?.texto_comparativo ?? 'Último(a) Qui 0',
      isCurrency: false,
    },
    {
      title: 'Ganhos estimados de vendas',
      tooltip: 'Volume bruto total transacionado (GMV) no dia de hoje.',
      value: data?.ganhos_vendas?.valor ?? 155.17,
      comparison: data?.ganhos_vendas?.texto_comparativo ?? 'Último(a) Qui R$0,00',
      isCurrency: true,
    },
    {
      title: 'Ganhos estimados da loja',
      tooltip: 'Receita líquida ou comissões geradas no dia de hoje.',
      value: data?.ganhos_loja?.valor ?? 96.34,
      comparison: data?.ganhos_loja?.texto_comparativo ?? 'Último(a) Qui R$0,00',
      isCurrency: true,
    },
    {
      title: 'Pedidos cancelados por parte da loja',
      tooltip: 'Número de pedidos/solicitações cancelados hoje.',
      value: data?.pedidos_cancelados?.valor ?? 0,
      comparison: data?.pedidos_cancelados?.texto_comparativo ?? 'Último(a) Qui 0',
      isCurrency: false,
    },
    {
      title: 'Valor da perda por cancelamentos por parte da loja',
      tooltip: 'Valor financeiro total perdido devido a cancelamentos no dia de hoje.',
      value: data?.valor_perda_cancelamentos?.valor ?? 0,
      comparison: data?.valor_perda_cancelamentos?.texto_comparativo ?? 'Último(a) Qui R$0,00',
      isCurrency: true,
    },
  ];

  return (
    <div className="space-y-3">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-[16px] font-bold text-gray-900 tracking-tight">Performance do dia</h3>
          <div className="relative group cursor-pointer text-gray-400 hover:text-gray-600">
            <Info size={15} />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden group-hover:block z-30 w-56 p-2 bg-gray-900 text-white text-[11px] rounded shadow-lg">
              Métricas consolidadas em tempo real para o dia de hoje, comparadas com o mesmo dia da semana anterior.
            </div>
          </div>
          <span className="bg-[#ff4d4f] text-white text-[10px] font-bold px-1.5 py-0.5 rounded leading-none">
            Novo
          </span>
        </div>

        <div className="text-[12px] text-gray-500 font-normal">
          Última atualização: <span className="font-medium text-gray-700">{data?.ultima_atualizacao || '09/09/2026 22:51'}</span>
        </div>
      </div>

      {/* 5 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg border border-gray-100 p-4 shadow-2xs hover:shadow-xs transition-shadow duration-200 flex flex-col justify-between min-h-[110px]"
          >
            {/* Title with info icon */}
            <div className="flex items-start justify-between gap-1.5">
              <span className="text-[12px] text-gray-500 font-medium leading-tight line-clamp-2">
                {card.title}
              </span>
              <div className="relative group cursor-pointer text-gray-300 hover:text-gray-500 shrink-0 mt-0.5">
                <Info size={13} />
                <div className="absolute right-0 bottom-full mb-1.5 hidden group-hover:block z-30 w-48 p-2 bg-gray-900 text-white text-[11px] rounded shadow-lg">
                  {card.tooltip}
                </div>
              </div>
            </div>

            {/* Big value & comparison */}
            <div className="mt-3">
              <div className="text-[22px] font-extrabold text-gray-900 tracking-tight leading-none">
                {card.isCurrency ? formatCurrency(Number(card.value), currencyPrefix) : card.value}
              </div>
              <div className="text-[11px] text-gray-400 font-normal mt-2 truncate">
                {card.comparison}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
