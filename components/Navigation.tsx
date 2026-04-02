"use client";

import Link from "next/link";
import { useState } from "react";
import type { Locale } from "../lib/i18n";
import type { Dictionary } from "../app/[lang]/dictionaries";

export default function Navigation({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50 bg-white border-b border-[#e8edf5]"
      style={{ height: 72 }}
    >
      <div className="mx-auto flex items-center justify-between h-full" style={{ maxWidth: 1320, padding: "0 32px" }}>
        <Link href={`/${lang}`} className="flex items-center gap-2 no-underline">
          <span className="text-[#002d59] text-[22px] tracking-tight" style={{ fontWeight: 900 }}>
            KORODUR
          </span>
          <span className="text-[#009ee3] text-[14px] font-bold uppercase tracking-wider hidden sm:inline">
            Sanierung
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href={`/${lang}/portfolio`}
            className="text-[#002d59] text-[16px] font-bold no-underline hover:text-[#009ee3] transition-colors duration-200"
          >
            {dict.nav.portfolio}
          </Link>
          <Link
            href={`/${lang}/referenzen`}
            className="text-white text-[15px] no-underline px-[24px] py-[10px] rounded-[6px] bg-[#009ee3] hover:bg-[#0090d0] transition-colors duration-200"
            style={{ fontWeight: 800 }}
          >
            {dict.nav.referenzen}
          </Link>

          {/* Language Switcher */}
          <div className="flex items-center gap-1 ml-2">
            {(["de", "en", "fr"] as const).map((l) => (
              <Link
                key={l}
                href={`/${l}${typeof window !== "undefined" ? window.location.pathname.replace(/^\/(de|en|fr)/, "") : ""}`}
                className={`text-[13px] uppercase px-2 py-1 rounded no-underline transition-colors duration-200 ${
                  l === lang
                    ? "text-white bg-[#009ee3] font-bold"
                    : "text-[#002d59] opacity-50 hover:opacity-100"
                }`}
              >
                {l}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-[5px] p-2 bg-transparent border-none cursor-pointer"
          aria-label="Menu"
        >
          <span
            className="block w-[22px] h-[2px] bg-[#002d59] transition-transform duration-200"
            style={menuOpen ? { transform: "rotate(45deg) translateY(5px)" } : {}}
          />
          <span
            className="block w-[22px] h-[2px] bg-[#002d59] transition-opacity duration-200"
            style={menuOpen ? { opacity: 0 } : {}}
          />
          <span
            className="block w-[22px] h-[2px] bg-[#002d59] transition-transform duration-200"
            style={menuOpen ? { transform: "rotate(-45deg) translateY(-5px)" } : {}}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[#e8edf5] shadow-lg">
          <div className="flex flex-col py-4" style={{ padding: "16px 32px" }}>
            <Link
              href={`/${lang}/portfolio`}
              onClick={() => setMenuOpen(false)}
              className="text-[#002d59] text-[16px] font-bold no-underline py-3 border-b border-[#f5f5f6]"
            >
              {dict.nav.portfolio}
            </Link>
            <Link
              href={`/${lang}/referenzen`}
              onClick={() => setMenuOpen(false)}
              className="text-[#009ee3] text-[16px] font-bold no-underline py-3 border-b border-[#f5f5f6]"
            >
              {dict.nav.referenzen}
            </Link>
            {/* Mobile Language Switcher */}
            <div className="flex items-center gap-2 pt-4">
              {(["de", "en", "fr"] as const).map((l) => (
                <Link
                  key={l}
                  href={`/${l}`}
                  onClick={() => setMenuOpen(false)}
                  className={`text-[14px] uppercase px-3 py-1.5 rounded no-underline ${
                    l === lang
                      ? "text-white bg-[#009ee3] font-bold"
                      : "text-[#002d59] opacity-50 bg-[#f5f5f6]"
                  }`}
                >
                  {l}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
