'use client';

import { useState } from 'react';
import { Calendar, ChevronDown, Check } from 'lucide-react';
import { DashboardPeriodo } from '@/shared/types/backoffice/dashboard.types';

interface DateRangeFilterProps {
  periodo: DashboardPeriodo;
  onPeriodoChange: (p: DashboardPeriodo) => void;
  startDate?: string;
  endDate?: string;
  onCustomDateChange?: (start: string, end: string) => void;
  formattedRangeLabel?: string;
}

export default function DateRangeFilter({
  periodo,
  onPeriodoChange,
  startDate,
  endDate,
  onCustomDateChange,
  formattedRangeLabel,
}: DateRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const displayLabel = formattedRangeLabel || '02/09/2026 - 08/09/2026';

  const options: { id: DashboardPeriodo; label: string }[] = [
    { id: 'hoje', label: 'Hoje' },
    { id: '7d', label: 'Últimos 7 dias (02/09/2026 - 08/09/2026)' },
    { id: '30d', label: 'Últimos 30 dias' },
    { id: '90d', label: 'Últimos 90 dias' },
  ];

  return (
    <div className="relative inline-block text-left">
      {/* Date trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-between gap-3 bg-white border border-gray-200 hover:border-gray-300 rounded-md px-3.5 py-1.5 text-[13px] text-gray-700 shadow-2xs font-medium cursor-pointer transition-colors"
      >
        <span>{displayLabel}</span>
        <Calendar size={15} className="text-gray-400" />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-20"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 mt-1 w-72 rounded-lg bg-white shadow-xl border border-gray-100 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-3 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Selecionar Período
            </div>

            {options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  onPeriodoChange(opt.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-[13px] text-left transition-colors cursor-pointer ${
                  periodo === opt.id
                    ? 'bg-blue-50/70 text-blue-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50 font-normal'
                }`}
              >
                <span>{opt.label}</span>
                {periodo === opt.id && <Check size={14} className="text-blue-600 shrink-0" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
