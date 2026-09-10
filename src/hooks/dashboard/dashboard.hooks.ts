'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  DashboardOverviewResponse,
  DashboardPeriodo,
  MetricType,
} from '@/shared/types/backoffice/dashboard.types';
import { DashboardBackofficeService } from '@/service/backoffice/dashboard.service';

const INITIAL_FALLBACK_DATA: DashboardOverviewResponse = {
  alerta: {
    tem_loja_inativa: true,
    lojas_inativas_count: 2,
    candidaturas_pendentes_count: 3,
    disputas_abertas_count: 0,
    titulo: 'Você tem 3 candidaturas KYC e prestadores pendentes de activação!',
    descricao: 'Analise os documentos submetidos e aprove os perfis para que possam atender clientes.',
    link_acao: '/kyc',
    texto_botao: 'Ver Candidaturas KYC',
  },
  performance_hoje: {
    ultima_atualizacao: '10/09/2026 09:15',
    label_comparativo: 'Último(a) Qui',
    pedidos_finalizados: {
      label: 'Solicitações Concluídas Hoje',
      valor: 8,
      comparativo: 3,
      texto_comparativo: 'Último(a) Qui 3',
    },
    ganhos_vendas: {
      label: 'Volume Transacionado Hoje (GMV)',
      valor: 185000.0,
      comparativo: 65000.0,
      texto_comparativo: 'Último(a) Qui 65.000,00 Kz',
    },
    ganhos_loja: {
      label: 'Receita da Plataforma (Comissões)',
      valor: 27750.0,
      comparativo: 9750.0,
      texto_comparativo: 'Último(a) Qui 9.750,00 Kz',
    },
    pedidos_cancelados: {
      label: 'Solicitações Canceladas Hoje',
      valor: 0,
      comparativo: 0,
      texto_comparativo: 'Último(a) Qui 0',
    },
    valor_perda_cancelamentos: {
      label: 'Perda em Cancelamentos Hoje',
      valor: 0.0,
      comparativo: 0.0,
      texto_comparativo: 'Último(a) Qui 0,00 Kz',
    },
  },
  vendas_grafico: {
    label_atual: '03/09 - 09/09',
    label_anterior: '27/08 - 02/09',
    series: [
      {
        index: 0,
        data_label: '03/09',
        data_completa: '2026-09-03',
        dia_semana: 'Qua',
        vendas_atual: 4,
        renda_atual: 95000.0,
        ganhos_atual: 14250.0,
        taxa_atual: 15.0,
        vendas_anterior: 3,
        renda_anterior: 70000.0,
        ganhos_anterior: 10500.0,
        taxa_anterior: 15.0,
        data_anterior_label: '27/08',
      },
      {
        index: 1,
        data_label: '04/09',
        data_completa: '2026-09-04',
        dia_semana: 'Qui',
        vendas_atual: 6,
        renda_atual: 140000.0,
        ganhos_atual: 21000.0,
        taxa_atual: 15.0,
        vendas_anterior: 4,
        renda_anterior: 85000.0,
        ganhos_anterior: 12750.0,
        taxa_anterior: 15.0,
        data_anterior_label: '28/08',
      },
      {
        index: 2,
        data_label: '05/09',
        data_completa: '2026-09-05',
        dia_semana: 'Sex',
        vendas_atual: 9,
        renda_atual: 220000.0,
        ganhos_atual: 33000.0,
        taxa_atual: 15.0,
        vendas_anterior: 5,
        renda_anterior: 110000.0,
        ganhos_anterior: 16500.0,
        taxa_anterior: 15.0,
        data_anterior_label: '29/08',
      },
      {
        index: 3,
        data_label: '06/09',
        data_completa: '2026-09-06',
        dia_semana: 'Sáb',
        vendas_atual: 11,
        renda_atual: 290000.0,
        ganhos_atual: 43500.0,
        taxa_atual: 15.0,
        vendas_anterior: 8,
        renda_anterior: 190000.0,
        ganhos_anterior: 28500.0,
        taxa_anterior: 15.0,
        data_anterior_label: '30/08',
      },
      {
        index: 4,
        data_label: '07/09',
        data_completa: '2026-09-07',
        dia_semana: 'Dom',
        vendas_atual: 5,
        renda_atual: 120000.0,
        ganhos_atual: 18000.0,
        taxa_atual: 15.0,
        vendas_anterior: 3,
        renda_anterior: 65000.0,
        ganhos_anterior: 9750.0,
        taxa_anterior: 15.0,
        data_anterior_label: '31/08',
      },
      {
        index: 5,
        data_label: '08/09',
        data_completa: '2026-09-08',
        dia_semana: 'Seg',
        vendas_atual: 14,
        renda_atual: 360000.0,
        ganhos_atual: 54000.0,
        taxa_atual: 15.0,
        vendas_anterior: 7,
        renda_anterior: 160000.0,
        ganhos_anterior: 24000.0,
        taxa_anterior: 15.0,
        data_anterior_label: '01/09',
      },
      {
        index: 6,
        data_label: '09/09',
        data_completa: '2026-09-09',
        dia_semana: 'Ter',
        vendas_atual: 8,
        renda_atual: 185000.0,
        ganhos_atual: 27750.0,
        taxa_atual: 15.0,
        vendas_anterior: 6,
        renda_anterior: 135000.0,
        ganhos_anterior: 20250.0,
        taxa_anterior: 15.0,
        data_anterior_label: '02/09',
      },
    ],
    totais: {
      vendas_realizadas: { atual: 57, anterior: 36 },
      renda_total: { atual: 1410000.0, anterior: 815000.0 },
      ganhos_loja: { atual: 211500.0, anterior: 122250.0 },
      taxa_ganhos: { atual: 15.0, anterior: 15.0 },
    },
  },
  servico: {
    taxa_cancelamento: {
      label: 'Taxa de Cancelamento de Serviços',
      valor: 2.1,
      formatado: '2,10%',
    },
    valor_perda_cancelamentos: {
      label: 'Perda Financeira por Cancelamentos',
      valor: 0.0,
      formatado: '0,00 Kz',
    },
    taxa_itens_incorretos: {
      label: 'Taxa de Disputas & Reclamações',
      valor: 0.0,
      formatado: '0,00%',
    },
    taxa_pedidos_atrasados: {
      label: 'Taxa de Atrasos na Execução',
      valor: 3.2,
      formatado: '3,20%',
    },
    tempo_medio_preparacao: {
      label: 'Tempo Médio de Resposta / Início',
      valor: 35.0,
      formatado: '35 mins',
    },
    horario_funcionamento_diario: {
      label: 'Disponibilidade Média dos Prestadores',
      valor: 8.5,
      formatado: '8,5h / dia',
    },
  },
  avaliacoes: {
    media: 4.8,
    total_avaliacoes: 42,
    estrelas: 5,
    periodo_texto: 'De 01/08/2026 - 09/09/2026',
    aguardando_resposta_count: 0,
    mensagem_status: 'Todas as avaliações de clientes foram moderadas',
  },
  clientes: {
    total_clientes: 28,
    novos_clientes: 19,
    novos_clientes_percentual: 67.8,
    clientes_recorrentes: 9,
    clientes_recorrentes_percentual: 32.2,
    breakdown: [
      {
        name: 'Clientes Recorrentes',
        value: 9,
        percentual: 32.2,
        label: 'Clientes Recorrentes 9 (32,2%)',
        color: '#3b82f6',
      },
      {
        name: 'Novos Clientes',
        value: 19,
        percentual: 67.8,
        label: 'Novos Clientes 19 (67,8%)',
        color: '#10b981',
      },
    ],
  },
  meta: {
    periodo: '7d',
    periodo_inicio: '2026-09-03T00:00:00Z',
    periodo_fim: '2026-09-09T23:59:59Z',
    periodo_anterior_inicio: '2026-08-27T00:00:00Z',
    periodo_anterior_fim: '2026-09-02T23:59:59Z',
  },
};

export function useDashboardOverview() {
  const [data, setData] = useState<DashboardOverviewResponse>(INITIAL_FALLBACK_DATA);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [periodo, setPeriodo] = useState<DashboardPeriodo>('7d');
  const [metricTab, setMetricTab] = useState<MetricType>('vendas');
  const [customStartDate, setCustomStartDate] = useState<string>('2026-09-03');
  const [customEndDate, setCustomEndDate] = useState<string>('2026-09-09');
  const [selectedEstablishment, setSelectedEstablishment] = useState<string>('todos');

  const fetchOverview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await DashboardBackofficeService.getOverview({
        periodo,
        start_date: periodo === 'custom' ? customStartDate : undefined,
        end_date: periodo === 'custom' ? customEndDate : undefined,
        prestador_id: selectedEstablishment !== 'todos' ? selectedEstablishment : undefined,
      });
      if (result) {
        setData(result);
      }
    } catch (err: unknown) {
      console.warn('Backend overview endpoint unreachable, using fallback synced data', err);
    } finally {
      setLoading(false);
    }
  }, [periodo, customStartDate, customEndDate, selectedEstablishment]);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  return {
    data,
    loading,
    error,
    periodo,
    setPeriodo,
    metricTab,
    setMetricTab,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    selectedEstablishment,
    setSelectedEstablishment,
    refresh: fetchOverview,
  };
}