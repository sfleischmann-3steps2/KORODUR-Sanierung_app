"use client";

import Link from "next/link";
import { produkte } from "@/data/produkte";
import type { Locale } from "@/lib/i18n";

const SPALTEN = [
  { id: "kleine-reparatur", label: "Kleine Reparatur", gruppe: "Situation" },
  { id: "grossflaechige-sanierung", label: "Großfl. Sanierung", gruppe: "Situation" },
  { id: "schwerlast", label: "Schwerlast", gruppe: "Belastung" },
  { id: "leichte-nutzung", label: "Leichte Nutzung", gruppe: "Belastung" },
  { id: "rollende-lasten", label: "Rollende Lasten", gruppe: "Belastung" },
  { id: "punktlasten", label: "Punktlasten", gruppe: "Belastung" },
  { id: "chemikalien", label: "Chemikalien", gruppe: "Sonder" },
  { id: "tausalz", label: "Tausalz", gruppe: "Sonder" },
  { id: "rutschhemmung", label: "Rutschhemmung", gruppe: "Sonder" },
  { id: "kurze-sperrzeit", label: "Kurze Sperrzeit", gruppe: "Sonder" },
  { id: "aussenbereich", label: "Außenbereich", gruppe: "Sonder" },
] as const;

const KATEGORIEN = [
  { id: "estrich", label: "Estriche" },
  { id: "grundierung", label: "Grundierungen & Haftbrücken" },
  { id: "schnellzement", label: "Schnellzemente & Mörtel" },
  { id: "beschichtung", label: "Beschichtungen" },
  { id: "nachbehandlung", label: "Nachbehandlung" },
  { id: "sonstige", label: "Sonstige" },
] as const;

export default function Produktmatrix({ lang }: { lang: Locale }) {
  const filtered = produkte.filter(
    (p) => p.eignungen && p.eignungen.length > 0
  );

  // Gruppiere nach Kategorie
  const grouped = KATEGORIEN
    .map((kat) => ({
      ...kat,
      produkte: filtered.filter((p) => p.kategorie === kat.id),
    }))
    .filter((g) => g.produkte.length > 0);

  let rowIndex = 0;

  return (
    <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: "touch" }}>
      <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 14 }}>
        <thead>
          <tr>
            <th
              style={{
                position: "sticky",
                left: 0,
                zIndex: 2,
                background: "#fff",
                padding: "0 24px 12px 0",
                textAlign: "left",
                fontWeight: 900,
                color: "#002d59",
                fontSize: 13,
                minWidth: 220,
                borderBottom: "2px solid #002d59",
              }}
            >
              Produkt
            </th>
            {SPALTEN.map((s) => (
              <th
                key={s.id}
                style={{
                  padding: "0 8px 12px",
                  fontWeight: 700,
                  color: "#002d59",
                  fontSize: 11,
                  borderBottom: "2px solid #002d59",
                  verticalAlign: "bottom",
                  minWidth: 56,
                }}
              >
                <span
                  style={{
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                    display: "inline-block",
                    whiteSpace: "nowrap",
                    lineHeight: 1.2,
                  }}
                >
                  {s.label}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {grouped.map((gruppe) => {
            const rows = gruppe.produkte.map((p) => {
              const currentRow = rowIndex++;
              return (
                <tr
                  key={p.id}
                  style={{
                    backgroundColor: currentRow % 2 === 0 ? "#fff" : "rgba(245,245,246,0.45)",
                  }}
                >
                  <td
                    style={{
                      position: "sticky",
                      left: 0,
                      zIndex: 1,
                      background: currentRow % 2 === 0 ? "#fff" : "#f8f8f9",
                      padding: "12px 24px 12px 16px",
                      fontWeight: 700,
                      color: "#002d59",
                      fontSize: 13,
                      whiteSpace: "nowrap",
                      borderBottom: "1px solid #e8edf5",
                    }}
                  >
                    <Link
                      href={`/${lang}/produkte/${p.id}/`}
                      style={{
                        color: "#009ee3",
                        textDecoration: "none",
                      }}
                      className="hover:underline"
                    >
                      {p.name}
                    </Link>
                  </td>
                  {SPALTEN.map((s) => {
                    const match = p.eignungen?.includes(s.id as typeof p.eignungen[number]);
                    return (
                      <td
                        key={s.id}
                        style={{
                          textAlign: "center",
                          padding: "12px 8px",
                          borderBottom: "1px solid #e8edf5",
                        }}
                      >
                        {match && (
                          <span
                            style={{
                              display: "inline-block",
                              width: 14,
                              height: 14,
                              borderRadius: "50%",
                              backgroundColor: "#009ee3",
                            }}
                          />
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            });

            return [
              // Kategorie-Header
              <tr key={`header-${gruppe.id}`}>
                <td
                  colSpan={SPALTEN.length + 1}
                  style={{
                    padding: "20px 0 8px 0",
                    fontWeight: 900,
                    fontSize: 15,
                    color: "#002d59",
                    borderBottom: "1px solid #d9dada",
                    letterSpacing: "0.02em",
                  }}
                >
                  {gruppe.label}
                </td>
              </tr>,
              ...rows,
            ];
          })}
        </tbody>
      </table>
    </div>
  );
}
