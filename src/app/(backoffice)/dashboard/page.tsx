'use client';

import { useState } from 'react';
import { Search, RefreshCw, Check, Layers } from 'lucide-react';
import { useDashboardOverview } from '@/hooks/dashboard/dashboard.hooks';
import DashboardAlertBanner from '@/components/dashboard/DashboardAlertBanner';
import PerformanceHojeCards from '@/components/dashboard/PerformanceHojeCards';
import DateRangeFilter from '@/components/dashboard/DateRangeFilter';
import VendasComparativeChart from '@/components/dashboard/VendasComparativeChart';
import PromoBannerCard from '@/components/dashboard/PromoBannerCard';
import ServicoMetricsCard from '@/components/dashboard/ServicoMetricsCard';
import AvaliacoesCard from '@/components/dashboard/AvaliacoesCard';
import ClientesDonutCard from '@/components/dashboard/ClientesDonutCard';

export default function DashboardPage() {
  const {
    data,
    loading,
    error,
    periodo,
    setPeriodo,
    metricTab,
    setMetricTab,
    selectedEstablishment,
    setSelectedEstablishment,
    refresh,
  } = useDashboardOverview();

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const categoryOptions = [
    { id: 'todos', label: 'Todos os Prestadores / Categorias' },
    { id: 'canalizacao', label: 'Canalização & Hidráulica' },
    { id: 'electricidade', label: 'Electricidade & Energia' },
    { id: 'climatizacao', label: 'Climatização & AC' },
    { id: 'construcao_obras', label: 'Construção & Obras' },
    { id: 'limpeza_manutencao', label: 'Limpeza & Manutenção' },
  ];

  const currentCategoryLabel =
    categoryOptions.find((e) => e.id === selectedEstablishment)?.label ||
    'Todos os Prestadores / Categorias';

  return (
    <div className="space-y-4 max-w-[1400px] mx-auto pb-10">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-6 bg-emerald-500 rounded-sm" />
            <h1 className="text-[22px] font-black text-gray-900 tracking-tight">Visão Geral Operacional</h1>
          </div>
          <p className="text-[12px] text-gray-500 font-normal mt-0.5">
            Plataforma Formocosta — Gestão de serviços, técnicos, solicitações e finanças em tempo real
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Service Category / Provider Dropdown Filter */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="inline-flex items-center justify-between gap-3 bg-white border border-gray-200 hover:border-gray-300 rounded-md px-3.5 py-1.5 text-[12px] text-gray-700 shadow-2xs font-medium cursor-pointer transition-colors min-w-[220px]"
            >
              <div className="flex items-center gap-2 truncate">
                <Layers size={13} className="text-gray-400 shrink-0" />
                <span className="truncate">{currentCategoryLabel}</span>
              </div>
              <Search size={13} className="text-gray-400 shrink-0" />
            </button>

            {isCategoryOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setIsCategoryOpen(false)}
                />
                <div className="absolute right-0 mt-1 w-72 rounded-lg bg-white shadow-xl border border-gray-100 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Filtrar por Categoria
                  </div>
                  {categoryOptions.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setSelectedEstablishment(item.id);
                        setIsCategoryOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-[12px] text-left transition-colors cursor-pointer ${
                        selectedEstablishment === item.id
                          ? 'bg-emerald-50/70 text-emerald-700 font-bold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="truncate">{item.label}</span>
                      {selectedEstablishment === item.id && (
                        <Check size={14} className="text-emerald-600 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Quick Refresh Button */}
          <button
            type="button"
            onClick={refresh}
            title="Actualizar dados operacionais"
            className="p-2 rounded-md bg-white border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin text-emerald-600' : ''} />
          </button>
        </div>
      </div>

      {/* Error alert if any */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Top Warning Banner: Inactive/Pending KYC Providers notice */}
      <DashboardAlertBanner alerta={data.alerta} />

      {/* Performance do dia: 5 KPI cards */}
      <PerformanceHojeCards data={data.performance_hoje} currencySuffix="Kz" />

      {/* Date Filter Bar */}
      <div className="pt-1">
        <DateRangeFilter
          periodo={periodo}
          onPeriodoChange={setPeriodo}
          formattedRangeLabel={data.vendas_grafico.label_atual}
        />
      </div>

      {/* Main Content Grid: Left 8 cols (Solicitações & Volume chart + Avaliações + Clientes), Right 4 cols (Expansão banner + Nível de Serviço) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Main Comparative Chart */}
          <VendasComparativeChart
            data={data.vendas_grafico}
            activeMetric={metricTab}
            onMetricChange={setMetricTab}
            currencySuffix="Kz"
          />

          {/* Bottom Row: Avaliações + Clientes Donut */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AvaliacoesCard data={data.avaliacoes} />
            <ClientesDonutCard data={data.clientes} />
          </div>
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Provider Referral Promo Banner */}
          <PromoBannerCard />

          {/* Serviço Quality Metrics */}
          <ServicoMetricsCard data={data.servico} />
        </div>
      </div>
    </div>
  );
}