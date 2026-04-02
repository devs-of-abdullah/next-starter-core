import {
  ShieldCheck,
  Activity,
  Users,
  Lock,
  ChevronRight,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function DashboardPage() {
  const t = await getTranslations("common");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          {t("dashboard")}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">{t("welcome")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: t("totalUsers"),
            value: "+2,350",
            icon: Users,
            desc: t("activeMembers"),
            color: "text-blue-500",
          },
          {
            title: t("securityStatus"),
            value: "Secure",
            icon: ShieldCheck,
            desc: t("layer7Protected"),
            color: "text-emerald-500",
          },
          {
            title: t("activeSessions"),
            value: "142",
            icon: Activity,
            desc: t("inLastHour"),
            color: "text-amber-500",
          },
          {
            title: t("failedLogins"),
            value: "3",
            icon: Lock,
            desc: t("blockedAttempts"),
            color: "text-rose-500",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                {stat.title}
              </span>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="mt-4">
              <span className="text-3xl font-bold text-zinc-900 dark:text-white">
                {stat.value}
              </span>
              <p className="text-xs text-zinc-500 mt-1">{stat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
            {t("architectureHighlights")}
          </h2>
          <ul className="space-y-4">
            {[
              t("layeredSecurity"),
              t("cleanDomainBoundaries"),
              t("globalApiErrorMapping"),
              t("strictRbac"),
            ].map((feat, i) => (
              <li
                key={i}
                className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg"
              >
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                {feat}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
            {t("quickActions")}
          </h2>
          <div className="flex flex-col gap-3">
            <button className="flex justify-between items-center w-full bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 p-4 rounded-lg text-sm text-zinc-700 dark:text-zinc-200 transition-colors text-start">
              <span>{t("manageRoles")}</span>
              <ChevronRight className="w-4 h-4 rtl:rotate-180" />
            </button>
            <button className="flex justify-between items-center w-full bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 p-4 rounded-lg text-sm text-zinc-700 dark:text-zinc-200 transition-colors text-start">
              <span>{t("auditLogs")}</span>
              <ChevronRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
