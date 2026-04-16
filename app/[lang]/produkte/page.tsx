import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "../../../components/Breadcrumb";
import { produkte } from "../../../data/produkte";
import { getDictionary, hasLocale } from "../dictionaries";
import { notFound } from "next/navigation";
import { localizeProdukte } from "../../../data/i18n/getLocalized";
import { withBasePath } from "../../../lib/basePath";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: dict.produkte.title, description: dict.produkte.subtitle };
}

const categoryOrder = ["estrich", "schnellzement", "grundierung", "beschichtung", "nachbehandlung", "sonstige"] as const;

export default async function ProduktePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const localizedProdukte = await localizeProdukte(produkte, lang as "de" | "en" | "fr");

  const grouped = categoryOrder
    .map((cat) => ({
      category: cat,
      label: (dict.produkte as Record<string, string>)[`category_${cat}`] || cat,
      items: localizedProdukte.filter((p) => p.kategorie === cat),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <>
      <section style={{ padding: "0 32px" }}>
        <div className="mx-auto" style={{ maxWidth: 1320 }}>
          <Breadcrumb items={[{ label: dict.produkte.breadcrumb }]} lang={lang} />
        </div>
      </section>

      <section style={{ padding: "0 32px 48px" }}>
        <div className="mx-auto" style={{ maxWidth: 1320 }}>
          <h1
            className="mb-3"
            style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 900, lineHeight: 1.1 }}
          >
            {dict.produkte.title}
          </h1>
          <p className="text-[#002d59] opacity-60 mb-0" style={{ fontSize: 18, maxWidth: 700 }}>
            {dict.produkte.subtitle}
          </p>
        </div>
      </section>

      {grouped.map((group) => (
        <section
          key={group.category}
          className="bg-[#f5f5f6]"
          style={{ padding: "56px 32px 64px" }}
          id={group.category}
        >
          <div className="mx-auto" style={{ maxWidth: 1320 }}>
            <h2
              className="mb-6"
              style={{ fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 900, lineHeight: 1.15 }}
            >
              {group.label}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {group.items.map((produkt) => (
                <Link
                  key={produkt.id}
                  href={`/${lang}/produkte/${produkt.id}`}
                  className="no-underline group block"
                >
                  <div
                    className="bg-white p-6 flex flex-row gap-5 h-full transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-lg"
                    style={{ borderRadius: 14, boxShadow: "0 4px 20px rgba(0,45,89,0.08)" }}
                  >
                    <div className="flex flex-col gap-3 flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-[#002d59] text-[17px] m-0" style={{ fontWeight: 900 }}>
                          {produkt.name}
                        </h3>
                        {produkt.qualitaetsklasse && (
                          <span
                            className="text-[10px] text-white uppercase tracking-wider px-2 py-0.5 rounded shrink-0"
                            style={{ backgroundColor: "#009ee3", fontWeight: 700 }}
                          >
                            {produkt.qualitaetsklasse}
                          </span>
                        )}
                      </div>
                      <p className="text-[#002d59] opacity-60 text-[14px] m-0 leading-[1.5]">
                        {produkt.kurzbeschreibung}
                      </p>
                      {produkt.schichtdicke && (
                        <p className="text-[#009ee3] text-[12px] m-0" style={{ fontWeight: 700 }}>
                          {dict.produkte.layer_thickness}: {produkt.schichtdicke}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                        {produkt.normen.slice(0, 2).map((norm) => (
                          <span
                            key={norm}
                            className="text-[10px] text-[#002d59] opacity-50 px-2 py-0.5 rounded"
                            style={{ backgroundColor: "#f5f5f6", fontWeight: 600 }}
                          >
                            {norm}
                          </span>
                        ))}
                        {produkt.normen.length > 2 && (
                          <span className="text-[10px] text-[#002d59] opacity-30 px-1 py-0.5">
                            +{produkt.normen.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                    {produkt.bild && (
                      <div className="shrink-0 flex items-center">
                        <Image
                          src={withBasePath(produkt.bild)}
                          alt={produkt.name}
                          width={90}
                          height={120}
                          className="object-contain"
                        />
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
