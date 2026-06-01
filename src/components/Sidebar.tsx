'use client';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

const NAV_ITEMS = [
  { label: 'Dashboard',             href: '/backoffice/dashboard',    allowedRoles: ['admin','operador','operador_financeiro','suporte'] },
  { label: 'Candidaturas KYC',      href: '/backoffice/kyc',          allowedRoles: ['admin','operador'] },
  { label: 'Solicitações',          href: '/backoffice/solicitacoes', allowedRoles: ['admin','operador'] },
  { label: 'Mensagens',             href: '/backoffice/mensagens',    allowedRoles: ['admin','operador'] },
  { label: 'Pagamentos',            href: '/backoffice/pagamentos',   allowedRoles: ['admin','operador_financeiro'] },
  { label: 'Repasses',              href: '/backoffice/repasses',     allowedRoles: ['admin','operador_financeiro'] },
  { label: 'Avaliações',            href: '/backoffice/avaliacoes',   allowedRoles: ['admin','operador'] },
  { label: 'Disputas',              href: '/backoffice/disputas',     allowedRoles: ['admin','suporte'] },
  { label: 'Catálogo',              href: '/backoffice/catalogo',     allowedRoles: ['admin'] },
  { label: 'Utilizadores internos', href: '/backoffice/utilizadores', allowedRoles: ['admin'] },
  { label: 'Relatórios',            href: '/backoffice/relatorios',   allowedRoles: ['admin','operador_financeiro'] },
];

export default function Sidebar() {
  const { user } = useAuth();

  if (!user) return null;

  const visibleItems = NAV_ITEMS.filter(item =>
    item.allowedRoles.includes(user.role)
  );

  return (
    <aside className="w-64 h-full bg-white border-r border-gray-200 flex flex-col">
      <nav className="flex-1 py-4">
        {visibleItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#0B7A45] transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
