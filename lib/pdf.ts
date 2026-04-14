import { jsPDF } from "jspdf";
import type { Referenz } from "@/data/types";

interface ProduktInfo {
  name: string;
  kurzbeschreibung: string;
  besonderheiten: string[];
  verarbeitung?: { besonderheiten: string };
}

const NAVY = "#002d59";
const CYAN = "#009ee3";
const PAGE_WIDTH = 210;
const MARGIN = 20;
const CONTENT_WIDTH = PAGE_WIDTH - 2 * MARGIN;
const MAX_Y = 270;

function checkPageOverflow(doc: jsPDF, y: number): number {
  if (y > MAX_Y) {
    doc.addPage();
    return 30;
  }
  return y;
}

export async function generateReferenzPdf(
  referenz: Referenz,
  produkt: ProduktInfo | undefined,
  bildUrl: string
): Promise<void> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  // ── Header ──
  doc.setFillColor(0, 45, 89);
  doc.rect(0, 0, PAGE_WIDTH, 36, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text("KORODUR", MARGIN, 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Sanierungssysteme | Referenz-Datenblatt", MARGIN, 24);

  let y = 48;

  // ── Title ──
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(0, 45, 89);
  const titleLines = doc.splitTextToSize(referenz.titel, CONTENT_WIDTH);
  doc.text(titleLines, MARGIN, y);
  y += titleLines.length * 8 + 3;

  // ── Subtitle ──
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  const subtitleLines = doc.splitTextToSize(referenz.untertitel, CONTENT_WIDTH);
  doc.text(subtitleLines, MARGIN, y);
  y += subtitleLines.length * 5 + 6;

  // ── Location & Area meta ──
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(0, 158, 227);
  let metaText = `${referenz.ort}, ${referenz.land}`;
  if (referenz.flaeche) metaText += `  |  ${referenz.flaeche}`;
  doc.text(metaText, MARGIN, y);
  y += 10;

  // ── Reference image ──
  try {
    const response = await fetch(bildUrl);
    const blob = await response.blob();
    const dataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });

    const imgWidth = CONTENT_WIDTH;
    const imgHeight = imgWidth * (9 / 21); // 21:9 aspect
    y = checkPageOverflow(doc, y + imgHeight);
    doc.addImage(dataUrl, "JPEG", MARGIN, y, imgWidth, imgHeight);
    y += imgHeight + 10;
  } catch {
    // Image failed to load — skip silently
    y += 4;
  }

  // ── Herausforderungen ──
  y = checkPageOverflow(doc, y);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(0, 45, 89);
  doc.text("Herausforderungen", MARGIN, y);
  y += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  for (const h of referenz.herausforderungen) {
    y = checkPageOverflow(doc, y);
    const lines = doc.splitTextToSize(h, CONTENT_WIDTH - 8);
    doc.text("\u2022", MARGIN, y);
    doc.text(lines, MARGIN + 6, y);
    y += lines.length * 5 + 3;
  }
  y += 4;

  // ── Lösung ──
  y = checkPageOverflow(doc, y);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(0, 45, 89);
  doc.text("Lösung", MARGIN, y);
  y += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  const loesungLines = doc.splitTextToSize(referenz.loesung, CONTENT_WIDTH);
  for (const line of loesungLines) {
    y = checkPageOverflow(doc, y);
    doc.text(line, MARGIN, y);
    y += 5;
  }
  y += 6;

  // ── Vorteile ──
  y = checkPageOverflow(doc, y);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(0, 45, 89);
  doc.text("Vorteile", MARGIN, y);
  y += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  for (const v of referenz.vorteile) {
    y = checkPageOverflow(doc, y);
    const lines = doc.splitTextToSize(v, CONTENT_WIDTH - 8);
    doc.text("\u2713", MARGIN, y);
    doc.text(lines, MARGIN + 6, y);
    y += lines.length * 5 + 3;
  }
  y += 4;

  // ── Product info ──
  if (produkt) {
    y = checkPageOverflow(doc, y);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(0, 45, 89);
    doc.text(`Produkt: ${produkt.name}`, MARGIN, y);
    y += 7;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);
    const descLines = doc.splitTextToSize(produkt.kurzbeschreibung, CONTENT_WIDTH);
    for (const line of descLines) {
      y = checkPageOverflow(doc, y);
      doc.text(line, MARGIN, y);
      y += 5;
    }
    y += 3;

    if (produkt.besonderheiten.length > 0) {
      y = checkPageOverflow(doc, y);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Besonderheiten:", MARGIN, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      for (const b of produkt.besonderheiten) {
        y = checkPageOverflow(doc, y);
        const lines = doc.splitTextToSize(b, CONTENT_WIDTH - 8);
        doc.text("\u2022", MARGIN, y);
        doc.text(lines, MARGIN + 6, y);
        y += lines.length * 5 + 3;
      }
      y += 3;
    }

    if (produkt.verarbeitung?.besonderheiten) {
      y = checkPageOverflow(doc, y);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Verarbeitungshinweis:", MARGIN, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      const vLines = doc.splitTextToSize(produkt.verarbeitung.besonderheiten, CONTENT_WIDTH);
      for (const line of vLines) {
        y = checkPageOverflow(doc, y);
        doc.text(line, MARGIN, y);
        y += 5;
      }
      y += 4;
    }
  }

  // ── Footer ──
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFillColor(0, 45, 89);
    doc.rect(0, 285, PAGE_WIDTH, 12, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.text(
      "KORODUR International GmbH | Wernher-von-Braun-Str. 4 | 84544 Aschau am Inn | www.korodur.de | info@korodur.de",
      PAGE_WIDTH / 2,
      291,
      { align: "center" }
    );
    doc.text(`Seite ${i} / ${pageCount}`, PAGE_WIDTH - MARGIN, 291, { align: "right" });
  }

  doc.save(`KORODUR-Referenz-${referenz.slug}.pdf`);
}
