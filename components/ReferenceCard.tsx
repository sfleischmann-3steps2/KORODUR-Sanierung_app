"use client";

import Link from "next/link";
import Image from "next/image";
import { Referenz, EinsatzbereichKategorie } from "../data/types";
import { withBasePath } from "../lib/basePath";

const einsatzbereichLabels: Record<string, Record<EinsatzbereichKategorie, string>> = {
  de: {
    "lager-logistik": "Lager & Logistik",
    "industrie-produktion": "Industrie & Produktion",
    "lebensmittel": "Lebensmittel",
    "flugzeug": "Flugzeug",
    "parkdeck": "Parkdeck",
    "infrastruktur-zufahrten": "Infrastruktur & Zufahrten",
    "verkaufsraeume": "Verkaufsräume",
    "schwerindustrie": "Schwerindustrie",
  },
  en: {
    "lager-logistik": "Warehouse & Logistics",
    "industrie-produktion": "Industrial & Production",
    "lebensmittel": "Food Processing",
    "flugzeug": "Aviation",
    "parkdeck": "Parking Deck",
    "infrastruktur-zufahrten": "Infrastructure & Access",
    "verkaufsraeume": "Retail",
    "schwerindustrie": "Heavy Industry",
  },
  fr: {
    "lager-logistik": "Entrepôts & Logistique",
    "industrie-produktion": "Industrie & Production",
    "lebensmittel": "Agroalimentaire",
    "flugzeug": "Aviation",
    "parkdeck": "Parking",
    "infrastruktur-zufahrten": "Infrastructure & Accès",
    "verkaufsraeume": "Commerce",
    "schwerindustrie": "Industrie lourde",
  },
  pl: {
    "lager-logistik": "Magazyn i logistyka",
    "industrie-produktion": "Przemysł i produkcja",
    "lebensmittel": "Przemysł spożywczy",
    "flugzeug": "Lotnictwo",
    "parkdeck": "Parking",
    "infrastruktur-zufahrten": "Infrastruktura i dojazdy",
    "verkaufsraeume": "Handel",
    "schwerindustrie": "Przemysł ciężki",
  },
};

export default function ReferenceCard({
  referenz,
  lang = "de",
}: {
  referenz: Referenz;
  lang?: string;
}) {
  const primary = referenz.einsatzbereiche[0];
  const label = primary ? einsatzbereichLabels[lang]?.[primary] ?? primary : "";

  return (
    <Link href={`/${lang}/referenzen/${referenz.slug}`} className="no-underline group block">
      <div
        className="bg-white overflow-hidden flex flex-col transition-all duration-200 group-hover:-translate-y-1.5"
        style={{
          borderRadius: 14,
          boxShadow: "0 8px 40px rgba(0,45,89,0.10)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 48px rgba(0,45,89,0.16)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 40px rgba(0,45,89,0.10)";
        }}
      >
        <div className="aspect-video overflow-hidden relative">
          <Image
            src={withBasePath(referenz.bild)}
            alt={referenz.bildAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-6 flex flex-col gap-3">
          {label && (
            <span
              className="self-start text-white text-[11px] uppercase tracking-wider px-3 py-1 rounded-[4px]"
              style={{ backgroundColor: "#009ee3", fontWeight: 700 }}
            >
              {label}
            </span>
          )}
          <h3 className="text-[#002d59] text-[18px] m-0 leading-tight" style={{ fontWeight: 900 }}>
            {referenz.titel}
          </h3>
          <p className="text-[#002d59] text-[14px] m-0 opacity-60">
            {referenz.untertitel}
          </p>
          <div className="flex items-center gap-2 text-[13px] text-[#002d59] opacity-50">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {referenz.ort}, {referenz.land}
            {referenz.flaeche && (
              <>
                <span className="mx-1">|</span>
                {referenz.flaeche}
              </>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-1">
            {referenz.produkte.slice(0, 2).map((p) => (
              <span
                key={p}
                className="text-[11px] text-[#002d59] px-2 py-1 rounded-[4px]"
                style={{ backgroundColor: "#f5f5f6", fontWeight: 700 }}
              >
                {p}
              </span>
            ))}
            {referenz.produkte.length > 2 && (
              <span className="text-[11px] text-[#002d59] opacity-50 px-2 py-1">
                +{referenz.produkte.length - 2}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
