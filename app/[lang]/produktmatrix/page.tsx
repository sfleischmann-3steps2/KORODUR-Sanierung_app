import { getDictionary, hasLocale } from "../dictionaries";
import { notFound } from "next/navigation";
import Link from "next/link";
import Produktmatrix from "../../../components/Produktmatrix";
import type { Locale } from "../../../lib/i18n";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Produktmatrix",
  description:
    "Vergleichen Sie alle KORODUR-Produkte auf einen Blick: Eignung nach Belastung, Situation und Sonderbedingungen.",
};

export default async function ProduktmatrixPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  await getDictionary(lang);

  return (
    <section className="py-24 px-8">
      <div className="max-w-7xl mx-auto">
        <h1
          className="text-4xl text-[#002d59] text-center mb-4"
          style={{ fontWeight: 900 }}
        >
          Produktmatrix
        </h1>
        <p className="text-lg text-[#002d59]/72 text-center mb-16 max-w-2xl mx-auto">
          Welches Produkt passt zu Ihrer Situation? Vergleichen Sie alle Produkte
          auf einen Blick.
        </p>

        <Produktmatrix lang={lang as Locale} />

        <div className="mt-16 text-center p-8 bg-[#f5f5f6] rounded-[14px]">
          <p className="text-[#002d59] text-lg mb-4">
            Unsicher? Der Lösungsfinder führt Sie in 5 Schritten zur passenden
            Lösung.
          </p>
          <Link
            href={`/${lang}/loesungsfinder/`}
            className="inline-block px-8 py-3 text-white font-bold rounded-[10px] no-underline transition-all duration-200 hover:opacity-90"
            style={{ backgroundColor: "#009ee3" }}
          >
            Lösungsfinder starten
          </Link>
        </div>
      </div>
    </section>
  );
}
