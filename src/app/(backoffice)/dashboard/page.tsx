'use client';

import { useState, useRef, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line
} from 'recharts';
import {
  Users, AlertCircle, Loader, CheckCircle2, DollarSign, TrendingDown, Send,
  TrendingUp, BarChart3, Calendar, Check, ArrowRight, Clock, ChevronDown
} from 'lucide-react';
import RecentDisputes from '@/components/RecentDisputes';
// ── Types ──────────────────────────────────────────────────

interface StatItem {
  label: string;
  value: string;
  suffix?: string;
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  description: string;
}

// ── Mock data by Period ─────────────────────────────────────

const TASKS = [
  { id: 1, label: 'Revisar documentos KYC', progress: 65 },
  { id: 2, label: 'Aprovar utilizadores', progress: 40 },
  { id: 3, label: 'Validar parceiros', progress: 80 },
  { id: 4, label: 'Resolver tickets abertos', progress: 20 },
];

interface ChartDataItem {
  mes: string;
  candidaturas?: number;
  aprovacoes?: number;
}

interface RequestStatusItem {
  estado: string;
  quantidade: number;
}

interface DailyRevenueItem {
  dia: string;
  receita: number;
}

interface RecentKycItem {
  id: string;
  name: string;
  status: string;
  date: string;
}

const DATA_BY_PERIOD: Record<string, {
  stats: StatItem[];
  chartData: ChartDataItem[];
  requestsByStatus: RequestStatusItem[];
  dailyRevenue: DailyRevenueItem[];
  recentKyc: RecentKycItem[];
}> = {
  today: {
    stats: [
      { label: 'Prestadores Ativos', value: '342', icon: Users, description: 'Último mês: +48' },
      { label: 'Candidaturas Pendentes', value: '3', icon: AlertCircle, description: 'Recebidas hoje' },
      { label: 'Solicitações em Curso', value: '12', icon: Loader, description: 'Em processamento' },
      { label: 'Solicitações Concluídas', value: '28', icon: CheckCircle2, description: 'Concluídas hoje' },
      { label: 'Receita do Período', value: '18.5', suffix: 'K Kz', icon: DollarSign, description: 'Hoje' },
      { label: 'Comissões Retidas', value: '2.1', suffix: 'K Kz', icon: TrendingDown, description: 'A validar' },
      { label: 'Repasses Pendentes', value: '4.8', suffix: 'K Kz', icon: Send, description: 'Hoje' },
    ],
    chartData: [
      { mes: '08:00', candidaturas: 2, aprovacoes: 1 },
      { mes: '10:00', candidaturas: 4, aprovacoes: 2 },
      { mes: '12:00', candidaturas: 8, aprovacoes: 5 },
      { mes: '14:00', candidaturas: 6, aprovacoes: 3 },
      { mes: '16:00', candidaturas: 12, aprovacoes: 8 },
      { mes: '18:00', candidaturas: 7, aprovacoes: 4 },
      { mes: '20:00', candidaturas: 5, aprovacoes: 3 },
    ],
    requestsByStatus: [
      { estado: 'Concluídas', quantidade: 28 },
      { estado: 'Em Curso', quantidade: 12 },
      { estado: 'Pendentes', quantidade: 3 },
      { estado: 'Rejeitadas', quantidade: 1 },
    ],
    dailyRevenue: [
      { dia: '08:00', receita: 1500 },
      { dia: '10:00', receita: 3200 },
      { dia: '12:00', receita: 4500 },
      { dia: '14:00', receita: 2100 },
      { dia: '16:00', receita: 6800 },
      { dia: '18:00', receita: 5400 },
      { dia: '20:00', receita: 8900 },
    ],
    recentKyc: [
      { id: 'KYC-001', name: 'Maria Fernanda Silva', status: 'pendente', date: 'Há 5 min' },
      { id: 'KYC-002', name: 'João Paulo Mendes', status: 'pendente', date: 'Há 25 min' },
    ]
  },
  '7days': {
    stats: [
      { label: 'Prestadores Ativos', value: '342', icon: Users, description: 'Último mês: +48' },
      { label: 'Candidaturas Pendentes', value: '18', icon: AlertCircle, description: 'Últimos 7 dias' },
      { label: 'Solicitações em Curso', value: '45', icon: Loader, description: 'Em processamento' },
      { label: 'Solicitações Concluídas', value: '142', icon: CheckCircle2, description: 'Últimos 7 dias' },
      { label: 'Receita do Período', value: '112.4', suffix: 'K Kz', icon: DollarSign, description: 'Últimos 7 dias' },
      { label: 'Comissões Retidas', value: '15.8', suffix: 'K Kz', icon: TrendingDown, description: 'A validar' },
      { label: 'Repasses Pendentes', value: '28.2', suffix: 'K Kz', icon: Send, description: 'Agendados' },
    ],
    chartData: [
      { mes: 'Seg', candidaturas: 8, aprovacoes: 4 },
      { mes: 'Ter', candidaturas: 12, aprovacoes: 6 },
      { mes: 'Qua', candidaturas: 15, aprovacoes: 9 },
      { mes: 'Qui', candidaturas: 10, aprovacoes: 5 },
      { mes: 'Sex', candidaturas: 18, aprovacoes: 11 },
      { mes: 'Sáb', candidaturas: 14, aprovacoes: 8 },
      { mes: 'Dom', candidaturas: 9, aprovacoes: 5 },
    ],
    requestsByStatus: [
      { estado: 'Concluídas', quantidade: 142 },
      { estado: 'Em Curso', quantidade: 45 },
      { estado: 'Pendentes', quantidade: 18 },
      { estado: 'Rejeitadas', quantidade: 8 },
    ],
    dailyRevenue: [
      { dia: '10/06', receita: 8500 },
      { dia: '11/06', receita: 9200 },
      { dia: '12/06', receita: 11000 },
      { dia: '13/06', receita: 7800 },
      { dia: '14/06', receita: 12500 },
      { dia: '15/06', receita: 14000 },
      { dia: '16/06', receita: 10500 },
    ],
    recentKyc: [
      { id: 'KYC-001', name: 'Maria Fernanda Silva', status: 'pendente', date: 'Há 5 min' },
      { id: 'KYC-002', name: 'João Paulo Mendes', status: 'pendente', date: 'Há 25 min' },
      { id: 'KYC-003', name: 'António dos Santos', status: 'pendente', date: 'Há 1 hora' },
    ]
  },
  '30days': {
    stats: [
      { label: 'Prestadores Ativos', value: '342', icon: Users, description: 'Último mês: +48' },
      { label: 'Candidaturas Pendentes', value: '87', icon: AlertCircle, description: 'Aguardando revisão' },
      { label: 'Solicitações em Curso', value: '156', icon: Loader, description: 'Em processamento' },
      { label: 'Solicitações Concluídas', value: '1,243', icon: CheckCircle2, description: 'Total histórico' },
      { label: 'Receita do Período', value: '245.8', suffix: 'K Kz', icon: DollarSign, description: 'Junho 2026' },
      { label: 'Comissões Retidas', value: '34.5', suffix: 'K Kz', icon: TrendingDown, description: 'A validar' },
      { label: 'Repasses Pendentes', value: '56.3', suffix: 'K Kz', icon: Send, description: 'Próximos dias' },
    ],
    chartData: [
      { mes: 'Jan', candidaturas: 28, aprovacoes: 14 },
      { mes: 'Fev', candidaturas: 35, aprovacoes: 20 },
      { mes: 'Mar', candidaturas: 22, aprovacoes: 12 },
      { mes: 'Abr', candidaturas: 41, aprovacoes: 26 },
      { mes: 'Mai', candidaturas: 38, aprovacoes: 22 },
      { mes: 'Jun', candidaturas: 52, aprovacoes: 34 },
      { mes: 'Jul', candidaturas: 47, aprovacoes: 30 },
    ],
    requestsByStatus: [
      { estado: 'Concluídas', quantidade: 420 },
      { estado: 'Em Curso', quantidade: 156 },
      { estado: 'Pendentes', quantidade: 87 },
      { estado: 'Rejeitadas', quantidade: 32 },
    ],
    dailyRevenue: [
      { dia: '01/06', receita: 10000 },
      { dia: '02/06', receita: 12000 },
      { dia: '03/06', receita: 9000 },
      { dia: '04/06', receita: 15000 },
      { dia: '05/06', receita: 11000 },
      { dia: '06/06', receita: 13500 },
      { dia: '07/06', receita: 16000 },
      { dia: '08/06', receita: 14500 },
      { dia: '09/06', receita: 18000 },
      { dia: '10/06', receita: 15500 },
      { dia: '11/06', receita: 19000 },
      { dia: '12/06', receita: 17500 },
      { dia: '13/06', receita: 21000 },
      { dia: '14/06', receita: 23000 },
      { dia: '15/06', receita: 20000 },
      { dia: '16/06', receita: 24500 },
    ],
    recentKyc: [
      { id: 'KYC-001', name: 'Maria Fernanda Silva', status: 'pendente', date: 'Há 5 min' },
      { id: 'KYC-002', name: 'João Paulo Mendes', status: 'pendente', date: 'Há 25 min' },
      { id: 'KYC-003', name: 'António dos Santos', status: 'pendente', date: 'Há 1 hora' },
      { id: 'KYC-004', name: 'Carlos Alberto Neto', status: 'aprovado', date: 'Hoje, 09:12' },
      { id: 'KYC-005', name: 'Beatriz Lopes Costa', status: 'rejeitado', date: 'Ontem, 17:45' },
    ]
  },
  '90days': {
    stats: [
      { label: 'Prestadores Ativos', value: '358', icon: Users, description: 'Últimos 90 dias: +96' },
      { label: 'Candidaturas Pendentes', value: '210', icon: AlertCircle, description: 'Últimos 90 dias' },
      { label: 'Solicitações em Curso', value: '320', icon: Loader, description: 'Médio prazo' },
      { label: 'Solicitações Concluídas', value: '3,840', icon: CheckCircle2, description: 'Últimos 90 dias' },
      { label: 'Receita do Período', value: '890.5', suffix: 'K Kz', icon: DollarSign, description: 'Últimos 90 dias' },
      { label: 'Comissões Retidas', value: '112.4', suffix: 'K Kz', icon: TrendingDown, description: 'Acumulado' },
      { label: 'Repasses Pendentes', value: '185.0', suffix: 'K Kz', icon: Send, description: 'Trimestral' },
    ],
    chartData: [
      { mes: 'Abr', candidaturas: 41, aprovacoes: 26 },
      { mes: 'Mai', candidaturas: 38, aprovacoes: 22 },
      { mes: 'Jun', candidaturas: 52, aprovacoes: 34 },
    ],
    requestsByStatus: [
      { estado: 'Concluídas', quantidade: 1140 },
      { estado: 'Em Curso', quantidade: 410 },
      { estado: 'Pendentes', quantidade: 220 },
      { estado: 'Rejeitadas', quantidade: 85 },
    ],
    dailyRevenue: [
      { dia: '15/03', receita: 35000 },
      { dia: '22/03', receita: 42000 },
      { dia: '29/03', receita: 39000 },
      { dia: '05/04', receita: 45000 },
      { dia: '12/04', receita: 48000 },
      { dia: '19/04', receita: 41000 },
      { dia: '26/04', receita: 53000 },
      { dia: '03/05', receita: 50000 },
      { dia: '10/05', receita: 62000 },
      { dia: '17/05', receita: 58000 },
      { dia: '24/05', receita: 65000 },
      { dia: '31/05', receita: 70000 },
      { dia: '07/06', receita: 75000 },
      { dia: '14/06', receita: 82000 },
    ],
    recentKyc: [
      { id: 'KYC-001', name: 'Maria Fernanda Silva', status: 'pendente', date: 'Há 5 min' },
      { id: 'KYC-002', name: 'João Paulo Mendes', status: 'pendente', date: 'Há 25 min' },
      { id: 'KYC-003', name: 'António dos Santos', status: 'pendente', date: 'Há 1 hora' },
      { id: 'KYC-004', name: 'Carlos Alberto Neto', status: 'aprovado', date: 'Hoje, 09:12' },
      { id: 'KYC-005', name: 'Beatriz Lopes Costa', status: 'rejeitado', date: 'Ontem, 17:45' },
    ]
  },
  custom: {
    stats: [
      { label: 'Prestadores Ativos', value: '342', icon: Users, description: 'Período personalizado' },
      { label: 'Candidaturas Pendentes', value: '45', icon: AlertCircle, description: 'Período personalizado' },
      { label: 'Solicitações em Curso', value: '90', icon: Loader, description: 'Período personalizado' },
      { label: 'Solicitações Concluídas', value: '650', icon: CheckCircle2, description: 'Período personalizado' },
      { label: 'Receita do Período', value: '410.2', suffix: 'K Kz', icon: DollarSign, description: 'Período personalizado' },
      { label: 'Comissões Retidas', value: '52.0', suffix: 'K Kz', icon: TrendingDown, description: 'Período personalizado' },
      { label: 'Repasses Pendentes', value: '78.4', suffix: 'K Kz', icon: Send, description: 'Período personalizado' },
    ],
    chartData: [
      { mes: 'Semana 1', candidaturas: 20, aprovacoes: 10 },
      { mes: 'Semana 2', candidaturas: 30, aprovacoes: 18 },
      { mes: 'Semana 3', candidaturas: 25, aprovacoes: 15 },
      { mes: 'Semana 4', candidaturas: 35, aprovacoes: 22 },
    ],
    requestsByStatus: [
      { estado: 'Concluídas', quantidade: 650 },
      { estado: 'Em Curso', quantidade: 90 },
      { estado: 'Pendentes', quantidade: 45 },
      { estado: 'Rejeitadas', quantidade: 18 },
    ],
    dailyRevenue: [
      { dia: 'P1', receita: 22000 },
      { dia: 'P2', receita: 28000 },
      { dia: 'P3', receita: 25000 },
      { dia: 'P4', receita: 32000 },
      { dia: 'P5', receita: 30000 },
      { dia: 'P6', receita: 35000 },
    ],
    recentKyc: [
      { id: 'KYC-001', name: 'Maria Fernanda Silva', status: 'pendente', date: 'Há 5 min' },
      { id: 'KYC-002', name: 'João Paulo Mendes', status: 'pendente', date: 'Há 25 min' },
      { id: 'KYC-003', name: 'António dos Santos', status: 'pendente', date: 'Há 1 hora' },
      { id: 'KYC-004', name: 'Carlos Alberto Neto', status: 'aprovado', date: 'Hoje, 09:12' },
      { id: 'KYC-005', name: 'Beatriz Lopes Costa', status: 'rejeitado', date: 'Ontem, 17:45' },
    ]
  }
};

// ── Sub-components ─────────────────────────────────────────

function StatCard({ label, value, suffix, icon: Icon, description, isLoading }: StatItem & { isLoading?: boolean }) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm animate-pulse min-h-[120px] flex flex-col justify-between">
        <div className="flex items-start justify-between mb-3">
          <div className="h-2.5 bg-slate-100 rounded w-3/4"></div>
          <div className="w-9 h-9 rounded-lg bg-slate-100 shrink-0"></div>
        </div>
        <div className="h-7 bg-slate-100 rounded w-1/2 mb-1"></div>
        <div className="h-2.5 bg-slate-50 rounded w-2/3"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</h3>
        <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
          <Icon size={18} className="text-emerald-600" strokeWidth={1.5} />
        </div>
      </div>
      <div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-slate-900 tracking-tight">{value}</span>
          {suffix && <span className="text-xs font-semibold text-slate-500">{suffix}</span>}
        </div>
        <p className="text-xs text-slate-400 font-medium mt-1">{description}</p>
      </div>
    </div>
  );
}

const STATUS_CONFIG = {
  aprovado: { label: 'Aprovado', classes: 'bg-emerald-50 text-emerald-700 border border-emerald-100' },
  pendente: { label: 'Pendente', classes: 'bg-amber-50 text-amber-700 border border-amber-100' },
  rejeitado: { label: 'Rejeitado', classes: 'bg-red-50 text-red-600 border border-red-100' },
} as const;

function StatusBadge({ status }: { status: keyof typeof STATUS_CONFIG }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${cfg.classes}`}>
      {cfg.label}
    </span>
  );
}

function TaskItem({ label, progress }: { label: string; progress: number }) {
  const [done, setDone] = useState(false);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setDone(v => !v)}
          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 cursor-pointer ${
            done ? 'bg-[#06241C] border-[#06241C]' : 'border-gray-200 hover:border-[#06241C]'
          }`}
        >
          {done && <Check size={11} className="text-white" strokeWidth={3} />}
        </button>
        <span className={`text-xs font-semibold flex-1 ${done ? 'line-through text-gray-300' : 'text-gray-700'}`}>
          {label}
        </span>
        <span className="text-[10px] text-gray-400 font-bold font-mono">{progress}%</span>
      </div>
      <div className="ml-8 h-1.5 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${done ? 100 : progress}%`, backgroundColor: done ? '#06241C' : '#10B981' }}
        />
      </div>
    </div>
  );
}

const PRIMARY_STATS_COUNT = 4;

type PeriodType = 'today' | '7days' | '30days' | '90days' | 'custom';

interface PeriodSelectorProps {
  value: PeriodType;
  onChange: (period: PeriodType) => void;
  startDate?: string;
  endDate?: string;
  onStartDateChange?: (date: string) => void;
  onEndDateChange?: (date: string) => void;
  dateError?: string;
}

function PeriodSelector({
  value,
  onChange,
  startDate = '',
  endDate = '',
  onStartDateChange = () => {},
  onEndDateChange = () => {},
  dateError = '',
}: PeriodSelectorProps) {
  return (
    <div className="space-y-3 w-full">
      <div>
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Período</label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Calendar size={14} />
          </div>
          <select
            value={value}
            onChange={(e) => onChange(e.target.value as PeriodType)}
            className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-9 py-2.5 text-xs font-semibold text-slate-700 outline-none transition-all hover:border-slate-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 [color-scheme:light]"
          >
            <option value="today">Hoje</option>
            <option value="7days">Últimos 7 dias</option>
            <option value="30days">Últimos 30 dias</option>
            <option value="90days">Últimos 90 dias</option>
            <option value="custom">Intervalo personalizado</option>
          </select>
          <ChevronDown size={12} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      {value === 'custom' && (
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 animate-in fade-in duration-200 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Início</label>
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2">
                <Calendar size={14} className="text-slate-400" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => onStartDateChange(e.target.value)}
                  className="bg-transparent text-xs text-slate-800 outline-none w-full [color-scheme:light]"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Fim</label>
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2">
                <Calendar size={14} className="text-slate-400" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => onEndDateChange(e.target.value)}
                  className="bg-transparent text-xs text-slate-800 outline-none w-full [color-scheme:light]"
                />
              </div>
            </div>
          </div>
          {dateError && <p className="text-[11px] text-red-600 font-medium">{dateError}</p>}
        </div>
      )}
    </div>
  );
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length && payload[0].value !== undefined) {
    return (
      <div className="bg-white p-2.5 border border-gray-200 rounded-lg shadow-sm text-xs font-bold text-gray-800">
        {payload[0].value.toLocaleString('pt-PT')} Kz
      </div>
    );
  }
  return null;
};

// ── Main Page ──────────────────────────────────────────────

export default function DashboardPage() {
  const [period, setPeriod] = useState<PeriodType>('30days');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateError, setDateError] = useState('');
  const [activeInsightTab, setActiveInsightTab] = useState<'requests' | 'revenue'>('requests');

  // Period datasets states
  const [currentStats, setCurrentStats] = useState<StatItem[]>(DATA_BY_PERIOD['30days'].stats);
  const [currentChartData, setCurrentChartData] = useState<ChartDataItem[]>(DATA_BY_PERIOD['30days'].chartData);
  const [currentRequestsData, setCurrentRequestsData] = useState<RequestStatusItem[]>(DATA_BY_PERIOD['30days'].requestsByStatus);
  const [currentRevenueData, setCurrentRevenueData] = useState<DailyRevenueItem[]>(DATA_BY_PERIOD['30days'].dailyRevenue);
  const [currentKyc, setCurrentKyc] = useState<RecentKycItem[]>(DATA_BY_PERIOD['30days'].recentKyc);
  const [isLoading, setIsLoading] = useState(false);

  const visibleStats = currentStats.slice(0, PRIMARY_STATS_COUNT);
  const secondaryStats = currentStats.slice(PRIMARY_STATS_COUNT);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const refreshData = (activePeriod: PeriodType) => {
    setIsLoading(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const data = DATA_BY_PERIOD[activePeriod] || DATA_BY_PERIOD['30days'];
      setCurrentStats(data.stats);
      setCurrentChartData(data.chartData);
      setCurrentRequestsData(data.requestsByStatus);
      setCurrentRevenueData(data.dailyRevenue);
      setCurrentKyc(data.recentKyc);
      setIsLoading(false);
    }, 450);
  };

  useEffect(() => {
    refreshIntervalRef.current = setInterval(() => {
      refreshData(period);
    }, 5 * 60 * 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  const handlePeriodChange = (newPeriod: PeriodType) => {
    setPeriod(newPeriod);
    setDateError('');

    if (timerRef.current) clearTimeout(timerRef.current);
    setIsLoading(true);
    timerRef.current = setTimeout(() => {
      const data = DATA_BY_PERIOD[newPeriod] || DATA_BY_PERIOD['30days'];
      setCurrentStats(data.stats);
      setCurrentChartData(data.chartData);
      setCurrentRequestsData(data.requestsByStatus);
      setCurrentRevenueData(data.dailyRevenue);
      setCurrentKyc(data.recentKyc);
      setIsLoading(false);
    }, 450);
  };

  const handleStartDateChange = (date: string) => {
    setStartDate(date);
    validateDates(date, endDate);
    if (date && endDate && new Date(date) <= new Date(endDate)) {
      triggerCustomDataLoad();
    }
  };

  const handleEndDateChange = (date: string) => {
    setEndDate(date);
    validateDates(startDate, date);
    if (startDate && date && new Date(startDate) <= new Date(date)) {
      triggerCustomDataLoad();
    }
  };

  const triggerCustomDataLoad = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsLoading(true);
    timerRef.current = setTimeout(() => {
      const data = DATA_BY_PERIOD['custom'];
      setCurrentStats(data.stats);
      setCurrentChartData(data.chartData);
      setCurrentRequestsData(data.requestsByStatus);
      setCurrentRevenueData(data.dailyRevenue);
      setCurrentKyc(data.recentKyc);
      setIsLoading(false);
    }, 450);
  };

  const validateDates = (start: string, end: string) => {
    if (start && end && new Date(start) > new Date(end)) {
      setDateError('Data inicial inválida');
    } else {
      setDateError('');
    }
  };

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-10 px-4">

      <section className="space-y-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-600">Visão geral</p>
            <h1 className="text-2xl md:text-[28px] font-semibold tracking-tight text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-500 max-w-2xl">
              Métricas essenciais em primeiro plano e detalhes operacionais recolhidos para reduzir distrações.
            </p>
          </div>
          <div className="text-[11px] font-medium text-slate-400 md:text-right">
            Actualizado automaticamente a cada 5 minutos
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {visibleStats.map((stat) => (
            <div key={stat.label}>
              <StatCard {...stat} isLoading={isLoading} />
            </div>
          ))}
        </div>

        {secondaryStats.length > 0 && (
          <details className="group rounded-2xl border border-slate-200 bg-white shadow-sm">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">Mais indicadores</p>
                <p className="text-xs text-slate-500 mt-0.5">{secondaryStats.length} métricas secundárias recolhidas por defeito</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 group-open:text-slate-900">
                Ver detalhes
                <ChevronDown size={14} className="transition-transform group-open:rotate-180" />
              </div>
            </summary>
            <div className="px-5 pb-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {secondaryStats.map((stat) => (
                  <StatCard key={stat.label} {...stat} isLoading={isLoading} />
                ))}
              </div>
            </div>
          </details>
        )}
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between mb-6">
            <div className="space-y-1">
              <h2 className="text-[15px] font-bold text-slate-900">Análise Histórica de Candidaturas</h2>
              <p className="text-xs text-slate-400">Visão macro por meses, com apenas um filtro exposto de cada vez.</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
              <TrendingUp size={18} className="text-emerald-600" strokeWidth={1.5} />
            </div>
          </div>

          <div className="mb-4 pb-4 border-b border-slate-100">
            <PeriodSelector
              value={period}
              onChange={handlePeriodChange}
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={handleStartDateChange}
              onEndDateChange={handleEndDateChange}
              dateError={dateError}
            />
          </div>

          {isLoading ? (
            <div className="h-[240px] w-full flex items-center justify-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200 animate-pulse">
              <div className="flex flex-col items-center gap-2">
                <Loader className="animate-spin text-emerald-600" size={24} />
                <span className="text-xs text-slate-500 font-medium">A carregar análise...</span>
              </div>
            </div>
          ) : (
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentChartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCandidaturas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorAprovacoes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#064e3b" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#064e3b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F9FBFB" />
                  <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#9CA3AF', fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9CA3AF', fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', fontSize: 11 }} />
                  <Area type="monotone" dataKey="candidaturas" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCandidaturas)" />
                  <Area type="monotone" dataKey="aprovacoes" stroke="#064e3b" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAprovacoes)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-[15px] font-bold text-slate-900">Tarefas Internas</h2>
                <p className="text-xs text-slate-400 mt-0.5">{TASKS.length} acções necessárias</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <BarChart3 size={18} className="text-emerald-600" strokeWidth={1.5} />
              </div>
            </div>

            <div className="space-y-4">
              {TASKS.map(task => (
                <TaskItem key={task.id} label={task.label} progress={task.progress} />
              ))}
            </div>
          </div>
          
          <button className="mt-6 w-full text-xs font-semibold text-[#06241C] hover:text-emerald-700 border border-emerald-200 hover:border-emerald-300 hover:bg-green-50 py-2.5 rounded-xl transition-all">
            Ver todas as tarefas
          </button>
        </div>
      </div>

      <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between mb-5">
          <div className="space-y-1">
            <h2 className="text-[15px] font-bold text-slate-900">Análises Secundárias</h2>
            <p className="text-xs text-slate-400">Seleciona o foco que queres ver sem abrir mais blocos na página.</p>
          </div>
          <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1 self-start">
            <button
              onClick={() => setActiveInsightTab('requests')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeInsightTab === 'requests'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Solicitações
            </button>
            <button
              onClick={() => setActiveInsightTab('revenue')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeInsightTab === 'revenue'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Receita
            </button>
          </div>
        </div>

        {activeInsightTab === 'requests' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Solicitações por Estado</p>
                <p className="text-xs text-slate-400 mt-0.5">Volume total no período</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <BarChart3 size={18} className="text-emerald-600" strokeWidth={1.5} />
              </div>
            </div>

            {isLoading ? (
              <div className="h-[240px] w-full flex items-center justify-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200 animate-pulse">
                <div className="flex flex-col items-center gap-2">
                  <Loader className="animate-spin text-emerald-600" size={24} />
                  <span className="text-xs text-slate-500 font-medium">A carregar solicitações...</span>
                </div>
              </div>
            ) : (
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={currentRequestsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                    <XAxis dataKey="estado" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: '#F9FAFB' }} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }} />
                    <Bar dataKey="quantidade" fill="#10B981" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Evolução da Receita Diária</p>
                <p className="text-xs text-slate-400 mt-0.5">Faturamento em Kz no período</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <TrendingUp size={18} className="text-emerald-600" strokeWidth={1.5} />
              </div>
            </div>

            {isLoading ? (
              <div className="h-[240px] w-full flex items-center justify-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200 animate-pulse">
                <div className="flex flex-col items-center gap-2">
                  <Loader className="animate-spin text-emerald-600" size={24} />
                  <span className="text-xs text-slate-500 font-medium">A carregar receita...</span>
                </div>
              </div>
            ) : (
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={currentRevenueData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                    <XAxis dataKey="dia" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                    <YAxis 
                      tick={{ fontSize: 11, fill: '#6B7280' }} 
                      axisLine={false} 
                      tickLine={false} 
                      tickFormatter={(val) => `${(val / 1000).toLocaleString('pt-PT')}k`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="receita" name="Receita (Kz)" stroke="#064e3b" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── NOVAS LISTAS (Tabelas de Operações) ─────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Requisito 3: Fila / Lista KYC Recentes */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-[15px] font-bold text-slate-900">Candidaturas KYC Recentes</h2>
                <p className="text-xs text-slate-400 mt-0.5">Últimos registos submetidos</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Clock size={16} className="text-emerald-600" strokeWidth={1.5} />
              </div>
            </div>
            
            {isLoading ? (
              <div className="divide-y divide-gray-100 animate-pulse">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="p-4 flex items-center justify-between">
                    <div className="h-4 bg-gray-100 rounded w-1/3 my-1"></div>
                    <div className="w-16 h-5 bg-gray-50 rounded-full"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {currentKyc.map((kyc) => (
                  <div key={kyc.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#06241C] to-emerald-700 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                        {kyc.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-slate-800 block truncate">{kyc.name}</span>
                        <span className="text-[10px] text-slate-400">{kyc.date}</span>
                      </div>
                    </div>
                    <StatusBadge status={kyc.status as 'aprovado' | 'pendente' | 'rejeitado'} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-100">
            <a
              href="/kyc"
              className="inline-flex items-center justify-center gap-1.5 w-full text-xs font-semibold text-[#06241C] hover:text-emerald-700 hover:bg-green-50 py-2 rounded-xl transition-all"
            >
              Ir para a fila de validação completa
              <ArrowRight size={14} />
            </a>
          </div>
        </div>

        {/* Novo Componente: RecentDisputes */}
        <RecentDisputes />

      </div>

    </div>
  );
}