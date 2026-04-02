import type { Metadata } from "next";
import "../globals.css";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
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
        className="min-h-screen flex flex-col"
        style={{ fontFamily: "'Gabarito', Arial, sans-serif" }}
      >
        <LocaleProvider lang={lang as Locale} dict={dict}>
          <Navigation lang={lang as Locale} dict={dict} />
          <main className="flex-1">{children}</main>
          <Footer lang={lang as Locale} dict={dict} />
        </LocaleProvider>
      </body>
    </html>
  );
}
