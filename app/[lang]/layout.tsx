import type { Metadata } from "next";
import "../globals.css";
import AppShell from "../../components/AppShell";
import { getDictionary, hasLocale } from "./dictionaries";
import { LOCALES } from "../../lib/i18n";
import { LocaleProvider } from "../../lib/LocaleContext";
import type { Locale } from "../../lib/i18n";
import { notFound } from "next/navigation";
import { withBasePath } from "../../lib/basePath";
import ServiceWorkerRegistrar from "../../components/ServiceWorkerRegistrar";

export const metadata: Metadata = {
  title: {
    template: "%s | KORODUR Sanierung",
    default: "Sanieren mit KORODUR",
  },
  description:
    "KORODUR bietet professionelle Sanierungslösungen für Industrieboden, Industriebau und Infrastruktur. Schnelle Reparaturen, dauerhafte Ergebnisse.",
  openGraph: {
    type: "website",
    siteName: "KORODUR Sanierung",
  },
};

export async function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <html lang={lang} className="antialiased">
      <head>
        <meta name="theme-color" content="#002d59" />
        <link rel="manifest" href={withBasePath("/manifest.json")} />
        <link rel="icon" href={withBasePath("/icons/icon-192.svg")} type="image/svg+xml" />
        <link rel="apple-touch-icon" href={withBasePath("/icons/icon-192.svg")} />
      </head>
      <body
        className="min-h-screen"
        style={{ fontFamily: "'Gabarito', Arial, sans-serif" }}
      >
        <a href="#main-content" className="skip-to-content">
          {lang === "de" ? "Zum Inhalt springen" : lang === "fr" ? "Aller au contenu" : lang === "pl" ? "Przejdź do treści" : "Skip to content"}
        </a>
        <LocaleProvider lang={lang as Locale} dict={dict}>
          <AppShell lang={lang as Locale} dict={dict}>
            <div id="main-content">{children}</div>
          </AppShell>
        </LocaleProvider>
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
