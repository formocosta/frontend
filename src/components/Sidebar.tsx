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
} from 'lucide-react';

const MAIN_NAV = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, allowedRoles: ['admin', 'operador'] },
  { label: 'Candidaturas KYC', href: '/kyc', icon: FileCheck, allowedRoles: ['admin', 'operador'] },
  { label: 'Solicitações', href: '/solicitacoes', icon: ClipboardList, allowedRoles: ['admin', 'operador'] },
  { label: 'Catálogo', href: '/catalogo', icon: BookOpen, allowedRoles: ['admin'] },
  { label: 'Pagamentos', href: '/pagamentos', icon: CreditCard, allowedRoles: ['admin'] },
  { label: 'Repasses', href: '/repasses', icon: ArrowLeftRight, allowedRoles: ['admin'] },
];

function NavItem({ href, icon: Icon, label, active }: { href: string; icon: React.ElementType; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] transition-all duration-200 group ${active
        ? 'bg-[#42b883]/10 text-[#42b883] font-bold'
        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-semibold'
        }`}
    >
      {active && (
        <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#42b883] rounded-r-full" />
      )}
      <Icon size={18} strokeWidth={active ? 2.5 : 2} className={`shrink-0 transition-colors ${active ? 'text-[#42b883]' : 'text-gray-400 group-hover:text-gray-600'}`} />
      <span className="truncate">{label}</span>
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
    <aside className="w-[260px] shrink-0 h-screen bg-white border-r border-gray-100 flex flex-col z-20 shadow-[4px_0_24px_rgba(0,0,0,0.01)]">

      {/* Logo */}
      <div className="px-6 h-[72px] flex items-center justify-between shrink-0 border-b border-gray-50">
        <div className="flex items-center gap-2.5">
          <Image src={icon} alt="Formocosta Logo" className="w-42 h-32 object-contain" />
        </div>
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="w-7 h-7 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Main nav */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 scrollbar-thin scrollbar-thumb-gray-100 hover:scrollbar-thumb-gray-200">
        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest px-3 mb-3">Menu Principal</p>

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
      <div className="shrink-0 border-t border-gray-50 p-4">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-9 h-9 rounded-full bg-[#42b883]/10 flex items-center justify-center text-[#42b883] text-sm font-bold">
            {user?.nome_completo?.charAt(0) || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-gray-900 truncate">
              {user?.nome_completo || 'Admin'}
            </p>
            <p className="text-[11px] text-gray-500 font-medium truncate">
              {user?.email || 'admin@formocosta.com'}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <LogOut size={18} />
          <span>Sair da conta</span>
        </button>
      </div>
    </aside>
  );
}
