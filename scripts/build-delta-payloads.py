"""
Schritt 2 — Baut Notion-Page-Payloads für die App-Refs aus C (nur App).

Input:
  - docs/cache/app-referenzen.json   (von dump-referenzen-json.ts)
  - docs/cache/match-result.json     (Liste der Slugs in C nur_app)

Output:
  - docs/cache/delta-payloads.json   (Liste der Payloads zur MCP-Übergabe)
  - docs/referenz-delta-plan.md      (lesbare Vorschau für menschliche Sichtprüfung)

Mapping-Konventionen siehe Inline-Kommentare.
"""

from __future__ import annotations
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
APP_JSON = ROOT / "docs/cache/app-referenzen.json"
MATCH_JSON = ROOT / "docs/cache/match-result.json"
PAYLOADS_OUT = ROOT / "docs/cache/delta-payloads.json"
PLAN_OUT = ROOT / "docs/referenz-delta-plan.md"

# Notion DataSource-ID des Referenzverzeichnisses
DATA_SOURCE_ID = "2e7670e1-9e1a-80d1-b73d-000b26167428"

# === Mapping-Tabellen ===

SANIERUNGSART = {
    "punktuell": "Punktuell",
    "grossflaechig": "Großflächig",
}

EINSATZ = {
    "lager-logistik": "Lager & Logistik",
    "industrie-produktion": "Industrie- & Produktionshalle",
    "lebensmittel": "Lebensmittel",
    "flugzeug": "Flugzeug",
    "parkdeck": "Parkdeck",
    "infrastruktur-zufahrten": "Infrastruktur & Zufahrten",
    "verkaufsraeume": "Verkaufsräume",
    "schwerindustrie": "Schwerindustrie",
}

DRINGLICHKEIT = {
    "schnell": "Schnell",
    "mittel": "Mittel",
    "normal": "Normal",
}

ZUSATZ = {
    "chemikalienbestaendigkeit": "Chemikalienbeständigkeit",
    "tausalzbestaendigkeit": "Tausalzbeständigkeit",
    "rutschhemmung": "Rutschhemmung",
    "fleckenabwehr": "Fleckenabwehr",
}

LAND_NOTION = {
    "Deutschland", "Österreich", "Schweiz", "Italien", "Frankreich", "Niederlande",
    "Belgien", "Polen", "Ungarn", "Rumänien", "Estland", "Finnland", "China",
    "Neuseeland", "Mexiko", "USA", "Kroatien", "Tschechien", "UK", "Litauen",
    "UAE", "Andorra",
}

# Produkt-Mapping App→Notion-Option-Name. None bedeutet "keine Entsprechung in DB".
PRODUKT_MAP = {
    "NEODUR HE 65": "NEODUR HE 65",
    "NEODUR HE 60 rapid": "NEODUR HE 60 rapid",
    "NEODUR HE 65 Plus": "NEODUR HE 65 Plus SVS 5",  # nächstes Notion-Match
    "NEODUR Level": "NEODUR Level",
    "KORODUR HB 5 rapid": "HB 5 rapid",
    "KORODUR PC": "KORODUR PC",
    "KOROCRETE Schnellbeton": "KOROCRETE Schnellbeton",
    "KOROMINERAL CURE": "KOROMINERAL",
    "TRU Self-Leveling": "TRU Self-Leveling",
    "Rapid Set MORTAR MIX": "Rapid Set MORTAR MIX",
    "Rapid Set MORTAR MIX DUR": "Rapid Set MORTAR MIX",  # Fallback
    "Rapid Set CONCRETE MIX": "Rapid Set CONCRETE MIX",
    "Rapid Set CEMENT ALL": "Rapid Set Cement All",
    "ASPHALT REPAIR MIX": "Asphalt Repair Mix",
    # Nicht in Notion-DB:
    "KORODUR FSCem Screed": None,
    "KOROCURE": None,
    "KOROTEX": None,
    "Epoxidharz-System": None,
}


def normalize_land(app_land: str) -> "str | None":
    """App-Land kann z.B. 'Sizilien, Italien' oder 'Deutschland' sein. Mappen auf Notion-Land."""
    if not app_land:
        return None
    # Letzten Teil nach Komma nehmen (Region, Land)
    cand = app_land.split(",")[-1].strip()
    if cand in LAND_NOTION:
        return cand
    # Sonderfälle
    if "Polen" in cand:
        return "Polen"
    if "Italien" in cand:
        return "Italien"
    if "Schweiz" in cand:
        return "Schweiz"
    if "Deutschland" in cand:
        return "Deutschland"
    return None


def normalize_ort(ort: str, land: str) -> str:
    """App-Ort 'Deutschland, Deutschland' säubern: leer wenn = Land."""
    if not ort:
        return ""
    o = ort.strip()
    # Strip Land-Token vom Ende ", Deutschland" o.ä.
    parts = [p.strip() for p in o.split(",")]
    if parts and parts[-1] in LAND_NOTION:
        parts.pop()
    cleaned = ", ".join(parts).strip()
    if cleaned in LAND_NOTION:
        return ""
    return cleaned


def build_objekttitel(app: dict) -> str:
    """Notion-Objekttitel: 'Titel, Ort (Baujahr)' oder Titel allein."""
    titel = app["titel"]
    ort = normalize_ort(app.get("ort", ""), app.get("land", ""))
    parts = [titel]
    if ort:
        parts.append(ort)
    return ", ".join(parts)


def map_produkte(app_prods: list[str]) -> tuple[list[str], list[str]]:
    """Gibt (notion_options, unmapped) zurück."""
    notion_opts = []
    unmapped = []
    for p in app_prods:
        if p in PRODUKT_MAP:
            mapped = PRODUKT_MAP[p]
            if mapped is None:
                unmapped.append(p)
            elif mapped not in notion_opts:
                notion_opts.append(mapped)
        else:
            unmapped.append(p)
    return notion_opts, unmapped


def build_content(app: dict, unmapped_produkte: list[str]) -> str:
    """Notion-Markdown für den Page-Body."""
    lines = []
    lines.append(f"## {app['titel']}")
    lines.append("")
    lines.append(f"_{app.get('untertitel', '')}_")
    lines.append("")
    if app.get("vorteile"):
        lines.append("### Vorteile aus App-Sicht")
        for v in app["vorteile"]:
            lines.append(f"- {v}")
        lines.append("")
    return "\n".join(lines)


def build_weitere_hinweise(app: dict, unmapped_produkte: list[str]) -> str:
    parts = []
    parts.append("Importiert aus App-Referenzverzeichnis (data/referenzen.ts) am 2026-04-23 zur Reconciliation App ↔ Notion.")
    parts.append(f"App-Slug: {app['slug']}")
    parts.append(f"App-Bild-Pfad: /public/images/referenzen/{app['slug']}.jpg (+ Galerie -2 bis -N)")
    if unmapped_produkte:
        parts.append("")
        parts.append("App-Produkte ohne direkte Notion-Entsprechung (bitte ergänzen oder neue Multi-Select-Option anlegen):")
        for p in unmapped_produkte:
            parts.append(f"  • {p}")
    return "\n".join(parts)


def build_payload(app: dict) -> dict:
    titel = build_objekttitel(app)
    sanierungsart = SANIERUNGSART.get(app.get("sanierungsart", ""), "")
    einsatz = [EINSATZ[a] for a in app.get("einsatzbereiche", []) if a in EINSATZ]
    dringlich = DRINGLICHKEIT.get(app.get("zeitDringlichkeit", ""), "")
    zusatz = [ZUSATZ[z] for z in app.get("zusatzfunktionen", []) if z in ZUSATZ]
    land = normalize_land(app.get("land", ""))
    ort = normalize_ort(app.get("ort", ""), app.get("land", ""))
    produkte_notion, produkte_unmapped = map_produkte(app.get("produkte", []))

    herausf = "\n".join(f"• {h}" for h in app.get("herausforderungen", []))
    loesung = app.get("loesung", "")
    untertitel = app.get("untertitel", "")
    flaeche = app.get("flaeche", "") or ""

    properties = {
        "Objekttitel": titel,
        "Archiv: Ort": ort,
        "Neubau oder Sanierung?": "Sanierung",
        "Sanierungsart": sanierungsart,
        "Dringlichkeit": dringlich,
        "Einsatzbereich": json.dumps(einsatz, ensure_ascii=False),
        "Zusatzfunktion": json.dumps(zusatz, ensure_ascii=False),
        "Kurzbeschreibung": untertitel,
        "Herausforderung": herausf,
        "Warum hat man sich für unsere Lösung entschieden?": loesung,
        "Fläche": flaeche,
        "weitere Hinweise, die nur wir kennen": build_weitere_hinweise(app, produkte_unmapped),
        "Status": "durch AI bearbeitet",
    }
    if land:
        properties["Land"] = land
    if produkte_notion:
        properties["eingesetzte KORODUR Produkte"] = json.dumps(produkte_notion, ensure_ascii=False)

    return {
        "app_slug": app["slug"],
        "properties": properties,
        "content": build_content(app, produkte_unmapped),
        "_meta": {
            "produkte_unmapped": produkte_unmapped,
            "land_unresolved": app.get("land") if not land else None,
        },
    }


def main():
    apps = json.load(open(APP_JSON))
    match = json.load(open(MATCH_JSON))
    delta_slugs = set(match["nur_app"])
    delta_apps = [a for a in apps if a["slug"] in delta_slugs]
    print(f"Building payloads for {len(delta_apps)} delta refs...")

    payloads = [build_payload(a) for a in delta_apps]
    PAYLOADS_OUT.write_text(json.dumps(payloads, indent=2, ensure_ascii=False))
    print(f"Wrote {PAYLOADS_OUT}")

    # Lesbarer Vorschau-Bericht
    lines = ["# Delta-Writeback Plan (Schritt 2)", ""]
    lines.append(f"**Stand:** 2026-04-23 · **Anzahl neuer Notion-Pages:** {len(payloads)}")
    lines.append("")
    lines.append(f"Ziel-Datasource: `{DATA_SOURCE_ID}` (🚧 Referenzverzeichnis)")
    lines.append("")
    lines.append("## Globale Hinweise")
    lines.append("")
    unmapped_all = sorted({p for pl in payloads for p in pl["_meta"]["produkte_unmapped"]})
    if unmapped_all:
        lines.append("**Produkte ohne Notion-Entsprechung** (kommen nur in `weitere Hinweise` vor):")
        for p in unmapped_all:
            lines.append(f"- {p}")
        lines.append("")
    land_unres = [pl for pl in payloads if pl["_meta"]["land_unresolved"]]
    if land_unres:
        lines.append("**Land konnte nicht aufgelöst werden:**")
        for pl in land_unres:
            lines.append(f"- `{pl['app_slug']}` — App.land = {pl['_meta']['land_unresolved']!r}")
        lines.append("")

    lines.append("## Pro Eintrag")
    lines.append("")
    for pl in payloads:
        p = pl["properties"]
        lines.append(f"### `{pl['app_slug']}` → **{p['Objekttitel']}**")
        lines.append("")
        lines.append(f"- Ort: `{p.get('Archiv: Ort','')}` · Land: `{p.get('Land','—')}`")
        lines.append(f"- Sanierungsart: `{p.get('Sanierungsart','')}` · Dringlichkeit: `{p.get('Dringlichkeit','')}`")
        lines.append(f"- Einsatzbereich: `{p.get('Einsatzbereich','[]')}`")
        lines.append(f"- Zusatzfunktion: `{p.get('Zusatzfunktion','[]')}`")
        lines.append(f"- Produkte: `{p.get('eingesetzte KORODUR Produkte','[]')}`")
        if pl['_meta']['produkte_unmapped']:
            lines.append(f"- ⚠ unmapped: {', '.join(pl['_meta']['produkte_unmapped'])}")
        lines.append(f"- Fläche: `{p.get('Fläche','—')}`")
        lines.append("")

    PLAN_OUT.write_text("\n".join(lines))
    print(f"Wrote {PLAN_OUT}")


if __name__ == "__main__":
    main()
