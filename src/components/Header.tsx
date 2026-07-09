'use client';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, HelpCircle, Settings, LogOut, ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/shared/store/auth.store';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const pathSegments = pathname.split('/').filter(Boolean);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleLogout() {
    logout();
    router.push('/login');
  }

  const formatSegment = (segment: string) => {
    if (segment === 'backoffice') return null;
    return segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ');
  };

  return (
    <header className="h-[72px] bg-white border-b border-gray-50 flex items-center justify-between px-8 shrink-0 select-none shadow-[0_4px_24px_rgba(0,0,0,0.01)] relative z-10">

      {/* Breadcrumbs */}
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

      {/* Right side */}
      <div className="flex items-center gap-3">

        {/* Utility buttons */}
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
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
        </div>

        {/* User Profile */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
          >
            <div className="text-right">
              <p className="text-[13px] font-bold text-gray-900 leading-tight">
                {user?.nome_completo || 'Admin'}
              </p>
              <p className="text-[11px] text-gray-500 font-medium">
                {user?.role === 'admin' ? 'Administrador' : 'Operador'}
              </p>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#42b883] flex items-center justify-center text-white text-sm font-bold shadow-sm">
              {user?.nome_completo?.charAt(0) || 'A'}
            </div>
          </button>

          {/* Dropdown menu */}
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-50">
                <p className="text-[13px] font-bold text-gray-900">{user?.nome_completo || 'Admin'}</p>
                <p className="text-[11px] text-gray-500 font-medium">{user?.email || 'admin@formocosta.com'}</p>
              </div>
              <div className="py-1">
                <Link
                  href="/backoffice/definicoes"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  <Settings size={16} />
                  Definições
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-semibold text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  Sair da conta
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
