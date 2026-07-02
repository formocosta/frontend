'use client';

import { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  FileText, CheckCircle, Clock, XCircle, ArrowUpRight, ArrowDownRight,
  TrendingUp, ArrowRight, Check, BarChart3, Search,
} from 'lucide-react';

// ── Mock data ──────────────────────────────────────────────

const STATS = [
  {
    label: 'Candidaturas KYC',
    value: '248',
    change: 12,
    icon: FileText,
    description: '+24 desde o último mês',
  },
  {
    label: 'KYC Aprovados',
    value: '134',
    change: 8,
    icon: CheckCircle,
    description: '+10 desde o último mês',
  },
  {
    label: 'KYC Pendentes',
    value: '76',
    change: -3,
    icon: Clock,
    description: '-2 desde o último mês',
  },
  {
    label: 'KYC Rejeitados',
    value: '38',
    change: -1,
    icon: XCircle,
    description: '-1 desde o último mês',
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

function StatCard({ label, value, change, icon: Icon, description }: typeof STATS[0]) {
  const positive = change >= 0;
  return (
    <div className="bg-white rounded-xl p-5 flex flex-col justify-between min-h-[145px] shadow-sm border border-gray-200 transition-all hover:shadow-md">
      <div>
        {/* Top Row: Label and Icon */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
          <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm">
            <Icon size={15} />
          </div>
        </div>

        {/* Middle Row: Value and Change Badge */}
        <div className="flex items-baseline gap-2 mt-3">
          <span className="text-2xl font-bold text-gray-900 tracking-tight">{value}</span>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
            positive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
          }`}>
            {positive ? '+' : ''}{change}%
          </span>
        </div>
      </div>

      {/* Bottom Row: Description and detail arrow */}
      <div className="flex items-center justify-between border-t border-gray-50 pt-3 mt-4 text-[11px] text-gray-400 font-semibold">
        <span>{description}</span>
        <button className="text-gray-400 hover:text-emerald-600 transition-colors cursor-pointer">
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}

const STATUS_CONFIG = {
  aprovado:  { label: 'Aprovado',  classes: 'bg-emerald-50 text-emerald-700 border border-emerald-100' },
  pendente:  { label: 'Pendente',  classes: 'bg-amber-50 text-amber-700 border border-amber-100' },
  rejeitado: { label: 'Rejeitado', classes: 'bg-red-50 text-red-600 border border-red-100' },
} as const;

function StatusBadge({ status }: { status: keyof typeof STATUS_CONFIG }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${cfg.classes}`}>
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
            done ? 'bg-[#42b883] border-[#42b883]' : 'border-gray-200 hover:border-[#42b883]'
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
          style={{ width: `${done ? 100 : progress}%`, backgroundColor: done ? '#42b883' : '#42b883' }}
        />
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-8">

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
        {STATS.map(stat => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Main Grid: Chart & Tasks */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Line/Area Chart Card */}
        <div className="xl:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex flex-col justify-between">
          
          {/* Chart Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">CANDIDATURAS KYC</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-gray-900 tracking-tight">63.332 KZ</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                  +10.5%
                </span>
              </div>
            </div>
            
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm">
              <TrendingUp size={15} />
            </div>
          </div>

          {/* Filter Controls Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-50 pt-4 mb-6">
            <div className="flex items-center gap-2">
              <select className="bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-600 px-3 py-1.5 rounded-xl outline-none cursor-pointer hover:bg-gray-100 transition-colors">
                <option>Mensal</option>
                <option>Semanal</option>
                <option>Anual</option>
              </select>
              <select className="bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-600 px-3 py-1.5 rounded-xl outline-none cursor-pointer hover:bg-gray-100 transition-colors">
                <option>Todas Categorias</option>
                <option>KYC Pessoais</option>
                <option>KYC Empresariais</option>
              </select>
            </div>

            {/* Custom Legend */}
            <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span>Candidaturas</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#064e3b]" />
                <span>Aprovações</span>
              </div>
            </div>
          </div>

          {/* Recharts AreaChart with linear gradients */}
          <div className="h-[230px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', fontSize: 11, fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="candidaturas" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCandidaturas)" />
                <Area type="monotone" dataKey="aprovacoes" stroke="#064e3b" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAprovacoes)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* Right side: Conversion Rate & Tasks Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex flex-col justify-between min-h-[350px]">
          
          {/* Taxa de aprovação header */}
          <div className="border-b border-gray-50 pb-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">TAXA DE APROVAÇÃO</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold text-gray-900 tracking-tight">85.4%</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                    +1.2%
                  </span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm">
                <BarChart3 size={15} />
              </div>
            </div>
          </div>

          {/* Tasks section */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-900">Tarefas Pendentes</h3>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
                  {TASKS.length}
                </span>
              </div>
              <div className="space-y-4">
                {TASKS.map(task => (
                  <TaskItem key={task.id} label={task.label} progress={task.progress} />
                ))}
              </div>
            </div>
            
            <button className="flex items-center gap-2 mt-6 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer select-none">
              <span>Gerir todas tarefas</span>
              <ArrowRight size={13} />
            </button>
          </div>

        </div>

      </div>

      {/* Bottom Section: Upgrade Compliance & Recent Activities */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Upgrade Card / Premium Promo */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex flex-col justify-between min-h-[300px]">
          <div>
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">UPGRADE</span>
                <h3 className="text-base font-bold text-gray-900 mt-0.5">Plano Premium</h3>
              </div>
              <button className="bg-[#42b883] hover:bg-[#3aa374] text-white text-xs font-bold px-3 py-1.5 rounded-md transition-all cursor-pointer shadow-sm">
                Upgrade
              </button>
            </div>
            
            <p className="text-xs text-gray-400 mt-4 leading-relaxed font-medium">
              Melhore a gestão de candidaturas KYC e aceda a ferramentas avançadas de análise de risco e relatórios automáticos.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="bg-[#F4F7F6]/80 rounded-xl p-3 border border-gray-100/50">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Performance</span>
              <p className="text-sm font-extrabold text-emerald-600 mt-1">+79%</p>
            </div>
            <div className="bg-[#F4F7F6]/80 rounded-xl p-3 border border-gray-100/50">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Ferramentas</span>
              <p className="text-sm font-extrabold text-emerald-600 mt-1">30+</p>
            </div>
          </div>
        </div>

        {/* Recent Activities Table Card */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col justify-between">
          <div>
            
            {/* Table Header with Search and Refresh */}
            <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Atividades Recentes</h3>
                <p className="text-xs text-gray-400 mt-0.5">Candidaturas KYC submetidas recentemente</p>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Inline Search */}
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-1.5 w-44 hover:bg-gray-100/50 transition-colors">
                  <Search size={13} className="text-gray-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Pesquisar..."
                    className="bg-transparent text-xs text-gray-700 outline-none w-full placeholder:text-gray-400 font-medium"
                  />
                </div>
                
                {/* Refresh Action */}
                <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 border border-gray-200 bg-white px-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer select-none">
                  <ArrowRight size={13} className="rotate-180 text-gray-400" />
                  <span>Atualizar</span>
                </button>
              </div>
            </div>

            {/* Table layout */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-50 bg-gray-50/50">
                    <th className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-6 py-3">Candidato</th>
                    <th className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-6 py-3">Nº Candidatura</th>
                    <th className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-6 py-3">Estado</th>
                    <th className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-6 py-3">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {ACTIVITIES.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100/50 flex items-center justify-center text-emerald-700 text-xs font-extrabold shrink-0 shadow-inner">
                            {a.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <span className="text-xs font-bold text-gray-800">{a.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="text-xs text-gray-500 font-mono font-bold">{a.id}</span>
                      </td>
                      <td className="px-6 py-3.5">
                        <StatusBadge status={a.status as keyof typeof STATUS_CONFIG} />
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="text-xs text-gray-400 font-semibold">{a.date}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
