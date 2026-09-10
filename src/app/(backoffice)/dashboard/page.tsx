'use client';

import { useState } from 'react';
import { Search, RefreshCw, ChevronDown, Check } from 'lucide-react';
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

  const [isEstablishmentOpen, setIsEstablishmentOpen] = useState(false);

  const establishmentOptions = [
    { id: 'todos', label: 'Todos os estabelecimentos' },
    { id: 'benditta', label: 'Benditta Marmitta' },
    { id: 'central', label: 'Restaurante Central' },
    { id: 'sabor_express', label: 'Sabor & Express' },
  ];

  const currentEstablishmentLabel =
    establishmentOptions.find((e) => e.id === selectedEstablishment)?.label ||
    'Todos os estabelecimentos';

  return (
    <div className="space-y-4 max-w-[1400px] mx-auto pb-10">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div>
          <h1 className="text-[24px] font-bold text-gray-900 tracking-tight">Visão geral</h1>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Store / Establishment Dropdown Filter */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsEstablishmentOpen(!isEstablishmentOpen)}
              className="inline-flex items-center justify-between gap-4 bg-white border border-gray-200 hover:border-gray-300 rounded-md px-3.5 py-1.5 text-[13px] text-gray-700 shadow-2xs font-normal cursor-pointer transition-colors min-w-[200px]"
            >
              <span className="truncate">{currentEstablishmentLabel}</span>
              <Search size={14} className="text-gray-400 shrink-0" />
            </button>

            {isEstablishmentOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setIsEstablishmentOpen(false)}
                />
                <div className="absolute right-0 mt-1 w-64 rounded-lg bg-white shadow-xl border border-gray-100 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Estabelecimentos
                  </div>
                  {establishmentOptions.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setSelectedEstablishment(item.id);
                        setIsEstablishmentOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-[13px] text-left transition-colors cursor-pointer ${
                        selectedEstablishment === item.id
                          ? 'bg-blue-50/70 text-blue-600 font-semibold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="truncate">{item.label}</span>
                      {selectedEstablishment === item.id && (
                        <Check size={14} className="text-blue-600 shrink-0" />
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
            title="Actualizar dados"
            className="p-2 rounded-md bg-white border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin text-blue-600' : ''} />
          </button>
        </div>
      </div>

      {/* Error alert if any */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Top Warning Banner: Inactive store notice */}
      <DashboardAlertBanner alerta={data.alerta} />

      {/* Performance do dia: 5 KPI cards */}
      <PerformanceHojeCards data={data.performance_hoje} currencyPrefix="R$" />

      {/* Date Filter Bar */}
      <div className="pt-2">
        <DateRangeFilter
          periodo={periodo}
          onPeriodoChange={setPeriodo}
          formattedRangeLabel={data.vendas_grafico.label_atual}
        />
      </div>

      {/* Main Content Grid: Left 8 cols (Vendas chart + Avaliações + Clientes), Right 4 cols (Promo banner + Serviço) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Main Vendas Comparative Chart */}
          <VendasComparativeChart
            data={data.vendas_grafico}
            activeMetric={metricTab}
            onMetricChange={setMetricTab}
            currencyPrefix="R$"
          />

          {/* Bottom Row: Avaliações + Clientes Donut */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AvaliacoesCard data={data.avaliacoes} />
            <ClientesDonutCard data={data.clientes} />
          </div>
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Promo Referral Banner */}
          <PromoBannerCard />

          {/* Serviço Quality Metrics */}
          <ServicoMetricsCard data={data.servico} />
        </div>
      </div>
    </div>
  );
}
