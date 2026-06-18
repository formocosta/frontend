'use client';

import Image from 'next/image';
import logo from '@/assets/images/logo.png.jpg';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  LayoutDashboard,
  FileCheck,
  ClipboardList,
  MessageSquare,
  CreditCard,
  ArrowLeftRight,
  Star,
  Scale,
  BookOpen,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  Search,
} from 'lucide-react';

// ── Nav data ────────────────────────────────────────────────

const MAIN_NAV = [
  { label: 'Dashboard',             href: '/dashboard',              icon: LayoutDashboard,  allowedRoles: ['admin','operador','operador_financeiro','suporte'] },
  { label: 'Candidaturas KYC',      href: '/kyc',                    icon: FileCheck,        allowedRoles: ['admin','operador'] },
  { label: 'Solicitações',          href: '/solicitacoes',           icon: ClipboardList,    allowedRoles: ['admin','operador'] },
  { label: 'Mensagens',             href: '/mensagens',              icon: MessageSquare,    allowedRoles: ['admin','operador'], badge: 10 },
  { label: 'Pagamentos',            href: '/pagamentos',             icon: CreditCard,       allowedRoles: ['admin','operador_financeiro'] },
  { label: 'Repasses',              href: '/repasses',               icon: ArrowLeftRight,   allowedRoles: ['admin','operador_financeiro'] },
  { label: 'Avaliações',            href: '/avaliacoes',             icon: Star,             allowedRoles: ['admin','operador'] },
  { label: 'Disputas',              href: '/disputas',               icon: Scale,            allowedRoles: ['admin','suporte'] },
  { label: 'Catálogo',              href: '/catalogo',               icon: BookOpen,         allowedRoles: ['admin'] },
  { label: 'Utilizadores internos', href: '/utilizadores',           icon: Users,            allowedRoles: ['admin'] },
  { label: 'Relatórios',            href: '/backoffice/relatorios',  icon: BarChart3,        allowedRoles: ['admin','operador_financeiro'] },
];

const GENERAL_NAV = [
  { label: 'Definições', href: '/backoffice/definicoes', icon: Settings },
  { label: 'Suporte',    href: '/backoffice/suporte',    icon: HelpCircle },
];

// ── NavItem ─────────────────────────────────────────────────

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
  badge?: number;
  collapsed: boolean;
}

function NavItem({ href, icon: Icon, label, active, badge, collapsed }: NavItemProps) {
  return (
    <div className="relative group">
      <Link
        href={href}
        className={`relative flex items-center rounded-lg text-[13px] font-medium transition-all duration-150 ${
          collapsed
            ? 'justify-center p-3'
            : 'justify-between gap-3 px-3 py-2.5'
        } ${
          active
            ? 'bg-emerald-500/[0.12] text-emerald-400'
            : 'text-emerald-100/50 hover:bg-white/[0.05] hover:text-emerald-100/80'
        }`}
      >
        <div className={`flex items-center ${collapsed ? '' : 'gap-3'}`}>
          <Icon
            size={16}
            strokeWidth={active ? 2.5 : 1.75}
            className="shrink-0"
          />
          {!collapsed && (
            <span className="truncate leading-none tracking-tight">{label}</span>
          )}
        </div>

        {/* Badge */}
        {!collapsed && badge !== undefined && (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-900/60 leading-none">
            {badge}
          </span>
        )}

        {/* Active left indicator */}
        {active && (
          <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-emerald-400 rounded-full" />
        )}
      </Link>

      {/* Tooltip — collapsed only */}
      {collapsed && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3.5 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <div className="relative bg-[#0B2A20] border border-emerald-900/60 text-emerald-100 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-xl flex items-center gap-1.5">
            <span className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-[#0B2A20]" />
            {label}
            {badge !== undefined && (
              <span className="bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                {badge}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sidebar ─────────────────────────────────────────────────

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({ collapsed = false, onToggleCollapse }: SidebarProps) {
  const { user, logout } = useAuth();
  const pathname         = usePathname();
  const router           = useRouter();

  if (!user) return null;

  const initials = user.name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const visibleMain = MAIN_NAV.filter(item => item.allowedRoles.includes(user.role));

  function handleLogout() {
    logout();
    router.push('/login');
  }

  return (
    <aside className="w-full h-full bg-[#06241C] text-emerald-100 flex flex-col overflow-hidden select-none">

      {/* ── Logo ──────────────────────────────────────────── */}
      <div
        className={`h-14 shrink-0 flex items-center border-b border-white/[0.06] transition-all duration-300 ${
          collapsed ? 'justify-center px-3' : 'px-4'
        }`}
      >
        <button
          onClick={onToggleCollapse}
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 active:opacity-60 transition-opacity duration-150 min-w-0"
          title={collapsed ? 'Expandir' : 'Colapsar'}
          aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
        >
          <div className="w-8 h-8 relative bg-white/10 rounded-lg shrink-0 overflow-hidden">
            <Image src={logo} alt="Formocosta" fill className="object-contain" />
          </div>
          {!collapsed && (
            <span className="font-bold text-white text-[15px] tracking-tight truncate">
              Formocosta
            </span>
          )}
        </button>
      </div>

      {/* ── Search ───────────────────────────────────────── */}
      <div
        className={`shrink-0 overflow-hidden transition-all duration-300 ${
          collapsed ? 'max-h-0 opacity-0 py-0 px-3' : 'max-h-16 opacity-100 px-3 py-2.5'
        }`}
      >
        <div className="flex items-center gap-2 bg-white/[0.05] border border-white/[0.06] rounded-lg px-3 py-2 hover:border-emerald-800/60 transition-colors">
          <Search size={13} className="text-emerald-600 shrink-0" />
          <input
            type="text"
            placeholder="Pesquisar..."
            tabIndex={collapsed ? -1 : 0}
            className="bg-transparent text-xs text-emerald-100 placeholder:text-emerald-700 outline-none w-full"
          />
          <span className="text-[10px] text-emerald-700 bg-white/[0.04] px-1 py-0.5 rounded border border-white/[0.06] shrink-0 font-mono leading-none">
            ⌘F
          </span>
        </div>
      </div>

      {/* ── Main nav ─────────────────────────────────────── */}
      <div
        className={`flex-1 overflow-y-auto py-3 space-y-0.5 transition-all duration-300 ${
          collapsed ? 'px-2' : 'px-3'
        }`}
      >
        {!collapsed && (
          <p className="text-[10px] font-semibold text-emerald-700/70 uppercase tracking-widest px-3 mb-2 truncate">
            Menu Principal
          </p>
        )}
        {collapsed && <div className="h-1" />}
        {visibleMain.map(item => (
          <NavItem
            key={item.href}
            {...item}
            active={pathname === item.href || pathname.startsWith(item.href + '/')}
            collapsed={collapsed}
          />
        ))}
      </div>

      {/* ── General nav ──────────────────────────────────── */}
      <div
        className={`py-3 border-t border-white/[0.06] space-y-0.5 transition-all duration-300 ${
          collapsed ? 'px-2' : 'px-3'
        }`}
      >
        {!collapsed && (
          <p className="text-[10px] font-semibold text-emerald-700/70 uppercase tracking-widest px-3 mb-2 truncate">
            Conta
          </p>
        )}
        {GENERAL_NAV.map(item => (
          <NavItem
            key={item.href}
            {...item}
            active={pathname === item.href}
            collapsed={collapsed}
          />
        ))}
      </div>

      {/* ── Profile ──────────────────────────────────────── */}
      <div
        className={`border-t border-white/[0.06] shrink-0 transition-all duration-300 ${
          collapsed ? 'p-2' : 'p-3'
        }`}
      >
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0"
              title={user.name}
            >
              {initials}
            </div>
            <button
              onClick={handleLogout}
              className="w-8 h-8 rounded-lg hover:bg-red-500/10 text-emerald-600 hover:text-red-400 flex items-center justify-center transition-colors cursor-pointer"
              title="Sair"
            >
              <LogOut size={13} />
            </button>
          </div>
        ) : (
          <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-white truncate leading-none">{user.name}</p>
                <span className="text-[10px] text-emerald-600 mt-1 block uppercase tracking-wider leading-none">
                  {user.role === 'admin' ? 'Administrador' : user.role}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-7 h-7 rounded-lg hover:bg-red-500/10 text-emerald-700 hover:text-red-400 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
              title="Sair"
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>

    </aside>
  );
}
