export default function LocaleLayout({ 
    children, params: { locale } }:
    {children: React.ReactNode; params:
    {locale: string };
}) 


{
  const isRTL = locale === "ar";

  return (
    <html lang={locale} dir={isRTL ? "rtl" : "ltr"}>
      <body>{children}</body>
    </html>
  );
}
