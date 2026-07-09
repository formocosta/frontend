'use client';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, HelpCircle, Settings, LogOut, ChevronRight, Home, Search, Layout, FileText } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/shared/store/auth.store';

const SEARCH_ROUTES = [
  { title: 'Dashboard', href: '/dashboard', type: 'Tela', icon: Layout },
  { title: 'Candidaturas KYC', href: '/kyc', type: 'Tela', icon: Layout },
  { title: 'Solicitações', href: '/solicitacoes', type: 'Tela', icon: Layout },
  { title: 'Catálogo', href: '/catalogo', type: 'Tela', icon: Layout },
  { title: 'Pagamentos', href: '/pagamentos', type: 'Tela', icon: Layout },
  { title: 'Repasses', href: '/repasses', type: 'Tela', icon: Layout },
  { title: 'Definições', href: '/backoffice/definicoes', type: 'Tela', icon: Settings },
  { title: 'Suporte & Documentação', href: '/backoffice/suporte', type: 'Documentação', icon: FileText },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const pathSegments = pathname.split('/').filter(Boolean);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchResults(false);
        setIsSearchFocused(false);
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

  const filteredRoutes = SEARCH_ROUTES.filter(route => 
    route.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    route.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="h-[72px] bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0 select-none shadow-[0_2px_10px_rgba(0,0,0,0.01)] relative z-10 gap-4">

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-[13px] font-bold text-gray-400 flex-1 min-w-0 overflow-hidden">
        <Link href="/dashboard" className="text-gray-400 hover:text-[#42b883] transition-colors flex items-center gap-1.5 rounded-sm shrink-0">
          <Home size={14} />
          <span className="hidden sm:inline">Dashboard</span>
        </Link>

        {pathSegments.map((segment, index) => {
          const formatted = formatSegment(segment);
          if (!formatted) return null;

          const isLast = index === pathSegments.length - 1;

          return (
            <div key={segment} className="flex items-center gap-2 shrink-0">
              <ChevronRight size={14} className="text-gray-300" />
              <span className={`tracking-tight ${isLast ? 'text-gray-900 font-black truncate max-w-[120px] md:max-w-[200px]' : 'hover:text-gray-600 transition-colors cursor-pointer truncate max-w-[100px]'}`}>
                {formatted}
              </span>
            </div>
          );
        })}
      </div>

      {/* Search Bar Center */}
      <div className="w-[300px] lg:w-[400px] xl:w-[500px] relative shrink-0" ref={searchRef}>
        <div className={`relative flex items-center transition-all duration-300 rounded-sm border ${isSearchFocused ? 'bg-white border-[#42b883] shadow-[0_0_0_3px_rgba(66,184,131,0.1)]' : 'bg-gray-50 border-gray-100 hover:border-gray-200 hover:bg-gray-50/80'}`}>
          <Search size={15} className={`absolute left-3 transition-colors ${isSearchFocused ? 'text-[#42b883]' : 'text-gray-400'}`} />
          <input 
            type="text" 
            placeholder="Pesquisar painéis, documentação..." 
            value={searchQuery}
            onChange={(e) => {
               setSearchQuery(e.target.value);
               setShowSearchResults(true);
            }}
            onFocus={() => {
              setShowSearchResults(true);
              setIsSearchFocused(true);
            }}
            className="w-full bg-transparent text-gray-900 placeholder:text-gray-400 font-semibold text-[13px] pl-9 pr-4 py-2.5 focus:outline-none transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => {
                setSearchQuery('');
                setShowSearchResults(false);
              }}
              className="absolute right-3 text-gray-400 hover:text-gray-600"
            >
              <LogOut size={12} className="rotate-45" /> {/* Use as a clear icon */}
            </button>
          )}
        </div>
        
        {/* Search Results Dropdown */}
        {showSearchResults && searchQuery && (
           <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-sm shadow-xl border border-gray-100 py-3 z-50 max-h-[300px] overflow-y-auto">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 mb-2">Resultados da Pesquisa</p>
              {filteredRoutes.length > 0 ? (
                filteredRoutes.map((route, i) => {
                  const Icon = route.icon;
                  return (
                    <Link
                      key={i}
                      href={route.href}
                      onClick={() => {
                        setShowSearchResults(false);
                        setSearchQuery('');
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-sm bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-[#42b883] group-hover:shadow-sm transition-all">
                        <Icon size={14} />
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-gray-900 group-hover:text-[#42b883] transition-colors tracking-tight">{route.title}</p>
                        <p className="text-[11px] text-gray-500 font-semibold">{route.type}</p>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="px-4 py-6 text-center">
                  <Search size={24} className="mx-auto text-gray-200 mb-2" />
                  <p className="text-[13px] text-gray-500 font-bold">Sem resultados</p>
                  <p className="text-[11px] text-gray-400">Tente usar outros termos de pesquisa.</p>
                </div>
              )}
           </div>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4 flex-1 justify-end min-w-0">

        {/* Utility buttons */}
        <div className="flex items-center gap-1.5 border-r border-gray-100 pr-4 hidden lg:flex shrink-0">
          <Link
            href="/backoffice/suporte"
            className="w-8 h-8 flex items-center justify-center rounded-sm text-gray-400 hover:bg-[#42b883]/10 hover:text-[#42b883] transition-colors"
            title="Suporte e Documentação"
          >
            <HelpCircle size={16} />
          </Link>

          <Link
            href="/backoffice/definicoes"
            className="w-8 h-8 flex items-center justify-center rounded-sm text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            title="Definições"
          >
            <Settings size={16} />
          </Link>

          <button className="relative w-8 h-8 flex items-center justify-center rounded-sm text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors">
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-sm border-2 border-white shadow-sm" />
          </button>
        </div>

        {/* User Profile */}
        <div className="relative shrink-0" ref={menuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={`flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-sm transition-all border max-w-full ${showUserMenu ? 'bg-gray-50 border-gray-200' : 'bg-transparent border-transparent hover:bg-gray-50 hover:border-gray-100'}`}
          >
            <div className="text-right hidden md:block min-w-0">
              <p className="text-[13px] font-black text-gray-900 leading-tight tracking-tight truncate max-w-[120px] lg:max-w-[150px]">
                {user?.nome_completo || 'Admin'}
              </p>
              <p className="text-[11px] text-gray-500 font-semibold truncate">
                {user?.role === 'admin' ? 'Administrador' : 'Operador'}
              </p>
            </div>
            <div className="w-9 h-9 shrink-0 rounded-sm bg-gradient-to-br from-[#42b883] to-[#3aa374] flex items-center justify-center text-white text-sm font-black shadow-inner">
              {user?.nome_completo?.charAt(0) || 'A'}
            </div>
          </button>

          {/* Dropdown menu */}
          {showUserMenu && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-60 bg-white rounded-sm shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-5 py-4 bg-gray-50/50 border-b border-gray-100">
                <p className="text-[13px] font-black text-gray-900 truncate">{user?.nome_completo || 'Admin'}</p>
                <p className="text-[11px] text-gray-500 font-semibold truncate">{user?.email || 'admin@formocosta.com'}</p>
              </div>
              <div className="p-2">
                <Link
                  href="/backoffice/definicoes"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-[13px] font-bold text-gray-600 rounded-sm hover:bg-gray-50 hover:text-gray-900 transition-colors group"
                >
                  <Settings size={15} className="text-gray-400 group-hover:text-gray-600 group-hover:rotate-45 transition-transform" />
                  Minhas Definições
                </Link>
                <div className="h-px bg-gray-100 my-1 mx-2" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-bold text-red-600 rounded-sm hover:bg-red-50 transition-colors group"
                >
                  <LogOut size={15} className="text-red-400 group-hover:text-red-600 group-hover:-translate-x-1 transition-transform" />
                  Sair da plataforma
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
