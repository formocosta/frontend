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
        className={`relative flex items-center rounded-xl text-sm font-medium transition-all duration-150 ${
          collapsed
            ? 'justify-center p-3.5'
            : 'justify-between gap-3 px-3.5 py-2.5'
        } ${
          active
            ? 'bg-[#0B392E] text-[#34D399]'
            : 'text-emerald-100/60 hover:bg-white/5 hover:text-white'
        }`}
      >
        {/* Icon + label */}
        <div className={`flex items-center ${collapsed ? '' : 'gap-3'}`}>
          <Icon size={17} strokeWidth={active ? 2.5 : 2} className="shrink-0" />
          {!collapsed && (
            <span className="truncate leading-none">{label}</span>
          )}
        </div>

        {/* Badge (expanded only) */}
        {!collapsed && badge !== undefined && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#0B2F25] text-emerald-300 border border-emerald-950/60">
            {badge}
          </span>
        )}

        {/* Active indicator */}
        {active && !collapsed && (
          <div className="absolute right-2 top-3 bottom-3 w-1 bg-[#34D399] rounded-full" />
        )}
        {active && collapsed && (
          <div className="absolute right-0.5 top-2 bottom-2 w-0.5 bg-[#34D399] rounded-full" />
        )}
      </Link>

      {/* Tooltip — only in collapsed mode */}
      {collapsed && (
        <div
          className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 pointer-events-none
                     opacity-0 group-hover:opacity-100 transition-opacity duration-150"
        >
          <div className="relative bg-gray-900 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-xl flex items-center gap-1.5">
            {/* Arrow */}
            <span className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-gray-900" />
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
    <aside className="w-full h-full bg-[#06241C] text-emerald-100 flex flex-col shadow-xl overflow-hidden">

      {/* ── Logo / collapse toggle ─────────────────────── */}
      <div
        className={`h-20 shrink-0 flex items-center border-b border-emerald-950/40 transition-all duration-300 ${
          collapsed ? 'justify-center px-3' : 'justify-between px-6'
        }`}
      >
        <button
          onClick={onToggleCollapse}
          className="flex items-center gap-3 cursor-pointer select-none hover:opacity-80 active:opacity-60 transition-opacity duration-150 min-w-0"
          title={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
          aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
        >
          <div className="w-10 h-10 relative bg-white/10 rounded-xl shrink-0 overflow-hidden">
            <Image
              src={logo}
              alt="Formocosta"
              fill
              className="object-contain rounded-lg"
            />
          </div>
          {!collapsed && (
            <span className="font-bold text-white text-lg tracking-tight truncate">
              Formocosta
            </span>
          )}
        </button>
      </div>

      {/* ── Search bar (hidden when collapsed) ────────── */}
      <div
        className={`shrink-0 overflow-hidden transition-all duration-300 ${
          collapsed ? 'max-h-0 opacity-0 py-0 px-4' : 'max-h-20 opacity-100 px-4 py-3'
        }`}
      >
        <div className="flex items-center gap-2 bg-[#0B2F25] border border-emerald-950/60 rounded-xl px-3.5 py-2 w-full hover:border-emerald-800/40 transition-colors">
          <Search size={15} className="text-emerald-500 shrink-0" />
          <input
            type="text"
            placeholder="Pesquisar..."
            tabIndex={collapsed ? -1 : 0}
            className="bg-transparent text-xs text-white placeholder:text-emerald-600 outline-none w-full"
          />
          <span className="text-[10px] text-emerald-600 bg-[#06241C] px-1.5 py-0.5 rounded border border-emerald-950/60 shrink-0 font-mono">
            ⌘F
          </span>
        </div>
      </div>

      {/* ── Main navigation ───────────────────────────── */}
      <div
        className={`flex-1 overflow-y-auto py-4 space-y-0.5 scrollbar-thin scrollbar-thumb-emerald-950/50 transition-all duration-300 ${
          collapsed ? 'px-2' : 'px-4'
        }`}
      >
        {!collapsed && (
          <p className="text-[10px] font-semibold text-emerald-500/50 uppercase tracking-widest px-3.5 mb-2 truncate">
            Main Menu
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

      {/* ── General navigation ────────────────────────── */}
      <div
        className={`py-4 border-t border-emerald-950/40 space-y-0.5 transition-all duration-300 ${
          collapsed ? 'px-2' : 'px-4'
        }`}
      >
        {!collapsed && (
          <p className="text-[10px] font-semibold text-emerald-500/50 uppercase tracking-widest px-3.5 mb-2 truncate">
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

      {/* ── Profile card ──────────────────────────────── */}
      <div
        className={`border-t border-emerald-950/40 shrink-0 transition-all duration-300 ${
          collapsed ? 'p-2' : 'p-4'
        }`}
      >
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-8 h-8 rounded-full bg-[#34D399] flex items-center justify-center text-[#06241C] text-xs font-bold shrink-0"
              title={user.name}
            >
              {initials}
            </div>
            <button
              onClick={handleLogout}
              className="w-8 h-8 rounded-lg hover:bg-red-500/10 text-emerald-400 hover:text-red-400 flex items-center justify-center transition-colors cursor-pointer"
              title="Sair"
            >
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <div className="bg-[#0B392E] rounded-xl p-3 flex items-center justify-between shadow-inner border border-emerald-950/60">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#34D399] flex items-center justify-center text-[#06241C] text-xs font-bold shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate leading-none">{user.name}</p>
                <span className="text-[9px] font-semibold text-emerald-400 mt-1 block uppercase tracking-wider leading-none">
                  {user.role === 'admin' ? 'Admin' : user.role}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-7 h-7 rounded-lg hover:bg-red-500/10 text-emerald-400 hover:text-red-400 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
              title="Sair"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>

    </aside>
  );
}
