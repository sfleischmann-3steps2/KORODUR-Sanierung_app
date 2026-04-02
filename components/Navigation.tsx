"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50 bg-white border-b border-[#e8edf5]"
      style={{ height: 72 }}
    >
      <div className="mx-auto flex items-center justify-between h-full" style={{ maxWidth: 1320, padding: "0 32px" }}>
        <Link href="/" className="flex items-center gap-2 no-underline">
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
            href="/portfolio"
            className="text-[#002d59] text-[16px] font-bold no-underline hover:text-[#009ee3] transition-colors duration-200"
          >
            Portfolio
          </Link>
          <Link
            href="/referenzen"
            className="text-white text-[15px] no-underline px-[24px] py-[10px] rounded-[6px] bg-[#009ee3] hover:bg-[#0090d0] transition-colors duration-200"
            style={{ fontWeight: 800 }}
          >
            Referenzen
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-[5px] p-2 bg-transparent border-none cursor-pointer"
          aria-label="Menü öffnen"
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
              href="/portfolio"
              onClick={() => setMenuOpen(false)}
              className="text-[#002d59] text-[16px] font-bold no-underline py-3 border-b border-[#f5f5f6]"
            >
              Portfolio
            </Link>
            <Link
              href="/referenzen"
              onClick={() => setMenuOpen(false)}
              className="text-[#009ee3] text-[16px] font-bold no-underline py-3"
            >
              Referenzen
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
