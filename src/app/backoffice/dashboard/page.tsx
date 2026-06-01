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
}
