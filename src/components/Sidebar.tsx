'use client';

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

const MAIN_NAV = [
  { label: 'Dashboard',             href: '/backoffice/dashboard',    icon: LayoutDashboard,  allowedRoles: ['admin','operador','operador_financeiro','suporte'] },
  { label: 'Candidaturas KYC',      href: '/backoffice/kyc',          icon: FileCheck,        allowedRoles: ['admin','operador'] },
  { label: 'Solicitações',          href: '/backoffice/solicitacoes', icon: ClipboardList,    allowedRoles: ['admin','operador'] },
  { label: 'Mensagens',             href: '/backoffice/mensagens',    icon: MessageSquare,    allowedRoles: ['admin','operador'] },
  { label: 'Pagamentos',            href: '/backoffice/pagamentos',   icon: CreditCard,       allowedRoles: ['admin','operador_financeiro'] },
  { label: 'Repasses',              href: '/backoffice/repasses',     icon: ArrowLeftRight,   allowedRoles: ['admin','operador_financeiro'] },
  { label: 'Avaliações',            href: '/backoffice/avaliacoes',   icon: Star,             allowedRoles: ['admin','operador'] },
  { label: 'Disputas',              href: '/backoffice/disputas',     icon: Scale,            allowedRoles: ['admin','suporte'] },
  { label: 'Catálogo',              href: '/backoffice/catalogo',     icon: BookOpen,         allowedRoles: ['admin'] },
  { label: 'Utilizadores internos', href: '/backoffice/utilizadores', icon: Users,            allowedRoles: ['admin'] },
  { label: 'Relatórios',            href: '/backoffice/relatorios',   icon: BarChart3,        allowedRoles: ['admin','operador_financeiro'] },
];

const GENERAL_NAV = [
  { label: 'Definições', href: '/backoffice/definicoes', icon: Settings },
  { label: 'Suporte',    href: '/backoffice/suporte',    icon: HelpCircle },
];

function NavItem({ href, icon: Icon, label, active }: { href: string; icon: React.ElementType; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
        active
          ? 'bg-[#0E8A4B] text-white'
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <Icon size={17} strokeWidth={active ? 2.5 : 2} className="shrink-0" />
      {label}
    </Link>
  );
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  if (!user) return null;

  const visibleMain = MAIN_NAV.filter(item => item.allowedRoles.includes(user.role));

  function handleLogout() {
    logout();
    router.push('/login');
  }

  return (
    <aside className="w-[260px] shrink-0 h-screen bg-white border-r border-gray-100 flex flex-col">

      {/* Logo */}
      <div className="px-6 h-16 flex items-center border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#0E8A4B] rounded-lg flex items-center justify-center">
            <LayoutDashboard size={16} className="text-white" />
          </div>
          <span className="font-bold text-gray-900 text-lg">Formocosta</span>
        </div>
      </div>

      {/* Main nav */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-0.5">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-3">Menu</p>
        {visibleMain.map(item => (
          <NavItem
            key={item.href}
            {...item}
            active={pathname === item.href || pathname.startsWith(item.href + '/')}
          />
        ))}
      </div>

      {/* General nav */}
      <div className="px-4 pb-6 pt-4 border-t border-gray-100 space-y-0.5">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-3">Geral</p>
        {GENERAL_NAV.map(item => (
          <NavItem
            key={item.href}
            {...item}
            active={pathname === item.href}
          />
        ))}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-150"
        >
          <LogOut size={17} strokeWidth={2} className="shrink-0" />
          Sair
        </button>
      </div>
    </aside>
  );
}
