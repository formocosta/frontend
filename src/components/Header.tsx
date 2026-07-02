'use client';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, HelpCircle, Settings, LogOut, ChevronDown, ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const MOCK_UNREAD = 3;

export default function Header() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);

  // Format path segments for display
  const formatSegment = (segment: string) => {
    if (segment === 'backoffice') return null; // hide base path
    return segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ');
  };


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


        </div>

      </div>
    </header>
  );
}
