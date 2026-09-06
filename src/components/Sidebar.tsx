'use client';
import Image from 'next/image';
import icon from '@/assets/images/icon2.png';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/shared/store/auth.store';
import {
  LayoutDashboard,
  FileCheck,
  ClipboardList,
  CreditCard,
  ArrowLeftRight,
  BookOpen,
  ChevronLeft,
  LogOut,
  Users,
  UserCheck,
} from 'lucide-react';

const MAIN_NAV = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, allowedRoles: ['admin', 'operador'] },
  { label: 'Candidaturas KYC', href: '/kyc', icon: FileCheck, allowedRoles: ['admin', 'operador'] },
  { label: 'Prestadores', href: '/prestadores', icon: UserCheck, allowedRoles: ['admin', 'operador'] },
  { label: 'Solicitações', href: '/solicitacoes', icon: ClipboardList, allowedRoles: ['admin', 'operador'] },
  { label: 'Clientes', href: '/clientes', icon: Users, allowedRoles: ['admin', 'operador'] },
  { label: 'Catálogo', href: '/catalogo', icon: BookOpen, allowedRoles: ['admin'] },
  { label: 'Pagamentos', href: '/pagamentos', icon: CreditCard, allowedRoles: ['admin'] },
  { label: 'Repasses', href: '/repasses', icon: ArrowLeftRight, allowedRoles: ['admin'] },
];

function NavItem({ href, icon: Icon, label, active }: { href: string; icon: React.ElementType; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`relative flex items-center gap-3 px-4 py-3 rounded-md text-[13px] transition-all duration-300 group overflow-hidden ${active
        ? 'bg-gradient-to-r from-[#42b883]/10 to-transparent text-[#42b883] font-black'
        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-bold'
        }`}
    >
      {active && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#42b883] rounded-r-sm shadow-[0_0_8px_rgba(66,184,131,0.5)]" />
      )}
      <Icon
        size={18}
        strokeWidth={active ? 2.5 : 2}
        className={`shrink-0 transition-transform duration-300 ${active
          ? 'text-[#42b883]'
          : 'text-gray-400 group-hover:text-gray-600 group-hover:scale-110 group-hover:-rotate-3'
          }`}
      />
      <span className="truncate tracking-tight">{label}</span>
    </Link>
  );
}

type SidebarProps = {
  onToggleSidebar?: () => void;
};

export default function Sidebar({ onToggleSidebar }: SidebarProps) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const userRole = user?.role || 'admin';

  const filteredNav = MAIN_NAV.filter((item) =>
    item.allowedRoles.includes(userRole)
  );

  return (
    <aside className="w-[260px] shrink-0 h-screen bg-white border-r border-gray-100 flex flex-col z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">

      {/* Logo */}
      <div className="px-6 h-[72px] flex items-center justify-between shrink-0 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-2.5">
          <Image src={icon} alt="Formocosta Logo" className="w-40 h-auto object-contain" />
        </div>
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="w-7 h-7 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-[#42b883] hover:border-[#42b883]/30 transition-all shadow-sm"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Main nav */}
      <div className="flex-1 overflow-y-auto px-3 py-6 space-y-1.5 scrollbar-thin scrollbar-thumb-gray-100 hover:scrollbar-thumb-gray-200">
        <p className="text-[10px] font-black text-gray-400/80 uppercase tracking-[0.2em] px-4 mb-4">Menu Principal</p>

        {filteredNav.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            active={pathname === item.href || pathname.startsWith(item.href + '/')}
          />
        ))}
      </div>

      {/* User info & logout */}
      <div className="shrink-0 p-4 border-t border-gray-100 bg-gray-50/30">
        <div className="bg-white border border-gray-100 rounded-md p-3 shadow-[0_2px_12px_rgba(0,0,0,0.02)] mb-3 flex items-center gap-3 transition-colors hover:border-gray-200">
          <div className="w-9 h-9 rounded-md bg-gradient-to-br from-[#42b883] to-[#3aa374] flex items-center justify-center text-white text-sm font-black shadow-inner shrink-0">
            {user?.nome_completo?.charAt(0) || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-black text-gray-900 truncate tracking-tight">
              {user?.nome_completo || 'Admin'}
            </p>
            <p className="text-[11px] text-gray-500 font-semibold truncate">
              {user?.role === 'admin' ? 'Administrador' : 'Operador'}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-md text-[13px] font-bold text-gray-500 bg-white border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all group shadow-sm"
        >
          <LogOut size={16} className="transition-transform group-hover:-translate-x-1" />
          <span>Encerrar Sessão</span>
        </button>
      </div>
    </aside>
  );
}
