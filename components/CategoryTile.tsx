"use client";

import Link from "next/link";

interface CategoryTileProps {
  title: string;
  description: string;
  icon: string;
  href: string;
}

function IconSVG({ name }: { name: string }) {
  switch (name) {
    case "factory":
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#009ee3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 20V8l4-4v4l4-4v4l4-4v12" />
          <path d="M18 12h2a2 2 0 0 1 2 2v6" />
          <path d="M2 20h20" />
          <rect x="12" y="12" width="2" height="4" />
          <rect x="6" y="12" width="2" height="4" />
        </svg>
      );
    case "building":
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#009ee3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
          <path d="M9 22V12h6v10" />
          <path d="M8 6h.01" />
          <path d="M16 6h.01" />
          <path d="M12 6h.01" />
          <path d="M12 10h.01" />
          <path d="M8 10h.01" />
          <path d="M16 10h.01" />
        </svg>
      );
    case "road":
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#009ee3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19L8 5" />
          <path d="M16 5l4 14" />
          <path d="M12 6v2" />
          <path d="M12 12v2" />
          <path d="M12 18v2" />
        </svg>
      );
    default:
      return null;
  }
}

export default function CategoryTile({ title, description, icon, href }: CategoryTileProps) {
  return (
    <Link href={href} className="no-underline group block">
      <div
        className="bg-white p-8 flex flex-col items-start gap-5 transition-all duration-200 group-hover:-translate-y-1.5"
        style={{
          borderRadius: 14,
          boxShadow: "0 8px 40px rgba(0,45,89,0.10)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 48px rgba(0,45,89,0.16)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 40px rgba(0,45,89,0.10)";
        }}
      >
        <div
          className="w-[56px] h-[56px] flex items-center justify-center"
          style={{ borderRadius: "50%", backgroundColor: "#f5f5f6" }}
        >
          <IconSVG name={icon} />
        </div>
        <h3 className="text-[#002d59] text-[22px] m-0" style={{ fontWeight: 900 }}>
          {title}
        </h3>
        <p className="text-[#002d59] text-[16px] leading-[1.65] m-0 opacity-75">
          {description}
        </p>
        <span className="text-[#009ee3] text-[15px] font-bold flex items-center gap-1">
          Mehr erfahren
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 3l5 5-5 5" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
