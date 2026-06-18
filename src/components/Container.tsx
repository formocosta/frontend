'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Sidebar from './Sidebar';

const SIDEBAR_DEFAULT = 210;
const SIDEBAR_ICONS   = 64;

export default function Container({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [collapsed,  setCollapsed]  = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // ── Persist / restore collapsed state ─────────────────────
  useEffect(() => {
    try {
      const c = localStorage.getItem('sb-collapsed');
      if (c !== null) setCollapsed(c === 'true');
    } catch { /* localStorage unavailable */ }
  }, []);

  // ── Close mobile drawer on navigation ─────────────────────
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // ── Collapse toggle (logo click) ──────────────────────────
  const handleToggleCollapse = useCallback(() => {
    setCollapsed(prev => {
      const next = !prev;
      try { localStorage.setItem('sb-collapsed', String(next)); } catch { /* */ }
      return next;
    });
  }, []);

  const effectiveWidth = collapsed ? SIDEBAR_ICONS : SIDEBAR_DEFAULT;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F4F7F6]">

      {/* ── Mobile overlay backdrop ──────────────────────── */}
      <div
        className={`fixed inset-0 z-30 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 md:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* ── Mobile sidebar drawer ────────────────────────── */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 md:hidden transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: SIDEBAR_DEFAULT }}
      >
        <Sidebar
          collapsed={false}
          onToggleCollapse={() => setMobileOpen(false)}
        />
      </aside>

      {/* ── Desktop sidebar ──────────────────────────────── */}
      <div
        className="hidden md:block relative shrink-0 h-screen z-20 transition-[width] duration-300 ease-in-out"
        style={{ width: effectiveWidth }}
      >
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={handleToggleCollapse}
        />
      </div>

      {/* ── Main content area ────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header
          onOpenMobileMenu={() => setMobileOpen(true)}
        />
        <main className="flex-1 overflow-hidden p-4 md:p-6">
          {/* key=pathname triggers CSS entrance animation on route change */}
          <div key={pathname} className="animate-page-enter h-full overflow-y-auto">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}
