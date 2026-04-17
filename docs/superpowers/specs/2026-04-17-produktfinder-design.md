# Produktfinder — Zusammenführung Lösungsfinder + Produktmatrix mit Notion als Source

**Stand:** 2026-04-17
**Status:** Design — zur Freigabe
**Autorin:** Steffi (Applied AI Manager, KORODUR) + Claude Code
**Bezug:** KORODUR-Sanierung_app (V2.3) — Website-Relaunch-Strategie (2026-04-17)
**Historie:** Erste Fassung dieser Spec fokussierte nur auf Produktmatrix-Logik. Nach kritischer Rückfrage und Vertriebs-Stress-Test wurde die Form verändert: Filter + Kandidatenliste statt Tabellen-Matrix, Zusammenführung mit Lösungsfinder.

---

## Executive Summary

Die heutigen Tools `/produktmatrix` (Tabelle, binär, 11 Spalten) und `/loesungsfinder` (4-Step-Wizard, Referenz-gescort) werden zu **einem Produktfinder** unter `/produktfinder` zusammengeführt — mit zwei Eingangstüren:

- **Modus „Geführt"** — der bekannte Wizard für Kunden und Einsteiger.
- **Modus „Expert"** — freier Kriterien-Filter mit Live-Kandidatenliste, für Vertrieb, Beratung und Profis.

Beide Modi nutzen **dieselbe Datenbasis (Notion) und dasselbe Scoring**. Das eliminiert Duplikation und macht den Produktfinder zur einen erzählerischen Klammer.

Gleichzeitig wird das Produktwissen auf eine neue Grundlage gestellt: **Notion wird Single Source of Truth**. Ein relationales 3-DB-Schema (Produkte × Kriterien × Eignungen) trägt 6-stufige Qualifizierungen (×××, ××, ×, +, ++, +++) plus Notizen und Quellen — direkt im Team pflegbar. Die App bekommt einen generierten TypeScript-Contract.

Strategisch in Phase 1 ein **internes Tool**: Vertrieb und Beratung bekommen ein scharfes Instrument, Kollegen arbeiten direkt in Notion am Wissen, Erkenntnisse fließen strukturiert (Notiz, Quelle, Datum) zurück. Phase 2: Öffentliche Version, ggf. vereinfacht (3 Stufen statt 6, keine internen Notizen sichtbar) — als zweiter Renderer derselben Datenbasis.

Parked außerhalb dieser Spec: Sync-Mechanik Notion↔App, Bodenzustand-Dimension, Payload-Brücke.

---

## 1. Ausgangslage

### `/produktmatrix` heute
- Komponente: `components/Produktmatrix.tsx`
- Daten: `data/produkte.ts` → `eignungen?: (Belastung | Sonderbedingung | Massnahme)[]`
- Struktur: 11 Spalten gleichrangig (Maßnahme + Belastung + Sonderbedingung)
- Treffer: binär (blauer Punkt oder leer), keine Abstufung
- Probleme: strukturell unsauber, skaliert nicht über 20+ Produkte, trägt zu wenig Information für Vertriebsgespräche

### `/loesungsfinder` heute
- Daten/Logik: `data/loesungsfinder.ts`
- 4-Step-Wizard: Situation (Maßnahme) → Belastung → Zustand → Sonderbedingung
- Scoring: Referenz-basiert — Tags jeder Referenz werden gegen User-Auswahl gematcht, Top-Referenzen liefern Produkte
- Stärke: klarer Flow für Kunden, zeigt Referenzprojekte als Vertrauenselement
- Schwäche: Produkt-Ranking ist indirekt (über Referenzen), nicht über direkte Produkt-Eignungen

### Schmerzpunkt in der Praxis
Der Vertriebs-Stress-Test zeigte: Der reale Anruf („Schwerlast + Chemikalien + kurze Sperrzeit, was empfehlen wir?") wird vom Lösungsfinder-Wizard unhandlich abgedeckt (4 Steps durchklicken) und von der Matrix (mental 3 Spalten × 17 Zeilen abgleichen) nur langsam. Gebraucht wird: Chips anklicken, Kandidaten sofort sehen.

### Strategischer Kontext
Die App soll vom „einfachen Renderer" zu einer Schicht in einem Produktwissen-System werden. Notion als gemeinsame Pflegefläche für das Team, die App als Renderer, Erkenntnisse fließen zurück. Das passt zum Website-Relaunch-Plan (Ansatz B aus der Stack-Strategie): Notion bleibt internes Wissenstool, Payload publiziert später die Website-Sicht.

---

## 2. Entscheidungen

### 2.1 IA / URL
- Neue Route **`/produktfinder`** (SEO-neutral, trägt beide Modi)
- **301-Redirects** von `/produktmatrix` und `/loesungsfinder` auf `/produktfinder`
- Intern: Modus-Toggle oben. URL-Parameter `?modus=expert` für Deep-Links.

### 2.2 Zwei Modi, ein Scoring
- Beide Modi rufen **dieselbe Scoring-Funktion** `berechneKandidaten(criteria, massnahme)`
- **Expert ist Default in Phase 1** (internes Tool zuerst). Phase 2 dreht das um, wenn öffentlicher Traffic dazukommt.
- Input-Unterschied: Wizard sammelt Kriterien linear in 3 Steps (Situation → Belastung → Sonderbedingung), Expert sammelt sie frei via Chip-Filter
- Output-Unterschied: Wizard zeigt Produkt-Kandidaten **und** Referenzprojekte (Storytelling für Kunden/Einsteiger); Expert zeigt **nur Produkt-Kandidaten** — fokussiert, ohne Referenz-Sektion

### 2.3 Qualifizierungs-Skala
**6 Stufen, symmetrisch, ohne neutrale Mitte:**

| Symbol | Bedeutung |
|--------|-----------|
| `×××` | ungeeignet — Einsatz explizit nicht empfohlen |
| `××`  | schwach — signifikante Einschränkungen |
| `×`   | kritisch — nur in Ausnahmen |
| `+`   | bedingt geeignet |
| `++`  | gut geeignet |
| `+++` | ideal — Referenzfall |

Leere Zelle = noch nicht bewertet, bewusste Trennung von `×××`.

### 2.4 Notion-Datenmodell
Vollrelational, drei Datenbanken: Produkte × Kriterien × Eignungen (Junction). Siehe Schema unten.

### 2.5 CMS-Strategie
Notion = interner Source of Truth. Payload (Website-Relaunch) importiert/synct später aus Notion — keine Live-Anbindung zur Laufzeit.

### 2.6 Sync-Mechanik
Geparkt. Diese Spec definiert nur den Contract (`data/matrix.generated.ts`). Ziel-Richtung: Hybrid (manuelles Script + CI-Build-Hook).

### 2.7 Aus-Scope dieser Spec
- Tabellen-Matrix-Ansicht (heutige Form) entfällt in Phase 1 — ggf. späterer Modus 3 „Übersicht"
- **Zustand-Step (Risse, Abrieb, Hohlstellen, …) fällt komplett aus dem Wizard** — weder Produkt- noch Referenz-Scoring in Phase 1. Wird nach Team-Klärung und Aufnahme in Notion-Kriterien-DB wieder eingebaut. Die Step-Definition in `data/loesungsfinder.ts` bleibt für spätere Reaktivierung erhalten, wird aber im `ProduktfinderWizard` nicht gerendert.
- Öffentliche, vereinfachte Variante (Phase 2)

---

## 3. Architektur

```
┌──────────────┐   ┌──────────────────────┐   ┌──────────────────────────────────┐
│   📒 Notion  │ → │  📄 Contract         │ → │  🖥 /produktfinder               │
│              │   │  matrix.generated.ts │   │                                  │
│ 3 DBs:       │   │  + berechneKandidaten│   │  ┌──────────┐  ┌───────────────┐ │
│ - Produkte   │   │                      │   │  │ Expert   │  │ Geführt       │ │
│ - Kriterien  │   │  (Sync geparkt)      │   │  │ Default  │  │ 3-Step Wizard │ │
│ - Eignungen  │   │                      │   │  │ Chips    │  │ + Referenzen  │ │
└──────────────┘   └──────────────────────┘   │  └──────────┘  └───────────────┘ │
                                              └──────────────────────────────────┘
```

### Prinzipien
- **Single Source of Truth in Notion** — keine manuellen `eignungen`-Arrays in `produkte.ts`.
- **Contract in der Mitte** — die App kennt nur `matrix.generated.ts`. Austauschbares Sync-Script.
- **Ein Scoring, zwei Modi** — konsistente Ergebnisse, keine Logik-Duplikation.
- **Keine Breaking Changes für andere App-Teile** — Produktseiten, Referenzseiten, Suche unberührt.

---

## 4. Notion-Schema

### DB 1 — Produkte

| Property            | Typ                                         |
|---------------------|---------------------------------------------|
| **Name**            | Title                                       |
| ID / Slug           | Text (unique, z. B. `neodur-he-60-rapid`)  |
| Kategorie           | Select (Estrich, Schnellzement, …)          |
| Kurzbeschreibung    | Text                                        |
| Bild-URL            | Files / URL                                 |
| TDS-URL             | URL                                         |
| Status              | Select (Entwurf, aktiv, archiviert)         |
| ↔ Eignungen         | Relation → DB 3                             |

Technische Daten, Normen, Verarbeitung bleiben vorerst in `produkte.ts`. Konvergenz in Folge-Spec.

### DB 2 — Kriterien

| Property            | Typ                                         |
|---------------------|---------------------------------------------|
| **Label DE**        | Title                                       |
| Key                 | Text (z. B. `schwerlast`)                   |
| Gruppe              | Select (Belastung, Sonderbedingung)         |
| Label EN / FR / PL  | Text × 3                                    |
| Beschreibung DE     | Text                                        |
| Icon                | Text (Emoji oder Icon-Key)                  |
| Reihenfolge         | Number                                      |
| Status              | Select (aktiv, entwurf)                     |
| ↔ Eignungen         | Relation → DB 3                             |

Maßnahme ist kein Kriterium — sie ist Attribut jeder Eignung und Toggle in der UI.

### DB 3 — Eignungen (Junction, Herzstück)

| Property            | Typ                                         | Zweck                                           |
|---------------------|---------------------------------------------|-------------------------------------------------|
| **Titel**           | Title (Formel)                              | "Produkt × Kriterium × Maßnahme" automatisch    |
| ↔ Produkt           | Relation → DB 1 (genau 1)                   |                                                 |
| ↔ Kriterium         | Relation → DB 2 (genau 1)                   |                                                 |
| Maßnahme            | Select (reparatur, sanierung)               | Filtert per Toggle — exakt zwei Einträge pro (Produkt, Kriterium) |
| **Bewertung**       | Select: `×××`, `××`, `×`, `+`, `++`, `+++`  | 6-Stufen-Qualifizierung                         |
| Notiz               | Text                                        | „Warum?" — Rückfluss aus Gesprächen             |
| Quelle / Referenz   | Text                                        | Projekt, TDS-Nummer, Kollegen-Name              |
| Letzte Bestätigung  | Date                                        | Für „veraltet?"-Prüfung                         |

**Junction-Anzahl bei Start:** ~17 Produkte × 9 Kriterien × 2 Maßnahmen ≈ 306 Einträge. Seed-Script generiert initial konservativ (Rating `+` wenn heutige `eignungen`-Liste enthält, sonst leer). Feinjustierung im Team in Notion.

---

## 5. Daten-Contract (`data/matrix.generated.ts`)

```ts
export type Rating = "×××" | "××" | "×" | "+" | "++" | "+++";
export type Massnahme = "reparatur" | "sanierung";
export type KriteriumGruppe = "belastung" | "sonderbedingung";

export interface MatrixKriterium {
  key: string;
  gruppe: KriteriumGruppe;
  reihenfolge: number;
  labels: { de: string; en: string; fr: string; pl: string };
  beschreibung?: { de: string; en: string; fr: string; pl: string };
  icon?: string;
}

export interface MatrixProdukt {
  id: string;
  name: string;
  kategorie: string;
  bild?: string;
  tdsUrl?: string;
}

export interface MatrixEignung {
  produktId: string;
  kriteriumKey: string;
  massnahme: Massnahme;
  rating: Rating;
  notiz?: string;
  quelle?: string;
  bestaetigtAm?: string;          // ISO date
}

export const matrixProdukte: MatrixProdukt[] = [ /* generated */ ];
export const matrixKriterien: MatrixKriterium[] = [ /* generated */ ];
export const matrixEignungen: MatrixEignung[] = [ /* generated */ ];

export const generiertAm = "2026-04-17T14:32:00Z";
```

### Entscheidungen
- **Drei flache Arrays** — spiegelt Notion. Joins macht der Consumer mit Maps in O(1).
- **Rating als String-Union mit `×`-Unicode-Zeichen** — Werte stimmen 1:1 mit Notion-Select-Optionen überein, Sync-Script kopiert ohne Mapping.
- **Massnahme als eigenes Feld** in der Eignung — Toggle-Filter ist ein `Array.filter`.
- **Labels als Sprachen-Objekt pro Kriterium** — keine i18n-JSONs mehr für Matrix-Labels.

---

## 6. Scoring (`berechneKandidaten`)

```ts
export interface KandidatenInput {
  criteria: string[];           // ["schwerlast", "chemikalien", "kurze-sperrzeit"]
  massnahme: Massnahme;
}

export interface ProduktKandidat {
  produkt: MatrixProdukt;
  scorePerKriterium: Record<string, Rating | null>;  // null = nicht bewertet
  minRating: number;            // -3 (×××) … +3 (+++), null ausgenommen
  summeRating: number;
  tauglich: boolean;            // alle ausgewählten Kriterien ≥ 0 und kein null
}

export function berechneKandidaten(input: KandidatenInput): ProduktKandidat[];
```

### Algorithmus
1. Für jedes Produkt: lookup `MatrixEignung` pro selected criterion für die gewählte Maßnahme.
2. Map Rating auf Zahl: `+++ = 3, ++ = 2, + = 1, × = -1, ×× = -2, ××× = -3, leer = null`.
3. **`tauglich` = true** wenn alle ausgewählten Kriterien ein nicht-negatives Rating haben (kein `×`, kein leer).
4. Sortierung:
   1. `tauglich === true` vor `tauglich === false`
   2. Innerhalb: `minRating` absteigend (konservativ: schwächstes Glied ranken)
   3. Tiebreaker: `summeRating` absteigend
5. Return alle Produkte; UI blendet „Weitere mit Einschränkungen" optional ein.

### Entscheidungen
- **Minimum vor Summe** — schützt vor Produkten, die stark an vielen Kriterien sind, aber schwach am kritischen. „Schwächstes Glied zählt" ist die richtige Heuristik.
- **Leer ≠ neutral** — unbewertete Kriterien schließen aus `tauglich` aus. Transparenz: „wir wissen es nicht" ist kein Freibrief.
- **Kein Gewichten nach Gruppe** in Phase 1. Spätere Gewichtung ist Zukunfts-Erweiterung.

---

## 7. UI — Modi

### 7.1 Seite und Modus-Toggle
- Route: `/produktfinder`
- Oben: Seitentitel + Intro-Text (aus Dictionary)
- Modus-Toggle als Segmented Control: **„Expert"** (Default in Phase 1) | **„Geführt"**
- Toggle-Zustand in URL-Param `?modus=gefuehrt` persistiert (Expert ist Default, daher kein Param)
- Phase 2 (Public-Shift): Default kann auf „Geführt" zurückschalten — reine Konfigurationsänderung

### 7.2 Modus „Geführt" (Wizard)
- Struktur: **3 Steps** (Situation → Belastung → Sonderbedingung), Fortschrittsanzeige
- Ergebnisseite zeigt:
  1. **Produkt-Kandidaten** (Top 5) — aus `berechneKandidaten`
  2. **Referenzprojekte** (Top 5) — aus `berechneErgebnisse` (existierendes Scoring, Zustand-Tags werden als leer übergeben)
- Wechsel zu Expert bleibt jederzeit möglich

### 7.3 Modus „Expert" (V2)
- Maßnahme-Toggle (Sanierung/Reparatur) unter Modus-Toggle
- **Chip-Filter** — gruppiert in „Belastung" und „Sonderbedingung", klickbare Chips
- **Kandidatenliste** — live aktualisiert
  - Oben: tauglich, sortiert nach Min-Rating + Summe
  - Collapsible Sektion „Mit Einschränkungen": nicht-tauglich
- Kandidat als Card: Name (Link), Kurzbeschreibung, Rating pro ausgewähltem Kriterium, TDS-Link
- **Hover/Tap auf Rating** → Tooltip mit `notiz`, `quelle`, `bestaetigtAm`
- **Keine Referenzprojekte-Sektion** — Expert bleibt fokussiert auf Kandidatenliste (Referenzen sind im Wizard für Einsteiger)
- **„Stand"-Datum** oben rechts aus `generiertAm`

### 7.4 Leere Zustände
- Expert, keine Chips: Hinweis „Wähle Anforderungen oben" + vollständige Produktliste (unsortiert)
- Keine tauglichen Kandidaten: „Kein Produkt erfüllt alle Kriterien vollständig — schau dir die Einschränkungen an"
- Sprachen: aus `matrixKriterien[x].labels[lang]`

---

## 8. Integration & Migration

### Berührpunkte

| Datei / Modul                         | Änderung                                                             | Risiko   |
|---------------------------------------|----------------------------------------------------------------------|----------|
| `app/[lang]/produktfinder/page.tsx`   | Neu — hostet beide Modi, behandelt Modus-URL-Param                   | isoliert |
| `app/[lang]/produktmatrix/page.tsx`   | 301-Redirect auf `/produktfinder`                                    | gering   |
| `app/[lang]/loesungsfinder/page.tsx`  | 301-Redirect auf `/produktfinder`                                    | gering   |
| `components/ProduktfinderWizard.tsx`  | Neu — verpackt heutige Schritt-Komponenten, ruft `berechneKandidaten` | mittel  |
| `components/ProduktfinderExpert.tsx`  | Neu — Chip-Filter + Kandidatenliste (V2)                              | isoliert |
| `components/Produktmatrix.tsx`        | Entfernt                                                              | gering   |
| `data/matrix.generated.ts`            | Neu — Typen, Daten, `berechneKandidaten`                              | isoliert |
| `data/loesungsfinder.ts`              | Referenz-Scoring `berechneErgebnisse` bleibt. Step-Definitionen bleiben (step3 Zustand wird in Phase 1 nicht gerendert, bleibt aber für spätere Reaktivierung). | gering |
| `data/produkte.ts`                    | `eignungen`-Feld `@deprecated`, bleibt zunächst                       | gering   |
| `dictionaries/*.json`                 | Matrix-Spalten-Keys entfernen, „Produktfinder"-Labels ergänzen        | mittel   |
| `scripts/seed-matrix.ts`              | Neu — generiert initiale `matrix.generated.ts` aus `produkte.ts`      | isoliert |
| `components/TopNav.tsx`, Footer-Links | Verlinkung auf `/produktfinder`                                       | gering   |

### Migrationsschritte
1. Contract + Scoring in `matrix.generated.ts` (leer), Types definieren, `berechneKandidaten` implementieren + Unit-Test.
2. Seed-Script `scripts/seed-matrix.ts`: liest `produkte.ts`, erzeugt Start-Belegung, Snapshot-Test.
3. `ProduktfinderExpert.tsx` gegen Seed-Daten bauen.
4. `ProduktfinderWizard.tsx` als Wrapper über bestehende Step-Komponenten, Ergebnisseite erweitert.
5. Gemeinsame Seite `app/[lang]/produktfinder/page.tsx` mit Modus-Toggle.
6. 301-Redirects (`next.config.ts`).
7. Navigation, Footer, interne Links aktualisieren.
8. Dictionaries aufräumen.
9. Notion-DBs nach Schema anlegen, 3 Beispiel-Produkte manuell befüllen.
10. Seed-Script auf Notion-API umbauen (Folge-Spec).

---

## 9. Tests
- **`berechneKandidaten`**: Unit-Tests mit Mini-Contract (3 Produkte, 3 Kriterien, 2 Maßnahmen). Prüft Sortierlogik, `tauglich`-Grenze, Verhalten bei leeren Ratings.
- **`ProduktfinderExpert`**: Rendering-Test — Chips toggeln aktualisiert Kandidaten, „Mit Einschränkungen"-Sektion nur bei Bedarf, Tooltip zeigt Notiz.
- **`ProduktfinderWizard`**: Ergänzt um Produkt-Kandidaten-Sektion auf der Ergebnisseite.
- **Seed-Script**: Snapshot-Test auf generierten Output.
- **Contract**: TypeScript-Union fängt Rating-Tippfehler by construction.
- **Redirects**: E2E- oder Middleware-Test, dass `/produktmatrix` und `/loesungsfinder` auf `/produktfinder` redirecten.

---

## 10. Success-Kriterien
- Vertriebs-Szenario in ≤ 5 Sekunden: 3 Chips klicken, Top-Kandidat sichtbar.
- Geführter Modus liefert identische UX wie heute (Regressionstest); Produkt-Kandidaten zusätzlich sichtbar.
- Alte URLs redirecten zuverlässig, keine 404.
- Alle 6 Rating-Stufen darstellbar, Tooltip mit Notion-Notizen funktioniert.
- Notion-Schema manuell mit 3 Produkten validiert, Import ins Contract reproduzierbar.
- Keine Breaking Changes für Produktdetailseiten, Referenzen, Suche.

---

## 11. Geparkt (eigene Folge-Specs)
- **Sync-Script gegen Notion-API** — manueller Trigger + CI-Build-Hook, Fehlerbehandlung.
- **Bodenzustand als Kriterium** — nach Team-Klärung; Step-Definition bleibt vorhanden, Reaktivierung sobald Kriterien-DB in Notion ergänzt ist. Wirkt dann sowohl auf Produkt- als auch auf Referenz-Scoring.
- **Gewichtetes Scoring** — Kriterien mit unterschiedlichem Gewicht.
- **Modus 3: „Übersicht" (Tabelle)** — falls Bedarf für „alle Produkte × alle Kriterien auf einen Blick" entsteht.
- **Öffentliche Phase-2-Sicht** — vereinfachte Darstellung (3 Stufen, keine Notizen) für Endkunden.
- **Konvergenz `produkte.ts` → Notion** — Migration der Produktstammdaten.
- **Payload-Brücke** — Notion → Payload für Website-Relaunch.
