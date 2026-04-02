# KORODUR Sanierung – Web App

Interaktive Web-Applikation zur Präsentation des KORODUR-Sanierungsportfolios. Zielgruppe: Vertriebler, Bauherren, Architekten und Interessenten.

## Ziel

Die bestehende PowerPoint-Präsentation (119 Folien) in eine moderne, erweiterbare Web-Applikation überführen, die:

- **Interaktiv & klickbar** ist – Kachel-Navigation ermöglicht es, gezielt auf Kundenbedürfnisse einzugehen
- **Für Vertriebler** als Gesprächstool im Kundentermin funktioniert
- **Für Kunden** über die Website selbstständig erkundbar ist
- **Erweiterbar** ist – neue Referenzen, Produkte und Bereiche einfach hinzufügbar
- **Performant** bleibt – trotz vieler Bitos und Referenzen schnell lädt

## Lokal starten

```bash
npm install
npm run dev
```

App öffnen: [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Next.js 16** (App Router, Static Export)
- **Tailwind CSS 4**
- **TypeScript**
- **GitHub Pages** (automatisches Deployment via GitHub Actions)

## Seiten (22 statische Seiten)

| Seite | Route | Beschreibung |
|---|---|---|
| Startseite | `/` | Hero, Stats, Warum Sanierung, Portfolio-Kacheln, CTA |
| Portfolio | `/portfolio` | Übersicht der 3 Bereiche als Kacheln |
| Industrieboden | `/portfolio/industrieboden` | Schwerlast, Dünnschicht, Schnelle Reparaturen |
| Industriebau | `/portfolio/industriebau` | Fugen, Treppen, Überladebrücken |
| Infrastruktur | `/portfolio/infrastruktur` | Verkehr & Wasser |
| Referenzen | `/referenzen` | Alle Referenzen mit Filter (Bereich, Anwendung, Produkt) |
| Referenz-Detail | `/referenzen/[slug]` | Herausforderungen, Lösung, Vorteile, Produktdaten |

## Inhaltsstruktur

```
Startseite: "Sanieren mit KORODUR"
│
├── Warum Sanierung?
│   ├── Minimale Ausfallzeiten
│   ├── Dauerhafte Ergebnisse
│   └── Nachhaltig & Wirtschaftlich
│
├── Referenzen (mit Filter)
│
└── Produktportfolio
     ├── Industrieboden
     │   ├── Schwerlast (Antolin, Kleemann, Monheim)
     │   ├── Dünnschicht (Guben, Nike Store)
     │   └── Schnelle Reparaturen (DHL, LKW Waschstraße)
     ├── Industriebau
     │   └── Schnelle Reparaturen (Lyreco, Treppenstufen)
     └── Infrastruktur
          ├── Verkehr (Catania, Parkhaus Zürich)
          └── Wasser (Haidberg, Bad Nauheim)
```

## Produktdatenbank

14 Produkte mit technischen Daten, Qualitätsklassen und Normen:

| Produkt | Qualitätsklasse | Einsatz |
|---|---|---|
| NEODUR HE 60 rapid | CT-C60-F8-A6 | 24h-Sanierung, 10–60 mm |
| NEODUR HE 65 Plus | CT-C70-F9-A6 | Extrem-Belastung, Innen/Außen |
| NEODUR Level | CT-C40-F8-AR0,5 | Dünnestrich, 4–10 mm |
| KORODUR HB 5 rapid | – | Haftbrücke |
| Rapid Set CEMENT ALL | – | Schnellreparatur (1 h belastbar) |
| Rapid Set MORTAR MIX | – | Fugen & Reprofilierung |
| KOROCRETE Schnellbeton | – | Großflächen |
| MICROTOP TW | – | Trinkwasser (DVGW) |
| TRU Self-Leveling | – | Sichtestrich / Design |

Jede Referenz-Detail-Seite zeigt die technischen Daten und Normen der eingesetzten Produkte.

## Corporate Design

KORODUR Styleguide implementiert:

- **Farben:** Navy `#002d59`, Cyan `#009ee3`, Weiß, Grautöne
- **Font:** Gabarito (400, 700, 800, 900)
- **Cards:** 14px Radius, Schatten, Hover-Effekte
- **Buttons:** Cyan primary, Ghost secondary
- **Responsive:** Desktop-first, Breakpoints 1100px / 768px / 480px

## Projektstruktur

```
├── app/                    # Next.js App Router
│   ├── page.tsx            # Startseite
│   ├── portfolio/          # Portfolio-Seiten
│   │   ├── industrieboden/
│   │   ├── industriebau/
│   │   └── infrastruktur/
│   └── referenzen/
│       ├── page.tsx        # Referenz-Übersicht mit Filter
│       └── [slug]/page.tsx # Referenz-Detail
├── components/             # React Components
│   ├── Navigation.tsx      # Sticky Nav, responsive
│   ├── Breadcrumb.tsx
│   ├── TileGrid.tsx
│   ├── CategoryTile.tsx
│   ├── ReferenceCard.tsx
│   ├── SubcategoryTile.tsx
│   └── Footer.tsx
├── data/
│   ├── types.ts            # TypeScript Interfaces
│   ├── kategorien.ts       # 3 Bereiche + Unterkategorien
│   ├── referenzen.ts       # 13 Referenzen mit Daten
│   └── produkte.ts         # 14 Produkte mit Specs & Normen
├── lib/
│   └── basePath.ts         # GitHub Pages basePath Helper
├── public/images/
│   ├── hero.jpg            # Hero-Bild (1920x1080)
│   └── referenzen/         # 13 Referenzfotos aus PDFs
└── .github/workflows/
    └── deploy.yml          # GitHub Pages Auto-Deploy
```

## Deployment

GitHub Pages via GitHub Actions:

1. **Repo Settings → Pages → Source: "GitHub Actions"** aktivieren
2. Bei jedem Push auf `main` wird automatisch gebaut und deployt
3. Live unter: `https://sfleischmann-3steps2.github.io/KORODUR-Sanierung_app/`

## Status

- [x] Präsentation analysiert (119 Folien, 2 PDFs)
- [x] Next.js Projekt aufgesetzt
- [x] KORODUR Corporate Design implementiert
- [x] 13 Referenzen mit Daten & echten Fotos
- [x] 14 Produkte mit technischen Daten & Normen
- [x] Kachel-Navigation & Referenz-Detail-Seiten
- [x] Referenz-Übersicht mit Filter
- [x] Produkt-Verlinkung zu korodur.de
- [x] GitHub Pages Deployment
- [ ] Design-Review & Optimierung
- [ ] Weitere Referenzen ergänzen
- [ ] Bildoptimierung (WebP, Lazy Loading)
- [ ] Mehrsprachigkeit (perspektivisch)
