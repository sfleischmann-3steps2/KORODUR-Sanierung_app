import Link from "next/link";
import Breadcrumb from "../../../components/Breadcrumb";
import ReferenceCard from "../../../components/ReferenceCard";
import TileGrid from "../../../components/TileGrid";
import { referenzen, getReferenzBySlug } from "../../../data/referenzen";
import { kategorien } from "../../../data/kategorien";
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

  // Related references: same category, different slug, max 3
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

      {/* Herausforderungen */}
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

            {/* Loesung */}
            <div>
              <h2
                className="mb-6"
                style={{
                  fontSize: "clamp(22px, 3vw, 32px)",
                  fontWeight: 900,
                  lineHeight: 1.15,
                }}
              >
                Unsere Loesung
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

      {/* Produkte */}
      <section className="bg-[#f5f5f6]" style={{ padding: "48px 32px 56px" }}>
        <div className="mx-auto" style={{ maxWidth: 1320 }}>
          <h3
            className="mb-5"
            style={{ fontSize: 20, fontWeight: 900 }}
          >
            Eingesetzte Produkte
          </h3>
          <div className="flex flex-wrap gap-3">
            {referenz.produkte.map((p) => (
              <span
                key={p}
                className="text-[14px] text-[#002d59] px-5 py-2.5 rounded-[8px] bg-white"
                style={{ fontWeight: 700, boxShadow: "0 2px 8px rgba(0,45,89,0.06)" }}
              >
                {p}
              </span>
            ))}
          </div>
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
