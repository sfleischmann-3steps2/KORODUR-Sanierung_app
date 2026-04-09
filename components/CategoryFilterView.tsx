"use client";

import { useState, useMemo } from "react";
import ReferenceCard from "./ReferenceCard";
import { referenzen as alleReferenzen } from "../data/referenzen";
import { kategorien } from "../data/kategorien";
import { referenzenEN } from "../data/i18n/referenzen.en";
import { referenzenFR } from "../data/i18n/referenzen.fr";
import { referenzenPL } from "../data/i18n/referenzen.pl";
import type { Referenz } from "../data/types";
import type { Dictionary } from "../app/[lang]/dictionaries";

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

interface CategoryFilterViewProps {
  kategorieId: string;
  lang: string;
  dict: Dictionary;
}

export default function CategoryFilterView({ kategorieId, lang, dict }: CategoryFilterViewProps) {
  const [selectedSub, setSelectedSub] = useState("");

  const kategorie = kategorien.find((k) => k.id === kategorieId);
  const unterkategorien = kategorie?.unterkategorien ?? [];

  // Alle Referenzen dieser Kategorie, lokalisiert
  const alleKategorieRefs = useMemo(() => {
    return alleReferenzen
      .filter((r) => r.kategorie === kategorieId && r.unterkategorie !== "wasser")
      .map((r) => localizeRef(r, lang));
  }, [kategorieId, lang]);

  const gefilterteReferenzen = useMemo(() => {
    if (!selectedSub) return alleKategorieRefs;
    return alleKategorieRefs.filter((r) => r.unterkategorie === selectedSub);
  }, [selectedSub, alleKategorieRefs]);

  return (
    <>
      {/* Filter */}
      {unterkategorien.length > 1 && (
        <section
          className="bg-[#f5f5f6] sticky top-[64px] z-30"
          style={{ padding: "16px 16px", borderBottom: "1px solid #e8edf5" }}
        >
          <div className="mx-auto sm:px-4" style={{ maxWidth: 1320 }}>
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-3">
              <select
                value={selectedSub}
                onChange={(e) => setSelectedSub(e.target.value)}
                className="text-[14px] text-[#002d59] bg-white border border-[#d9dada] rounded-[8px] px-4 py-2.5 cursor-pointer outline-none focus:border-[#009ee3]"
                style={{ fontWeight: 700, fontFamily: "inherit" }}
              >
                <option value="">{dict.referenzen.filter_all_applications}</option>
                {unterkategorien.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.titel}
                  </option>
                ))}
              </select>

              {selectedSub && (
                <button
                  onClick={() => setSelectedSub("")}
                  className="text-[14px] text-[#009ee3] bg-transparent border-none cursor-pointer underline"
                  style={{ fontWeight: 700, fontFamily: "inherit" }}
                >
                  {dict.referenzen.filter_reset}
                </button>
              )}

              <span className="text-[13px] text-[#002d59] opacity-40 ml-auto" style={{ fontWeight: 700 }}>
                {gefilterteReferenzen.length} {dict.referenzen.of} {alleKategorieRefs.length} {dict.referenzen.references}
              </span>
            </div>
          </div>
        </section>
      )}

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
                onClick={() => setSelectedSub("")}
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
