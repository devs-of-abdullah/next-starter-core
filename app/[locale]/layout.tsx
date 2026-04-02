import type { Metadata } from "next";
import { Inter, Noto_Kufi_Arabic } from "next/font/google";
import "./globals.css";
import { Toast } from "@/components/feedback/Toast";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const inter = Inter({ subsets: ["latin"] });
const notoArabic = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "SaaS Starter | Enterprise Ready Auth",
  description:
    "Clean Architecture Next.js Starter with 7-layer Auth implementation and i18n support.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";
  const fontClass = locale === "ar" ? notoArabic.className : inter.className;

  return (
    <html lang={locale} dir={dir}>
      <body className={fontClass}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <LanguageSwitcher />
          {children}
          <Toast dir={dir as "ltr" | "rtl"} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
