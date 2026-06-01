'use client';

import { useAuth } from '@/lib/auth-context';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) return <>{children}</>;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6" style={{ backgroundColor: '#F7F8FA' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
