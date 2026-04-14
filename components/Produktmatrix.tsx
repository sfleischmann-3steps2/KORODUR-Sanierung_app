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

export default function Produktmatrix({ lang }: { lang: Locale }) {
  const filtered = produkte.filter(
    (p) => p.eignungen && p.eignungen.length > 0
  );

  return (
    <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: "touch" }}>
      <table
        style={{
          borderCollapse: "collapse",
          minWidth: 800,
          width: "100%",
          fontSize: 14,
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                position: "sticky",
                left: 0,
                zIndex: 2,
                background: "#fff",
                padding: "0 16px 12px 0",
                textAlign: "left",
                fontWeight: 900,
                color: "#002d59",
                fontSize: 13,
                minWidth: 180,
                borderBottom: "2px solid #e5e5e5",
              }}
            >
              Produkt
            </th>
            {SPALTEN.map((s) => (
              <th
                key={s.id}
                style={{
                  padding: "0 4px 12px",
                  fontWeight: 700,
                  color: "#002d59",
                  fontSize: 11,
                  borderBottom: "2px solid #e5e5e5",
                  verticalAlign: "bottom",
                  width: 48,
                  minWidth: 48,
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
          {filtered.map((p, i) => (
            <tr
              key={p.id}
              style={{
                backgroundColor: i % 2 === 0 ? "#fff" : "#f5f5f6",
              }}
            >
              <td
                style={{
                  position: "sticky",
                  left: 0,
                  zIndex: 1,
                  background: i % 2 === 0 ? "#fff" : "#f5f5f6",
                  padding: "10px 16px 10px 0",
                  fontWeight: 700,
                  color: "#002d59",
                  fontSize: 13,
                  whiteSpace: "nowrap",
                  borderBottom: "1px solid #e5e5e5",
                }}
              >
                <Link
                  href={`/${lang}/produkte/${p.id}/`}
                  style={{
                    color: "#002d59",
                    textDecoration: "none",
                    borderBottom: "1px solid #009ee3",
                    paddingBottom: 1,
                  }}
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
                      padding: "10px 4px",
                      borderBottom: "1px solid #e5e5e5",
                    }}
                  >
                    {match && (
                      <span
                        style={{
                          display: "inline-block",
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          backgroundColor: "#009ee3",
                        }}
                      />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
