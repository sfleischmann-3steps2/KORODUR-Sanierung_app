"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "../lib/i18n";
import { LOCALES } from "../lib/i18n";

const FLAG: Record<Locale, string> = {
  de: "🇩🇪",
  en: "🇬🇧",
  fr: "🇫🇷",
  pl: "🇵🇱",
};

const LABEL: Record<Locale, string> = {
  de: "Deutsch",
  en: "English",
  fr: "Français",
  pl: "Polski",
};

export default function LanguageSwitcher({ lang }: { lang: Locale }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const getLocalePath = (targetLocale: string) => {
    const rest = pathname.replace(/^\/(de|en|fr|pl)/, "");
    return `/${targetLocale}${rest}`;
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 bg-[#f5f5f6] hover:bg-[#e8edf5] border-none rounded-lg cursor-pointer transition-colors duration-150"
        style={{ padding: "6px 10px", fontFamily: "inherit" }}
        aria-label={`Sprache: ${LABEL[lang]}`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span className="text-[18px] leading-none">{FLAG[lang]}</span>
        <span className="text-[12px] text-[#002d59] uppercase" style={{ fontWeight: 700, letterSpacing: "0.05em" }}>
          {lang}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#002d59"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-40 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-1.5 bg-white rounded-lg shadow-lg border border-[#e8edf5] overflow-hidden z-50"
          style={{ minWidth: 150 }}
          role="menu"
        >
          {LOCALES.map((l) => (
            <Link
              key={l}
              href={getLocalePath(l)}
              className={`flex items-center gap-2.5 no-underline transition-colors duration-150 ${
                l === lang
                  ? "bg-[#f0f8ff] text-[#009ee3]"
                  : "text-[#002d59] hover:bg-[#f5f5f6]"
              }`}
              style={{ padding: "10px 14px", fontWeight: 600, fontSize: 14 }}
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              <span className="text-[20px] leading-none">{FLAG[l]}</span>
              <span>{LABEL[l]}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
