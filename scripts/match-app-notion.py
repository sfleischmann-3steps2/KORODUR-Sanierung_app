"""
Schritt 1 — Matching App-Referenzen ↔ Notion Sanierungs-Einträge.

Input:
  - docs/cache/notion-sanierungen.json  (33 Notion-Einträge, Trinkwasser-only ausgeschlossen)
  - data/referenzen.ts                   (26 App-Refs)

Output:
  - docs/app-notion-match.md            (Match-Report mit 3 Gruppen)
  - docs/cache/match-result.json        (maschinenlesbar für Schritt 2 + 4)
"""

import json
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NOTION_JSON = ROOT / "docs/cache/notion-sanierungen.json"
APP_TS = ROOT / "data/referenzen.ts"
OUT_MD = ROOT / "docs/app-notion-match.md"
OUT_JSON = ROOT / "docs/cache/match-result.json"


def slugify(s: str) -> str:
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    s = re.sub(r"[^a-zA-Z0-9]+", "-", s).strip("-").lower()
    return s


def tokenize_ort(ort: str) -> set[str]:
    """Ort-String in Tokens zerlegen, robust gegen Umlaute/Zusätze."""
    if not ort:
        return set()
    norm = unicodedata.normalize("NFKD", ort).encode("ascii", "ignore").decode().lower()
    # split auf nicht-alphanumerisch
    tokens = re.split(r"[^a-z0-9]+", norm)
    # filter zu kurze tokens und Land-Wörter
    stop = {"deutschland", "osterreich", "schweiz", "polen", "italien", "frankreich",
            "finnland", "uk", "england", "und", "bei", "am", "im", "an"}
    return {t for t in tokens if len(t) >= 3 and t not in stop}


def name_tokens(s: str) -> set[str]:
    """Aussagekräftige Inhalts-Tokens (Marke, Branche, Bauwerktyp) aus Titel/Slug."""
    if not s:
        return set()
    norm = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().lower()
    tokens = re.split(r"[^a-z0-9]+", norm)
    stop = {
        "sanierung", "der", "die", "das", "im", "in", "am", "an", "und", "von", "zur", "des",
        "neue", "neuer", "neues", "alte", "alter", "neu", "alt", "uebers", "ueber",
        "wochenende", "betrieb", "laufenden", "halle", "lagerhalle", "boden", "produktion",
        "produktionsflaeche", "produktionshalle", "ein", "eine", "einer", "einen",
        "ort", "unbekannter", "unbekannte", "deutsch", "deutsche", "weltweit",
    }
    return {t for t in tokens if len(t) >= 4 and t not in stop}


def parse_app_refs() -> list[dict]:
    ts = APP_TS.read_text()
    blocks = re.split(r"^\s{2}\{$", ts, flags=re.MULTILINE)[1:]
    refs = []
    for blk in blocks:
        m = re.search(r"slug:\s*['\"]([^'\"]+)['\"]", blk)
        if not m:
            continue
        titel = (re.search(r"titel:\s*['\"]([^'\"]+)['\"]", blk) or [None, ""])[1]
        ort = (re.search(r"ort:\s*['\"]([^'\"]+)['\"]", blk) or [None, ""])[1]
        land = (re.search(r"land:\s*['\"]([^'\"]+)['\"]", blk) or [None, ""])[1]
        prod_block = (re.search(r"produkte:\s*\[([^\]]*)\]", blk, re.S) or [None, ""])[1]
        produkte = [s for s in re.findall(r"['\"]([^'\"]+)['\"]", prod_block)]
        ot = tokenize_ort(ort)
        refs.append({
            "slug": m.group(1),
            "titel": titel,
            "ort": ort,
            "land": land,
            "produkte": produkte,
            "ort_tokens": ot,
            "prod_norm": [slugify(p) for p in produkte],
            # Ort-Tokens aus Name-Tokens entfernen, damit Ortsname nicht doppelt zählt
            "name_tokens": name_tokens(m.group(1) + " " + titel) - ot,
        })
    return refs


def parse_notion() -> list[dict]:
    raw = json.loads(NOTION_JSON.read_text())
    out = []
    for r in raw:
        ort = r.get("Ort", "") or ""
        prod_str = r.get("eingesetzte KORODUR Produkte", "") or ""
        # Notion-Produkte sind Freitext, splitten an "+", ",", ";" und "&"
        prods = [p.strip() for p in re.split(r"[+,;&]| und ", prod_str) if p.strip()]
        einsatz = r.get("Einsatzbereich", "[]")
        try:
            einsatz_arr = json.loads(einsatz) if einsatz else []
        except Exception:
            einsatz_arr = []
        zusatz = r.get("Zusatzfunktion", "[]")
        try:
            zusatz_arr = json.loads(zusatz) if zusatz else []
        except Exception:
            zusatz_arr = []
        ot = tokenize_ort(ort)
        out.append({
            "title": r.get("Objekttitel", ""),
            "ort": ort,
            "land": r.get("Land", "") or "",
            "baujahr": r.get("Baujahr", "") or "",
            "verarbeiter": r.get("Verarbeiter", "") or "",
            "produkte_raw": prod_str,
            "produkte": prods,
            "sanierungsart": r.get("Sanierungsart", "") or "",
            "einsatzbereich": einsatz_arr,
            "dringlichkeit": r.get("Dringlichkeit", "") or "",
            "zusatzfunktion": zusatz_arr,
            "status": r.get("Status", "") or "",
            "url": r.get("url", ""),
            "ort_tokens": ot,
            "prod_norm": [slugify(p) for p in prods],
            "name_tokens": name_tokens(r.get("Objekttitel", "")) - ot,
        })
    return out


def score(app: dict, notion: dict) -> tuple[int, list[str]]:
    """Heuristik:
      Ort-Token-Match × 3 + Produkt-Match × 2 + Land × 1 + Name-Token-Match × 4.
    Name-Match (z.B. 'antolin', 'kleemann', 'bohnenkamp') ist starkes Signal.
    """
    reasons = []
    s = 0
    ort_overlap = app["ort_tokens"] & notion["ort_tokens"]
    if ort_overlap:
        s += 3 * len(ort_overlap)
        reasons.append(f"ort:{','.join(sorted(ort_overlap))}")
    prod_overlap = set(app["prod_norm"]) & set(notion["prod_norm"])
    if prod_overlap:
        s += 2 * len(prod_overlap)
        reasons.append(f"prod:{','.join(sorted(prod_overlap))[:60]}")
    name_overlap = app["name_tokens"] & notion["name_tokens"]
    if name_overlap:
        s += 4 * len(name_overlap)
        reasons.append(f"name:{','.join(sorted(name_overlap))}")
    a_land = slugify(app.get("land", ""))
    n_land = slugify(notion.get("land", ""))
    if a_land and n_land and a_land == n_land:
        s += 1
        reasons.append(f"land:{a_land}")
    return s, reasons


def main():
    apps = parse_app_refs()
    notions = parse_notion()
    print(f"App-Refs: {len(apps)}, Notion-Refs: {len(notions)}")

    # Für jeden App-Ref den besten Notion-Match finden
    matches = []
    for a in apps:
        scored = []
        for n in notions:
            sc, reasons = score(a, n)
            if sc > 0:
                scored.append((sc, n, reasons))
        scored.sort(key=lambda x: -x[0])
        best = scored[0] if scored else None
        runner = scored[1] if len(scored) > 1 else None
        matches.append({
            "app": a,
            "best": best,
            "runner": runner,
            "all_candidates": scored[:3],
        })

    # Kategorisieren:
    #   A1 sicher       : Score ≥ 5 (Name-Token-Match vorhanden — Marke/Branche stimmt)
    #   A2 wahrscheinlich: Score = 4 (nur Ort+Land matchen) — manuelle Bestätigung nötig
    #   B  unklar/tie    : Score = 3 oder mehrere Score-4-Kandidaten
    #   C  nur App       : Score < 3
    sicher = []
    wahrscheinlich = []
    unklar = []
    nur_app = []
    notion_used = set()

    # Manuelle Overrides (Steffi-Bestätigung 2026-04-23):
    # - lkw-einstellplatz-berlin ist NICHT Olympiastadion Berlin → Delta-Kandidat
    # - autohaus-versmold ist NICHT Wellpappenfabrik Versmold → Delta-Kandidat
    # - parkhaus-flughafen-zuerich hat keinen echten Match → Delta-Kandidat
    FORCE_NUR_APP = {
        "lkw-einstellplatz-berlin",
        "autohaus-versmold",
        "parkhaus-flughafen-zuerich",
    }

    for m in matches:
        a = m["app"]
        if a["slug"] in FORCE_NUR_APP:
            nur_app.append(m)
            continue
        if not m["best"] or m["best"][0] < 3:
            nur_app.append(m)
            continue
        best_score = m["best"][0]
        runner_score = m["runner"][0] if m["runner"] else 0
        if best_score >= 5 and (best_score - runner_score) >= 1:
            sicher.append(m)
            notion_used.add(m["best"][1]["title"])
        elif best_score == 4 and runner_score < 4:
            wahrscheinlich.append(m)
            notion_used.add(m["best"][1]["title"])
        else:
            unklar.append(m)

    nur_notion = [n for n in notions if n["title"] not in notion_used]

    # Markdown-Bericht
    lines = []
    lines.append("# Matching-Report: App-Referenzen ↔ Notion")
    lines.append("")
    lines.append(f"**Stand:** 2026-04-23 · **App-Refs:** {len(apps)} · **Notion-Refs (Sanierung, ohne Trinkwasser-only):** {len(notions)}")
    lines.append("")
    lines.append("**Heuristik:** Score = 3×Ort-Token-Overlap + 2×Produkt-Overlap + 4×Name-Token-Match (Marke/Branche, Ort excludiert) + 1×Land.")
    lines.append("")
    lines.append("- **A1 sicher** = Score ≥ 5 (Name-Match bestätigt Marke/Branche zusätzlich zum Ort).")
    lines.append("- **A2 wahrscheinlich** = Score = 4 (nur Ort+Land matchen, kein Name-Token-Treffer) — bitte einmal kurz prüfen.")
    lines.append("- **B unklar** = Mehrere ähnlich-starke Kandidaten oder Score < 4 — manuelle Entscheidung.")
    lines.append("- **C nur App** = keine Notion-Entsprechung → in Schritt 2 dort anlegen.")
    lines.append("- **D nur Notion** = nicht in App → in Schritt 4 importieren.")
    lines.append("")
    lines.append("---")
    lines.append("")

    lines.append(f"## A1 — Sichere Matches ({len(sicher)})")
    lines.append("")
    lines.append("| App-Slug | App-Titel · Ort | Notion-Titel · Ort | Score | Begründung |")
    lines.append("|---|---|---|---|---|")
    for m in sicher:
        a = m["app"]; n = m["best"][1]; sc = m["best"][0]; reasons = m["best"][2]
        lines.append(f"| `{a['slug']}` | {a['titel']} · {a['ort']} | {n['title']} · {n['ort']} | {sc} | {' / '.join(reasons)} |")
    lines.append("")

    lines.append(f"## A2 — Wahrscheinliche Matches ({len(wahrscheinlich)}) — bitte kurz bestätigen")
    lines.append("")
    lines.append("Match nur über Ort+Land (kein Name-Token-Treffer). Plausibel, weil im selben Ort bisher nur dieses Notion-Projekt vorliegt.")
    lines.append("")
    lines.append("| App-Slug | App-Titel · Ort | Notion-Titel · Ort | App-Produkte | Notion-Produkte |")
    lines.append("|---|---|---|---|---|")
    for m in wahrscheinlich:
        a = m["app"]; n = m["best"][1]
        ap = ', '.join(a['produkte']) or '—'
        np_ = n['produkte_raw'][:60] or '—'
        lines.append(f"| `{a['slug']}` | {a['titel']} · {a['ort']} | {n['title']} · {n['ort']} | {ap} | {np_} |")
    lines.append("")

    lines.append(f"## B — Unklare Matches ({len(unklar)}) — bitte entscheiden")
    lines.append("")
    for m in unklar:
        a = m["app"]
        lines.append(f"### `{a['slug']}` — {a['titel']}, {a['ort']}")
        lines.append(f"- App-Produkte: {', '.join(a['produkte']) or '—'}")
        if not m["all_candidates"]:
            lines.append("- **Kein Notion-Kandidat.**")
        else:
            lines.append("- Notion-Kandidaten (top 3):")
            for sc, n, reasons in m["all_candidates"]:
                lines.append(f"  - **Score {sc}** — {n['title']} ({n['ort']}) — Produkte: {n['produkte_raw'][:80] or '—'} — _{' / '.join(reasons)}_")
        lines.append("")

    lines.append(f"## C — Nur App, kein Notion-Match ({len(nur_app)}) — Kandidaten für Delta-Writeback")
    lines.append("")
    lines.append("| App-Slug | App-Titel · Ort | Produkte |")
    lines.append("|---|---|---|")
    for m in nur_app:
        a = m["app"]
        lines.append(f"| `{a['slug']}` | {a['titel']} · {a['ort']} | {', '.join(a['produkte']) or '—'} |")
    lines.append("")

    lines.append(f"## D — Nur Notion, in App nicht vorhanden ({len(nur_notion)}) — Kandidaten für Forward-Import (Schritt 4)")
    lines.append("")
    lines.append("| Notion-Titel | Ort, Land | Sanierungsart | Einsatzbereich | Produkte |")
    lines.append("|---|---|---|---|---|")
    for n in nur_notion:
        lines.append(f"| {n['title']} | {n['ort']}, {n['land']} | {n['sanierungsart'] or '—'} | {', '.join(n['einsatzbereich']) or '—'} | {n['produkte_raw'][:60] or '—'} |")
    lines.append("")

    OUT_MD.write_text("\n".join(lines))
    print(f"Wrote {OUT_MD}")

    # Cache-JSON für Schritt 2/4
    OUT_JSON.write_text(json.dumps({
        "sicher": [{"app_slug": m["app"]["slug"], "notion_title": m["best"][1]["title"], "score": m["best"][0]} for m in sicher],
        "wahrscheinlich": [{"app_slug": m["app"]["slug"], "notion_title": m["best"][1]["title"], "score": m["best"][0]} for m in wahrscheinlich],
        "unklar": [{"app_slug": m["app"]["slug"], "candidates": [{"title": n["title"], "score": sc, "reasons": rs} for sc, n, rs in m["all_candidates"]]} for m in unklar],
        "nur_app": [m["app"]["slug"] for m in nur_app],
        "nur_notion": [n["title"] for n in nur_notion],
    }, indent=2, ensure_ascii=False))
    print(f"Wrote {OUT_JSON}")
    print(f"A1 sicher: {len(sicher)} | A2 wahrscheinlich: {len(wahrscheinlich)} | B unklar: {len(unklar)} | C nur App: {len(nur_app)} | D nur Notion: {len(nur_notion)}")


if __name__ == "__main__":
    main()
