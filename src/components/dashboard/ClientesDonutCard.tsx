'use client';

import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Info } from 'lucide-react';
import { ClientesData } from '@/shared/types/backoffice/dashboard.types';

interface ClientesDonutCardProps {
  data?: ClientesData;
}

const COLORS = ['#93c5fd', '#818cf8']; // Recorrentes (blue), Novos (indigo/purple)

export default function ClientesDonutCard({ data }: ClientesDonutCardProps) {
  const total = data?.total_clientes ?? 19;
  const novos = data?.novos_clientes ?? 19;
  const recorrentes = data?.clientes_recorrentes ?? 0;

  const pctNovos = total > 0 ? (novos / total) * 100 : 100;
  const pctRecorrentes = total > 0 ? (recorrentes / total) * 100 : 0;

  // Chart data: if both are 0, show placeholder
  const chartData = [
    { name: 'Clientes recorrentes', value: recorrentes || 0.001 },
    { name: 'Novos clientes', value: novos || 19 },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-5 shadow-2xs flex flex-col justify-between min-h-[220px]">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-[16px] font-bold text-gray-900 tracking-tight">Clientes</h3>
        </div>

        <div className="flex items-center gap-1.5 mt-1 text-[13px] text-gray-500">
          <span>Total de clientes: {total}</span>
          <div className="relative group cursor-pointer text-gray-400 hover:text-gray-600">
            <Info size={14} />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden group-hover:block z-30 w-52 p-2 bg-gray-900 text-white text-[11px] rounded shadow-lg">
              Divisão de clientes entre primeiras compras (novos) e clientes habituais (recorrentes).
            </div>
          </div>
        </div>
      </div>

      {/* Donut Chart with Center Number and Labels */}
      <div className="relative flex items-center justify-center my-3 h-[140px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={36}
              outerRadius={52}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="#ffffff"
              strokeWidth={2}
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[18px] font-extrabold text-gray-900">{total}</span>
        </div>

        {/* Floating Callout Labels matching 99Food */}
        <div className="absolute -top-1 right-8 flex flex-col items-start text-[11px] text-gray-600">
          <span className="font-medium">Clientes recorrentes</span>
          <span className="text-gray-400">{recorrentes}({pctRecorrentes.toFixed(2).replace('.', ',')}%)</span>
        </div>

        <div className="absolute -bottom-1 right-2 flex flex-col items-start text-[11px] text-gray-600">
          <span className="font-medium">Novos clientes</span>
          <span className="text-gray-400">{novos}({pctNovos === 100 ? '1,00%' : `${pctNovos.toFixed(2).replace('.', ',')}%`})</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 pt-2 text-[11px] text-gray-500">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-[#93c5fd]" />
          <span>Recorrentes</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-[#818cf8]" />
          <span>Novos</span>
        </div>
      </div>
    </div>
  );
}
