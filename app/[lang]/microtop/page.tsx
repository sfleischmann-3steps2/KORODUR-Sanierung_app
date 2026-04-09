import type { Metadata } from "next";
import Link from "next/link";
import ReferenceCard from "../../../components/ReferenceCard";
import TileGrid from "../../../components/TileGrid";
import { getReferenzenByUnterkategorie } from "../../../data/referenzen";
import { getProduktByName } from "../../../data/produkte";
import { getDictionary, hasLocale } from "../dictionaries";
import { notFound } from "next/navigation";
import { localizeReferenzen } from "../../../data/i18n/getLocalized";

export default async function MicrotopPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  const baseRefs = getReferenzenByUnterkategorie("infrastruktur", "wasser");
  const refs = await localizeReferenzen(baseRefs, lang as "de" | "en" | "fr");
  const produkt = getProduktByName("MICROTOP TW");

  return (
    <>
      {/* Hero */}
      <section
        className="bg-[#002d59] text-white"
        style={{ padding: "64px 32px 72px" }}
      >
        <div className="mx-auto" style={{ maxWidth: 900 }}>
          <Link
            href={`/${lang}`}
            className="inline-flex items-center gap-1.5 text-[#009ee3] text-[13px] no-underline hover:underline mb-6"
            style={{ fontWeight: 700 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            {dict.microtop.back_to_main}
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "rgba(0,158,227,0.15)" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#009ee3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2c-4 6-8 9.5-8 13a8 8 0 1 0 16 0c0-3.5-4-7-8-13z" />
              </svg>
            </div>
            <h1
              className="text-white m-0"
              style={{ fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 900, lineHeight: 1.1 }}
            >
              {dict.microtop.title}
            </h1>
          </div>

          <p
            className="text-[#009ee3] text-[18px] m-0 mb-4"
            style={{ fontWeight: 700 }}
          >
            {dict.microtop.subtitle}
          </p>
          <p
            className="text-white opacity-80 m-0 leading-[1.65]"
            style={{ fontSize: 16, maxWidth: 700 }}
          >
            {dict.microtop.description}
          </p>
        </div>
      </section>

      {/* Produkt-Info */}
      {produkt && (
        <section style={{ padding: "56px 32px 48px" }}>
          <div className="mx-auto" style={{ maxWidth: 900 }}>
            <h2
              className="text-[#002d59] mb-6"
              style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 900, lineHeight: 1.12 }}
            >
              {dict.microtop.product_title}
            </h2>
            <div
              className="bg-white p-6 md:p-8"
              style={{
                borderRadius: 14,
                boxShadow: "0 8px 40px rgba(0,45,89,0.10)",
                borderLeft: "4px solid #009ee3",
              }}
            >
              <h3 className="text-[#002d59] text-[20px] m-0 mb-2" style={{ fontWeight: 900 }}>
                {produkt.name}
              </h3>
              <p className="text-[#002d59] opacity-60 text-[15px] m-0 mb-5 leading-[1.5]">
                {produkt.kurzbeschreibung}
              </p>

              {/* Technische Daten */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                {produkt.technischeDaten.map((td, i) => (
                  <div key={i} className="flex justify-between items-baseline gap-3 py-1.5" style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <span className="text-[#002d59] opacity-50 text-[13px]">{td.label}</span>
                    <span className="text-[#002d59] text-[13px]" style={{ fontWeight: 700 }}>{td.wert}</span>
                  </div>
                ))}
              </div>

              {/* Normen */}
              <div className="flex flex-wrap gap-2 mb-5">
                {produkt.normen.map((norm, i) => (
                  <span
                    key={i}
                    className="text-[11px] text-[#002d59] px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: "#f5f5f6", fontWeight: 600 }}
                  >
                    {norm}
                  </span>
                ))}
              </div>

              {/* Besonderheiten */}
              <ul className="m-0 pl-5" style={{ listStyleType: "none", padding: 0 }}>
                {produkt.besonderheiten.map((b, i) => (
                  <li
                    key={i}
                    className="text-[#002d59] text-[14px] leading-[1.6] flex items-start gap-2 mb-1.5"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#009ee3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    {b}
                  </li>
                ))}
              </ul>

              <div className="mt-5 pt-4" style={{ borderTop: "1px solid #e8edf5" }}>
                <Link
                  href={`/${lang}/produkte/${produkt.id}`}
                  className="inline-flex items-center gap-1.5 text-[#009ee3] text-[14px] no-underline hover:underline"
                  style={{ fontWeight: 700 }}
                >
                  {dict.microtop.product_cta}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Referenzen */}
      <section className="bg-[#f5f5f6]" style={{ padding: "56px 32px 72px" }}>
        <div className="mx-auto" style={{ maxWidth: 900 }}>
          <h2
            className="text-[#002d59] mb-8"
            style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 900, lineHeight: 1.12 }}
          >
            {dict.microtop.references_title}
          </h2>
          <TileGrid columns={refs.length >= 3 ? 3 : 2}>
            {refs.map((ref) => (
              <ReferenceCard key={ref.id} referenz={ref} lang={lang} />
            ))}
          </TileGrid>
        </div>
      </section>
    </>
  );
}
