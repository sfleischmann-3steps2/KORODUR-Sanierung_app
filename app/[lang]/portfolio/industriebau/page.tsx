import type { Metadata } from "next";
import Breadcrumb from "../../../../components/Breadcrumb";
import CategoryFilterView from "../../../../components/CategoryFilterView";
import { kategorien } from "../../../../data/kategorien";
import { getDictionary, hasLocale } from "../../dictionaries";
import { notFound } from "next/navigation";
import { localizeKategorie } from "../../../../data/i18n/getLocalized";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: dict.categories.industriebau, description: kategorien.find((k) => k.id === "industriebau")!.beschreibung };
}

export default async function IndustriebauPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const baseKategorie = kategorien.find((k) => k.id === "industriebau")!;
  const kategorie = await localizeKategorie(baseKategorie, lang as "de" | "en" | "fr" | "pl");
  const categoryLabel = dict.categories.industriebau;

  return (
    <>
      <section style={{ padding: "0 32px" }}>
        <div className="mx-auto" style={{ maxWidth: 1320 }}>
          <Breadcrumb
            items={[
              { label: dict.portfolio.breadcrumb, href: `/${lang}/portfolio` },
              { label: categoryLabel },
            ]}
            lang={lang}
          />
        </div>
      </section>

      <section style={{ padding: "40px 32px 0" }}>
        <div className="mx-auto" style={{ maxWidth: 1320 }}>
          <h1
            className="uppercase mb-4"
            style={{
              fontSize: "clamp(30px, 5vw, 48px)",
              fontWeight: 900,
              lineHeight: 1.08,
            }}
          >
            {categoryLabel}
          </h1>
          <p
            className="text-[#002d59] opacity-70 mb-8"
            style={{ fontSize: 18, lineHeight: 1.65, maxWidth: 700 }}
          >
            {kategorie.beschreibung}
          </p>
        </div>
      </section>

      <CategoryFilterView kategorieId="industriebau" lang={lang} dict={dict} />
    </>
  );
}
