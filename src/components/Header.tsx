'use client';

import { useAuth } from '@/lib/auth-context';
import { usePathname } from 'next/navigation';
import { Bell, ChevronRight, HelpCircle, Home, Menu, Settings } from 'lucide-react';

const MOCK_UNREAD = 3;

interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

export default function Header({ onOpenMobileMenu }: HeaderProps) {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const getBreadcrumb = () => {
    if (pathname.startsWith('/kyc/')) return ['Candidaturas KYC', 'Detalhes'];
    if (pathname.startsWith('/solicitacoes/')) return ['Solicitações', 'Detalhes'];
    if (pathname.startsWith('/disputas/')) return ['Disputas', 'Detalhes'];

    switch (pathname) {
      case '/dashboard': return ['Dashboard'];
      case '/kyc': return ['Candidaturas KYC'];
      case '/solicitacoes': return ['Solicitações'];
      case '/mensagens': return ['Mensagens'];
      case '/pagamentos': return ['Pagamentos'];
      case '/repasses': return ['Repasses'];
      case '/avaliacoes': return ['Avaliações'];
      case '/disputas': return ['Disputas'];
      case '/catalogo': return ['Catálogo'];
      case '/utilizadores': return ['Utilizadores'];
      case '/backoffice/relatorios': return ['Relatórios'];
      case '/backoffice/definicoes': return ['Definições'];
      case '/backoffice/suporte': return ['Suporte'];
      default: return ['Dashboard'];
    }
  };

  const breadcrumb = getBreadcrumb();

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 select-none">

      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 transition-all cursor-pointer shrink-0"
          aria-label="Abrir menu"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2 min-w-0 text-[13px] font-semibold tracking-tight">
          <Home size={14} className="text-slate-400 shrink-0" />
          <ChevronRight size={13} className="text-slate-300 shrink-0" />
          <span className="text-slate-500 truncate">{breadcrumb[0]}</span>
          {breadcrumb[1] && (
            <>
              <ChevronRight size={13} className="text-slate-300 shrink-0" />
              <span className="text-slate-800 truncate">{breadcrumb[1]}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">

        <button className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all cursor-pointer">
          <HelpCircle size={16} />
        </button>

        <button className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all cursor-pointer">
          <Settings size={16} />
        </button>

        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all cursor-pointer">
          <Bell size={16} />
          {MOCK_UNREAD > 0 && (
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-emerald-500 rounded-full ring-2 ring-white" />
          )}
        </button>

      </div>
    </header>
  );
}
