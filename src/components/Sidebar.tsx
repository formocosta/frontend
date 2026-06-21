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
        className={`relative flex items-center rounded-xl text-[13px] font-medium transition-all duration-150 ${
          collapsed
            ? 'justify-center p-3'
            : 'justify-between gap-3 px-3 py-2.5'
        } ${
          active
            ? 'bg-green-50 text-[#06241C]'
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
        }`}
      >
        <div className={`flex items-center ${collapsed ? '' : 'gap-3'}`}>
          <Icon size={16} strokeWidth={active ? 2.5 : 1.75} className="shrink-0" />
          {!collapsed && (
            <span className="truncate leading-none tracking-tight">{label}</span>
          )}
        </div>

        {/* Badge */}
        {!collapsed && badge !== undefined && (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-green-100 text-[#06241C] border border-green-200 leading-none">
            {badge}
          </span>
        )}

        {/* Active left indicator */}
        {active && (
          <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-[#06241C] rounded-full" />
        )}
      </Link>

      {/* Tooltip — collapsed only */}
      {collapsed && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3.5 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <div className="relative bg-slate-900 border border-slate-700 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-xl flex items-center gap-1.5">
            <span className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-slate-900" />
            {label}
            {badge !== undefined && (
              <span className="bg-[#06241C] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
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
    <aside className="w-full h-full bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden select-none m-3" style={{ height: 'calc(100% - 24px)', width: 'calc(100% - 24px)' }}>

      {/* ── Logo ──────────────────────────────────────────── */}
      <div
        className={`h-20 shrink-0 flex items-center border-b border-slate-100 transition-all duration-300 ${
          collapsed ? 'justify-center px-3' : 'px-4'
        }`}
      >
        <button
          onClick={onToggleCollapse}
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-70 transition-opacity duration-150 min-w-0"
          title={collapsed ? 'Expandir' : 'Colapsar'}
          aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
        >
          <div className="w-8 h-8 relative bg-[#06241C]/10 rounded-lg shrink-0 overflow-hidden">
            <Image src={logo} alt="Formocosta" fill className="object-contain" />
          </div>
          {!collapsed && (
            <span className="font-bold text-slate-900 text-[18px] tracking-tight truncate">
              Formocosta
            </span>
          )}
        </button>
      </div>

      {/* ── Main nav ─────────────────────────────────────── */}
      <div
        className={`flex-1 overflow-y-auto overflow-x-hidden py-3 space-y-0.5 transition-all duration-300 sidebar-scroll ${
          collapsed ? 'px-2' : 'px-3'
        }`}
      >
        {!collapsed && (
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2 truncate">
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
        className={`py-3 border-t border-slate-100 space-y-0.5 transition-all duration-300 ${
          collapsed ? 'px-2' : 'px-3'
        }`}
      >
        {!collapsed && (
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2 truncate">
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
        className={`border-t border-slate-100 shrink-0 transition-all duration-300 ${
          collapsed ? 'p-2' : 'p-3'
        }`}
      >
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-8 h-8 rounded-full bg-[#06241C] flex items-center justify-center text-white text-[10px] font-bold shrink-0"
              title={user.name}
            >
              {initials}
            </div>
            <button
              onClick={handleLogout}
              className="w-8 h-8 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors cursor-pointer"
              title="Sair"
            >
              <LogOut size={13} />
            </button>
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#06241C] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-slate-900 truncate leading-none">{user.name}</p>
                <span className="text-[10px] text-[#06241C] font-semibold mt-1 block uppercase tracking-wider leading-none">
                  {user.role === 'admin' ? 'Administrador' : user.role}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-7 h-7 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
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
