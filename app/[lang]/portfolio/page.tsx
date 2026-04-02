import Breadcrumb from "../../../components/Breadcrumb";
import CategoryTile from "../../../components/CategoryTile";
import TileGrid from "../../../components/TileGrid";
import { kategorien } from "../../../data/kategorien";
import { getDictionary, hasLocale } from "../dictionaries";
import { notFound } from "next/navigation";

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <>
      <section style={{ padding: "0 32px" }}>
        <div className="mx-auto" style={{ maxWidth: 1320 }}>
          <Breadcrumb items={[{ label: dict.portfolio.breadcrumb }]} lang={lang} />
        </div>
      </section>

      <section style={{ padding: "40px 32px 100px" }}>
        <div className="mx-auto" style={{ maxWidth: 1320 }}>
          <h1
            className="uppercase mb-4"
            style={{
              fontSize: "clamp(30px, 5vw, 48px)",
              fontWeight: 900,
              lineHeight: 1.08,
            }}
          >
            {dict.portfolio.title}
          </h1>
          <p
            className="text-[#002d59] opacity-70 mb-12"
            style={{ fontSize: 18, lineHeight: 1.65, maxWidth: 700 }}
          >
            {dict.portfolio.description}
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
    </>
  );
}
