'use client';
import Image from 'next/image';
import icon from '@/assets/images/icon3.png';
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
  ChevronLeft,
  Search,
} from 'lucide-react';

const MAIN_NAV = [
  { label: 'Dashboard',             href: '/dashboard',    icon: LayoutDashboard,  allowedRoles: ['admin','operador','operador_financeiro','suporte'] },
  { label: 'Candidaturas KYC',      href: '/kyc',          icon: FileCheck,        allowedRoles: ['admin','operador'] },
  { label: 'Solicitações',          href: '/solicitacoes', icon: ClipboardList,    allowedRoles: ['admin','operador'] },
  { label: 'Mensagens',             href: '/mensagens',    icon: MessageSquare,    allowedRoles: ['admin','operador'], badge: 10 },
  { label: 'Pagamentos',            href: '/pagamentos',   icon: CreditCard,       allowedRoles: ['admin','operador_financeiro'] },
  { label: 'Repasses',              href: '/repasses',     icon: ArrowLeftRight,   allowedRoles: ['admin','operador_financeiro'] },
  { label: 'Avaliações',            href: '/avaliacoes',   icon: Star,             allowedRoles: ['admin','operador'] },
  { label: 'Disputas',              href: '/disputas',     icon: Scale,            allowedRoles: ['admin','suporte'] },
  { label: 'Catálogo',              href: '/catalogo',     icon: BookOpen,         allowedRoles: ['admin'] },
  { label: 'Utilizadores internos', href: '/utilizadores', icon: Users,            allowedRoles: ['admin'] },
  { label: 'Relatórios',            href: '/backoffice/relatorios',   icon: BarChart3,        allowedRoles: ['admin','operador_financeiro'] },
];

const GENERAL_NAV = [
  { label: 'Definições', href: '/backoffice/definicoes', icon: Settings },
  { label: 'Suporte',    href: '/backoffice/suporte',    icon: HelpCircle },
];

function NavItem({ href, icon: Icon, label, active, badge }: { href: string; icon: React.ElementType; label: string; active: boolean; badge?: number }) {
  return (
    <Link
      href={href}
      className={`relative flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-md text-[13px] font-semibold transition-all duration-150 ${
        active
          ? 'bg-[#42b883]/10 text-[#42b883]'
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={18} strokeWidth={active ? 2.5 : 2} className="shrink-0" />
        <span className="truncate">{label}</span>
      </div>
      {badge !== undefined && (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${active ? 'bg-[#42b883]/20 text-[#42b883]' : 'bg-gray-100 text-gray-500'}`}>
          {badge}
        </span>
      )}
    </Link>
  );
}

type SidebarProps = {
  onToggleSidebar?: () => void;
};

export default function Sidebar({ onToggleSidebar }: SidebarProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

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
    <aside className="w-[260px] shrink-0 h-screen bg-white border-r border-gray-200 text-gray-800 flex flex-col z-20">

      {/* Logo */}
      <div className="px-6 h-[72px] flex items-center justify-between shrink-0 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-md bg-[#42b883] text-white">
            <Image src={icon} alt="Formocosta" className="w-5 h-5 object-contain" />
          </div>
          <span className="font-extrabold text-gray-900 text-lg tracking-tight">Formocosta</span>
        </div>
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="w-7 h-7 rounded-md bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="px-4 py-4 shrink-0">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-md px-3 py-2 w-full hover:border-gray-300 transition-colors focus-within:border-[#42b883] focus-within:ring-1 focus-within:ring-[#42b883]/20">
          <Search size={15} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-[13px] text-gray-800 placeholder:text-gray-400 outline-none w-full font-medium"
          />
          <span className="text-[10px] text-gray-400 bg-white px-1.5 py-0.5 rounded border border-gray-200 shrink-0 font-mono font-semibold">
            ⌘K
          </span>
        </div>
      </div>

      {/* Main nav */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1 scrollbar-thin scrollbar-thumb-gray-200">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3.5 mb-2 mt-2">Main Menu</p>
        {visibleMain.map(item => (
          <NavItem
            key={item.href}
            {...item}
            active={pathname === item.href || pathname.startsWith(item.href + '/')}
          />
        ))}
      </div>

      {/* General nav */}
      <div className="px-4 py-4 border-t border-gray-100 space-y-1">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3.5 mb-2">Conta</p>
        {GENERAL_NAV.map(item => (
          <NavItem
            key={item.href}
            {...item}
            active={pathname === item.href}
          />
        ))}
      </div>

      {/* Footer Profile Card */}
      <div className="p-4 border-t border-gray-100 shrink-0 bg-gray-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#42b883] flex items-center justify-center text-white text-[13px] font-bold shrink-0 shadow-sm">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-gray-900 truncate leading-tight">{user.name}</p>
              <span className="text-[11px] font-semibold text-gray-500 block capitalize">
                {user.role}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-8 h-8 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
            title="Sair"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

    </aside>
  );
}
