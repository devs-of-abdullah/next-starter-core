import { getTranslations } from "next-intl/server";
import {
  Settings2,
  Bell,
  Shield,
  Key,
  Moon,
  Sun,
  Monitor,
  Globe,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/Button";

export default async function SettingsPage() {
  const t = await getTranslations("common");

  return (
    <div className="space-y-8 max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white drop-shadow-sm">
          {t("settings")}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-lg">
          Control your preferences and manage deep security configurations.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row transition-all hover:shadow-blue-500/5">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-72 p-8 bg-zinc-50/50 dark:bg-zinc-950/30 border-b md:border-b-0 md:border-e border-zinc-200 dark:border-zinc-800">
          <nav className="flex flex-col gap-3">
            <button className="group flex items-center justify-between px-4 py-3 text-sm font-bold rounded-2xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 shadow-sm transition-all">
              <span className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                  <Settings2 className="w-4 h-4" />
                </div>
                General
              </span>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>

            {[
              { icon: Shield, label: "Security", color: "text-emerald-500" },
              { icon: Bell, label: "Notifications", color: "text-amber-500" },
              { icon: Key, label: "API Keys", color: "text-indigo-500" },
            ].map((item, i) => (
              <button
                key={i}
                className="group flex items-center justify-between px-4 py-3 text-sm font-medium rounded-2xl text-zinc-500 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-all hover:shadow-sm"
              >
                <span className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg group-hover:bg-zinc-100 dark:group-hover:bg-zinc-700 transition-colors">
                    <item.icon className="w-4 h-4" />
                  </div>
                  {item.label}
                </span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-all" />
              </button>
            ))}
          </nav>

          <div className="mt-12 p-4 bg-blue-600/5 dark:bg-blue-500/5 rounded-2xl border border-blue-100 dark:border-blue-500/10">
            <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
              Pro Tip
            </p>
            <p className="text-xs text-blue-800/80 dark:text-blue-200/80 leading-relaxed">
              System-wide dark mode syncs automatically based on your device
              settings.
            </p>
          </div>
        </aside>

        {/* Content Area */}
        <section className="flex-1 p-8 sm:p-12 space-y-12">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white leading-tight">
                  General Appearance
                </h3>
                <p className="text-sm text-zinc-500 font-medium">
                  Customize how the interface feels to you.
                </p>
              </div>
            </div>

            <div className="grid gap-10">
              <div className="space-y-4">
                <label className="text-sm font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                  Visual Theme
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: "light", icon: Sun, label: "Light" },
                    { id: "dark", icon: Moon, label: "Dark" },
                    { id: "system", icon: Monitor, label: "System" },
                  ].map((theme) => (
                    <button
                      key={theme.id}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                        theme.id === "system"
                          ? "border-blue-500 bg-blue-50/50 dark:bg-blue-500/5"
                          : "border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700"
                      }`}
                    >
                      <theme.icon
                        className={`w-5 h-5 ${theme.id === "system" ? "text-blue-600 dark:text-blue-400" : "text-zinc-500"}`}
                      />
                      <span className="text-xs font-bold">{theme.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                      Interface Language
                    </label>
                    <p className="text-xs text-zinc-500">
                      Global language preference for all dashboards.
                    </p>
                  </div>
                  <Globe className="w-6 h-6 text-zinc-200 dark:text-zinc-700" />
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex items-center gap-4">
                  <InfoIcon />
                  Change language instantly using the floating toggle in the
                  top-right corner of your screen.
                </p>
              </div>

              <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-4">
                <Button variant="ghost" className="rounded-2xl px-8 font-bold">
                  Discard
                </Button>
                <Button
                  variant="default"
                  className="rounded-2xl px-12 font-bold shadow-xl shadow-blue-600/20 bg-blue-600 hover:bg-blue-700"
                >
                  Save System Preferences
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function InfoIcon() {
  return (
    <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 shrink-0">
      <Globe className="w-4 h-4" />
    </div>
  );
}
