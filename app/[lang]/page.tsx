import Link from "next/link";
import CategoryTile from "../../components/CategoryTile";
import TileGrid from "../../components/TileGrid";
import { kategorien } from "../../data/kategorien";
import { getDictionary, hasLocale } from "./dictionaries";
import { notFound } from "next/navigation";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <>
      {/* Hero */}
      <section className="bg-[#002d59] text-white" style={{ padding: "88px 32px 100px" }}>
        <div className="mx-auto" style={{ maxWidth: 1320 }}>
          <p className="text-[#009ee3] text-[14px] uppercase tracking-widest mb-4" style={{ fontWeight: 700 }}>
            {dict.home.tagline}
          </p>
          <h1
            className="text-white uppercase leading-[1.08] mb-6"
            style={{
              fontSize: "clamp(30px, 5vw, 48px)",
              fontWeight: 900,
              maxWidth: 700,
            }}
          >
            {dict.home.hero_title_prefix}{" "}
            <span className="text-[#009ee3]">{dict.home.hero_title_brand}</span>
          </h1>
          <p
            className="text-white opacity-80 mb-10 leading-[1.65]"
            style={{ fontSize: 18, maxWidth: 600 }}
          >
            {dict.home.hero_description}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href={`/${lang}/portfolio`}
              className="inline-block text-white no-underline rounded-[6px] bg-[#009ee3] hover:bg-[#0090d0] transition-colors duration-200"
              style={{ padding: "16px 30px", fontWeight: 800, fontSize: 15 }}
            >
              {dict.home.cta_portfolio}
            </Link>
            <Link
              href={`/${lang}/referenzen`}
              className="inline-block text-white no-underline rounded-[6px] border-2 border-white hover:bg-white/10 transition-colors duration-200"
              style={{ padding: "14px 28px", fontWeight: 800, fontSize: 15 }}
            >
              {dict.home.cta_referenzen}
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
            { value: "90 Jahre", label: dict.home.stat_experience },
            { value: "750 Mio. m²", label: dict.home.stat_area },
            { value: "100%", label: dict.home.stat_quality },
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
            {dict.home.why_title}
          </h2>
          <p className="text-center text-[#002d59] opacity-60 mb-12 mx-auto" style={{ maxWidth: 600, fontSize: 18 }}>
            {dict.home.why_subtitle}
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
                title: dict.home.why_card1_title,
                text: dict.home.why_card1_text,
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#009ee3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                ),
                title: dict.home.why_card2_title,
                text: dict.home.why_card2_text,
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#009ee3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="M8 12l3 3 5-5" />
                  </svg>
                ),
                title: dict.home.why_card3_title,
                text: dict.home.why_card3_text,
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
            {dict.home.portfolio_title}
          </h2>
          <p className="text-center text-[#002d59] opacity-60 mb-12 mx-auto" style={{ maxWidth: 600, fontSize: 18 }}>
            {dict.home.portfolio_subtitle}
          </p>
          <TileGrid columns={3}>
            {kategorien.map((kat) => (
              <CategoryTile
                key={kat.id}
                title={dict.categories[kat.id as keyof typeof dict.categories] || kat.titel}
                description={kat.beschreibung}
                icon={kat.icon}
                href={`/${lang}/portfolio/${kat.id}`}
                learnMoreLabel={dict.portfolio.learn_more}
              />
            ))}
          </TileGrid>
        </div>
      </section>

      {/* Interactive Tools */}
      <section style={{ padding: "88px 32px 100px" }}>
        <div className="mx-auto" style={{ maxWidth: 1320 }}>
          <h2
            className="text-center mb-4"
            style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900, lineHeight: 1.12 }}
          >
            {dict.home_interactive.title}
          </h2>
          <p className="text-center text-[#002d59] opacity-60 mb-12 mx-auto" style={{ maxWidth: 600, fontSize: 18 }}>
            {dict.home_interactive.subtitle}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto" style={{ maxWidth: 900 }}>
            {/* Wizard Card */}
            <Link
              href={`/${lang}/wizard`}
              className="no-underline group block"
            >
              <div
                className="bg-white p-8 flex flex-col items-start gap-4 transition-all duration-200 group-hover:-translate-y-1.5"
                style={{
                  borderRadius: 14,
                  boxShadow: "0 8px 40px rgba(0,45,89,0.10)",
                  borderTop: "4px solid #009ee3",
                }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: "rgba(0,158,227,0.08)" }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#009ee3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                </div>
                <h3 className="text-[#002d59] text-[22px] m-0" style={{ fontWeight: 900 }}>
                  {dict.home_interactive.wizard_title}
                </h3>
                <p className="text-[#002d59] text-[16px] leading-[1.65] m-0 opacity-70">
                  {dict.home_interactive.wizard_desc}
                </p>
                <span className="text-[#009ee3] text-[15px] font-bold flex items-center gap-1">
                  {dict.home_interactive.wizard_cta}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 3l5 5-5 5" />
                  </svg>
                </span>
              </div>
            </Link>

            {/* Konfigurator Card */}
            <Link
              href={`/${lang}/konfigurator`}
              className="no-underline group block"
            >
              <div
                className="bg-white p-8 flex flex-col items-start gap-4 transition-all duration-200 group-hover:-translate-y-1.5"
                style={{
                  borderRadius: 14,
                  boxShadow: "0 8px 40px rgba(0,45,89,0.10)",
                  borderTop: "4px solid #002d59",
                }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: "rgba(0,45,89,0.06)" }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#002d59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </div>
                <h3 className="text-[#002d59] text-[22px] m-0" style={{ fontWeight: 900 }}>
                  {dict.home_interactive.konfigurator_title}
                </h3>
                <p className="text-[#002d59] text-[16px] leading-[1.65] m-0 opacity-70">
                  {dict.home_interactive.konfigurator_desc}
                </p>
                <span className="text-[#002d59] text-[15px] font-bold flex items-center gap-1">
                  {dict.home_interactive.konfigurator_cta}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 3l5 5-5 5" />
                  </svg>
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#002d59] text-white text-center" style={{ padding: "72px 32px" }}>
        <div className="mx-auto" style={{ maxWidth: 700 }}>
          <h2 className="text-white mb-4" style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900 }}>
            {dict.home.cta_bottom_title}
          </h2>
          <p className="text-white opacity-70 mb-8" style={{ fontSize: 18, lineHeight: 1.65 }}>
            {dict.home.cta_bottom_text}
          </p>
          <Link
            href={`/${lang}/referenzen`}
            className="inline-block text-white no-underline rounded-[6px] bg-[#009ee3] hover:bg-[#0090d0] transition-colors duration-200"
            style={{ padding: "16px 30px", fontWeight: 800, fontSize: 15 }}
          >
            {dict.home.cta_bottom_button}
          </Link>
        </div>
      </section>
    </>
  );
}
