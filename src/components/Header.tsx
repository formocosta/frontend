'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Search, Bell, LogOut } from 'lucide-react';

const ROLE_LABELS: Record<string, string> = {
  admin:               'Admin',
  operador:            'Operador',
  operador_financeiro: 'Financeiro',
  suporte:             'Suporte',
};

const MOCK_UNREAD = 3;
type HeaderProps = {
  onToggleSidebar: () => void;
};

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const initials = user.name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  function handleLogout() {
    logout();
    router.push('/login');
  }

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0">

      {/* Search */}
      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 w-72">
        <Search size={15} className="text-gray-400 shrink-0" />
        <input
          type="text"
          placeholder="Pesquisar..."
          className="bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none w-full"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">

        {/* Notification bell with unread count */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
          <Bell size={18} />
          {MOCK_UNREAD > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
              {MOCK_UNREAD}
            </span>
          )}
        </button>

        <div className="w-px h-6 bg-gray-200" />

        {/* User info */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#0E8A4B] rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
            {initials}
          </div>
          <div className="hidden lg:block">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-gray-900 leading-none">{user.name}</p>
              <span className="text-[10px] font-semibold text-[#0E8A4B] bg-emerald-50 px-2 py-0.5 rounded-lg">
                {ROLE_LABELS[user.role] ?? user.role}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5 leading-none">{user.email}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-red-600 border border-gray-200 hover:border-red-200 hover:bg-red-50 px-3 py-2 rounded-xl transition-all duration-150 ml-1"
        >
          <LogOut size={15} />
          Sair
        </button>

      </div>
    </header>
  );
}
