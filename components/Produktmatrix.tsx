"use client";

import Link from "next/link";
import { produkte } from "@/data/produkte";
import type { Locale } from "@/lib/i18n";

const SPALTEN = [
  { id: "kleine-reparatur", label: "Kleine Reparatur" },
  { id: "grossflaechige-sanierung", label: "Großfl. Sanierung" },
  { id: "schwerlast", label: "Schwerlast" },
  { id: "leichte-nutzung", label: "Leichte Nutzung" },
  { id: "rollende-lasten", label: "Rollende Lasten" },
  { id: "punktlasten", label: "Punktlasten" },
  { id: "chemikalien", label: "Chemikalien" },
  { id: "tausalz", label: "Tausalz" },
  { id: "rutschhemmung", label: "Rutschhemmung" },
  { id: "kurze-sperrzeit", label: "Kurze Sperrzeit" },
  { id: "aussenbereich", label: "Außenbereich" },
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

  const grouped = KATEGORIEN
    .map((kat) => ({
      ...kat,
      produkte: filtered.filter((p) => p.kategorie === kat.id),
    }))
    .filter((g) => g.produkte.length > 0);

  let rowIndex = 0;

  return (
    <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: "touch" }}>
      <table style={{ borderCollapse: "collapse", width: "100%", tableLayout: "fixed", fontSize: 14 }}>
        <colgroup>
          {/* Produktname-Spalte: feste Breite */}
          <col style={{ width: 240 }} />
          {/* Kriterien-Spalten: gleichmäßig verteilt */}
          {SPALTEN.map((s) => (
            <col key={s.id} />
          ))}
        </colgroup>
        <thead>
          <tr>
            <th
              style={{
                position: "sticky",
                left: 0,
                zIndex: 2,
                background: "#fff",
                padding: "0 16px 16px 0",
                textAlign: "left",
                fontWeight: 900,
                color: "#002d59",
                fontSize: 14,
                borderBottom: "2px solid #002d59",
              }}
            >
              Produkt
            </th>
            {SPALTEN.map((s) => (
              <th
                key={s.id}
                style={{
                  padding: "0 4px 16px",
                  fontWeight: 700,
                  color: "#002d59",
                  fontSize: 12,
                  borderBottom: "2px solid #002d59",
                  verticalAlign: "bottom",
                  textAlign: "center",
                }}
              >
                <span
                  style={{
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                    display: "inline-block",
                    whiteSpace: "nowrap",
                    lineHeight: 1.3,
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
              const bgColor = currentRow % 2 === 0 ? "#ffffff" : "#f7f8fa";
              return (
                <tr key={p.id}>
                  <td
                    style={{
                      position: "sticky",
                      left: 0,
                      zIndex: 1,
                      background: bgColor,
                      padding: "14px 16px 14px 16px",
                      fontWeight: 700,
                      color: "#002d59",
                      fontSize: 14,
                      whiteSpace: "nowrap",
                      borderBottom: "1px solid #e8edf5",
                    }}
                  >
                    <Link
                      href={`/${lang}/produkte/${p.id}/`}
                      style={{ color: "#009ee3", textDecoration: "none" }}
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
                          padding: "14px 4px",
                          borderBottom: "1px solid #e8edf5",
                          background: bgColor,
                        }}
                      >
                        {match && (
                          <span
                            style={{
                              display: "inline-block",
                              width: 16,
                              height: 16,
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
              <tr key={`header-${gruppe.id}`}>
                <td
                  colSpan={SPALTEN.length + 1}
                  style={{
                    padding: "28px 0 10px 0",
                    fontWeight: 900,
                    fontSize: 16,
                    color: "#002d59",
                    borderBottom: "2px solid #e8edf5",
                    letterSpacing: "0.01em",
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
