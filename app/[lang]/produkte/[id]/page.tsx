import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "../../../../components/Breadcrumb";
import ReferenceCard from "../../../../components/ReferenceCard";
import TileGrid from "../../../../components/TileGrid";
import { produkte, getProduktById } from "../../../../data/produkte";
import { referenzen } from "../../../../data/referenzen";
import { getDictionary, hasLocale } from "../../dictionaries";
import { LOCALES } from "../../../../lib/i18n";
import { notFound } from "next/navigation";
import { localizeProdukt, localizeReferenzen } from "../../../../data/i18n/getLocalized";

export async function generateMetadata({ params }: { params: Promise<{ lang: string; id: string }> }): Promise<Metadata> {
  const { lang, id } = await params;
  if (!hasLocale(lang)) return {};
  const produkt = getProduktById(id);
  if (!produkt) return {};
  return {
    title: produkt.name,
    description: produkt.kurzbeschreibung,
  };
}

export function generateStaticParams() {
  return produkte.flatMap((p) =>
    LOCALES.map((lang) => ({ lang, id: p.id }))
  );
}

export default async function ProduktDetailPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const baseProdukt = getProduktById(id);

  if (!baseProdukt) notFound();

  const produkt = await localizeProdukt(baseProdukt, lang as "de" | "en" | "fr");

  const categoryLabel =
    (dict.produkte as Record<string, string>)[`category_${produkt.kategorie}`] ||
    produkt.kategorie;

  // Find references that use this product
  const baseRelatedRefs = referenzen.filter((r) =>
    r.produkte.some(
      (p) => p.toLowerCase() === produkt.name.toLowerCase()
    )
  );
  const relatedRefs = await localizeReferenzen(baseRelatedRefs, lang as "de" | "en" | "fr");

  return (
    <>
      <section style={{ padding: "0 32px" }}>
        <div className="mx-auto" style={{ maxWidth: 1320 }}>
          <Breadcrumb
            items={[
              { label: dict.produkte.breadcrumb, href: `/${lang}/produkte` },
              { label: produkt.name },
            ]}
            lang={lang}
          />
        </div>
      </section>

      {/* Header */}
      <section style={{ padding: "0 32px 56px" }}>
        <div className="mx-auto" style={{ maxWidth: 1320 }}>
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span
              className="text-white text-[11px] uppercase tracking-wider px-3 py-1 rounded-[4px]"
              style={{ backgroundColor: "#009ee3", fontWeight: 700 }}
            >
              {categoryLabel}
            </span>
            {produkt.qualitaetsklasse && (
              <span
                className="text-[#002d59] text-[11px] uppercase tracking-wider px-3 py-1 rounded-[4px]"
                style={{ backgroundColor: "#e8edf5", fontWeight: 700 }}
              >
                {produkt.qualitaetsklasse}
              </span>
            )}
          </div>
          <h1
            className="mb-3"
            style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 900, lineHeight: 1.1 }}
          >
            {produkt.name}
          </h1>
          <p className="text-[#002d59] opacity-70 mb-0" style={{ fontSize: 20, lineHeight: 1.5, maxWidth: 700 }}>
            {produkt.kurzbeschreibung}
          </p>
          {produkt.schichtdicke && (
            <p className="text-[#009ee3] mt-3 mb-0" style={{ fontSize: 16, fontWeight: 700 }}>
              {dict.produkte.layer_thickness}: {produkt.schichtdicke}
            </p>
          )}
        </div>
      </section>

      {/* Technical Data + Norms */}
      <section className="bg-[#f5f5f6]" style={{ padding: "64px 32px 72px" }}>
        <div className="mx-auto" style={{ maxWidth: 1320 }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Technical Data */}
            <div>
              <h2
                className="mb-6"
                style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 900, lineHeight: 1.15 }}
              >
                {dict.detail.technical_data}
              </h2>
              <div
                className="bg-white overflow-hidden"
                style={{ borderRadius: 14, boxShadow: "0 4px 20px rgba(0,45,89,0.06)" }}
              >
                {produkt.technischeDaten.map((td, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-baseline gap-4 px-6 py-4"
                    style={i < produkt.technischeDaten.length - 1 ? { borderBottom: "1px solid #f5f5f6" } : {}}
                  >
                    <span className="text-[#002d59] opacity-60 text-[14px]">{td.label}</span>
                    <span className="text-[#002d59] text-[14px] text-right" style={{ fontWeight: 700 }}>
                      {td.wert}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Norms + Features */}
            <div>
              {produkt.normen.length > 0 && (
                <div className="mb-10">
                  <h2
                    className="mb-6"
                    style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 900, lineHeight: 1.15 }}
                  >
                    {dict.detail.norms}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {produkt.normen.map((norm) => (
                      <span
                        key={norm}
                        className="text-[13px] text-[#002d59] px-4 py-2 rounded-[8px] bg-white"
                        style={{ fontWeight: 600, boxShadow: "0 2px 8px rgba(0,45,89,0.06)" }}
                      >
                        {norm}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <h2
                className="mb-6"
                style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 900, lineHeight: 1.15 }}
              >
                {dict.produkte.features}
              </h2>
              <div className="flex flex-col gap-3">
                {produkt.besonderheiten.map((b, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 text-[#009ee3] mt-0.5">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <path d="M22 4L12 14.01l-3-3" />
                      </svg>
                    </span>
                    <span className="text-[#002d59] text-[15px] leading-[1.55]">{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* External link */}
      <section className="bg-[#002d59]" style={{ padding: "40px 32px" }}>
        <div className="mx-auto flex flex-col sm:flex-row items-center justify-between gap-4" style={{ maxWidth: 1320 }}>
          <p className="text-white opacity-70 text-[16px] m-0">
            {dict.produkte.view_on_website}
          </p>
          <a
            href={`https://korodur.de/?s=${encodeURIComponent(produkt.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white no-underline rounded-[8px] bg-[#009ee3] hover:bg-[#0090d0] transition-colors duration-200 shrink-0"
            style={{ padding: "12px 24px", fontWeight: 800, fontSize: 14 }}
          >
            korodur.de
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>
      </section>

      {/* Related References */}
      {relatedRefs.length > 0 && (
        <section style={{ padding: "72px 32px 88px" }}>
          <div className="mx-auto" style={{ maxWidth: 1320 }}>
            <h2
              className="mb-8"
              style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 900, lineHeight: 1.15 }}
            >
              {dict.produkte.used_in_references}
            </h2>
            <TileGrid columns={relatedRefs.length >= 3 ? 3 : 2}>
              {relatedRefs.slice(0, 6).map((r) => (
                <ReferenceCard key={r.id} referenz={r} lang={lang} />
              ))}
            </TileGrid>
          </div>
        </section>
      )}
    </>
  );
}
