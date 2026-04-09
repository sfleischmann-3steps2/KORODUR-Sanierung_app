import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import CategoryTile from "../../components/CategoryTile";
import ReferenceCard from "../../components/ReferenceCard";
import TileGrid from "../../components/TileGrid";
import { kategorien } from "../../data/kategorien";
import { getReferenzBySlug } from "../../data/referenzen";
import { getDictionary, hasLocale } from "./dictionaries";
import { notFound } from "next/navigation";
import { withBasePath } from "../../lib/basePath";
import { localizeKategorien, localizeReferenzen } from "../../data/i18n/getLocalized";

const FEATURED_SLUGS = [
  "kleemann-produktionshalle",
  "guben-produktionshalle",
  "antolin-wochenend-sanierung",
];

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.home.hero_title_prefix + " " + dict.home.hero_title_brand,
    description: dict.home.hero_description,
    openGraph: {
      title: dict.home.hero_title_prefix + " " + dict.home.hero_title_brand,
      description: dict.home.hero_description,
      images: [withBasePath("/images/hero.jpg")],
    },
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const localizedKategorien = await localizeKategorien(kategorien, lang as "de" | "en" | "fr");

  // Featured references
  const baseRefs = FEATURED_SLUGS
    .map((slug) => getReferenzBySlug(slug))
    .filter((r): r is NonNullable<typeof r> => r !== undefined);
  const featuredRefs = await localizeReferenzen(baseRefs, lang as "de" | "en" | "fr");

  return (
    <>
      {/* Hero */}
      <section className="relative text-white overflow-hidden" style={{ minHeight: 480 }}>
        <Image
          src={withBasePath("/images/hero.jpg")}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#002d59]/80" />

        <div className="relative mx-auto" style={{ maxWidth: 1320, padding: "88px 32px 100px" }}>
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
              href={`/${lang}/sanierung-finden`}
              className="inline-block text-white no-underline rounded-[6px] bg-[#009ee3] hover:bg-[#0090d0] transition-colors duration-200"
              style={{ padding: "16px 30px", fontWeight: 800, fontSize: 15 }}
            >
              {dict.home.cta_sanierung}
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
      <section className="bg-white" style={{ padding: "0 16px" }}>
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
              className={`bg-white text-center py-8 px-6 ${i < 2 ? "sm:border-r sm:border-[#f5f5f6]" : ""}`}
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

      {/* Referenz-Highlights */}
      {featuredRefs.length > 0 && (
        <section className="bg-[#f5f5f6]" style={{ padding: "88px 32px 100px" }}>
          <div className="mx-auto" style={{ maxWidth: 1320 }}>
            <h2
              className="text-center mb-4"
              style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900, lineHeight: 1.12 }}
            >
              {dict.home.featured_refs_title}
            </h2>
            <p className="text-center text-[#002d59] opacity-60 mb-12 mx-auto" style={{ maxWidth: 600, fontSize: 18 }}>
              {dict.home.featured_refs_subtitle}
            </p>
            <TileGrid columns={3}>
              {featuredRefs.map((ref) => (
                <ReferenceCard key={ref.id} referenz={ref} lang={lang} />
              ))}
            </TileGrid>
            <div className="text-center mt-10">
              <Link
                href={`/${lang}/referenzen`}
                className="inline-flex items-center gap-2 text-[#009ee3] text-[15px] no-underline hover:underline"
                style={{ fontWeight: 700 }}
              >
                {dict.home.featured_refs_cta}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Produktportfolio */}
      <section style={{ padding: "88px 32px 100px" }}>
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
            {localizedKategorien.map((kat) => (
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

      {/* Sanierung finden CTA */}
      <section className="bg-[#002d59] text-white text-center" style={{ padding: "72px 32px" }}>
        <div className="mx-auto" style={{ maxWidth: 700 }}>
          <h2 className="text-white mb-4" style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900 }}>
            {dict.home.cta_bottom_title}
          </h2>
          <p className="text-white opacity-70 mb-8" style={{ fontSize: 18, lineHeight: 1.65 }}>
            {dict.home.cta_bottom_text}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={`/${lang}/sanierung-finden`}
              className="inline-block text-white no-underline rounded-[6px] bg-[#009ee3] hover:bg-[#0090d0] transition-colors duration-200"
              style={{ padding: "16px 30px", fontWeight: 800, fontSize: 15 }}
            >
              {dict.home.cta_sanierung}
            </Link>
            <Link
              href={`/${lang}/referenzen`}
              className="inline-block text-white no-underline rounded-[6px] border-2 border-white/40 hover:bg-white/10 transition-colors duration-200"
              style={{ padding: "14px 28px", fontWeight: 800, fontSize: 15 }}
            >
              {dict.home.cta_bottom_button}
            </Link>
          </div>
        </div>
      </section>

      {/* Microtop Footer CTA */}
      <section className="bg-[#f5f5f6]" style={{ padding: "48px 32px" }}>
        <div
          className="mx-auto flex flex-col sm:flex-row items-center gap-6"
          style={{ maxWidth: 900 }}
        >
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: "rgba(0,158,227,0.08)" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#009ee3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2c-4 6-8 9.5-8 13a8 8 0 1 0 16 0c0-3.5-4-7-8-13z" />
            </svg>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-[#002d59] text-[17px] m-0 mb-1" style={{ fontWeight: 800 }}>
              {dict.home.microtop_cta_title}
            </h3>
            <p className="text-[#002d59] opacity-60 text-[14px] m-0 leading-[1.5]">
              {dict.home.microtop_cta_text}
            </p>
          </div>
          <Link
            href={`/${lang}/microtop`}
            className="inline-flex items-center gap-1.5 text-[#009ee3] text-[14px] no-underline hover:underline shrink-0"
            style={{ fontWeight: 700 }}
          >
            {dict.home.microtop_cta_button}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
