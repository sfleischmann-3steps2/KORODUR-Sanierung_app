import Breadcrumb from "../../../../components/Breadcrumb";
import SubcategoryTile from "../../../../components/SubcategoryTile";
import ReferenceCard from "../../../../components/ReferenceCard";
import TileGrid from "../../../../components/TileGrid";
import { kategorien } from "../../../../data/kategorien";
import { getReferenzenByUnterkategorie } from "../../../../data/referenzen";
import { getDictionary, hasLocale } from "../../dictionaries";
import { notFound } from "next/navigation";

export default async function InfrastrukturPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const kategorie = kategorien.find((k) => k.id === "infrastruktur")!;
  const categoryLabel = dict.categories.infrastruktur;

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

      <section style={{ padding: "40px 32px 64px" }}>
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

      {kategorie.unterkategorien.map((sub) => {
        const refs = getReferenzenByUnterkategorie("infrastruktur", sub.id);
        return (
          <section
            key={sub.id}
            className="bg-[#f5f5f6]"
            style={{ padding: "64px 32px 80px" }}
            id={sub.id}
          >
            <div className="mx-auto" style={{ maxWidth: 1320 }}>
              <SubcategoryTile
                title={sub.titel}
                description={sub.beschreibung}
                count={refs.length}
                refSingular={dict.common.reference_singular}
                refPlural={dict.common.reference_plural}
              />
              <div className="mt-8">
                <TileGrid columns={refs.length >= 3 ? 3 : 2}>
                  {refs.map((ref) => (
                    <ReferenceCard key={ref.id} referenz={ref} lang={lang} />
                  ))}
                </TileGrid>
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
