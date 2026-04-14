# KORODUR Sanierung App — UX-Redesign V3

**Datum:** 2026-04-14
**Status:** Approved
**Fokus:** UX-Optimierung aus Nutzersicht, Industriebodensanierung

---

## 1. Ziel & Kontext

Die bestehende App (V2.1) wird inkrementell umgebaut mit dem Ziel, die Nutzung aus Sicht von Interessenten (Planer, Architekten, Bauherren, Verleger) zu optimieren. Der Fokus liegt auf Industriebodensanierung (kleine Reparaturen und großflächige Sanierung). Außenflächen werden als Cross-Selling-Teaser mitgeführt.

**Kein Feature-Overload:** Es geht nicht um mehr Funktionalität, sondern darum, bestehende Inhalte (Referenzen, Produkte) besser zugänglich zu machen.

**Sprache:** Deutsch first. Andere Sprachen (EN/FR/PL) folgen nach Validierung des Konzepts.

---

## 2. Zielgruppen & Nutzungsszenarien

### Planungsphase (Planer, Architekt, Bauherr)
- Hat ein konkretes Sanierungsprojekt oder eine Problemstellung
- Will herausfinden, welches Produkt zu seinem Szenario passt
- Sucht Referenzen als Nachweis / Vertrauensanker
- Braucht technische Daten für Ausschreibungen

### Umsetzungsphase (Verleger)
- Kennt das Produkt bereits
- Sucht Verarbeitungshinweise und technische Details
- Braucht Basisinfos zu Untergrundvorbereitung, Schichtaufbau, Aushärtezeiten

---

## 3. Informationsarchitektur & Navigation

### Hauptnavigation (TopNav, horizontal)

```
Start | Lösungsfinder | Referenzen | Produktmatrix | Produkte
```

### Seitenstruktur

```
/de/                          → Startseite (Showcase)
/de/loesungsfinder/           → Intelligenter 5-Schritte-Flow
/de/referenzen/               → Filtrierbare Übersicht aller Referenzen
/de/referenzen/[slug]/        → Referenz-Detailseite (+ PDF-Download)
/de/produktmatrix/            → Produkt-Anwendungs-Matrix
/de/produkte/                 → Produktübersicht
/de/produkte/[id]/            → Produktdetailseite (+ Verarbeitungsinfos)
```

### Entfällt
- `/de/portfolio/` und alle Unterseiten (Industrieboden, Industriebau, Infrastruktur)
- `/de/sanierung-finden/` (alter 3-Schritte-Produktfinder)

### Navigation-Verhalten
- TopNav horizontal (Style Guide konform)
- Aktive Seite visuell hervorgehoben
- Mobile: Hamburger-Menü mit Drawer
- Volltextsuche (Cmd+K) bleibt erhalten
- Sprachschalter bleibt, zeigt nur DE in Phase 1

### CTA
- Immer auf KORODUR-Kontaktseite verlinkt
- DE: technische Berater Inland
- Andere Sprachen (später): technische Berater Ausland
- Kein eigenes Kontaktformular

---

## 4. Startseite (Showcase)

Aufbau von oben nach unten:

### 4.1 Hero-Bereich
- Headline: Klarer Value Proposition (z.B. "Die richtige Sanierungslösung für Ihren Industrieboden")
- Subline: Kurzer Satz, was die App bietet
- Primärer CTA-Button: "Lösungsfinder starten" → `/de/loesungsfinder/`
- Hero-Bild: Industrieboden-Sanierung in Aktion (Split-Layout)

### 4.2 Hervorgehobene Referenzen
- 3-4 kuratierte Referenzprojekte als Cards (Bild, Titel, Standort, eingesetztes Produkt)
- Section-Headline z.B. "Bewährte Lösungen aus der Praxis"
- Link "Alle Referenzen ansehen" → `/de/referenzen/`

### 4.3 Lösungsfinder-Teaser
- Kurze Erklärung: "In 5 Schritten zur passenden Lösung"
- Visualisierung der Schritte (Icons oder Nummern)
- CTA-Button: "Jetzt starten"

### 4.4 Außenflächen Cross-Selling-Teaser
- Eigene Section mit anderem Hintergrund (helles Grau)
- Headline: "Auch für Außenflächen" o.ä.
- 1-2 Referenz-Cards aus dem Außenbereich
- Hinweis: "Mehr dazu in Kürze" oder Link auf gefilterte Referenzen

### 4.5 CTA-Bereich + Footer
- "Sie haben ein konkretes Projekt? Unsere technischen Berater helfen weiter."
- Button → KORODUR Kontaktseite
- Footer kompakt, Style Guide konform

---

## 5. Lösungsfinder (Intelligenter Flow)

### Grundprinzip
Ein geführter 5-Schritte-Flow innerhalb einer Seite (`/de/loesungsfinder/`). Kein Seitenwechsel, sondern Schritt-für-Schritt-Ansichten.

### UI-Pattern
- Wizard mit Fortschrittsanzeige (5 nummerierte Schritte)
- Zurück-Button jederzeit möglich
- Auswahl per Klick auf Cards/Chips — kein Formular-Gefühl

### Schritt 1 — "Was ist Ihre Situation?"
Auswahl als große, klickbare Cards (Icon + Titel + Beschreibung):
- **Kleine Reparatur** — "Punktuelle Schäden wie Risse, Ausbrüche oder Löcher"
- **Großflächige Sanierung** — "Ganzheitliche Erneuerung eines Industriebodens"

Einfachauswahl, Klick führt direkt zu Schritt 2.

### Schritt 2 — "Welche Belastungen muss der Boden künftig aushalten?"
Auswahl als Chips/Tags (Mehrfachauswahl):
- Schwerlast (Stapler, LKW)
- Leichte Nutzung (Fußgänger, leichte Wagen)
- Rollende Lasten
- Punktlasten (Regale, Maschinen)
- **Nicht bekannt**

"Weiter"-Button.

Hinweis: "Nicht bekannt" ist exklusiv — bei Auswahl werden andere Optionen in diesem Schritt deaktiviert.

### Schritt 3 — "Wie sieht der aktuelle Zustand aus?"
Auswahl als Chips/Tags (Mehrfachauswahl):
- Risse / Ausbrüche
- Abrieb / Verschleiß
- Hohlstellen / Ablösungen
- Beschichtungsschäden
- Ebenheitsprobleme
- **Nicht bekannt** (exklusiv)

### Schritt 4 — "Gibt es besondere Anforderungen?"
Auswahl als Chips/Tags (Mehrfachauswahl, optional):
- Chemikalienbeständigkeit
- Tausalzbeständigkeit
- Rutschhemmung
- Kurze Sperrzeit (schnelle Nutzung)
- Außenbereich / Witterung
- Keine besonderen Anforderungen (exklusiv)
- **Nicht bekannt** (exklusiv)

### Schritt 5 — Ergebnisse
- Headline: "Passende Lösungen für Ihr Szenario"
- Zusammenfassung der Auswahl oben (editierbar — Klick ändert Kriterium)
- **Referenz-Cards** (sortiert nach Relevanz/Matching-Score):
  - Bild, Titel, Standort
  - Eingesetztes Produkt als Badge
  - Matching-Hinweis: warum diese Referenz passt (z.B. "Schwerlast, schnelle Aushärtung")
  - Klick → Referenz-Detailseite
- **Produkt-Empfehlungen** darunter:
  - Die Produkte aus den gezeigten Referenzen
  - Kompakte Card mit Name, Kerneigenschaft, Link zur Detailseite
- CTA: "Beratung anfragen" → KORODUR Kontaktseite
- Fallback bei wenig/keinen Treffern: "Für Ihr spezielles Szenario beraten unsere Experten Sie persönlich" + CTA

### Scoring-Logik
- Referenzen und Produkte werden mit Tags/Attributen versehen (Belastung, Zustand, Sonderbedingungen)
- Der Flow matcht Nutzerauswahl gegen diese Attribute
- Sortierung nach Anzahl der Übereinstimmungen (best match first)
- "Nicht bekannt"-Auswahl wird beim Scoring ignoriert (keine Filterung auf diesem Kriterium → breitere Ergebnisse)
- Bestehende `sanierung-finden.ts` Scoring-Logik wird als Basis adaptiert

---

## 6. Referenz-Übersicht & Detailseiten

### Übersicht (`/de/referenzen/`)

**Filterleiste:**
- **Anwendungsbereich:** Produktionshalle, Lager/Logistik, Zufahrt/Parkfläche, Werkstatt, etc.
- **Maßnahme:** Kleine Reparatur, Großflächige Sanierung
- **Produkt:** Filter nach eingesetztem Produkt
- Alle Filter als Chips/Dropdown, kombinierbar
- "Filter zurücksetzen"-Link
- Ergebniszähler: "12 Referenzen gefunden"

**Darstellung:**
- Responsive Card-Grid (3 Spalten Desktop, 2 Tablet, 1 Mobil)
- Jede Card: Bild, Titel, Standort, eingesetztes Produkt als Badge

### Detailseite (`/de/referenzen/[slug]/`)

Wie bisher, mit Ergänzungen:
- **Produkt-Badge** prominent sichtbar (klickbar → Produktdetailseite)
- **PDF-Download-Button:** "Referenzblatt herunterladen"
- **CTA unten:** "Ähnliches Projekt? Kontaktieren Sie unsere Berater" → KORODUR Kontaktseite

### Referenz-PDF (client-seitig generiert)
Inhalt:
- KORODUR-Logo
- Referenzbild
- Titel, Standort, Fläche
- Herausforderung & Lösung (Kurzfassung)
- Eingesetztes Produkt mit Kerndaten
- Verarbeitungshinweise / Besonderheiten zum eingesetzten Produkt
- Kontakthinweis KORODUR

---

## 7. Produktmatrix

### Seite: `/de/produktmatrix/`

Übersichtstabelle: welches Produkt für welche Situation.

**Layout:**
- **Zeilen = Produkte** (Produktnamen immer horizontal, gut lesbar)
- **Spalten = Anwendungsbereiche/Kriterien** (bei Platzmangel schräg/vertikal gesetzt)
- **Zellen:** Eignung als Icon (Häkchen/Punkt), ggf. abgestuft (empfohlen / geeignet / bedingt)

**Spalten-Kategorien** (dieselben Kriterien wie im Lösungsfinder):
- Situation: Kleine Reparatur, Großflächige Sanierung
- Belastung: Schwerlast, Leichte Nutzung, Rollende Lasten, Punktlasten
- Sonderbedingungen: Chemikalien, Tausalz, Rutschhemmung, Kurze Sperrzeit, Außenbereich

**Interaktion:**
- Produktname klickbar → Produktdetailseite
- Optional: Zeilen/Spalten anklickbar als Highlight-Filter
- Responsive: Mobil horizontal scrollbar oder gestapelte Cards

**Section darunter:**
- "Unsicher? Der Lösungsfinder führt Sie in 5 Schritten zur passenden Lösung" + CTA

---

## 8. Produktdetailseiten

### Seite: `/de/produkte/[id]/`

### 8.1 Bestehende Infos (bleiben)
- Produktname, Beschreibung, Kerneigenschaften
- Technische Daten (Druckfestigkeit, Verschleißwiderstand, Aushärtezeit, etc.)
- Normen & Zertifizierungen

### 8.2 Verarbeitungshinweise (NEU)
Section "Verarbeitung" mit Basisinfos aus TDS / Notion-Datenbank:
- Untergrundvorbereitung
- Mischverhältnis / Anmischung
- Schichtaufbau
- Verarbeitungszeit / Topfzeit
- Aushärtezeit bis Begehbarkeit / Belastbarkeit
- Besonderheiten (z.B. Temperaturanforderungen, Nachbehandlung)
- Link zum TDS-PDF: "Technisches Datenblatt herunterladen"

**Datenquelle:** Notion-Datenbank "Kern Produktdaten" (https://www.notion.so/2ec670e19e1a81b2a88cdb34ba585df6)

### 8.3 Zugehörige Referenzen (NEU)
- Section "Dieses Produkt im Einsatz"
- 2-3 Referenz-Cards mit diesem Produkt
- Link "Alle Referenzen mit diesem Produkt" → vorgefilterte Referenzübersicht

### 8.4 CTA
- "Fragen zur Verarbeitung? Unsere technischen Berater helfen weiter" → Kontaktseite

---

## 9. Datenmodell-Erweiterungen

### Referenzen (`data/referenzen.ts`) — neue Felder
```typescript
anwendungsbereich: string;       // z.B. "Produktionshalle", "Lager", "Zufahrt"
massnahme: "kleine-reparatur" | "grossflaechige-sanierung";
belastungen: string[];           // z.B. ["schwerlast", "rollende-lasten"]
zustand: string[];               // z.B. ["risse", "abrieb"]
sonderbedingungen: string[];     // z.B. ["chemikalien", "kurze-sperrzeit"]
```

### Produkte (`data/produkte.ts`) — neue Felder
```typescript
verarbeitung: {
  untergrundvorbereitung: string;
  mischverhaeltnis: string;
  schichtaufbau: string;
  verarbeitungszeit: string;
  aushaertezeit: string;
  besonderheiten: string;
};
tdsUrl: string;                  // Link zum TDS-PDF
eignungen: string[];             // Dieselben Tags wie bei Referenzen (für Matrix)
```

### Lösungsfinder (`data/sanierung-finden.ts`)
- Komplett neu geschrieben
- Scoring: Tag-Matching zwischen Nutzerauswahl und Referenz-/Produkt-Attributen
- Ersetzt bisherigen 3-Schritte-Wizard

### Startseite
```typescript
featuredReferenzen: string[];    // 3-4 Slugs für kuratierte Showcase-Referenzen
```

---

## 10. Technische Architektur

### Was bleibt
- Next.js 16 (App Router, Static Export)
- TypeScript, Tailwind CSS 4
- GitHub Pages Deployment
- PWA (Service Worker, Manifest)
- Volltextsuche (Cmd+K)
- i18n-Infrastruktur (nur DE aktiv in Phase 1)
- Responsive Design, Accessibility-Standards
- Design-System: Gabarito Font, Navy (#002d59), Cyan (#009ee3), 8px Grid

### Änderungen

| Bereich | Aktuell | Neu |
|---|---|---|
| Navigation | 5 Punkte inkl. Portfolio-Bereiche | Start, Lösungsfinder, Referenzen, Produktmatrix, Produkte |
| Startseite | Hero + CTA | Showcase: Hero + Featured Referenzen + Teaser |
| Produktfinder | 3-Schritte-Wizard | 5-Schritte-Lösungsfinder mit Tag-Scoring |
| Referenzen | Liste mit Kategoriefilter | Erweiterte Filter + PDF-Download |
| Produkte | Technische Daten | + Verarbeitungshinweise + zugehörige Referenzen |
| Portfolio-Seiten | 3 eigene Bereiche | Entfallen |
| Neue Seite | — | Produktmatrix |

### Neue Dependency
- `jspdf` (oder vergleichbar) für client-seitige PDF-Generierung

### Routing
- Alte Routen (`/de/portfolio/*`, `/de/sanierung-finden/`) erhalten Redirects auf neue Seiten
- Bestehende Links laufen nicht ins Leere

### Build-Output
- ~200 statische Seiten (nur DE in Phase 1, Portfolio-Seiten entfallen, Produktmatrix neu)

---

## 11. Außerhalb des Scopes

- Mehrsprachigkeit (EN/FR/PL) — folgt nach Konzeptvalidierung
- Eigenes Kontaktformular
- CMS-Anbindung
- Alter Produktfinder als zusätzliches Quick-Feature (erst nach Expertenaustausch)
- Eigenständiger Außenflächen-Bereich
- Analytics / Tracking
