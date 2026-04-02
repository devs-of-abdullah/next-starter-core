"use client";

import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { LogOut, Shield } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const t = useTranslations("common");
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Logged out successfully");
      router.push("/login");
    } catch {
      toast.error("Failed to logout");
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-zinc-900 dark:text-white">
            <Shield className="w-6 h-6 text-blue-600 dark:text-blue-500" />
            <span className="hidden sm:inline">SaaS Kit</span>
          </div>

          <nav className="flex items-center gap-6 rtl:gap-reverse">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              {t("dashboard")}
            </Link>
            <Link
              href="/dashboard/profile"
              className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              {t("profile")}
            </Link>
            <Link
              href="/dashboard/settings"
              className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              {t("settings")}
            </Link>
            <Link
              href="/dashboard/audit-logs"
              className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              {t("auditLogs")}
            </Link>
          </nav>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-2 rtl:flex-row-reverse"
          >
            <LogOut className="w-4 h-4 rtl:rotate-180" />
            <span className="hidden sm:inline">{t("signOut")}</span>
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
