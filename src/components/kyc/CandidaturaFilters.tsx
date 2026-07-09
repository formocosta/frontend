'use client';

import React from 'react';
import { Select, SelectOption } from '@/components/common/form/Select';

const statusOptions: SelectOption[] = [
  { value: '', label: 'Todos os status' },
  { value: 'pendente', label: 'Pendente' },
  { value: 'em_analise', label: 'Em Análise' },
  { value: 'entrevista_agendada', label: 'Entrevista Agendada' },
  { value: 'aprovado', label: 'Aprovado' },
  { value: 'rejeitado', label: 'Rejeitado' },
];

interface CandidaturaFiltersProps {
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

export function CandidaturaFilters({ statusFilter, onStatusFilterChange }: CandidaturaFiltersProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-64">
        <Select
          options={statusOptions}
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
        />
      </div>
    </div>
  );
}
