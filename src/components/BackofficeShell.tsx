'use client';

import { useAuth } from '@/lib/auth-context';
import Sidebar from './Sidebar';
import BackofficeHeader from './BackofficeHeader';

export default function BackofficeShell({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  // sem utilizador autenticado → login/forgot/reset não têm sidebar
  if (!user) return <>{children}</>;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <BackofficeHeader />
        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
