"use client";

interface StepIndicatorProps {
  steps: number;
  current: number;
  labels?: string[];
}

export default function StepIndicator({ steps, current, labels }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: steps }, (_, i) => (
        <div key={i} className="flex items-center gap-2 flex-1">
          <div className="flex items-center gap-2 flex-1">
            {/* Step dot */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] shrink-0 transition-all duration-300 ${
                i < current
                  ? "bg-[#009ee3] text-white"
                  : i === current
                  ? "bg-[#002d59] text-white"
                  : "bg-[#e8edf5] text-[#002d59] opacity-40"
              }`}
              style={{ fontWeight: 700 }}
            >
              {i < current ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            {/* Label */}
            {labels && labels[i] && (
              <span
                className={`text-[12px] hidden sm:inline truncate ${
                  i <= current ? "text-[#002d59]" : "text-[#002d59] opacity-40"
                }`}
                style={{ fontWeight: i === current ? 700 : 500 }}
              >
                {labels[i]}
              </span>
            )}
          </div>
          {/* Connector line */}
          {i < steps - 1 && (
            <div
              className={`h-[2px] flex-1 min-w-[20px] rounded transition-colors duration-300 ${
                i < current ? "bg-[#009ee3]" : "bg-[#e8edf5]"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
