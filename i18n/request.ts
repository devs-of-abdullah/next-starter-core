import { getRequestConfig } from "next-intl/server";
import { routing, Locale } from "./routing";

const NAMESPACES = ["auth", "common"] as const;

async function loadMessages(locale: Locale) {
  const entries = await Promise.all(
    NAMESPACES.map(async (ns) => {
      try {
        const messages = (await import(`../messages/${locale}/${ns}.json`)).default;
        return [ns, messages] as const;
      }
       catch {
        const fallback = (await import(`../messages/${routing.defaultLocale}/${ns}.json`)).default;
        return [ns, fallback] as const;
      }
    }),
  );

  return Object.fromEntries(entries);
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }

  return {locale, messages: await loadMessages(locale as Locale)};
});
