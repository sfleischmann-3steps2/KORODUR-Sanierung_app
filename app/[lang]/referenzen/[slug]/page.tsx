import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "../../../../components/Breadcrumb";
import ReferenceCard from "../../../../components/ReferenceCard";
import ReferenzPdf from "../../../../components/ReferenzPdf";
import TileGrid from "../../../../components/TileGrid";
import ImageGallery from "../../../../components/ImageGallery";
import { referenzen, getReferenzBySlug } from "../../../../data/referenzen";
import { kategorien } from "../../../../data/kategorien";
import { getProdukteByNames } from "../../../../data/produkte";
import { withBasePath } from "../../../../lib/basePath";
import { getDictionary, hasLocale } from "../../dictionaries";
import { LOCALES } from "../../../../lib/i18n";
import { notFound } from "next/navigation";
import { localizeReferenz, localizeReferenzen, localizeProdukte } from "../../../../data/i18n/getLocalized";

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const base = getReferenzBySlug(slug);
  if (!base) return {};
  const ref = await localizeReferenz(base, lang as "de" | "en" | "fr");
  return {
    title: `${ref.titel} – ${ref.ort}`,
    description: ref.untertitel,
    openGraph: {
      title: ref.titel,
      description: ref.untertitel,
      images: [withBasePath(ref.bild)],
    },
  };
}

export function generateStaticParams() {
  return referenzen.flatMap((r) =>
    LOCALES.map((lang) => ({ lang, slug: r.slug }))
  );
}

export default async function ReferenzDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const baseReferenz = getReferenzBySlug(slug);

  if (!baseReferenz) {
    notFound();
  }

  const referenz = await localizeReferenz(baseReferenz, lang as "de" | "en" | "fr");

  const kategorieLabel =
    dict.categories[referenz.kategorie as keyof typeof dict.categories] ||
    referenz.kategorie;
  const baseProduktDetails = getProdukteByNames(referenz.produkte);
  const produktDetails = await localizeProdukte(baseProduktDetails, lang as "de" | "en" | "fr");

  const baseRelated = referenzen
    .filter((r) => r.kategorie === referenz.kategorie && r.slug !== referenz.slug)
    .slice(0, 3);
  const related = await localizeReferenzen(baseRelated, lang as "de" | "en" | "fr");

  return (
    <>
      <section style={{ padding: "0 32px" }}>
        <div className="mx-auto" style={{ maxWidth: 1320 }}>
          <Breadcrumb
            items={[
              { label: dict.referenzen.breadcrumb, href: `/${lang}/referenzen/` },
              { label: referenz.titel },
            ]}
            lang={lang}
          />
        </div>
      </section>

      {/* Hero image */}
      <section style={{ padding: "0 32px 48px" }}>
        <div className="mx-auto" style={{ maxWidth: 1320 }}>
          <div
            className="overflow-hidden w-full relative"
            style={{ borderRadius: 14, aspectRatio: "21/9" }}
          >
            <Image
              src={withBasePath(referenz.bild)}
              alt={referenz.bildAlt}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1320px"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Title & meta */}
      <section style={{ padding: "0 32px 56px" }}>
        <div className="mx-auto" style={{ maxWidth: 1320 }}>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span
              className="text-white text-[11px] uppercase tracking-wider px-3 py-1 rounded-[4px]"
              style={{ backgroundColor: "#009ee3", fontWeight: 700 }}
            >
              {kategorieLabel}
            </span>
          </div>
          <h1
            className="mb-3"
            style={{
              fontSize: "clamp(28px, 5vw, 44px)",
              fontWeight: 900,
              lineHeight: 1.1,
            }}
          >
            {referenz.titel}
          </h1>
          <p
            className="text-[#002d59] opacity-70 mb-8"
            style={{ fontSize: 20, lineHeight: 1.5 }}
          >
            {referenz.untertitel}
          </p>

          <div className="flex flex-wrap gap-3 mb-10">
            <span
              className="flex items-center gap-2 text-[14px] text-[#002d59] px-4 py-2 rounded-[8px]"
              style={{ backgroundColor: "#f5f5f6", fontWeight: 700 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#009ee3" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {referenz.ort}, {referenz.land}
            </span>
            {referenz.flaeche && (
              <span
                className="flex items-center gap-2 text-[14px] text-[#002d59] px-4 py-2 rounded-[8px]"
                style={{ backgroundColor: "#f5f5f6", fontWeight: 700 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#009ee3" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18" />
                  <path d="M9 3v18" />
                </svg>
                {referenz.flaeche}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-10">
            {produktDetails.map((p) => (
              <Link
                key={p.id}
                href={`/${lang}/produkte/${p.id}/`}
                className="inline-flex items-center gap-2 text-[13px] text-white no-underline rounded-[6px] hover:opacity-80 transition-opacity"
                style={{ backgroundColor: "#009ee3", fontWeight: 700, padding: "8px 14px" }}
              >
                {p.name}
              </Link>
            ))}
          </div>

          <ReferenzPdf referenz={referenz} produkt={produktDetails[0]} />
        </div>
      </section>

      {/* Herausforderungen & Lösung */}
      <section className="bg-[#f5f5f6]" style={{ padding: "64px 32px 72px" }}>
        <div className="mx-auto" style={{ maxWidth: 1320 }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2
                className="mb-6"
                style={{
                  fontSize: "clamp(22px, 3vw, 32px)",
                  fontWeight: 900,
                  lineHeight: 1.15,
                }}
              >
                {dict.detail.challenges}
              </h2>
              <ul className="list-none m-0 p-0 flex flex-col gap-4">
                {referenz.herausforderungen.map((h, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className="flex-shrink-0 w-[28px] h-[28px] flex items-center justify-center rounded-full mt-0.5"
                      style={{ backgroundColor: "rgba(0,158,227,0.10)" }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#009ee3" strokeWidth="3" strokeLinecap="round">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                    <span className="text-[#002d59] text-[16px] leading-[1.6]">{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2
                className="mb-6"
                style={{
                  fontSize: "clamp(22px, 3vw, 32px)",
                  fontWeight: 900,
                  lineHeight: 1.15,
                }}
              >
                {dict.detail.solution}
              </h2>
              <p
                className="text-[#002d59] leading-[1.7]"
                style={{ fontSize: 16 }}
              >
                {referenz.loesung}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bildergalerie */}
      {referenz.galerieBilder && referenz.galerieBilder.length > 0 && (
        <section style={{ padding: "64px 32px 0" }}>
          <div className="mx-auto" style={{ maxWidth: 1320 }}>
            <h2
              className="mb-8"
              style={{
                fontSize: "clamp(22px, 3vw, 32px)",
                fontWeight: 900,
                lineHeight: 1.15,
              }}
            >
              {dict.detail.gallery ?? "Bildergalerie"}
            </h2>
            <ImageGallery images={referenz.galerieBilder} alt={referenz.titel} />
          </div>
        </section>
      )}

      {/* Vorteile */}
      <section style={{ padding: "64px 32px 72px" }}>
        <div className="mx-auto" style={{ maxWidth: 1320 }}>
          <h2
            className="mb-8"
            style={{
              fontSize: "clamp(22px, 3vw, 32px)",
              fontWeight: 900,
              lineHeight: 1.15,
            }}
          >
            {dict.detail.benefits}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {referenz.vorteile.map((v, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-white p-5"
                style={{
                  borderRadius: 12,
                  boxShadow: "0 4px 20px rgba(0,45,89,0.06)",
                }}
              >
                <span className="flex-shrink-0 text-[#009ee3] mt-0.5">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <path d="M22 4L12 14.01l-3-3" />
                  </svg>
                </span>
                <span className="text-[#002d59] text-[15px] leading-[1.55]">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eingesetzte Produkte */}
      <section className="bg-[#002d59]" style={{ padding: "64px 32px 72px" }}>
        <div className="mx-auto" style={{ maxWidth: 1320 }}>
          <h2
            className="text-white mb-3"
            style={{
              fontSize: "clamp(22px, 3vw, 32px)",
              fontWeight: 900,
              lineHeight: 1.15,
            }}
          >
            {dict.detail.products_used}
          </h2>
          <p className="text-white opacity-50 mb-10" style={{ fontSize: 16 }}>
            {dict.detail.products_subtitle}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {produktDetails.map((produkt) => (
              <div
                key={produkt.id}
                className="bg-white overflow-hidden"
                style={{ borderRadius: 14, boxShadow: "0 8px 40px rgba(0,0,0,0.15)" }}
              >
                <div
                  className="p-6 pb-4"
                  style={{ borderBottom: "1px solid #e8edf5" }}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-[#002d59] text-[18px] m-0" style={{ fontWeight: 900 }}>
                      {produkt.name}
                    </h3>
                    {produkt.qualitaetsklasse && (
                      <span
                        className="text-[10px] text-white uppercase tracking-wider px-2.5 py-1 rounded-[4px] whitespace-nowrap"
                        style={{ backgroundColor: "#009ee3", fontWeight: 700 }}
                      >
                        {produkt.qualitaetsklasse}
                      </span>
                    )}
                  </div>
                  <p className="text-[#002d59] opacity-60 text-[14px] m-0 leading-[1.5]">
                    {produkt.kurzbeschreibung}
                  </p>
                  {produkt.schichtdicke && (
                    <p className="text-[#009ee3] text-[13px] mt-2 m-0" style={{ fontWeight: 700 }}>
                      Schichtdicke: {produkt.schichtdicke}
                    </p>
                  )}
                </div>

                <div className="p-6 pt-4">
                  <p className="text-[#002d59] opacity-40 text-[11px] uppercase tracking-wider mb-3" style={{ fontWeight: 700 }}>
                    {dict.detail.technical_data}
                  </p>
                  <div className="flex flex-col gap-2">
                    {produkt.technischeDaten.slice(0, 5).map((td, i) => (
                      <div key={i} className="flex justify-between items-baseline gap-4">
                        <span className="text-[#002d59] opacity-60 text-[13px]">{td.label}</span>
                        <span className="text-[#002d59] text-[13px] text-right" style={{ fontWeight: 700 }}>
                          {td.wert}
                        </span>
                      </div>
                    ))}
                  </div>

                  {produkt.normen.length > 0 && (
                    <div className="mt-4 pt-4" style={{ borderTop: "1px solid #e8edf5" }}>
                      <p className="text-[#002d59] opacity-40 text-[11px] uppercase tracking-wider mb-2" style={{ fontWeight: 700 }}>
                        {dict.detail.norms}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {produkt.normen.map((norm) => (
                          <span
                            key={norm}
                            className="text-[11px] text-[#002d59] px-2.5 py-1 rounded-[4px]"
                            style={{ backgroundColor: "#f5f5f6", fontWeight: 600 }}
                          >
                            {norm}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 pt-4" style={{ borderTop: "1px solid #e8edf5" }}>
                    <Link
                      href={`/${lang}/produkte/${produkt.id}`}
                      className="inline-flex items-center gap-2 text-[#009ee3] text-[13px] no-underline hover:underline"
                      style={{ fontWeight: 700 }}
                    >
                      {dict.sanierung.view_product}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {referenz.produkte.filter(
            (name) => !produktDetails.find((p) => p.name === name)
          ).length > 0 && (
            <div className="flex flex-wrap gap-3 mt-6">
              {referenz.produkte
                .filter((name) => !produktDetails.find((p) => p.name === name))
                .map((p) => (
                  <span
                    key={p}
                    className="text-[14px] text-white px-5 py-2.5 rounded-[8px]"
                    style={{ fontWeight: 700, backgroundColor: "rgba(255,255,255,0.10)" }}
                  >
                    {p}
                  </span>
                ))}
            </div>
          )}
        </div>
      </section>

      {/* Related references */}
      {related.length > 0 && (
        <section style={{ padding: "72px 32px 88px" }}>
          <div className="mx-auto" style={{ maxWidth: 1320 }}>
            <h2
              className="mb-8"
              style={{
                fontSize: "clamp(22px, 3vw, 32px)",
                fontWeight: 900,
                lineHeight: 1.15,
              }}
            >
              {dict.detail.related}
            </h2>
            <TileGrid columns={3}>
              {related.map((r) => (
                <ReferenceCard key={r.id} referenz={r} lang={lang} />
              ))}
            </TileGrid>
            <div className="text-center mt-10">
              <Link
                href={`/${lang}/referenzen/`}
                className="inline-block text-white no-underline rounded-[6px] bg-[#009ee3] hover:bg-[#0090d0] transition-colors duration-200"
                style={{ padding: "14px 28px", fontWeight: 800, fontSize: 15 }}
              >
                {dict.detail.related} →
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="bg-[#002d59]" style={{ padding: "48px 32px" }}>
        <div className="mx-auto text-center" style={{ maxWidth: 700 }}>
          <p className="text-lg text-white mb-4" style={{ fontWeight: 700 }}>
            Ähnliches Projekt? Kontaktieren Sie unsere Berater.
          </p>
          <a
            href="https://www.korodur.de/kontakt/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border-2 border-white text-white hover:bg-white hover:text-[#002d59] no-underline rounded-[6px] transition-colors"
            style={{ padding: "14px 28px", fontWeight: 800, fontSize: 15 }}
          >
            Berater kontaktieren
          </a>
        </div>
      </section>
    </>
  );
}
