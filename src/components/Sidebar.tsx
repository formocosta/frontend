'use client';
import Image from 'next/image';
import icon from '@/assets/images/icon2.png';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  ChevronLeft,
} from 'lucide-react';

const MAIN_NAV = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, allowedRoles: ['admin', 'operador', 'operador_financeiro', 'suporte'] },
  { label: 'Candidaturas KYC', href: '/kyc', icon: FileCheck, allowedRoles: ['admin', 'operador'] },
  { label: 'Solicitações', href: '/solicitacoes', icon: ClipboardList, allowedRoles: ['admin', 'operador'] },
  { label: 'Mensagens', href: '/mensagens', icon: MessageSquare, allowedRoles: ['admin', 'operador'], badge: 10 },
  { label: 'Pagamentos', href: '/pagamentos', icon: CreditCard, allowedRoles: ['admin', 'operador_financeiro'] },
  { label: 'Repasses', href: '/repasses', icon: ArrowLeftRight, allowedRoles: ['admin', 'operador_financeiro'] },
  { label: 'Avaliações', href: '/avaliacoes', icon: Star, allowedRoles: ['admin', 'operador'] },
  { label: 'Disputas', href: '/disputas', icon: Scale, allowedRoles: ['admin', 'suporte'] },
  { label: 'Catálogo', href: '/catalogo', icon: BookOpen, allowedRoles: ['admin'] },
  { label: 'Utilizadores internos', href: '/utilizadores', icon: Users, allowedRoles: ['admin'] },
  { label: 'Relatórios', href: '/backoffice/relatorios', icon: BarChart3, allowedRoles: ['admin', 'operador_financeiro'] },
];

function NavItem({ href, icon: Icon, label, active, badge }: { href: string; icon: React.ElementType; label: string; active: boolean; badge?: number }) {
  return (
    <Link
      href={href}
      className={`relative flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-[13px] transition-all duration-200 group ${active
          ? 'bg-[#42b883]/10 text-[#42b883] font-bold'
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-semibold'
        }`}
    >
      {active && (
        <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#42b883] rounded-r-full" />
      )}
      <div className="flex items-center gap-3">
        <Icon size={18} strokeWidth={active ? 2.5 : 2} className={`shrink-0 transition-colors ${active ? 'text-[#42b883]' : 'text-gray-400 group-hover:text-gray-600'}`} />
        <span className="truncate">{label}</span>
      </div>
      {badge !== undefined && (
        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg transition-colors ${active ? 'bg-[#42b883]/20 text-[#42b883]' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'}`}>
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
  const pathname = usePathname();


  return (
    <aside className="w-[260px] shrink-0 h-screen bg-white border-r border-gray-100 flex flex-col z-20 shadow-[4px_0_24px_rgba(0,0,0,0.01)]">

      {/* Logo */}
      <div className="px-6 h-[72px] flex items-center justify-between shrink-0 border-b border-gray-50">
        <div className="flex items-center gap-2.5">
          <Image src={icon} alt="Formocosta Logo" className="w-42 h-32 object-contain " />
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
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5 scrollbar-thin scrollbar-thumb-gray-100 hover:scrollbar-thumb-gray-200">
        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest px-3 mb-3">Menu Principal</p>

      </div>

    </aside>
  );
}
