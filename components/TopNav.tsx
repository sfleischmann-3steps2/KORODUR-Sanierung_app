"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import SearchOverlay from "./SearchOverlay";
import { kategorien } from "../data/kategorien";
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
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const portfolioRef = useRef<HTMLDivElement>(null);

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

  // Close portfolio dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (portfolioRef.current && !portfolioRef.current.contains(e.target as Node)) {
        setPortfolioOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setPortfolioOpen(false);
  }, [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const navLinks = [
    {
      href: `/${lang}/sanierung-finden`,
      label: dict.sanierung.title,
      isCta: true,
    },
    {
      href: `/${lang}/portfolio`,
      label: dict.nav.portfolio,
      isDropdown: true,
    },
    {
      href: `/${lang}/referenzen`,
      label: dict.nav.referenzen,
    },
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
            {navLinks.map((link) => {
              if (link.isDropdown) {
                return (
                  <div key={link.href} className="relative" ref={portfolioRef}>
                    <button
                      onClick={() => setPortfolioOpen((prev) => !prev)}
                      className={`flex items-center gap-1 px-4 py-2 rounded-lg bg-transparent border-none cursor-pointer text-[14px] transition-colors duration-150 ${
                        isActive(link.href)
                          ? "text-[#009ee3]"
                          : "text-[#002d59] hover:bg-[#f5f5f6]"
                      }`}
                      style={{ fontWeight: 700, fontFamily: "inherit" }}
                    >
                      {link.label}
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-transform duration-200"
                        style={{ transform: portfolioOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>

                    {/* Dropdown */}
                    {portfolioOpen && (
                      <div
                        className="absolute top-full left-0 mt-1 bg-white border border-[#e8edf5] rounded-xl shadow-lg py-2 min-w-[220px]"
                        style={{ boxShadow: "0 12px 40px rgba(0,45,89,0.12)" }}
                      >
                        <Link
                          href={`/${lang}/portfolio`}
                          className={`block px-4 py-2.5 text-[14px] no-underline transition-colors ${
                            pathname === `/${lang}/portfolio` || pathname === `/${lang}/portfolio/`
                              ? "text-[#009ee3] bg-[#009ee3]/5"
                              : "text-[#002d59] hover:bg-[#f5f5f6]"
                          }`}
                          style={{ fontWeight: 700 }}
                        >
                          {dict.portfolio.title}
                        </Link>
                        <div className="border-t border-[#e8edf5] my-1" />
                        {kategorien.map((kat) => (
                          <Link
                            key={kat.id}
                            href={`/${lang}/portfolio/${kat.id}`}
                            className={`block px-4 py-2.5 text-[14px] no-underline transition-colors ${
                              isActive(`/${lang}/portfolio/${kat.id}`)
                                ? "text-[#009ee3] bg-[#009ee3]/5"
                                : "text-[#002d59] hover:bg-[#f5f5f6]"
                            }`}
                            style={{ fontWeight: 600 }}
                          >
                            {dict.categories[kat.id as keyof typeof dict.categories] || kat.titel}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-[14px] no-underline transition-colors duration-150 ${
                    link.isCta
                      ? isActive(link.href)
                        ? "bg-[#009ee3] text-white"
                        : "bg-[#009ee3] text-white hover:bg-[#0090d0]"
                      : isActive(link.href)
                        ? "text-[#009ee3]"
                        : "text-[#002d59] hover:bg-[#f5f5f6]"
                  }`}
                  style={{ fontWeight: 700 }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Desktop search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden lg:flex items-center gap-2 bg-[#f5f5f6] hover:bg-[#e8edf5] border-none rounded-lg cursor-pointer transition-colors duration-150"
              style={{ padding: "8px 12px", fontFamily: "inherit" }}
              aria-label={lang === "de" ? "Suchen" : lang === "fr" ? "Rechercher" : "Search"}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#002d59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.4">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <kbd className="text-[11px] text-[#002d59] opacity-25 px-1.5 py-0.5 rounded border border-[#e8edf5]" style={{ fontWeight: 600 }}>
                {typeof navigator !== "undefined" && /Mac/.test(navigator.userAgent ?? "") ? "⌘K" : "Ctrl+K"}
              </kbd>
            </button>

            {/* Mobile search */}
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

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="lg:hidden flex flex-col gap-[4px] p-2 bg-transparent border-none cursor-pointer"
              aria-label={lang === "de" ? "Menü öffnen" : lang === "fr" ? "Ouvrir le menu" : "Open menu"}
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
              {/* Sanierung finden - prominent */}
              <Link
                href={`/${lang}/sanierung-finden`}
                className="flex items-center gap-3 bg-[#009ee3] text-white rounded-xl no-underline mb-2"
                style={{ padding: "14px 16px", fontWeight: 700, fontSize: 15 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                {dict.sanierung.title}
              </Link>

              {/* Portfolio with subcategories */}
              <Link
                href={`/${lang}/portfolio`}
                className={`flex items-center gap-3 rounded-lg no-underline text-[15px] ${
                  isActive(`/${lang}/portfolio`) ? "text-[#009ee3]" : "text-[#002d59]"
                }`}
                style={{ padding: "12px 16px", fontWeight: 700 }}
              >
                {dict.nav.portfolio}
              </Link>
              <div className="ml-8 flex flex-col gap-0.5 mb-2">
                {kategorien.map((kat) => (
                  <Link
                    key={kat.id}
                    href={`/${lang}/portfolio/${kat.id}`}
                    className={`text-[14px] rounded-lg no-underline ${
                      isActive(`/${lang}/portfolio/${kat.id}`)
                        ? "text-[#009ee3]"
                        : "text-[#002d59] opacity-60"
                    }`}
                    style={{ padding: "8px 12px", fontWeight: 600 }}
                  >
                    {dict.categories[kat.id as keyof typeof dict.categories] || kat.titel}
                  </Link>
                ))}
              </div>

              {/* Referenzen */}
              <Link
                href={`/${lang}/referenzen`}
                className={`flex items-center gap-3 rounded-lg no-underline text-[15px] ${
                  isActive(`/${lang}/referenzen`) ? "text-[#009ee3]" : "text-[#002d59]"
                }`}
                style={{ padding: "12px 16px", fontWeight: 700 }}
              >
                {dict.nav.referenzen}
              </Link>
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
