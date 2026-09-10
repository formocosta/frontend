'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { ChevronRight } from 'lucide-react';
import {
  VendasGraficoData,
  MetricType,
} from '@/shared/types/backoffice/dashboard.types';

interface VendasComparativeChartProps {
  data?: VendasGraficoData;
  activeMetric: MetricType;
  onMetricChange: (m: MetricType) => void;
  currencySuffix?: string;
}

const TABS: { id: MetricType; label: string }[] = [
  { id: 'vendas', label: 'Total de Serviços Concluídos' },
  { id: 'renda', label: 'Volume Transacionado (GMV)' },
  { id: 'ganhos', label: 'Receita de Comissões' },
  { id: 'taxa', label: 'Taxa Média de Comissão (%)' },
];

export default function VendasComparativeChart({
  data,
  activeMetric,
  onMetricChange,
  currencySuffix = 'Kz',
}: VendasComparativeChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const chartPoints = data?.series || [];
  const labelAtual = data?.label_atual || '03/09 - 09/09';
  const labelAnterior = data?.label_anterior || '27/08 - 02/09';

  // Chaves dos dados consoante a métrica selecionada
  const currentKey =
    activeMetric === 'vendas'
      ? 'vendas_atual'
      : activeMetric === 'renda'
      ? 'renda_atual'
      : activeMetric === 'ganhos'
      ? 'ganhos_atual'
      : 'taxa_atual';

  const previousKey =
    activeMetric === 'vendas'
      ? 'vendas_anterior'
      : activeMetric === 'renda'
      ? 'renda_anterior'
      : activeMetric === 'ganhos'
      ? 'ganhos_anterior'
      : 'taxa_anterior';

  // Formatador de valores para o contexto Formocosta
  const formatVal = (val: number) => {
    if (activeMetric === 'vendas') {
      return `${val} serviços`;
    }
    if (activeMetric === 'taxa') {
      return `${val.toLocaleString('pt-AO', { minimumFractionDigits: 1, maximumFractionDigits: 2 })}%`;
    }
    return `${val.toLocaleString('pt-AO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currencySuffix}`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-5 shadow-2xs space-y-4">
      {/* Header com Título e "Ver mais >" */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[16px] font-bold text-gray-900 tracking-tight">Solicitações & Volume de Serviços</h3>
          <p className="text-[12px] text-gray-500 font-normal mt-0.5">Evolução diária comparativa de serviços e transações</p>
        </div>
        <Link
          href="/solicitacoes"
          className="inline-flex items-center text-[13px] text-gray-500 hover:text-emerald-600 font-medium transition-colors gap-0.5"
        >
          <span>Ver Solicitações</span>
          <ChevronRight size={14} />
        </Link>
      </div>

      {/* Abas de métricas */}
      <div className="flex flex-wrap gap-2 pt-1 border-b border-gray-100 pb-3">
        {TABS.map((tab) => {
          const isActive = activeMetric === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onMetricChange(tab.id)}
              className={`px-3.5 py-1.5 rounded-md text-[12px] font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-2xs'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Gráfico Canvas */}
      <div className="h-[270px] w-full min-w-0 pt-2">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={240}>
            <LineChart data={chartPoints} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="data_label"
                stroke="#bfbfbf"
                tick={{ fontSize: 11, fill: '#8c8c8c' }}
                tickLine={false}
                axisLine={{ stroke: '#f0f0f0' }}
              />
              <YAxis
                stroke="#bfbfbf"
                tick={{ fontSize: 11, fill: '#8c8c8c' }}
                tickLine={false}
                axisLine={{ stroke: '#f0f0f0' }}
                tickFormatter={(v) => {
                  if (activeMetric === 'taxa') return `${v}%`;
                  if (activeMetric === 'vendas') return v.toString();
                  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
                  if (v >= 1000) return `${(v / 1000).toFixed(0)}k`;
                  return v.toString();
                }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const pData = payload[0].payload;
                    const curV = pData[currentKey] ?? 0;
                    const prevV = pData[previousKey] ?? 0;
                    return (
                      <div className="bg-white/95 backdrop-blur-xs border border-gray-200 rounded-lg shadow-xl p-3 text-[12px] z-50 min-w-[210px]">
                        <div className="font-bold text-gray-900 border-b border-gray-100 pb-1 mb-2">
                          {pData.data_completa} ({pData.dia_semana})
                        </div>
                        <div className="flex items-center justify-between gap-3 text-emerald-600 font-medium">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                            Período Actual ({labelAtual}):
                          </span>
                          <span className="font-bold">{formatVal(curV)}</span>
                        </div>
                        <div className="flex items-center justify-between gap-3 text-sky-500 font-medium mt-1">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#60a5fa]" />
                            Período Anterior ({labelAnterior}):
                          </span>
                          <span className="font-bold">{formatVal(prevV)}</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {/* Período Atual: Linha sólida esmeralda com pontos */}
              <Line
                type="monotone"
                dataKey={currentKey}
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 3.5, fill: '#ffffff', stroke: '#10b981', strokeWidth: 2 }}
                activeDot={{ r: 5.5, fill: '#10b981', stroke: '#ffffff', strokeWidth: 2 }}
                name={labelAtual}
              />
              {/* Período Anterior: Linha tracejada azul clara */}
              <Line
                type="monotone"
                dataKey={previousKey}
                stroke="#93c5fd"
                strokeWidth={1.75}
                strokeDasharray="4 4"
                dot={false}
                activeDot={{ r: 4, fill: '#93c5fd' }}
                name={labelAnterior}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50/50 rounded-md animate-pulse">
            <span className="text-[12px] text-gray-400">Carregando gráfico...</span>
          </div>
        )}
      </div>

      {/* Legenda abaixo do gráfico */}
      <div className="flex items-center justify-center gap-8 pt-1 text-[12px] text-gray-600">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <span className="w-4 h-0.5 bg-[#10b981] inline-block" />
            <span className="w-2 h-2 rounded-full border-2 border-[#10b981] bg-white -ml-2 inline-block" />
            <span className="w-2 h-0.5 bg-[#10b981] inline-block" />
          </div>
          <span className="font-semibold text-gray-800">{labelAtual} (Período Actual)</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-0.5 bg-[#93c5fd] inline-block" />
            <span className="w-1.5 h-0.5 bg-[#93c5fd] inline-block" />
            <span className="w-1.5 h-0.5 bg-[#93c5fd] inline-block" />
            <span className="w-1.5 h-0.5 bg-[#93c5fd] inline-block" />
          </div>
          <span className="font-medium text-gray-400">{labelAnterior} (Período Anterior)</span>
        </div>
      </div>
    </div>
  );
}
