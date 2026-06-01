import { AuthProvider } from '@/lib/auth-context';
import BackofficeShell from '@/components/BackofficeShell';

export default function BackofficeLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <BackofficeShell>{children}</BackofficeShell>
    </AuthProvider>
  );
}
