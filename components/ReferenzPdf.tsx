"use client";

import { useState } from "react";
import type { Referenz } from "@/data/types";
import { withBasePath } from "@/lib/basePath";

interface ProduktInfo {
  name: string;
  kurzbeschreibung: string;
  besonderheiten: string[];
  verarbeitung?: { besonderheiten: string };
}

interface ReferenzPdfProps {
  referenz: Referenz;
  produkt: ProduktInfo | undefined;
}

export default function ReferenzPdf({ referenz, produkt }: ReferenzPdfProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const { generateReferenzPdf } = await import("@/lib/pdf");
      const bildUrl = withBasePath(referenz.bild);
      await generateReferenzPdf(referenz, produkt, bildUrl);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center gap-2 text-[14px] no-underline rounded-[6px] transition-colors duration-200 cursor-pointer hover:bg-[#002d59] hover:text-white disabled:opacity-50"
      style={{
        border: "2px solid #002d59",
        color: "#002d59",
        backgroundColor: "transparent",
        padding: "10px 20px",
        fontWeight: 700,
      }}
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
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      {loading ? "PDF wird erstellt..." : "PDF herunterladen"}
    </button>
  );
}
