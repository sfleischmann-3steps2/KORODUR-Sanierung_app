#!/usr/bin/env python3
"""
Extrahiert Galerie-Bilder aus den Präsentations-PDFs für alle 29 Referenzen.

Filterlogik:
- Nur Bilder mit Breite 300-900px UND Höhe 300-900px (echte Fotos)
- Dateigröße > 20 KB (filtert einfarbige Flächen raus)
- Dedupliziert nach xref (gleiche Grafik auf mehreren Folien)

Output: /public/images/referenzen/{slug}-{n}.jpg  (n = 2, 3, 4, ...)
        Bild 1 = bestehendes Hero-Bild (wird nicht überschrieben)

Usage:
    python scripts/extract_gallery_images.py [--dry-run]
"""

import fitz
import os
import sys
import json

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PDF_TEIL1 = os.path.join(BASE_DIR, "FINAL_Sanierung_V1_DE 1_RV Teil 1 (2).pptx.pdf")
PDF_TEIL2 = os.path.join(BASE_DIR, "FINAL_Sanierung_V1_DE 1_RV Teil 2 (1).pptx.pdf")
OUTPUT_DIR = os.path.join(BASE_DIR, "public", "images", "referenzen")

# Mapping: slug → (pdf_path, [0-indexed page numbers])
# Jede Referenz hat 3 Folien: Titelfolie + 2 Inhaltsfolien
# Fotos sind auf den Inhaltsfolien (Seite 2 + 3 jeder Referenz)
REFERENZ_PAGES = {
    # --- Teil 1 ---
    "antolin-wochenend-sanierung":     (PDF_TEIL1, [12, 13, 14]),
    "weag-entsorgungsbetrieb":         (PDF_TEIL1, [15, 16, 17]),
    "wochenend-sanierung-werkstatt":   (PDF_TEIL1, [18, 19, 20]),
    "strandkorbhalle-sylt":            (PDF_TEIL1, [21, 22, 23]),
    "kleemann-produktionshalle":       (PDF_TEIL1, [24, 25, 26]),
    "loosen-werkzeug-klausen":         (PDF_TEIL1, [27, 28, 29]),
    "monheim-produktionsflaeche":      (PDF_TEIL1, [30, 31, 32]),
    "helipad-sanierung-polen":         (PDF_TEIL1, [39, 40, 41]),
    "guben-produktionshalle":          (PDF_TEIL1, [43, 44, 45]),
    "nike-store-polen":                (PDF_TEIL1, [46, 47, 48]),
    "obstplantage-ibbenbueren":        (PDF_TEIL1, [50, 51, 52]),
    "sanierung-einer-sanierung":       (PDF_TEIL1, [53, 54, 55]),
    "lkw-waschstrasse":                (PDF_TEIL1, [56, 57, 58]),
    # --- Teil 2 ---
    "dhl-ueberadebruecken":            (PDF_TEIL2, [7, 8, 9]),
    "fugensanierung-lyreco":           (PDF_TEIL2, [10, 11, 12]),
    "absenksteine-tankstelle":         (PDF_TEIL2, [13, 14, 15]),
    "treppenstufen-sanierung":         (PDF_TEIL2, [16, 17, 18]),
    "sinusfugen-sanierung":            (PDF_TEIL2, [19, 20, 21]),
    "trennfugen-bohnenkamp":           (PDF_TEIL2, [22, 23, 24]),
    "lkw-einstellplatz-berlin":        (PDF_TEIL2, [25, 26, 27]),
    "hafen-catania":                   (PDF_TEIL2, [31, 32, 33]),
    "theodor-heuss-bruecke":           (PDF_TEIL2, [34, 35, 36]),
    "autohaus-versmold":               (PDF_TEIL2, [37, 38, 39]),
    "hubschrauber-landeplatz-finnland":(PDF_TEIL2, [40, 41, 42]),
    "lkw-umfahrt-darmstadt":           (PDF_TEIL2, [43, 44, 45]),
    "parkhaus-flughafen-zuerich":      (PDF_TEIL2, [46, 47, 48]),
    "trinkwasser-hochbehaelter":       (PDF_TEIL2, [49, 50, 51]),
    "trinkwasserbehaelter-bad-nauheim":(PDF_TEIL2, [52, 53, 54]),
    "trinkwasserturm-budapest":        (PDF_TEIL2, [55, 56, 57]),
}

# Existing hero image basenames (without extension) per slug
HERO_BASENAMES = {
    "antolin-wochenend-sanierung": "antolin",
    "weag-entsorgungsbetrieb": "weag",
    "wochenend-sanierung-werkstatt": "werkstatt-neutraubling",
    "strandkorbhalle-sylt": "strandkorbhalle-sylt",
    "kleemann-produktionshalle": "kleemann",
    "loosen-werkzeug-klausen": "loosen-klausen",
    "monheim-produktionsflaeche": "monheim",
    "helipad-sanierung-polen": "helipad-polen",
    "guben-produktionshalle": "guben",
    "nike-store-polen": "nike-store",
    "obstplantage-ibbenbueren": "obstplantage-ibbenbueren",
    "sanierung-einer-sanierung": "sanierung-einer-sanierung",
    "lkw-waschstrasse": "lkw-waschstrasse",
    "dhl-ueberadebruecken": "dhl",
    "fugensanierung-lyreco": "lyreco",
    "absenksteine-tankstelle": "absenksteine-tankstelle",
    "treppenstufen-sanierung": "treppenstufen",
    "sinusfugen-sanierung": "sinusfugen",
    "trennfugen-bohnenkamp": "trennfugen-bohnenkamp",
    "lkw-einstellplatz-berlin": "lkw-einstellplatz-berlin",
    "hafen-catania": "catania",
    "theodor-heuss-bruecke": "theodor-heuss-bruecke",
    "autohaus-versmold": "autohaus-versmold",
    "hubschrauber-landeplatz-finnland": "helipad-finnland",
    "lkw-umfahrt-darmstadt": "lkw-umfahrt-darmstadt",
    "parkhaus-flughafen-zuerich": "zuerich-parkhaus",
    "trinkwasser-hochbehaelter": "haidberg",
    "trinkwasserbehaelter-bad-nauheim": "bad-nauheim",
    "trinkwasserturm-budapest": "trinkwasserturm-budapest",
}


def is_photo(pix, raw_size_bytes):
    """Filter: ist dieses Bild ein echtes Foto?"""
    w, h = pix.width, pix.height
    # Zu klein = Icon/Logo
    if w < 300 or h < 300:
        return False
    # Exakt 1920x1080 = Folienhintergrund (Navy oder Weiß/Grau)
    if w == 1920 and h == 1080:
        return False
    # Dateigröße: einfarbige Flächen und Grafiken sind sehr klein
    if raw_size_bytes < 20_000:
        return False
    return True


def extract_for_referenz(slug, pdf_path, pages, dry_run=False):
    """Extrahiert Fotos für eine Referenz."""
    doc = fitz.open(pdf_path)
    basename = HERO_BASENAMES.get(slug, slug)

    seen_xrefs = set()
    photos = []

    for page_idx in pages:
        if page_idx >= len(doc):
            print(f"  WARNUNG: Seite {page_idx+1} existiert nicht in {os.path.basename(pdf_path)}")
            continue

        page = doc[page_idx]
        images = page.get_images(full=True)

        for img in images:
            xref = img[0]
            if xref in seen_xrefs:
                continue
            seen_xrefs.add(xref)

            try:
                pix = fitz.Pixmap(doc, xref)
                # CMYK → RGB
                if pix.n > 4:
                    pix = fitz.Pixmap(fitz.csRGB, pix)

                raw_bytes = pix.tobytes("jpeg")

                if is_photo(pix, len(raw_bytes)):
                    photos.append((pix, raw_bytes, pix.width, pix.height))

            except Exception as e:
                pass  # skip broken images

    doc.close()

    if not photos:
        print(f"  {slug}: KEINE Fotos gefunden!")
        return []

    # Save photos as JPEGs, starting at -2 (hero = -1)
    saved = []
    for i, (pix, raw_bytes, w, h) in enumerate(photos):
        num = i + 2  # hero is implicitly #1
        filename = f"{basename}-{num}.jpg"
        filepath = os.path.join(OUTPUT_DIR, filename)

        if dry_run:
            print(f"  → {filename} ({w}x{h}, {len(raw_bytes)/1024:.0f} KB)")
        else:
            with open(filepath, "wb") as f:
                f.write(raw_bytes)
            print(f"  → {filename} ({w}x{h}, {len(raw_bytes)/1024:.0f} KB)")

        saved.append(f"/images/referenzen/{filename}")

    return saved


def main():
    dry_run = "--dry-run" in sys.argv

    if dry_run:
        print("=== DRY RUN — keine Dateien werden geschrieben ===\n")
    else:
        os.makedirs(OUTPUT_DIR, exist_ok=True)

    results = {}
    total_images = 0

    for slug, (pdf_path, pages) in REFERENZ_PAGES.items():
        page_nums = ", ".join(str(p+1) for p in pages)
        print(f"\n{slug} (Seiten {page_nums}):")
        saved = extract_for_referenz(slug, pdf_path, pages, dry_run)
        results[slug] = saved
        total_images += len(saved)

    # Summary
    print(f"\n{'='*60}")
    print(f"Zusammenfassung: {total_images} Galerie-Bilder für {len(results)} Referenzen")
    print(f"{'='*60}")

    for slug, images in results.items():
        print(f"  {slug}: {len(images)} Bilder")

    # Write mapping JSON for later use in data update
    mapping_path = os.path.join(BASE_DIR, "docs", "gallery-mapping.json")
    if not dry_run:
        with open(mapping_path, "w") as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        print(f"\nMapping gespeichert: {mapping_path}")


if __name__ == "__main__":
    main()
