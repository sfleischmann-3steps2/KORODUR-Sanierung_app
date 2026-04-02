import Link from "next/link";
import Breadcrumb from "../../../components/Breadcrumb";
import ReferenceCard from "../../../components/ReferenceCard";
import TileGrid from "../../../components/TileGrid";
import { referenzen, getReferenzBySlug } from "../../../data/referenzen";
import { kategorien } from "../../../data/kategorien";
import { getProdukteByNames } from "../../../data/produkte";
import { withBasePath } from "../../../lib/basePath";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return referenzen.map((r) => ({ slug: r.slug }));
}

function getKategorieLabel(id: string) {
  const kat = kategorien.find((k) => k.id === id);
  return kat ? kat.titel : id;
}

export default async function ReferenzDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const referenz = getReferenzBySlug(slug);

  if (!referenz) {
    notFound();
  }

  const kategorieLabel = getKategorieLabel(referenz.kategorie);
  const produktDetails = getProdukteByNames(referenz.produkte);

  const related = referenzen
    .filter((r) => r.kategorie === referenz.kategorie && r.slug !== referenz.slug)
    .slice(0, 3);

  return (
    <>
      <section style={{ padding: "0 32px" }}>
        <div className="mx-auto" style={{ maxWidth: 1320 }}>
          <Breadcrumb
            items={[
              { label: "Portfolio", href: "/portfolio" },
              { label: kategorieLabel, href: `/portfolio/${referenz.kategorie}` },
              { label: referenz.titel },
            ]}
          />
        </div>
      </section>

      {/* Hero image */}
      <section style={{ padding: "0 32px 48px" }}>
        <div className="mx-auto" style={{ maxWidth: 1320 }}>
          <div
            className="overflow-hidden w-full"
            style={{ borderRadius: 14, aspectRatio: "21/9" }}
          >
            <img
              src={withBasePath(referenz.bild)}
              alt={referenz.bildAlt}
              className="w-full h-full object-cover"
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

          {/* Location & area badges */}
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
                Herausforderungen
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
                Unsere Lösung
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
            Vorteile
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

      {/* Eingesetzte Produkte – mit technischen Daten */}
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
            Eingesetzte Produkte
          </h2>
          <p className="text-white opacity-50 mb-10" style={{ fontSize: 16 }}>
            Technische Daten und Normen der verwendeten KORODUR-Produkte
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {produktDetails.map((produkt) => (
              <div
                key={produkt.id}
                className="bg-white/10 backdrop-blur-sm overflow-hidden"
                style={{ borderRadius: 14, border: "1px solid rgba(255,255,255,0.10)" }}
              >
                {/* Produkt-Header */}
                <div
                  className="p-6 pb-4"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-white text-[18px] m-0" style={{ fontWeight: 900 }}>
                      {produkt.name}
                    </h3>
                    {produkt.qualitaetsklasse && (
                      <span
                        className="text-[10px] text-[#009ee3] uppercase tracking-wider px-2.5 py-1 rounded-[4px] whitespace-nowrap"
                        style={{ backgroundColor: "rgba(0,158,227,0.15)", fontWeight: 700 }}
                      >
                        {produkt.qualitaetsklasse}
                      </span>
                    )}
                  </div>
                  <p className="text-white opacity-60 text-[14px] m-0 leading-[1.5]">
                    {produkt.kurzbeschreibung}
                  </p>
                  {produkt.schichtdicke && (
                    <p className="text-[#009ee3] text-[13px] mt-2 m-0" style={{ fontWeight: 700 }}>
                      Schichtdicke: {produkt.schichtdicke}
                    </p>
                  )}
                </div>

                {/* Technische Daten */}
                <div className="p-6 pt-4">
                  <p className="text-white opacity-40 text-[11px] uppercase tracking-wider mb-3" style={{ fontWeight: 700 }}>
                    Technische Daten
                  </p>
                  <div className="flex flex-col gap-2">
                    {produkt.technischeDaten.slice(0, 5).map((td, i) => (
                      <div key={i} className="flex justify-between items-baseline gap-4">
                        <span className="text-white opacity-60 text-[13px]">{td.label}</span>
                        <span className="text-white text-[13px] text-right" style={{ fontWeight: 700 }}>
                          {td.wert}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Normen */}
                  {produkt.normen.length > 0 && (
                    <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                      <p className="text-white opacity-40 text-[11px] uppercase tracking-wider mb-2" style={{ fontWeight: 700 }}>
                        Normen & Zulassungen
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {produkt.normen.map((norm) => (
                          <span
                            key={norm}
                            className="text-[11px] text-white opacity-70 px-2.5 py-1 rounded-[4px]"
                            style={{ backgroundColor: "rgba(255,255,255,0.08)", fontWeight: 600 }}
                          >
                            {norm}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Link to korodur.de */}
                  <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                    <a
                      href={`https://korodur.de/?s=${encodeURIComponent(produkt.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[#009ee3] text-[13px] no-underline hover:underline"
                      style={{ fontWeight: 700 }}
                    >
                      Auf korodur.de ansehen
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Fallback: Produkte ohne Detaildaten */}
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
              Weitere Referenzen
            </h2>
            <TileGrid columns={3}>
              {related.map((r) => (
                <ReferenceCard key={r.id} referenz={r} />
              ))}
            </TileGrid>
            <div className="text-center mt-10">
              <Link
                href={`/portfolio/${referenz.kategorie}`}
                className="inline-block text-white no-underline rounded-[6px] bg-[#009ee3] hover:bg-[#0090d0] transition-colors duration-200"
                style={{ padding: "14px 28px", fontWeight: 800, fontSize: 15 }}
              >
                Alle {kategorieLabel}-Referenzen
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
