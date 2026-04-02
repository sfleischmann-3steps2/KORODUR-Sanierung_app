"use client";

import LanguageSwitcher from "./LanguageSwitcher";
import type { Locale } from "../lib/i18n";
import type { Dictionary } from "../app/[lang]/dictionaries";

interface TopBarProps {
  lang: Locale;
  dict: Dictionary;
  onMenuToggle: () => void;
}

export default function TopBar({ lang, dict, onMenuToggle }: TopBarProps) {
  return (
    <header
      className="bg-white border-b border-[#e8edf5] flex items-center justify-between shrink-0 z-40"
      style={{ height: 56, padding: "0 20px" }}
    >
      {/* Left: Mobile hamburger */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden flex flex-col gap-[4px] p-2 bg-transparent border-none cursor-pointer"
        aria-label="Menu"
      >
        <span className="block w-[20px] h-[2px] bg-[#002d59]" />
        <span className="block w-[20px] h-[2px] bg-[#002d59]" />
        <span className="block w-[20px] h-[2px] bg-[#002d59]" />
      </button>

      {/* Center: Mobile logo */}
      <div className="lg:hidden flex items-center gap-1.5">
        <span className="text-[#002d59] text-[18px] tracking-tight" style={{ fontWeight: 900 }}>
          KORODUR
        </span>
        <span className="text-[#009ee3] text-[11px] font-bold uppercase tracking-wider">
          Sanierung
        </span>
      </div>

      {/* Left spacer on desktop */}
      <div className="hidden lg:block" />

      {/* Right: Language switcher */}
      <div className="flex items-center gap-3">
        <LanguageSwitcher lang={lang} />
      </div>
    </header>
  );
}
