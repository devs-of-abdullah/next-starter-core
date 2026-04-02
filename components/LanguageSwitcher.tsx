"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Languages } from "lucide-react";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <div className="fixed top-4 inset-inline-end-4 z-50 flex items-center gap-2 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 shadow-xl transition-all hover:scale-105 active:scale-95 group">
      <div className="p-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
        <Languages className="w-3.5 h-3.5" />
      </div>
      <select
        value={currentLocale}
        onChange={handleLocaleChange}
        className="bg-transparent text-[13px] font-medium text-zinc-900 dark:text-zinc-100 outline-none cursor-pointer appearance-none pe-4 focus:ring-0"
        aria-label="Select Language"
      >
        <option value="en" className="bg-white dark:bg-zinc-950">
          English (EN)
        </option>
        <option value="tr" className="bg-white dark:bg-zinc-950">
          Türkçe (TR)
        </option>
        <option value="ar" className="bg-white dark:bg-zinc-950 font-sans">
          العربية (AR)
        </option>
      </select>
      <div className="absolute inset-inline-end-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
        <svg
          width="8"
          height="8"
          viewBox="0 0 8 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 2.5L4 5.5L7 2.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
