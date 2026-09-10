'use client';

import { useState, useEffect } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Info, Users } from 'lucide-react';
import { ClientesData } from '@/shared/types/backoffice/dashboard.types';

interface ClientesDonutCardProps {
  data?: ClientesData;
}

const COLORS = ['#3b82f6', '#10b981']; // Recorrentes (Blue), Novos (Emerald)

export default function ClientesDonutCard({ data }: ClientesDonutCardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const total = data?.total_clientes ?? 28;
  const novos = data?.novos_clientes ?? 19;
  const recorrentes = data?.clientes_recorrentes ?? 9;

  const pctNovos = total > 0 ? (novos / total) * 100 : 67.8;
  const pctRecorrentes = total > 0 ? (recorrentes / total) * 100 : 32.2;

  const chartData = [
    { name: 'Clientes Recorrentes', value: recorrentes || 1 },
    { name: 'Novos Clientes', value: novos || 1 },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-5 shadow-2xs flex flex-col justify-between min-h-[220px]">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users size={14} />
            </div>
            <h3 className="text-[15px] font-bold text-gray-900 tracking-tight">Retenção de Clientes</h3>
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-1 text-[12px] text-gray-500">
          <span>Total de Clientes Activos: <strong className="text-gray-800">{total}</strong></span>
          <div className="relative group cursor-pointer text-gray-400 hover:text-gray-600">
            <Info size={13} />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden group-hover:block z-30 w-56 p-2 bg-gray-900 text-white text-[11px] rounded-md shadow-lg leading-relaxed">
              Distribuição entre novos clientes e clientes recorrentes que já solicitaram múltiplos serviços na Formocosta.
            </div>
          </div>
        </div>
      </div>

      {/* Donut Chart with Center Total and Callout Labels */}
      <div className="relative flex items-center justify-center my-2 h-[135px] w-full min-w-0">
        {mounted ? (
          <>
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={120}>
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

            {/* Center Total Number */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[18px] font-black text-gray-900 leading-none">{total}</span>
              <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider mt-0.5">Clientes</span>
            </div>

            {/* Floating Callout Labels */}
            <div className="absolute -top-1 right-6 flex flex-col items-start text-[11px] text-gray-700">
              <span className="font-semibold text-blue-600">Recorrentes</span>
              <span className="text-gray-500 font-medium">{recorrentes} ({pctRecorrentes.toFixed(1).replace('.', ',')}%)</span>
            </div>

            <div className="absolute -bottom-1 right-2 flex flex-col items-start text-[11px] text-gray-700">
              <span className="font-semibold text-emerald-600">Novos Clientes</span>
              <span className="text-gray-500 font-medium">{novos} ({pctNovos.toFixed(1).replace('.', ',')}%)</span>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50/50 rounded-md animate-pulse">
            <span className="text-[11px] text-gray-400">Carregando gráfico...</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-6 pt-2 text-[11px] text-gray-500 border-t border-gray-100/80">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" />
          <span>Recorrentes ({recorrentes})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
          <span>Novos ({novos})</span>
        </div>
      </div>
    </div>
  );
}