'use client';

import {
  useState, useCallback, useEffect, useRef, Suspense,
} from 'react';
import { createPortal } from 'react-dom';
import {
  Plus, Search, X, Check, Loader, AlertTriangle, ShieldOff,
  Users, UserCheck, UserMinus, MoreVertical, RefreshCw,
  ChevronDown, Ban, UserPlus, Lock,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

// ─────────────────────────────────────────────────────────────
// Portal
// ─────────────────────────────────────────────────────────────

function Portal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

type Papel = 'admin' | 'operador' | 'operador_financeiro' | 'suporte';
type StatusUser = 'ativo' | 'suspenso' | 'encerrado';

interface UtilizadorInterno {
  id: string;
  nome: string;
  email: string;
  papel: Papel;
  status: StatusUser;
  ultimoLogin: string | null;
  criadoEm: string;
  motivoSuspensao?: string;
  motivoEncerramento?: string;
}

// ─────────────────────────────────────────────────────────────
// Mock data
// ─────────────────────────────────────────────────────────────

const MOCK: UtilizadorInterno[] = [
  {
    id: 'USR-001', nome: 'Ana Ferreira', email: 'ana.ferreira@formocosta.ao',
    papel: 'admin', status: 'ativo', ultimoLogin: '2026-06-17T14:32:00Z',
    criadoEm: '2024-01-15T09:00:00Z',
  },
  {
    id: 'USR-002', nome: 'Bruno Matos', email: 'bruno.matos@formocosta.ao',
    papel: 'operador', status: 'ativo', ultimoLogin: '2026-06-17T10:15:00Z',
    criadoEm: '2024-02-20T09:00:00Z',
  },
  {
    id: 'USR-003', nome: 'Carla Santos', email: 'carla.santos@formocosta.ao',
    papel: 'operador_financeiro', status: 'ativo', ultimoLogin: '2026-06-16T16:45:00Z',
    criadoEm: '2024-03-10T09:00:00Z',
  },
  {
    id: 'USR-004', nome: 'David Nunes', email: 'david.nunes@formocosta.ao',
    papel: 'suporte', status: 'ativo', ultimoLogin: '2026-06-15T11:20:00Z',
    criadoEm: '2024-04-05T09:00:00Z',
  },
  {
    id: 'USR-005', nome: 'Eva Lima', email: 'eva.lima@formocosta.ao',
    papel: 'operador', status: 'suspenso', ultimoLogin: '2026-05-30T08:10:00Z',
    criadoEm: '2024-05-12T09:00:00Z',
    motivoSuspensao: 'Violação das políticas internas de acesso a dados.',
  },
  {
    id: 'USR-006', nome: 'Francisco Costa', email: 'francisco.costa@formocosta.ao',
    papel: 'suporte', status: 'ativo', ultimoLogin: '2026-06-17T09:00:00Z',
    criadoEm: '2024-06-01T09:00:00Z',
  },
  {
    id: 'USR-007', nome: 'Graça Pereira', email: 'graca.pereira@formocosta.ao',
    papel: 'operador_financeiro', status: 'ativo', ultimoLogin: '2026-06-14T13:30:00Z',
    criadoEm: '2024-07-18T09:00:00Z',
  },
  {
    id: 'USR-008', nome: 'Hugo Silva', email: 'hugo.silva@formocosta.ao',
    papel: 'operador', status: 'encerrado', ultimoLogin: '2026-03-10T17:00:00Z',
    criadoEm: '2024-08-22T09:00:00Z',
    motivoEncerramento: 'Colaborador desligado da empresa em março de 2026.',
  },
  {
    id: 'USR-009', nome: 'Isabel Rodrigues', email: 'isabel.rodrigues@formocosta.ao',
    papel: 'suporte', status: 'ativo', ultimoLogin: '2026-06-17T15:50:00Z',
    criadoEm: '2024-09-03T09:00:00Z',
  },
  {
    id: 'USR-010', nome: 'João Marques', email: 'joao.marques@formocosta.ao',
    papel: 'admin', status: 'ativo', ultimoLogin: '2026-06-16T12:00:00Z',
    criadoEm: '2024-10-14T09:00:00Z',
  },
  {
    id: 'USR-011', nome: 'Kátia Oliveira', email: 'katia.oliveira@formocosta.ao',
    papel: 'operador', status: 'suspenso', ultimoLogin: '2026-05-01T10:30:00Z',
    criadoEm: '2024-11-09T09:00:00Z',
    motivoSuspensao: 'Suspeita de acesso não autorizado a ficheiros financeiros.',
  },
  {
    id: 'USR-012', nome: 'Luís Cardoso', email: 'luis.cardoso@formocosta.ao',
    papel: 'operador_financeiro', status: 'ativo', ultimoLogin: '2026-06-13T09:45:00Z',
    criadoEm: '2024-12-01T09:00:00Z',
  },
];

// ─────────────────────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────────────────────

let _store: UtilizadorInterno[] | null = null;
function getStore(): UtilizadorInterno[] {
  if (!_store) _store = JSON.parse(JSON.stringify(MOCK));
  return _store!;
}
function saveStore(next: UtilizadorInterno[]) { _store = next; }
function uid() { return `USR-${Date.now()}`; }

// ─────────────────────────────────────────────────────────────
// Constants & helpers
// ─────────────────────────────────────────────────────────────

const PAPEL_LABEL: Record<Papel, string> = {
  admin: 'Admin',
  operador: 'Operador',
  operador_financeiro: 'Op. Financeiro',
  suporte: 'Suporte',
};

const PAPEL_COLORS: Record<Papel, string> = {
  admin:               'bg-[#06241C]/[0.08] text-[#06241C] border-[#06241C]/20',
  operador:            'bg-blue-50 text-blue-700 border-blue-100',
  operador_financeiro: 'bg-purple-50 text-purple-700 border-purple-100',
  suporte:             'bg-amber-50 text-amber-700 border-amber-100',
};

const STATUS_CFG: Record<StatusUser, { bg: string; dot: string; label: string }> = {
  ativo:     { bg: 'bg-emerald-50 text-emerald-700 border-emerald-100', dot: 'bg-emerald-500', label: 'Activo' },
  suspenso:  { bg: 'bg-amber-50 text-amber-700 border-amber-100',       dot: 'bg-amber-500',   label: 'Suspenso' },
  encerrado: { bg: 'bg-red-50 text-red-700 border-red-100',             dot: 'bg-red-500',     label: 'Encerrado' },
};

const AVATAR_BG = [
  'bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-rose-500',
  'bg-amber-500',   'bg-teal-500', 'bg-indigo-500', 'bg-orange-500',
];

function avatarBg(nome: string): string {
  let h = 0;
  for (const c of nome) h = (h * 31 + c.charCodeAt(0)) % AVATAR_BG.length;
  return AVATAR_BG[h];
}

function initials(nome: string): string {
  return nome.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function formatLogin(dt: string | null): string {
  if (!dt) return '—';
  const d = new Date(dt);
  const now = new Date();
  const mins = Math.floor((now.getTime() - d.getTime()) / 60000);
  if (mins < 60) return `${mins}m atrás`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h atrás`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'Ontem';
  if (days < 7) return `${days}d atrás`;
  return d.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ─────────────────────────────────────────────────────────────
// Small UI pieces
// ─────────────────────────────────────────────────────────────

function UserAvatar({ nome }: { nome: string }) {
  return (
    <div className={`w-8 h-8 rounded-full ${avatarBg(nome)} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
      {initials(nome)}
    </div>
  );
}

function PapelBadge({ papel }: { papel: Papel }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold border ${PAPEL_COLORS[papel]}`}>
      {PAPEL_LABEL[papel]}
    </span>
  );
}

function StatusBadge({ status }: { status: StatusUser }) {
  const s = STATUS_CFG[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${s.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`} />
      {s.label}
    </span>
  );
}

function KpiCard({
  icon, iconBg, label, value, sub, subColor = 'text-gray-400',
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: number;
  sub: string;
  subColor?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className={`text-[10px] mt-0.5 font-medium ${subColor}`}>{sub}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Access denied
// ─────────────────────────────────────────────────────────────

function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[420px] gap-5 text-center">
      <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center">
        <ShieldOff size={28} className="text-red-400" />
      </div>
      <div className="space-y-1.5">
        <h2 className="text-base font-bold text-gray-800">Acesso Restrito</h2>
        <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
          Apenas administradores podem aceder a esta área.
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Empty state
// ─────────────────────────────────────────────────────────────

function EmptyState({
  hasFilters, onClear, onNew,
}: { hasFilters: boolean; onClear: () => void; onNew: () => void }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs py-20 flex flex-col items-center gap-4 text-center">
      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
        <Users size={20} className="text-gray-300" />
      </div>
      <div>
        <p className="text-sm font-bold text-gray-600">
          {hasFilters ? 'Nenhum utilizador encontrado' : 'Sem utilizadores'}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {hasFilters ? 'Tente ajustar os filtros.' : 'Crie o primeiro utilizador interno.'}
        </p>
      </div>
      {hasFilters ? (
        <button onClick={onClear} className="text-xs text-emerald-600 font-semibold hover:text-emerald-700 cursor-pointer">
          Limpar filtros
        </button>
      ) : (
        <button
          onClick={onNew}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#06241C] hover:bg-[#0B392E] rounded-xl transition-colors cursor-pointer"
        >
          <Plus size={12} /> Criar utilizador
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Page skeleton
// ─────────────────────────────────────────────────────────────

function PageSkeleton() {
  return (
    <div className="flex flex-col gap-5 max-w-[1100px] mx-auto animate-pulse">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 space-y-2">
            <div className="h-2.5 bg-gray-100 rounded w-1/2" />
            <div className="h-7 bg-gray-200 rounded w-1/3" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 p-4 h-12" />
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-gray-50 last:border-b-0">
            <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 bg-gray-200 rounded w-1/4" />
              <div className="h-2.5 bg-gray-100 rounded w-1/3" />
            </div>
            <div className="hidden sm:block w-20 h-5 bg-gray-100 rounded-lg" />
            <div className="hidden sm:block w-16 h-5 bg-gray-100 rounded-full" />
            <div className="w-20 h-5 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Modal: Novo Utilizador
// ─────────────────────────────────────────────────────────────

function NovoUserModal({
  onClose, onSave,
}: {
  onClose: () => void;
  onSave: (nome: string, email: string, papel: Papel) => void;
}) {
  const [nome, setNome]   = useState('');
  const [email, setEmail] = useState('');
  const [papel, setPapel] = useState<Papel | ''>('');
  const [touched, setTouched] = useState(false);
  const [busy, setBusy]   = useState(false);

  const nomeErr  = !nome.trim()  ? 'Nome é obrigatório.' : '';
  const emailErr = !email.trim() ? 'Email é obrigatório.'
    : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'Email inválido.' : '';
  const papelErr = !papel ? 'Papel é obrigatório.' : '';
  const hasErr   = !!(nomeErr || emailErr || papelErr);

  const submit = () => {
    setTouched(true);
    if (hasErr || busy) return;
    setBusy(true);
    setTimeout(() => onSave(nome.trim(), email.trim(), papel as Papel), 350);
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={!busy ? onClose : undefined} />
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in duration-200">

          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#06241C]/10 rounded-lg flex items-center justify-center shrink-0">
                <UserPlus size={16} className="text-[#06241C]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Novo Utilizador</h3>
                <p className="text-xs text-gray-500 mt-0.5">Adicionar membro à equipa</p>
              </div>
            </div>
            <button onClick={onClose} disabled={busy} className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer disabled:opacity-40">
              <X size={14} />
            </button>
          </div>

          {/* Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Nome <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={nome}
                onChange={e => setNome(e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder="Nome completo"
                autoFocus
                className={`w-full px-3.5 py-2.5 text-xs bg-white border rounded-xl outline-none transition-all placeholder:text-gray-400 ${touched && nomeErr ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-emerald-400'}`}
              />
              {touched && nomeErr && <p className="text-[10px] text-red-500 mt-1 font-medium">{nomeErr}</p>}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder="utilizador@formocosta.ao"
                className={`w-full px-3.5 py-2.5 text-xs bg-white border rounded-xl outline-none transition-all placeholder:text-gray-400 ${touched && emailErr ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-emerald-400'}`}
              />
              {touched && emailErr && <p className="text-[10px] text-red-500 mt-1 font-medium">{emailErr}</p>}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Papel <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={papel}
                  onChange={e => setPapel(e.target.value as Papel | '')}
                  onBlur={() => setTouched(true)}
                  className={`w-full appearance-none px-3.5 py-2.5 text-xs bg-white border rounded-xl outline-none transition-all pr-8 [color-scheme:light] ${touched && papelErr ? 'border-red-300 focus:border-red-400 text-gray-400' : `border-gray-200 focus:border-emerald-400 ${!papel ? 'text-gray-400' : 'text-gray-900'}`}`}
                >
                  <option value="" disabled>Selecionar papel...</option>
                  <option value="admin">Admin</option>
                  <option value="operador">Operador</option>
                  <option value="operador_financeiro">Operador Financeiro</option>
                  <option value="suporte">Suporte</option>
                </select>
                <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              {touched && papelErr && <p className="text-[10px] text-red-500 mt-1 font-medium">{papelErr}</p>}
            </div>
          </div>

          {/* Info */}
          <div className="bg-[#06241C]/[0.05] border border-[#06241C]/10 rounded-xl px-4 py-3 text-xs text-[#06241C] font-medium leading-relaxed">
            O utilizador receberá um email com as instruções de acesso ao sistema.
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-1">
            <button onClick={onClose} disabled={busy} className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:border-gray-400 transition-colors cursor-pointer disabled:opacity-50">
              Cancelar
            </button>
            <button
              onClick={submit}
              disabled={busy}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#06241C] hover:bg-[#0B392E] rounded-xl disabled:opacity-50 transition-colors cursor-pointer"
            >
              {busy ? <Loader size={11} className="animate-spin" /> : <Check size={11} />}
              Criar Utilizador
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}

// ─────────────────────────────────────────────────────────────
// Modal: Suspender Utilizador
// ─────────────────────────────────────────────────────────────

function SuspenderModal({
  utilizador, onClose, onConfirm,
}: {
  utilizador: UtilizadorInterno;
  onClose: () => void;
  onConfirm: (motivo: string) => void;
}) {
  const [motivo, setMotivo] = useState('');
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const motivoErr = touched && !motivo.trim() ? 'Motivo é obrigatório.' : '';

  const submit = () => {
    setTouched(true);
    if (!motivo.trim() || busy) return;
    setBusy(true);
    setTimeout(() => onConfirm(motivo.trim()), 350);
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={!busy ? onClose : undefined} />
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in duration-200">

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
              <Ban size={18} className="text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-gray-900">Suspender Utilizador</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Suspender a conta de <span className="font-semibold text-gray-800">{utilizador.nome}</span>.
                O utilizador perderá acesso imediatamente.
              </p>
            </div>
            <button onClick={onClose} disabled={busy} className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 cursor-pointer disabled:opacity-40 shrink-0">
              <X size={14} />
            </button>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Motivo da suspensão <span className="text-red-500">*</span>
            </label>
            <textarea
              value={motivo}
              onChange={e => setMotivo(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder="Descreva o motivo da suspensão..."
              rows={3}
              autoFocus
              className={`w-full px-3.5 py-2.5 text-xs bg-white border rounded-xl outline-none transition-all resize-none placeholder:text-gray-400 ${motivoErr ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-amber-400'}`}
            />
            {motivoErr && <p className="text-[10px] text-red-500 mt-1 font-medium">{motivoErr}</p>}
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-xs text-amber-700 font-medium leading-relaxed">
            Esta ação é reversível. O utilizador pode ser reativado a qualquer momento.
          </div>

          <div className="flex items-center justify-end gap-3 pt-1">
            <button onClick={onClose} disabled={busy} className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:border-gray-400 transition-colors cursor-pointer disabled:opacity-50">
              Cancelar
            </button>
            <button
              onClick={submit}
              disabled={busy}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl disabled:opacity-50 transition-colors cursor-pointer"
            >
              {busy ? <Loader size={11} className="animate-spin" /> : <Ban size={11} />}
              Confirmar Suspensão
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}

// ─────────────────────────────────────────────────────────────
// Modal: Encerrar Conta
// ─────────────────────────────────────────────────────────────

function EncerrarModal({
  utilizador, onClose, onConfirm,
}: {
  utilizador: UtilizadorInterno;
  onClose: () => void;
  onConfirm: (motivo: string) => void;
}) {
  const [motivo, setMotivo] = useState('');
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const motivoErr = touched && !motivo.trim() ? 'Motivo é obrigatório.' : '';

  const submit = () => {
    setTouched(true);
    if (!motivo.trim() || busy) return;
    setBusy(true);
    setTimeout(() => onConfirm(motivo.trim()), 350);
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={!busy ? onClose : undefined} />
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in duration-200">

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
              <AlertTriangle size={18} className="text-red-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-gray-900">Encerrar Conta</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Encerrar a conta de <span className="font-semibold text-gray-800">{utilizador.nome}</span>.
                Esta ação é permanente e irreversível.
              </p>
            </div>
            <button onClick={onClose} disabled={busy} className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 cursor-pointer disabled:opacity-40 shrink-0">
              <X size={14} />
            </button>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Motivo do encerramento <span className="text-red-500">*</span>
            </label>
            <textarea
              value={motivo}
              onChange={e => setMotivo(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder="Descreva o motivo do encerramento..."
              rows={3}
              autoFocus
              className={`w-full px-3.5 py-2.5 text-xs bg-white border rounded-xl outline-none transition-all resize-none placeholder:text-gray-400 ${motivoErr ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-red-300'}`}
            />
            {motivoErr && <p className="text-[10px] text-red-500 mt-1 font-medium">{motivoErr}</p>}
          </div>

          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-xs text-red-700 font-medium leading-relaxed">
            Esta ação é <strong>permanente</strong>. A conta ficará encerrada e não poderá ser reativada.
          </div>

          <div className="flex items-center justify-end gap-3 pt-1">
            <button onClick={onClose} disabled={busy} className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:border-gray-400 transition-colors cursor-pointer disabled:opacity-50">
              Cancelar
            </button>
            <button
              onClick={submit}
              disabled={busy}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl disabled:opacity-50 transition-colors cursor-pointer"
            >
              {busy ? <Loader size={11} className="animate-spin" /> : <AlertTriangle size={11} />}
              Encerrar Conta
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}

// ─────────────────────────────────────────────────────────────
// Modal: Reativar Utilizador
// ─────────────────────────────────────────────────────────────

function ReativarModal({
  utilizador, onClose, onConfirm,
}: {
  utilizador: UtilizadorInterno;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const handle = () => { setBusy(true); setTimeout(onConfirm, 350); };

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={!busy ? onClose : undefined} />
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
              <RefreshCw size={18} className="text-emerald-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Reativar Utilizador</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Reativar a conta de <span className="font-semibold text-gray-800">{utilizador.nome}</span>?
                O utilizador recuperará o acesso ao sistema.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-1">
            <button onClick={onClose} disabled={busy} className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:border-gray-400 transition-colors cursor-pointer disabled:opacity-50">
              Cancelar
            </button>
            <button
              onClick={handle}
              disabled={busy}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#06241C] hover:bg-[#0B392E] rounded-xl disabled:opacity-50 transition-colors cursor-pointer"
            >
              {busy ? <Loader size={11} className="animate-spin" /> : <RefreshCw size={11} />}
              Reativar
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}

// ─────────────────────────────────────────────────────────────
// Modal union type
// ─────────────────────────────────────────────────────────────

type ModalState =
  | { type: 'novo' }
  | { type: 'suspender'; user: UtilizadorInterno }
  | { type: 'encerrar';  user: UtilizadorInterno }
  | { type: 'reativar';  user: UtilizadorInterno };

// ─────────────────────────────────────────────────────────────
// Main page content
// ─────────────────────────────────────────────────────────────

function UtilizadoresContent() {
  const { user: authUser } = useAuth();

  // All hooks must be declared before any conditional returns
  const [users, setUsers]     = useState<UtilizadorInterno[]>(() => [...getStore()]);
  const [search, setSearch]   = useState('');
  const [filterPapel, setFilterPapel]   = useState<Papel | ''>('');
  const [filterStatus, setFilterStatus] = useState<StatusUser | ''>('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [draftPapel, setDraftPapel] = useState<Papel | ''>('');
  const [draftStatus, setDraftStatus] = useState<StatusUser | ''>('');
  const [modal, setModal]   = useState<ModalState | null>(null);
  const [toast, setToast]   = useState<{ msg: string; variant: 'ok' | 'warn'; key: number } | null>(null);
  const [menuState, setMenuState] = useState<{ id: string; x: number; y: number } | null>(null);
  const toastRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string, variant: 'ok' | 'warn' = 'ok') => {
    const key = Date.now();
    setToast({ msg, variant, key });
    if (toastRef.current) clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(null), 3500);
  }, []);

  const update = useCallback((next: UtilizadorInterno[]) => {
    saveStore(next);
    setUsers([...next]);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    if (!menuState) return;
    const close = () => setMenuState(null);
    window.addEventListener('click', close, { once: true });
    return () => window.removeEventListener('click', close);
  }, [menuState]);

  useEffect(() => {
    if (!filtersOpen) {
      setDraftPapel(filterPapel);
      setDraftStatus(filterStatus);
    }
  }, [filterPapel, filterStatus, filtersOpen]);

  // ── Access control ─────────────────────────────────────────
  if (!authUser || authUser.role !== 'admin') {
    return <AccessDenied />;
  }

  // ── Derived state ──────────────────────────────────────────
  const q = search.toLowerCase();
  const filtered = users.filter(u =>
    (!q || u.nome.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) &&
    (!filterPapel  || u.papel === filterPapel) &&
    (!filterStatus || u.status === filterStatus)
  );

  const totalUsers = users.length;
  const ativos     = users.filter(u => u.status === 'ativo').length;
  const suspensos  = users.filter(u => u.status === 'suspenso').length;
  const encerrados = users.filter(u => u.status === 'encerrado').length;

  // ── Handlers ───────────────────────────────────────────────
  const handleCriar = (nome: string, email: string, papel: Papel) => {
    const novo: UtilizadorInterno = {
      id: uid(), nome, email, papel, status: 'ativo',
      ultimoLogin: null, criadoEm: new Date().toISOString(),
    };
    update([...users, novo]);
    setModal(null);
    showToast(`Utilizador "${nome}" criado com sucesso.`);
  };

  const handleSuspender = (motivo: string) => {
    if (!modal || modal.type !== 'suspender') return;
    const nome = modal.user.nome;
    update(users.map(u =>
      u.id === modal.user.id ? { ...u, status: 'suspenso' as StatusUser, motivoSuspensao: motivo } : u
    ));
    setModal(null);
    showToast(`"${nome}" suspenso.`, 'warn');
  };

  const handleEncerrar = (motivo: string) => {
    if (!modal || modal.type !== 'encerrar') return;
    const nome = modal.user.nome;
    update(users.map(u =>
      u.id === modal.user.id ? { ...u, status: 'encerrado' as StatusUser, motivoEncerramento: motivo } : u
    ));
    setModal(null);
    showToast(`Conta de "${nome}" encerrada.`, 'warn');
  };

  const handleReativar = () => {
    if (!modal || modal.type !== 'reativar') return;
    const nome = modal.user.nome;
    update(users.map(u =>
      u.id === modal.user.id
        ? { ...u, status: 'ativo' as StatusUser, motivoSuspensao: undefined, motivoEncerramento: undefined }
        : u
    ));
    setModal(null);
    showToast(`"${nome}" reativado.`);
  };

  const openMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMenuState({ id, x: rect.right, y: rect.bottom });
  };

  const menuUser = menuState ? users.find(u => u.id === menuState.id) ?? null : null;
  const hasFilters = !!(search || filterPapel || filterStatus);
  const activeFilterCount = [filterPapel, filterStatus].filter(Boolean).length;

  const clearFilters = () => {
    setSearch('');
    setFilterPapel('');
    setFilterStatus('');
    setDraftPapel('');
    setDraftStatus('');
    setFiltersOpen(false);
  };

  const applyFilters = () => {
    setFilterPapel(draftPapel);
    setFilterStatus(draftStatus);
    setFiltersOpen(false);
  };

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-5 max-w-[1100px] mx-auto">

      {/* Toast */}
      {toast && (
        <div
          key={toast.key}
          className={`shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl border animate-in fade-in duration-200 ${
            toast.variant === 'ok'
              ? 'bg-emerald-50 border-emerald-200'
              : 'bg-amber-50 border-amber-200'
          }`}
        >
          <Check size={14} className={toast.variant === 'ok' ? 'text-emerald-600' : 'text-amber-500'} />
          <p className={`text-xs font-semibold ${toast.variant === 'ok' ? 'text-emerald-700' : 'text-amber-700'}`}>
            {toast.msg}
          </p>
        </div>
      )}

      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <KpiCard
          icon={<Users size={18} className="text-[#06241C]" />}
          iconBg="bg-[#06241C]/[0.08]"
          label="Total"
          value={totalUsers}
          sub="utilizadores"
        />
        <KpiCard
          icon={<UserCheck size={18} className="text-emerald-600" />}
          iconBg="bg-emerald-50"
          label="Activos"
          value={ativos}
          sub="com acesso"
          subColor="text-emerald-600"
        />
        <KpiCard
          icon={<Ban size={18} className="text-amber-500" />}
          iconBg="bg-amber-50"
          label="Suspensos"
          value={suspensos}
          sub="sem acesso"
          subColor="text-amber-600"
        />
        <KpiCard
          icon={<UserMinus size={18} className="text-red-400" />}
          iconBg="bg-red-50"
          label="Encerrados"
          value={encerrados}
          sub="contas inativas"
          subColor="text-red-500"
        />
      </div>

      {/* Filters + New button */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-4 flex flex-col gap-3">
        <div className="flex flex-col lg:flex-row lg:items-start gap-3">
          <div className="relative flex-1 w-full min-w-0">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Pesquisar por nome ou email..."
              className="w-full pl-8 pr-8 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-400 focus:bg-white transition-colors placeholder:text-gray-400"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                <X size={11} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <button
                type="button"
                onClick={() => setFiltersOpen(v => !v)}
                className={`inline-flex items-center justify-between gap-2 px-4 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                  filtersOpen || activeFilterCount > 0
                    ? 'border-emerald-300 bg-emerald-50 text-[#06241C]'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>Filtros</span>
                <span className="inline-flex items-center gap-1">
                  {activeFilterCount > 0 && (
                    <span className="min-w-5 h-5 px-1 inline-flex items-center justify-center rounded-full bg-[#06241C] text-white text-[10px] font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                  <ChevronDown size={11} className={`transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
                </span>
              </button>

              {filtersOpen && (
                <div className="absolute right-0 top-full mt-2 z-20 w-[min(92vw,24rem)] rounded-2xl border border-gray-200 bg-white shadow-xl p-4">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-gray-900">Filtros</h3>
                      <p className="text-xs text-gray-500">Mantém a vista limpa e abre opções secundárias só quando necessário.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Papel</label>
                        <div className="relative">
                          <select
                            value={draftPapel}
                            onChange={e => setDraftPapel(e.target.value as Papel | '')}
                            className="w-full appearance-none text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 pr-7 outline-none focus:border-emerald-400 focus:bg-white transition-colors cursor-pointer [color-scheme:light] text-gray-700"
                          >
                            <option value="">Todos os papéis</option>
                            <option value="admin">Admin</option>
                            <option value="operador">Operador</option>
                            <option value="operador_financeiro">Op. Financeiro</option>
                            <option value="suporte">Suporte</option>
                          </select>
                          <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Status</label>
                        <div className="relative">
                          <select
                            value={draftStatus}
                            onChange={e => setDraftStatus(e.target.value as StatusUser | '')}
                            className="w-full appearance-none text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 pr-7 outline-none focus:border-emerald-400 focus:bg-white transition-colors cursor-pointer [color-scheme:light] text-gray-700"
                          >
                            <option value="">Todos os status</option>
                            <option value="ativo">Activo</option>
                            <option value="suspenso">Suspenso</option>
                            <option value="encerrado">Encerrado</option>
                          </select>
                          <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={clearFilters}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-600 border border-gray-200 rounded-xl hover:border-gray-300 hover:text-gray-900 transition-colors cursor-pointer"
                      >
                        <X size={11} />
                        Limpar
                      </button>
                      <button
                        onClick={applyFilters}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#06241C] rounded-xl hover:bg-[#0B392E] transition-colors cursor-pointer"
                      >
                        Aplicar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setModal({ type: 'novo' })}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#06241C] hover:bg-[#0B392E] rounded-xl transition-all shadow-sm active:scale-[0.98] cursor-pointer whitespace-nowrap shrink-0"
            >
              <Plus size={13} /> Novo Utilizador
            </button>
          </div>
        </div>

        <span className="text-[10px] text-gray-400 font-medium hidden lg:block whitespace-nowrap shrink-0">
          {filtered.length} de {totalUsers}
        </span>
      </div>

      {/* Table / Cards */}
      {filtered.length === 0 ? (
        <EmptyState hasFilters={hasFilters} onClear={clearFilters} onNew={() => setModal({ type: 'novo' })} />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    <th className="px-6 py-3.5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Utilizador</th>
                    <th className="px-4 py-3.5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3.5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Papel</th>
                    <th className="px-4 py-3.5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3.5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Último Login</th>
                    <th className="px-4 py-3.5 text-right text-[10px] font-bold text-gray-400 uppercase tracking-wider">Acções</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u, i) => (
                    <tr
                      key={u.id}
                      className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${i === filtered.length - 1 ? 'border-b-0' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <UserAvatar nome={u.nome} />
                          <span className={`text-xs font-semibold ${u.status === 'encerrado' ? 'text-gray-400' : 'text-gray-900'}`}>
                            {u.nome}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-[11px] text-gray-500">{u.email}</span>
                      </td>
                      <td className="px-4 py-4">
                        <PapelBadge papel={u.papel} />
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={u.status} />
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs text-gray-400">{formatLogin(u.ultimoLogin)}</span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        {u.status === 'encerrado' ? (
                          <div className="flex justify-end">
                            <span title="Sem acções disponíveis" className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-200 cursor-not-allowed">
                              <Lock size={13} />
                            </span>
                          </div>
                        ) : (
                          <button
                            onClick={e => openMenu(e, u.id)}
                            className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer ml-auto"
                          >
                            <MoreVertical size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile / tablet cards */}
          <div className="md:hidden space-y-3">
            {filtered.map(u => (
              <div
                key={u.id}
                className={`bg-white rounded-2xl border border-gray-200 shadow-xs p-4 ${u.status === 'encerrado' ? 'opacity-75' : ''}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <UserAvatar nome={u.nome} />
                    <div className="min-w-0">
                      <p className={`text-xs font-semibold truncate ${u.status === 'encerrado' ? 'text-gray-400' : 'text-gray-900'}`}>
                        {u.nome}
                      </p>
                      <p className="text-[10px] text-gray-400 truncate mt-0.5">{u.email}</p>
                    </div>
                  </div>
                  {u.status === 'encerrado' ? (
                    <span className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-200 shrink-0 cursor-not-allowed">
                      <Lock size={13} />
                    </span>
                  ) : (
                    <button
                      onClick={e => openMenu(e, u.id)}
                      className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 cursor-pointer shrink-0"
                    >
                      <MoreVertical size={14} />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <PapelBadge papel={u.papel} />
                  <StatusBadge status={u.status} />
                  {u.ultimoLogin && (
                    <span className="text-[10px] text-gray-400">· {formatLogin(u.ultimoLogin)}</span>
                  )}
                </div>

                {u.motivoSuspensao && (
                  <p className="text-[10px] text-amber-700 mt-2.5 bg-amber-50 border border-amber-100 px-3 py-2 rounded-lg leading-relaxed">
                    <span className="font-bold">Motivo da suspensão:</span> {u.motivoSuspensao}
                  </p>
                )}
                {u.motivoEncerramento && (
                  <p className="text-[10px] text-red-700 mt-2.5 bg-red-50 border border-red-100 px-3 py-2 rounded-lg leading-relaxed">
                    <span className="font-bold">Motivo do encerramento:</span> {u.motivoEncerramento}
                  </p>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Row actions dropdown — via Portal for correct z-index */}
      {menuState && menuUser && (
        <Portal>
          <div
            className="fixed z-[60] bg-white rounded-xl border border-gray-200 shadow-xl py-1 w-48 animate-in fade-in duration-150"
            style={{
              top: menuState.y + 6,
              right: typeof window !== 'undefined' ? window.innerWidth - menuState.x : 0,
            }}
            onClick={e => e.stopPropagation()}
          >
            {menuUser.status === 'suspenso' && (
              <button
                onClick={() => { setMenuState(null); setModal({ type: 'reativar', user: menuUser }); }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
              >
                <RefreshCw size={13} /> Reativar utilizador
              </button>
            )}
            {menuUser.status === 'ativo' && (
              <button
                onClick={() => { setMenuState(null); setModal({ type: 'suspender', user: menuUser }); }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
              >
                <Ban size={13} /> Suspender
              </button>
            )}
            <div className="my-1 border-t border-gray-100" />
            <button
              onClick={() => { setMenuState(null); setModal({ type: 'encerrar', user: menuUser }); }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <UserMinus size={13} /> Encerrar conta
            </button>
          </div>
        </Portal>
      )}

      {/* Modals */}
      {modal?.type === 'novo' && (
        <NovoUserModal onClose={() => setModal(null)} onSave={handleCriar} />
      )}
      {modal?.type === 'suspender' && (
        <SuspenderModal
          utilizador={modal.user}
          onClose={() => setModal(null)}
          onConfirm={handleSuspender}
        />
      )}
      {modal?.type === 'encerrar' && (
        <EncerrarModal
          utilizador={modal.user}
          onClose={() => setModal(null)}
          onConfirm={handleEncerrar}
        />
      )}
      {modal?.type === 'reativar' && (
        <ReativarModal
          utilizador={modal.user}
          onClose={() => setModal(null)}
          onConfirm={handleReativar}
        />
      )}

    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────

export default function UtilizadoresPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <UtilizadoresContent />
    </Suspense>
  );
}
