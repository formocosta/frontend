export type DashboardPeriodo = 'hoje' | '7d' | '30d' | '90d' | 'custom';

export type MetricType = 'vendas' | 'renda' | 'ganhos' | 'taxa';

export interface DashboardAlerta {
  tem_loja_inativa: boolean;
  lojas_inativas_count: number;
  candidaturas_pendentes_count: number;
  disputas_abertas_count: number;
  titulo: string;
  descricao: string;
  link_acao: string;
  texto_botao: string;
}

export interface MetricComparativoItem {
  label?: string;
  valor: number;
  comparativo: number;
  texto_comparativo: string;
}

export interface PerformanceHojeData {
  ultima_atualizacao: string;
  label_comparativo: string;
  pedidos_finalizados: MetricComparativoItem;
  ganhos_vendas: MetricComparativoItem;
  ganhos_loja: MetricComparativoItem;
  pedidos_cancelados: MetricComparativoItem;
  valor_perda_cancelamentos: MetricComparativoItem;
}

export interface VendasPontoChart {
  index: number;
  data_label: string;
  data_completa: string;
  dia_semana: string;
  // Período Atual
  vendas_atual: number;
  renda_atual: number;
  ganhos_atual: number;
  taxa_atual: number;
  // Período Anterior
  vendas_anterior: number;
  renda_anterior: number;
  ganhos_anterior: number;
  taxa_anterior: number;
  data_anterior_label: string;
}

export interface VendasTotaisComparativo {
  atual: number;
  anterior: number;
}

export interface VendasGraficoData {
  label_atual: string;
  label_anterior: string;
  series: VendasPontoChart[];
  totais: {
    vendas_realizadas: VendasTotaisComparativo;
    renda_total: VendasTotaisComparativo;
    ganhos_loja: VendasTotaisComparativo;
    taxa_ganhos: VendasTotaisComparativo;
  };
}

export interface ServicoItem {
  label: string;
  valor: number;
  formatado: string;
}

export interface ServicoMetricasData {
  taxa_cancelamento: ServicoItem;
  valor_perda_cancelamentos: ServicoItem;
  taxa_itens_incorretos: ServicoItem;
  taxa_pedidos_atrasados: ServicoItem;
  tempo_medio_preparacao: ServicoItem;
  horario_funcionamento_diario: ServicoItem;
}

export interface AvaliacoesData {
  media: number;
  total_avaliacoes: number;
  estrelas: number;
  periodo_texto: string;
  aguardando_resposta_count: number;
  mensagem_status: string;
}

export interface ClienteBreakdownItem {
  name: string;
  value: number;
  percentual: number;
  label: string;
  color: string;
}

export interface ClientesData {
  total_clientes: number;
  novos_clientes: number;
  novos_clientes_percentual: number;
  clientes_recorrentes: number;
  clientes_recorrentes_percentual: number;
  breakdown: ClienteBreakdownItem[];
}

export interface DashboardOverviewResponse {
  alerta: DashboardAlerta;
  performance_hoje: PerformanceHojeData;
  vendas_grafico: VendasGraficoData;
  servico: ServicoMetricasData;
  avaliacoes: AvaliacoesData;
  clientes: ClientesData;
  meta: {
    periodo: string;
    periodo_inicio: string;
    periodo_fim: string;
    periodo_anterior_inicio: string;
    periodo_anterior_fim: string;
  };
}
