"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "../lib/i18n";
import { LOCALES } from "../lib/i18n";

export default function LanguageSwitcher({ lang }: { lang: Locale }) {
  const pathname = usePathname();

  // Replace the locale segment in the current path
  const getLocalePath = (targetLocale: string) => {
    // pathname is e.g. "/de/portfolio/industrieboden"
    const rest = pathname.replace(/^\/(de|en|fr|pl)/, "");
    return `/${targetLocale}${rest}`;
  };

  return (
    <div className="flex items-center gap-0.5 bg-[#f5f5f6] rounded-lg p-0.5">
      {LOCALES.map((l) => (
        <Link
          key={l}
          href={getLocalePath(l)}
          className={`text-[12px] uppercase px-2.5 py-1 rounded-md no-underline transition-all duration-200 ${
            l === lang
              ? "text-white bg-[#009ee3] shadow-sm"
              : "text-[#002d59] opacity-50 hover:opacity-80 hover:bg-white/60"
          }`}
          style={{ fontWeight: 700, letterSpacing: "0.05em" }}
        >
          {l}
        </Link>
      ))}
    </div>
  );
}
