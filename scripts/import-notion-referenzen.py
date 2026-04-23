"""
Schritt 4a — Importiert Notion-Sanierungs-Refs in data/referenzen.ts.

Nimmt:
  - docs/cache/notion-sanierungen.json   (Notion-Rohdaten, 33 Einträge)
  - docs/cache/match-result.json         ('nur_notion' = zu importierende Titel)
  - docs/cache/app-referenzen.json       (existierende App-Slugs für Conflict-Check)

Schreibt:
  - data/referenzen.ts                   (neue Refs werden vor `];` angehängt)
  - docs/referenz-import-log.md          (Mapping Notion-URL ↔ App-Slug)

Bilder bleiben als Platzhalter (/images/referenzen/_placeholder.jpg) — kommen in 4b.
"""

from __future__ import annotations
import json
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NOTION_JSON = ROOT / "docs/cache/notion-sanierungen.json"
MATCH_JSON = ROOT / "docs/cache/match-result.json"
APP_JSON = ROOT / "docs/cache/app-referenzen.json"
TS_FILE = ROOT / "data/referenzen.ts"
LOG_FILE = ROOT / "docs/referenz-import-log.md"

PLACEHOLDER_BILD = "/images/referenzen/_placeholder.jpg"

# Notion → App-Enum-Mapping

SANIERUNGSART_MAP = {
    "Punktuell": "punktuell",
    "Großflächig": "grossflaechig",
}

EINSATZ_MAP = {
    "Lager & Logistik": "lager-logistik",
    "Industrie- & Produktionshalle": "industrie-produktion",
    "Lebensmittel": "lebensmittel",
    "Flugzeug": "flugzeug",
    "Parkdeck": "parkdeck",
    "Infrastruktur & Zufahrten": "infrastruktur-zufahrten",
    "Verkaufsräume": "verkaufsraeume",
    "Schwerindustrie": "schwerindustrie",
    # "Trinkwasser" wird gefiltert (out of scope)
}

DRINGLICHKEIT_MAP = {
    "Schnell": "schnell",
    "Mittel": "mittel",
    "Normal": "normal",
}

ZUSATZ_MAP = {
    "Chemikalienbeständigkeit": "chemikalienbestaendigkeit",
    "Tausalzbeständigkeit": "tausalzbestaendigkeit",
    "Rutschhemmung": "rutschhemmung",
    "Fleckenabwehr": "fleckenabwehr",
}

LAND_DEFAULT = "Deutschland"


def slugify_token(s: str) -> str:
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    s = re.sub(r"[^a-zA-Z0-9]+", "-", s).strip("-").lower()
    return s


def build_slug(title: str, ort: str, existing: set[str]) -> str:
    """Slug aus Hauptteil (vor Komma) + Ort, max 5 Tokens, mit Konflikt-Suffix."""
    # Hauptteil = vor erstem Komma (oder "(")
    head = re.split(r"[,(]", title, 1)[0].strip()
    head_slug = slugify_token(head)
    ort_slug = slugify_token(ort) if ort else ""

    # Tokens limitieren: max 4 aus Head + 1 aus Ort
    head_tokens = head_slug.split("-")[:4]
    base = "-".join(head_tokens)
    if ort_slug and ort_slug not in base.split("-"):
        # Ort dranhängen, falls noch nicht im Head enthalten
        base = f"{base}-{ort_slug.split('-')[0]}"
    base = base.strip("-")[:60]  # safety: max 60 Zeichen

    if base not in existing:
        return base
    # Konflikt: -2, -3, ...
    i = 2
    while f"{base}-{i}" in existing:
        i += 1
    return f"{base}-{i}"


def parse_einsatz(raw: str) -> list[str]:
    if not raw:
        return []
    try:
        items = json.loads(raw)
    except Exception:
        return []
    return [EINSATZ_MAP[i] for i in items if i in EINSATZ_MAP]


def parse_zusatz(raw: str) -> list[str]:
    if not raw:
        return []
    try:
        items = json.loads(raw)
    except Exception:
        return []
    return [ZUSATZ_MAP[i] for i in items if i in ZUSATZ_MAP]


def parse_produkte(raw: str) -> list[str]:
    """Notion-Produkte (multi_select JSON oder Freitext) → App-Produktnamen."""
    if not raw:
        return []
    try:
        items = json.loads(raw)
        if isinstance(items, list):
            return [str(p).strip() for p in items if str(p).strip()]
    except Exception:
        pass
    # Fallback: Freitext splitten
    return [p.strip() for p in re.split(r"[+,;&]| und ", raw) if p.strip()]


def split_bullets(s: str) -> list[str]:
    """Zerlegt einen Notion-Text in Bullet-Items (split auf Zeilen, • oder Bullet-Zeichen)."""
    if not s:
        return []
    # Erst auf Zeilen splitten, dann auf • / - Präfixe trimmen
    lines = re.split(r"\n+|•", s)
    items = []
    for ln in lines:
        ln = ln.strip().lstrip("-•·*").strip()
        if ln:
            items.append(ln)
    return items


def ts_string(s: str) -> str:
    """Stringify für TS-Quellcode (double-quoted)."""
    if s is None:
        return '""'
    s = str(s).replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n")
    return f'"{s}"'


def ts_string_array(items: list[str]) -> str:
    return "[" + ", ".join(ts_string(i) for i in items) + "]"


def ts_enum_array(items: list[str]) -> str:
    """Wie ts_string_array, aber für Enum-Werte (gleiche Quotierung)."""
    return "[" + ", ".join(ts_string(i) for i in items) + "]"


def render_ref_block(ref: dict) -> str:
    """Rendert ein Referenz-Objekt als TS-Source."""
    lines = []
    lines.append("  {")
    lines.append(f"    // notion: {ref['notion_url']}")
    lines.append(f"    id: {ts_string(ref['slug'])},")
    lines.append(f"    slug: {ts_string(ref['slug'])},")
    lines.append(f"    titel: {ts_string(ref['titel'])},")
    lines.append(f"    untertitel: {ts_string(ref['untertitel'])},")
    lines.append(f"    ort: {ts_string(ref['ort'])},")
    lines.append(f"    land: {ts_string(ref['land'])},")
    if ref.get('flaeche'):
        lines.append(f"    flaeche: {ts_string(ref['flaeche'])},")
    lines.append(f"    produkte: {ts_string_array(ref['produkte'])},")
    if ref['herausforderungen']:
        lines.append(f"    herausforderungen: [")
        for h in ref['herausforderungen']:
            lines.append(f"      {ts_string(h)},")
        lines.append(f"    ],")
    else:
        lines.append(f"    herausforderungen: [],")
    lines.append(f"    loesung: {ts_string(ref['loesung'])},")
    if ref['vorteile']:
        lines.append(f"    vorteile: [")
        for v in ref['vorteile']:
            lines.append(f"      {ts_string(v)},")
        lines.append(f"    ],")
    else:
        lines.append(f"    vorteile: [],")
    lines.append(f"    bild: {ts_string(ref['bild'])},")
    lines.append(f"    bildAlt: {ts_string(ref['bildAlt'])},")
    lines.append(f"    sanierungsart: {ts_string(ref['sanierungsart'])},")
    lines.append(f"    einsatzbereiche: {ts_enum_array(ref['einsatzbereiche'])},")
    lines.append(f"    zeitDringlichkeit: {ts_string(ref['zeitDringlichkeit'])},")
    lines.append(f"    zusatzfunktionen: {ts_enum_array(ref['zusatzfunktionen'])},")
    lines.append("  },")
    return "\n".join(lines)


def main():
    notion_all = json.load(open(NOTION_JSON))
    match = json.load(open(MATCH_JSON))
    app_refs = json.load(open(APP_JSON))

    nur_notion_titles = set(match["nur_notion"])
    notion_to_import = [n for n in notion_all if n.get("Objekttitel") in nur_notion_titles]
    print(f"Importiere {len(notion_to_import)} Notion-Refs.")

    existing_slugs = {r["slug"] for r in app_refs}
    new_refs = []
    log_rows = []

    for n in notion_to_import:
        title = n.get("Objekttitel", "").strip()
        ort = n.get("Ort", "").strip()
        land = n.get("Land", "").strip() or LAND_DEFAULT
        baujahr = (n.get("Baujahr", "") or "").strip()
        flaeche = (n.get("Fläche", "") or "").strip()
        kurz = (n.get("Kurzbeschreibung", "") or "").strip()
        herausf_raw = n.get("Herausforderung", "") or ""
        loesung = (n.get("Warum hat man sich für unsere Lösung entschieden?", "") or "").strip()
        ausgangs = (n.get("Ausgangssituation", "") or "").strip()

        sanierungsart = SANIERUNGSART_MAP.get(n.get("Sanierungsart", ""), "grossflaechig")
        einsatzbereiche = parse_einsatz(n.get("Einsatzbereich", "[]"))
        if not einsatzbereiche:
            # Default-Fallback (sollte selten sein, da Filter Trinkwasser-only ausgeschlossen hat)
            einsatzbereiche = ["industrie-produktion"]
        dringlich = DRINGLICHKEIT_MAP.get(n.get("Dringlichkeit", ""), "normal")
        zusatz = parse_zusatz(n.get("Zusatzfunktion", "[]"))
        produkte = parse_produkte(n.get("eingesetzte KORODUR Produkte", ""))

        slug = build_slug(title, ort, existing_slugs)
        existing_slugs.add(slug)

        herausforderungen = split_bullets(herausf_raw)
        # Untertitel aus Kurzbeschreibung (gekürzt) oder Baujahr-Hinweis
        untertitel = kurz[:120] if kurz else (f"Sanierung {baujahr}" if baujahr else "Referenzprojekt")

        # Wenn loesung leer: Ausgangssituation als Fallback
        if not loesung and ausgangs:
            loesung = ausgangs

        ref = {
            "notion_url": n.get("url", ""),
            "slug": slug,
            "titel": title,
            "untertitel": untertitel,
            "ort": ort,
            "land": land if land in ["Deutschland","Österreich","Schweiz","Italien","Frankreich",
                                      "Niederlande","Belgien","Polen","Ungarn","Rumänien","Estland",
                                      "Finnland","China","Neuseeland","Mexiko","USA","Kroatien",
                                      "Tschechien","UK","Litauen","UAE","Andorra"] else (land or LAND_DEFAULT),
            "flaeche": flaeche,
            "produkte": produkte,
            "herausforderungen": herausforderungen,
            "loesung": loesung,
            "vorteile": [],  # in Notion meist nicht strukturiert vorhanden
            "bild": PLACEHOLDER_BILD,
            "bildAlt": f"{title} (Bild folgt)",
            "sanierungsart": sanierungsart,
            "einsatzbereiche": einsatzbereiche,
            "zeitDringlichkeit": dringlich,
            "zusatzfunktionen": zusatz,
        }
        new_refs.append(ref)
        log_rows.append((slug, title, n.get("url", "")))

    # In data/referenzen.ts vor `];` einfügen
    ts_source = TS_FILE.read_text()
    block = "\n".join(render_ref_block(r) for r in new_refs)
    new_section = (
        "\n\n  // === Aus Notion-Import (2026-04-23) ===\n"
        "  // Strukturfelder direkt aus Notion-DB übernommen.\n"
        "  // Bilder sind Platzhalter — finale Bilder kommen via Schritt 4b.\n"
        f"{block}\n"
    )
    if "// === Aus Notion-Import" in ts_source:
        print("⚠ Bereits importiert — überspringe TS-Append. Nur Log/Validate.")
    else:
        # Insert vor schließendem `];` des `referenzen`-Arrays
        ts_source = re.sub(r"\n\];", new_section + "\n];", ts_source, count=1)
        TS_FILE.write_text(ts_source)
        print(f"data/referenzen.ts erweitert um {len(new_refs)} Einträge.")

    # Log
    log_lines = [
        "# Referenz-Import-Log (Schritt 4a)",
        "",
        f"**Datum:** 2026-04-23 · **Importierte Refs:** {len(new_refs)}",
        "",
        "| App-Slug | Titel | Notion-URL |",
        "|---|---|---|",
    ]
    for slug, title, url in log_rows:
        log_lines.append(f"| `{slug}` | {title} | {url} |")
    LOG_FILE.write_text("\n".join(log_lines))
    print(f"Wrote {LOG_FILE}")


if __name__ == "__main__":
    main()
