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
      className={`relative flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
        active
          ? 'bg-[#0B392E] text-[#34D399]'
          : 'text-emerald-100/60 hover:bg-white/5 hover:text-white'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={17} strokeWidth={active ? 2.5 : 2} className="shrink-0" />
        <span className="truncate">{label}</span>
      </div>
      {badge !== undefined && (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#0B2F25] text-emerald-300 border border-emerald-950/60">
          {badge}
        </span>
      )}
      {active && (
        <div className="absolute right-2 top-3 bottom-3 w-1 bg-[#34D399] rounded-full" />
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
    <aside className="w-[260px] shrink-0 h-screen bg-[#06241C] text-emerald-100 flex flex-col z-20 shadow-xl">

      {/* Logo */}
      <div className="px-6 h-16 flex items-center justify-between shrink-0 border-b border-emerald-950/40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 relative bg-white/10 rounded-lg p-1.5 flex items-center justify-center">
            <Image
              src={logo}
              alt="Formocosta"
              fill
              className="object-contain rounded-md"
            />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">Formocosta</span>
        </div>
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="w-7 h-7 rounded-lg bg-white/5 border border-emerald-500/10 flex items-center justify-center text-emerald-400 hover:bg-white/10 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3 shrink-0">
        <div className="flex items-center gap-2 bg-[#0B2F25] border border-emerald-950/60 rounded-xl px-3.5 py-2 w-full hover:border-emerald-800/40 transition-colors">
          <Search size={15} className="text-emerald-500 shrink-0" />
          <input
            type="text"
            placeholder="Pesquisar..."
            className="bg-transparent text-xs text-white placeholder:text-emerald-600 outline-none w-full"
          />
          <span className="text-[10px] text-emerald-600 bg-[#06241C] px-1.5 py-0.5 rounded border border-emerald-950/60 shrink-0 font-mono">
            ⌘F
          </span>
        </div>
      </div>

      {/* Main nav */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-0.5 scrollbar-thin scrollbar-thumb-emerald-950/50">
        <p className="text-[10px] font-semibold text-emerald-500/50 uppercase tracking-widest px-3.5 mb-2">Main Menu</p>
        {visibleMain.map(item => (
          <NavItem
            key={item.href}
            {...item}
            active={pathname === item.href || pathname.startsWith(item.href + '/')}
          />
        ))}
      </div>

      {/* General nav */}
      <div className="px-4 py-4 border-t border-emerald-950/40 space-y-0.5">
        <p className="text-[10px] font-semibold text-emerald-500/50 uppercase tracking-widest px-3.5 mb-2">Conta</p>
        {GENERAL_NAV.map(item => (
          <NavItem
            key={item.href}
            {...item}
            active={pathname === item.href}
          />
        ))}
      </div>

      {/* Footer Profile Card */}
      <div className="p-4 border-t border-emerald-950/40 shrink-0">
        <div className="bg-[#0B392E] rounded-xl p-3 flex items-center justify-between shadow-inner border border-emerald-950/60">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#34D399] flex items-center justify-center text-[#06241C] text-xs font-bold shrink-0 overflow-hidden">
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
      </div>

    </aside>
  );
}
