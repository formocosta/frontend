'use client';

import { useAuth } from '@/lib/auth-context';
import { usePathname } from 'next/navigation';
import { Bell, Info, Menu } from 'lucide-react';

const MOCK_UNREAD = 3;

interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

export default function Header({ onOpenMobileMenu }: HeaderProps) {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const getHeaderInfo = () => {
    const firstName = user.name.split(' ')[0];
    if (pathname.startsWith('/kyc/')) {
      return { title: 'Detalhes da Candidatura', subtitle: 'Auditoria e validação de documentos do prestador' };
    }
    switch (pathname) {
      case '/dashboard':      return { title: 'Dashboard',              subtitle: `Bem-vindo de volta, ${firstName}` };
      case '/kyc':            return { title: 'Candidaturas KYC',       subtitle: 'Gestão e acompanhamento de candidaturas de prestadores' };
      case '/solicitacoes':   return { title: 'Solicitações',           subtitle: 'Gestão de pedidos e requerimentos pendentes' };
      case '/mensagens':      return { title: 'Mensagens',              subtitle: 'Comunicação direta com prestadores e clientes' };
      case '/pagamentos':     return { title: 'Pagamentos',             subtitle: 'Controle de transações e movimentações financeiras' };
      case '/repasses':       return { title: 'Repasses',               subtitle: 'Controle de transferências e comissões' };
      case '/avaliacoes':     return { title: 'Avaliações',             subtitle: 'Histórico de notas e comentários de serviços' };
      case '/disputas':       return { title: 'Disputas',               subtitle: 'Moderação de disputas entre utilizadores' };
      case '/catalogo':       return { title: 'Catálogo de Serviços',   subtitle: 'Gestão de categorias, tags e serviços ativos' };
      case '/utilizadores':   return { title: 'Utilizadores',           subtitle: 'Gestão de utilizadores internos e permissões' };
      case '/backoffice/relatorios': return { title: 'Relatórios',      subtitle: 'Relatórios consolidados de desempenho e uso' };
      case '/backoffice/definicoes': return { title: 'Definições',      subtitle: 'Configurações de sistema e segurança' };
      case '/backoffice/suporte':    return { title: 'Suporte Técnico', subtitle: 'Central de ajuda e chamados de suporte' };
      default: return { title: 'Painel Geral', subtitle: 'Bem-vindo ao Formocosta' };
    }
  };

  const { title, subtitle } = getHeaderInfo();

  return (
    <header className="mx-6 mt-3 h-20 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between px-5 shrink-0 select-none">

      {/* Mobile hamburger */}
      <button
        onClick={onOpenMobileMenu}
        className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 transition-all cursor-pointer mr-2 shrink-0"
        aria-label="Abrir menu"
      >
        <Menu size={20} />
      </button>

      {/* Title & Subtitle */}
      <div className="flex flex-col min-w-0 flex-1">
        <h1 className="text-[16px] font-bold text-slate-900 leading-tight tracking-tight truncate">{title}</h1>
        <p className="text-[12px] text-slate-400 font-medium mt-0.5 truncate hidden sm:block">{subtitle}</p>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">

        {/* Info */}
        <button className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all cursor-pointer">
          <Info size={16} />
        </button>

        {/* Bell */}
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
