import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations("common");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 relative overflow-hidden rtl:font-sans">
      <div className="absolute inset-0 bg-grid-zinc-200/50 dark:bg-grid-zinc-800/25 [mask-image:linear-gradient(to_bottom,white,transparent)]" />

      <div className="relative z-10 text-center max-w-2xl px-4 animate-in fade-in zoom-in duration-500">
        <h1 className="text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-7xl mb-6">
          Enterprise Ready{" "}
          <span className="text-blue-600 dark:text-blue-500">Auth</span>{" "}
          Template
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 mb-8 max-w-xl mx-auto">
          {t("welcome")} - A production-ready SaaS starter built with Next.js
          App Router, Clean Architecture, and a 7-layer robust security model.
          Follows strict i18n specifications.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-8 py-3 rounded-full font-medium shadow-xl hover:scale-105 transition-all"
          >
            Get Started
          </Link>
          <a
            href="#"
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white px-8 py-3 rounded-full font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
          >
            View Source
          </a>
        </div>
      </div>
    </main>
  );
}
