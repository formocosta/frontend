import BackofficeShell from "@/components/backoffice-shell";

type BackofficeLayoutProps = {
  children: React.ReactNode;
};

export default function BackofficeLayout({ children }: BackofficeLayoutProps) {
  return <BackofficeShell>{children}</BackofficeShell>;
}
