'use client';

import { useEffect } from 'react';
import { DollarSign, TrendingUp, Clock, ArrowLeftRight, RefreshCw, BarChart3 } from 'lucide-react';
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
      accent: 'bg-emerald-500',
    },
    {
      label: 'Comissões Totais',
      value: resumo?.comissoes_totais ?? 0,
      icon: TrendingUp,
      color: 'blue',
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-100',
      accent: 'bg-blue-500',
    },
    {
      label: 'Repasses Pendentes',
      value: resumo?.valor_repasses_pendentes ?? 0,
      icon: Clock,
      color: 'amber',
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-100',
      accent: 'bg-amber-500',
    },
    {
      label: 'Qtd. Repasses Pendentes',
      value: resumo?.quantidade_repasses_pendentes ?? 0,
      icon: ArrowLeftRight,
      color: 'purple',
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-purple-100',
      accent: 'bg-purple-500',
      isCount: true,
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Dashboard"
        description="Visão geral financeira do sistema em tempo real"
        action={
          <Button 
            variant="outline" 
            className="rounded-sm bg-white hover:bg-gray-50 border-gray-200 text-gray-700 font-bold shadow-sm"
            onClick={fetchResumo} 
            leftIcon={<RefreshCw size={14} className={loading ? 'animate-spin text-[#42b883]' : 'text-gray-400'} />}
          >
            Actualizar Dados
          </Button>
        }
      />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-sm p-4 text-sm text-red-700 font-bold shadow-sm">
          {error}
        </div>
      )}

      {loading && !resumo && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-sm border border-gray-100 p-6 animate-pulse shadow-sm">
              <div className="w-12 h-12 rounded-sm bg-gray-100 mb-6" />
              <div className="w-24 h-3 bg-gray-200 rounded-sm mb-3" />
              <div className="w-32 h-8 bg-gray-100 rounded-sm" />
            </div>
          ))}
        </div>
      )}

      {resumo && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card) => (
              <div
                key={card.label}
                className={`bg-white rounded-sm border ${card.border} p-6 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:-translate-y-1 relative overflow-hidden group`}
              >
                {/* Accent top border */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${card.accent}`} />
                
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 rounded-sm ${card.bg} flex items-center justify-center ${card.text} group-hover:scale-110 transition-transform duration-300`}>
                    <card.icon size={22} strokeWidth={2.5} />
                  </div>
                </div>
                
                <p className="text-[11px] text-gray-500 font-black uppercase tracking-widest mb-1.5">
                  {card.label}
                </p>
                <p className={`text-2xl xl:text-3xl font-black ${card.text} tracking-tight`}>
                  {card.isCount ? card.value : formatCurrency(card.value)}
                </p>
              </div>
            ))}
          </div>

          {/* Summary table */}
          <div className="bg-white rounded-sm border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden mt-8">
            <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-sm bg-gray-200/50 flex items-center justify-center text-gray-500">
                <BarChart3 size={16} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-[14px] font-black text-gray-900 tracking-tight">Resumo Financeiro Detalhado</h3>
                <p className="text-[11px] font-semibold text-gray-500">Detalhamento global de comissões e repasses</p>
              </div>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-gray-50">
              <div className="flex flex-col py-4 px-2 border-b md:border-b-0 md:border-r border-gray-100 group hover:bg-gray-50/50 transition-colors rounded-sm">
                <span className="text-[11px] text-gray-500 font-black uppercase tracking-widest mb-1">Total de Receitas</span>
                <span className="text-xl text-emerald-600 font-black">{formatCurrency(resumo.receitas_totais)}</span>
              </div>
              <div className="flex flex-col py-4 px-2 md:pl-8 group hover:bg-gray-50/50 transition-colors rounded-sm">
                <span className="text-[11px] text-gray-500 font-black uppercase tracking-widest mb-1">Total de Comissões</span>
                <span className="text-xl text-blue-600 font-black">{formatCurrency(resumo.comissoes_totais)}</span>
              </div>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-0 pt-0">
              <div className="flex flex-col py-4 px-2 border-b md:border-b-0 md:border-r border-gray-100 group hover:bg-gray-50/50 transition-colors rounded-sm">
                <span className="text-[11px] text-gray-500 font-black uppercase tracking-widest mb-1">Repasses Pendentes (Valor)</span>
                <span className="text-xl text-amber-600 font-black">{formatCurrency(resumo.valor_repasses_pendentes)}</span>
              </div>
              <div className="flex flex-col py-4 px-2 md:pl-8 group hover:bg-gray-50/50 transition-colors rounded-sm">
                <span className="text-[11px] text-gray-500 font-black uppercase tracking-widest mb-1">Repasses Pendentes (Quantidade)</span>
                <span className="text-xl text-purple-600 font-black">{resumo.quantidade_repasses_pendentes}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
