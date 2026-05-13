@AGENTS.md

# KORODUR Sanierungs-App

Interaktive Web-App (Next.js 16 Static Export, GitHub Pages) für den Sanierungsbereich von KORODUR. Self-Service-Tool mit **Lösungsfinder** (geführter Wizard), **Referenzdatenbank** (aktuell 51), **17 Produkten**, **Produktmatrix** und **PDF-Download** je Referenz. Vier Sprachen: DE/EN/FR/PL.

**Live:** https://sfleischmann-3steps2.github.io/KORODUR-Sanierung_app/de/
**Zielseite Notion (Single Source of Truth für das Projekt):** [Sanieren mit KORODUR ist als überzeugende Sales-App live](https://www.notion.so/336670e19e1a80f887dad468b1676e57)

## Aktueller Stand & nächste Iteration

- **V2.4 (deployed 2026-04-23):** App ↔ Notion-Referenzverzeichnis konsolidiert, 4-Schritt-Lösungsfinder, Reconciliation-Pipeline, 380 statische Seiten. Siehe [Entwicklungs-Log](https://www.notion.so/35f670e19e1a81c2a17bf0ac00adf80d).
- **Nächste Iteration (geplant, Mai 2026):** Reduktion auf **3 Steps** + Datenmodell-Konsolidierung. Plan: `docs/superpowers/plans/2026-05-13-loesungsfinder-3step-rewrite.md`. Wartet auf [Experten-Klärungen](https://www.notion.so/35f670e19e1a815e806cf49e759d0b2b).

## Tech-Stack

- **Next.js 16** (App Router, **Static Export** via `output: "export"` in `next.config.ts`)
- **React 19.2** · **TypeScript 5** · **Tailwind CSS 4**
- **GitHub Pages** Deployment via `.github/workflows/deploy.yml` (Push auf `main` → Auto-Build)
- **i18n:** Eigene Implementierung über `[lang]`-Segment + `dictionaries/{de,en,fr,pl}.json` + `lib/LocaleContext.tsx`
- **Test:** Kein Test-Runner. Smoke-Tests via `npx tsx scripts/test-loesungsfinder.ts` und `scripts/validate-referenzen.ts`

## Architektur

```
app/[lang]/              Locale-prefixed Routes (Static-Export-fähig)
  page.tsx               Startseite
  loesungsfinder/        Wizard-Komponente + Result-Page
  referenzen/            Übersicht + Detail (mit Bildergalerie, PDF-Download)
  produkte/              Übersicht + Detail + Matrix
  dictionaries/          UI-Strings (4 Sprachen)
components/              UI-Komponenten (AppShell, TopNav, ReferenceCard, ImageGallery, SearchOverlay, …)
data/
  types.ts               Typ-Definitionen (Referenz, Produkt, Sanierungsart, Einsatzbereich, …)
  referenzen.ts          51 Refs als TS-Objekte (DE-Basis)
  produkte.ts            17 Produkte
  loesungsfinder.ts      Step-Definitionen + Filter-Logik
  i18n/                  Inhalts-Übersetzungen (EN/FR/PL)
lib/                     i18n-Helper, LocaleContext, basePath-Helper für GitHub Pages
scripts/                 CLI-Skripte (Build, Validierung, Notion-Sync — siehe Workflows)
docs/                    Pläne, Specs, Reconciliation-Reports
```

## Daten-Modell & Notion-Sync

**Quelle:** Notion-DBs sind perspektivisch (V2) die Source of Truth, V1 hat Daten in `data/*.ts` mit Sync-Skripten:

- [Notion-Referenzverzeichnis](https://www.notion.so/2e7670e19e1a8062b050c9f4406c0877) (DB-ID `2e7670e1-9e1a-8062-b050-c9f4406c0877`)
- [Notion-Produktdatenbank](https://www.notion.so/345670e19e1a803580c8f297c0474331)

**Reconciliation-Pipeline (Skripte in `scripts/`):**

- `match-app-notion.py` — heuristisches Matching App ↔ Notion (Name-Token + Ort + Produkt)
- `build-delta-payloads.py` — baut Notion-Writeback-Payloads aus App-Refs
- `import-notion-referenzen.py` — Notion → App, idempotent mit Marker-Kommentar
- `cleanup-referenzen.py` — einmalige Datenmodell-Migration
- `validate-referenzen.ts` — CI-Check (Enum-Werte, Pflichtfelder, Slug-Eindeutigkeit)

**Notion-API:** Bevorzugt **MCP-Tools** (`mcp__claude_ai_Notion__*`). Fallback auf `notion-client` 2.2.x (Python) nur wenn MCP nicht verfügbar — **vorher melden**. Bei Multi-Select: **immer lesen + APPEND**, nie überschreiben.

## Konventionen

- **Field-Naming:** camelCase (`zeitDringlichkeit`, `einsatzbereiche`)
- **Slug-Naming:** kebab-case (`olympiastadion-berlin`, `neodur-he-60-rapid`)
- **Enum-Werte:** kebab-case-Strings (`"punktuelle"`, `"lager-logistik"`, `"kurzfristig"`)
- **Sprache:** Deutsch ist Basis (`data/referenzen.ts`, `data/produkte.ts`). EN/FR/PL über `data/i18n/{lang}.ts`-Overrides + `app/[lang]/dictionaries/{lang}.json` für UI-Strings.
- **i18n Pflicht:** Neue UI-Strings IMMER in allen 4 Sprach-Dictionaries (gegen KORODUR-Glossar prüfen)
- **Bilder:** unter `public/images/referenzen/<slug>/` (TOP3 + Galerie). Platzhalter: `public/images/_placeholder.jpg`
- **Static Export:** Keine API-Routes, kein `getServerSideProps`. Alle Daten zu Build-Zeit auflösen. `basePath` für GitHub Pages über `lib/basePath.ts`.

## Workflows

```bash
npm install
npm run dev            # http://localhost:3000
npm run build          # Static Export → out/

# Datenvalidierung (vor Commit!)
npx tsx scripts/validate-referenzen.ts
npx tsx scripts/test-loesungsfinder.ts

# Notion-Sync (Beispiele)
python3 scripts/match-app-notion.py             # erzeugt docs/app-notion-match.md
python3 scripts/import-notion-referenzen.py     # zieht Notion-Refs in data/referenzen.ts
```

**Deploy:** Push auf `main` → GitHub Actions baut Static Export → publiziert auf GitHub Pages. Kein manueller Deploy-Schritt.

## Memory & Skills

Diese Session nutzt **auto-memory** unter `~/.claude/projects/-Users-sfleischmann-Documents-Claude-Projects-KORODUR-Sanierung-app/memory/`. Bei langlebigen Erkenntnissen (User-Vorlieben, Projekt-Stand, externe Quellen) Memory anlegen — nicht hier in CLAUDE.md.

**Superpowers-Skills verfügbar:** Brainstorming (vor Feature-Bau), executing-plans (bei vorhandenen Plänen), verification-before-completion (vor „done"-Aussagen).

## Gotchas

1. **MCP `notion-update-page replace_content`-Bug:** `\n`-Escapes werden als literale `n`-Zeichen interpretiert. **Lieber `create-pages` oder `update_content`** verwenden. Siehe Memory `feedback_notion-mcp-quirks`.
2. **Markdown-Links/`<page>`-Tags via Text-Match nicht reparierbar:** Notion speichert sie als Link-Blocks. Wenn URL-Korrekturen nötig: Plan-B = lokale Markdown-Datei + manueller Paste.
3. **Bilder-Migration ausstehend:** 25 importierte Refs zeigen `_placeholder.jpg` bis SharePoint→Notion `TOP 3 Bilder` einmalig synchronisiert wurde.
4. **Next.js 16 Breaking Changes:** Siehe `AGENTS.md` oben — vor Code-Änderungen `node_modules/next/dist/docs/` konsultieren.
5. **Filter-Kategorien:** Aktuell 8 Einsatzbereiche, **geplant 4** (im Rahmen 3-Step-Rewrite). Bei Code-Änderungen prüfen, ob 8er oder 4er Schema gilt — siehe Plan.

## Externe Quellen

- **Notion-Ziel-Seite:** [Sanieren mit KORODUR ist als überzeugende Sales-App live](https://www.notion.so/336670e19e1a80f887dad468b1676e57)
- **Klärungen:** [Klärungen für Lösungsfinder-Rewrite (Mai 2026)](https://www.notion.so/35f670e19e1a815e806cf49e759d0b2b)
- **Implementierungsplan:** `docs/superpowers/plans/2026-05-13-loesungsfinder-3step-rewrite.md`
- **Entwicklungs-Log:** [Sub-Page im Notion](https://www.notion.so/35f670e19e1a81c2a17bf0ac00adf80d)
- **README:** `README.md` (Public-facing Projektbeschreibung)
