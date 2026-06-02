'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">

      {user && (
        <Sidebar
          collapsed={collapsed}
          onToggleSidebar={() => setCollapsed(prev => !prev)}
        />
      )}

      <div className="flex flex-col flex-1 overflow-hidden">

        <Header
          onToggleSidebar={() => setCollapsed(prev => !prev)}
        />

        <main className="flex-1 overflow-auto p-6 bg-[#F7F8FA]">
          {children}
        </main>

      </div>

    </div>
  );
}