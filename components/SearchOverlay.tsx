"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { referenzen } from "../data/referenzen";
import { produkte } from "../data/produkte";
import type { Dictionary } from "../app/[lang]/dictionaries";

interface SearchResult {
  type: "referenz" | "kategorie" | "produkt";
  title: string;
  subtitle: string;
  href: string;
}

export default function SearchOverlay({
  lang,
  dict,
  open,
  onClose,
}: {
  lang: string;
  dict: Dictionary;
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Build search index
  const allItems = useMemo<SearchResult[]>(() => {
    const items: SearchResult[] = [];

    // Neue Seiten
    items.push({
      type: "kategorie",
      title: "Lösungsfinder",
      subtitle: "In 5 Schritten zur passenden Sanierungslösung",
      href: `/${lang}/loesungsfinder/`,
    });
    items.push({
      type: "kategorie",
      title: "Produktmatrix",
      subtitle: "Alle Produkte und ihre Einsatzbereiche auf einen Blick",
      href: `/${lang}/produktmatrix/`,
    });

    // Referenzen
    referenzen.forEach((ref) => {
      items.push({
        type: "referenz",
        title: ref.titel,
        subtitle: `${ref.ort}, ${ref.land}`,
        href: `/${lang}/referenzen/${ref.slug}`,
      });
    });

    // Produkte
    produkte.forEach((prod) => {
      items.push({
        type: "produkt",
        title: prod.name,
        subtitle: prod.kurzbeschreibung.slice(0, 80),
        href: `/${lang}/produkte/${prod.id}`,
      });
    });

    return items;
  }, [lang, dict]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allItems
      .filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [query, allItems]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      navigateTo(results[selectedIndex]);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  const navigateTo = (result: SearchResult) => {
    onClose();
    if (result.href.startsWith("http")) {
      window.open(result.href, "_blank");
    } else {
      router.push(result.href);
    }
  };

  const typeLabels: Record<string, string> = {
    referenz: dict.common.reference_singular,
    kategorie: dict.portfolio.breadcrumb,
    produkt: dict.referenzen.filter_all_products.replace("Alle ", "").replace("All ", "").replace("Tous les ", ""),
  };

  const typeColors: Record<string, string> = {
    referenz: "#009ee3",
    kategorie: "#002d59",
    produkt: "#0090d0",
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center animate-overlay"
      style={{ paddingTop: "min(20vh, 160px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Search panel */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full mx-4 overflow-hidden animate-fade-in-up"
        style={{ maxWidth: 600 }}
      >
        {/* Input */}
        <div className="flex items-center gap-3 border-b border-[#e8edf5]" style={{ padding: "16px 20px" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#009ee3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={lang === "de" ? "Suchen..." : lang === "fr" ? "Rechercher..." : lang === "pl" ? "Szukaj..." : "Search..."}
            className="flex-1 text-[16px] text-[#002d59] bg-transparent border-none outline-none placeholder:text-[#002d59] placeholder:opacity-30"
            style={{ fontFamily: "inherit", fontWeight: 600 }}
          />
          <kbd className="hidden sm:inline-flex items-center text-[11px] text-[#002d59] opacity-30 px-2 py-0.5 rounded border border-[#e8edf5]" style={{ fontWeight: 600 }}>
            ESC
          </kbd>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="max-h-[400px] overflow-y-auto" style={{ padding: "8px" }}>
            {results.map((result, i) => (
              <button
                key={`${result.type}-${result.title}-${i}`}
                onClick={() => navigateTo(result)}
                onMouseEnter={() => setSelectedIndex(i)}
                className={`w-full flex items-center gap-3 text-left rounded-xl border-none cursor-pointer transition-colors duration-100 ${
                  i === selectedIndex ? "bg-[#f5f5f6]" : "bg-transparent hover:bg-[#f5f5f6]"
                }`}
                style={{ padding: "12px 16px", fontFamily: "inherit" }}
              >
                <span
                  className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded shrink-0"
                  style={{
                    backgroundColor: typeColors[result.type] + "15",
                    color: typeColors[result.type],
                    fontWeight: 700,
                  }}
                >
                  {typeLabels[result.type] || result.type}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[#002d59] text-[14px] truncate" style={{ fontWeight: 700 }}>
                    {result.title}
                  </div>
                  <div className="text-[#002d59] opacity-40 text-[12px] truncate">
                    {result.subtitle}
                  </div>
                </div>
                {result.href.startsWith("http") && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#002d59" strokeWidth="2" opacity="0.3" className="shrink-0">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Empty state */}
        {query.trim() && results.length === 0 && (
          <div className="text-center py-10 text-[#002d59] opacity-30 text-[14px]" style={{ fontWeight: 600 }}>
            {lang === "de" ? "Keine Ergebnisse" : lang === "fr" ? "Aucun résultat" : lang === "pl" ? "Brak wyników" : "No results"}
          </div>
        )}

        {/* Hint */}
        {!query.trim() && (
          <div className="text-center py-8 text-[#002d59] opacity-25 text-[13px]" style={{ fontWeight: 500 }}>
            {lang === "de"
              ? "Referenzen, Kategorien und Produkte durchsuchen"
              : lang === "fr"
              ? "Rechercher dans les références, catégories et produits"
              : lang === "pl"
              ? "Szukaj referencji, kategorii i produktów"
              : "Search references, categories and products"}
          </div>
        )}
      </div>
    </div>
  );
}
