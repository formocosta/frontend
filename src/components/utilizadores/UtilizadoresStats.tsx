import React from 'react';
import { Utilizador } from '@/shared/types/backoffice/utilizadores.types';

interface UtilizadoresStatsProps {
  total: number;
  utilizadores: Utilizador[];
}

export function UtilizadoresStats({ total, utilizadores }: UtilizadoresStatsProps) {
  const totalAdmins = utilizadores.filter((u) => u.role === 'admin').length;
  const totalOperadores = utilizadores.filter((u) => u.role === 'operador').length;
  const totalAtivos = utilizadores.filter((u) => u.status === 'activo').length;

  const stats = [
    { label: 'Total de Utilizadores', value: total, textColor: 'text-[#42b883]', bgColor: 'bg-[#42b883]/10' },
    { label: 'Administradores', value: totalAdmins, textColor: 'text-blue-600', bgColor: 'bg-blue-50' },
    { label: 'Operadores de Análise', value: totalOperadores, textColor: 'text-purple-600', bgColor: 'bg-purple-50' },
    { label: 'Contas Ativas', value: totalAtivos, textColor: 'text-emerald-600', bgColor: 'bg-emerald-50' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="relative bg-white rounded-md border border-gray-100 p-4 sm:p-5 flex flex-col justify-between min-h-[90px] overflow-hidden group shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:border-gray-200 transition-all duration-300"
        >
          <div className={`absolute -right-4 -top-4 w-16 h-16 rounded-md opacity-50 transition-transform duration-300 group-hover:scale-125 ${stat.bgColor}`} />
          <p className="text-[10px] sm:text-[11px] text-gray-500 font-bold uppercase tracking-wider relative z-10">{stat.label}</p>
          <div className="flex items-baseline gap-2 relative z-10 mt-1">
            <p className={`text-2xl sm:text-3xl font-black tracking-tight ${stat.textColor}`}>{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
