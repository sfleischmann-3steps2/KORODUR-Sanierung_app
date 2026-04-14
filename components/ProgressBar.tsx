"use client";

interface ProgressBarProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export default function ProgressBar({ steps, currentStep, onStepClick }: ProgressBarProps) {
  return (
    <div className="flex items-center justify-center w-full mb-10">
      {steps.map((label, i) => {
        const isCompleted = i < currentStep;
        const isCurrent = i === currentStep;
        const isFuture = i > currentStep;
        const clickable = isCompleted && !!onStepClick;

        return (
          <div key={i} className="flex items-center">
            {/* Connecting line before (except first) */}
            {i > 0 && (
              <div
                className="h-0.5 w-6 sm:w-10"
                style={{ backgroundColor: isFuture ? "#e8edf5" : "#002d59" }}
              />
            )}

            {/* Step circle + label */}
            <button
              type="button"
              disabled={!clickable}
              onClick={() => clickable && onStepClick!(i)}
              className="flex flex-col items-center gap-1"
              style={{ cursor: clickable ? "pointer" : "default", background: "none", border: "none", padding: 0 }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
                style={{
                  backgroundColor: isCurrent
                    ? "#009ee3"
                    : isCompleted
                      ? "#002d59"
                      : "#e8edf5",
                  color: isFuture ? "#9ca3af" : "#fff",
                  fontWeight: 700,
                }}
              >
                {isCompleted ? "✓" : i + 1}
              </div>
              <span
                className="hidden sm:inline text-xs whitespace-nowrap"
                style={{
                  color: isCurrent ? "#009ee3" : isCompleted ? "#002d59" : "#9ca3af",
                  fontWeight: isCurrent ? 700 : 500,
                }}
              >
                {label}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
