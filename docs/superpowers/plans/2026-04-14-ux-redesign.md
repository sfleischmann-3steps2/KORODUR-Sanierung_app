# UX-Redesign V3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Inkrementeller Umbau der KORODUR Sanierung App — neuer Lösungsfinder, Produktmatrix, Showcase-Startseite, erweiterte Produktseiten, Referenz-PDF-Download.

**Architecture:** Bestehende Next.js 16 App wird Schritt für Schritt umgebaut. Datenmodell wird um Tags/Attribute für Lösungsfinder-Scoring erweitert. Neue Seiten (Lösungsfinder, Produktmatrix) werden als App Router Pages hinzugefügt. Alte Routen (Portfolio, Sanierung-finden) bekommen Client-Redirects. jsPDF für client-seitige PDF-Generierung.

**Tech Stack:** Next.js 16 (App Router, Static Export), React 19, TypeScript, Tailwind CSS 4, jsPDF

**Spec:** `docs/superpowers/specs/2026-04-14-ux-redesign-design.md`

---

## File Structure Overview

### Neue Dateien
- `data/loesungsfinder.ts` — Flow-Steps, Optionen, Scoring-Logik
- `data/featured.ts` — kuratierte Startseiten-Referenzen
- `app/[lang]/loesungsfinder/page.tsx` — Lösungsfinder-Seite
- `app/[lang]/produktmatrix/page.tsx` — Produktmatrix-Seite
- `components/Loesungsfinder.tsx` — Client-Komponente für den 5-Schritte-Flow
- `components/ProgressBar.tsx` — Fortschrittsanzeige für den Flow
- `components/ChipSelect.tsx` — Wiederverwendbare Chip/Tag-Auswahl
- `components/Produktmatrix.tsx` — Client-Komponente für interaktive Matrix
- `components/ReferenzPdf.tsx` — PDF-Download-Button + Generierung
- `lib/pdf.ts` — jsPDF-Wrapper für Referenzblatt-Generierung

### Zu ändernde Dateien
- `data/types.ts` — neue Felder für Referenzen und Produkte
- `data/referenzen.ts` — Tags/Attribute für alle 29 Referenzen
- `data/produkte.ts` — Verarbeitungshinweise, TDS-URLs, Eignungen
- `components/TopNav.tsx` — neue Navigation (5 Punkte, kein Portfolio-Dropdown)
- `app/[lang]/page.tsx` — Showcase-Startseite
- `app/[lang]/referenzen/page.tsx` — erweiterte Filterleiste
- `app/[lang]/referenzen/[slug]/page.tsx` — PDF-Download, Produkt-Badge
- `app/[lang]/produkte/[id]/page.tsx` — Verarbeitungshinweise, zugehörige Referenzen
- `app/[lang]/dictionaries/de.json` — neue UI-Strings

### Zu entfernende Dateien (nach Redirects)
- `app/[lang]/portfolio/page.tsx`
- `app/[lang]/portfolio/[kategorie]/page.tsx`
- `data/sanierung-finden.ts` (ersetzt durch `data/loesungsfinder.ts`)

---

## Task 1: Datenmodell erweitern

**Files:**
- Modify: `data/types.ts`
- Modify: `data/produkte.ts`
- Modify: `data/referenzen.ts`
- Create: `data/featured.ts`

- [ ] **Step 1: Types erweitern — neue Felder definieren**

In `data/types.ts` die Interfaces erweitern:

```typescript
// Neue Typen für Lösungsfinder-Tags
export type Massnahme = "kleine-reparatur" | "grossflaechige-sanierung";

export type Belastung =
  | "schwerlast"
  | "leichte-nutzung"
  | "rollende-lasten"
  | "punktlasten";

export type Zustand =
  | "risse"
  | "abrieb"
  | "hohlstellen"
  | "beschichtungsschaeden"
  | "ebenheitsprobleme";

export type Sonderbedingung =
  | "chemikalien"
  | "tausalz"
  | "rutschhemmung"
  | "kurze-sperrzeit"
  | "aussenbereich";

export type Anwendungsbereich =
  | "produktionshalle"
  | "lager"
  | "werkstatt"
  | "zufahrt"
  | "parkflaeche"
  | "bruecke"
  | "hafen"
  | "sonstiges";
```

Zum `Referenz`-Interface hinzufügen (nach `bildAlt`):

```typescript
  anwendungsbereich: Anwendungsbereich;
  massnahme: Massnahme;
  belastungen: Belastung[];
  zustand: Zustand[];
  sonderbedingungen: Sonderbedingung[];
```

Neues Interface für erweiterte Produktdaten — unter dem `Referenz`-Interface einfügen:

```typescript
export interface Verarbeitung {
  untergrundvorbereitung: string;
  mischverhaeltnis: string;
  schichtaufbau: string;
  verarbeitungszeit: string;
  aushaertezeit: string;
  besonderheiten: string;
}
```

- [ ] **Step 2: Build prüfen**

Run: `cd /Users/sfleischmann/KORODUR-Sanierung_app && npm run build 2>&1 | head -30`

Expected: Build-Fehler, weil die bestehenden Referenzen die neuen Pflichtfelder nicht haben. Das ist korrekt — wir ergänzen die Daten im nächsten Schritt.

- [ ] **Step 3: Produkt-Interface erweitern**

In `data/produkte.ts` das `Produkt`-Interface erweitern — nach `websiteUrl?`:

```typescript
  verarbeitung?: Verarbeitung;
  tdsUrl?: string;
  eignungen?: (Belastung | Sonderbedingung | Massnahme)[];
```

Import am Anfang der Datei hinzufügen:

```typescript
import type { Verarbeitung, Belastung, Sonderbedingung, Massnahme } from "./types";
```

Hinweis: Die neuen Felder sind optional (`?`), damit der Build nicht bricht. Die Daten werden schrittweise ergänzt.

- [ ] **Step 4: Referenzen um Tags erweitern — alle 29 Referenzen**

Jede Referenz in `data/referenzen.ts` bekommt die neuen Felder. Hier die Zuordnung, die auf Basis der Herausforderungen, Lösungen und Produkte abgeleitet wird.

Import am Anfang:

```typescript
import type { Referenz, Anwendungsbereich, Massnahme, Belastung, Zustand, Sonderbedingung } from "./types";
```

Beispiel für die erste Referenz (Antolin):

```typescript
{
  // ... bestehende Felder ...
  anwendungsbereich: "produktionshalle",
  massnahme: "grossflaechige-sanierung",
  belastungen: ["schwerlast"],
  zustand: ["abrieb"],
  sonderbedingungen: ["kurze-sperrzeit"],
}
```

Beispiel für die zweite Referenz (Kleemann):

```typescript
{
  // ... bestehende Felder ...
  anwendungsbereich: "produktionshalle",
  massnahme: "grossflaechige-sanierung",
  belastungen: ["schwerlast", "punktlasten"],
  zustand: ["abrieb"],
  sonderbedingungen: ["kurze-sperrzeit"],
}
```

Die Tags für alle 29 Referenzen müssen individuell aus den Herausforderungen, Lösungen und Produkten abgeleitet werden. Der ausführende Agent muss jede Referenz lesen und passende Tags zuweisen. Logik:

- `massnahme`: Wenn "punktuell/Reparatur" → `kleine-reparatur`, wenn "Sanierung/Erneuerung" → `grossflaechige-sanierung`
- `belastungen`: Aus Herausforderungen ableiten (Schwerlast, Stapler, LKW → `schwerlast`; Fußgänger → `leichte-nutzung`)
- `zustand`: Aus Herausforderungen ableiten (Risse → `risse`; Verschleiß → `abrieb`; Hohlstellen → `hohlstellen`)
- `sonderbedingungen`: Aus Herausforderungen/Produkt ableiten (Tausalz → `tausalz`; Chemie → `chemikalien`; schnell → `kurze-sperrzeit`; Außen → `aussenbereich`)
- `anwendungsbereich`: Aus Titel/Untertitel/Kontext ableiten

- [ ] **Step 5: Featured-Referenzen definieren**

Neue Datei `data/featured.ts`:

```typescript
/** Kuratierte Referenz-Slugs für die Showcase-Startseite */
export const FEATURED_SLUGS = [
  "kleemann-produktionshalle",
  "guben-parkdeck",
  "antolin-wochenend-sanierung",
] as const;
```

- [ ] **Step 6: Build prüfen**

Run: `cd /Users/sfleischmann/KORODUR-Sanierung_app && npm run build 2>&1 | tail -20`

Expected: Build erfolgreich (alle Referenzen haben die neuen Pflichtfelder, Produkte haben optionale Felder).

- [ ] **Step 7: Commit**

```bash
cd /Users/sfleischmann/KORODUR-Sanierung_app
git add data/types.ts data/referenzen.ts data/produkte.ts data/featured.ts
git commit -m "feat: Datenmodell erweitern — Tags für Lösungsfinder, Verarbeitungshinweise, Featured-Referenzen"
```

---

## Task 2: Navigation umbauen

**Files:**
- Modify: `components/TopNav.tsx`
- Modify: `app/[lang]/dictionaries/de.json`

- [ ] **Step 1: Deutsche UI-Strings für neue Navigation hinzufügen**

In `app/[lang]/dictionaries/de.json` die `nav`-Sektion ersetzen:

```json
{
  "nav": {
    "home": "Start",
    "loesungsfinder": "Lösungsfinder",
    "referenzen": "Referenzen",
    "produktmatrix": "Produktmatrix",
    "produkte": "Produkte"
  }
}
```

Alte Keys (`portfolio`, `sanierung_finden` etc.) entfernen, sofern vorhanden.

- [ ] **Step 2: TopNav.tsx umbauen — Desktop-Navigation**

Die Desktop-Navigation in `TopNav.tsx` vereinfachen. Das Portfolio-Dropdown und den alten "Sanierung finden"-CTA entfernen. Neue Links:

```typescript
const navLinks = [
  { href: `/${lang}/`, label: dict.nav.home },
  { href: `/${lang}/loesungsfinder/`, label: dict.nav.loesungsfinder },
  { href: `/${lang}/referenzen/`, label: dict.nav.referenzen },
  { href: `/${lang}/produktmatrix/`, label: dict.nav.produktmatrix },
  { href: `/${lang}/produkte/`, label: dict.nav.produkte },
];
```

Die gesamte Desktop-Navigation (`<nav className="hidden lg:flex ...">`) durch eine einfache Link-Liste ersetzen. Kein Dropdown mehr. Portfolio-Ref, handleClickOutside und Dropdown-State entfernen.

Aktive Seite erkennen: `pathname === link.href` oder `pathname.startsWith(link.href)` (für Unterseiten wie `/de/referenzen/[slug]/`). Sonderfall: Home (`/de/`) nur exakt matchen.

- [ ] **Step 3: TopNav.tsx umbauen — Mobile-Drawer**

Den Mobile-Drawer analog vereinfachen. Statt Portfolio-Expansion einfach die 5 Links untereinander:

```tsx
{navLinks.map((link) => (
  <Link
    key={link.href}
    href={link.href}
    className={`block px-6 py-3 text-[15px] font-medium ${
      isActive(link.href)
        ? "text-white bg-[rgba(255,255,255,0.08)] border-l-2 border-[#009ee3]"
        : "text-white/72 hover:text-white hover:bg-[rgba(255,255,255,0.06)]"
    }`}
    onClick={() => setDrawerOpen(false)}
  >
    {link.label}
  </Link>
))}
```

- [ ] **Step 4: Dev-Server prüfen**

Run: `cd /Users/sfleischmann/KORODUR-Sanierung_app && npm run dev`

Im Browser öffnen: `http://localhost:3000/de/`

Prüfen:
- 5 Links in der TopNav sichtbar (Start, Lösungsfinder, Referenzen, Produktmatrix, Produkte)
- Kein Portfolio-Dropdown mehr
- Mobile Drawer funktioniert (Browserfenster schmaler machen)
- Aktive Seite hervorgehoben
- Suche (Cmd+K) funktioniert noch

- [ ] **Step 5: Commit**

```bash
cd /Users/sfleischmann/KORODUR-Sanierung_app
git add components/TopNav.tsx app/[lang]/dictionaries/de.json
git commit -m "feat: Navigation umbauen — 5 Punkte, Portfolio-Dropdown entfernt"
```

---

## Task 3: Showcase-Startseite

**Files:**
- Modify: `app/[lang]/page.tsx`
- Modify: `app/[lang]/dictionaries/de.json`

- [ ] **Step 1: Neue UI-Strings für Startseite**

In `de.json` die `home`-Sektion aktualisieren/erweitern:

```json
{
  "home": {
    "hero_title": "Die richtige Sanierungslösung für Ihren Industrieboden",
    "hero_subtitle": "Finden Sie das passende Produkt für Ihre Sanierung — basierend auf echten Referenzprojekten und bewährten Lösungen.",
    "hero_cta": "Lösungsfinder starten",
    "featured_title": "Bewährte Lösungen aus der Praxis",
    "featured_link": "Alle Referenzen ansehen",
    "finder_teaser_title": "In 5 Schritten zur passenden Lösung",
    "finder_teaser_description": "Beschreiben Sie Ihre Situation, und wir zeigen Ihnen passende Produkte und Referenzprojekte.",
    "finder_teaser_cta": "Jetzt starten",
    "finder_step1": "Situation",
    "finder_step2": "Belastung",
    "finder_step3": "Zustand",
    "finder_step4": "Anforderungen",
    "finder_step5": "Ergebnisse",
    "outdoor_title": "Auch für Außenflächen",
    "outdoor_description": "Zufahrten, Parkflächen und Pflastersanierung — unsere Produkte schützen auch im Außenbereich.",
    "outdoor_link": "Referenzen Außenbereich",
    "cta_title": "Sie haben ein konkretes Projekt?",
    "cta_description": "Unsere technischen Berater helfen Ihnen, die optimale Sanierungslösung zu finden.",
    "cta_button": "Berater kontaktieren"
  }
}
```

- [ ] **Step 2: Startseite umbauen — Hero**

`app/[lang]/page.tsx` komplett umschreiben. Aufbau:

```tsx
// Section 1: Hero (Split-Layout wie bisher)
<section className="relative" style={{ minHeight: "480px", background: "#002d59" }}>
  <div className="max-w-7xl mx-auto px-8 py-24 flex flex-col lg:flex-row items-center gap-16">
    <div className="flex-1 text-white">
      <h1 className="text-5xl font-[900] leading-[1.08] mb-6">
        {dict.home.hero_title}
      </h1>
      <p className="text-lg text-white/72 mb-8 leading-relaxed">
        {dict.home.hero_subtitle}
      </p>
      <Link
        href={`/${lang}/loesungsfinder/`}
        className="inline-block bg-[#009ee3] hover:bg-[#0090d0] text-white font-[800] px-8 py-4 rounded-md text-lg"
      >
        {dict.home.hero_cta}
      </Link>
    </div>
    <div className="flex-1 relative">
      <Image src={withBasePath("/images/hero.jpg")} alt="..." fill className="object-cover rounded-2xl" />
    </div>
  </div>
</section>
```

- [ ] **Step 3: Startseite — Featured Referenzen**

```tsx
// Section 2: Featured Referenzen
<section className="py-24 px-8 bg-white">
  <div className="max-w-7xl mx-auto">
    <h2 className="text-4xl font-[900] text-[#002d59] mb-12">
      {dict.home.featured_title}
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {featuredRefs.map((ref) => (
        <ReferenceCard key={ref.id} referenz={ref} lang={lang} dict={dict} />
      ))}
    </div>
    <div className="mt-8 text-center">
      <Link href={`/${lang}/referenzen/`} className="text-[#009ee3] font-[700] hover:underline">
        {dict.home.featured_link} →
      </Link>
    </div>
  </div>
</section>
```

Featured Referenzen laden:

```tsx
import { FEATURED_SLUGS } from "@/data/featured";
import { referenzen } from "@/data/referenzen";

const featuredRefs = FEATURED_SLUGS
  .map((slug) => referenzen.find((r) => r.slug === slug))
  .filter(Boolean);
```

- [ ] **Step 4: Startseite — Lösungsfinder-Teaser**

```tsx
// Section 3: Lösungsfinder-Teaser
<section className="py-24 px-8 bg-[#f5f5f6]">
  <div className="max-w-7xl mx-auto text-center">
    <h2 className="text-4xl font-[900] text-[#002d59] mb-6">
      {dict.home.finder_teaser_title}
    </h2>
    <p className="text-lg text-[#002d59]/72 mb-12 max-w-2xl mx-auto">
      {dict.home.finder_teaser_description}
    </p>
    <div className="flex justify-center gap-8 mb-12">
      {[dict.home.finder_step1, dict.home.finder_step2, dict.home.finder_step3, dict.home.finder_step4, dict.home.finder_step5].map((step, i) => (
        <div key={i} className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-[#009ee3] text-white flex items-center justify-center font-[800] text-sm">
            {i + 1}
          </div>
          <span className="text-sm font-[700] text-[#002d59]">{step}</span>
        </div>
      ))}
    </div>
    <Link
      href={`/${lang}/loesungsfinder/`}
      className="inline-block bg-[#009ee3] hover:bg-[#0090d0] text-white font-[800] px-8 py-4 rounded-md text-lg"
    >
      {dict.home.finder_teaser_cta}
    </Link>
  </div>
</section>
```

- [ ] **Step 5: Startseite — Außenflächen-Teaser + CTA + Fertigstellung**

```tsx
// Section 4: Außenflächen Cross-Selling
<section className="py-24 px-8 bg-white">
  <div className="max-w-7xl mx-auto">
    <h2 className="text-4xl font-[900] text-[#002d59] mb-4">
      {dict.home.outdoor_title}
    </h2>
    <p className="text-lg text-[#002d59]/72 mb-8">
      {dict.home.outdoor_description}
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {outdoorRefs.map((ref) => (
        <ReferenceCard key={ref.id} referenz={ref} lang={lang} dict={dict} />
      ))}
    </div>
  </div>
</section>

// Section 5: CTA
<section className="py-24 px-8 bg-[#002d59]">
  <div className="max-w-3xl mx-auto text-center text-white">
    <h2 className="text-4xl font-[900] mb-4">{dict.home.cta_title}</h2>
    <p className="text-lg text-white/72 mb-8">{dict.home.cta_description}</p>
    <a
      href="https://www.korodur.de/kontakt/"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block border-2 border-white text-white hover:bg-white hover:text-[#002d59] font-[800] px-8 py-4 rounded-md text-lg"
    >
      {dict.home.cta_button}
    </a>
  </div>
</section>
```

Außenflächen-Referenzen filtern:

```typescript
const outdoorRefs = referenzen
  .filter((r) => r.sonderbedingungen?.includes("aussenbereich") || r.anwendungsbereich === "zufahrt" || r.anwendungsbereich === "parkflaeche")
  .slice(0, 2);
```

- [ ] **Step 6: Dev-Server prüfen**

Im Browser `http://localhost:3000/de/` öffnen.

Prüfen:
- Hero mit Headline, Subline, CTA-Button "Lösungsfinder starten"
- 3 Featured Referenz-Cards
- Lösungsfinder-Teaser mit 5 Schritten
- Außenflächen-Teaser mit 1-2 Cards
- CTA-Bereich mit Button zur Kontaktseite
- Responsive: Mobile, Tablet, Desktop

- [ ] **Step 7: Commit**

```bash
cd /Users/sfleischmann/KORODUR-Sanierung_app
git add app/[lang]/page.tsx app/[lang]/dictionaries/de.json
git commit -m "feat: Showcase-Startseite — Hero, Featured Referenzen, Lösungsfinder-Teaser, Außenflächen"
```

---

## Task 4: Lösungsfinder — Daten & Scoring

**Files:**
- Create: `data/loesungsfinder.ts`

- [ ] **Step 1: Lösungsfinder-Datenstruktur und Steps definieren**

Neue Datei `data/loesungsfinder.ts`:

```typescript
import type { Referenz, Massnahme, Belastung, Zustand, Sonderbedingung } from "./types";
import { referenzen } from "./referenzen";
import { produkte, type Produkt } from "./produkte";

/* ---- Step-Definitionen ---- */

export interface FlowOption<T extends string> {
  id: T | "nicht-bekannt";
  label: string;
  beschreibung?: string;
}

export interface FlowStep<T extends string> {
  id: string;
  frage: string;
  mehrfach: boolean;
  exklusiv?: string[];       // IDs, die andere deaktivieren
  optionen: FlowOption<T>[];
}

export const step1: FlowStep<Massnahme> = {
  id: "situation",
  frage: "Was ist Ihre Situation?",
  mehrfach: false,
  optionen: [
    {
      id: "kleine-reparatur",
      label: "Kleine Reparatur",
      beschreibung: "Punktuelle Schäden wie Risse, Ausbrüche oder Löcher",
    },
    {
      id: "grossflaechige-sanierung",
      label: "Großflächige Sanierung",
      beschreibung: "Ganzheitliche Erneuerung eines Industriebodens",
    },
  ],
};

export const step2: FlowStep<Belastung> = {
  id: "belastung",
  frage: "Welche Belastungen muss der Boden künftig aushalten?",
  mehrfach: true,
  exklusiv: ["nicht-bekannt"],
  optionen: [
    { id: "schwerlast", label: "Schwerlast (Stapler, LKW)" },
    { id: "leichte-nutzung", label: "Leichte Nutzung (Fußgänger, leichte Wagen)" },
    { id: "rollende-lasten", label: "Rollende Lasten" },
    { id: "punktlasten", label: "Punktlasten (Regale, Maschinen)" },
    { id: "nicht-bekannt", label: "Nicht bekannt" },
  ],
};

export const step3: FlowStep<Zustand> = {
  id: "zustand",
  frage: "Wie sieht der aktuelle Zustand aus?",
  mehrfach: true,
  exklusiv: ["nicht-bekannt"],
  optionen: [
    { id: "risse", label: "Risse / Ausbrüche" },
    { id: "abrieb", label: "Abrieb / Verschleiß" },
    { id: "hohlstellen", label: "Hohlstellen / Ablösungen" },
    { id: "beschichtungsschaeden", label: "Beschichtungsschäden" },
    { id: "ebenheitsprobleme", label: "Ebenheitsprobleme" },
    { id: "nicht-bekannt", label: "Nicht bekannt" },
  ],
};

export const step4: FlowStep<Sonderbedingung> = {
  id: "sonderbedingungen",
  frage: "Gibt es besondere Anforderungen?",
  mehrfach: true,
  exklusiv: ["nicht-bekannt", "keine"],
  optionen: [
    { id: "chemikalien", label: "Chemikalienbeständigkeit" },
    { id: "tausalz", label: "Tausalzbeständigkeit" },
    { id: "rutschhemmung", label: "Rutschhemmung" },
    { id: "kurze-sperrzeit", label: "Kurze Sperrzeit (schnelle Nutzung)" },
    { id: "aussenbereich", label: "Außenbereich / Witterung" },
    { id: "keine", label: "Keine besonderen Anforderungen" },
    { id: "nicht-bekannt", label: "Nicht bekannt" },
  ],
};

/* ---- Scoring ---- */

export interface UserSelection {
  massnahme: string;
  belastungen: string[];
  zustand: string[];
  sonderbedingungen: string[];
}

export interface ScoredReferenz {
  referenz: Referenz;
  score: number;
  matchingTags: string[];
}

export interface FlowErgebnis {
  referenzen: ScoredReferenz[];
  produkte: Produkt[];
}

export function berechneErgebnisse(auswahl: UserSelection): FlowErgebnis {
  const scored: ScoredReferenz[] = referenzen.map((ref) => {
    let score = 0;
    const matchingTags: string[] = [];

    // Massnahme (wenn nicht "nicht-bekannt")
    if (auswahl.massnahme !== "nicht-bekannt" && ref.massnahme === auswahl.massnahme) {
      score += 3;
      matchingTags.push(ref.massnahme);
    }

    // Belastungen
    const belastungen = auswahl.belastungen.filter((b) => b !== "nicht-bekannt");
    for (const b of belastungen) {
      if (ref.belastungen.includes(b as Belastung)) {
        score += 2;
        matchingTags.push(b);
      }
    }

    // Zustand
    const zustand = auswahl.zustand.filter((z) => z !== "nicht-bekannt");
    for (const z of zustand) {
      if (ref.zustand.includes(z as Zustand)) {
        score += 1;
        matchingTags.push(z);
      }
    }

    // Sonderbedingungen
    const sonder = auswahl.sonderbedingungen.filter(
      (s) => s !== "nicht-bekannt" && s !== "keine"
    );
    for (const s of sonder) {
      if (ref.sonderbedingungen.includes(s as Sonderbedingung)) {
        score += 2;
        matchingTags.push(s);
      }
    }

    return { referenz: ref, score, matchingTags };
  });

  // Sortieren nach Score (absteigend), nur Treffer mit Score > 0
  const sortiert = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  // Einzigartige Produkte aus den Top-Referenzen extrahieren
  const produktNamen = new Set<string>();
  for (const s of sortiert.slice(0, 10)) {
    for (const p of s.referenz.produkte) {
      produktNamen.add(p);
    }
  }

  const matchedProdukte = produkte.filter((p) => produktNamen.has(p.name));

  return {
    referenzen: sortiert,
    produkte: matchedProdukte,
  };
}
```

- [ ] **Step 2: Build prüfen**

Run: `cd /Users/sfleischmann/KORODUR-Sanierung_app && npm run build 2>&1 | tail -10`

Expected: Build erfolgreich (die Datei wird noch nicht importiert, aber die Typen müssen stimmen).

- [ ] **Step 3: Commit**

```bash
cd /Users/sfleischmann/KORODUR-Sanierung_app
git add data/loesungsfinder.ts
git commit -m "feat: Lösungsfinder-Daten und Scoring-Logik — 5-Schritte-Flow mit Tag-Matching"
```

---

## Task 5: Lösungsfinder — UI-Komponenten

**Files:**
- Create: `components/ChipSelect.tsx`
- Create: `components/ProgressBar.tsx`
- Create: `components/Loesungsfinder.tsx`
- Create: `app/[lang]/loesungsfinder/page.tsx`
- Modify: `app/[lang]/dictionaries/de.json`

- [ ] **Step 1: ChipSelect-Komponente**

Neue Datei `components/ChipSelect.tsx`:

```tsx
"use client";

interface ChipOption {
  id: string;
  label: string;
  beschreibung?: string;
}

interface ChipSelectProps {
  optionen: ChipOption[];
  selected: string[];
  mehrfach: boolean;
  exklusiv?: string[];
  onChange: (selected: string[]) => void;
  grosseCards?: boolean;
}

export default function ChipSelect({
  optionen,
  selected,
  mehrfach,
  exklusiv = [],
  onChange,
  grosseCards = false,
}: ChipSelectProps) {
  function handleClick(id: string) {
    if (!mehrfach) {
      onChange([id]);
      return;
    }

    const isExklusiv = exklusiv.includes(id);

    if (isExklusiv) {
      // Exklusive Option: alle anderen abwählen
      onChange(selected.includes(id) ? [] : [id]);
      return;
    }

    // Normale Option: exklusive Optionen abwählen
    const ohneExklusiv = selected.filter((s) => !exklusiv.includes(s));

    if (ohneExklusiv.includes(id)) {
      onChange(ohneExklusiv.filter((s) => s !== id));
    } else {
      onChange([...ohneExklusiv, id]);
    }
  }

  if (grosseCards) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {optionen.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleClick(opt.id)}
            className={`p-8 rounded-[14px] text-left transition-all cursor-pointer ${
              selected.includes(opt.id)
                ? "bg-[#002d59] text-white shadow-lg"
                : "bg-white text-[#002d59] shadow-md hover:shadow-lg border border-[#d9dada]"
            }`}
          >
            <div className="text-xl font-[800] mb-2">{opt.label}</div>
            {opt.beschreibung && (
              <div className={`text-sm ${selected.includes(opt.id) ? "text-white/72" : "text-[#002d59]/55"}`}>
                {opt.beschreibung}
              </div>
            )}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3 justify-center max-w-2xl mx-auto">
      {optionen.map((opt) => (
        <button
          key={opt.id}
          onClick={() => handleClick(opt.id)}
          className={`px-5 py-3 rounded-md text-[15px] font-[700] transition-all cursor-pointer ${
            selected.includes(opt.id)
              ? "bg-[#009ee3] text-white"
              : "bg-white text-[#002d59] border border-[#d9dada] hover:border-[#009ee3]"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: ProgressBar-Komponente**

Neue Datei `components/ProgressBar.tsx`:

```tsx
"use client";

interface ProgressBarProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export default function ProgressBar({ steps, currentStep, onStepClick }: ProgressBarProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-12">
      {steps.map((label, i) => {
        const isActive = i === currentStep;
        const isDone = i < currentStep;
        const isClickable = isDone && onStepClick;

        return (
          <div key={i} className="flex items-center gap-2">
            <button
              disabled={!isClickable}
              onClick={() => isClickable && onStepClick(i)}
              className={`flex items-center gap-2 ${isClickable ? "cursor-pointer" : "cursor-default"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-[800] transition-colors ${
                  isActive
                    ? "bg-[#009ee3] text-white"
                    : isDone
                    ? "bg-[#002d59] text-white"
                    : "bg-[#e8edf5] text-[#002d59]/55"
                }`}
              >
                {isDone ? "✓" : i + 1}
              </div>
              <span
                className={`hidden sm:inline text-sm font-[600] ${
                  isActive ? "text-[#002d59]" : isDone ? "text-[#002d59]/72" : "text-[#002d59]/40"
                }`}
              >
                {label}
              </span>
            </button>
            {i < steps.length - 1 && (
              <div className={`w-8 h-0.5 ${i < currentStep ? "bg-[#002d59]" : "bg-[#d9dada]"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 3: Lösungsfinder-Hauptkomponente**

Neue Datei `components/Loesungsfinder.tsx`:

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import ChipSelect from "./ChipSelect";
import ProgressBar from "./ProgressBar";
import ReferenceCard from "./ReferenceCard";
import { step1, step2, step3, step4, berechneErgebnisse, type UserSelection } from "@/data/loesungsfinder";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/app/[lang]/dictionaries";

const STEP_LABELS = ["Situation", "Belastung", "Zustand", "Anforderungen", "Ergebnisse"];

interface Props {
  lang: Locale;
  dict: Dictionary;
}

export default function Loesungsfinder({ lang, dict }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [massnahme, setMassnahme] = useState<string[]>([]);
  const [belastungen, setBelastungen] = useState<string[]>([]);
  const [zustand, setZustand] = useState<string[]>([]);
  const [sonderbedingungen, setSonderbedingungen] = useState<string[]>([]);

  const canProceed = [
    massnahme.length > 0,
    belastungen.length > 0,
    zustand.length > 0,
    sonderbedingungen.length > 0,
    true,
  ][currentStep];

  function handleNext() {
    if (currentStep < 4 && canProceed) setCurrentStep(currentStep + 1);
  }

  function handleBack() {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  }

  function handleStep1(sel: string[]) {
    setMassnahme(sel);
    // Einfachauswahl → automatisch weiter
    if (sel.length > 0) setCurrentStep(1);
  }

  const ergebnis = currentStep === 4
    ? berechneErgebnisse({
        massnahme: massnahme[0] ?? "nicht-bekannt",
        belastungen,
        zustand,
        sonderbedingungen,
      })
    : null;

  return (
    <div className="max-w-4xl mx-auto">
      <ProgressBar
        steps={STEP_LABELS}
        currentStep={currentStep}
        onStepClick={(step) => setCurrentStep(step)}
      />

      {/* Schritt 1 */}
      {currentStep === 0 && (
        <div className="text-center">
          <h2 className="text-2xl font-[900] text-[#002d59] mb-8">{step1.frage}</h2>
          <ChipSelect
            optionen={step1.optionen}
            selected={massnahme}
            mehrfach={false}
            onChange={handleStep1}
            grosseCards
          />
        </div>
      )}

      {/* Schritt 2 */}
      {currentStep === 1 && (
        <div className="text-center">
          <h2 className="text-2xl font-[900] text-[#002d59] mb-8">{step2.frage}</h2>
          <ChipSelect
            optionen={step2.optionen}
            selected={belastungen}
            mehrfach
            exklusiv={step2.exklusiv}
            onChange={setBelastungen}
          />
        </div>
      )}

      {/* Schritt 3 */}
      {currentStep === 2 && (
        <div className="text-center">
          <h2 className="text-2xl font-[900] text-[#002d59] mb-8">{step3.frage}</h2>
          <ChipSelect
            optionen={step3.optionen}
            selected={zustand}
            mehrfach
            exklusiv={step3.exklusiv}
            onChange={setZustand}
          />
        </div>
      )}

      {/* Schritt 4 */}
      {currentStep === 3 && (
        <div className="text-center">
          <h2 className="text-2xl font-[900] text-[#002d59] mb-8">{step4.frage}</h2>
          <ChipSelect
            optionen={step4.optionen}
            selected={sonderbedingungen}
            mehrfach
            exklusiv={step4.exklusiv}
            onChange={setSonderbedingungen}
          />
        </div>
      )}

      {/* Navigation Buttons (Schritte 1-3) */}
      {currentStep > 0 && currentStep < 4 && (
        <div className="flex justify-center gap-4 mt-12">
          <button
            onClick={handleBack}
            className="px-6 py-3 rounded-md border-2 border-[#002d59] text-[#002d59] font-[800] hover:bg-[#002d59] hover:text-white"
          >
            Zurück
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed}
            className="px-6 py-3 rounded-md bg-[#009ee3] text-white font-[800] hover:bg-[#0090d0] disabled:opacity-40"
          >
            Weiter
          </button>
        </div>
      )}

      {/* Schritt 5: Ergebnisse */}
      {currentStep === 4 && ergebnis && (
        <div>
          {/* Zusammenfassung */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {massnahme[0] !== "nicht-bekannt" && (
              <span className="px-3 py-1 bg-[#e8edf5] text-[#002d59] rounded-md text-sm font-[600]">
                {step1.optionen.find((o) => o.id === massnahme[0])?.label}
              </span>
            )}
            {belastungen.filter((b) => b !== "nicht-bekannt").map((b) => (
              <span key={b} className="px-3 py-1 bg-[#e8edf5] text-[#002d59] rounded-md text-sm font-[600]">
                {step2.optionen.find((o) => o.id === b)?.label}
              </span>
            ))}
            {zustand.filter((z) => z !== "nicht-bekannt").map((z) => (
              <span key={z} className="px-3 py-1 bg-[#e8edf5] text-[#002d59] rounded-md text-sm font-[600]">
                {step3.optionen.find((o) => o.id === z)?.label}
              </span>
            ))}
            {sonderbedingungen.filter((s) => s !== "nicht-bekannt" && s !== "keine").map((s) => (
              <span key={s} className="px-3 py-1 bg-[#e8edf5] text-[#002d59] rounded-md text-sm font-[600]">
                {step4.optionen.find((o) => o.id === s)?.label}
              </span>
            ))}
          </div>

          {/* Referenzen */}
          {ergebnis.referenzen.length > 0 ? (
            <>
              <h3 className="text-xl font-[800] text-[#002d59] mb-6">
                Passende Referenzprojekte
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {ergebnis.referenzen.slice(0, 6).map(({ referenz, matchingTags }) => (
                  <div key={referenz.id}>
                    <ReferenceCard referenz={referenz} lang={lang} dict={dict} />
                    <div className="flex flex-wrap gap-1 mt-2">
                      {matchingTags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 bg-[#009ee3]/15 text-[#009ee3] rounded text-xs font-[600]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Produkte */}
              <h3 className="text-xl font-[800] text-[#002d59] mb-6">
                Empfohlene Produkte
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                {ergebnis.produkte.map((produkt) => (
                  <Link
                    key={produkt.id}
                    href={`/${lang}/produkte/${produkt.id}/`}
                    className="p-6 bg-white rounded-[14px] shadow-md hover:shadow-lg border border-[#d9dada] transition-shadow"
                  >
                    <div className="font-[800] text-[#002d59] mb-1">{produkt.name}</div>
                    <div className="text-sm text-[#002d59]/72">{produkt.kurzbeschreibung}</div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-[#002d59]/72 mb-6">
                Für Ihr spezielles Szenario beraten unsere Experten Sie persönlich.
              </p>
            </div>
          )}

          {/* CTA */}
          <div className="text-center">
            <a
              href="https://www.korodur.de/kontakt/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#009ee3] hover:bg-[#0090d0] text-white font-[800] px-8 py-4 rounded-md text-lg"
            >
              Beratung anfragen
            </a>
          </div>

          {/* Zurück */}
          <div className="text-center mt-6">
            <button
              onClick={handleBack}
              className="text-[#009ee3] font-[700] hover:underline"
            >
              ← Auswahl ändern
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Lösungsfinder-Seite**

Neue Datei `app/[lang]/loesungsfinder/page.tsx`:

```tsx
import { hasLocale } from "next/experimental";
import { notFound } from "next/navigation";
import { getDictionary } from "@/app/[lang]/dictionaries";
import Loesungsfinder from "@/components/Loesungsfinder";
import type { Locale } from "@/lib/i18n";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lösungsfinder",
  description: "Finden Sie in 5 Schritten die passende Sanierungslösung für Ihren Industrieboden.",
};

export default async function LoesungsfinderPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <section className="py-24 px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-[900] text-[#002d59] text-center mb-4">
          Lösungsfinder
        </h1>
        <p className="text-lg text-[#002d59]/72 text-center mb-16 max-w-2xl mx-auto">
          Beschreiben Sie Ihre Situation, und wir zeigen Ihnen passende Produkte und Referenzprojekte.
        </p>
        <Loesungsfinder lang={lang as Locale} dict={dict} />
      </div>
    </section>
  );
}
```

Hinweis: Prüfe ob `hasLocale` aus `next/experimental` oder woanders importiert wird — siehe bestehende Seiten für den korrekten Import-Pfad.

- [ ] **Step 5: Dev-Server prüfen**

Im Browser `http://localhost:3000/de/loesungsfinder/` öffnen.

Prüfen:
- Fortschrittsanzeige mit 5 Schritten
- Schritt 1: Zwei große Cards, Klick → automatisch Schritt 2
- Schritt 2: Chips, Mehrfachauswahl, "Nicht bekannt" deaktiviert andere
- Schritt 3: Chips, Mehrfachauswahl
- Schritt 4: Chips, "Keine besonderen Anforderungen" und "Nicht bekannt" exklusiv
- Schritt 5: Zusammenfassung-Tags, Referenz-Cards mit Matching-Tags, Produkt-Cards
- Zurück-Navigation funktioniert
- Fortschrittsanzeige: Klick auf erledigte Schritte springt zurück
- Responsive auf Mobile

- [ ] **Step 6: Commit**

```bash
cd /Users/sfleischmann/KORODUR-Sanierung_app
git add components/ChipSelect.tsx components/ProgressBar.tsx components/Loesungsfinder.tsx app/[lang]/loesungsfinder/page.tsx
git commit -m "feat: Lösungsfinder UI — 5-Schritte-Flow mit ChipSelect, ProgressBar und Ergebnisanzeige"
```

---

## Task 6: Produktmatrix

**Files:**
- Create: `components/Produktmatrix.tsx`
- Create: `app/[lang]/produktmatrix/page.tsx`

- [ ] **Step 1: Produktmatrix-Komponente**

Neue Datei `components/Produktmatrix.tsx`:

```tsx
"use client";

import Link from "next/link";
import { produkte } from "@/data/produkte";
import type { Locale } from "@/lib/i18n";

const SPALTEN = [
  { id: "kleine-reparatur", label: "Kleine Reparatur", gruppe: "Situation" },
  { id: "grossflaechige-sanierung", label: "Großflächige Sanierung", gruppe: "Situation" },
  { id: "schwerlast", label: "Schwerlast", gruppe: "Belastung" },
  { id: "leichte-nutzung", label: "Leichte Nutzung", gruppe: "Belastung" },
  { id: "rollende-lasten", label: "Rollende Lasten", gruppe: "Belastung" },
  { id: "punktlasten", label: "Punktlasten", gruppe: "Belastung" },
  { id: "chemikalien", label: "Chemikalien", gruppe: "Sonder" },
  { id: "tausalz", label: "Tausalz", gruppe: "Sonder" },
  { id: "rutschhemmung", label: "Rutschhemmung", gruppe: "Sonder" },
  { id: "kurze-sperrzeit", label: "Kurze Sperrzeit", gruppe: "Sonder" },
  { id: "aussenbereich", label: "Außenbereich", gruppe: "Sonder" },
] as const;

interface Props {
  lang: Locale;
}

export default function Produktmatrix({ lang }: Props) {
  // Nur Produkte mit Eignungen anzeigen
  const relevante = produkte.filter((p) => p.eignungen && p.eignungen.length > 0);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="sticky left-0 bg-white z-10 text-left p-3 font-[800] text-[#002d59] border-b-2 border-[#002d59] min-w-[200px]">
              Produkt
            </th>
            {SPALTEN.map((col) => (
              <th
                key={col.id}
                className="p-2 border-b-2 border-[#002d59] min-w-[60px]"
              >
                <span
                  className="block text-xs font-[700] text-[#002d59] whitespace-nowrap"
                  style={{
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                    height: "100px",
                  }}
                >
                  {col.label}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {relevante.map((produkt, i) => (
            <tr
              key={produkt.id}
              className={i % 2 === 0 ? "bg-white" : "bg-[#f5f5f6]/45"}
            >
              <td className="sticky left-0 bg-inherit z-10 p-3 border-b border-[#d9dada]">
                <Link
                  href={`/${lang}/produkte/${produkt.id}/`}
                  className="font-[700] text-[#009ee3] hover:underline"
                >
                  {produkt.name}
                </Link>
              </td>
              {SPALTEN.map((col) => {
                const hatEignung = produkt.eignungen?.includes(col.id as never);
                return (
                  <td
                    key={col.id}
                    className="p-2 text-center border-b border-[#d9dada]"
                  >
                    {hatEignung && (
                      <span className="inline-block w-4 h-4 bg-[#009ee3] rounded-full" />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 2: Produktmatrix-Seite**

Neue Datei `app/[lang]/produktmatrix/page.tsx`:

```tsx
import { hasLocale } from "next/experimental";
import { notFound } from "next/navigation";
import { getDictionary } from "@/app/[lang]/dictionaries";
import Produktmatrix from "@/components/Produktmatrix";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Produktmatrix",
  description: "Übersicht aller KORODUR Sanierungsprodukte und ihre Einsatzbereiche auf einen Blick.",
};

export default async function ProduktmatrixPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <section className="py-24 px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-[900] text-[#002d59] mb-4">
          Produktmatrix
        </h1>
        <p className="text-lg text-[#002d59]/72 mb-12 max-w-3xl">
          Welches Produkt passt zu Ihrer Situation? Diese Übersicht zeigt auf einen Blick, welche KORODUR-Produkte für welche Anforderungen geeignet sind.
        </p>

        <Produktmatrix lang={lang as Locale} />

        <div className="mt-16 text-center p-8 bg-[#f5f5f6] rounded-[14px]">
          <p className="text-lg text-[#002d59] font-[700] mb-4">
            Unsicher? Der Lösungsfinder führt Sie in 5 Schritten zur passenden Lösung.
          </p>
          <Link
            href={`/${lang}/loesungsfinder/`}
            className="inline-block bg-[#009ee3] hover:bg-[#0090d0] text-white font-[800] px-8 py-4 rounded-md text-lg"
          >
            Lösungsfinder starten
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Produkte mit Eignungen versehen**

In `data/produkte.ts` jedem relevanten Produkt das `eignungen`-Array hinzufügen. Ableitung aus den bestehenden `besonderheiten` und `technischeDaten`:

Beispiel NEODUR HE 60 rapid:

```typescript
eignungen: ["grossflaechige-sanierung", "schwerlast", "rollende-lasten", "chemikalien", "kurze-sperrzeit"],
```

Beispiel NEODUR HE 65 Plus:

```typescript
eignungen: ["grossflaechige-sanierung", "schwerlast", "tausalz", "aussenbereich"],
```

Für jedes der 19 Produkte die passenden Eignungen aus den bestehenden technischen Daten und Besonderheiten ableiten.

- [ ] **Step 4: Dev-Server prüfen**

Im Browser `http://localhost:3000/de/produktmatrix/` öffnen.

Prüfen:
- Tabelle mit Produkten als Zeilen, Kriterien als vertikale Spaltenheader
- Cyan-Punkte für Eignungen
- Produktnamen klickbar → Produktdetailseite
- Horizontal scrollbar auf Mobile
- Sticky Produktname-Spalte beim Scrollen
- Lösungsfinder-CTA am Ende

- [ ] **Step 5: Commit**

```bash
cd /Users/sfleischmann/KORODUR-Sanierung_app
git add components/Produktmatrix.tsx app/[lang]/produktmatrix/page.tsx data/produkte.ts
git commit -m "feat: Produktmatrix — Übersichtstabelle Produkt × Anwendung mit Eignungen"
```

---

## Task 7: Referenz-Übersicht erweiterte Filter

**Files:**
- Modify: `app/[lang]/referenzen/page.tsx`
- Modify: `app/[lang]/dictionaries/de.json`

- [ ] **Step 1: Neue UI-Strings für Referenzfilter**

In `de.json` die `referenzen`-Sektion erweitern:

```json
{
  "referenzen": {
    "title": "Referenzen",
    "filter_anwendungsbereich": "Anwendungsbereich",
    "filter_massnahme": "Maßnahme",
    "filter_produkt": "Produkt",
    "filter_reset": "Filter zurücksetzen",
    "ergebnis_count": "Referenzen gefunden",
    "keine_ergebnisse": "Keine Referenzen gefunden. Versuchen Sie andere Filter.",
    "alle": "Alle"
  }
}
```

- [ ] **Step 2: Referenz-Übersicht mit neuen Filtern**

Die bestehende `app/[lang]/referenzen/page.tsx` anpassen. Die bisherige Filterung nach Kategorie/Unterkategorie wird ersetzt durch:

- Anwendungsbereich-Filter (Dropdown oder Chips)
- Maßnahme-Filter (Kleine Reparatur / Großflächige Sanierung)
- Produkt-Filter (Dropdown mit allen verwendeten Produktnamen)

Da die Filterung client-seitig passiert, braucht es eine Client-Komponente. Entweder die bestehende `CategoryFilterView.tsx` umbauen oder eine neue `ReferenzFilter.tsx` erstellen.

Die Filterwerte werden aus den Referenzdaten dynamisch extrahiert:

```typescript
// Einzigartige Anwendungsbereiche
const anwendungsbereiche = [...new Set(referenzen.map((r) => r.anwendungsbereich))];
// Einzigartige Produktnamen
const produktNamen = [...new Set(referenzen.flatMap((r) => r.produkte))];
```

Filter-Logik: Alle Filter sind UND-verknüpft. Leerer Filter = alles anzeigen. Ergebniszähler: "{n} Referenzen gefunden".

- [ ] **Step 3: Dev-Server prüfen**

Im Browser `http://localhost:3000/de/referenzen/` öffnen.

Prüfen:
- 3 Filter sichtbar: Anwendungsbereich, Maßnahme, Produkt
- Filter kombinierbar
- Ergebniszähler aktualisiert sich
- "Filter zurücksetzen" funktioniert
- Responsive auf Mobile

- [ ] **Step 4: Commit**

```bash
cd /Users/sfleischmann/KORODUR-Sanierung_app
git add app/[lang]/referenzen/page.tsx app/[lang]/dictionaries/de.json
git commit -m "feat: Referenz-Übersicht — erweiterte Filter (Anwendungsbereich, Maßnahme, Produkt)"
```

---

## Task 8: Referenz-Detailseite + PDF-Download

**Files:**
- Create: `lib/pdf.ts`
- Create: `components/ReferenzPdf.tsx`
- Modify: `app/[lang]/referenzen/[slug]/page.tsx`
- Modify: `package.json` (jspdf hinzufügen)

- [ ] **Step 1: jsPDF installieren**

Run: `cd /Users/sfleischmann/KORODUR-Sanierung_app && npm install jspdf`

- [ ] **Step 2: PDF-Generierungs-Helper**

Neue Datei `lib/pdf.ts`:

```typescript
import { jsPDF } from "jspdf";
import type { Referenz } from "@/data/types";
import type { Produkt } from "@/data/produkte";

export async function generateReferenzPdf(
  referenz: Referenz,
  produkt: Produkt | undefined,
  bildUrl: string
): Promise<void> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const navy = "#002d59";
  const cyan = "#009ee3";
  const pageWidth = 210;
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let y = margin;

  // Header
  doc.setFontSize(10);
  doc.setTextColor(navy);
  doc.text("KORODUR Sanierung — Referenzblatt", margin, y);
  y += 12;

  // Titel
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(referenz.titel, margin, y);
  y += 8;

  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(cyan);
  doc.text(referenz.untertitel, margin, y);
  y += 12;

  // Meta
  doc.setFontSize(10);
  doc.setTextColor(navy);
  doc.text(`Ort: ${referenz.ort}, ${referenz.land}`, margin, y);
  if (referenz.flaeche) {
    doc.text(`Fläche: ${referenz.flaeche}`, margin + contentWidth / 2, y);
  }
  y += 10;

  // Bild laden und einfügen (wenn möglich)
  try {
    const img = await loadImage(bildUrl);
    const imgHeight = (contentWidth * img.height) / img.width;
    const maxImgHeight = 80;
    const finalHeight = Math.min(imgHeight, maxImgHeight);
    doc.addImage(img, "JPEG", margin, y, contentWidth, finalHeight);
    y += finalHeight + 10;
  } catch {
    y += 5;
  }

  // Herausforderung
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Herausforderung", margin, y);
  y += 6;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  for (const h of referenz.herausforderungen) {
    const lines = doc.splitTextToSize(`• ${h}`, contentWidth);
    doc.text(lines, margin, y);
    y += lines.length * 5;
  }
  y += 5;

  // Lösung
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Lösung", margin, y);
  y += 6;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const loesungLines = doc.splitTextToSize(referenz.loesung, contentWidth);
  doc.text(loesungLines, margin, y);
  y += loesungLines.length * 5 + 5;

  // Vorteile
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Vorteile", margin, y);
  y += 6;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  for (const v of referenz.vorteile) {
    const lines = doc.splitTextToSize(`✓ ${v}`, contentWidth);
    doc.text(lines, margin, y);
    y += lines.length * 5;
  }
  y += 5;

  // Eingesetztes Produkt
  if (produkt) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Eingesetztes Produkt: ${produkt.name}`, margin, y);
    y += 6;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(produkt.kurzbeschreibung, margin, y);
    y += 7;

    // Verarbeitungshinweise / Besonderheiten
    if (produkt.verarbeitung?.besonderheiten) {
      doc.text(`Besonderheiten: ${produkt.verarbeitung.besonderheiten}`, margin, y);
      y += 7;
    }
    if (produkt.besonderheiten.length > 0) {
      for (const b of produkt.besonderheiten) {
        doc.text(`• ${b}`, margin, y);
        y += 5;
      }
    }
    y += 5;
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor("#666666");
  doc.text("KORODUR — korodur.de — Kontakt: korodur.de/kontakt", margin, 280);

  doc.save(`KORODUR-Referenz-${referenz.slug}.pdf`);
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}
```

- [ ] **Step 3: PDF-Download-Button-Komponente**

Neue Datei `components/ReferenzPdf.tsx`:

```tsx
"use client";

import { useState } from "react";
import type { Referenz } from "@/data/types";
import type { Produkt } from "@/data/produkte";
import { withBasePath } from "@/lib/basePath";

interface Props {
  referenz: Referenz;
  produkt: Produkt | undefined;
}

export default function ReferenzPdf({ referenz, produkt }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const { generateReferenzPdf } = await import("@/lib/pdf");
      await generateReferenzPdf(referenz, produkt, withBasePath(referenz.bild));
    } catch (err) {
      console.error("PDF-Generierung fehlgeschlagen:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="inline-flex items-center gap-2 px-5 py-3 border-2 border-[#002d59] text-[#002d59] font-[800] rounded-md hover:bg-[#002d59] hover:text-white disabled:opacity-50 transition-colors"
    >
      {loading ? "Wird erstellt…" : "Referenzblatt herunterladen"}
    </button>
  );
}
```

Hinweis: jsPDF wird per dynamic import geladen, damit es nicht ins initiale Bundle kommt.

- [ ] **Step 4: Referenz-Detailseite erweitern**

In `app/[lang]/referenzen/[slug]/page.tsx` folgende Ergänzungen:

1. **Produkt-Badge:** Prominente Anzeige der eingesetzten Produkte als klickbare Badges (verlinkt auf `/de/produkte/[id]/`)

2. **PDF-Download:** Die `ReferenzPdf`-Komponente einbinden:

```tsx
import ReferenzPdf from "@/components/ReferenzPdf";
import { produkte } from "@/data/produkte";

// Im Page-Body:
const erstesProdukt = produkte.find((p) => referenz.produkte.includes(p.name));

<ReferenzPdf referenz={referenz} produkt={erstesProdukt} />
```

3. **CTA:** Am Ende der Seite:

```tsx
<div className="mt-12 p-8 bg-[#002d59] rounded-[14px] text-center">
  <p className="text-lg text-white font-[700] mb-4">
    Ähnliches Projekt? Kontaktieren Sie unsere Berater.
  </p>
  <a
    href="https://www.korodur.de/kontakt/"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block border-2 border-white text-white hover:bg-white hover:text-[#002d59] font-[800] px-6 py-3 rounded-md"
  >
    Berater kontaktieren
  </a>
</div>
```

- [ ] **Step 5: Dev-Server prüfen**

Im Browser eine Referenz-Detailseite öffnen, z.B. `http://localhost:3000/de/referenzen/kleemann-produktionshalle/`.

Prüfen:
- Produkt-Badge sichtbar und klickbar
- "Referenzblatt herunterladen"-Button vorhanden
- Klick → PDF wird generiert und heruntergeladen
- PDF enthält: Titel, Ort, Bild, Herausforderung, Lösung, Vorteile, Produkt, Besonderheiten
- CTA-Bereich am Ende der Seite

- [ ] **Step 6: Commit**

```bash
cd /Users/sfleischmann/KORODUR-Sanierung_app
git add lib/pdf.ts components/ReferenzPdf.tsx app/[lang]/referenzen/[slug]/page.tsx package.json package-lock.json
git commit -m "feat: Referenz-PDF-Download — client-seitige Generierung mit jsPDF"
```

---

## Task 9: Produktdetailseiten erweitern

**Files:**
- Modify: `app/[lang]/produkte/[id]/page.tsx`
- Modify: `data/produkte.ts`
- Modify: `app/[lang]/dictionaries/de.json`

- [ ] **Step 1: Verarbeitungsdaten für Produkte eintragen**

In `data/produkte.ts` die Verarbeitungshinweise für die relevanten Produkte ergänzen. Daten aus der Notion-Datenbank "Kern Produktdaten" und den TDS entnehmen.

Beispiel für NEODUR HE 60 rapid:

```typescript
verarbeitung: {
  untergrundvorbereitung: "Tragfähiger, sauberer, rauer Betonuntergrund. Kugelstrahlen oder Fräsen empfohlen. Grundierung mit KORODUR HB 5 rapid.",
  mischverhaeltnis: "25 kg Pulver auf ca. 3,0–3,25 l Wasser. Mischzeit: 3 Minuten mit Zwangsmischer.",
  schichtaufbau: "Einschichtig 10–60 mm auf Haftbrücke KORODUR HB 5 rapid.",
  verarbeitungszeit: "Ca. 20–30 Minuten bei 20 °C.",
  aushaertezeit: "Begehbar nach ca. 4–6 h. Voll belastbar nach ca. 24 h.",
  besonderheiten: "Verarbeitungstemperatur: +5 °C bis +30 °C. Nicht auf gefrorenem Untergrund verarbeiten. Nachbehandlung mit KORODUR Curing empfohlen.",
},
tdsUrl: "https://www.korodur.de/downloads/tds-neodur-he-60-rapid.pdf",
```

Für alle Produkte die Verarbeitungsdaten soweit verfügbar eintragen. Felder können leer bleiben (`""`), wenn Daten noch nicht vorliegen.

- [ ] **Step 2: UI-Strings**

In `de.json`:

```json
{
  "produkte": {
    "verarbeitung_title": "Verarbeitung",
    "untergrundvorbereitung": "Untergrundvorbereitung",
    "mischverhaeltnis": "Mischverhältnis",
    "schichtaufbau": "Schichtaufbau",
    "verarbeitungszeit": "Verarbeitungszeit",
    "aushaertezeit": "Aushärtezeit",
    "besonderheiten_verarbeitung": "Besonderheiten",
    "tds_download": "Technisches Datenblatt herunterladen",
    "referenzen_title": "Dieses Produkt im Einsatz",
    "referenzen_alle": "Alle Referenzen mit diesem Produkt",
    "cta_verarbeitung": "Fragen zur Verarbeitung? Unsere technischen Berater helfen weiter."
  }
}
```

- [ ] **Step 3: Produktdetailseite erweitern**

In `app/[lang]/produkte/[id]/page.tsx` zwei neue Sections nach den bestehenden technischen Daten:

**Section Verarbeitung:**

```tsx
{produkt.verarbeitung && (
  <section className="mt-12">
    <h2 className="text-2xl font-[900] text-[#002d59] mb-6">
      {dict.produkte.verarbeitung_title}
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        { label: dict.produkte.untergrundvorbereitung, value: produkt.verarbeitung.untergrundvorbereitung },
        { label: dict.produkte.mischverhaeltnis, value: produkt.verarbeitung.mischverhaeltnis },
        { label: dict.produkte.schichtaufbau, value: produkt.verarbeitung.schichtaufbau },
        { label: dict.produkte.verarbeitungszeit, value: produkt.verarbeitung.verarbeitungszeit },
        { label: dict.produkte.aushaertezeit, value: produkt.verarbeitung.aushaertezeit },
        { label: dict.produkte.besonderheiten_verarbeitung, value: produkt.verarbeitung.besonderheiten },
      ]
        .filter(({ value }) => value)
        .map(({ label, value }) => (
          <div key={label} className="p-5 bg-[#f5f5f6] rounded-[14px]">
            <div className="text-sm font-[700] text-[#002d59]/72 mb-1">{label}</div>
            <div className="text-[#002d59]">{value}</div>
          </div>
        ))}
    </div>
    {produkt.tdsUrl && (
      <a
        href={produkt.tdsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 mt-6 text-[#009ee3] font-[700] hover:underline"
      >
        {dict.produkte.tds_download} →
      </a>
    )}
  </section>
)}
```

**Section zugehörige Referenzen:**

```tsx
import { referenzen } from "@/data/referenzen";
import ReferenceCard from "@/components/ReferenceCard";

const zugehoerige = referenzen
  .filter((r) => r.produkte.includes(produkt.name))
  .slice(0, 3);

{zugehoerige.length > 0 && (
  <section className="mt-12">
    <h2 className="text-2xl font-[900] text-[#002d59] mb-6">
      {dict.produkte.referenzen_title}
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {zugehoerige.map((ref) => (
        <ReferenceCard key={ref.id} referenz={ref} lang={lang} dict={dict} />
      ))}
    </div>
    <Link
      href={`/${lang}/referenzen/?produkt=${encodeURIComponent(produkt.name)}`}
      className="inline-block mt-4 text-[#009ee3] font-[700] hover:underline"
    >
      {dict.produkte.referenzen_alle} →
    </Link>
  </section>
)}
```

**CTA:**

```tsx
<div className="mt-12 p-8 bg-[#002d59] rounded-[14px] text-center">
  <p className="text-lg text-white font-[700] mb-4">
    {dict.produkte.cta_verarbeitung}
  </p>
  <a
    href="https://www.korodur.de/kontakt/"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block border-2 border-white text-white hover:bg-white hover:text-[#002d59] font-[800] px-6 py-3 rounded-md"
  >
    Berater kontaktieren
  </a>
</div>
```

- [ ] **Step 4: Dev-Server prüfen**

Im Browser `http://localhost:3000/de/produkte/neodur-he-60-rapid/` öffnen.

Prüfen:
- Bestehende Produktinfos unverändert
- Neue Section "Verarbeitung" mit 6 Info-Cards
- TDS-Download-Link
- Section "Dieses Produkt im Einsatz" mit Referenz-Cards
- CTA-Bereich

- [ ] **Step 5: Commit**

```bash
cd /Users/sfleischmann/KORODUR-Sanierung_app
git add app/[lang]/produkte/[id]/page.tsx data/produkte.ts app/[lang]/dictionaries/de.json
git commit -m "feat: Produktdetailseiten — Verarbeitungshinweise, zugehörige Referenzen, TDS-Link"
```

---

## Task 10: Alte Routen entfernen + Redirects

**Files:**
- Modify: `app/[lang]/portfolio/page.tsx`
- Modify: `app/[lang]/portfolio/[kategorie]/page.tsx`
- Modify: `app/[lang]/sanierung-finden/page.tsx`
- Delete: `data/sanierung-finden.ts` (nach Redirect-Einrichtung)

- [ ] **Step 1: Portfolio-Seiten durch Redirect ersetzen**

`app/[lang]/portfolio/page.tsx` ersetzen mit Client-Redirect:

```tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

export default function PortfolioRedirect() {
  const router = useRouter();
  const { lang } = useParams();
  useEffect(() => {
    router.replace(`/${lang}/referenzen/`);
  }, [router, lang]);
  return null;
}
```

`app/[lang]/portfolio/[kategorie]/page.tsx` analog:

```tsx
"use client";
import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function KategorieRedirect() {
  const router = useRouter();
  const { lang } = useParams();
  useEffect(() => {
    router.replace(`/${lang}/referenzen/`);
  }, [router, lang]);
  return null;
}
```

- [ ] **Step 2: Sanierung-finden durch Redirect ersetzen**

`app/[lang]/sanierung-finden/page.tsx` ersetzen:

```tsx
"use client";
import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function SanierungFindenRedirect() {
  const router = useRouter();
  const { lang } = useParams();
  useEffect(() => {
    router.replace(`/${lang}/loesungsfinder/`);
  }, [router, lang]);
  return null;
}
```

- [ ] **Step 3: Alte sanierung-finden.ts entfernen**

Run: `rm /Users/sfleischmann/KORODUR-Sanierung_app/data/sanierung-finden.ts`

Prüfen, dass keine anderen Dateien noch darauf importieren:

Run: `cd /Users/sfleischmann/KORODUR-Sanierung_app && grep -r "sanierung-finden" --include="*.ts" --include="*.tsx" .`

Falls Imports gefunden werden → entfernen.

- [ ] **Step 4: Build prüfen**

Run: `cd /Users/sfleischmann/KORODUR-Sanierung_app && npm run build 2>&1 | tail -20`

Expected: Build erfolgreich, keine Referenzen auf gelöschte Dateien.

- [ ] **Step 5: Commit**

```bash
cd /Users/sfleischmann/KORODUR-Sanierung_app
git add -A
git commit -m "refactor: Portfolio-Seiten und alter Produktfinder durch Redirects ersetzt, sanierung-finden.ts entfernt"
```

---

## Task 11: Volltextsuche aktualisieren

**Files:**
- Modify: `components/SearchOverlay.tsx`

- [ ] **Step 1: Suche an neue Routen anpassen**

In `components/SearchOverlay.tsx` prüfen, ob die Suchlogik auf die alten Routen (Portfolio, Sanierung-finden) verweist. Falls ja:

- Referenzen-Links auf `/de/referenzen/[slug]/` aktualisieren (sollte bereits so sein)
- Portfolio-Links entfernen oder auf Referenzen umleiten
- Neue Seiten (Lösungsfinder, Produktmatrix) ggf. als Suchtreffer hinzufügen

- [ ] **Step 2: Build prüfen**

Run: `cd /Users/sfleischmann/KORODUR-Sanierung_app && npm run build 2>&1 | tail -10`

- [ ] **Step 3: Commit**

```bash
cd /Users/sfleischmann/KORODUR-Sanierung_app
git add components/SearchOverlay.tsx
git commit -m "fix: Volltextsuche an neue Routen angepasst"
```

---

## Task 12: Abschluss — Build, Test, Deploy

**Files:** keine neuen

- [ ] **Step 1: Vollständiger Build**

Run: `cd /Users/sfleischmann/KORODUR-Sanierung_app && npm run build`

Expected: Build erfolgreich, ~200 statische Seiten generiert.

- [ ] **Step 2: Manueller Smoke-Test**

Dev-Server starten und alle Hauptseiten prüfen:

1. **Startseite** (`/de/`): Hero, Featured Referenzen, Lösungsfinder-Teaser, Außenflächen, CTA
2. **Lösungsfinder** (`/de/loesungsfinder/`): Alle 5 Schritte durchspielen, Ergebnisse prüfen
3. **Referenzen** (`/de/referenzen/`): Filter testen, Cards klickbar
4. **Referenz-Detail** (`/de/referenzen/kleemann-produktionshalle/`): PDF-Download, Produkt-Badge, CTA
5. **Produktmatrix** (`/de/produktmatrix/`): Tabelle korrekt, Links funktionieren
6. **Produkte** (`/de/produkte/neodur-he-60-rapid/`): Verarbeitungshinweise, zugehörige Referenzen
7. **Redirects**: `/de/portfolio/` → `/de/referenzen/`, `/de/sanierung-finden/` → `/de/loesungsfinder/`
8. **Navigation**: Alle 5 Links funktionieren, aktive Hervorhebung
9. **Mobile**: Responsive auf allen Seiten, Drawer-Navigation
10. **Suche**: Cmd+K öffnet Suche, Treffer verlinken korrekt

- [ ] **Step 3: Commit & Push**

```bash
cd /Users/sfleischmann/KORODUR-Sanierung_app
git push origin main
```

GitHub Actions deployen automatisch auf GitHub Pages.
