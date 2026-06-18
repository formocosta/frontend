'use client';

import { useState, useCallback, useMemo, useRef } from 'react';
import {
  FileSpreadsheet, FileText, TrendingUp, Users, ClipboardList,
  Calendar, Download, Check, Loader, AlertCircle,
  ChevronLeft, ChevronRight, DollarSign, Star, MapPin,
  CreditCard, Filter, BarChart3, X, CheckCircle,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

type ReportType = 'financeiro' | 'solicitacoes' | 'prestadores';
type Period     = 'hoje' | '7d' | '30d' | 'mes' | 'custom';
type ExportPhase = 'idle' | 'generating' | 'preparing' | 'done' | 'error';

interface DateRange { from: string; to: string }

interface FinFilters  { metodo: string; status: string }
interface SolFilters  { status: string; categoria: string; provincia: string }
interface PreFilters  { categoria: string; verificacao: string; classificacao: string }

// ─────────────────────────────────────────────────────────────
// Mock data — financial rows
// ─────────────────────────────────────────────────────────────

const FIN_ROWS = [
  { id:'TXN-001', data:'2026-06-17', prestador:'João Silva',     servico:'Limpeza doméstica',   valor:15000, metodo:'cartao',       status:'pago' },
  { id:'TXN-002', data:'2026-06-17', prestador:'Maria Pereira',  servico:'Canalização',          valor:28500, metodo:'transferencia', status:'pago' },
  { id:'TXN-003', data:'2026-06-16', prestador:'Carlos Ferreira',servico:'Eletricidade',         valor:42000, metodo:'dinheiro',      status:'pendente' },
  { id:'TXN-004', data:'2026-06-15', prestador:'Ana Rodrigues',  servico:'Jardinagem',           valor:9500,  metodo:'cartao',       status:'pago' },
  { id:'TXN-005', data:'2026-06-14', prestador:'Pedro Santos',   servico:'Pintura',              valor:65000, metodo:'transferencia', status:'pago' },
  { id:'TXN-006', data:'2026-06-13', prestador:'Luísa Nunes',    servico:'Limpeza pós-obra',     valor:35000, metodo:'cartao',       status:'reembolsado' },
  { id:'TXN-007', data:'2026-06-12', prestador:'Miguel Costa',   servico:'Desinfestação',        valor:18000, metodo:'dinheiro',      status:'pago' },
  { id:'TXN-008', data:'2026-06-11', prestador:'Sofia Mendes',   servico:'Impermeabilização',    valor:52000, metodo:'transferencia', status:'pago' },
  { id:'TXN-009', data:'2026-06-10', prestador:'António Lima',   servico:'Montagem de móveis',   valor:12000, metodo:'cartao',       status:'cancelado' },
  { id:'TXN-010', data:'2026-06-09', prestador:'Inês Carvalho',  servico:'Energia solar',        valor:120000,metodo:'transferencia', status:'pago' },
  { id:'TXN-011', data:'2026-06-08', prestador:'Bruno Matos',    servico:'Limpeza de vidros',    valor:8000,  metodo:'cartao',       status:'pago' },
  { id:'TXN-012', data:'2026-06-07', prestador:'Carla Sousa',    servico:'Canalização',          valor:32000, metodo:'dinheiro',      status:'pendente' },
  { id:'TXN-013', data:'2026-06-05', prestador:'David Alves',    servico:'Eletricidade',         valor:27500, metodo:'cartao',       status:'pago' },
  { id:'TXN-014', data:'2026-06-03', prestador:'Eva Lima',       servico:'Poda e manutenção',    valor:11000, metodo:'transferencia', status:'pago' },
  { id:'TXN-015', data:'2026-05-31', prestador:'Francisco Pinto',servico:'Pintura',              valor:48000, metodo:'cartao',       status:'pago' },
  { id:'TXN-016', data:'2026-05-28', prestador:'Graça Teixeira', servico:'Limpeza doméstica',   valor:14500, metodo:'dinheiro',      status:'pago' },
  { id:'TXN-017', data:'2026-05-25', prestador:'Hugo Ferreira',  servico:'Revisão elétrica',     valor:21000, metodo:'cartao',       status:'reembolsado' },
  { id:'TXN-018', data:'2026-05-22', prestador:'Isabel Martins', servico:'Fumigação',            valor:25000, metodo:'transferencia', status:'pago' },
  { id:'TXN-019', data:'2026-05-20', prestador:'João Silva',     servico:'Limpeza escritórios',  valor:19000, metodo:'cartao',       status:'pendente' },
  { id:'TXN-020', data:'2026-05-18', prestador:'Kátia Morais',   servico:'Instalação sanitária', valor:38000, metodo:'dinheiro',      status:'pago' },
  { id:'TXN-021', data:'2026-05-15', prestador:'Luís Baptista',  servico:'Jardinagem',           valor:13000, metodo:'cartao',       status:'pago' },
  { id:'TXN-022', data:'2026-05-12', prestador:'Maria Pereira',  servico:'Desentupimento',       valor:16500, metodo:'transferencia', status:'cancelado' },
  { id:'TXN-023', data:'2026-05-08', prestador:'Nuno Correia',   servico:'Energia solar',        valor:95000, metodo:'transferencia', status:'pago' },
  { id:'TXN-024', data:'2026-05-05', prestador:'Olga Simões',    servico:'Quadros elétricos',    valor:44000, metodo:'cartao',       status:'pago' },
  { id:'TXN-025', data:'2026-05-01', prestador:'Paulo Brito',    servico:'Impermeabilização',    valor:61000, metodo:'dinheiro',      status:'pago' },
] as const;

// ─────────────────────────────────────────────────────────────
// Mock data — solicitações rows
// ─────────────────────────────────────────────────────────────

const SOL_ROWS = [
  { id:'SOL-001', data:'2026-06-17', servico:'Limpeza doméstica',   prestador:'João Silva',    provincia:'Luanda',   categoria:'Limpeza',     status:'concluido' },
  { id:'SOL-002', data:'2026-06-17', servico:'Canalização urgente', prestador:'Carlos Matos',  provincia:'Benguela', categoria:'Canalização', status:'em_curso' },
  { id:'SOL-003', data:'2026-06-16', servico:'Revisão elétrica',    prestador:'Ana Rodrigues', provincia:'Luanda',   categoria:'Eletricidade', status:'pendente' },
  { id:'SOL-004', data:'2026-06-15', servico:'Poda de jardim',      prestador:'Pedro Lima',    provincia:'Huambo',   categoria:'Jardinagem',   status:'concluido' },
  { id:'SOL-005', data:'2026-06-14', servico:'Pintura interior',    prestador:'Sofia Costa',   provincia:'Luanda',   categoria:'Obras',        status:'em_curso' },
  { id:'SOL-006', data:'2026-06-13', servico:'Limpeza pós-obra',    prestador:'Miguel Nunes',  provincia:'Cabinda',  categoria:'Limpeza',     status:'cancelado' },
  { id:'SOL-007', data:'2026-06-12', servico:'Desinfestação',       prestador:'Inês Ferreira', provincia:'Luanda',   categoria:'Pragas',       status:'concluido' },
  { id:'SOL-008', data:'2026-06-11', servico:'Montagem móveis',     prestador:'Bruno Teixeira',provincia:'Benguela', categoria:'Obras',        status:'concluido' },
  { id:'SOL-009', data:'2026-06-10', servico:'Energia solar',       prestador:'Carla Sousa',   provincia:'Luanda',   categoria:'Eletricidade', status:'em_curso' },
  { id:'SOL-010', data:'2026-06-09', servico:'Limpeza vidros',      prestador:'David Pinto',   provincia:'Malanje',  categoria:'Limpeza',     status:'pendente' },
  { id:'SOL-011', data:'2026-06-08', servico:'Impermeabilização',   prestador:'Eva Alves',     provincia:'Luanda',   categoria:'Obras',        status:'concluido' },
  { id:'SOL-012', data:'2026-06-07', servico:'Instalação tomadas',  prestador:'Francisco Lima',provincia:'Benguela', categoria:'Eletricidade', status:'concluido' },
  { id:'SOL-013', data:'2026-06-05', servico:'Limpeza doméstica',   prestador:'Graça Sousa',   provincia:'Luanda',   categoria:'Limpeza',     status:'concluido' },
  { id:'SOL-014', data:'2026-06-03', servico:'Desentupimento',      prestador:'Hugo Mendes',   provincia:'Uíge',     categoria:'Canalização', status:'cancelado' },
  { id:'SOL-015', data:'2026-06-01', servico:'Reparação de canos',  prestador:'Isabel Brito',  provincia:'Luanda',   categoria:'Canalização', status:'concluido' },
  { id:'SOL-016', data:'2026-05-28', servico:'Pintura exterior',    prestador:'João Silva',    provincia:'Huambo',   categoria:'Obras',        status:'concluido' },
  { id:'SOL-017', data:'2026-05-25', servico:'Poda e rega',         prestador:'Kátia Barros',  provincia:'Luanda',   categoria:'Jardinagem',   status:'em_curso' },
  { id:'SOL-018', data:'2026-05-22', servico:'Quadros elétricos',   prestador:'Luís Correia',  provincia:'Benguela', categoria:'Eletricidade', status:'concluido' },
  { id:'SOL-019', data:'2026-05-19', servico:'Fumigação',           prestador:'Maria Pereira', provincia:'Luanda',   categoria:'Pragas',       status:'concluido' },
  { id:'SOL-020', data:'2026-05-16', servico:'Limpeza escritórios', prestador:'Nuno Cardoso',  provincia:'Cabinda',  categoria:'Limpeza',     status:'pendente' },
  { id:'SOL-021', data:'2026-05-13', servico:'Instalação sanitária',prestador:'Olga Simões',   provincia:'Luanda',   categoria:'Canalização', status:'concluido' },
  { id:'SOL-022', data:'2026-05-10', servico:'Energia solar',       prestador:'Paulo Matos',   provincia:'Malanje',  categoria:'Eletricidade', status:'cancelado' },
  { id:'SOL-023', data:'2026-05-07', servico:'Limpeza doméstica',   prestador:'Rute Ferreira', provincia:'Luanda',   categoria:'Limpeza',     status:'concluido' },
  { id:'SOL-024', data:'2026-05-04', servico:'Poda manutenção',     prestador:'Samuel Teixeira',provincia:'Benguela',categoria:'Jardinagem',   status:'concluido' },
  { id:'SOL-025', data:'2026-05-01', servico:'Revisão elétrica',    prestador:'Teresa Costa',  provincia:'Luanda',   categoria:'Eletricidade', status:'concluido' },
] as const;

// ─────────────────────────────────────────────────────────────
// Mock data — prestadores rows
// ─────────────────────────────────────────────────────────────

const PRE_ROWS = [
  { id:'PRE-001', nome:'João Silva',      email:'joao.silva@mail.ao',      categoria:'Limpeza',     verificacao:'aprovado',  classificacao:4.8, servicos:47, receita:682000 },
  { id:'PRE-002', nome:'Carlos Matos',    email:'carlos.matos@mail.ao',    categoria:'Canalização', verificacao:'aprovado',  classificacao:4.6, servicos:32, receita:912000 },
  { id:'PRE-003', nome:'Ana Rodrigues',   email:'ana.rodrigues@mail.ao',   categoria:'Eletricidade',verificacao:'aprovado',  classificacao:4.9, servicos:61, receita:1540000 },
  { id:'PRE-004', nome:'Pedro Lima',      email:'pedro.lima@mail.ao',      categoria:'Jardinagem',  verificacao:'aprovado',  classificacao:4.5, servicos:28, receita:364000 },
  { id:'PRE-005', nome:'Sofia Costa',     email:'sofia.costa@mail.ao',     categoria:'Obras',       verificacao:'pendente',  classificacao:4.2, servicos:15, receita:875000 },
  { id:'PRE-006', nome:'Miguel Nunes',    email:'miguel.nunes@mail.ao',    categoria:'Limpeza',     verificacao:'aprovado',  classificacao:4.7, servicos:53, receita:742000 },
  { id:'PRE-007', nome:'Inês Ferreira',   email:'ines.ferreira@mail.ao',   categoria:'Pragas',      verificacao:'aprovado',  classificacao:4.4, servicos:21, receita:462000 },
  { id:'PRE-008', nome:'Bruno Teixeira',  email:'bruno.teixeira@mail.ao',  categoria:'Obras',       verificacao:'aprovado',  classificacao:4.6, servicos:38, receita:1190000 },
  { id:'PRE-009', nome:'Carla Sousa',     email:'carla.sousa@mail.ao',     categoria:'Eletricidade',verificacao:'pendente',  classificacao:3.9, servicos:9,  receita:432000 },
  { id:'PRE-010', nome:'David Pinto',     email:'david.pinto@mail.ao',     categoria:'Limpeza',     verificacao:'aprovado',  classificacao:4.3, servicos:19, receita:247000 },
  { id:'PRE-011', nome:'Eva Alves',       email:'eva.alves@mail.ao',       categoria:'Obras',       verificacao:'rejeitado', classificacao:3.1, servicos:4,  receita:96000 },
  { id:'PRE-012', nome:'Francisco Lima',  email:'francisco.lima@mail.ao',  categoria:'Eletricidade',verificacao:'aprovado',  classificacao:4.7, servicos:44, receita:1232000 },
  { id:'PRE-013', nome:'Graça Sousa',     email:'graca.sousa@mail.ao',     categoria:'Limpeza',     verificacao:'aprovado',  classificacao:4.9, servicos:72, receita:978000 },
  { id:'PRE-014', nome:'Hugo Mendes',     email:'hugo.mendes@mail.ao',     categoria:'Canalização', verificacao:'pendente',  classificacao:4.0, servicos:11, receita:303000 },
  { id:'PRE-015', nome:'Isabel Brito',    email:'isabel.brito@mail.ao',    categoria:'Canalização', verificacao:'aprovado',  classificacao:4.8, servicos:36, receita:972000 },
  { id:'PRE-016', nome:'Kátia Barros',    email:'katia.barros@mail.ao',    categoria:'Jardinagem',  verificacao:'aprovado',  classificacao:4.5, servicos:24, receita:312000 },
  { id:'PRE-017', nome:'Luís Correia',    email:'luis.correia@mail.ao',    categoria:'Eletricidade',verificacao:'aprovado',  classificacao:4.6, servicos:41, receita:1148000 },
  { id:'PRE-018', nome:'Maria Pereira',   email:'maria.pereira@mail.ao',   categoria:'Pragas',      verificacao:'rejeitado', classificacao:2.8, servicos:2,  receita:36000 },
  { id:'PRE-019', nome:'Nuno Cardoso',    email:'nuno.cardoso@mail.ao',    categoria:'Limpeza',     verificacao:'pendente',  classificacao:4.1, servicos:7,  receita:98000 },
  { id:'PRE-020', nome:'Olga Simões',     email:'olga.simoes@mail.ao',     categoria:'Canalização', verificacao:'aprovado',  classificacao:4.7, servicos:29, receita:783000 },
] as const;

// ─────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysAgoStr(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function monthStartStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

function periodRange(period: Period, custom: DateRange): DateRange {
  const today = todayStr();
  switch (period) {
    case 'hoje':  return { from: today,              to: today };
    case '7d':    return { from: daysAgoStr(6),       to: today };
    case '30d':   return { from: daysAgoStr(29),      to: today };
    case 'mes':   return { from: monthStartStr(),     to: today };
    case 'custom':return custom;
  }
}

function inRange(date: string, range: DateRange): boolean {
  return date >= range.from && date <= range.to;
}

function formatCurrency(v: number): string {
  return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 }).format(v);
}

function formatDate(d: string): string {
  return new Date(d + 'T00:00:00').toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' });
}

function generateCSV(headers: string[], rows: string[][]): string {
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
  return [headers.map(esc).join(','), ...rows.map(r => r.map(esc).join(','))].join('\n');
}

function triggerDownload(content: string, filename: string, mime: string) {
  const blob = new Blob(['﻿' + content], { type: mime });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─────────────────────────────────────────────────────────────
// Small UI pieces
// ─────────────────────────────────────────────────────────────

function KpiCard({
  icon, iconBg, label, value, sub, subColor = 'text-gray-400',
}: {
  icon: React.ReactNode; iconBg: string; label: string;
  value: string | number; sub: string; subColor?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider truncate">{label}</p>
        <p className="text-xl font-bold text-gray-900 truncate">{value}</p>
        <p className={`text-[10px] mt-0.5 font-medium ${subColor} truncate`}>{sub}</p>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{children}</p>
  );
}

function SelectBox({
  value, onChange, children, className = '',
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full appearance-none text-xs bg-white border border-gray-200 rounded-xl px-3 py-2 pr-7 outline-none focus:border-emerald-400 transition-colors cursor-pointer [color-scheme:light] text-gray-800"
      >
        {children}
      </select>
      <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Report type selector
// ─────────────────────────────────────────────────────────────

const REPORT_TYPES = [
  {
    id: 'financeiro' as ReportType,
    label: 'Financeiro',
    desc: 'Receitas, pagamentos e transações',
    icon: <DollarSign size={20} />,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    activeBg: 'bg-[#06241C]',
    activeText: 'text-white',
  },
  {
    id: 'solicitacoes' as ReportType,
    label: 'Solicitações',
    desc: 'Pedidos, status e categorias',
    icon: <ClipboardList size={20} />,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    activeBg: 'bg-[#06241C]',
    activeText: 'text-white',
  },
  {
    id: 'prestadores' as ReportType,
    label: 'Prestadores',
    desc: 'Perfis, verificações e avaliações',
    icon: <Users size={20} />,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    activeBg: 'bg-[#06241C]',
    activeText: 'text-white',
  },
] as const;

function ReportTypeSelector({
  value, onChange,
}: { value: ReportType; onChange: (t: ReportType) => void }) {
  return (
    <div className="space-y-2">
      {REPORT_TYPES.map(rt => {
        const active = value === rt.id;
        return (
          <button
            key={rt.id}
            onClick={() => onChange(rt.id)}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
              active
                ? 'bg-[#06241C] border-[#06241C] shadow-sm'
                : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/60'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${active ? 'bg-white/15' : rt.bg}`}>
              <span className={active ? 'text-white' : rt.color}>{rt.icon}</span>
            </div>
            <div className="min-w-0">
              <p className={`text-xs font-bold truncate ${active ? 'text-white' : 'text-gray-800'}`}>{rt.label}</p>
              <p className={`text-[10px] truncate mt-0.5 ${active ? 'text-white/60' : 'text-gray-400'}`}>{rt.desc}</p>
            </div>
            {active && <CheckCircle size={14} className="text-white/80 shrink-0 ml-auto" />}
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Period selector
// ─────────────────────────────────────────────────────────────

const PERIODS: { id: Period; label: string }[] = [
  { id: 'hoje', label: 'Hoje' },
  { id: '7d',   label: '7 dias' },
  { id: '30d',  label: '30 dias' },
  { id: 'mes',  label: 'Este mês' },
  { id: 'custom',label: 'Personalizado' },
];

function PeriodSelector({
  value, onChange, custom, onCustom,
}: {
  value: Period;
  onChange: (p: Period) => void;
  custom: DateRange;
  onCustom: (r: DateRange) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {PERIODS.map(p => (
          <button
            key={p.id}
            onClick={() => onChange(p.id)}
            className={`px-3 py-1.5 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
              value === p.id
                ? 'bg-[#06241C] text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      {value === 'custom' && (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">De</label>
            <input
              type="date"
              value={custom.from}
              max={custom.to || todayStr()}
              onChange={e => onCustom({ ...custom, from: e.target.value })}
              className="w-full text-xs bg-white border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-emerald-400 transition-colors [color-scheme:light]"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Até</label>
            <input
              type="date"
              value={custom.to}
              min={custom.from}
              max={todayStr()}
              onChange={e => onCustom({ ...custom, to: e.target.value })}
              className="w-full text-xs bg-white border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-emerald-400 transition-colors [color-scheme:light]"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Filter panels (per type)
// ─────────────────────────────────────────────────────────────

function FinanceiroFilters({
  value, onChange,
}: { value: FinFilters; onChange: (f: FinFilters) => void }) {
  return (
    <div className="space-y-3">
      <div>
        <SectionLabel>Método de pagamento</SectionLabel>
        <SelectBox value={value.metodo} onChange={v => onChange({ ...value, metodo: v })}>
          <option value="">Todos os métodos</option>
          <option value="cartao">Cartão</option>
          <option value="transferencia">Transferência</option>
          <option value="dinheiro">Dinheiro</option>
        </SelectBox>
      </div>
      <div>
        <SectionLabel>Status de pagamento</SectionLabel>
        <SelectBox value={value.status} onChange={v => onChange({ ...value, status: v })}>
          <option value="">Todos os status</option>
          <option value="pago">Pago</option>
          <option value="pendente">Pendente</option>
          <option value="reembolsado">Reembolsado</option>
          <option value="cancelado">Cancelado</option>
        </SelectBox>
      </div>
    </div>
  );
}

function SolicitacoesFilters({
  value, onChange,
}: { value: SolFilters; onChange: (f: SolFilters) => void }) {
  return (
    <div className="space-y-3">
      <div>
        <SectionLabel>Status</SectionLabel>
        <SelectBox value={value.status} onChange={v => onChange({ ...value, status: v })}>
          <option value="">Todos os status</option>
          <option value="pendente">Pendente</option>
          <option value="em_curso">Em curso</option>
          <option value="concluido">Concluído</option>
          <option value="cancelado">Cancelado</option>
        </SelectBox>
      </div>
      <div>
        <SectionLabel>Categoria</SectionLabel>
        <SelectBox value={value.categoria} onChange={v => onChange({ ...value, categoria: v })}>
          <option value="">Todas as categorias</option>
          <option value="Limpeza">Limpeza</option>
          <option value="Canalização">Canalização</option>
          <option value="Eletricidade">Eletricidade</option>
          <option value="Jardinagem">Jardinagem</option>
          <option value="Obras">Obras</option>
          <option value="Pragas">Controlo de Pragas</option>
        </SelectBox>
      </div>
      <div>
        <SectionLabel>Província</SectionLabel>
        <SelectBox value={value.provincia} onChange={v => onChange({ ...value, provincia: v })}>
          <option value="">Todas as províncias</option>
          <option value="Luanda">Luanda</option>
          <option value="Benguela">Benguela</option>
          <option value="Huambo">Huambo</option>
          <option value="Cabinda">Cabinda</option>
          <option value="Malanje">Malanje</option>
          <option value="Uíge">Uíge</option>
        </SelectBox>
      </div>
    </div>
  );
}

function PrestadoresFilters({
  value, onChange,
}: { value: PreFilters; onChange: (f: PreFilters) => void }) {
  return (
    <div className="space-y-3">
      <div>
        <SectionLabel>Categoria</SectionLabel>
        <SelectBox value={value.categoria} onChange={v => onChange({ ...value, categoria: v })}>
          <option value="">Todas as categorias</option>
          <option value="Limpeza">Limpeza</option>
          <option value="Canalização">Canalização</option>
          <option value="Eletricidade">Eletricidade</option>
          <option value="Jardinagem">Jardinagem</option>
          <option value="Obras">Obras</option>
          <option value="Pragas">Controlo de Pragas</option>
        </SelectBox>
      </div>
      <div>
        <SectionLabel>Estado de verificação</SectionLabel>
        <SelectBox value={value.verificacao} onChange={v => onChange({ ...value, verificacao: v })}>
          <option value="">Todos</option>
          <option value="aprovado">Aprovado</option>
          <option value="pendente">Pendente</option>
          <option value="rejeitado">Rejeitado</option>
        </SelectBox>
      </div>
      <div>
        <SectionLabel>Classificação mínima</SectionLabel>
        <SelectBox value={value.classificacao} onChange={v => onChange({ ...value, classificacao: v })}>
          <option value="">Todas</option>
          <option value="4.5">≥ 4.5 estrelas</option>
          <option value="4.0">≥ 4.0 estrelas</option>
          <option value="3.5">≥ 3.5 estrelas</option>
        </SelectBox>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Export progress
// ─────────────────────────────────────────────────────────────

function ExportProgress({ phase, format }: { phase: ExportPhase; format: 'excel' | 'pdf' | null }) {
  if (phase === 'idle') return null;

  const steps: { key: ExportPhase; label: string }[] = [
    { key: 'generating', label: 'A gerar relatório...' },
    { key: 'preparing',  label: 'A preparar ficheiro...' },
    { key: 'done',       label: 'Download concluído!' },
  ];

  const stepIdx = steps.findIndex(s => s.key === phase);

  if (phase === 'error') {
    return (
      <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl animate-in fade-in duration-200">
        <AlertCircle size={15} className="text-red-500 shrink-0" />
        <div>
          <p className="text-xs font-bold text-red-700">Erro ao gerar relatório</p>
          <p className="text-[10px] text-red-500 mt-0.5">Tente novamente. Se o problema persistir, contacte o suporte.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs space-y-3 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {phase === 'done'
            ? <Check size={15} className="text-emerald-600" />
            : <Loader size={15} className="text-[#06241C] animate-spin" />
          }
          <span className="text-xs font-semibold text-gray-800">
            {steps.find(s => s.key === phase)?.label}
          </span>
        </div>
        <span className="text-[10px] text-gray-400 font-medium">
          {format === 'excel' ? 'Excel / CSV' : 'PDF / HTML'}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${phase === 'done' ? 'bg-emerald-500' : 'bg-[#06241C]'}`}
          style={{ width: phase === 'generating' ? '40%' : phase === 'preparing' ? '75%' : '100%' }}
        />
      </div>

      {/* Steps */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
              i < stepIdx ? 'bg-emerald-500' :
              i === stepIdx ? (phase === 'done' ? 'bg-emerald-500' : 'bg-[#06241C]') :
              'bg-gray-200'
            }`} />
            <span className={`text-[10px] font-medium ${i <= stepIdx ? 'text-gray-600' : 'text-gray-300'}`}>
              {s.label.replace('...', '').replace('!', '')}
            </span>
            {i < steps.length - 1 && <span className="text-gray-200 text-[10px]">→</span>}
          </div>
        ))}
      </div>

      {phase === 'done' && (
        <p className="text-[10px] text-emerald-600 font-semibold">
          O download foi iniciado automaticamente.
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Preview table
// ─────────────────────────────────────────────────────────────

const PAGE_SIZE = 8;

function StatusPill({ value }: { value: string }) {
  const map: Record<string, string> = {
    pago:        'bg-emerald-50 text-emerald-700 border-emerald-100',
    pendente:    'bg-amber-50 text-amber-700 border-amber-100',
    reembolsado: 'bg-blue-50 text-blue-700 border-blue-100',
    cancelado:   'bg-red-50 text-red-700 border-red-100',
    em_curso:    'bg-blue-50 text-blue-700 border-blue-100',
    concluido:   'bg-emerald-50 text-emerald-700 border-emerald-100',
    aprovado:    'bg-emerald-50 text-emerald-700 border-emerald-100',
    rejeitado:   'bg-red-50 text-red-700 border-red-100',
  };
  const labels: Record<string, string> = {
    pago: 'Pago', pendente: 'Pendente', reembolsado: 'Reembolsado', cancelado: 'Cancelado',
    em_curso: 'Em curso', concluido: 'Concluído', aprovado: 'Aprovado', rejeitado: 'Rejeitado',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${map[value] ?? 'bg-gray-100 text-gray-500 border-gray-200'}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${map[value]?.includes('emerald') ? 'bg-emerald-500' : map[value]?.includes('amber') ? 'bg-amber-500' : map[value]?.includes('blue') ? 'bg-blue-500' : 'bg-red-500'}`} />
      {labels[value] ?? value}
    </span>
  );
}

function MetodoPill({ value }: { value: string }) {
  const map: Record<string, string> = {
    cartao: 'bg-purple-50 text-purple-700 border-purple-100',
    transferencia: 'bg-blue-50 text-blue-700 border-blue-100',
    dinheiro: 'bg-amber-50 text-amber-700 border-amber-100',
  };
  const labels: Record<string, string> = { cartao: 'Cartão', transferencia: 'Transferência', dinheiro: 'Dinheiro' };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold border ${map[value] ?? 'bg-gray-100 text-gray-500 border-gray-200'}`}>
      {labels[value] ?? value}
    </span>
  );
}

function StarRating({ value }: { value: number }) {
  const color = value >= 4.5 ? 'text-emerald-600' : value >= 4.0 ? 'text-amber-500' : 'text-red-500';
  return (
    <span className={`text-xs font-bold flex items-center gap-0.5 ${color}`}>
      <Star size={11} fill="currentColor" />
      {value.toFixed(1)}
    </span>
  );
}

type AnyRow = typeof FIN_ROWS[number] | typeof SOL_ROWS[number] | typeof PRE_ROWS[number];

function PreviewTable({ reportType, rows, page, onPage }: {
  reportType: ReportType;
  rows: readonly AnyRow[];
  page: number;
  onPage: (p: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const pageRows   = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (rows.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs py-16 flex flex-col items-center gap-3 text-center">
        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
          <BarChart3 size={20} className="text-gray-300" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-600">Sem dados para exibir</p>
          <p className="text-xs text-gray-400 mt-1">Ajuste os filtros ou o período selecionado.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden flex flex-col">
      <div className="overflow-x-auto flex-1">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60">
              {reportType === 'financeiro' && (
                <>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Data</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Prestador</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Serviço</th>
                  <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-400 uppercase tracking-wider">Valor</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Método</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                </>
              )}
              {reportType === 'solicitacoes' && (
                <>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Data</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Serviço</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Prestador</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Categoria</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Província</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                </>
              )}
              {reportType === 'prestadores' && (
                <>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nome</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Categoria</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Verificação</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Classif.</th>
                  <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-400 uppercase tracking-wider">Serviços</th>
                  <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-400 uppercase tracking-wider">Receita</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row, i) => (
              <tr key={row.id} className={`border-b border-gray-50 hover:bg-gray-50/40 transition-colors ${i === pageRows.length - 1 ? 'border-b-0' : ''}`}>
                {reportType === 'financeiro' && (() => {
                  const r = row as typeof FIN_ROWS[number];
                  return (
                    <>
                      <td className="px-4 py-3"><span className="text-[10px] font-mono text-gray-400">{r.id}</span></td>
                      <td className="px-4 py-3"><span className="text-xs text-gray-600">{formatDate(r.data)}</span></td>
                      <td className="px-4 py-3"><span className="text-xs font-medium text-gray-800">{r.prestador}</span></td>
                      <td className="px-4 py-3"><span className="text-xs text-gray-600 truncate max-w-[140px] block">{r.servico}</span></td>
                      <td className="px-4 py-3 text-right"><span className="text-xs font-bold text-gray-900">{formatCurrency(r.valor)}</span></td>
                      <td className="px-4 py-3"><MetodoPill value={r.metodo} /></td>
                      <td className="px-4 py-3"><StatusPill value={r.status} /></td>
                    </>
                  );
                })()}
                {reportType === 'solicitacoes' && (() => {
                  const r = row as typeof SOL_ROWS[number];
                  return (
                    <>
                      <td className="px-4 py-3"><span className="text-[10px] font-mono text-gray-400">{r.id}</span></td>
                      <td className="px-4 py-3"><span className="text-xs text-gray-600">{formatDate(r.data)}</span></td>
                      <td className="px-4 py-3"><span className="text-xs font-medium text-gray-800 truncate max-w-[140px] block">{r.servico}</span></td>
                      <td className="px-4 py-3"><span className="text-xs text-gray-600">{r.prestador}</span></td>
                      <td className="px-4 py-3"><span className="text-[10px] font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-lg">{r.categoria}</span></td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-600 flex items-center gap-1">
                          <MapPin size={10} className="text-gray-400 shrink-0" />{r.provincia}
                        </span>
                      </td>
                      <td className="px-4 py-3"><StatusPill value={r.status} /></td>
                    </>
                  );
                })()}
                {reportType === 'prestadores' && (() => {
                  const r = row as typeof PRE_ROWS[number];
                  return (
                    <>
                      <td className="px-4 py-3"><span className="text-[10px] font-mono text-gray-400">{r.id}</span></td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-xs font-semibold text-gray-800">{r.nome}</p>
                          <p className="text-[10px] text-gray-400">{r.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3"><span className="text-[10px] font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-lg">{r.categoria}</span></td>
                      <td className="px-4 py-3"><StatusPill value={r.verificacao} /></td>
                      <td className="px-4 py-3"><StarRating value={r.classificacao} /></td>
                      <td className="px-4 py-3 text-right"><span className="text-xs font-bold text-gray-700">{r.servicos}</span></td>
                      <td className="px-4 py-3 text-right"><span className="text-xs font-bold text-gray-900">{formatCurrency(r.receita)}</span></td>
                    </>
                  );
                })()}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between">
          <span className="text-[11px] text-gray-400">
            {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, rows.length)} de {rows.length} registos
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPage(page - 1)}
              disabled={page === 1}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce<(number | '…')[]>((acc, p, idx, arr) => {
                if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('…');
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === '…' ? (
                  <span key={`ellipsis-${i}`} className="text-[11px] text-gray-300 px-1">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => onPage(p as number)}
                    className={`w-7 h-7 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                      page === p ? 'bg-[#06241C] text-white' : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {p}
                  </button>
                )
              )
            }
            <button
              onClick={() => onPage(page + 1)}
              disabled={page === totalPages}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────

export default function RelatoriosPage() {
  const [reportType, setReportType] = useState<ReportType>('financeiro');
  const [period, setPeriod]         = useState<Period>('30d');
  const [custom, setCustom]         = useState<DateRange>({ from: daysAgoStr(29), to: todayStr() });
  const [finFilters, setFinFilters] = useState<FinFilters>({ metodo: '', status: '' });
  const [solFilters, setSolFilters] = useState<SolFilters>({ status: '', categoria: '', provincia: '' });
  const [preFilters, setPreFilters] = useState<PreFilters>({ categoria: '', verificacao: '', classificacao: '' });
  const [page, setPage]             = useState(1);
  const [exportPhase, setExportPhase] = useState<ExportPhase>('idle');
  const [exportFormat, setExportFormat] = useState<'excel' | 'pdf' | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const exportRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const range = useMemo(() => periodRange(period, custom), [period, custom]);

  // ── Derived filtered rows ──────────────────────────────────
  const filteredRows = useMemo(() => {
    if (reportType === 'financeiro') {
      return (FIN_ROWS as readonly typeof FIN_ROWS[number][]).filter(r =>
        inRange(r.data, range) &&
        (!finFilters.metodo || r.metodo === finFilters.metodo) &&
        (!finFilters.status || r.status === finFilters.status)
      );
    }
    if (reportType === 'solicitacoes') {
      return (SOL_ROWS as readonly typeof SOL_ROWS[number][]).filter(r =>
        inRange(r.data, range) &&
        (!solFilters.status   || r.status    === solFilters.status) &&
        (!solFilters.categoria|| r.categoria === solFilters.categoria) &&
        (!solFilters.provincia|| r.provincia === solFilters.provincia)
      );
    }
    // prestadores — no date filter (they're profiles, not transactions)
    return (PRE_ROWS as readonly typeof PRE_ROWS[number][]).filter(r =>
      (!preFilters.categoria   || r.categoria  === preFilters.categoria) &&
      (!preFilters.verificacao || r.verificacao=== preFilters.verificacao) &&
      (!preFilters.classificacao || r.classificacao >= parseFloat(preFilters.classificacao))
    );
  }, [reportType, range, finFilters, solFilters, preFilters]);

  // Reset page when filters change
  const handleTypeChange = useCallback((t: ReportType) => {
    setReportType(t);
    setPage(1);
    setExportPhase('idle');
  }, []);

  const handlePeriodChange = useCallback((p: Period) => {
    setPeriod(p);
    setPage(1);
  }, []);

  // ── KPIs ──────────────────────────────────────────────────
  const kpis = useMemo(() => {
    if (reportType === 'financeiro') {
      const rows = filteredRows as typeof FIN_ROWS[number][];
      const total = rows.reduce((s, r) => s + r.valor, 0);
      const pagos = rows.filter(r => r.status === 'pago').length;
      return [
        { label: 'Receita total',   value: formatCurrency(total),       sub: `${rows.length} transações`,       iconBg: 'bg-[#06241C]/[0.08]', icon: <DollarSign size={18} className="text-[#06241C]" />, subColor: 'text-gray-400' },
        { label: 'Média por TXN',   value: rows.length ? formatCurrency(Math.round(total / rows.length)) : '—', sub: 'valor médio',            iconBg: 'bg-emerald-50',      icon: <TrendingUp size={18} className="text-emerald-600" />, subColor: 'text-emerald-600' },
        { label: 'Transações pagas',value: pagos,                        sub: `${rows.length ? Math.round(pagos/rows.length*100) : 0}% do total`, iconBg: 'bg-blue-50', icon: <CreditCard size={18} className="text-blue-600" />, subColor: 'text-blue-600' },
        { label: 'Pendentes',       value: rows.filter(r => r.status === 'pendente').length, sub: 'a processar', iconBg: 'bg-amber-50', icon: <Calendar size={18} className="text-amber-500" />, subColor: 'text-amber-600' },
      ];
    }
    if (reportType === 'solicitacoes') {
      const rows = filteredRows as typeof SOL_ROWS[number][];
      const conc = rows.filter(r => r.status === 'concluido').length;
      return [
        { label: 'Total',           value: rows.length,  sub: 'solicitações',          iconBg: 'bg-[#06241C]/[0.08]', icon: <ClipboardList size={18} className="text-[#06241C]" />, subColor: 'text-gray-400' },
        { label: 'Concluídas',      value: conc,          sub: `${rows.length ? Math.round(conc/rows.length*100) : 0}% de sucesso`, iconBg: 'bg-emerald-50', icon: <CheckCircle size={18} className="text-emerald-600" />, subColor: 'text-emerald-600' },
        { label: 'Em curso',        value: rows.filter(r => r.status === 'em_curso').length, sub: 'em andamento', iconBg: 'bg-blue-50', icon: <Loader size={18} className="text-blue-500" />, subColor: 'text-blue-600' },
        { label: 'Canceladas',      value: rows.filter(r => r.status === 'cancelado').length, sub: 'não executadas', iconBg: 'bg-red-50', icon: <X size={18} className="text-red-400" />, subColor: 'text-red-500' },
      ];
    }
    // prestadores
    const rows = filteredRows as typeof PRE_ROWS[number][];
    const avgRating = rows.length ? rows.reduce((s, r) => s + r.classificacao, 0) / rows.length : 0;
    return [
      { label: 'Total',             value: rows.length,  sub: 'prestadores',           iconBg: 'bg-[#06241C]/[0.08]', icon: <Users size={18} className="text-[#06241C]" />, subColor: 'text-gray-400' },
      { label: 'Aprovados',         value: rows.filter(r => r.verificacao === 'aprovado').length, sub: 'verificados', iconBg: 'bg-emerald-50', icon: <CheckCircle size={18} className="text-emerald-600" />, subColor: 'text-emerald-600' },
      { label: 'Classificação média',value: avgRating ? avgRating.toFixed(1) + ' ★' : '—', sub: 'média geral', iconBg: 'bg-amber-50', icon: <Star size={18} className="text-amber-500" />, subColor: 'text-amber-600' },
      { label: 'Pendentes',         value: rows.filter(r => r.verificacao === 'pendente').length, sub: 'aguardam validação', iconBg: 'bg-blue-50', icon: <Calendar size={18} className="text-blue-500" />, subColor: 'text-blue-600' },
    ];
  }, [filteredRows, reportType]);

  // ── Export ─────────────────────────────────────────────────
  const runExport = useCallback((format: 'excel' | 'pdf') => {
    if (exportPhase !== 'idle') return;
    exportRef.current.forEach(clearTimeout);
    setExportFormat(format);
    setExportPhase('generating');

    exportRef.current[0] = setTimeout(() => {
      setExportPhase('preparing');
      exportRef.current[1] = setTimeout(() => {
        try {
          const today = todayStr();
          const slug  = `relatorio_${reportType}_${today}`;

          if (format === 'excel') {
            let headers: string[];
            let rows: string[][];
            if (reportType === 'financeiro') {
              headers = ['ID', 'Data', 'Prestador', 'Serviço', 'Valor (AOA)', 'Método', 'Status'];
              rows    = (filteredRows as typeof FIN_ROWS[number][]).map(r => [r.id, r.data, r.prestador, r.servico, String(r.valor), r.metodo, r.status]);
            } else if (reportType === 'solicitacoes') {
              headers = ['ID', 'Data', 'Serviço', 'Prestador', 'Categoria', 'Província', 'Status'];
              rows    = (filteredRows as typeof SOL_ROWS[number][]).map(r => [r.id, r.data, r.servico, r.prestador, r.categoria, r.provincia, r.status]);
            } else {
              headers = ['ID', 'Nome', 'Email', 'Categoria', 'Verificação', 'Classificação', 'Serviços', 'Receita (AOA)'];
              rows    = (filteredRows as typeof PRE_ROWS[number][]).map(r => [r.id, r.nome, r.email, r.categoria, r.verificacao, String(r.classificacao), String(r.servicos), String(r.receita)]);
            }
            triggerDownload(generateCSV(headers, rows), `${slug}.csv`, 'text/csv;charset=utf-8');
          } else {
            // PDF — download as formatted HTML
            let thead = '';
            let tbody = '';
            if (reportType === 'financeiro') {
              thead = '<tr><th>ID</th><th>Data</th><th>Prestador</th><th>Serviço</th><th>Valor</th><th>Método</th><th>Status</th></tr>';
              tbody = (filteredRows as typeof FIN_ROWS[number][]).map(r =>
                `<tr><td>${r.id}</td><td>${r.data}</td><td>${r.prestador}</td><td>${r.servico}</td><td>${formatCurrency(r.valor)}</td><td>${r.metodo}</td><td>${r.status}</td></tr>`
              ).join('');
            } else if (reportType === 'solicitacoes') {
              thead = '<tr><th>ID</th><th>Data</th><th>Serviço</th><th>Prestador</th><th>Categoria</th><th>Província</th><th>Status</th></tr>';
              tbody = (filteredRows as typeof SOL_ROWS[number][]).map(r =>
                `<tr><td>${r.id}</td><td>${r.data}</td><td>${r.servico}</td><td>${r.prestador}</td><td>${r.categoria}</td><td>${r.provincia}</td><td>${r.status}</td></tr>`
              ).join('');
            } else {
              thead = '<tr><th>ID</th><th>Nome</th><th>Categoria</th><th>Verificação</th><th>Classif.</th><th>Serviços</th><th>Receita</th></tr>';
              tbody = (filteredRows as typeof PRE_ROWS[number][]).map(r =>
                `<tr><td>${r.id}</td><td>${r.nome}</td><td>${r.categoria}</td><td>${r.verificacao}</td><td>${r.classificacao}</td><td>${r.servicos}</td><td>${formatCurrency(r.receita)}</td></tr>`
              ).join('');
            }
            const REPORT_LABELS: Record<ReportType, string> = { financeiro: 'Financeiro', solicitacoes: 'Solicitações', prestadores: 'Prestadores' };
            const html = `<!DOCTYPE html><html lang="pt"><head><meta charset="UTF-8"><title>${slug}</title><style>body{font-family:Arial,sans-serif;font-size:11px;padding:24px;color:#1e293b}h1{font-size:16px;margin-bottom:4px}p{color:#64748b;margin-bottom:16px}table{width:100%;border-collapse:collapse}th{background:#06241C;color:white;text-align:left;padding:8px 10px;font-size:10px;text-transform:uppercase}td{padding:7px 10px;border-bottom:1px solid #f1f5f9}tr:nth-child(even){background:#f8fafc}</style></head><body><h1>Relatório ${REPORT_LABELS[reportType]}</h1><p>Gerado em ${new Date().toLocaleDateString('pt-PT')} · ${filteredRows.length} registos</p><table><thead>${thead}</thead><tbody>${tbody}</tbody></table></body></html>`;
            triggerDownload(html, `${slug}.html`, 'text/html;charset=utf-8');
          }
          setExportPhase('done');
          exportRef.current[2] = setTimeout(() => setExportPhase('idle'), 3500);
        } catch {
          setExportPhase('error');
          exportRef.current[2] = setTimeout(() => setExportPhase('idle'), 4000);
        }
      }, 900);
    }, 1200);
  }, [exportPhase, reportType, filteredRows]);

  const isBusy = exportPhase !== 'idle';
  const PERIOD_LABELS: Record<Period, string> = { hoje: 'Hoje', '7d': 'Últimos 7 dias', '30d': 'Últimos 30 dias', mes: 'Este mês', custom: `${range.from} → ${range.to}` };

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-5 max-w-[1200px] mx-auto">

      {/* Page title */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-base font-bold text-gray-900">Relatórios e Exportação</h2>
          <p className="text-xs text-gray-400 mt-0.5">Gere e exporte relatórios com base nos filtros aplicados.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-lg">
            {filteredRows.length} registos
          </span>
          <button
            onClick={() => setShowFilters(v => !v)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer lg:hidden ${showFilters ? 'bg-[#06241C] text-white border-[#06241C]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
          >
            <Filter size={13} /> Filtros
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((k, i) => (
          <KpiCard key={i} {...k} />
        ))}
      </div>

      {/* Main layout: config + table */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">

        {/* ── Config panel ──────────────────────────────────── */}
        <div className={`w-full lg:w-72 shrink-0 space-y-4 ${showFilters ? 'block' : 'hidden lg:block'}`}>

          {/* Report type */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-4">
            <SectionLabel>Tipo de relatório</SectionLabel>
            <ReportTypeSelector value={reportType} onChange={handleTypeChange} />
          </div>

          {/* Period */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-4">
            <SectionLabel>Período</SectionLabel>
            <PeriodSelector
              value={period}
              onChange={handlePeriodChange}
              custom={custom}
              onCustom={r => { setCustom(r); setPage(1); }}
            />
            <p className="text-[10px] text-gray-400 mt-2.5 font-medium">
              {PERIOD_LABELS[period]}
            </p>
          </div>

          {/* Dynamic filters */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-4">
            <SectionLabel>Filtros adicionais</SectionLabel>
            {reportType === 'financeiro' && (
              <FinanceiroFilters value={finFilters} onChange={f => { setFinFilters(f); setPage(1); }} />
            )}
            {reportType === 'solicitacoes' && (
              <SolicitacoesFilters value={solFilters} onChange={f => { setSolFilters(f); setPage(1); }} />
            )}
            {reportType === 'prestadores' && (
              <PrestadoresFilters value={preFilters} onChange={f => { setPreFilters(f); setPage(1); }} />
            )}
          </div>

          {/* Export buttons */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-4 space-y-3">
            <SectionLabel>Exportar</SectionLabel>

            <ExportProgress phase={exportPhase} format={exportFormat} />

            <button
              onClick={() => runExport('excel')}
              disabled={isBusy || filteredRows.length === 0}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#06241C] hover:bg-[#0B392E] rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] cursor-pointer shadow-sm"
            >
              {isBusy && exportFormat === 'excel'
                ? <Loader size={13} className="animate-spin" />
                : <FileSpreadsheet size={14} />
              }
              Exportar Excel
            </button>

            <button
              onClick={() => runExport('pdf')}
              disabled={isBusy || filteredRows.length === 0}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-[#06241C] bg-white border-2 border-[#06241C]/20 hover:border-[#06241C]/50 hover:bg-[#06241C]/[0.04] rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] cursor-pointer"
            >
              {isBusy && exportFormat === 'pdf'
                ? <Loader size={13} className="animate-spin" />
                : <FileText size={14} />
              }
              Exportar PDF
            </button>

            {filteredRows.length === 0 && (
              <p className="text-[10px] text-gray-400 text-center font-medium">
                Sem dados para exportar com os filtros atuais.
              </p>
            )}
          </div>
        </div>

        {/* ── Preview table ────────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-3">

          {/* Table header */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h3 className="text-sm font-bold text-gray-800">Pré-visualização</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">
                {filteredRows.length} {filteredRows.length === 1 ? 'registo encontrado' : 'registos encontrados'}
                {' · '}{PERIOD_LABELS[period]}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {exportPhase === 'done' && (
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg animate-in fade-in duration-200">
                  <Check size={12} /> Download iniciado
                </span>
              )}
              <span className="text-[10px] text-gray-400 font-medium hidden sm:block">
                {Math.ceil(filteredRows.length / PAGE_SIZE)} {Math.ceil(filteredRows.length / PAGE_SIZE) === 1 ? 'página' : 'páginas'}
              </span>
            </div>
          </div>

          <PreviewTable
            reportType={reportType}
            rows={filteredRows}
            page={page}
            onPage={setPage}
          />
        </div>
      </div>
    </div>
  );
}
