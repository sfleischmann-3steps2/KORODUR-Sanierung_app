# KORODUR Sanierung – Web App

Interaktive Web-Applikation zur Präsentation des KORODUR-Sanierungsportfolios. Zielgruppe: Vertriebler, Bauherren, Architekten und Interessenten.

## Live ansehen

**[https://sfleischmann-3steps2.github.io/KORODUR-Sanierung_app/de/](https://sfleischmann-3steps2.github.io/KORODUR-Sanierung_app/de/)**

Verfügbar in: [Deutsch](https://sfleischmann-3steps2.github.io/KORODUR-Sanierung_app/de/) · [English](https://sfleischmann-3steps2.github.io/KORODUR-Sanierung_app/en/) · [Français](https://sfleischmann-3steps2.github.io/KORODUR-Sanierung_app/fr/) · [Polski](https://sfleischmann-3steps2.github.io/KORODUR-Sanierung_app/pl/)

## Features

- **4 Sprachen** – DE / EN / FR / PL, komplett übersetzt (UI + Inhalte), gegen KORODUR-Glossar geprüft
- **Produktfinder** – 3-Schritte-Assistent: Bereich → Maßnahme → Zeitrahmen → Produktempfehlung
- **29 Referenzprojekte** mit Herausforderungen, Lösung, Vorteilen, Produktdaten und **Bildergalerie** (3–8 Fotos pro Referenz, Lightbox mit Pfeiltasten)
- **19 Produkte** mit technischen Daten, Normen und Qualitätsklassen
- **3 Portfolio-Bereiche** – Industrieboden, Industriebau, Infrastruktur – jeweils mit Anwendungs-Filter
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
├── Startseite (Hero, Stats, Warum Sanierung, Referenz-Highlights, Portfolio)
├── sanierung-finden/ (Produktfinder: 3-Schritte-Assistent → Empfehlung + Referenzen)
├── portfolio/
│   ├── industrieboden/ (Filter: Schwerlast / Dünnschicht / Schnelle Reparaturen)
│   ├── industriebau/ (Filter: Fugen / Schnelle Reparaturen)
│   └── infrastruktur/ (Verkehr)
├── referenzen/ (Filterliste nach Bereich + Anwendung)
└── produkte/ (Produktübersicht + Detail-Seiten)
```

## Projektstruktur

```
├── app/[lang]/              # Locale-prefixed Routes (de/en/fr/pl)
│   ├── page.tsx             # Startseite
│   ├── sanierung-finden/    # Produktfinder (3-Schritte-Assistent)
│   ├── portfolio/           # Portfolio mit Filter-Kategorieseiten
│   ├── referenzen/          # Referenz-Übersicht + Detail
│   ├── produkte/            # Produktübersicht + Detail
│   └── dictionaries/        # UI-Strings (de/en/fr/pl.json)
├── components/
│   ├── AppShell.tsx         # Layout-Wrapper
│   ├── TopNav.tsx           # Horizontale Navigation + Mobile Drawer
│   ├── CategoryFilterView.tsx # Wiederverwendbare Filterleiste für Kategorieseiten
│   ├── ImageGallery.tsx     # Bildergalerie mit Grid + Lightbox (Referenz-Detail)
│   ├── SearchOverlay.tsx    # Volltextsuche (Cmd+K)
│   ├── LanguageSwitcher.tsx # DE/EN/FR/PL Umschalter
│   └── ...                  # TileGrid, ReferenceCard, CategoryTile, etc.
├── data/
│   ├── referenzen.ts        # 29 Referenzen (DE-Basis)
│   ├── produkte.ts          # 19 Produkte mit technischen Daten
│   ├── kategorien.ts        # 3 Bereiche + Unterkategorien
│   ├── sanierung-finden.ts  # Produktfinder: Schritte + Scoring-Logik
│   └── i18n/                # Inhalts-Übersetzungen (EN/FR/PL)
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
- [x] 29 Referenzen mit Daten & Fotos
- [x] 19 Produkte mit technischen Daten & Normen
- [x] Mehrsprachigkeit DE/EN/FR mit i18n-Infrastruktur
- [x] App-Shell, Volltextsuche, Accessibility
- [x] GitHub Pages Deployment
