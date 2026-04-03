"use client";

import { useState, useEffect } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import SearchOverlay from "./SearchOverlay";
import type { Locale } from "../lib/i18n";
import type { Dictionary } from "../app/[lang]/dictionaries";

interface TopBarProps {
  lang: Locale;
  dict: Dictionary;
  onMenuToggle: () => void;
}

export default function TopBar({ lang, dict, onMenuToggle }: TopBarProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  // Cmd/Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <header
        className="bg-white border-b border-[#e8edf5] flex items-center justify-between shrink-0 z-40"
        style={{ height: 56, padding: "0 20px" }}
        role="banner"
      >
        {/* Left: Mobile hamburger */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden flex flex-col gap-[4px] p-2 bg-transparent border-none cursor-pointer"
          aria-label={lang === "de" ? "Menü öffnen" : lang === "fr" ? "Ouvrir le menu" : "Open menu"}
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

        {/* Desktop: Search trigger */}
        <button
          onClick={() => setSearchOpen(true)}
          className="hidden lg:flex items-center gap-2 bg-[#f5f5f6] hover:bg-[#e8edf5] border-none rounded-lg cursor-pointer transition-colors duration-150"
          style={{ padding: "8px 14px", fontFamily: "inherit" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#002d59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.4">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <span className="text-[13px] text-[#002d59] opacity-40" style={{ fontWeight: 600 }}>
            {lang === "de" ? "Suchen" : lang === "fr" ? "Rechercher" : "Search"}...
          </span>
          <kbd className="text-[11px] text-[#002d59] opacity-25 px-1.5 py-0.5 rounded border border-[#e8edf5] ml-4" style={{ fontWeight: 600 }}>
            {typeof navigator !== "undefined" && /Mac/.test(navigator.userAgent ?? "") ? "⌘K" : "Ctrl+K"}
          </kbd>
        </button>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Mobile search button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="lg:hidden p-2 bg-transparent border-none cursor-pointer"
            aria-label={lang === "de" ? "Suchen" : lang === "fr" ? "Rechercher" : "Search"}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#002d59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
          <LanguageSwitcher lang={lang} />
        </div>
      </header>

      <SearchOverlay
        lang={lang}
        dict={dict}
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
}
