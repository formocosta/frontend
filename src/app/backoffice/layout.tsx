import { AuthProvider } from '@/lib/auth-context';

export default function BackofficeLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
