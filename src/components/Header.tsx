'use client';

import { useAuth } from '@/lib/auth-context';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, Info, Download, Menu } from 'lucide-react';

const MOCK_UNREAD = 3;

interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

export default function Header({ onOpenMobileMenu }: HeaderProps) {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  // Map pathnames to dynamic page headers
  const getHeaderInfo = () => {
    const firstName = user.name.split(' ')[0];
    if (pathname.startsWith('/kyc/')) {
      return {
        title: 'Detalhes da Candidatura',
        subtitle: 'Auditoria e validação de documentos do prestador',
      };
    }
    switch (pathname) {
      case '/dashboard':
        return {
          title: 'Dashboard',
          subtitle: `Welcome back ${firstName}`,
        };
      case '/kyc':
        return {
          title: 'Candidaturas KYC',
          subtitle: 'Gestão e acompanhamento de candidaturas de prestadores pendentes',
        };
      case '/solicitacoes':
        return {
          title: 'Solicitações',
          subtitle: 'Gestão de pedidos e requerimentos pendentes',
        };
      case '/mensagens':
        return {
          title: 'Mensagens',
          subtitle: 'Comunicação direta com prestadores e clientes',
        };
      case '/pagamentos':
        return {
          title: 'Pagamentos',
          subtitle: 'Controle de transações e movimentações financeiras',
        };
      case '/repasses':
        return {
          title: 'Repasses',
          subtitle: 'Controle de transferências e comissões',
        };
      case '/avaliacoes':
        return {
          title: 'Avaliações',
          subtitle: 'Histórico de notas e comentários de serviços',
        };
      case '/disputas':
        return {
          title: 'Disputas',
          subtitle: 'Moderação de disputas entre utilizadores',
        };
      case '/catalogo':
        return {
          title: 'Catálogo de Serviços',
          subtitle: 'Gestão de categorias, tags e serviços ativos',
        };
      case '/utilizadores':
        return {
          title: 'Utilizadores',
          subtitle: 'Gestão de utilizadores internos e permissões',
        };
      case '/backoffice/relatorios':
        return {
          title: 'Relatórios',
          subtitle: 'Relatórios consolidados de desempenho e uso',
        };
      case '/backoffice/definicoes':
        return {
          title: 'Definições',
          subtitle: 'Configurações de sistema e segurança',
        };
      case '/backoffice/suporte':
        return {
          title: 'Suporte Técnico',
          subtitle: 'Central de ajuda e chamados de suporte',
        };
      default:
        return {
          title: 'Painel Geral',
          subtitle: 'Bem-vindo ao Formocosta',
        };
    }
  };

  const { title, subtitle } = getHeaderInfo();

  return (
    <header className="h-14 bg-white border-b border-slate-200/70 flex items-center justify-between px-4 md:px-6 shrink-0 select-none shadow-sm">

      {/* Mobile hamburger */}
      <button
        onClick={onOpenMobileMenu}
        className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all cursor-pointer mr-2 shrink-0"
        aria-label="Abrir menu"
      >
        <Menu size={20} />
      </button>

      {/* Title & Subtitle */}
      <div className="flex flex-col min-w-0 flex-1">
        <h1 className="text-sm md:text-[15px] font-bold text-slate-900 leading-tight tracking-tight truncate">{title}</h1>
        <p className="text-[11px] text-slate-400 font-medium mt-0.5 truncate hidden sm:block">{subtitle}</p>
      </div>

      {/* Right side utilities */}
      <div className="flex items-center gap-2 md:gap-4">

        {/* Overlapping User Avatars — hidden on mobile */}
        <div className="hidden md:flex items-center -space-x-2 mr-2">
          <div className="w-7 h-7 rounded-full border-2 border-white bg-gray-200 overflow-hidden relative shadow-sm">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80" alt="Team member" className="w-full h-full object-cover" />
          </div>
          <div className="w-7 h-7 rounded-full border-2 border-white bg-gray-300 overflow-hidden relative shadow-sm">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80" alt="Team member" className="w-full h-full object-cover" />
          </div>
          <div className="w-7 h-7 rounded-full border-2 border-white bg-gray-400 overflow-hidden relative shadow-sm">
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80" alt="Team member" className="w-full h-full object-cover" />
          </div>
          <button className="w-7 h-7 rounded-full border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 hover:border-gray-300 transition-colors text-xs font-semibold cursor-pointer shadow-sm">
            +
          </button>
        </div>

        <div className="hidden md:block w-px h-5 bg-slate-200" />

        {/* Info Icon */}
        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all cursor-pointer">
          <Info size={15} />
        </button>

        {/* Notification bell */}
        <button className="relative w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all cursor-pointer">
          <Bell size={15} />
          {MOCK_UNREAD > 0 && (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full ring-2 ring-white" />
          )}
        </button>

        {/* Export Button */}
        <button className="flex items-center gap-1.5 bg-[#06241C] hover:bg-[#0B392E] text-white text-[11px] font-semibold px-3.5 py-2 rounded-lg transition-all duration-150 shadow-sm active:scale-[0.98] cursor-pointer">
          <span>Exportar</span>
          <Download size={12} />
        </button>

      </div>
    </header>
  );
}
