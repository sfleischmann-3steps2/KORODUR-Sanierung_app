"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import SearchOverlay from "./SearchOverlay";
import type { Locale } from "../lib/i18n";
import type { Dictionary } from "../app/[lang]/dictionaries";

interface TopNavProps {
  lang: Locale;
  dict: Dictionary;
}

export default function TopNav({ lang, dict }: TopNavProps) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shortcutLabel, setShortcutLabel] = useState<string | null>(null);

  useEffect(() => {
    setShortcutLabel(/Mac/.test(navigator.userAgent ?? "") ? "⌘K" : "Ctrl+K");
  }, []);

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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    // Home: exact match only
    if (href === `/${lang}/`) return pathname === href || pathname === `/${lang}`;
    // Others: prefix match
    return pathname === href || pathname.startsWith(href);
  };

  const navLinks = [
    { href: `/${lang}/`, label: dict.nav.home },
    { href: `/${lang}/loesungsfinder/`, label: dict.nav.loesungsfinder },
    { href: `/${lang}/referenzen/`, label: dict.nav.referenzen },
    { href: `/${lang}/produktmatrix/`, label: dict.nav.produktmatrix },
    { href: `/${lang}/produkte/`, label: dict.nav.produkte },
  ];

  return (
    <>
      <header
        className="bg-white border-b border-[#e8edf5] shrink-0 z-40 sticky top-0"
        role="banner"
      >
        <div
          className="mx-auto flex items-center justify-between"
          style={{ maxWidth: 1320, height: 64, padding: "0 24px" }}
        >
          {/* Logo */}
          <Link
            href={`/${lang}`}
            className="flex items-center gap-2 no-underline shrink-0"
          >
            <div
              className="w-8 h-8 rounded-md flex items-center justify-center bg-[#002d59] text-white text-[13px] shrink-0"
              style={{ fontWeight: 900 }}
            >
              K
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[#002d59] text-[18px] tracking-tight" style={{ fontWeight: 900 }}>
                KORODUR
              </span>
              <span className="text-[#009ee3] text-[10px] uppercase tracking-wider" style={{ fontWeight: 700 }}>
                Sanierung
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-[14px] no-underline transition-colors duration-150 ${
                  isActive(link.href)
                    ? "text-[#009ee3]"
                    : "text-[#002d59] hover:bg-[#f5f5f6]"
                }`}
                style={{ fontWeight: 700 }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Desktop search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden lg:flex items-center gap-2 bg-[#f5f5f6] hover:bg-[#e8edf5] border-none rounded-lg cursor-pointer transition-colors duration-150"
              style={{ padding: "8px 12px", fontFamily: "inherit" }}
              aria-label={lang === "de" ? "Suchen" : lang === "fr" ? "Rechercher" : lang === "pl" ? "Szukaj" : "Search"}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#002d59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.4">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              {shortcutLabel && (
                <kbd className="text-[11px] text-[#002d59] opacity-25 px-1.5 py-0.5 rounded border border-[#e8edf5]" style={{ fontWeight: 600 }}>
                  {shortcutLabel}
                </kbd>
              )}
            </button>

            {/* Mobile search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="lg:hidden p-2 bg-transparent border-none cursor-pointer"
              aria-label={lang === "de" ? "Suchen" : lang === "fr" ? "Rechercher" : lang === "pl" ? "Szukaj" : "Search"}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#002d59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>

            <LanguageSwitcher lang={lang} />

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="lg:hidden flex flex-col gap-[4px] p-2 bg-transparent border-none cursor-pointer"
              aria-label={lang === "de" ? "Menü öffnen" : lang === "fr" ? "Ouvrir le menu" : lang === "pl" ? "Otwórz menu" : "Open menu"}
            >
              <span className="block w-[20px] h-[2px] bg-[#002d59]" />
              <span className="block w-[20px] h-[2px] bg-[#002d59]" />
              <span className="block w-[20px] h-[2px] bg-[#002d59]" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div
            className="absolute inset-0 bg-black/30 animate-overlay"
            onClick={() => setMobileOpen(false)}
          />
          <div
            className="relative z-10 bg-white shadow-2xl animate-drawer overflow-y-auto"
            style={{ maxHeight: "85vh" }}
          >
            {/* Close button */}
            <div className="flex items-center justify-between p-4 border-b border-[#e8edf5]">
              <Link
                href={`/${lang}`}
                className="flex items-center gap-2 no-underline"
                onClick={() => setMobileOpen(false)}
              >
                <div
                  className="w-8 h-8 rounded-md flex items-center justify-center bg-[#002d59] text-white text-[13px]"
                  style={{ fontWeight: 900 }}
                >
                  K
                </div>
                <span className="text-[#002d59] text-[18px] tracking-tight" style={{ fontWeight: 900 }}>
                  KORODUR
                </span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 bg-transparent border-none cursor-pointer"
                aria-label="Close"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#002d59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18" /><path d="M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="p-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block rounded-lg no-underline text-[15px] ${
                    isActive(link.href) ? "text-[#009ee3]" : "text-[#002d59]"
                  }`}
                  style={{ padding: "12px 16px", fontWeight: 700 }}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      <SearchOverlay
        lang={lang}
        dict={dict}
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
}
