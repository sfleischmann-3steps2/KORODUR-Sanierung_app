"use client";

import Link from "next/link";
import ReferenceCard from "./ReferenceCard";
import TileGrid from "./TileGrid";
import { getProduktByName } from "../data/produkte";
import { referenzen } from "../data/referenzen";
import type { Kategorie, Unterkategorie } from "../data/types";
import type { Dictionary } from "../app/[lang]/dictionaries";

interface ResultsPanelProps {
  produktNames: string[];
  kategorie?: Kategorie;
  unterkategorie?: Unterkategorie;
  lang: string;
  dict: Dictionary;
  maxRefs?: number;
}

export default function ResultsPanel({
  produktNames,
  kategorie,
  unterkategorie,
  lang,
  dict,
  maxRefs = 6,
}: ResultsPanelProps) {
  const produktDetails = produktNames
    .map((name) => getProduktByName(name))
    .filter((p) => p !== undefined);

  // Find matching references
  const matchingRefs = referenzen
    .filter((r) => {
      if (kategorie && r.kategorie !== kategorie) return false;
      if (unterkategorie && r.unterkategorie !== unterkategorie) return false;
      return true;
    })
    .slice(0, maxRefs);

  return (
    <div className="space-y-10">
      {/* Products */}
      <div>
        <h3
          className="text-[#002d59] mb-5"
          style={{ fontSize: "clamp(18px, 3vw, 24px)", fontWeight: 900 }}
        >
          {dict.wizard.recommended_products}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {produktDetails.map((produkt, i) => (
            <div
              key={produkt.id}
              className="bg-white overflow-hidden"
              style={{
                borderRadius: 14,
                boxShadow: "0 8px 40px rgba(0,45,89,0.10)",
                borderLeft: i === 0 ? "4px solid #009ee3" : "4px solid #e8edf5",
              }}
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h4 className="text-[#002d59] text-[16px] m-0" style={{ fontWeight: 900 }}>
                    {produkt.name}
                  </h4>
                  {i === 0 && (
                    <span
                      className="text-[10px] text-white uppercase tracking-wider px-2 py-0.5 rounded shrink-0"
                      style={{ backgroundColor: "#009ee3", fontWeight: 700 }}
                    >
                      TOP
                    </span>
                  )}
                </div>
                <p className="text-[#002d59] opacity-60 text-[13px] m-0 leading-[1.5] mb-3">
                  {produkt.kurzbeschreibung}
                </p>
                {produkt.schichtdicke && (
                  <p className="text-[#009ee3] text-[12px] m-0 mb-2" style={{ fontWeight: 700 }}>
                    Schichtdicke: {produkt.schichtdicke}
                  </p>
                )}
                {/* Key specs */}
                <div className="flex flex-col gap-1.5">
                  {produkt.technischeDaten.slice(0, 3).map((td, j) => (
                    <div key={j} className="flex justify-between items-baseline gap-3">
                      <span className="text-[#002d59] opacity-50 text-[12px]">{td.label}</span>
                      <span className="text-[#002d59] text-[12px]" style={{ fontWeight: 700 }}>{td.wert}</span>
                    </div>
                  ))}
                </div>
                {/* Link */}
                <div className="mt-3 pt-3" style={{ borderTop: "1px solid #e8edf5" }}>
                  <a
                    href={`https://korodur.de/?s=${encodeURIComponent(produkt.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#009ee3] text-[12px] no-underline hover:underline"
                    style={{ fontWeight: 700 }}
                  >
                    {dict.detail.view_on_website}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Matching References */}
      {matchingRefs.length > 0 && (
        <div>
          <h3
            className="text-[#002d59] mb-5"
            style={{ fontSize: "clamp(18px, 3vw, 24px)", fontWeight: 900 }}
          >
            {dict.wizard.matching_references}
          </h3>
          <TileGrid columns={matchingRefs.length >= 3 ? 3 : 2}>
            {matchingRefs.map((r) => (
              <ReferenceCard key={r.id} referenz={r} lang={lang} />
            ))}
          </TileGrid>
        </div>
      )}
    </div>
  );
}
