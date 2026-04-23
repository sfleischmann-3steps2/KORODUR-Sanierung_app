"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ReferenceCard from "../../../components/ReferenceCard";
import Breadcrumb from "../../../components/Breadcrumb";
import { referenzen as alleReferenzen } from "../../../data/referenzen";
import { useLocale } from "../../../lib/LocaleContext";
import { referenzenEN } from "../../../data/i18n/referenzen.en";
import { referenzenFR } from "../../../data/i18n/referenzen.fr";
import { referenzenPL } from "../../../data/i18n/referenzen.pl";
import type {
  Referenz,
  Sanierungsart,
  EinsatzbereichKategorie,
  ZeitKategorie,
} from "../../../data/types";

const translationMap: Record<string, Record<string, Partial<Referenz>>> = {
  en: referenzenEN as Record<string, Partial<Referenz>>,
  fr: referenzenFR as Record<string, Partial<Referenz>>,
  pl: referenzenPL as Record<string, Partial<Referenz>>,
};

function localizeRef(ref: Referenz, lang: string): Referenz {
  if (lang === "de") return ref;
  const overrides = translationMap[lang]?.[ref.id];
  if (!overrides) return ref;
  return { ...ref, ...overrides };
}

const sanierungsartLabels: Record<Sanierungsart, string> = {
  punktuell: "Punktuelle Sanierung",
  grossflaechig: "Großflächige Sanierung",
};

const einsatzbereichLabels: Record<EinsatzbereichKategorie, string> = {
  "lager-logistik": "Lager & Logistik",
  "industrie-produktion": "Industrie & Produktion",
  "lebensmittel": "Lebensmittel",
  "flugzeug": "Flugzeug",
  "parkdeck": "Parkdeck",
  "infrastruktur-zufahrten": "Infrastruktur & Zufahrten",
  "verkaufsraeume": "Verkaufsräume",
  "schwerindustrie": "Schwerindustrie",
};

const dringlichkeitLabels: Record<ZeitKategorie, string> = {
  schnell: "Schnell",
  mittel: "Mittel",
  normal: "Normal",
};

type FilterState = {
  sanierungsart: string;
  einsatzbereich: string;
  dringlichkeit: string;
  produkt: string;
};

export default function ReferenzenPage() {
  return (
    <Suspense>
      <ReferenzenContent />
    </Suspense>
  );
}

function ReferenzenContent() {
  const { lang, dict } = useLocale();
  const searchParams = useSearchParams();
  const initialProdukt = searchParams.get("produkt") ?? "";

  const [filters, setFilters] = useState<FilterState>({
    sanierungsart: "",
    einsatzbereich: "",
    dringlichkeit: "",
    produkt: initialProdukt,
  });

  const referenzen = useMemo(
    () => alleReferenzen.map((r) => localizeRef(r, lang)),
    [lang]
  );

  const vorhandeneEinsatzbereiche = useMemo(
    () => [...new Set(referenzen.flatMap((r) => r.einsatzbereiche))].sort(),
    [referenzen]
  );

  const produktNamen = useMemo(
    () => [...new Set(referenzen.flatMap((r) => r.produkte))].sort(),
    [referenzen]
  );

  const gefilterteReferenzen = useMemo(() => {
    return referenzen.filter((r) => {
      if (filters.sanierungsart && r.sanierungsart !== filters.sanierungsart) return false;
      if (
        filters.einsatzbereich &&
        !r.einsatzbereiche.includes(filters.einsatzbereich as EinsatzbereichKategorie)
      )
        return false;
      if (filters.dringlichkeit && r.zeitDringlichkeit !== filters.dringlichkeit) return false;
      if (filters.produkt && !r.produkte.includes(filters.produkt)) return false;
      return true;
    });
  }, [filters, referenzen]);

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({ sanierungsart: "", einsatzbereich: "", dringlichkeit: "", produkt: "" });
  };

  const hasActiveFilters =
    filters.sanierungsart || filters.einsatzbereich || filters.dringlichkeit || filters.produkt;

  return (
    <>
      <section style={{ padding: "0 32px" }}>
        <div className="mx-auto" style={{ maxWidth: 1320 }}>
          <Breadcrumb items={[{ label: dict.referenzen.breadcrumb }]} lang={lang} />
        </div>
      </section>

      <section style={{ padding: "0 32px 48px" }}>
        <div className="mx-auto" style={{ maxWidth: 1320 }}>
          <h1
            className="mb-3"
            style={{
              fontSize: "clamp(28px, 5vw, 44px)",
              fontWeight: 900,
              lineHeight: 1.1,
            }}
          >
            {dict.referenzen.title}
          </h1>
          <p
            className="text-[#002d59] opacity-60 mb-0"
            style={{ fontSize: 18, maxWidth: 600 }}
          >
            {referenzen.length} {dict.referenzen.description_prefix}
          </p>
        </div>
      </section>

      <section
        className="bg-[#f5f5f6] sticky top-0 z-30"
        style={{ padding: "16px 16px", borderBottom: "1px solid #e8edf5" }}
      >
        <div className="mx-auto sm:px-4" style={{ maxWidth: 1320 }}>
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-3">
            <select
              value={filters.sanierungsart}
              onChange={(e) => updateFilter("sanierungsart", e.target.value)}
              className="text-[14px] text-[#002d59] bg-white border border-[#d9dada] rounded-[8px] px-4 py-2.5 cursor-pointer outline-none focus:border-[#009ee3]"
              style={{ fontWeight: 700, fontFamily: "inherit" }}
            >
              <option value="">Alle Sanierungsarten</option>
              {(Object.keys(sanierungsartLabels) as Sanierungsart[]).map((key) => (
                <option key={key} value={key}>
                  {sanierungsartLabels[key]}
                </option>
              ))}
            </select>

            <select
              value={filters.einsatzbereich}
              onChange={(e) => updateFilter("einsatzbereich", e.target.value)}
              className="text-[14px] text-[#002d59] bg-white border border-[#d9dada] rounded-[8px] px-4 py-2.5 cursor-pointer outline-none focus:border-[#009ee3]"
              style={{ fontWeight: 700, fontFamily: "inherit" }}
            >
              <option value="">{dict.referenzen.filter_all_areas}</option>
              {vorhandeneEinsatzbereiche.map((key) => (
                <option key={key} value={key}>
                  {einsatzbereichLabels[key]}
                </option>
              ))}
            </select>

            <select
              value={filters.dringlichkeit}
              onChange={(e) => updateFilter("dringlichkeit", e.target.value)}
              className="text-[14px] text-[#002d59] bg-white border border-[#d9dada] rounded-[8px] px-4 py-2.5 cursor-pointer outline-none focus:border-[#009ee3]"
              style={{ fontWeight: 700, fontFamily: "inherit" }}
            >
              <option value="">Alle Dringlichkeiten</option>
              {(Object.keys(dringlichkeitLabels) as ZeitKategorie[]).map((key) => (
                <option key={key} value={key}>
                  {dringlichkeitLabels[key]}
                </option>
              ))}
            </select>

            <select
              value={filters.produkt}
              onChange={(e) => updateFilter("produkt", e.target.value)}
              className="text-[14px] text-[#002d59] bg-white border border-[#d9dada] rounded-[8px] px-4 py-2.5 cursor-pointer outline-none focus:border-[#009ee3]"
              style={{ fontWeight: 700, fontFamily: "inherit" }}
            >
              <option value="">{dict.referenzen.filter_all_products}</option>
              {produktNamen.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-[14px] text-[#009ee3] bg-transparent border-none cursor-pointer underline"
                style={{ fontWeight: 700, fontFamily: "inherit" }}
              >
                {dict.referenzen.filter_reset}
              </button>
            )}

            <span className="text-[13px] text-[#002d59] opacity-40 ml-auto" style={{ fontWeight: 700 }}>
              {gefilterteReferenzen.length} {dict.referenzen.of} {referenzen.length} {dict.referenzen.references}
            </span>
          </div>
        </div>
      </section>

      <section style={{ padding: "48px 32px 88px" }}>
        <div className="mx-auto" style={{ maxWidth: 1320 }}>
          {gefilterteReferenzen.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gefilterteReferenzen.map((r) => (
                <ReferenceCard key={r.id} referenz={r} lang={lang} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-[#002d59] opacity-40 text-[18px] mb-4">
                {dict.referenzen.no_results}
              </p>
              <button
                onClick={resetFilters}
                className="text-white text-[15px] bg-[#009ee3] hover:bg-[#0090d0] border-none rounded-[6px] cursor-pointer transition-colors duration-200"
                style={{ padding: "14px 28px", fontWeight: 800, fontFamily: "inherit" }}
              >
                {dict.referenzen.show_all}
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
