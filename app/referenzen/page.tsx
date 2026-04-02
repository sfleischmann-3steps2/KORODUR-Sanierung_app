"use client";

import { useState, useMemo } from "react";
import ReferenceCard from "../../components/ReferenceCard";
import Breadcrumb from "../../components/Breadcrumb";
import { referenzen } from "../../data/referenzen";
import { kategorien } from "../../data/kategorien";

type FilterState = {
  kategorie: string;
  unterkategorie: string;
  produkt: string;
};

export default function ReferenzenPage() {
  const [filters, setFilters] = useState<FilterState>({
    kategorie: "",
    unterkategorie: "",
    produkt: "",
  });

  // Collect all unique products
  const alleProdukte = useMemo(() => {
    const set = new Set<string>();
    referenzen.forEach((r) => r.produkte.forEach((p) => set.add(p)));
    return Array.from(set).sort();
  }, []);

  // Get available subcategories based on selected category
  const verfuegbareUnterkategorien = useMemo(() => {
    if (!filters.kategorie) return [];
    const kat = kategorien.find((k) => k.id === filters.kategorie);
    return kat?.unterkategorien ?? [];
  }, [filters.kategorie]);

  // Filter references
  const gefilterteReferenzen = useMemo(() => {
    return referenzen.filter((r) => {
      if (filters.kategorie && r.kategorie !== filters.kategorie) return false;
      if (filters.unterkategorie && r.unterkategorie !== filters.unterkategorie)
        return false;
      if (filters.produkt && !r.produkte.includes(filters.produkt))
        return false;
      return true;
    });
  }, [filters]);

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: value };
      // Reset subcategory when category changes
      if (key === "kategorie") {
        next.unterkategorie = "";
      }
      return next;
    });
  };

  const resetFilters = () => {
    setFilters({ kategorie: "", unterkategorie: "", produkt: "" });
  };

  const hasActiveFilters =
    filters.kategorie || filters.unterkategorie || filters.produkt;

  return (
    <>
      <section style={{ padding: "0 32px" }}>
        <div className="mx-auto" style={{ maxWidth: 1320 }}>
          <Breadcrumb items={[{ label: "Referenzen" }]} />
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
            Alle Referenzen
          </h1>
          <p
            className="text-[#002d59] opacity-60 mb-0"
            style={{ fontSize: 18, maxWidth: 600 }}
          >
            {referenzen.length} Projekte aus Industrieboden, Industriebau und
            Infrastruktur – filtern Sie nach Bereich, Anwendung oder Produkt.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section
        className="bg-[#f5f5f6] sticky top-[72px] z-30"
        style={{ padding: "20px 32px", borderBottom: "1px solid #e8edf5" }}
      >
        <div className="mx-auto" style={{ maxWidth: 1320 }}>
          <div className="flex flex-wrap items-center gap-3">
            {/* Kategorie */}
            <select
              value={filters.kategorie}
              onChange={(e) => updateFilter("kategorie", e.target.value)}
              className="text-[14px] text-[#002d59] bg-white border border-[#d9dada] rounded-[8px] px-4 py-2.5 cursor-pointer outline-none focus:border-[#009ee3]"
              style={{ fontWeight: 700, fontFamily: "inherit" }}
            >
              <option value="">Alle Bereiche</option>
              {kategorien.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.titel}
                </option>
              ))}
            </select>

            {/* Unterkategorie */}
            {verfuegbareUnterkategorien.length > 0 && (
              <select
                value={filters.unterkategorie}
                onChange={(e) =>
                  updateFilter("unterkategorie", e.target.value)
                }
                className="text-[14px] text-[#002d59] bg-white border border-[#d9dada] rounded-[8px] px-4 py-2.5 cursor-pointer outline-none focus:border-[#009ee3]"
                style={{ fontWeight: 700, fontFamily: "inherit" }}
              >
                <option value="">Alle Anwendungen</option>
                {verfuegbareUnterkategorien.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.titel}
                  </option>
                ))}
              </select>
            )}

            {/* Produkt */}
            <select
              value={filters.produkt}
              onChange={(e) => updateFilter("produkt", e.target.value)}
              className="text-[14px] text-[#002d59] bg-white border border-[#d9dada] rounded-[8px] px-4 py-2.5 cursor-pointer outline-none focus:border-[#009ee3]"
              style={{ fontWeight: 700, fontFamily: "inherit" }}
            >
              <option value="">Alle Produkte</option>
              {alleProdukte.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            {/* Reset */}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-[14px] text-[#009ee3] bg-transparent border-none cursor-pointer underline"
                style={{ fontWeight: 700, fontFamily: "inherit" }}
              >
                Filter zurücksetzen
              </button>
            )}

            {/* Count */}
            <span className="text-[13px] text-[#002d59] opacity-40 ml-auto" style={{ fontWeight: 700 }}>
              {gefilterteReferenzen.length} von {referenzen.length} Referenzen
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
                <ReferenceCard key={r.id} referenz={r} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-[#002d59] opacity-40 text-[18px] mb-4">
                Keine Referenzen für diese Filterauswahl gefunden.
              </p>
              <button
                onClick={resetFilters}
                className="text-white text-[15px] bg-[#009ee3] hover:bg-[#0090d0] border-none rounded-[6px] cursor-pointer transition-colors duration-200"
                style={{ padding: "14px 28px", fontWeight: 800, fontFamily: "inherit" }}
              >
                Alle Referenzen anzeigen
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
