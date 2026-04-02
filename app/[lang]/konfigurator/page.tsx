"use client";

import { useState, useMemo } from "react";
import { useLocale } from "../../../lib/LocaleContext";
import StepIndicator from "../../../components/StepIndicator";
import ResultsPanel from "../../../components/ResultsPanel";
import { konfiguratorSteps, scoreProducts } from "../../../data/konfigurator";
import { getProduktByName } from "../../../data/produkte";
import { referenzen } from "../../../data/referenzen";
import ReferenceCard from "../../../components/ReferenceCard";
import TileGrid from "../../../components/TileGrid";

function StepIcon({ id }: { id: string }) {
  const props = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (id) {
    case "factory":
      return <svg {...props}><path d="M2 20V8l4-4v4l4-4v4l4-4v12" /><path d="M2 20h20" /></svg>;
    case "building":
      return <svg {...props}><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 22V12h6v10" /></svg>;
    case "road":
      return <svg {...props}><path d="M4 19L8 5" /><path d="M16 5l4 14" /><path d="M12 6v2" /><path d="M12 12v2" /><path d="M12 18v2" /></svg>;
    default:
      return null;
  }
}

export default function KonfiguratorPage() {
  const { lang, dict } = useLocale();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  const totalSteps = konfiguratorSteps.length;
  const isResultStep = step >= totalSteps;
  const currentStepDef = step < totalSteps ? konfiguratorSteps[step] : null;

  const results = useMemo(() => {
    if (!isResultStep) return [];
    return scoreProducts(answers);
  }, [isResultStep, answers]);

  // Find matching references based on bereich answer
  const matchingRefs = useMemo(() => {
    if (!isResultStep) return [];
    const bereich = answers.bereich as string;
    return referenzen.filter((r) => r.kategorie === bereich).slice(0, 6);
  }, [isResultStep, answers]);

  const stepLabels = [
    ...konfiguratorSteps.map((s) => {
      const key = s.questionKey.split(".")[1] as string;
      return (dict.konfigurator as Record<string, string>)[key] || s.id;
    }),
    dict.konfigurator.result_title,
  ];

  const handleSelect = (optionId: string) => {
    const stepDef = konfiguratorSteps[step];
    if (stepDef.multiSelect) {
      const current = (answers[stepDef.id] || []) as string[];
      // "keine" clears other selections
      if (optionId === "keine") {
        setAnswers((prev) => ({ ...prev, [stepDef.id]: ["keine"] }));
      } else {
        const filtered = current.filter((id) => id !== "keine");
        const updated = filtered.includes(optionId)
          ? filtered.filter((id) => id !== optionId)
          : [...filtered, optionId];
        setAnswers((prev) => ({ ...prev, [stepDef.id]: updated }));
      }
    } else {
      setAnswers((prev) => ({ ...prev, [stepDef.id]: optionId }));
      // Auto-advance on single select
      setStep((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentStepDef?.multiSelect) {
      setStep((prev) => prev + 1);
    }
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

  const isSelected = (optionId: string) => {
    if (!currentStepDef) return false;
    const val = answers[currentStepDef.id];
    if (Array.isArray(val)) return val.includes(optionId);
    return val === optionId;
  };

  const canAdvance = () => {
    if (!currentStepDef?.multiSelect) return false;
    const val = answers[currentStepDef.id];
    return Array.isArray(val) && val.length > 0;
  };

  // Resolve translation for option labels
  const getOptionLabel = (labelKey: string) => {
    const key = labelKey.split(".")[1] as string;
    return (dict.konfigurator as Record<string, string>)[key] || labelKey;
  };

  const getQuestionText = () => {
    if (!currentStepDef) return "";
    const key = currentStepDef.questionKey.split(".")[1] as string;
    return (dict.konfigurator as Record<string, string>)[key] || currentStepDef.id;
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
            {dict.konfigurator.title}
          </h1>
          <p className="text-[#002d59] opacity-60" style={{ fontSize: 17 }}>
            {dict.konfigurator.subtitle}
          </p>
        </div>

        {/* Steps */}
        <StepIndicator steps={totalSteps + 1} current={step} labels={stepLabels} />

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
              {dict.konfigurator.back}
            </button>
            {isResultStep && (
              <>
                <span className="text-[#002d59] opacity-30">|</span>
                <button
                  onClick={handleStartOver}
                  className="text-[#002d59] opacity-50 text-[14px] bg-transparent border-none cursor-pointer hover:opacity-80"
                  style={{ fontWeight: 600, fontFamily: "inherit" }}
                >
                  {dict.konfigurator.start_over}
                </button>
              </>
            )}
          </div>
        )}

        {/* Question Steps */}
        {!isResultStep && currentStepDef && (
          <div>
            <h2
              className="mb-6"
              style={{ fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 900, lineHeight: 1.15 }}
            >
              {getQuestionText()}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentStepDef.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(opt.id)}
                  className={`flex items-center gap-3 text-left border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    isSelected(opt.id)
                      ? "border-[#009ee3] bg-[#009ee3]/5 shadow-md"
                      : "border-[#e8edf5] bg-white hover:border-[#009ee3]/50 hover:shadow-sm"
                  }`}
                  style={{ padding: "18px 20px", fontFamily: "inherit" }}
                >
                  {/* Checkbox/Radio indicator */}
                  <div
                    className={`w-5 h-5 rounded-${currentStepDef.multiSelect ? "md" : "full"} border-2 flex items-center justify-center shrink-0 transition-colors ${
                      isSelected(opt.id)
                        ? "border-[#009ee3] bg-[#009ee3]"
                        : "border-[#d9dada]"
                    }`}
                  >
                    {isSelected(opt.id) && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </div>

                  {/* Icon */}
                  {opt.icon && (
                    <span className="text-[#009ee3] shrink-0">
                      <StepIcon id={opt.icon} />
                    </span>
                  )}

                  {/* Label */}
                  <span
                    className={`text-[15px] ${isSelected(opt.id) ? "text-[#002d59]" : "text-[#002d59] opacity-80"}`}
                    style={{ fontWeight: isSelected(opt.id) ? 700 : 600 }}
                  >
                    {getOptionLabel(opt.label)}
                  </span>
                </button>
              ))}
            </div>

            {/* Next button for multi-select */}
            {currentStepDef.multiSelect && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleNext}
                  disabled={!canAdvance()}
                  className={`flex items-center gap-2 rounded-lg text-[15px] transition-all duration-200 ${
                    canAdvance()
                      ? "bg-[#009ee3] text-white hover:bg-[#0090d0] cursor-pointer"
                      : "bg-[#e8edf5] text-[#002d59] opacity-40 cursor-not-allowed"
                  }`}
                  style={{ padding: "12px 28px", fontWeight: 800, fontFamily: "inherit", border: "none" }}
                >
                  {dict.konfigurator.next}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Results */}
        {isResultStep && (
          <div>
            {/* Summary of answers */}
            <div
              className="bg-[#002d59] text-white rounded-2xl mb-8"
              style={{ padding: "24px 28px" }}
            >
              <div className="text-[#009ee3] text-[12px] uppercase tracking-wider mb-3" style={{ fontWeight: 700 }}>
                {dict.konfigurator.result_subtitle}
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(answers).map(([key, val]) => {
                  const values = Array.isArray(val) ? val : [val];
                  return values.map((v) => {
                    const optKey = `opt_${v.replace(/-/g, "_")}`;
                    const label = (dict.konfigurator as Record<string, string>)[optKey] || v;
                    return (
                      <span
                        key={`${key}-${v}`}
                        className="text-[12px] text-white px-3 py-1 rounded-full"
                        style={{ backgroundColor: "rgba(0,158,227,0.25)", fontWeight: 600 }}
                      >
                        {label}
                      </span>
                    );
                  });
                })}
              </div>
            </div>

            {/* Product scores */}
            <h3
              className="text-[#002d59] mb-5"
              style={{ fontSize: "clamp(18px, 3vw, 24px)", fontWeight: 900 }}
            >
              {dict.wizard.recommended_products}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              {results.map((result, i) => {
                const produkt = getProduktByName(result.produktName);
                if (!produkt) return null;
                return (
                  <div
                    key={produkt.id}
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
                          {produkt.name}
                        </h4>
                        <span
                          className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded shrink-0"
                          style={{
                            backgroundColor: i === 0 ? "#009ee3" : "#f5f5f6",
                            color: i === 0 ? "white" : "#002d59",
                            fontWeight: 700,
                          }}
                        >
                          {i === 0 ? dict.konfigurator.best_match : dict.konfigurator.also_suitable}
                        </span>
                      </div>
                      <p className="text-[#002d59] opacity-60 text-[13px] m-0 leading-[1.5] mb-3">
                        {produkt.kurzbeschreibung}
                      </p>
                      {produkt.schichtdicke && (
                        <p className="text-[#009ee3] text-[12px] m-0 mb-2" style={{ fontWeight: 700 }}>
                          Schichtdicke: {produkt.schichtdicke}
                        </p>
                      )}
                      <div className="flex flex-col gap-1.5">
                        {produkt.technischeDaten.slice(0, 3).map((td, j) => (
                          <div key={j} className="flex justify-between items-baseline gap-3">
                            <span className="text-[#002d59] opacity-50 text-[12px]">{td.label}</span>
                            <span className="text-[#002d59] text-[12px]" style={{ fontWeight: 700 }}>{td.wert}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 pt-3" style={{ borderTop: "1px solid #e8edf5" }}>
                        <a
                          href={`https://korodur.de/?s=${encodeURIComponent(produkt.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[#009ee3] text-[12px] no-underline hover:underline"
                          style={{ fontWeight: 700 }}
                        >
                          {dict.detail.view_on_website}
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Matching References */}
            {matchingRefs.length > 0 && (
              <div>
                <h3
                  className="text-[#002d59] mb-5"
                  style={{ fontSize: "clamp(18px, 3vw, 24px)", fontWeight: 900 }}
                >
                  {dict.konfigurator.matching_references}
                </h3>
                <TileGrid columns={matchingRefs.length >= 3 ? 3 : 2}>
                  {matchingRefs.map((r) => (
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
