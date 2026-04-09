# KORODUR Sanierung – Web App

Interaktive Web-Applikation zur Präsentation des KORODUR-Sanierungsportfolios. Zielgruppe: Vertriebler, Bauherren, Architekten und Interessenten.

## Live ansehen

**[https://sfleischmann-3steps2.github.io/KORODUR-Sanierung_app/de/](https://sfleischmann-3steps2.github.io/KORODUR-Sanierung_app/de/)**

Verfügbar in: [Deutsch](https://sfleischmann-3steps2.github.io/KORODUR-Sanierung_app/de/) · [English](https://sfleischmann-3steps2.github.io/KORODUR-Sanierung_app/en/) · [Français](https://sfleischmann-3steps2.github.io/KORODUR-Sanierung_app/fr/) · [Polski](https://sfleischmann-3steps2.github.io/KORODUR-Sanierung_app/pl/)

## Features

- **4 Sprachen** – DE / EN / FR / PL, komplett übersetzt (UI + Inhalte)
- **Sanierung finden** – 3-Schritte-Assistent: Bereich → Maßnahme → Zeitrahmen → Produktempfehlung
- **28 Referenzprojekte** mit Herausforderungen, Lösung, Vorteilen und Produktdaten
- **18 Produkte** mit technischen Daten, Normen und Qualitätsklassen
- **3 Portfolio-Bereiche** – Industrieboden, Industriebau, Infrastruktur
- **MICROTOP-Bereich** – Eigene Sektion für Trinkwasser-Infrastruktur (abgetrennte Zielgruppe)
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

## Informationsarchitektur (V2)

```
/[lang]/
├── Startseite (Hero, Stats, Warum Sanierung, Referenz-Highlights, Portfolio, Microtop-CTA)
├── sanierung-finden/ (3-Schritte-Assistent → Produktempfehlung + Referenzen)
├── portfolio/
│   ├── industrieboden/ (#schwerlast, #duennschicht, #schnelle-reparaturen)
│   ├── industriebau/ (#fugen, #schnelle-reparaturen)
│   └── infrastruktur/ (#verkehr)
├── referenzen/ (Filterliste + Detail-Seiten)
├── produkte/ (Produktübersicht + Detail-Seiten)
└── microtop/ (Trinkwasser-Bereich: Produktinfo + 3 Referenzen)
```

## Projektstruktur

```
├── app/[lang]/              # Locale-prefixed Routes (de/en/fr/pl)
│   ├── page.tsx             # Startseite
│   ├── sanierung-finden/    # Kombinierter Assistent
│   ├── portfolio/           # Portfolio mit Kategorie-Seiten
│   ├── referenzen/          # Referenz-Übersicht + Detail
│   ├── produkte/            # Produktübersicht + Detail
│   ├── microtop/            # Trinkwasser-Bereich
│   └── dictionaries/        # UI-Strings (de/en/fr/pl.json)
├── components/
│   ├── AppShell.tsx         # Layout-Wrapper
│   ├── TopNav.tsx           # Horizontale Navigation + Mobile Drawer
│   ├── SearchOverlay.tsx    # Volltextsuche (Cmd+K)
│   ├── LanguageSwitcher.tsx # DE/EN/FR/PL Umschalter
│   └── ...                  # TileGrid, ReferenceCard, CategoryTile, etc.
├── data/
│   ├── referenzen.ts        # 28 Referenzen (DE-Basis)
│   ├── produkte.ts          # 18 Produkte mit technischen Daten
│   ├── kategorien.ts        # 3 Bereiche + Unterkategorien
│   ├── sanierung-finden.ts  # Assistent: Schritte + Scoring-Logik
│   └── i18n/                # Inhalts-Übersetzungen (EN/FR/PL)
├── lib/
│   ├── i18n.ts              # Locale-Typen, LOCALES Konstante
│   ├── LocaleContext.tsx     # Client-Context für Locale + Dictionary
│   └── basePath.ts          # GitHub Pages basePath Helper
└── .github/workflows/
    └── deploy.yml           # GitHub Pages Auto-Deploy
```

## Deployment

GitHub Pages via GitHub Actions – bei jedem Push auf `main` wird automatisch gebaut und deployt.

## Status: V2 – Live

### V2 Redesign (April 2026)
- [x] Microtop in eigene Route `/microtop/` ausgelagert
- [x] Wizard + Konfigurator zu `/sanierung-finden/` zusammengeführt
- [x] Sidebar-Navigation durch horizontale TopNav ersetzt
- [x] Startseite: Hero-CTA auf Assistent, Referenz-Highlights, Microtop-Footer
- [x] Polnisch (PL) als 4. Sprache komplett eingebaut
- [x] 274 statische Seiten (4 Sprachen × alle Routes)

### V1 Basis
- [x] Präsentation analysiert (119 Folien, 2 PDFs)
- [x] Next.js Projekt mit Static Export
- [x] KORODUR Corporate Design (Gabarito, Navy/Cyan)
- [x] 28 Referenzen mit Daten & Fotos
- [x] 18 Produkte mit technischen Daten & Normen
- [x] Mehrsprachigkeit DE/EN/FR mit i18n-Infrastruktur
- [x] App-Shell mit Sidebar, Volltextsuche, Accessibility
- [x] GitHub Pages Deployment
