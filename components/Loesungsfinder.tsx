"use client";

import { useState, useCallback } from "react";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import ChipSelect from "@/components/ChipSelect";
import ProgressBar from "@/components/ProgressBar";
import ReferenceCard from "@/components/ReferenceCard";
import {
  step1,
  step2,
  step3,
  step4,
  berechneErgebnisse,
} from "@/data/loesungsfinder";
import Link from "next/link";

const STEP_LABELS = ["Situation", "Belastung", "Zustand", "Anforderungen", "Ergebnisse"];

interface LoesungsfinderProps {
  lang: Locale;
  dict: Dictionary;
}

export default function Loesungsfinder({ lang }: LoesungsfinderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [massnahme, setMassnahme] = useState<string[]>([]);
  const [belastungen, setBelastungen] = useState<string[]>([]);
  const [zustand, setZustand] = useState<string[]>([]);
  const [sonderbedingungen, setSonderbedingungen] = useState<string[]>([]);

  const steps = [step1, step2, step3, step4];
  const selections = [massnahme, belastungen, zustand, sonderbedingungen];
  const setters = [setMassnahme, setBelastungen, setZustand, setSonderbedingungen];

  const handleStepClick = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  const ergebnisse =
    currentStep === 4
      ? berechneErgebnisse({
          massnahme: massnahme[0] ?? "",
          belastungen,
          zustand,
          sonderbedingungen,
        })
      : null;

  // Summary tags for results page
  const allSelections = [
    ...massnahme.map((id) => ({
      id,
      label: step1.optionen.find((o) => o.id === id)?.label ?? id,
      step: 0,
    })),
    ...belastungen.map((id) => ({
      id,
      label: step2.optionen.find((o) => o.id === id)?.label ?? id,
      step: 1,
    })),
    ...zustand.map((id) => ({
      id,
      label: step3.optionen.find((o) => o.id === id)?.label ?? id,
      step: 2,
    })),
    ...sonderbedingungen.map((id) => ({
      id,
      label: step4.optionen.find((o) => o.id === id)?.label ?? id,
      step: 3,
    })),
  ];

  return (
    <div>
      <ProgressBar
        steps={STEP_LABELS}
        currentStep={currentStep}
        onStepClick={handleStepClick}
      />

      {/* Steps 0-3: Selection */}
      {currentStep < 4 && (
        <div className="max-w-2xl mx-auto">
          <h2
            className="text-xl text-[#002d59] text-center mb-6"
            style={{ fontWeight: 700 }}
          >
            {steps[currentStep].frage}
          </h2>

          <ChipSelect
            optionen={steps[currentStep].optionen}
            selected={selections[currentStep]}
            mehrfach={steps[currentStep].mehrfach}
            exklusiv={steps[currentStep].exklusiv}
            onChange={(val) => {
              setters[currentStep](val);
              // Auto-advance on step 0 (single select, grosseCards)
              if (currentStep === 0 && val.length > 0) {
                setTimeout(() => setCurrentStep(1), 300);
              }
            }}
            grosseCards={currentStep === 0}
          />

          {/* Navigation buttons (steps 1-3) */}
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
                  backgroundColor:
                    selections[currentStep].length === 0 ? "#e8edf5" : "#009ee3",
                  color:
                    selections[currentStep].length === 0 ? "#9ca3af" : "#fff",
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

      {/* Step 4: Results */}
      {currentStep === 4 && ergebnisse && (
        <div>
          {/* Summary tags */}
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

          {ergebnisse.referenzen.length === 0 && ergebnisse.produkte.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-[#002d59]" style={{ fontWeight: 700 }}>
                Keine passenden Ergebnisse gefunden.
              </p>
              <p className="text-sm text-[#002d59] opacity-60 mt-2">
                Versuchen Sie, Ihre Auswahl anzupassen, oder kontaktieren Sie uns
                direkt für eine persönliche Beratung.
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
              {/* Reference cards */}
              {ergebnisse.referenzen.length > 0 && (
                <div className="mb-12">
                  <h3
                    className="text-lg text-[#002d59] mb-4"
                    style={{ fontWeight: 900 }}
                  >
                    Passende Referenzprojekte
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {ergebnisse.referenzen.slice(0, 6).map((scored) => (
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
              )}

              {/* Product cards */}
              {ergebnisse.produkte.length > 0 && (
                <div className="mb-12">
                  <h3
                    className="text-lg text-[#002d59] mb-4"
                    style={{ fontWeight: 900 }}
                  >
                    Empfohlene Produkte
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {ergebnisse.produkte.map((produkt) => (
                      <Link
                        key={produkt.id}
                        href={`/${lang}/produkte/${produkt.id}`}
                        className="no-underline group block"
                      >
                        <div
                          className="bg-white p-5 flex flex-col gap-2 h-full transition-all duration-200 group-hover:-translate-y-1 border"
                          style={{
                            borderRadius: 14,
                            borderColor: "#e8edf5",
                          }}
                        >
                          <h4
                            className="text-[#002d59] text-base m-0"
                            style={{ fontWeight: 900 }}
                          >
                            {produkt.name}
                          </h4>
                          <p className="text-[#002d59] opacity-60 text-sm m-0">
                            {produkt.kurzbeschreibung}
                          </p>
                          {produkt.schichtdicke && (
                            <p
                              className="text-[#009ee3] text-xs m-0"
                              style={{ fontWeight: 700 }}
                            >
                              Schichtdicke: {produkt.schichtdicke}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* CTAs */}
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
