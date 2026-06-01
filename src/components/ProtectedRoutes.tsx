'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

type Props = {
  children: React.ReactNode;
  allowedRoles: string[];
};

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // ainda não carregou o user
    if (!user) return;

    // se não tiver role permitida → manda para login
    if (!allowedRoles.includes(user.role)) {
      router.push('/backoffice/login');
    }
  }, [user, allowedRoles, router]);

  // enquanto não carrega user, não mostra nada
  if (!user) return null;

  // se não tem permissão, também não mostra conteúdo
  if (!allowedRoles.includes(user.role)) return null;

  return <>{children}</>;
}