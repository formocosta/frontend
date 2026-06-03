"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { LayoutDashboard, LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { clearTokens, isAuthenticated } from "@/lib/auth";

type BackofficeShellProps = {
  children: React.ReactNode;
};

const AUTH_ROUTES = new Set([
  "/backoffice/login",
  "/backoffice/forgot-password",
  "/backoffice/reset-password",
]);

const MENU_ITEMS = [
  { href: "/backoffice/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export default function BackofficeShell({ children }: BackofficeShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isAuthRoute = useMemo(() => AUTH_ROUTES.has(pathname), [pathname]);

  useEffect(() => {
    if (isAuthRoute) return;
    if (!isAuthenticated()) {
      router.replace("/backoffice/login");
    }
  }, [isAuthRoute, router]);

  function logout() {
    clearTokens();
    router.replace("/backoffice/login");
  }

  if (isAuthRoute) {
    return <>{children}</>;
  }

  const sidebarWidth = isCollapsed ? "w-20" : "w-72";
  const sidebarOffset = isCollapsed ? "ml-20" : "ml-72";

  return (
    <div className="min-h-screen bg-slate-100">
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex ${sidebarWidth} flex-col border-r border-slate-200 bg-white px-3 py-4 transition-all duration-300`}
      >
        <button
          type="button"
          onClick={() => setIsCollapsed((value) => !value)}
          className="flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="h-5 w-5 shrink-0" />
          ) : (
            <PanelLeftClose className="h-5 w-5 shrink-0" />
          )}
          {!isCollapsed && <span>Formocosta</span>}
        </button>

        <nav className="mt-5 flex-1 space-y-1">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-slate-200 pt-4">
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
              A
            </div>
            {!isCollapsed && (
              <div>
                <p className="text-sm font-semibold text-slate-800">Administrador</p>
                <p className="text-xs text-slate-500">Back-office</p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={logout}
            className="flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <div className={`${sidebarOffset} transition-all duration-300`}>
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur">
          <h1 className="text-lg font-semibold text-slate-900">Back-office</h1>
          <p className="text-sm text-slate-500">Gestão interna da plataforma</p>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
