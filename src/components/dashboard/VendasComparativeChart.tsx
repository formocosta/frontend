'use client';

import { useState } from 'react';
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
  currencyPrefix?: string;
}

const TABS: { id: MetricType; label: string }[] = [
  { id: 'vendas', label: 'Total de vendas realizadas' },
  { id: 'renda', label: 'Renda total das vendas' },
  { id: 'ganhos', label: 'Ganhos esperados da loja' },
  { id: 'taxa', label: 'Taxa de ganhos da loja' },
];

export default function VendasComparativeChart({
  data,
  activeMetric,
  onMetricChange,
  currencyPrefix = 'R$',
}: VendasComparativeChartProps) {
  const chartPoints = data?.series || [];
  const labelAtual = data?.label_atual || '09/02 - 09/08';
  const labelAnterior = data?.label_anterior || '08/26 - 09/01';

  // Get data keys based on active metric
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

  // Value formatting helper
  const formatVal = (val: number) => {
    if (activeMetric === 'vendas') {
      return val.toString();
    }
    if (activeMetric === 'taxa') {
      return `${val.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 })}%`;
    }
    return `${currencyPrefix}${val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-5 shadow-2xs space-y-4">
      {/* Header with Title and "Ver mais >" */}
      <div className="flex items-center justify-between">
        <h3 className="text-[16px] font-bold text-gray-900 tracking-tight">Vendas</h3>
        <Link
          href="/solicitacoes"
          className="inline-flex items-center text-[13px] text-gray-500 hover:text-gray-900 font-normal transition-colors gap-0.5"
        >
          <span>Ver mais</span>
          <ChevronRight size={14} />
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 pt-1">
        {TABS.map((tab) => {
          const isActive = activeMetric === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onMetricChange(tab.id)}
              className={`px-3 py-1.5 rounded text-[12px] font-medium transition-colors cursor-pointer ${
                isActive
                  ? 'bg-gray-100 text-gray-900 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Chart Canvas */}
      <div className="h-[260px] w-full pt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartPoints} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
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
              tickFormatter={(v) => (activeMetric === 'taxa' ? `${v}%` : v.toString())}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const pData = payload[0].payload;
                  const curV = pData[currentKey] ?? 0;
                  const prevV = pData[previousKey] ?? 0;
                  return (
                    <div className="bg-white/95 backdrop-blur-xs border border-gray-200 rounded-lg shadow-lg p-3 text-[12px] z-50 min-w-[180px]">
                      <div className="font-bold text-gray-900 border-b border-gray-100 pb-1 mb-2">
                        {pData.data_completa} ({pData.dia_semana})
                      </div>
                      <div className="flex items-center justify-between gap-3 text-blue-600 font-medium">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#1890ff]" />
                          {labelAtual}:
                        </span>
                        <span className="font-bold">{formatVal(curV)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3 text-sky-400 font-medium mt-1">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#91d5ff]" />
                          {labelAnterior}:
                        </span>
                        <span className="font-bold">{formatVal(prevV)}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* Current period: Solid line with circular markers */}
            <Line
              type="monotone"
              dataKey={currentKey}
              stroke="#1890ff"
              strokeWidth={2}
              dot={{ r: 3.5, fill: '#ffffff', stroke: '#1890ff', strokeWidth: 2 }}
              activeDot={{ r: 5, fill: '#1890ff', stroke: '#ffffff', strokeWidth: 2 }}
              name={labelAtual}
            />
            {/* Previous period: Dashed line */}
            <Line
              type="monotone"
              dataKey={previousKey}
              stroke="#91d5ff"
              strokeWidth={1.75}
              strokeDasharray="4 4"
              dot={false}
              activeDot={{ r: 4, fill: '#91d5ff' }}
              name={labelAnterior}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend below chart matching 99Food visual */}
      <div className="flex items-center justify-center gap-8 pt-1 text-[12px] text-gray-600">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <span className="w-4 h-0.5 bg-[#1890ff] inline-block" />
            <span className="w-2 h-2 rounded-full border-2 border-[#1890ff] bg-white -ml-2 inline-block" />
            <span className="w-2 h-0.5 bg-[#1890ff] inline-block" />
          </div>
          <span className="font-medium text-gray-700">{labelAtual}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-0.5 bg-[#91d5ff] inline-block" />
            <span className="w-1.5 h-0.5 bg-[#91d5ff] inline-block" />
            <span className="w-1.5 h-0.5 bg-[#91d5ff] inline-block" />
            <span className="w-1.5 h-0.5 bg-[#91d5ff] inline-block" />
          </div>
          <span className="font-medium text-gray-400">{labelAnterior}</span>
        </div>
      </div>
    </div>
  );
}
