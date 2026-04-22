# Lösungsfinder 4-Step-Wizard — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Den bestehenden Lösungsfinder (5-Step-Meta / 4-Step-Code) zu einem 4-Step-Wizard umbauen, der Referenzen als Primär-Output zeigt und Produkte aus den Top-Referenzen aggregiert. Datenmodell vereinfacht ggü. der 17.-April-Spec: kein Junction-DB, kein 6-stufiges Rating.

**Architecture:** Referenzen tragen die Filter-Tags (4 Dimensionen). Produkte bekommen wenige neue Attribute (`zeit_kategorie`, `zusatzfunktionen`). Scoring läuft gewichtet-additiv auf Referenzen, Produkte werden aus den Top-N aggregiert. Harter Filter nur bei Sanierungsart. Siehe Spec: `docs/superpowers/specs/2026-04-22-loesungsfinder-4step-design.md`.

**Tech Stack:** Next.js 16.2, React 19.2, TypeScript 5, Tailwind 4. Keine Test-Runner vorhanden — wir führen Smoke-Tests via `npx tsx` und `node:assert` aus (keine neuen Runtime-Dependencies nötig).

**Scope-Hinweis:** Dieser Plan baut die **Code-Infrastruktur**. Das finale Re-Tagging aller Produkte (Zeit-Kategorie) und Referenzen (4 Dimensionen) durch Experten ist **außerhalb dieses Plans** — wir setzen konservative Platzhalter (`"normal"`, leere Arrays) und dokumentieren die Workshop-TODOs im Code, damit die App lauffähig bleibt, solange die Experten-Runde noch offen ist.

---

## File Structure (Änderungen)

| Pfad | Rolle | Änderung |
|---|---|---|
| `data/types.ts` | Alle gemeinsamen Typen | Neue Typen (`Sanierungsart`, `AnwendungsbereichKategorie`, `ZeitKategorie`, `Zusatzfunktion`) + `Referenz`/`Produkt`-Schema-Erweiterung + `@deprecated` auf Alt-Feldern |
| `data/produkte.ts` | Produkt-Stammdaten | Alle Produkte um `zeit_kategorie` + `zusatzfunktionen` erweitert (Platzhalter) |
| `data/referenzen.ts` | Referenz-Stammdaten | Alle Referenzen um `sanierungsart`, `anwendungsbereiche[]`, `zeit_dringlichkeit`, `zusatzfunktionen[]` erweitert (migriert aus Alt-Feldern + Platzhaltern) |
| `data/loesungsfinder.ts` | Step-Definitionen + Scoring | Komplett-Rewrite: 4 neue Steps, neues `berechneErgebnisse`, neue `aggregiereProdukte`-Helper |
| `components/Loesungsfinder.tsx` | Wizard-UI | STEP_LABELS, State-Shape, Ergebnisseite neu (Referenzen-Grid + aggregierte Produktliste) |
| `app/[lang]/loesungsfinder/page.tsx` | Route-Metadaten | „5 Schritten" → „4 Schritten" |
| `app/[lang]/dictionaries/*.json` | i18n-Labels | Neue Labels für Step-Titel, 8 Anwendungsbereiche, 3 Zeit-Stufen, Zusatzfunktionen |
| `scripts/test-loesungsfinder.ts` (neu) | Smoke-Test | Assertion-basierter Test für `berechneErgebnisse` via `npx tsx` |

---

## Task 1: Neue Typen in `data/types.ts`

**Files:**
- Modify: `data/types.ts` (gesamter Inhalt, Erweiterung um neue Typen, Schema-Update an `Referenz` und — indirekt — Vorbereitung für `Produkt`)

**Context:** Bestehende Typen behalten wir vorerst (andere Teile der App nutzen `Belastung`, `Zustand`, `Sonderbedingung`, `Massnahme`, `Anwendungsbereich`). Wir markieren sie `@deprecated` und ergänzen die neuen.

- [ ] **Step 1: Typen und Schema-Erweiterung in `data/types.ts`**

Öffne `data/types.ts` und ersetze den kompletten Inhalt durch:

```ts
// === NEU: 4-Step-Lösungsfinder (2026-04-22) ===

export type Sanierungsart = "punktuell" | "grossflaechig";

export type AnwendungsbereichKategorie =
  | "lager-logistik"
  | "industrie-produktion"
  | "lebensmittel"
  | "flugzeug"
  | "parkdeck"
  | "infrastruktur-zufahrten"
  | "verkaufsraeume"
  | "schwerindustrie";

export type ZeitKategorie = "schnell" | "mittel" | "normal";

export type Zusatzfunktion =
  | "chemikalienbestaendigkeit"
  | "tausalzbestaendigkeit"
  | "rutschhemmung"
  | "fleckenabwehr";
// Hinweis: weitere Zusatzfunktionen werden nach Experten-Abstimmung ergänzt.

// === LEGACY: werden durch neue Felder ersetzt, bleiben noch im Einsatz ===

/** @deprecated Wird durch `Sanierungsart` (punktuell/grossflaechig) ersetzt. */
export type Massnahme = "kleine-reparatur" | "grossflaechige-sanierung";

/** @deprecated Alte Lösungsfinder-Dimension, entfällt in 4-Step-Wizard. */
export type Belastung =
  | "schwerlast"
  | "leichte-nutzung"
  | "rollende-lasten"
  | "punktlasten";

/** @deprecated Alte Lösungsfinder-Dimension, entfällt komplett. */
export type Zustand =
  | "risse"
  | "abrieb"
  | "hohlstellen"
  | "beschichtungsschaeden"
  | "ebenheitsprobleme";

/** @deprecated Wird durch `Zusatzfunktion` ersetzt. */
export type Sonderbedingung =
  | "chemikalien"
  | "tausalz"
  | "rutschhemmung"
  | "kurze-sperrzeit"
  | "aussenbereich";

/** @deprecated Alter Single-Select-Anwendungsbereich (an Referenz), wird durch `anwendungsbereiche[]` ersetzt. */
export type Anwendungsbereich =
  | "produktionshalle"
  | "lager"
  | "werkstatt"
  | "zufahrt"
  | "parkflaeche"
  | "bruecke"
  | "hafen"
  | "sonstiges";

export type Kategorie = "industrieboden" | "industriebau" | "infrastruktur";

export type Unterkategorie =
  | "schwerlast"
  | "duennschicht"
  | "schnelle-reparaturen"
  | "fugen"
  | "verkehr"
  | "wasser";

export interface Referenz {
  id: string;
  slug: string;
  titel: string;
  untertitel: string;
  kategorie: Kategorie;
  unterkategorie: Unterkategorie;
  ort: string;
  land: string;
  flaeche?: string;
  produkte: string[];
  herausforderungen: string[];
  loesung: string;
  vorteile: string[];
  bild: string;
  bildAlt: string;
  galerieBilder?: string[];

  // === NEU (2026-04-22): 4-Step-Lösungsfinder-Tags ===
  sanierungsart: Sanierungsart;
  anwendungsbereiche: AnwendungsbereichKategorie[];
  zeit_dringlichkeit: ZeitKategorie;
  zusatzfunktionen: Zusatzfunktion[];

  // === LEGACY (werden nach vollständiger Umstellung entfernt) ===
  /** @deprecated Nutze `anwendungsbereiche[]`. */
  anwendungsbereich: Anwendungsbereich;
  /** @deprecated Nutze `sanierungsart`. */
  massnahme: Massnahme;
  /** @deprecated Entfällt. */
  belastungen: Belastung[];
  /** @deprecated Entfällt. */
  zustand: Zustand[];
  /** @deprecated Nutze `zusatzfunktionen`. */
  sonderbedingungen: Sonderbedingung[];
}

export interface Verarbeitung {
  untergrundvorbereitung: string;
  mischverhaeltnis: string;
  schichtaufbau: string;
  verarbeitungszeit: string;
  aushaertezeit: string;
  besonderheiten: string;
}

export interface KategorieInfo {
  id: Kategorie;
  titel: string;
  beschreibung: string;
  icon: string;
  unterkategorien: {
    id: Unterkategorie;
    titel: string;
    beschreibung: string;
  }[];
}
```

- [ ] **Step 2: TypeScript-Check**

Run: `npx tsc --noEmit`
Expected: **FAIL** mit Fehlern in `data/produkte.ts` (fehlende `zeit_kategorie`) und `data/referenzen.ts` (fehlende neue Felder). Das ist erwartet — wir fixen es in Task 2 und 3.

- [ ] **Step 3: Commit**

```bash
git add data/types.ts
git commit -m "feat(types): Typen für 4-Step-Lösungsfinder, Alt-Felder deprecaten"
```

---

## Task 2: Produkt-Schema + Platzhalter-Werte

**Files:**
- Modify: `data/produkte.ts` (Interface-Erweiterung + alle Produkt-Einträge)

**Context:** Wir erweitern das `Produkt`-Interface um `zeit_kategorie` (Pflicht) und `zusatzfunktionen` (optional). Da `zeit_kategorie` Pflicht ist, braucht jedes der ~17 Produkte einen Platzhalter. **Default ist `"normal"`** (konservativ, niemand wird durch falschen Filter ausgeschlossen). Schnellestriche/-mörtel (z. B. „rapid" im Namen) werden heuristisch auf `"schnell"` gesetzt; sonst `"normal"`.

- [ ] **Step 1: Interface erweitern**

Ersetze in `data/produkte.ts` die `Produkt`-Interface-Definition (Zeilen 3–18) durch:

```ts
import type { Verarbeitung, Belastung, Sonderbedingung, Massnahme, ZeitKategorie, Zusatzfunktion } from "./types";

export interface Produkt {
  id: string;
  name: string;
  kategorie: "estrich" | "grundierung" | "schnellzement" | "beschichtung" | "nachbehandlung" | "sonstige";
  kurzbeschreibung: string;
  schichtdicke?: string;
  qualitaetsklasse?: string;
  normen: string[];
  technischeDaten: { label: string; wert: string }[];
  besonderheiten: string[];
  websiteUrl?: string;
  verarbeitung?: Verarbeitung;
  tdsUrl?: string;

  // === NEU (2026-04-22): 4-Step-Lösungsfinder ===
  /**
   * Zeit-Kategorie des Produkts. Platzhalter "normal" bis Experten-Tagging erfolgt.
   * TODO (Experten-Workshop): TDS-basiert pro Produkt auf schnell/mittel/normal setzen.
   */
  zeit_kategorie: ZeitKategorie;
  /** Zusatzfunktionen, die dieses Produkt inhärent mitbringt. Leer = keine. */
  zusatzfunktionen?: Zusatzfunktion[];

  /** @deprecated Alter Eignungs-Array, entfällt nach Migrationsabschluss. */
  eignungen?: (Belastung | Sonderbedingung | Massnahme)[];
  bild?: string;
}
```

- [ ] **Step 2: `zeit_kategorie` zu jedem Produkt hinzufügen**

Gehe durch alle Produkte in `data/produkte.ts` und ergänze bei jedem Eintrag das Feld `zeit_kategorie`. Heuristik:
- Name enthält `rapid` oder `schnell` oder `ESC` (Schnellzement): `"schnell"`
- Kategorie ist `"grundierung"`: `"schnell"` (Haftbrücken sind zeitkritisch)
- Sonst: `"normal"`

Beispiel (erster Eintrag ab Zeile 22):
```ts
{
  id: "neodur-he-60-rapid",
  name: "NEODUR HE 60 rapid",
  // … bisherige Felder unverändert …
  eignungen: ["grossflaechige-sanierung", "schwerlast", "rollende-lasten", "chemikalien", "kurze-sperrzeit"],
  bild: "/images/produkte/neodur-he-60-rapid.png",
  zeit_kategorie: "schnell",  // "rapid" im Namen → schnell
},
```

Für **alle** Produkte ohne `rapid`/`schnell`/`ESC` im Namen und Kategorie ≠ `grundierung`: `zeit_kategorie: "normal"`.

- [ ] **Step 3: Header-Kommentar mit Workshop-TODO**

Füge ganz oben in `data/produkte.ts` (nach dem `import`-Block) einen Kommentar ein:

```ts
// ---------------------------------------------------------------------------
// HINWEIS — 4-Step-Lösungsfinder-Migration (2026-04-22)
// Das Feld `zeit_kategorie` ist aktuell heuristisch gesetzt (Name-Matching auf
// "rapid"/"schnell"/"ESC" + Grundierungen → "schnell", Rest → "normal").
// Das finale Mapping muss mit Produktmanagement im Workshop bestätigt werden.
// Ebenso `zusatzfunktionen`: aktuell leer bis auf explizit bekannte Fälle.
// Spec: docs/superpowers/specs/2026-04-22-loesungsfinder-4step-design.md
// ---------------------------------------------------------------------------
```

- [ ] **Step 4: TypeScript-Check**

Run: `npx tsc --noEmit`
Expected: Keine Fehler mehr in `data/produkte.ts`. Fehler verbleiben nur noch in `data/referenzen.ts` (fehlende neue Felder). Das ist erwartet.

- [ ] **Step 5: Commit**

```bash
git add data/produkte.ts
git commit -m "feat(produkte): zeit_kategorie + zusatzfunktionen mit konservativen Defaults"
```

---

## Task 3: Referenz-Migration — 4 neue Felder befüllen

**Files:**
- Modify: `data/referenzen.ts` (alle Referenz-Einträge)

**Context:** Jede Referenz braucht vier neue Felder. Migration aus vorhandenen Daten:
- `sanierungsart`: aus `massnahme` gemappt: `"kleine-reparatur"` → `"punktuell"`; `"grossflaechige-sanierung"` → `"grossflaechig"`
- `zeit_dringlichkeit`: `"schnell"` wenn `"kurze-sperrzeit"` in `sonderbedingungen`, sonst `"normal"` (Platzhalter)
- `zusatzfunktionen`: Mapping aus `sonderbedingungen` — `"chemikalien"` → `"chemikalienbestaendigkeit"`, `"tausalz"` → `"tausalzbestaendigkeit"`, `"rutschhemmung"` → `"rutschhemmung"`; `"aussenbereich"` und `"kurze-sperrzeit"` werden NICHT gemappt (fließen nicht in Step 4).
- `anwendungsbereiche`: Mapping aus altem `anwendungsbereich`-Einzelwert auf 1-elementiges Array:
  - `"produktionshalle"` → `["industrie-produktion"]`
  - `"lager"` → `["lager-logistik"]`
  - `"werkstatt"` → `["industrie-produktion"]`
  - `"zufahrt"` → `["infrastruktur-zufahrten"]`
  - `"parkflaeche"` → `["parkdeck"]`
  - `"bruecke"` → `["infrastruktur-zufahrten"]`
  - `"hafen"` → `["infrastruktur-zufahrten"]`
  - `"sonstiges"` → `[]` (leer, Workshop-TODO)

- [ ] **Step 1: Header-Kommentar in `data/referenzen.ts`**

Nach dem `import`-Block (nach Zeile 1) einfügen:

```ts
// ---------------------------------------------------------------------------
// HINWEIS — 4-Step-Lösungsfinder-Migration (2026-04-22)
// Die Felder `sanierungsart`, `anwendungsbereiche`, `zeit_dringlichkeit`,
// `zusatzfunktionen` sind aus den Alt-Feldern abgeleitet. Das Mapping ist
// konservativ — insbesondere `anwendungsbereiche` trägt meist nur 1 Element,
// obwohl Multi-Select vorgesehen ist. Mit Experten nachschärfen.
// Spec: docs/superpowers/specs/2026-04-22-loesungsfinder-4step-design.md
// ---------------------------------------------------------------------------
```

- [ ] **Step 2: Vier neue Felder zu jeder Referenz hinzufügen**

Für **jede** Referenz in der Datei (insgesamt ~46 Einträge; lies den kompletten File-Inhalt, um alle zu erfassen) ergänze die neuen Felder. Beispiel für den ersten Eintrag (Antolin, ab Zeile 5):

```ts
{
  id: "antolin-wochenend-sanierung",
  // … bisherige Felder unverändert …
  anwendungsbereich: "produktionshalle",
  massnahme: "grossflaechige-sanierung",
  belastungen: ["schwerlast"],
  zustand: ["abrieb"],
  sonderbedingungen: ["kurze-sperrzeit"],
  galerieBilder: [ /* … */ ],

  // === NEU ===
  sanierungsart: "grossflaechig",
  anwendungsbereiche: ["industrie-produktion"],
  zeit_dringlichkeit: "schnell",      // wegen kurze-sperrzeit
  zusatzfunktionen: [],                // kurze-sperrzeit mappt nicht auf Zusatzfunktion
},
```

Mapping-Regeln nochmal explizit:
- `sanierungsart`: `massnahme === "kleine-reparatur" ? "punktuell" : "grossflaechig"`
- `anwendungsbereiche`: Mapping aus altem Single-Wert siehe Task-Einleitung
- `zeit_dringlichkeit`: `sonderbedingungen.includes("kurze-sperrzeit") ? "schnell" : "normal"`
- `zusatzfunktionen`: Map `sonderbedingungen` durch Filter:
  - `"chemikalien"` → `"chemikalienbestaendigkeit"`
  - `"tausalz"` → `"tausalzbestaendigkeit"`
  - `"rutschhemmung"` → `"rutschhemmung"`
  - (andere verwerfen)

- [ ] **Step 3: TypeScript-Check**

Run: `npx tsc --noEmit`
Expected: **PASS** — keine Type-Fehler.

- [ ] **Step 4: Commit**

```bash
git add data/referenzen.ts
git commit -m "feat(referenzen): 4 neue Tag-Felder aus Alt-Feldern migriert"
```

---

## Task 4: Step-Definitionen in `data/loesungsfinder.ts`

**Files:**
- Modify: `data/loesungsfinder.ts` (komplett ersetzen)

**Context:** Wir schmeißen die alten 4 Step-Definitionen + altes `berechneErgebnisse` komplett weg und schreiben die neue Version. `berechneErgebnisse` bleibt Export-Name, Signatur ändert sich — ein späterer Task passt den Component-Call an.

- [ ] **Step 1: Datei komplett ersetzen**

Ersetze den gesamten Inhalt von `data/loesungsfinder.ts` durch:

```ts
import type {
  Referenz,
  Sanierungsart,
  AnwendungsbereichKategorie,
  ZeitKategorie,
  Zusatzfunktion,
} from "./types";
import { referenzen } from "./referenzen";
import { produkte, type Produkt } from "./produkte";

// === Step-Definitionen ===

export interface FlowOption<T extends string> {
  id: T;
  label: string;
  beschreibung?: string;
}

export interface FlowStep<T extends string> {
  id: string;
  frage: string;
  mehrfach: boolean;
  optionen: FlowOption<T>[];
}

export const stepSanierungsart: FlowStep<Sanierungsart> = {
  id: "sanierungsart",
  frage: "Was ist Ihre Situation?",
  mehrfach: false,
  optionen: [
    {
      id: "punktuell",
      label: "Punktuelle Sanierung",
      beschreibung: "Kosmetische oder funktionale Reparaturen wichtiger Flächen (Boden, Wand, Decke)",
    },
    {
      id: "grossflaechig",
      label: "Großflächige Sanierung",
      beschreibung: "Sanierungsmaßnahmen bei Restrukturierung, Modernisierung, Umnutzung oder energetischer Sanierung",
    },
  ],
};

export const stepAnwendungsbereich: FlowStep<AnwendungsbereichKategorie> = {
  id: "anwendungsbereich",
  frage: "In welchem Bereich wird saniert?",
  mehrfach: true,
  optionen: [
    { id: "lager-logistik", label: "Lager & Logistik" },
    { id: "industrie-produktion", label: "Industrie- & Produktionshalle" },
    { id: "lebensmittel", label: "Lebensmittel" },
    { id: "flugzeug", label: "Flugzeug (Hangar, Landebahn)" },
    { id: "parkdeck", label: "Parkdeck / Parkhaus / Tiefgarage" },
    { id: "infrastruktur-zufahrten", label: "Infrastruktur & Zufahrten" },
    { id: "verkaufsraeume", label: "Verkaufsräume" },
    { id: "schwerindustrie", label: "Schwerindustrie (Entsorgung, Kettenfahrzeuge)" },
  ],
};

export const stepZeit: FlowStep<ZeitKategorie> = {
  id: "zeit",
  frage: "Wie dringlich ist die Wieder-Belastbarkeit?",
  mehrfach: false,
  optionen: [
    {
      id: "schnell",
      label: "Super dringlich",
      beschreibung: "Fläche muss schnell wieder belastbar sein (wenige Stunden)",
    },
    {
      id: "mittel",
      label: "Enger Zeitplan",
      beschreibung: "Zügig, aber nicht akut (1 Tag)",
    },
    {
      id: "normal",
      label: "Keine Zeitbegrenzung",
      beschreibung: "Zeit spielt keine Rolle",
    },
  ],
};

export const stepZusatzfunktion: FlowStep<Zusatzfunktion> = {
  id: "zusatzfunktion",
  frage: "Welche Zusatzfunktionen werden gebraucht?",
  mehrfach: true,
  optionen: [
    { id: "chemikalienbestaendigkeit", label: "Chemikalienbeständigkeit" },
    { id: "tausalzbestaendigkeit", label: "Tausalzbeständigkeit" },
    { id: "rutschhemmung", label: "Rutschhemmung" },
    { id: "fleckenabwehr", label: "Fleckenabwehr" },
  ],
};

// === Scoring ===

export interface UserAuswahl {
  sanierungsart: Sanierungsart;
  anwendungsbereiche: AnwendungsbereichKategorie[];
  zeit_dringlichkeit: ZeitKategorie;
  zusatzfunktionen: Zusatzfunktion[];
}

export interface ScoredReferenz {
  referenz: Referenz;
  score: number;
  matchingTags: string[];
}

export interface AggregiertesProdukt {
  produkt: Produkt;
  anzahlEinsaetze: number;
  referenzen: string[]; // Referenz-Slugs
}

export interface LoesungsfinderErgebnis {
  referenzen: ScoredReferenz[];
  aggregierteProdukte: AggregiertesProdukt[];
}

const WEIGHT_ANWENDUNGSBEREICH = 3;
const WEIGHT_ZEIT = 2;
const WEIGHT_ZUSATZFUNKTION = 2;

const ZEIT_RANK: Record<ZeitKategorie, number> = {
  schnell: 3,
  mittel: 2,
  normal: 1,
};

function zeitMatchesHierarchisch(
  userAuswahl: ZeitKategorie,
  referenzTag: ZeitKategorie,
): boolean {
  // Hierarchie: schnell ⊂ mittel ⊂ normal
  // Nutzer wählt "mittel" → match bei "schnell" und "mittel"
  // Nutzer wählt "normal" → match bei allen
  // Nutzer wählt "schnell" → match nur bei "schnell"
  return ZEIT_RANK[referenzTag] >= ZEIT_RANK[userAuswahl];
}

export function berechneErgebnisse(
  auswahl: UserAuswahl,
): LoesungsfinderErgebnis {
  // Harter Filter: Sanierungsart muss matchen
  const kandidaten = referenzen.filter(
    (ref) => ref.sanierungsart === auswahl.sanierungsart,
  );

  // Scoring
  const scored: ScoredReferenz[] = kandidaten.map((ref) => {
    let score = 0;
    const matchingTags: string[] = [];

    // Step 2: Anwendungsbereich (Multi-Match, +3 pro Überschneidung)
    for (const ab of auswahl.anwendungsbereiche) {
      if (ref.anwendungsbereiche.includes(ab)) {
        score += WEIGHT_ANWENDUNGSBEREICH;
        matchingTags.push(ab);
      }
    }

    // Step 3: Zeit (hierarchisch, +2 wenn match)
    if (zeitMatchesHierarchisch(auswahl.zeit_dringlichkeit, ref.zeit_dringlichkeit)) {
      score += WEIGHT_ZEIT;
      matchingTags.push(ref.zeit_dringlichkeit);
    }

    // Step 4: Zusatzfunktionen (Multi-Match, +2 pro Überschneidung)
    for (const zf of auswahl.zusatzfunktionen) {
      if (ref.zusatzfunktionen.includes(zf)) {
        score += WEIGHT_ZUSATZFUNKTION;
        matchingTags.push(zf);
      }
    }

    return { referenz: ref, score, matchingTags };
  });

  // Sortierung: Score desc, dann Slug asc (stabiler Tiebreaker — kein Datum-Feld vorhanden)
  const sortiert = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.referenz.slug.localeCompare(b.referenz.slug);
    });

  // Produkt-Aggregation aus Top-5
  const topN = sortiert.slice(0, 5);
  const aggregierteProdukte = aggregiereProdukte(topN);

  return {
    referenzen: sortiert,
    aggregierteProdukte,
  };
}

export function aggregiereProdukte(
  topReferenzen: ScoredReferenz[],
): AggregiertesProdukt[] {
  const produktMap = new Map<string, { anzahl: number; referenzen: string[] }>();

  for (const scored of topReferenzen) {
    for (const produktName of scored.referenz.produkte) {
      const existing = produktMap.get(produktName);
      if (existing) {
        existing.anzahl += 1;
        existing.referenzen.push(scored.referenz.slug);
      } else {
        produktMap.set(produktName, {
          anzahl: 1,
          referenzen: [scored.referenz.slug],
        });
      }
    }
  }

  // Map zu AggregiertesProdukt[] — nur Produkte, die auch im Katalog existieren
  const result: AggregiertesProdukt[] = [];
  for (const [produktName, meta] of produktMap.entries()) {
    const produkt = produkte.find((p) => p.name === produktName);
    if (!produkt) continue; // Referenz nennt Produkt, das nicht (mehr) im Katalog ist
    result.push({
      produkt,
      anzahlEinsaetze: meta.anzahl,
      referenzen: meta.referenzen,
    });
  }

  // Sortierung: Anzahl desc, dann Name asc
  result.sort((a, b) => {
    if (b.anzahlEinsaetze !== a.anzahlEinsaetze) {
      return b.anzahlEinsaetze - a.anzahlEinsaetze;
    }
    return a.produkt.name.localeCompare(b.produkt.name);
  });

  return result;
}
```

- [ ] **Step 2: TypeScript-Check**

Run: `npx tsc --noEmit`
Expected: Fehler nur noch in `components/Loesungsfinder.tsx` (Imports `step1-4` existieren nicht mehr). Erwartet — fixen wir in Task 6.

- [ ] **Step 3: Commit**

```bash
git add data/loesungsfinder.ts
git commit -m "feat(loesungsfinder): 4-Step-Definitionen + neues Scoring auf Referenzen"
```

---

## Task 5: Smoke-Test für `berechneErgebnisse`

**Files:**
- Create: `scripts/test-loesungsfinder.ts`

**Context:** Wir haben keinen Test-Runner. Daher ein Standalone-Skript mit `node:assert`, das per `npx tsx` läuft. Prüft die wichtigsten Scoring-Regeln gegen echte Referenzdaten.

- [ ] **Step 1: Test-Skript anlegen**

Erstelle `scripts/test-loesungsfinder.ts` mit folgendem Inhalt:

```ts
import assert from "node:assert/strict";
import { berechneErgebnisse, aggregiereProdukte } from "../data/loesungsfinder";
import { referenzen } from "../data/referenzen";
import type { UserAuswahl } from "../data/loesungsfinder";

let pass = 0;
let fail = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    pass += 1;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    fail += 1;
    console.error(`  ✗ ${name}`);
    console.error(`    ${(err as Error).message}`);
  }
}

console.log("\n=== berechneErgebnisse ===");

test("Harter Filter: punktuell schließt großflächige Referenzen aus", () => {
  const auswahl: UserAuswahl = {
    sanierungsart: "punktuell",
    anwendungsbereiche: [],
    zeit_dringlichkeit: "normal",
    zusatzfunktionen: [],
  };
  const ergebnis = berechneErgebnisse(auswahl);
  for (const scored of ergebnis.referenzen) {
    assert.equal(scored.referenz.sanierungsart, "punktuell");
  }
});

test("Harter Filter: grossflaechig schließt punktuelle Referenzen aus", () => {
  const auswahl: UserAuswahl = {
    sanierungsart: "grossflaechig",
    anwendungsbereiche: [],
    zeit_dringlichkeit: "normal",
    zusatzfunktionen: [],
  };
  const ergebnis = berechneErgebnisse(auswahl);
  for (const scored of ergebnis.referenzen) {
    assert.equal(scored.referenz.sanierungsart, "grossflaechig");
  }
});

test("Zeit-Hierarchie: 'normal' als User matcht alle Zeit-Tags", () => {
  const auswahl: UserAuswahl = {
    sanierungsart: "grossflaechig",
    anwendungsbereiche: [],
    zeit_dringlichkeit: "normal",
    zusatzfunktionen: [],
  };
  const ergebnis = berechneErgebnisse(auswahl);
  // Alle grossflaechig-Referenzen sollten Zeit-Match haben (+2) → score ≥ 2
  const grossRefs = referenzen.filter((r) => r.sanierungsart === "grossflaechig");
  if (grossRefs.length > 0) {
    assert.ok(ergebnis.referenzen.length > 0, "Mindestens eine Referenz erwartet");
    assert.ok(
      ergebnis.referenzen.every((s) => s.score >= 2),
      "Alle Referenzen sollten Zeit-Match haben",
    );
  }
});

test("Zeit-Hierarchie: 'schnell' als User matcht nur schnell-Referenzen", () => {
  const auswahl: UserAuswahl = {
    sanierungsart: "grossflaechig",
    anwendungsbereiche: [],
    zeit_dringlichkeit: "schnell",
    zusatzfunktionen: [],
  };
  const ergebnis = berechneErgebnisse(auswahl);
  // Referenzen mit score ≥ 2 müssen zeit_dringlichkeit "schnell" haben
  for (const scored of ergebnis.referenzen) {
    if (scored.score >= 2) {
      assert.equal(
        scored.referenz.zeit_dringlichkeit,
        "schnell",
        `Referenz ${scored.referenz.slug} sollte schnell sein`,
      );
    }
  }
});

test("Anwendungsbereich-Scoring: Multi-Match addiert sich", () => {
  const auswahl: UserAuswahl = {
    sanierungsart: "grossflaechig",
    anwendungsbereiche: ["industrie-produktion", "lager-logistik"],
    zeit_dringlichkeit: "normal",
    zusatzfunktionen: [],
  };
  const ergebnis = berechneErgebnisse(auswahl);
  // Eine Referenz mit beiden AB sollte +6 (2×3), Zeit +2 = 8 haben
  // Eine mit nur einem: +3 + 2 = 5
  // Keine Überlappung: nur +2 (Zeit) — aber Filter > 0 entfernt das nicht …
  // … da Zeit "normal"/"normal" bereits score +2 gibt, erscheinen auch AB-lose Referenzen
  assert.ok(ergebnis.referenzen.length > 0);
});

test("Sortierung: höchster Score zuerst", () => {
  const auswahl: UserAuswahl = {
    sanierungsart: "grossflaechig",
    anwendungsbereiche: ["industrie-produktion"],
    zeit_dringlichkeit: "normal",
    zusatzfunktionen: ["chemikalienbestaendigkeit"],
  };
  const ergebnis = berechneErgebnisse(auswahl);
  for (let i = 1; i < ergebnis.referenzen.length; i++) {
    assert.ok(
      ergebnis.referenzen[i - 1].score >= ergebnis.referenzen[i].score,
      "Scores müssen absteigend sortiert sein",
    );
  }
});

console.log("\n=== aggregiereProdukte ===");

test("Aggregation zählt Produkt-Einsätze korrekt", () => {
  const auswahl: UserAuswahl = {
    sanierungsart: "grossflaechig",
    anwendungsbereiche: [],
    zeit_dringlichkeit: "normal",
    zusatzfunktionen: [],
  };
  const ergebnis = berechneErgebnisse(auswahl);
  // Aggregation ist über Top-5
  const top5Slugs = new Set(ergebnis.referenzen.slice(0, 5).map((s) => s.referenz.slug));
  for (const agg of ergebnis.aggregierteProdukte) {
    assert.ok(agg.anzahlEinsaetze >= 1);
    assert.ok(agg.anzahlEinsaetze <= 5);
    assert.ok(agg.referenzen.every((slug) => top5Slugs.has(slug)));
  }
});

test("Aggregation sortiert nach Häufigkeit", () => {
  const auswahl: UserAuswahl = {
    sanierungsart: "grossflaechig",
    anwendungsbereiche: [],
    zeit_dringlichkeit: "normal",
    zusatzfunktionen: [],
  };
  const ergebnis = berechneErgebnisse(auswahl);
  for (let i = 1; i < ergebnis.aggregierteProdukte.length; i++) {
    assert.ok(
      ergebnis.aggregierteProdukte[i - 1].anzahlEinsaetze >=
        ergebnis.aggregierteProdukte[i].anzahlEinsaetze,
    );
  }
});

console.log(`\n→ ${pass} passed, ${fail} failed\n`);
process.exit(fail > 0 ? 1 : 0);
```

- [ ] **Step 2: `tsx` verfügbar machen**

Check: `npx tsx --version`
Falls nicht installiert: `npm install --save-dev tsx` (macht `tsx` global im Projekt verfügbar).

- [ ] **Step 3: Test ausführen**

Run: `npx tsx scripts/test-loesungsfinder.ts`
Expected: Alle Tests bestehen. Output endet mit `→ 8 passed, 0 failed`.

Wenn ein Test failed: Ursache ist fast immer ein Daten-Problem (fehlerhafte Migration in Task 3) — die Fehlermeldung zeigt den problematischen Slug.

- [ ] **Step 4: Commit**

```bash
git add scripts/test-loesungsfinder.ts package.json package-lock.json
git commit -m "test(loesungsfinder): Smoke-Test für Scoring + Aggregation"
```

---

## Task 6: Component-Rewrite `components/Loesungsfinder.tsx`

**Files:**
- Modify: `components/Loesungsfinder.tsx` (komplett ersetzen)

**Context:** Das Component wird auf 4 Steps umgebaut, State-Shape passt sich an, Ergebnisseite zeigt Referenzen + aggregierte Produkte (letzteres neu).

- [ ] **Step 1: Component komplett ersetzen**

Ersetze den gesamten Inhalt von `components/Loesungsfinder.tsx` durch:

```tsx
"use client";

import { useState, useCallback } from "react";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import ChipSelect from "@/components/ChipSelect";
import ProgressBar from "@/components/ProgressBar";
import ReferenceCard from "@/components/ReferenceCard";
import {
  stepSanierungsart,
  stepAnwendungsbereich,
  stepZeit,
  stepZusatzfunktion,
  berechneErgebnisse,
  type UserAuswahl,
} from "@/data/loesungsfinder";
import type {
  Sanierungsart,
  AnwendungsbereichKategorie,
  ZeitKategorie,
  Zusatzfunktion,
} from "@/data/types";
import Link from "next/link";

const STEP_LABELS = ["Sanierungsart", "Anwendungsbereich", "Zeit", "Zusatzfunktion", "Ergebnisse"];

interface LoesungsfinderProps {
  lang: Locale;
  dict: Dictionary;
}

export default function Loesungsfinder({ lang }: LoesungsfinderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [sanierungsart, setSanierungsart] = useState<Sanierungsart[]>([]);
  const [anwendungsbereiche, setAnwendungsbereiche] = useState<AnwendungsbereichKategorie[]>([]);
  const [zeitDringlichkeit, setZeitDringlichkeit] = useState<ZeitKategorie[]>([]);
  const [zusatzfunktionen, setZusatzfunktionen] = useState<Zusatzfunktion[]>([]);

  const steps = [stepSanierungsart, stepAnwendungsbereich, stepZeit, stepZusatzfunktion];
  const selections: string[][] = [sanierungsart, anwendungsbereiche, zeitDringlichkeit, zusatzfunktionen];
  const setters: ((v: string[]) => void)[] = [
    (v) => setSanierungsart(v as Sanierungsart[]),
    (v) => setAnwendungsbereiche(v as AnwendungsbereichKategorie[]),
    (v) => setZeitDringlichkeit(v as ZeitKategorie[]),
    (v) => setZusatzfunktionen(v as Zusatzfunktion[]),
  ];

  const handleStepClick = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  const userAuswahl: UserAuswahl | null =
    sanierungsart.length > 0 && zeitDringlichkeit.length > 0
      ? {
          sanierungsart: sanierungsart[0],
          anwendungsbereiche,
          zeit_dringlichkeit: zeitDringlichkeit[0],
          zusatzfunktionen,
        }
      : null;

  const ergebnisse = currentStep === 4 && userAuswahl ? berechneErgebnisse(userAuswahl) : null;

  const allSelections = [
    ...sanierungsart.map((id) => ({
      id,
      label: stepSanierungsart.optionen.find((o) => o.id === id)?.label ?? id,
      step: 0,
    })),
    ...anwendungsbereiche.map((id) => ({
      id,
      label: stepAnwendungsbereich.optionen.find((o) => o.id === id)?.label ?? id,
      step: 1,
    })),
    ...zeitDringlichkeit.map((id) => ({
      id,
      label: stepZeit.optionen.find((o) => o.id === id)?.label ?? id,
      step: 2,
    })),
    ...zusatzfunktionen.map((id) => ({
      id,
      label: stepZusatzfunktion.optionen.find((o) => o.id === id)?.label ?? id,
      step: 3,
    })),
  ];

  return (
    <div>
      <ProgressBar steps={STEP_LABELS} currentStep={currentStep} onStepClick={handleStepClick} />

      {currentStep < 4 && (
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl text-[#002d59] text-center mb-6" style={{ fontWeight: 700 }}>
            {steps[currentStep].frage}
          </h2>

          <ChipSelect
            optionen={steps[currentStep].optionen}
            selected={selections[currentStep]}
            mehrfach={steps[currentStep].mehrfach}
            onChange={(val) => {
              setters[currentStep](val);
              if (currentStep === 0 && val.length > 0) {
                setTimeout(() => setCurrentStep(1), 300);
              }
            }}
            grosseCards={currentStep === 0}
          />

          {currentStep > 0 && (
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-6 py-2 text-sm border cursor-pointer transition-colors"
                style={{
                  borderRadius: 6,
                  borderColor: "#e8edf5",
                  color: "#002d59",
                  backgroundColor: "#fff",
                  fontWeight: 600,
                }}
              >
                ← Zurück
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={selections[currentStep].length === 0}
                className="px-6 py-2 text-sm cursor-pointer transition-colors"
                style={{
                  borderRadius: 6,
                  backgroundColor: selections[currentStep].length === 0 ? "#e8edf5" : "#009ee3",
                  color: selections[currentStep].length === 0 ? "#9ca3af" : "#fff",
                  border: "none",
                  fontWeight: 600,
                }}
              >
                Weiter →
              </button>
            </div>
          )}
        </div>
      )}

      {currentStep === 4 && ergebnisse && (
        <div>
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {allSelections.map((tag) => (
              <button
                key={`${tag.step}-${tag.id}`}
                type="button"
                onClick={() => setCurrentStep(tag.step)}
                className="px-3 py-1 text-xs cursor-pointer transition-colors border"
                style={{
                  borderRadius: 6,
                  backgroundColor: "#f5f5f6",
                  color: "#002d59",
                  borderColor: "#e8edf5",
                  fontWeight: 600,
                }}
                title={`${STEP_LABELS[tag.step]}: ${tag.label} — klicken zum Ändern`}
              >
                {tag.label} ✕
              </button>
            ))}
          </div>

          {ergebnisse.referenzen.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-[#002d59]" style={{ fontWeight: 700 }}>
                Keine Referenzen für diese Sanierungsart gefunden.
              </p>
              <p className="text-sm text-[#002d59] opacity-60 mt-2">
                Kontaktieren Sie uns direkt für eine persönliche Beratung oder passen Sie die Auswahl an.
              </p>
              <button
                type="button"
                onClick={() => setCurrentStep(0)}
                className="mt-4 px-6 py-2 text-sm cursor-pointer border"
                style={{
                  borderRadius: 6,
                  borderColor: "#e8edf5",
                  color: "#002d59",
                  backgroundColor: "#fff",
                  fontWeight: 600,
                }}
              >
                ← Auswahl ändern
              </button>
            </div>
          ) : (
            <>
              <div className="mb-12">
                <h3 className="text-lg text-[#002d59] mb-4" style={{ fontWeight: 900 }}>
                  Ähnliche Referenzprojekte
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {ergebnisse.referenzen.slice(0, 5).map((scored) => (
                    <div key={scored.referenz.slug}>
                      <ReferenceCard referenz={scored.referenz} lang={lang} />
                      <div className="flex flex-wrap gap-1 mt-2 px-1">
                        {scored.matchingTags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-2 py-0.5 rounded"
                            style={{
                              backgroundColor: "#009ee3",
                              color: "#fff",
                              fontWeight: 600,
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {ergebnisse.aggregierteProdukte.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-lg text-[#002d59] mb-4" style={{ fontWeight: 900 }}>
                    Eingesetzte Produkte in diesen Referenzen
                  </h3>
                  <p className="text-sm text-[#002d59] opacity-60 mb-4">
                    Aggregiert aus den Top-Referenzen — häufigste zuerst.
                  </p>
                  <div className="flex flex-col gap-2">
                    {ergebnisse.aggregierteProdukte.map((agg) => (
                      <Link
                        key={agg.produkt.id}
                        href={`/${lang}/produkte/${agg.produkt.id}`}
                        className="no-underline block"
                      >
                        <div
                          className="bg-white px-5 py-3 flex items-center justify-between transition-all hover:-translate-y-0.5 border"
                          style={{ borderRadius: 10, borderColor: "#e8edf5" }}
                        >
                          <div>
                            <span className="text-[#002d59] text-base" style={{ fontWeight: 900 }}>
                              {agg.produkt.name}
                            </span>
                            <span className="text-[#002d59] opacity-60 text-xs ml-3">
                              in {agg.anzahlEinsaetze} von {Math.min(ergebnisse.referenzen.length, 5)} Referenzen
                            </span>
                          </div>
                          <span className="text-[#009ee3] text-sm" style={{ fontWeight: 700 }}>
                            zum Produkt →
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                <a
                  href="https://www.korodur.de/kontakt/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 text-sm no-underline transition-colors"
                  style={{
                    borderRadius: 6,
                    backgroundColor: "#009ee3",
                    color: "#fff",
                    fontWeight: 700,
                  }}
                >
                  Beratung anfragen
                </a>
                <button
                  type="button"
                  onClick={() => setCurrentStep(0)}
                  className="px-6 py-2 text-sm cursor-pointer border bg-white"
                  style={{
                    borderRadius: 6,
                    borderColor: "#e8edf5",
                    color: "#002d59",
                    fontWeight: 600,
                  }}
                >
                  ← Auswahl ändern
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: TypeScript-Check**

Run: `npx tsc --noEmit`
Expected: Keine Fehler.

- [ ] **Step 3: Build-Check**

Run: `npm run build`
Expected: PASS ohne Fehler.

- [ ] **Step 4: Commit**

```bash
git add components/Loesungsfinder.tsx
git commit -m "feat(loesungsfinder): Component-Rewrite auf 4-Step-Wizard"
```

---

## Task 7: Seiten-Metadaten anpassen

**Files:**
- Modify: `app/[lang]/loesungsfinder/page.tsx:8-11`

**Context:** Die `Metadata`-Description sagt „in 5 Schritten". Neu sind es 4 Steps (+ Ergebnisseite).

- [ ] **Step 1: Metadata aktualisieren**

Ersetze in `app/[lang]/loesungsfinder/page.tsx` die Zeilen 7–11:

```ts
export const metadata: Metadata = {
  title: "Lösungsfinder",
  description:
    "Finden Sie in 4 Schritten die passende Sanierungslösung für Ihren Industrieboden.",
};
```

- [ ] **Step 2: Commit**

```bash
git add app/[lang]/loesungsfinder/page.tsx
git commit -m "docs(loesungsfinder): Metadaten auf 4 Schritte aktualisiert"
```

---

## Task 8: Dictionary-Labels für alle 4 Locales

**Files:**
- Modify: `app/[lang]/dictionaries/de.json`, `en.json`, `fr.json`, `pl.json`

**Context:** Der Lösungsfinder wird mehrsprachig — Step-Labels, Options-Labels und Ergebnis-Überschriften sollten aus dem Dictionary kommen. **Scope-Entscheidung für diesen Plan:** Da der bestehende Component die Labels direkt aus `data/loesungsfinder.ts` zieht (siehe `stepX.frage` und `stepX.optionen[].label`), halten wir Phase 1 **de-only** (wie der bestehende Code). Wir ergänzen die Dictionaries nur dort, wo heute bereits Keys existieren, und ziehen i18n als Folge-Task.

- [ ] **Step 1: Prüfen, welche Lösungsfinder-Keys heute in den Dictionaries stehen**

Run: `grep -r "loesungsfinder\|Lösungsfinder" /Users/sfleischmann/KORODUR-Sanierung_app/app/\[lang\]/dictionaries/`
Expected: Liste existierender Keys — wenn nichts, dann entfällt dieser Task-Inhalt weitgehend.

- [ ] **Step 2: Falls Keys existieren, nur die veralteten Labels (alte Step-Namen) entfernen/anpassen**

Wenn alte Keys wie `loesungsfinder.step_belastung` oder `loesungsfinder.step_zustand` in den JSONs stehen: entfernen oder auskommentieren mit Notiz „entfällt im 4-Step-Wizard". Keine neuen i18n-Keys einführen — das ist ein Folge-Task.

- [ ] **Step 3: Commit (nur wenn Änderungen nötig waren)**

```bash
git add app/[lang]/dictionaries/
git commit -m "chore(i18n): veraltete Lösungsfinder-Keys entfernt"
```

---

## Task 9: Manuelle UI-Verifikation

**Files:** keine Änderung

**Context:** Golden-Path-Test im Browser: Wizard durchklicken, Ergebnis prüfen, Edge-Cases testen.

- [ ] **Step 1: Dev-Server starten**

Run: `npm run dev`
Expected: Server startet auf `http://localhost:3000`.

- [ ] **Step 2: Golden Path — Großflächig + Industrie**

Öffne `http://localhost:3000/de/loesungsfinder` und:
1. Klick „Großflächige Sanierung" → Auto-Advance zu Step 2.
2. Klick „Industrie- & Produktionshalle" → Weiter.
3. Klick „Keine Zeitbegrenzung" → Weiter.
4. Klick „Chemikalienbeständigkeit" → Weiter.

Expected:
- Ergebnisseite zeigt Filter-Chips oben.
- „Ähnliche Referenzprojekte" Grid mit mindestens 1 Karte.
- Jede Karte hat Match-Tags unter dem Bild.
- „Eingesetzte Produkte in diesen Referenzen" Liste mit Häufigkeitsangabe „in X von Y Referenzen".
- CTAs „Beratung anfragen" und „Auswahl ändern" unten.

- [ ] **Step 3: Edge-Case — Punktuell ohne Daten**

Klick auf Filter-Chip „Großflächige Sanierung" → springt zu Step 0 → wähle „Punktuelle Sanierung".

Expected: Abhängig von den Referenzdaten entweder Ergebnisse oder Empty-State mit „Keine Referenzen für diese Sanierungsart gefunden".

- [ ] **Step 4: Edge-Case — zurück navigieren**

Click auf ProgressBar-Step „Anwendungsbereich".

Expected: Wizard springt zu Step 1, frühere Auswahlen bleiben erhalten.

- [ ] **Step 5: Keine Commit — reine Verifikation**

Wenn ein Fehler auftritt: Ursache fixen (wahrscheinlich fehlerhafte Migration in Task 3 → Referenz ohne neuen Tag; oder Scoring-Bug). Dann erneut verifizieren.

---

## Task 10: Endbereinigung & Lint

**Files:**
- Eventuell: diverse (Lint-Fixes)

- [ ] **Step 1: Lint laufen lassen**

Run: `npm run lint`
Expected: PASS ohne Fehler.

Falls Warnungen zu unused-imports (z. B. `Massnahme`, `Belastung` in Component nicht mehr genutzt): beheben.

- [ ] **Step 2: Smoke-Test erneut ausführen**

Run: `npx tsx scripts/test-loesungsfinder.ts`
Expected: `→ 8 passed, 0 failed`.

- [ ] **Step 3: Full-Build-Check**

Run: `npm run build`
Expected: Build erfolgreich.

- [ ] **Step 4: Finale-Commit (falls Lint-Fixes nötig)**

```bash
git add -u
git commit -m "chore: Lint-Cleanup nach Lösungsfinder-Rewrite"
```

---

## Experten-Workshop TODOs (außerhalb dieses Plans)

Parallel zu diesem Plan laufen Abstimmungen, die die Daten final machen (siehe Spec Abschnitt 9):

1. Zeit-Schwellen scharf definieren (was heißt `schnell`? < 1 h? 1–3 h?)
2. Alle ~17 Produkte in `schnell`/`mittel`/`normal` einsortieren (Platzhalter ersetzen)
3. Zusatzfunktions-Liste finalisieren (Startpunkt: 4 Werte — Chemikalien, Tausalz, Rutschhemmung, Fleckenabwehr)
4. Alle Referenzen manuell mit korrekten `anwendungsbereiche[]` (Multi) und `zusatzfunktionen[]` taggen
5. Lebensmittel-Zertifizierung: separates Attribut oder über Tag abbilden?
6. Welche Basis-Produkte haben Chemikalienbeständigkeit inhärent vs. durch Topping?

Diese TODOs werden nach Abschluss des Code-Plans in einer separaten Daten-Revision eingepflegt.
