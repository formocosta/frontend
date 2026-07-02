'use client';

import { useAuth } from '@/lib/auth-context';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, Info, Download } from 'lucide-react';

const MOCK_UNREAD = 3;

export default function Header() {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  // Map pathnames to dynamic page headers
  const getHeaderInfo = () => {
    const firstName = user.name.split(' ')[0];
    switch (pathname) {
      case '/dashboard':
        return {
          title: 'Dashboard',
          subtitle: `Welcome back ${firstName}`,
        };
      case '/kyc':
        return {
          title: 'Candidaturas KYC',
          subtitle: 'Análise e aprovação de documentação de utilizadores',
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
    <header className="h-[72px] bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0 select-none">
      
      {/* Title & Subtitle */}
      <div className="flex flex-col">
        <h1 className="text-xl font-extrabold text-gray-900 leading-tight tracking-tight">{title}</h1>
        <p className="text-[13px] text-gray-500 font-medium mt-0.5">{subtitle}</p>
      </div>

      {/* Right side utilities */}
      <div className="flex items-center gap-4">
        
        {/* Overlapping User Avatars */}
        <div className="flex items-center -space-x-2 mr-2">
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

        <div className="w-px h-6 bg-gray-100" />

        {/* Info Icon */}
        <button className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all cursor-pointer">
          <Info size={17} />
        </button>

        {/* Notification bell */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all cursor-pointer">
          <Bell size={17} />
          {MOCK_UNREAD > 0 && (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full ring-2 ring-white" />
          )}
        </button>

        {/* Export Button */}
        <button className="flex items-center gap-2 bg-[#42b883] hover:bg-[#3aa374] text-white text-[13px] font-bold px-4 py-2 rounded-md transition-all duration-150 shadow-sm active:scale-[0.98] cursor-pointer">
          <span>Exportar</span>
          <Download size={15} />
        </button>

      </div>
    </header>
  );
}
