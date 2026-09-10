'use client';

import { Info, Zap } from 'lucide-react';
import { PerformanceHojeData } from '@/shared/types/backoffice/dashboard.types';

interface PerformanceHojeCardsProps {
  data?: PerformanceHojeData;
  currencySuffix?: string;
}

function formatCurrency(val: number, suffix: string = 'Kz'): string {
  return `${val.toLocaleString('pt-AO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${suffix}`;
}

export default function PerformanceHojeCards({ data, currencySuffix = 'Kz' }: PerformanceHojeCardsProps) {
  const cards = [
    {
      title: 'Solicitações concluídas hoje',
      tooltip: 'Total de serviços concluídos com sucesso pelos prestadores no dia de hoje.',
      value: data?.pedidos_finalizados?.valor ?? 8,
      comparison: data?.pedidos_finalizados?.texto_comparativo ?? 'Último(a) Qui 3',
      isCurrency: false,
    },
    {
      title: 'Volume transacionado hoje (GMV)',
      tooltip: 'Valor total transacionado em serviços confirmados na plataforma hoje.',
      value: data?.ganhos_vendas?.valor ?? 185000.0,
      comparison: data?.ganhos_vendas?.texto_comparativo ?? 'Último(a) Qui 65.000,00 Kz',
      isCurrency: true,
    },
    {
      title: 'Receita da plataforma (Comissões)',
      tooltip: 'Comissões líquidas retidas pela plataforma Formocosta no dia de hoje.',
      value: data?.ganhos_loja?.valor ?? 27750.0,
      comparison: data?.ganhos_loja?.texto_comparativo ?? 'Último(a) Qui 9.750,00 Kz',
      isCurrency: true,
    },
    {
      title: 'Solicitações canceladas hoje',
      tooltip: 'Número de pedidos de serviço cancelados no dia de hoje.',
      value: data?.pedidos_cancelados?.valor ?? 0,
      comparison: data?.pedidos_cancelados?.texto_comparativo ?? 'Último(a) Qui 0',
      isCurrency: false,
    },
    {
      title: 'Perda em cancelamentos hoje',
      tooltip: 'Valor financeiro total perdido decorrente de cancelamentos hoje.',
      value: data?.valor_perda_cancelamentos?.valor ?? 0.0,
      comparison: data?.valor_perda_cancelamentos?.texto_comparativo ?? 'Último(a) Qui 0,00 Kz',
      isCurrency: true,
    },
  ];

  return (
    <div className="space-y-3">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-[16px] font-bold text-gray-900 tracking-tight">Performance do Dia</h3>
          <div className="relative group cursor-pointer text-gray-400 hover:text-gray-600">
            <Info size={15} />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden group-hover:block z-30 w-64 p-2.5 bg-gray-900 text-white text-[11px] rounded-md shadow-lg leading-relaxed">
              Métricas consolidadas em tempo real das solicitações de serviço, comparadas com o mesmo dia da semana anterior.
            </div>
          </div>
          <span className="inline-flex items-center gap-1 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded leading-none">
            <Zap size={10} />
            Tempo Real
          </span>
        </div>

        <div className="text-[12px] text-gray-500 font-normal">
          Última actualização: <span className="font-semibold text-gray-700">{data?.ultima_atualizacao || '10/09/2026 09:15'}</span>
        </div>
      </div>

      {/* 5 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg border border-gray-100 p-4 shadow-2xs hover:shadow-xs hover:border-gray-200 transition-all duration-200 flex flex-col justify-between min-h-[112px]"
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
              <div className="text-[20px] xl:text-[21px] font-extrabold text-gray-900 tracking-tight leading-none truncate">
                {card.isCurrency ? formatCurrency(Number(card.value), currencySuffix) : card.value}
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