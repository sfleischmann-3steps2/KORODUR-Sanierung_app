import type { Metadata } from "next";
import "../globals.css";
import AppShell from "../../components/AppShell";
import { getDictionary, hasLocale } from "./dictionaries";
import { LOCALES } from "../../lib/i18n";
import { LocaleProvider } from "../../lib/LocaleContext";
import type { Locale } from "../../lib/i18n";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Sanieren mit KORODUR",
  description:
    "KORODUR bietet professionelle Sanierungslösungen für Industrieboden, Industriebau und Infrastruktur. Schnelle Reparaturen, dauerhafte Ergebnisse.",
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
      <body
        className="min-h-screen"
        style={{ fontFamily: "'Gabarito', Arial, sans-serif" }}
      >
        <a href="#main-content" className="skip-to-content">
          {lang === "de" ? "Zum Inhalt springen" : lang === "fr" ? "Aller au contenu" : "Skip to content"}
        </a>
        <LocaleProvider lang={lang as Locale} dict={dict}>
          <AppShell lang={lang as Locale} dict={dict}>
            <div id="main-content">{children}</div>
          </AppShell>
        </LocaleProvider>
      </body>
    </html>
  );
}
