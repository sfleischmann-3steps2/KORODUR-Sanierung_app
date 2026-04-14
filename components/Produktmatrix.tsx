"use client";

import { useState } from "react";
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
  { id: "schnellzement", label: "Schnellzemente & Mörtel" },
  { id: "grundierung", label: "Grundierungen & Haftbrücken" },
  { id: "nachbehandlung", label: "Nachbehandlung" },
  { id: "sonstige", label: "Sonstige" },
] as const;

// Produkte die nicht in der Matrix erscheinen sollen
const AUSGESCHLOSSEN = ["microtop-tw"];

function KategorieGruppe({
  label,
  produkte: gruppenProdukte,
  lang,
  defaultOpen,
}: {
  label: string;
  produkte: typeof produkte;
  lang: Locale;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <>
      <tr>
        <td colSpan={SPALTEN.length + 1} style={{ padding: 0 }}>
          <button
            onClick={() => setOpen(!open)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "18px 0",
              background: "none",
              border: "none",
              borderBottom: "2px solid #e8edf5",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: 16,
              fontWeight: 900,
              color: "#002d59",
              letterSpacing: "0.01em",
            }}
          >
            {/* Pfeil LINKS */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#009ee3"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transition: "transform 200ms",
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
                flexShrink: 0,
              }}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
            <span>{label}</span>
            {/* Anzahl RECHTS */}
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#002d59",
                opacity: 0.4,
                marginLeft: "auto",
              }}
            >
              {gruppenProdukte.length} {gruppenProdukte.length === 1 ? "Produkt" : "Produkte"}
            </span>
          </button>
        </td>
      </tr>
      {open &&
        gruppenProdukte.map((p, i) => {
          const bgColor = i % 2 === 0 ? "#ffffff" : "#f7f8fa";
          return (
            <tr key={p.id}>
              <td
                style={{
                  position: "sticky",
                  left: 0,
                  zIndex: 1,
                  background: bgColor,
                  padding: "14px 16px",
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
        })}
    </>
  );
}

export default function Produktmatrix({ lang }: { lang: Locale }) {
  const filtered = produkte.filter(
    (p) =>
      p.eignungen &&
      p.eignungen.length > 0 &&
      !AUSGESCHLOSSEN.includes(p.id)
  );

  const grouped = KATEGORIEN
    .map((kat) => ({
      ...kat,
      produkte: filtered.filter((p) => p.kategorie === kat.id),
    }))
    .filter((g) => g.produkte.length > 0);

  return (
    <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: "touch" }}>
      <table style={{ borderCollapse: "collapse", width: "100%", tableLayout: "fixed", fontSize: 14 }}>
        <colgroup>
          <col style={{ width: 240 }} />
          {SPALTEN.map((s) => (
            <col key={s.id} />
          ))}
        </colgroup>
        <thead>
          <tr style={{ height: 160 }}>
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
                verticalAlign: "bottom",
              }}
            >
              Produkt
            </th>
            {SPALTEN.map((s) => (
              <th
                key={s.id}
                style={{
                  padding: "0 0 16px 0",
                  fontWeight: 700,
                  color: "#002d59",
                  fontSize: 13,
                  borderBottom: "2px solid #002d59",
                  verticalAlign: "bottom",
                  textAlign: "left",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    whiteSpace: "nowrap",
                    transform: "rotate(-50deg)",
                    transformOrigin: "bottom left",
                    position: "absolute",
                    bottom: 16,
                    left: 8,
                  }}
                >
                  {s.label}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {grouped.map((gruppe, i) => (
            <KategorieGruppe
              key={gruppe.id}
              label={gruppe.label}
              produkte={gruppe.produkte}
              lang={lang}
              defaultOpen={i < 2}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
