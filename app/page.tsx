import Link from "next/link";
import CategoryTile from "../components/CategoryTile";
import TileGrid from "../components/TileGrid";
import { kategorien } from "../data/kategorien";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#002d59] text-white" style={{ padding: "88px 32px 100px" }}>
        <div className="mx-auto" style={{ maxWidth: 1320 }}>
          <p className="text-[#009ee3] text-[14px] uppercase tracking-widest mb-4" style={{ fontWeight: 700 }}>
            Ihr Partner für Sanierung
          </p>
          <h1
            className="text-white uppercase leading-[1.08] mb-6"
            style={{
              fontSize: "clamp(30px, 5vw, 48px)",
              fontWeight: 900,
              maxWidth: 700,
            }}
          >
            Sanieren mit{" "}
            <span className="text-[#009ee3]">KORODUR</span>
          </h1>
          <p
            className="text-white opacity-80 mb-10 leading-[1.65]"
            style={{ fontSize: 18, maxWidth: 600 }}
          >
            Wir sind nicht nur Lieferant, sondern Sanierungspartner. Von der Analyse
            bis zur Nachbetreuung bieten wir Lösungen, die halten, was sie
            versprechen.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/portfolio"
              className="inline-block text-white no-underline rounded-[6px] bg-[#009ee3] hover:bg-[#0090d0] transition-colors duration-200"
              style={{ padding: "16px 30px", fontWeight: 800, fontSize: 15 }}
            >
              Zum Portfolio
            </Link>
            <Link
              href="/portfolio"
              className="inline-block text-white no-underline rounded-[6px] border-2 border-white hover:bg-white/10 transition-colors duration-200"
              style={{ padding: "14px 28px", fontWeight: 800, fontSize: 15 }}
            >
              Referenzen ansehen
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white" style={{ padding: "0 32px" }}>
        <div
          className="mx-auto grid grid-cols-1 sm:grid-cols-3 gap-0 -mt-8 relative z-10"
          style={{
            maxWidth: 900,
            borderRadius: 14,
            boxShadow: "0 8px 40px rgba(0,45,89,0.10)",
            overflow: "hidden",
          }}
        >
          {[
            { value: "90 Jahre", label: "Erfahrung" },
            { value: "750 Mio. m²", label: "verlegt weltweit" },
            { value: "100%", label: "Made in Germany" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white text-center py-8 px-6"
              style={i < 2 ? { borderRight: "1px solid #f5f5f6" } : {}}
            >
              <div className="text-[#009ee3] text-[28px] mb-1" style={{ fontWeight: 900 }}>
                {stat.value}
              </div>
              <div className="text-[#002d59] text-[14px] opacity-60" style={{ fontWeight: 700 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Warum Sanierung */}
      <section style={{ padding: "88px 32px 100px" }}>
        <div className="mx-auto" style={{ maxWidth: 1320 }}>
          <h2
            className="text-center mb-4"
            style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900, lineHeight: 1.12 }}
          >
            Warum Sanierung?
          </h2>
          <p className="text-center text-[#002d59] opacity-60 mb-12 mx-auto" style={{ maxWidth: 600, fontSize: 18 }}>
            Sanierung ist wirtschaftlicher, nachhaltiger und schneller als Neubau. KORODUR liefert die passende Lösung.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#009ee3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                ),
                title: "Minimale Ausfallzeiten",
                text: "Schnellaushärtende Systeme ermöglichen eine Wiedernutzung in Stunden statt Tagen.",
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#009ee3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                ),
                title: "Dauerhafte Ergebnisse",
                text: "Hochbelastbare Materialien für Schwerlastbereiche, Nassräume und extreme Bedingungen.",
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#009ee3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="M8 12l3 3 5-5" />
                  </svg>
                ),
                title: "Nachhaltig & Wirtschaftlich",
                text: "EPD-zertifizierte Produkte, Sanierung statt Abriss. Gut für Budget und Umwelt.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white p-8 flex flex-col items-start gap-4"
                style={{
                  borderRadius: 14,
                  boxShadow: "0 8px 40px rgba(0,45,89,0.10)",
                }}
              >
                <div
                  className="w-[52px] h-[52px] flex items-center justify-center"
                  style={{ borderRadius: "50%", backgroundColor: "#f5f5f6" }}
                >
                  {item.icon}
                </div>
                <h3 className="text-[#002d59] text-[18px] m-0" style={{ fontWeight: 900 }}>
                  {item.title}
                </h3>
                <p className="text-[#002d59] text-[15px] leading-[1.65] m-0 opacity-70">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Produktportfolio */}
      <section className="bg-[#f5f5f6]" style={{ padding: "88px 32px 100px" }}>
        <div className="mx-auto" style={{ maxWidth: 1320 }}>
          <h2
            className="text-center mb-4"
            style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900, lineHeight: 1.12 }}
          >
            Unser Produktportfolio
          </h2>
          <p className="text-center text-[#002d59] opacity-60 mb-12 mx-auto" style={{ maxWidth: 600, fontSize: 18 }}>
            Drei Bereiche, ein Anspruch: maximale Qualität bei minimaler Ausfallzeit.
          </p>
          <TileGrid columns={3}>
            {kategorien.map((kat) => (
              <CategoryTile
                key={kat.id}
                title={kat.titel}
                description={kat.beschreibung}
                icon={kat.icon}
                href={`/portfolio/${kat.id}`}
              />
            ))}
          </TileGrid>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#002d59] text-white text-center" style={{ padding: "72px 32px" }}>
        <div className="mx-auto" style={{ maxWidth: 700 }}>
          <h2 className="text-white mb-4" style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900 }}>
            Bereit für Ihre Sanierung?
          </h2>
          <p className="text-white opacity-70 mb-8" style={{ fontSize: 18, lineHeight: 1.65 }}>
            Kontaktieren Sie uns für eine individuelle Beratung oder stöbern Sie
            durch unsere Referenzen.
          </p>
          <Link
            href="/portfolio"
            className="inline-block text-white no-underline rounded-[6px] bg-[#009ee3] hover:bg-[#0090d0] transition-colors duration-200"
            style={{ padding: "16px 30px", fontWeight: 800, fontSize: 15 }}
          >
            Referenzen entdecken
          </Link>
        </div>
      </section>
    </>
  );
}
