'use client';

import { useAuth } from '@/lib/auth-context';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, HelpCircle, Settings, LogOut, ChevronDown, ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const MOCK_UNREAD = 3;

export default function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);

  if (!user) return null;

  const initials = user.name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const pathSegments = pathname.split('/').filter(Boolean);

  // Format path segments for display
  const formatSegment = (segment: string) => {
    if (segment === 'backoffice') return null; // hide base path
    return segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ');
  };

  function handleLogout() {
    logout();
    router.push('/login');
  }

  return (
    <header className="h-[72px] bg-white border-b border-gray-50 flex items-center justify-between px-8 shrink-0 select-none shadow-[0_4px_24px_rgba(0,0,0,0.01)] relative z-10">

      {/* Breadcrumbs Left Side */}
      <div className="flex items-center gap-2 text-[13px] font-semibold text-gray-400">
        <Link href="/dashboard" className="hover:text-gray-900 transition-colors flex items-center justify-center bg-gray-50 w-7 h-7 rounded-lg">
          <Home size={14} />
        </Link>

        {pathSegments.map((segment, index) => {
          const formatted = formatSegment(segment);
          if (!formatted) return null;

          const isLast = index === pathSegments.length - 1;

          return (
            <div key={segment} className="flex items-center gap-2">
              <ChevronRight size={14} className="text-gray-300" />
              <span className={isLast ? 'text-gray-900 font-extrabold' : 'hover:text-gray-600 transition-colors cursor-pointer'}>
                {formatted}
              </span>
            </div>
          );
        })}
      </div>

      {/* Right side utilities */}
      <div className="flex items-center gap-3">

        {/* Utilities Container */}
        <div className="flex items-center gap-1 bg-gray-50/80 p-1 rounded-2xl border border-gray-100/50">
          <Link
            href="/backoffice/suporte"
            className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:bg-white hover:text-gray-700 hover:shadow-sm transition-all"
            title="Suporte"
          >
            <HelpCircle size={17} />
          </Link>

          <Link
            href="/backoffice/definicoes"
            className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:bg-white hover:text-gray-700 hover:shadow-sm transition-all"
            title="Definições"
          >
            <Settings size={17} />
          </Link>

          <button className="relative w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:bg-white hover:text-gray-700 hover:shadow-sm transition-all">
            <Bell size={17} />
            {MOCK_UNREAD > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            )}
          </button>
        </div>

        {/* User Profile / Avatar Capsule */}
        <div className="relative ml-1">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 bg-white border border-gray-100 hover:border-gray-200 hover:bg-gray-50 pl-1.5 pr-3 py-1.5 rounded-full transition-all shadow-sm"
          >
            <div className="w-8 h-8 rounded-full bg-[#42b883] flex items-center justify-center text-white text-[11px] font-extrabold">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-[12px] font-bold text-gray-900 leading-tight">{user.name.split(' ')[0]}</p>
            </div>
            <ChevronDown size={14} className="text-gray-400 ml-1" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-56 bg-white border border-gray-100 rounded-2xl shadow-lg py-2 z-50">
              <div className="px-4 py-3 border-b border-gray-50 mb-1">
                <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 font-medium mt-0.5">{user.email}</p>
              </div>

              <button
                onClick={handleLogout}
                className="w-[calc(100%-16px)] mx-auto flex items-center gap-2 px-3 py-2.5 text-[13px] font-bold text-red-600 rounded-xl hover:bg-red-50 transition-colors"
              >
                <LogOut size={15} />
                <span>Terminar Sessão</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
