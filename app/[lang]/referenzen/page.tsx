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
import type { Referenz, Massnahme } from "../../../data/types";

// Microtop/Wasser-Referenzen aus der Hauptliste ausschließen
const baseReferenzen = alleReferenzen.filter((r) => r.unterkategorie !== "wasser");

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

const massnahmeLabels: Record<Massnahme, string> = {
  "kleine-reparatur": "Kleine Reparatur",
  "grossflaechige-sanierung": "Großflächige Sanierung",
};

type FilterState = {
  anwendungsbereich: string;
  massnahme: string;
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
    anwendungsbereich: "",
    massnahme: "",
    produkt: initialProdukt,
  });

  // Lokalisierte Referenzen
  const referenzen = useMemo(
    () => baseReferenzen.map((r) => localizeRef(r, lang)),
    [lang]
  );

  const anwendungsbereiche = useMemo(
    () => [...new Set(referenzen.map((r) => r.anwendungsbereich))].sort(),
    [referenzen]
  );

  const produktNamen = useMemo(
    () => [...new Set(referenzen.flatMap((r) => r.produkte))].sort(),
    [referenzen]
  );

  const gefilterteReferenzen = useMemo(() => {
    return referenzen.filter((r) => {
      if (filters.anwendungsbereich && r.anwendungsbereich !== filters.anwendungsbereich) return false;
      if (filters.massnahme && r.massnahme !== filters.massnahme) return false;
      if (filters.produkt && !r.produkte.includes(filters.produkt)) return false;
      return true;
    });
  }, [filters, referenzen]);

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({ anwendungsbereich: "", massnahme: "", produkt: "" });
  };

  const hasActiveFilters =
    filters.anwendungsbereich || filters.massnahme || filters.produkt;

  return (
    <>
      <section style={{ padding: "0 32px" }}>
        <div className="mx-auto" style={{ maxWidth: 1320 }}>
          <Breadcrumb items={[{ label: dict.referenzen.breadcrumb }]} lang={lang} />
        </div>
      </section>

      {/* Header */}
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

      {/* Filters */}
      <section
        className="bg-[#f5f5f6] sticky top-0 z-30"
        style={{ padding: "16px 16px", borderBottom: "1px solid #e8edf5" }}
      >
        <div className="mx-auto sm:px-4" style={{ maxWidth: 1320 }}>
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-3">
            <select
              value={filters.anwendungsbereich}
              onChange={(e) => updateFilter("anwendungsbereich", e.target.value)}
              className="text-[14px] text-[#002d59] bg-white border border-[#d9dada] rounded-[8px] px-4 py-2.5 cursor-pointer outline-none focus:border-[#009ee3]"
              style={{ fontWeight: 700, fontFamily: "inherit" }}
            >
              <option value="">{dict.referenzen.filter_all_areas}</option>
              {anwendungsbereiche.map((ab) => (
                <option key={ab} value={ab}>
                  {ab.charAt(0).toUpperCase() + ab.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={filters.massnahme}
              onChange={(e) => updateFilter("massnahme", e.target.value)}
              className="text-[14px] text-[#002d59] bg-white border border-[#d9dada] rounded-[8px] px-4 py-2.5 cursor-pointer outline-none focus:border-[#009ee3]"
              style={{ fontWeight: 700, fontFamily: "inherit" }}
            >
              <option value="">Alle Maßnahmen</option>
              {(Object.keys(massnahmeLabels) as Massnahme[]).map((key) => (
                <option key={key} value={key}>
                  {massnahmeLabels[key]}
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

      {/* Results */}
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
