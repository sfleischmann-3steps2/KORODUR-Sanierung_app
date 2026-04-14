"use client";

export interface ChipOption {
  id: string;
  label: string;
  beschreibung?: string;
}

interface ChipSelectProps {
  optionen: ChipOption[];
  selected: string[];
  mehrfach: boolean;
  exklusiv?: string[];
  onChange: (selected: string[]) => void;
  grosseCards?: boolean;
}

export default function ChipSelect({
  optionen,
  selected,
  mehrfach,
  exklusiv = [],
  onChange,
  grosseCards = false,
}: ChipSelectProps) {
  function handleClick(id: string) {
    const isExklusiv = exklusiv.includes(id);

    if (!mehrfach) {
      // Single select — just replace
      onChange([id]);
      return;
    }

    // Multi select
    if (isExklusiv) {
      // Clicking an exclusive option → deselect all others, select only this
      onChange([id]);
      return;
    }

    // Clicking a normal option
    // Remove any exclusive options from current selection
    const withoutExklusiv = selected.filter((s) => !exklusiv.includes(s));

    if (withoutExklusiv.includes(id)) {
      // Toggle off
      const next = withoutExklusiv.filter((s) => s !== id);
      onChange(next);
    } else {
      // Toggle on
      onChange([...withoutExklusiv, id]);
    }
  }

  if (grosseCards) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {optionen.map((opt) => {
          const isSelected = selected.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleClick(opt.id)}
              className="text-left p-6 transition-all duration-200 cursor-pointer border-2"
              style={{
                borderRadius: 14,
                backgroundColor: isSelected ? "#002d59" : "#fff",
                color: isSelected ? "#fff" : "#002d59",
                borderColor: isSelected ? "#002d59" : "#e8edf5",
              }}
            >
              <span className="block text-lg" style={{ fontWeight: 900 }}>
                {opt.label}
              </span>
              {opt.beschreibung && (
                <span
                  className="block mt-1 text-sm"
                  style={{ opacity: isSelected ? 0.8 : 0.6 }}
                >
                  {opt.beschreibung}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {optionen.map((opt) => {
        const isSelected = selected.includes(opt.id);
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => handleClick(opt.id)}
            className="px-4 py-2 text-sm transition-all duration-200 cursor-pointer border"
            style={{
              borderRadius: 6,
              backgroundColor: isSelected ? "#009ee3" : "#fff",
              color: isSelected ? "#fff" : "#002d59",
              borderColor: isSelected ? "#009ee3" : "#e8edf5",
              fontWeight: 600,
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
