"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, clearTokens } from "@/lib/auth";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/backoffice/login");
    }
  }, [router]);

  function logout() {
    clearTokens();
    router.replace("/backoffice/login");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-primary-green">
      <div className="w-[400px] bg-primary-white p-8 rounded-2xl shadow-2xl text-center space-y-4">
        <h1 className="text-3xl font-bold text-primary-red">Dashboard</h1>
        <p className="text-gray-500">Login realizado com sucesso.</p>
        <button
          onClick={logout}
          className="w-full bg-primary-red text-white p-3 rounded-lg"
        >
          Logout
        </button>
      </div>
    </main>
  );
}
