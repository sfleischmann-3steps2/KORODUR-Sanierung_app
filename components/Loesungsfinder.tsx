"use client";

import { useState, useCallback } from "react";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import ChipSelect from "@/components/ChipSelect";
import ProgressBar from "@/components/ProgressBar";
import ReferenceCard from "@/components/ReferenceCard";
import {
  stepSanierungsart,
  stepEinsatzbereich,
  stepZeit,
  stepZusatzfunktion,
  berechneErgebnisse,
  type UserAuswahl,
} from "@/data/loesungsfinder";
import type {
  Sanierungsart,
  EinsatzbereichKategorie,
  ZeitKategorie,
  Zusatzfunktion,
} from "@/data/types";
import Link from "next/link";

const STEP_LABELS = ["Sanierungsart", "Einsatzbereich", "Zeit", "Zusatzfunktion", "Ergebnisse"];

interface LoesungsfinderProps {
  lang: Locale;
  dict: Dictionary;
}

export default function Loesungsfinder({ lang }: LoesungsfinderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [sanierungsart, setSanierungsart] = useState<Sanierungsart[]>([]);
  const [einsatzbereiche, setEinsatzbereiche] = useState<EinsatzbereichKategorie[]>([]);
  const [zeitDringlichkeit, setZeitDringlichkeit] = useState<ZeitKategorie[]>([]);
  const [zusatzfunktionen, setZusatzfunktionen] = useState<Zusatzfunktion[]>([]);

  const steps = [stepSanierungsart, stepEinsatzbereich, stepZeit, stepZusatzfunktion];
  const selections: string[][] = [sanierungsart, einsatzbereiche, zeitDringlichkeit, zusatzfunktionen];
  const setters: ((v: string[]) => void)[] = [
    (v) => setSanierungsart(v as Sanierungsart[]),
    (v) => setEinsatzbereiche(v as EinsatzbereichKategorie[]),
    (v) => setZeitDringlichkeit(v as ZeitKategorie[]),
    (v) => setZusatzfunktionen(v as Zusatzfunktion[]),
  ];

  const handleStepClick = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  const userAuswahl: UserAuswahl | null =
    sanierungsart.length > 0 && zeitDringlichkeit.length > 0
      ? {
          sanierungsart: sanierungsart[0],
          einsatzbereiche,
          zeitDringlichkeit: zeitDringlichkeit[0],
          zusatzfunktionen,
        }
      : null;

  const ergebnisse = currentStep === 4 && userAuswahl ? berechneErgebnisse(userAuswahl) : null;

  const allSelections = [
    ...sanierungsart.map((id) => ({
      id,
      label: stepSanierungsart.optionen.find((o) => o.id === id)?.label ?? id,
      step: 0,
    })),
    ...einsatzbereiche.map((id) => ({
      id,
      label: stepEinsatzbereich.optionen.find((o) => o.id === id)?.label ?? id,
      step: 1,
    })),
    ...zeitDringlichkeit.map((id) => ({
      id,
      label: stepZeit.optionen.find((o) => o.id === id)?.label ?? id,
      step: 2,
    })),
    ...zusatzfunktionen.map((id) => ({
      id,
      label: stepZusatzfunktion.optionen.find((o) => o.id === id)?.label ?? id,
      step: 3,
    })),
  ];

  return (
    <div>
      <ProgressBar steps={STEP_LABELS} currentStep={currentStep} onStepClick={handleStepClick} />

      {currentStep < 4 && (
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl text-[#002d59] text-center mb-6" style={{ fontWeight: 700 }}>
            {steps[currentStep].frage}
          </h2>

          <ChipSelect
            optionen={steps[currentStep].optionen}
            selected={selections[currentStep]}
            mehrfach={steps[currentStep].mehrfach}
            onChange={(val) => {
              setters[currentStep](val);
              if (currentStep === 0 && val.length > 0) {
                setTimeout(() => setCurrentStep(1), 300);
              }
            }}
            grosseCards={currentStep === 0}
          />

          {currentStep > 0 && (
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-6 py-2 text-sm border cursor-pointer transition-colors"
                style={{
                  borderRadius: 6,
                  borderColor: "#e8edf5",
                  color: "#002d59",
                  backgroundColor: "#fff",
                  fontWeight: 600,
                }}
              >
                ← Zurück
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={selections[currentStep].length === 0}
                className="px-6 py-2 text-sm cursor-pointer transition-colors"
                style={{
                  borderRadius: 6,
                  backgroundColor: selections[currentStep].length === 0 ? "#e8edf5" : "#009ee3",
                  color: selections[currentStep].length === 0 ? "#9ca3af" : "#fff",
                  border: "none",
                  fontWeight: 600,
                }}
              >
                Weiter →
              </button>
            </div>
          )}
        </div>
      )}

      {currentStep === 4 && ergebnisse && (
        <div>
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {allSelections.map((tag) => (
              <button
                key={`${tag.step}-${tag.id}`}
                type="button"
                onClick={() => setCurrentStep(tag.step)}
                className="px-3 py-1 text-xs cursor-pointer transition-colors border"
                style={{
                  borderRadius: 6,
                  backgroundColor: "#f5f5f6",
                  color: "#002d59",
                  borderColor: "#e8edf5",
                  fontWeight: 600,
                }}
                title={`${STEP_LABELS[tag.step]}: ${tag.label} — klicken zum Ändern`}
              >
                {tag.label} ✕
              </button>
            ))}
          </div>

          {ergebnisse.referenzen.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-[#002d59]" style={{ fontWeight: 700 }}>
                Keine Referenzen für diese Sanierungsart gefunden.
              </p>
              <p className="text-sm text-[#002d59] opacity-60 mt-2">
                Kontaktieren Sie uns direkt für eine persönliche Beratung oder passen Sie die Auswahl an.
              </p>
              <button
                type="button"
                onClick={() => setCurrentStep(0)}
                className="mt-4 px-6 py-2 text-sm cursor-pointer border"
                style={{
                  borderRadius: 6,
                  borderColor: "#e8edf5",
                  color: "#002d59",
                  backgroundColor: "#fff",
                  fontWeight: 600,
                }}
              >
                ← Auswahl ändern
              </button>
            </div>
          ) : (
            <>
              <div className="mb-12">
                <h3 className="text-lg text-[#002d59] mb-4" style={{ fontWeight: 900 }}>
                  Ähnliche Referenzprojekte
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {ergebnisse.referenzen.slice(0, 5).map((scored) => (
                    <div key={scored.referenz.slug}>
                      <ReferenceCard referenz={scored.referenz} lang={lang} />
                      <div className="flex flex-wrap gap-1 mt-2 px-1">
                        {scored.matchingTags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-2 py-0.5 rounded"
                            style={{
                              backgroundColor: "#009ee3",
                              color: "#fff",
                              fontWeight: 600,
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {ergebnisse.aggregierteProdukte.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-lg text-[#002d59] mb-4" style={{ fontWeight: 900 }}>
                    Eingesetzte Produkte in diesen Referenzen
                  </h3>
                  <p className="text-sm text-[#002d59] opacity-60 mb-4">
                    Aggregiert aus den Top-Referenzen — häufigste zuerst.
                  </p>
                  <div className="flex flex-col gap-2">
                    {ergebnisse.aggregierteProdukte.map((agg) => (
                      <Link
                        key={agg.produkt.id}
                        href={`/${lang}/produkte/${agg.produkt.id}`}
                        className="no-underline block"
                      >
                        <div
                          className="bg-white px-5 py-3 flex items-center justify-between transition-all hover:-translate-y-0.5 border"
                          style={{ borderRadius: 10, borderColor: "#e8edf5" }}
                        >
                          <div>
                            <span className="text-[#002d59] text-base" style={{ fontWeight: 900 }}>
                              {agg.produkt.name}
                            </span>
                            <span className="text-[#002d59] opacity-60 text-xs ml-3">
                              in {agg.anzahlEinsaetze} von {Math.min(ergebnisse.referenzen.length, 5)} Referenzen
                            </span>
                          </div>
                          <span className="text-[#009ee3] text-sm" style={{ fontWeight: 700 }}>
                            zum Produkt →
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                <a
                  href="https://www.korodur.de/kontakt/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 text-sm no-underline transition-colors"
                  style={{
                    borderRadius: 6,
                    backgroundColor: "#009ee3",
                    color: "#fff",
                    fontWeight: 700,
                  }}
                >
                  Beratung anfragen
                </a>
                <button
                  type="button"
                  onClick={() => setCurrentStep(0)}
                  className="px-6 py-2 text-sm cursor-pointer border bg-white"
                  style={{
                    borderRadius: 6,
                    borderColor: "#e8edf5",
                    color: "#002d59",
                    fontWeight: 600,
                  }}
                >
                  ← Auswahl ändern
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
