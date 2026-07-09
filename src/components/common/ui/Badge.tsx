import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
}

const variants = {
  default: 'bg-gray-100 text-gray-700 border-gray-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
};

const sizes = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-[11px]',
};

export function Badge({ children, variant = 'default', size = 'sm' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center font-bold rounded-md border ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
}

const statusMap: Record<string, { label: string; variant: BadgeProps['variant'] }> = {
  pendente: { label: 'Pendente', variant: 'warning' },
  em_analise: { label: 'Em Análise', variant: 'info' },
  entrevista_agendada: { label: 'Entrevista Agendada', variant: 'info' },
  aprovado: { label: 'Aprovado', variant: 'success' },
  rejeitado: { label: 'Rejeitado', variant: 'danger' },
  activo: { label: 'Activo', variant: 'success' },
  suspenso: { label: 'Suspenso', variant: 'danger' },
};

export function StatusBadge({ status }: { status: string }) {
  const config = statusMap[status] || { label: status, variant: 'default' as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
