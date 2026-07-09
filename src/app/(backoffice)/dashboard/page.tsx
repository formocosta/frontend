'use client';

import { useEffect } from 'react';
import { DollarSign, TrendingUp, Clock, ArrowLeftRight, RefreshCw } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { useFinanceiro } from '@/hooks/finance/finance.hooks';
import { Button } from '@/components/common/form/Button';

function formatCurrency(value: number) {
  return value.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' });
}

export default function DashboardPage() {
  const { resumo, loading, error, fetchResumo } = useFinanceiro();

  useEffect(() => {
    fetchResumo();
  }, [fetchResumo]);

  const cards = [
    {
      label: 'Receitas Totais',
      value: resumo?.receitas_totais ?? 0,
      icon: DollarSign,
      color: 'emerald',
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-100',
    },
    {
      label: 'Comissões Totais',
      value: resumo?.comissoes_totais ?? 0,
      icon: TrendingUp,
      color: 'blue',
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-100',
    },
    {
      label: 'Repasses Pendentes',
      value: resumo?.valor_repasses_pendentes ?? 0,
      icon: Clock,
      color: 'amber',
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-100',
    },
    {
      label: 'Qtd. Repasses Pendentes',
      value: resumo?.quantidade_repasses_pendentes ?? 0,
      icon: ArrowLeftRight,
      color: 'purple',
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-purple-100',
      isCount: true,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Visão geral financeira do sistema"
        action={
          <Button variant="outline" size="sm" onClick={fetchResumo} leftIcon={<RefreshCw size={14} />}>
            Actualizar
          </Button>
        }
      />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 font-medium">
          {error}
        </div>
      )}

      {loading && !resumo && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
              <div className="w-10 h-10 rounded-lg bg-gray-100 mb-4" />
              <div className="w-24 h-3 bg-gray-100 rounded mb-2" />
              <div className="w-32 h-7 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      )}

      {resumo && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => (
            <div
              key={card.label}
              className={`bg-white rounded-xl border ${card.border} p-6 transition-all hover:shadow-md`}
            >
              <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center ${card.text} mb-4`}>
                <card.icon size={20} />
              </div>
              <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1">
                {card.label}
              </p>
              <p className={`text-2xl font-extrabold ${card.text}`}>
                {card.isCount ? card.value : formatCurrency(card.value)}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Summary table */}
      {resumo && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Resumo Financeiro</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-gray-50">
              <span className="text-[13px] text-gray-600 font-medium">Total de Receitas</span>
              <span className="text-[13px] text-emerald-600 font-bold">{formatCurrency(resumo.receitas_totais)}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-50">
              <span className="text-[13px] text-gray-600 font-medium">Total de Comissões</span>
              <span className="text-[13px] text-blue-600 font-bold">{formatCurrency(resumo.comissoes_totais)}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-50">
              <span className="text-[13px] text-gray-600 font-medium">Repasses Pendentes (valor)</span>
              <span className="text-[13px] text-amber-600 font-bold">{formatCurrency(resumo.valor_repasses_pendentes)}</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-[13px] text-gray-600 font-medium">Repasses Pendentes (quantidade)</span>
              <span className="text-[13px] text-purple-600 font-bold">{resumo.quantidade_repasses_pendentes}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
