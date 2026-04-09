"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useLocale } from "../../../lib/LocaleContext";
import StepIndicator from "../../../components/StepIndicator";
import ReferenceCard from "../../../components/ReferenceCard";
import TileGrid from "../../../components/TileGrid";
import { sanierungSteps, getRecommendations } from "../../../data/sanierung-finden";
import { localizeReferenzen } from "../../../data/i18n/getLocalized";

function AreaIcon({ icon, size = 28 }: { icon: string; size?: number }) {
  const props = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (icon) {
    case "factory":
      return (
        <svg {...props}>
          <path d="M2 20V8l4-4v4l4-4v4l4-4v12" />
          <path d="M18 12h2a2 2 0 0 1 2 2v6" />
          <path d="M2 20h20" />
        </svg>
      );
    case "building":
      return (
        <svg {...props}>
          <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
          <path d="M9 22V12h6v10" />
          <path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" />
        </svg>
      );
    case "road":
      return (
        <svg {...props}>
          <path d="M4 19L8 5" /><path d="M16 5l4 14" />
          <path d="M12 6v2" /><path d="M12 12v2" /><path d="M12 18v2" />
        </svg>
      );
    default:
      return null;
  }
}

function getTranslation(dict: Record<string, unknown>, key: string): string {
  const parts = key.split(".");
  let current: unknown = dict;
  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return key;
    }
  }
  return typeof current === "string" ? current : key;
}

export default function SanierungFindenPage() {
  const { lang, dict } = useLocale();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const totalSteps = sanierungSteps.length;
  const isResultStep = step >= totalSteps;
  const currentStepDef = step < totalSteps ? sanierungSteps[step] : null;

  const results = useMemo(() => {
    if (!isResultStep) return null;
    return getRecommendations(answers);
  }, [isResultStep, answers]);

  const stepLabels = [
    ...sanierungSteps.map((s) => getTranslation(dict as unknown as Record<string, unknown>, s.questionKey.replace("sanierung.", "sanierung.") === s.questionKey ? s.questionKey : s.questionKey).split("?")[0] + "?"),
    dict.sanierung.result_label,
  ];

  // Simpler step labels
  const stepShortLabels = [
    dict.sanierung.step1_label,
    dict.sanierung.step2_label,
    dict.sanierung.step3_label,
    dict.sanierung.result_label,
  ];

  const handleSelect = (optionId: string) => {
    const stepDef = sanierungSteps[step];
    setAnswers((prev) => ({ ...prev, [stepDef.id]: optionId }));
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
    }
  };

  const handleStartOver = () => {
    setStep(0);
    setAnswers({});
  };

  return (
    <section style={{ padding: "40px 32px 88px" }}>
      <div className="mx-auto" style={{ maxWidth: 900 }}>
        {/* Header */}
        <div className="mb-8">
          <h1
            className="mb-2"
            style={{ fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 900, lineHeight: 1.1 }}
          >
            {dict.sanierung.title}
          </h1>
          <p className="text-[#002d59] opacity-60" style={{ fontSize: 17 }}>
            {dict.sanierung.subtitle}
          </p>
        </div>

        {/* Steps */}
        <StepIndicator steps={totalSteps + 1} current={step} labels={stepShortLabels} />

        {/* Back button */}
        {step > 0 && (
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 text-[#009ee3] text-[14px] bg-transparent border-none cursor-pointer"
              style={{ fontWeight: 700, fontFamily: "inherit" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              {dict.sanierung.back}
            </button>
            {isResultStep && (
              <>
                <span className="text-[#002d59] opacity-30">|</span>
                <button
                  onClick={handleStartOver}
                  className="text-[#002d59] opacity-50 text-[14px] bg-transparent border-none cursor-pointer hover:opacity-80"
                  style={{ fontWeight: 600, fontFamily: "inherit" }}
                >
                  {dict.sanierung.start_over}
                </button>
              </>
            )}
          </div>
        )}

        {/* Step 0: Area selection with icon cards */}
        {step === 0 && currentStepDef && (
          <div>
            <h2
              className="mb-6"
              style={{ fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 900, lineHeight: 1.15 }}
            >
              {getTranslation(dict as unknown as Record<string, unknown>, currentStepDef.questionKey)}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {currentStepDef.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(opt.id)}
                  className="flex flex-col items-center gap-3 bg-white text-center border-2 border-[#e8edf5] rounded-2xl cursor-pointer hover:border-[#009ee3] hover:shadow-lg transition-all duration-200 group"
                  style={{ padding: "32px 20px", fontFamily: "inherit" }}
                >
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#009ee3]/10 transition-colors duration-200"
                    style={{ backgroundColor: "#f5f5f6" }}
                  >
                    <span className="text-[#009ee3]">
                      <AreaIcon icon={opt.icon || ""} />
                    </span>
                  </div>
                  <div>
                    <div className="text-[#002d59] text-[17px] mb-1" style={{ fontWeight: 800 }}>
                      {getTranslation(dict as unknown as Record<string, unknown>, opt.labelKey)}
                    </div>
                    {opt.descriptionKey && (
                      <div className="text-[#002d59] opacity-50 text-[13px]">
                        {getTranslation(dict as unknown as Record<string, unknown>, opt.descriptionKey)}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Steps 1-2: Radio-style options */}
        {step > 0 && !isResultStep && currentStepDef && (
          <div>
            <h2
              className="mb-6"
              style={{ fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 900, lineHeight: 1.15 }}
            >
              {getTranslation(dict as unknown as Record<string, unknown>, currentStepDef.questionKey)}
            </h2>
            <div className="flex flex-col gap-3">
              {currentStepDef.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(opt.id)}
                  className="flex items-center gap-4 bg-white text-left border-2 border-[#e8edf5] rounded-xl cursor-pointer hover:border-[#009ee3] hover:shadow-lg transition-all duration-200 group"
                  style={{ padding: "20px 24px", fontFamily: "inherit" }}
                >
                  <div
                    className="w-5 h-5 rounded-full border-2 border-[#d9dada] flex items-center justify-center shrink-0 group-hover:border-[#009ee3] transition-colors"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-[#002d59] text-[16px]" style={{ fontWeight: 800 }}>
                      {getTranslation(dict as unknown as Record<string, unknown>, opt.labelKey)}
                    </div>
                    {opt.descriptionKey && (
                      <div className="text-[#002d59] opacity-50 text-[13px] mt-0.5">
                        {getTranslation(dict as unknown as Record<string, unknown>, opt.descriptionKey)}
                      </div>
                    )}
                  </div>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#009ee3"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {isResultStep && results && (
          <div>
            {/* Answers summary */}
            <div
              className="bg-[#002d59] text-white rounded-2xl mb-8"
              style={{ padding: "24px 28px" }}
            >
              <div className="text-[#009ee3] text-[12px] uppercase tracking-wider mb-3" style={{ fontWeight: 700 }}>
                {dict.sanierung.result_subtitle}
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(answers).map(([key, val]) => {
                  const step = sanierungSteps.find((s) => s.id === key);
                  const opt = step?.options.find((o) => o.id === val);
                  const label = opt ? getTranslation(dict as unknown as Record<string, unknown>, opt.labelKey) : val;
                  return (
                    <span
                      key={key}
                      className="text-[12px] text-white px-3 py-1 rounded-full"
                      style={{ backgroundColor: "rgba(0,158,227,0.25)", fontWeight: 600 }}
                    >
                      {label}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Recommended products */}
            {results.produkte.length > 0 && (
              <>
                <h3
                  className="text-[#002d59] mb-5"
                  style={{ fontSize: "clamp(18px, 3vw, 24px)", fontWeight: 900 }}
                >
                  {dict.sanierung.recommended_products}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                  {results.produkte.map((rec, i) => (
                    <div
                      key={rec.produkt.id}
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
                            {rec.produkt.name}
                          </h4>
                          <span
                            className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded shrink-0"
                            style={{
                              backgroundColor: i === 0 ? "#009ee3" : "#f5f5f6",
                              color: i === 0 ? "white" : "#002d59",
                              fontWeight: 700,
                            }}
                          >
                            {i === 0 ? dict.sanierung.best_match : dict.sanierung.also_suitable}
                          </span>
                        </div>
                        <p className="text-[#002d59] opacity-60 text-[13px] m-0 leading-[1.5] mb-3">
                          {rec.produkt.kurzbeschreibung}
                        </p>
                        {rec.produkt.schichtdicke && (
                          <p className="text-[#009ee3] text-[12px] m-0 mb-2" style={{ fontWeight: 700 }}>
                            {dict.produkte.layer_thickness}: {rec.produkt.schichtdicke}
                          </p>
                        )}
                        <div className="flex flex-col gap-1.5">
                          {rec.produkt.technischeDaten.slice(0, 3).map((td, j) => (
                            <div key={j} className="flex justify-between items-baseline gap-3">
                              <span className="text-[#002d59] opacity-50 text-[12px]">{td.label}</span>
                              <span className="text-[#002d59] text-[12px]" style={{ fontWeight: 700 }}>{td.wert}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 pt-3" style={{ borderTop: "1px solid #e8edf5" }}>
                          <Link
                            href={`/${lang}/produkte/${rec.produkt.id}`}
                            className="inline-flex items-center gap-1.5 text-[#009ee3] text-[12px] no-underline hover:underline"
                            style={{ fontWeight: 700 }}
                          >
                            {dict.sanierung.view_product}
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M9 18l6-6-6-6" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Matching references */}
            {results.referenzen.length > 0 && (
              <div>
                <h3
                  className="text-[#002d59] mb-5"
                  style={{ fontSize: "clamp(18px, 3vw, 24px)", fontWeight: 900 }}
                >
                  {dict.sanierung.matching_references}
                </h3>
                <TileGrid columns={results.referenzen.length >= 3 ? 3 : 2}>
                  {results.referenzen.map((r) => (
                    <ReferenceCard key={r.id} referenz={r} lang={lang} />
                  ))}
                </TileGrid>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
