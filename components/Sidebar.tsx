"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { kategorien } from "../data/kategorien";
import type { Locale } from "../lib/i18n";
import type { Dictionary } from "../app/[lang]/dictionaries";
import { useState } from "react";

interface SidebarProps {
  lang: Locale;
  dict: Dictionary;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

function CategoryIcon({ icon, size = 20 }: { icon: string; size?: number }) {
  switch (icon) {
    case "factory":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 20V8l4-4v4l4-4v4l4-4v12" />
          <path d="M18 12h2a2 2 0 0 1 2 2v6" />
          <path d="M2 20h20" />
        </svg>
      );
    case "building":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
          <path d="M9 22V12h6v10" />
          <path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" />
        </svg>
      );
    case "road":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19L8 5" /><path d="M16 5l4 14" />
          <path d="M12 6v2" /><path d="M12 12v2" /><path d="M12 18v2" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Sidebar({
  lang,
  dict,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo area */}
      <div
        className="flex items-center gap-2 border-b border-[#e8edf5] shrink-0"
        style={{ height: 56, padding: collapsed ? "0 12px" : "0 20px" }}
      >
        <Link
          href={`/${lang}`}
          className="flex items-center gap-2 no-underline"
          onClick={onCloseMobile}
        >
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center bg-[#002d59] text-white text-[13px] shrink-0"
            style={{ fontWeight: 900 }}
          >
            K
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-none">
              <span className="text-[#002d59] text-[16px] tracking-tight" style={{ fontWeight: 900 }}>
                KORODUR
              </span>
              <span className="text-[#009ee3] text-[10px] uppercase tracking-wider" style={{ fontWeight: 700 }}>
                Sanierung
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3" style={{ padding: collapsed ? "12px 8px" : "12px 12px" }}>
        {/* Home link */}
        <Link
          href={`/${lang}`}
          onClick={onCloseMobile}
          className={`flex items-center gap-3 rounded-lg no-underline mb-1 transition-colors duration-150 ${
            pathname === `/${lang}` || pathname === `/${lang}/`
              ? "bg-[#009ee3]/10 text-[#009ee3]"
              : "text-[#002d59] hover:bg-[#f5f5f6]"
          }`}
          style={{
            padding: collapsed ? "10px 12px" : "10px 12px",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          {!collapsed && <span>{dict.nav.home}</span>}
        </Link>

        {/* Interactive tools */}
        {!collapsed && (
          <div
            className="text-[11px] uppercase tracking-wider text-[#002d59] opacity-40 mt-4 mb-2"
            style={{ fontWeight: 700, padding: "0 12px" }}
          >
            Tools
          </div>
        )}

        {collapsed && <div className="border-t border-[#e8edf5] my-2" />}

        {/* Wizard link */}
        <Link
          href={`/${lang}/wizard`}
          onClick={onCloseMobile}
          className={`flex items-center gap-3 rounded-lg no-underline mb-0.5 transition-colors duration-150 ${
            isActive(`/${lang}/wizard`)
              ? "bg-[#009ee3]/10 text-[#009ee3]"
              : "text-[#002d59] hover:bg-[#f5f5f6]"
          }`}
          style={{
            padding: collapsed ? "10px 12px" : "10px 12px",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          {!collapsed && <span>{dict.nav_wizard}</span>}
        </Link>

        {/* Konfigurator link */}
        <Link
          href={`/${lang}/konfigurator`}
          onClick={onCloseMobile}
          className={`flex items-center gap-3 rounded-lg no-underline mb-1 transition-colors duration-150 ${
            isActive(`/${lang}/konfigurator`)
              ? "bg-[#009ee3]/10 text-[#009ee3]"
              : "text-[#002d59] hover:bg-[#f5f5f6]"
          }`}
          style={{
            padding: collapsed ? "10px 12px" : "10px 12px",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          {!collapsed && <span>{dict.nav_konfigurator}</span>}
        </Link>

        {/* Portfolio section label */}
        {!collapsed && (
          <div
            className="text-[11px] uppercase tracking-wider text-[#002d59] opacity-40 mt-4 mb-2"
            style={{ fontWeight: 700, padding: "0 12px" }}
          >
            {dict.nav.portfolio}
          </div>
        )}

        {collapsed && <div className="border-t border-[#e8edf5] my-2" />}

        {/* Categories */}
        {kategorien.map((kat) => {
          const categoryHref = `/${lang}/portfolio/${kat.id}`;
          const active = isActive(categoryHref);
          const expanded = expandedCategories[kat.id] ?? active;
          const categoryLabel = dict.categories[kat.id as keyof typeof dict.categories] || kat.titel;

          return (
            <div key={kat.id} className="mb-0.5">
              {/* Category header */}
              <div className="flex items-center">
                <Link
                  href={categoryHref}
                  onClick={onCloseMobile}
                  className={`flex items-center gap-3 rounded-lg no-underline flex-1 min-w-0 transition-colors duration-150 ${
                    active
                      ? "bg-[#009ee3]/10 text-[#009ee3]"
                      : "text-[#002d59] hover:bg-[#f5f5f6]"
                  }`}
                  style={{
                    padding: collapsed ? "10px 12px" : "10px 12px",
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  <span className="shrink-0">
                    <CategoryIcon icon={kat.icon} size={18} />
                  </span>
                  {!collapsed && (
                    <span className="truncate">{categoryLabel}</span>
                  )}
                </Link>
                {!collapsed && kat.unterkategorien.length > 0 && (
                  <button
                    onClick={() => toggleCategory(kat.id)}
                    className="p-1.5 rounded hover:bg-[#f5f5f6] bg-transparent border-none cursor-pointer text-[#002d59] opacity-40 hover:opacity-70 transition-opacity shrink-0"
                    aria-label={expanded ? "Collapse" : "Expand"}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-transform duration-200"
                      style={{ transform: expanded ? "rotate(90deg)" : "rotate(0deg)" }}
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Subcategories */}
              {!collapsed && expanded && kat.unterkategorien.length > 0 && (
                <div className="ml-[42px] mb-1">
                  {kat.unterkategorien.map((sub) => {
                    const subHref = `/${lang}/portfolio/${kat.id}#${sub.id}`;
                    return (
                      <Link
                        key={sub.id}
                        href={subHref}
                        onClick={onCloseMobile}
                        className="block text-[13px] text-[#002d59] opacity-60 hover:opacity-100 hover:text-[#009ee3] no-underline py-1.5 transition-colors duration-150"
                        style={{ fontWeight: 600 }}
                      >
                        {sub.titel}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {!collapsed && <div className="border-t border-[#e8edf5] my-3" />}
        {collapsed && <div className="border-t border-[#e8edf5] my-2" />}

        {/* Referenzen link */}
        <Link
          href={`/${lang}/referenzen`}
          onClick={onCloseMobile}
          className={`flex items-center gap-3 rounded-lg no-underline transition-colors duration-150 ${
            isActive(`/${lang}/referenzen`)
              ? "bg-[#009ee3]/10 text-[#009ee3]"
              : "text-[#002d59] hover:bg-[#f5f5f6]"
          }`}
          style={{
            padding: collapsed ? "10px 12px" : "10px 12px",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          {!collapsed && <span>{dict.nav.referenzen}</span>}
        </Link>
      </nav>

      {/* Collapse toggle (desktop only) */}
      <div className="hidden lg:block border-t border-[#e8edf5] p-2">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-transparent border-none cursor-pointer text-[#002d59] opacity-40 hover:opacity-70 hover:bg-[#f5f5f6] transition-all duration-150"
          style={{ padding: "8px", fontWeight: 600, fontSize: 13 }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-200"
            style={{ transform: collapsed ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            <path d="M11 19l-7-7 7-7" />
            <path d="M18 19l-7-7 7-7" />
          </svg>
          {!collapsed && <span>Einklappen</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col bg-white border-r border-[#e8edf5] shrink-0 transition-all duration-300 overflow-hidden"
        style={{ width: collapsed ? 64 : 272 }}
        role="navigation"
        aria-label="Main navigation"
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 animate-overlay"
            onClick={onCloseMobile}
          />
          {/* Drawer */}
          <aside
            className="relative z-10 flex flex-col bg-white shadow-2xl animate-drawer"
            style={{ width: 280, maxWidth: "85vw" }}
            role="navigation"
            aria-label="Main navigation"
          >
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
