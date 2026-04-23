# KORODUR Sanierung – Web App

Interaktive Web-Applikation zur Präsentation des KORODUR-Sanierungsportfolios. Zielgruppe: Vertriebler, Bauherren, Architekten und Interessenten.

## Live ansehen

**[https://sfleischmann-3steps2.github.io/KORODUR-Sanierung_app/de/](https://sfleischmann-3steps2.github.io/KORODUR-Sanierung_app/de/)**

Verfügbar in: [Deutsch](https://sfleischmann-3steps2.github.io/KORODUR-Sanierung_app/de/) · [English](https://sfleischmann-3steps2.github.io/KORODUR-Sanierung_app/en/) · [Français](https://sfleischmann-3steps2.github.io/KORODUR-Sanierung_app/fr/) · [Polski](https://sfleischmann-3steps2.github.io/KORODUR-Sanierung_app/pl/)

## Features

- **4 Sprachen** – DE / EN / FR / PL, komplett übersetzt (UI + Inhalte), gegen KORODUR-Glossar geprüft
- **Lösungsfinder** – 4-Schritt-Assistent: Sanierungsart → Einsatzbereich → Dringlichkeit → Zusatzfunktion → Referenzen + Produkte
- **51 Referenzprojekte** mit Herausforderungen, Lösung, Vorteilen, Produktdaten und **Bildergalerie** (3–8 Fotos pro Referenz, Lightbox mit Pfeiltasten)
- **16 Produkte** mit technischen Daten, Normen, Qualitätsklassen und **Produkt-Mockups**
- **Einsatzbereich-Filter** über alle Referenzen (8 Bereiche: Lager & Logistik, Industrie & Produktion, Lebensmittel, Flugzeug, Parkdeck, Infrastruktur & Zufahrten, Verkaufsräume, Schwerindustrie)
- **Produktmatrix** – Interaktive Vergleichstabelle mit Eignungen pro Produkt
- **Volltextsuche** (Cmd/Ctrl+K) über Referenzen, Kategorien und Produkte
- **Responsive** – Desktop, Tablet, Mobile
- **PWA-fähig** – Service Worker, Manifest

## Tech Stack

- **Next.js 16** (App Router, Static Export)
- **Tailwind CSS 4**
- **TypeScript**
- **GitHub Pages** (automatisches Deployment via GitHub Actions)

## Lokal starten

```bash
npm install
npm run dev
```

## Informationsarchitektur

```
/[lang]/
├── Startseite (Hero, Referenz-Highlights, Lösungsfinder-Teaser, Außenflächen)
├── loesungsfinder/ (4-Schritt-Wizard → Matching-Referenzen + aggregierte Produkte)
├── referenzen/ (Filter: Sanierungsart · Einsatzbereich · Dringlichkeit · Produkt)
└── produkte/ (Produktübersicht + Produktmatrix + Detail-Seiten)
```

## Projektstruktur

```
├── app/[lang]/              # Locale-prefixed Routes (de/en/fr/pl)
│   ├── page.tsx             # Startseite
│   ├── loesungsfinder/      # 4-Schritt-Wizard
│   ├── referenzen/          # Referenz-Übersicht + Detail
│   ├── produkte/            # Produktübersicht + Detail
│   └── dictionaries/        # UI-Strings (de/en/fr/pl.json)
├── components/
│   ├── AppShell.tsx         # Layout-Wrapper
│   ├── TopNav.tsx           # Horizontale Navigation + Mobile Drawer
│   ├── Loesungsfinder.tsx   # 4-Step-Wizard mit Scoring-UI
│   ├── ReferenceCard.tsx    # Referenz-Karte mit Einsatzbereich-Badge
│   ├── ImageGallery.tsx     # Bildergalerie mit Grid + Lightbox (Referenz-Detail)
│   ├── SearchOverlay.tsx    # Volltextsuche (Cmd+K)
│   └── ...                  # LanguageSwitcher, TileGrid, etc.
├── data/
│   ├── referenzen.ts        # 51 Referenzen (DE-Basis, 26 historisch + 25 aus Notion-Import)
│   ├── produkte.ts          # 16 Produkte mit technischen Daten + Mockup-Bildern
│   ├── loesungsfinder.ts    # 4-Step-Definitionen + Scoring-Logik
│   ├── types.ts             # Referenz-Interface: sanierungsart/einsatzbereiche/
│   │                        #   zeitDringlichkeit/zusatzfunktionen
│   └── i18n/                # Inhalts-Übersetzungen (EN/FR/PL)
├── scripts/
│   ├── validate-referenzen.ts       # CI-Check: Enum-Werte, Pflichtfelder, Slugs
│   ├── test-loesungsfinder.ts       # Scoring-Smoke-Test
│   ├── match-app-notion.py          # Matching-Report App ↔ Notion-DB
│   ├── build-delta-payloads.py      # Baut Notion-Writeback-Payloads
│   ├── import-notion-referenzen.py  # Importiert Notion-Einträge in referenzen.ts
│   └── cleanup-referenzen.py        # Einmalige Datenmodell-Migration
├── lib/
│   ├── i18n.ts              # Locale-Typen, LOCALES Konstante
│   ├── LocaleContext.tsx    # Client-Context für Locale + Dictionary
│   └── basePath.ts          # GitHub Pages basePath Helper
└── .github/workflows/
    └── deploy.yml           # GitHub Pages Auto-Deploy
```

## Deployment

GitHub Pages via GitHub Actions – bei jedem Push auf `main` wird automatisch gebaut und deployt.

## Status: V2 – Live

### Backlog Themen
Commit: 0deae98c191a84ed9aded5fbff50f664f9336561 -> Sanierungssysteme (Systemdarstellung als Konzeptbasis)

### V2.4 (April 2026)
- [x] **Notion-Reconciliation** – App ↔ Notion-Referenzverzeichnis konsolidiert
  - 18 App-Refs fehlten in Notion → dort als Pages mit Strukturfeldern nachgelegt
  - 25 Notion-Refs fehlten in App → in `data/referenzen.ts` importiert (Bilder als Platzhalter)
  - Neue Gesamtzahl: **51 Referenzen**
- [x] **Taxonomie-Refactor** – alte 3er-Kategorisierung (Industrieboden/Industriebau/Infrastruktur + Unterkategorien) durch Lösungsfinder-Taxonomie ersetzt; einziges Modell für alle Referenz-Dimensionen
- [x] **Filter `/referenzen`** – Sanierungsart · Einsatzbereich · Dringlichkeit · Produkt (homogen mit Lösungsfinder)
- [x] `validate-referenzen.ts` als CI-tauglicher Enum-/Pflichtfeld-Validator

### V2.3 (April 2026)
- [x] **Produkt-Mockups** auf Produktkarten und Detailseiten (10 von 16 Produkten)
- [x] **Sprachumschalter** als Flaggen-Dropdown (skalierbar für weitere Sprachen)
- [x] **Hero-Gradient** optimiert — mehr Bild sichtbar, Schrift weiterhin lesbar
- [x] **Hero-Headline** aktualisiert: "Die sichere Sanierungslösung" (alle 4 Sprachen)
- [x] DUROP entfernt (Abstreumaterial, kein eigenständiges Sanierungsprodukt)
- [x] MICROTOP TW + 3 Trinkwasser-Referenzen entfernt (kein Sanierungsthema)
- [x] Hydration-Mismatch (⌘K/Ctrl+K) behoben
- [x] Notion-Produktdatenbank abgeglichen — 4 neue Produkte identifiziert (Referenzen ausstehend)

### V2.2 (April 2026)
- [x] **Bildergalerie** auf Referenz-Detailseiten: 151 Fotos aus Präsentationen extrahiert (3–8 pro Referenz)
- [x] ImageGallery-Komponente: 3-Spalten-Grid, Lightbox mit Pfeiltasten, responsive
- [x] Taxonomie-Vorschlag für Lösungsfinder-Qualifizierung (5 Dimensionen, K.O.-Kriterien)
- [x] Excel-Vorlage für neue Referenzen + Produkt-Qualifizierung
- [x] Extraktions-Scripts für Galerie-Bilder und Excel-Vorlage

### V2.1 (April 2026)
- [x] Filterleiste für alle Portfolio-Kategorieseiten (gleiche UI wie Referenzen-Seite)
- [x] Referenz-Karten in Listenansicht jetzt lokalisiert (waren vorher nur DE)
- [x] Übersetzungen gegen KORODUR Notion-Glossar geprüft und korrigiert (EN/FR/PL)
- [x] Microtop entfernt (eigene externe Landingpage)
- [x] Produktfilter entfernt, Sprachschalter PL-Bug gefixt
- [x] Produktfinder (ehem. "Sanierung finden") umbenannt
- [x] 270 statische Seiten (4 Sprachen × alle Routes)

### V2.0 (April 2026)
- [x] Wizard + Konfigurator zu `/sanierung-finden/` zusammengeführt
- [x] Sidebar-Navigation durch horizontale TopNav ersetzt
- [x] Startseite redesigned: Hero-CTA, Referenz-Highlights
- [x] Polnisch (PL) als 4. Sprache komplett eingebaut

### V1 Basis
- [x] Next.js Projekt mit Static Export
- [x] KORODUR Corporate Design (Gabarito, Navy/Cyan)
- [x] Referenzen mit Daten & Fotos
- [x] Produkte mit technischen Daten & Normen
- [x] Mehrsprachigkeit DE/EN/FR mit i18n-Infrastruktur
- [x] App-Shell, Volltextsuche, Accessibility
- [x] GitHub Pages Deployment
