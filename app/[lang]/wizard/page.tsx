"use client";

import { useState, useMemo } from "react";
import { useLocale } from "../../../lib/LocaleContext";
import StepIndicator from "../../../components/StepIndicator";
import ResultsPanel from "../../../components/ResultsPanel";
import { useCases } from "../../../data/usecases";
import type { Problem } from "../../../data/usecases";

function AreaIcon({ icon, size = 32 }: { icon: string; size?: number }) {
  const props = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (icon) {
    case "floor":
      return (
        <svg {...props}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18" /><path d="M3 15h18" />
          <path d="M9 3v18" /><path d="M15 3v18" />
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
    case "water":
      return (
        <svg {...props}>
          <path d="M12 2c-4 6-8 9.5-8 13a8 8 0 1 0 16 0c0-3.5-4-7-8-13z" />
        </svg>
      );
    default:
      return null;
  }
}

const areaTranslationKeys: Record<string, string> = {
  boden: "area_boden",
  bauteil: "area_bauteil",
  verkehr: "area_verkehr",
  wasser: "area_wasser",
};

export default function WizardPage() {
  const { lang, dict } = useLocale();
  const [step, setStep] = useState(0);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

  const currentUseCase = useMemo(
    () => useCases.find((uc) => uc.id === selectedArea),
    [selectedArea]
  );

  const stepLabels = [
    dict.wizard.step1_title,
    dict.wizard.step2_title,
    dict.wizard.step3_title,
  ];

  const handleAreaSelect = (areaId: string) => {
    setSelectedArea(areaId);
    setSelectedProblem(null);
    setStep(1);
  };

  const handleProblemSelect = (problem: Problem) => {
    setSelectedProblem(problem);
    setStep(2);
  };

  const handleBack = () => {
    if (step === 2) {
      setSelectedProblem(null);
      setStep(1);
    } else if (step === 1) {
      setSelectedArea(null);
      setStep(0);
    }
  };

  const handleStartOver = () => {
    setStep(0);
    setSelectedArea(null);
    setSelectedProblem(null);
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
            {dict.wizard.title}
          </h1>
          <p className="text-[#002d59] opacity-60" style={{ fontSize: 17 }}>
            {dict.wizard.subtitle}
          </p>
        </div>

        {/* Steps */}
        <StepIndicator steps={3} current={step} labels={stepLabels} />

        {/* Step 0: Select Area */}
        {step === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {useCases.map((uc) => {
              const key = areaTranslationKeys[uc.id] || uc.id;
              const label = (dict.wizard as Record<string, string>)[key] || uc.problemArea;
              return (
                <button
                  key={uc.id}
                  onClick={() => handleAreaSelect(uc.id)}
                  className="flex items-center gap-4 bg-white text-left border-2 border-[#e8edf5] rounded-2xl cursor-pointer hover:border-[#009ee3] hover:shadow-lg transition-all duration-200 group"
                  style={{ padding: "24px", fontFamily: "inherit" }}
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#009ee3]/10 transition-colors duration-200"
                    style={{ backgroundColor: "#f5f5f6" }}
                  >
                    <span className="text-[#009ee3]">
                      <AreaIcon icon={uc.problemAreaIcon} />
                    </span>
                  </div>
                  <div>
                    <div className="text-[#002d59] text-[17px] mb-1" style={{ fontWeight: 800 }}>
                      {label}
                    </div>
                    <div className="text-[#002d59] opacity-50 text-[13px]">
                      {uc.problems.length} {uc.problems.length === 1
                        ? dict.common.reference_singular
                        : dict.common.reference_plural}
                    </div>
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
                    className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              );
            })}
          </div>
        )}

        {/* Step 1: Select Problem */}
        {step === 1 && currentUseCase && (
          <div>
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 text-[#009ee3] text-[14px] bg-transparent border-none cursor-pointer mb-6"
              style={{ fontWeight: 700, fontFamily: "inherit" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              {dict.wizard.back}
            </button>

            <div className="flex flex-col gap-3">
              {currentUseCase.problems.map((problem) => (
                <button
                  key={problem.id}
                  onClick={() => handleProblemSelect(problem)}
                  className="flex items-start gap-4 bg-white text-left border-2 border-[#e8edf5] rounded-2xl cursor-pointer hover:border-[#009ee3] hover:shadow-lg transition-all duration-200 group"
                  style={{ padding: "20px 24px", fontFamily: "inherit" }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#009ee3]/10 transition-colors"
                    style={{ backgroundColor: "#f5f5f6" }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#009ee3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[#002d59] text-[16px] mb-1" style={{ fontWeight: 800 }}>
                      {problem.label}
                    </div>
                    <div className="text-[#002d59] opacity-50 text-[14px] leading-[1.5]">
                      {problem.beschreibung}
                    </div>
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
                    className="shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Results */}
        {step === 2 && selectedProblem && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={handleBack}
                className="flex items-center gap-1.5 text-[#009ee3] text-[14px] bg-transparent border-none cursor-pointer"
                style={{ fontWeight: 700, fontFamily: "inherit" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
                {dict.wizard.back}
              </button>
              <span className="text-[#002d59] opacity-30">|</span>
              <button
                onClick={handleStartOver}
                className="text-[#002d59] opacity-50 text-[14px] bg-transparent border-none cursor-pointer hover:opacity-80"
                style={{ fontWeight: 600, fontFamily: "inherit" }}
              >
                {dict.wizard.start_over}
              </button>
            </div>

            {/* Selected problem summary */}
            <div
              className="bg-[#002d59] text-white rounded-2xl mb-8"
              style={{ padding: "24px 28px" }}
            >
              <div className="text-[#009ee3] text-[12px] uppercase tracking-wider mb-2" style={{ fontWeight: 700 }}>
                {selectedProblem.label}
              </div>
              <p className="text-white opacity-80 text-[15px] m-0 leading-[1.5]">
                {selectedProblem.beschreibung}
              </p>
            </div>

            <ResultsPanel
              produktNames={selectedProblem.empfohleneProdukte}
              kategorie={selectedProblem.kategorie}
              unterkategorie={selectedProblem.unterkategorie}
              lang={lang}
              dict={dict}
            />
          </div>
        )}
      </div>
    </section>
  );
}
