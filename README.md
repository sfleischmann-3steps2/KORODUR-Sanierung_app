# KORODUR Sanierung – Web App

Interaktive Web-Applikation zur Präsentation des KORODUR-Sanierungsportfolios. Zielgruppe: Vertriebler, Bauherren, Architekten und Interessenten.

## Ziel

Die bestehende PowerPoint-Präsentation (119 Folien) in eine moderne, erweiterbare Web-Applikation überführen, die:

- **Interaktiv & klickbar** ist – Kachel-Navigation ermöglicht es, gezielt auf Kundenbedürfnisse einzugehen
- **Für Vertriebler** als Gesprächstool im Kundentermin funktioniert
- **Für Kunden** über die Website selbstständig erkundbar ist
- **Erweiterbar** ist – neue Referenzen, Produkte und Bereiche einfach hinzufügbar
- **Performant** bleibt – trotz vieler Bilder und Referenzen schnell lädt

## Inhaltsstruktur

```
Startseite: "Sanieren mit KORODUR"
│
├── Warum Sanierung?
│   ├── Vorteile der Sanierung
│   ├── Herausforderungen im Bestand
│   └── Warum KORODUR? (Qualität, Service, 90 Jahre Erfahrung)
│
└── Produktportfolio
     │
     ├── Industrieboden
     │   ├── Übersicht & 3-Schritte-Prozess
     │   ├── Schwerste Belastung
     │   │   ├── Sanierung übers Wochenende (Antolin)
     │   │   ├── WEAG Entsorgungsbetrieb
     │   │   ├── Wochenend-Sanierung Werkstatt (Neutraubling)
     │   │   ├── Strandkorbhalle Sylt
     │   │   ├── Produktionshalle Kleemann
     │   │   ├── Sanierung im laufenden Betrieb (Loosen)
     │   │   ├── Produktionsfläche Monheim
     │   │   ├── Ausstellungshalle Neuhaus Neotec
     │   │   ├── Restaurant HÄRG Tallinn
     │   │   └── Helipad Sanierung Polen
     │   ├── Dünnschicht
     │   │   ├── Produktionshalle Guben
     │   │   ├── Nike Store Polen
     │   │   └── Obstplantage Ibbenbüren
     │   └── Schnelle Reparaturen
     │       ├── DHL Überladebrücken
     │       ├── Fugensanierung Lyreco
     │       ├── Sanierung einer Sanierung
     │       ├── Helipad Sanierung Polen
     │       └── LKW Waschstraße
     │
     ├── Industriebau
     │   ├── DHL Überladebrücken
     │   ├── Fugensanierung Lyreco
     │   ├── Absenksteine (LKW-Tankstelle)
     │   ├── Treppenstufen Sanierung
     │   ├── Sinusfugen Sanierung
     │   ├── Trennfugen Sanierung (Bohnenkamp)
     │   └── LKW Einstellplatz (Berlin)
     │
     └── Infrastruktur
         ├── Verkehr
         │   ├── Hafen Catania
         │   ├── Theodor-Heuss-Brücke
         │   ├── Autohaus Versmold
         │   ├── Hubschrauber-Landeplatz Finnland
         │   ├── LKW Umfahrt Darmstadt
         │   └── Parkhaus Flughafen Zürich
         └── Wasser
             ├── Trinkwasser-Hochbehälter Haidberg
             ├── Trinkwasserbehälter Bad Nauheim
             └── Trinkwasserturm Budapest
```

## Produkte (referenziert in den Cases)

| Produkt | Typ | Einsatz |
|---|---|---|
| **NEODUR HE 60 rapid** | Hartstoff-Schnellestrich | 24h-Sanierung, 10-60 mm |
| **NEODUR HE 65 Plus** | Hochbelastbarer Hartstoffestrich | Extrem-Belastung, Innen/Außen, 15-30 mm |
| **NEODUR Level** | Selbstverlaufender Dünnestrich | Präzise Sanierung, 4-10 mm |
| **KORODUR HB 5 / HB 5 rapid** | Haftbrücke / Grundierung | Verbund zum Untergrund |
| **KORODUR PC** | Grundierung | Dünnestrich-Vorbereitung |
| **Rapid Set CEMENT ALL** | Schnellzement | Punktuelle Reparaturen |
| **Rapid Set MORTAR MIX** | Schnellmörtel | Fugen, Reprofilierung |
| **KOROCRETE** | Schnellbeton | Großflächen, volumetrisch |
| **MICROTOP TW** | Trinkwasser-Beschichtung | Behälter-Sanierung |
| **DUROP** | Hartstoff-Abstreumaterial | Oberflächenschutz |
| **KOROTEX / KOROMINERAL CURE** | Nachbehandlung | Curing & Silikatisierung |
| **ASPHALT REPAIR MIX** | Asphalt-Reparatur | Verkehrsflächen |

## Tech Stack (geplant)

- **Framework:** Next.js (React) mit App Router
- **Styling:** Tailwind CSS
- **Content:** MDX oder JSON-basierte Datenstruktur für einfache Erweiterbarkeit
- **Bilder:** Optimiert via Next.js Image, lazy loading
- **Deployment:** Vercel oder ähnlich (statisch exportierbar)
- **Sprache:** Deutsch (perspektivisch mehrsprachig)

## Konzeptentscheidungen

### Warum Web App statt PowerPoint?

| Aspekt | PowerPoint | Web App |
|---|---|---|
| Dateigröße | ~23 MB, wächst weiter | Bilder on-demand geladen |
| Erweiterbarkeit | Mühsam, Folien-Limit | Unbegrenzt, einfach neue Referenzen |
| Zugriff | Datei teilen/installieren | URL öffnen, fertig |
| Aktualisierung | Neue Datei verteilen | Einmal deployen, alle sehen es |
| Interaktivität | Begrenzt (Hyperlinks) | Volle Web-Interaktivität |
| Mobile | Schlecht | Responsive Design |
| Suche/Filter | Nicht möglich | Nach Branche, Produkt, Region filtern |

### Navigationskonzept

Die Kachel-basierte Navigation bleibt das Herzstück. Der Vertriebler kann:

1. **Startseite** → Überblick & Einstieg
2. **Produktportfolio** → Kacheln für Industrieboden / Industriebau / Infrastruktur
3. **Kategorie** → Kacheln für Unterkategorien (z.B. Schwerlast, Dünnschicht)
4. **Referenz** → Vollbild-Story mit Herausforderung → Lösung → Vorteile
5. Jederzeit über Breadcrumb oder Kachel-Navigation zu anderem Thema springen

### Datenmodell (Entwurf)

Jede Referenz wird als strukturiertes Datenobjekt gespeichert:

```
Referenz {
  id, slug, titel, untertitel,
  kategorie: [industrieboden | industriebau | infrastruktur],
  unterkategorie: [schwerlast | duennschicht | schnelle-reparaturen | verkehr | wasser],
  ort, land, fläche,
  produkte: [...],
  herausforderungen: [...],
  lösung: string,
  vorteile: [...],
  bilder: [...],
  tags: [...]
}
```

## Projektstruktur (geplant)

```
/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Startseite
│   ├── portfolio/
│   │   ├── page.tsx        # Portfolio-Übersicht (3 Kacheln)
│   │   ├── industrieboden/
│   │   ├── industriebau/
│   │   └── infrastruktur/
│   └── referenzen/
│       └── [slug]/page.tsx # Einzelne Referenz-Seite
├── components/
│   ├── TileGrid.tsx        # Kachel-Navigation
│   ├── ReferenceCard.tsx   # Referenz-Vorschau
│   ├── ReferenceDetail.tsx # Vollansicht einer Referenz
│   ├── ProductBadge.tsx    # Produkt-Tag
│   └── Navigation.tsx      # Breadcrumb + Hauptnav
├── data/
│   ├── referenzen/         # JSON/MDX pro Referenz
│   └── produkte.ts         # Produktdaten
├── public/
│   └── images/             # Referenzbilder
└── docs/
    └── praesentation/      # Original-PDFs als Referenz
```

## Status

- [x] Präsentation analysiert und Inhalte strukturiert
- [ ] Bilder aus Präsentation extrahieren
- [ ] Next.js Projekt aufsetzen
- [ ] Datenmodell & Referenzdaten anlegen
- [ ] Kachel-Navigation implementieren
- [ ] Referenz-Detail-Seiten bauen
- [ ] Produkt-Übersichten
- [ ] Responsive Design & Mobile-Optimierung
- [ ] Deployment einrichten
