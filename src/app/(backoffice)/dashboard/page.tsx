'use client';

import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  FileText, CheckCircle, Clock, XCircle, ArrowUpRight, ArrowDownRight,
  TrendingUp, ArrowRight, Check,
} from 'lucide-react';

// ── Mock data ──────────────────────────────────────────────

const STATS = [
  {
    label: 'Total Candidaturas',
    value: 248,
    change: +12,
    icon: FileText,
    gradient: true,
  },
  {
    label: 'KYC Aprovados',
    value: 134,
    change: +8,
    icon: CheckCircle,
    gradient: false,
  },
  {
    label: 'KYC Pendentes',
    value: 76,
    change: -3,
    icon: Clock,
    gradient: false,
  },
  {
    label: 'KYC Rejeitados',
    value: 38,
    change: -1,
    icon: XCircle,
    gradient: false,
  },
];

const CHART_DATA = [
  { mes: 'Jan', candidaturas: 28, aprovacoes: 14 },
  { mes: 'Fev', candidaturas: 35, aprovacoes: 20 },
  { mes: 'Mar', candidaturas: 22, aprovacoes: 12 },
  { mes: 'Abr', candidaturas: 41, aprovacoes: 26 },
  { mes: 'Mai', candidaturas: 38, aprovacoes: 22 },
  { mes: 'Jun', candidaturas: 52, aprovacoes: 34 },
  { mes: 'Jul', candidaturas: 47, aprovacoes: 30 },
];

const ACTIVITIES = [
  { id: 'KYC-001', name: 'Maria Fernanda Silva',  status: 'aprovado',  date: '01 Jun 2026' },
  { id: 'KYC-002', name: 'João Paulo Mendes',     status: 'pendente',  date: '01 Jun 2026' },
  { id: 'KYC-003', name: 'Ana Cristina Faria',    status: 'rejeitado', date: '31 Mai 2026' },
  { id: 'KYC-004', name: 'Carlos Alberto Neto',   status: 'aprovado',  date: '31 Mai 2026' },
  { id: 'KYC-005', name: 'Beatriz Lopes Costa',   status: 'pendente',  date: '30 Mai 2026' },
  { id: 'KYC-006', name: 'Rui Manuel Oliveira',   status: 'aprovado',  date: '30 Mai 2026' },
];

const TASKS = [
  { id: 1, label: 'Revisar documentos KYC',  progress: 65 },
  { id: 2, label: 'Aprovar utilizadores',     progress: 40 },
  { id: 3, label: 'Validar parceiros',        progress: 80 },
  { id: 4, label: 'Resolver tickets abertos', progress: 20 },
];

// ── Sub-components ─────────────────────────────────────────

function StatCard({ label, value, change, icon: Icon, gradient }: typeof STATS[0]) {
  const positive = change >= 0;

  if (gradient) {
    return (
      <div className="relative overflow-hidden rounded-2xl p-6 flex flex-col justify-between min-h-[140px]"
        style={{ background: 'linear-gradient(135deg, #0E8A4B 0%, #0a6e3c 60%, #064d2a 100%)' }}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white/70 text-sm font-medium">{label}</p>
            <p className="text-4xl font-bold text-white mt-2">{value}</p>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Icon size={20} className="text-white" />
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-4">
          <ArrowUpRight size={14} className="text-emerald-300" />
          <span className="text-emerald-300 text-xs font-medium">+{change}% em relação ao mês anterior</span>
        </div>
        {/* decorative circle */}
        <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full" />
        <div className="absolute -right-2 -bottom-10 w-20 h-20 bg-white/10 rounded-full" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 flex flex-col justify-between min-h-[140px] shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{label}</p>
          <p className="text-4xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
          <Icon size={20} className="text-gray-400" />
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-4">
        {positive
          ? <ArrowUpRight size={14} className="text-emerald-500" />
          : <ArrowDownRight size={14} className="text-red-400" />}
        <span className={`text-xs font-medium ${positive ? 'text-emerald-600' : 'text-red-500'}`}>
          {positive ? '+' : ''}{change}% em relação ao mês anterior
        </span>
      </div>
    </div>
  );
}

const STATUS_CONFIG = {
  aprovado:  { label: 'Aprovado',  classes: 'bg-emerald-50 text-emerald-700' },
  pendente:  { label: 'Pendente',  classes: 'bg-amber-50 text-amber-700' },
  rejeitado: { label: 'Rejeitado', classes: 'bg-red-50 text-red-600' },
} as const;

function StatusBadge({ status }: { status: keyof typeof STATUS_CONFIG }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${cfg.classes}`}>
      {cfg.label}
    </span>
  );
}

function TaskItem({ label, progress }: { label: string; progress: number }) {
  const [done, setDone] = useState(false);
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setDone(v => !v)}
          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 ${
            done ? 'bg-[#0E8A4B] border-[#0E8A4B]' : 'border-gray-300 hover:border-[#0E8A4B]'
          }`}
        >
          {done && <Check size={11} className="text-white" strokeWidth={3} />}
        </button>
        <span className={`text-sm font-medium flex-1 ${done ? 'line-through text-gray-400' : 'text-gray-700'}`}>
          {label}
        </span>
        <span className="text-xs text-gray-400 font-mono">{progress}%</span>
      </div>
      <div className="ml-8 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${done ? 100 : progress}%`, backgroundColor: '#0E8A4B' }}
        />
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-[1400px]">

      {/* Page heading */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Monitorize, priorize e gira as suas candidaturas.</p>
        </div>
        <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 border border-gray-200 bg-white px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors">
          Importar dados
          <ArrowRight size={15} />
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map(stat => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Analytics + Tasks */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-gray-900">Analytics de Candidaturas</h2>
              <p className="text-xs text-gray-400 mt-0.5">Candidaturas e aprovações por mês</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium bg-emerald-50 px-3 py-1.5 rounded-xl">
              <TrendingUp size={13} />
              +18% este mês
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={CHART_DATA} barSize={14} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: 12 }}
                cursor={{ fill: '#F7F8FA' }}
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 16 }} />
              <Bar dataKey="candidaturas" name="Candidaturas" fill="#0E8A4B" radius={[6, 6, 0, 0]} />
              <Bar dataKey="aprovacoes" name="Aprovações" fill="#A7F3D0" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tasks */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-gray-900">Tarefas Pendentes</h2>
              <p className="text-xs text-gray-400 mt-0.5">{TASKS.length} tarefas por concluir</p>
            </div>
            <span className="text-xs font-semibold text-[#0E8A4B] bg-emerald-50 px-2.5 py-1 rounded-lg">
              {TASKS.length}
            </span>
          </div>
          <div className="space-y-5">
            {TASKS.map(task => (
              <TaskItem key={task.id} label={task.label} progress={task.progress} />
            ))}
          </div>
        </div>
      </div>

      {/* Recent activities */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">Atividades Recentes</h2>
            <p className="text-xs text-gray-400 mt-0.5">Últimas candidaturas submetidas</p>
          </div>
          <button className="flex items-center gap-1.5 text-sm font-medium text-[#0E8A4B] hover:text-[#0a7040] transition-colors">
            Ver todas
            <ArrowRight size={15} />
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-3">Candidato</th>
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-3">Nº Candidatura</th>
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-3">Estado</th>
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-3">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {ACTIVITIES.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#0E8A4B]/10 flex items-center justify-center text-[#0E8A4B] text-xs font-bold shrink-0">
                      {a.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{a.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-500 font-mono">{a.id}</span>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={a.status as keyof typeof STATUS_CONFIG} />
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-400">{a.date}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
