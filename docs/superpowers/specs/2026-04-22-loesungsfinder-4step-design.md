# Lösungsfinder — 4-Step-Wizard mit Referenz-primärer Ergebnislogik

**Stand:** 2026-04-22
**Status:** Design — freigegeben zur Planungsphase
**Autorin:** Steffi (Applied AI Manager, KORODUR) + Claude Code
**Bezug:** KORODUR-Sanierung_app (V2.3) — Nachfolger von `2026-04-17-produktfinder-design.md`

> **Warum diese Revision?** Nach Experten-Abstimmung bei KORODUR hat sich das Zielbild verschoben: Der Lösungsfinder soll **primär Referenzen** (ähnliche Sanierungsprojekte) zeigen — Produkte ergeben sich aus „wurde dort verbaut". Das verschlankt das Datenmodell erheblich: die 6-stufige Produkt-Rating-Matrix aus der 17.-April-Spec ist nicht mehr nötig. Zusätzlich werden die Dimensionen neu gefasst (Anwendungsbereich statt Belastung, Zeit als eigener Step, Zustand entfällt), und der Expert-Modus entfällt in Phase 1.

---

## Executive Summary

Der Lösungsfinder wird ein **4-Step-Wizard** mit Referenzen als Primär-Output. Nutzer wählen Sanierungsart → Anwendungsbereich → Zeit-Dringlichkeit → Zusatzfunktionen. Die Ergebnisseite zeigt ähnliche Sanierungsprojekte als Karten-Grid, darunter aggregierte Produkte aus diesen Referenzen. Produkte werden nicht direkt gerankt, sondern über ihre Referenz-Einbettung sichtbar.

**Datenmodell-Shift:** Referenzen bekommen Tags in vier Dimensionen, Produkte bekommen wenige neue Attribute (v. a. `zeit_kategorie`). Keine Junction-DB, keine 6-stufige Rating-Skala in Phase 1.

**Strategisch:** Der Lösungsfinder ist in Phase 1 das einzige Front-Tool. Expert-Modus (freier Chip-Filter mit Live-Kandidatenliste) wird nach Fertigstellung re-evaluiert — nicht verworfen, aber zurückgestellt, bis die Datenbasis steht.

**Phase 1 = internes Tool + öffentliches Informationsmittel:** Keine Duplikation mit der Produktmatrix — `/produktmatrix` bleibt vorerst unverändert bestehen, die in der 17.-April-Spec geplante Zusammenführung zu `/produktfinder` wird geparkt.

---

## 1. Ausgangslage

### Was sich gegenüber der 17.-April-Spec ändert

| Aspekt | 17.-April-Spec | Diese Spec (22.-April) |
|---|---|---|
| Primär-Output | Produkt-Kandidaten (direkt gerankt) | **Referenzen** (Produkte abgeleitet) |
| Route | `/produktfinder` (merged mit Matrix) | `/loesungsfinder` bleibt eigenständig; Matrix-Merge geparkt |
| Modi | Expert (Chips) + Geführt (Wizard) | **Nur Wizard** in Phase 1; Expert geparkt |
| Steps | 3 (Situation · Belastung · Sonderbedingung) | **4** (Sanierungsart · Anwendungsbereich · Zeit · Zusatzfunktion) |
| Zustand-Dimension | Geparkt im Code | **Komplett entfernt** |
| Rating-Skala | 6-stufig (×××…+++) | **Binär an Referenzen** + 3-stufiges `zeit_kategorie`-Enum an Produkten |
| Notion-Schema | 3 DBs (Produkte × Kriterien × Eignungen, Junction) | Zwei einfache DBs (Produkte, Referenzen) mit Multi-Select-Feldern — **keine Junction** in Phase 1 |
| Scoring | Minimum-Rule über Produkt-Ratings | **Gewichteter Additiv-Score auf Referenzen** |

### Warum Referenz-primär

Der Expertengespräch-Befund: Nutzer (sowohl Kunde als auch Vertrieb) wollen zuerst sehen *„wer hat so was schon mal gemacht"* — die Referenz trägt die Glaubwürdigkeit. Aus der Referenz wird das Produkt abgeleitet („bei dem ähnlichen Projekt wurde X verwendet"). Das deckt sich mit dem heutigen `berechneErgebnisse`-Verhalten, nur mit besseren Dimensionen.

Ein direktes Produkt-Rating (17.-April-Modell) wäre redundant, weil: (a) die gleichen Dimensionen bereits an Referenzen liegen, und (b) die Produkt-Einbettung in Referenzen das Signal trägt.

---

## 2. Entscheidungen

### 2.1 Route und Scope
- Bestehende Route `/loesungsfinder` bleibt, Inhalt wird ersetzt.
- `/produktmatrix` bleibt unangetastet — keine Änderung der 17.-April-Merge-Strategie in Phase 1.
- Kein Redirect, keine neue Route.

### 2.2 Wizard-Struktur — 4 Steps

**Step 1 — Sanierungsart** (single-choice, harter Filter)

| ID | Label | Subtext |
|---|---|---|
| `punktuell` | Punktuelle Sanierung | Kosmetische oder funktionale Reparaturen wichtiger Flächen (Boden, Wand, Decke) |
| `grossflaechig` | Großflächige Sanierung | Sanierungsmaßnahmen, meist bei Restrukturierung, Modernisierung, Umnutzung oder energetischer Sanierung |

Harter Filter: Referenzen mit abweichender `sanierungsart` werden ausgeschlossen. Begründung: Produktklassen unterscheiden sich grundlegend (Schnellmörtel vs. Estriche) — Vermischung verwirrt.

**Step 2 — Anwendungsbereich** (multi-choice, weicher Score, +3 pro Match)

8 Optionen (Wording final mit Kollegen zu prüfen):

1. Lager & Logistik
2. Industrie- & Produktionshalle
3. Lebensmittel
4. Flugzeug (Hangar, Landebahn)
5. Parkdeck / Parkhäuser / Tiefgarage
6. Infrastruktur & Zufahrten
7. Verkaufsräume
8. Schwerindustrie (z. B. Entsorgung, Kettenfahrzeuge)

Jede Referenz kann mehrere Anwendungsbereiche tragen (Multi-Select). Binäre Zuordnung (passt / passt nicht), keine Graduierung.

**Step 3 — Zeit-Dringlichkeit** (single-choice, hierarchischer Soft-Match, +2 bei Match)

| Nutzer-Auswahl | Semantik | Referenz-/Produkt-Tag |
|---|---|---|
| Super dringlich | Fläche muss schnell wieder belastbar sein | `schnell` |
| Enger Zeitplan | Zügig, aber nicht akut | `mittel` |
| Keine Zeitbegrenzung | Zeit spielt keine Rolle | `normal` |

**Hierarchische Matching-Regel:** `schnell ⊂ mittel ⊂ normal`. Wählt der Nutzer „mittel", matchen Referenzen mit Tag `schnell` oder `mittel`. Wählt er „normal", matchen alle. Begründung: Ein schnellaushärtendes Produkt erfüllt auch eine mittlere Zeitanforderung mit Reserve.

**Step 4 — Zusatzfunktion / Oberflächenbehandlung** (multi-choice, weicher Score, +2 pro Match)

Startpunkt-Optionen (Finalisierung mit Experten):
- Chemikalienbeständigkeit
- Tausalzbeständigkeit
- Rutschhemmung
- Fleckenabwehr
- (weitere TBD)

**Hybrid-Modell:** Eine Zusatzfunktion kann entweder vom Basis-Produkt kommen (z. B. inhärente Chemikalienbeständigkeit) oder von einer separaten Oberflächenbehandlung (eigenständiges Topping-Produkt wie eine Versiegelung). Die Zuordnung „woher kommt die Funktion" ist Aufgabe der Produktdaten-Pflege (Experten-Abstimmung).

### 2.3 Scoring-Regeln

```
total_score(referenz) =
  IF referenz.sanierungsart != user.sanierungsart → EXCLUDED
  ELSE:
    + 3 × |anwendungsbereiche ∩ user.anwendungsbereiche|
    + 2 × IF matched_by_zeit_hierarchie THEN 1 ELSE 0
    + 2 × |zusatzfunktionen ∩ user.zusatzfunktionen|
```

- Gewichte **3 / 2 / 2** als Heuristik — nach ersten echten Ergebnissen nachjustierbar.
- Sortierung: Score absteigend; Tiebreaker: Datum absteigend (jüngere Referenz vorn).
- Anzeige: Top 5 direkt sichtbar, „weitere anzeigen" für den Rest.

### 2.4 Empty-States

- **Kein Sanierungsart-Match:** „Keine Referenzen für diese Sanierungsart. Kontaktieren Sie unser Team oder ändern Sie Ihre Auswahl."
- **Score = 0 für alle Sanierungsart-Treffer:** Alle Sanierungsart-Treffer anzeigen, sortiert nach Datum, mit Hinweis „Wir haben keine exakte Übereinstimmung — hier sind ähnliche Projekte."

### 2.5 Produkt-Aggregation

Aus den Top-5-Referenzen werden alle eingesetzten Produkte eingesammelt. Sortierung nach Häufigkeit („in X von 5 Referenzen"). Jede Zeile verlinkt auf die Produktdetailseite.

### 2.6 Out-of-Scope (Phase 1)

- **Expert-Modus** — Chip-Filter mit Live-Kandidatenliste. Nach Phase 1 re-evaluieren. Datenmodell so bauen, dass Expert später mit denselben Daten lauffähig ist.
- **Zustand-Dimension** (Risse, Abrieb, Hohlstellen, Beschichtungsschäden, Ebenheitsprobleme) — komplett aus Wizard und Datenmodell entfernt.
- **6-stufige Rating-Skala** für Produkte.
- **Notion-Junction-DB** (Produkt × Kriterium × Eignung).
- **Merge mit Produktmatrix** — 17.-April-Idee einer gemeinsamen Route `/produktfinder` geparkt.
- **Direktes Produkt-Rating pro Anwendungsbereich** — wird über Referenz-Einbettung indirekt abgedeckt.

---

## 3. Architektur

```
┌──────────────┐   ┌──────────────────────┐   ┌──────────────────────────────┐
│   📒 Notion  │ → │  📄 data/            │ → │  🖥 /loesungsfinder          │
│              │   │  - referenzen.ts     │   │                              │
│ 2 DBs:       │   │  - produkte.ts       │   │  4-Step-Wizard               │
│ - Produkte   │   │  - loesungsfinder.ts │   │  Referenzen primär           │
│ - Referenzen │   │    (Scoring)         │   │  Produkte aggregiert         │
└──────────────┘   └──────────────────────┘   └──────────────────────────────┘
```

### Prinzipien
- **Referenzen als Primär-Entität der Suche** — alle vier Dimensionen tragen Tags auf Referenzen.
- **Produkte sind Attributträger** für eigenständige Filter-Kriterien (v. a. `zeit_kategorie`), werden aber nicht direkt gerankt.
- **Notion bleibt Source of Truth**, synchronisiert in `data/`-Dateien (Sync-Mechanik in Folge-Spec).
- **Keine Breaking Changes** für Produktseiten, Referenzseiten, Suche.

---

## 4. Datenmodell

### 4.1 Referenz (`data/referenzen.ts`)

Neue Felder (multi-select / enum), alte werden deprecated:

```ts
export interface Referenz {
  // bestehende Felder (Titel, Bild, Datum, …) bleiben
  id: string;
  titel: string;
  // …

  // NEU
  sanierungsart: "punktuell" | "grossflaechig";
  anwendungsbereiche: Anwendungsbereich[];        // multi
  zeit_dringlichkeit: ZeitKategorie;              // single
  zusatzfunktionen: Zusatzfunktion[];             // multi

  // eingesetzte Produkte (bleibt)
  produkte: string[];                             // Produkt-Namen oder -IDs

  // DEPRECATED — werden aus produkte.ts-Struktur und alten Referenzdaten migriert:
  // massnahme, belastungen[], zustand[], sonderbedingungen[]
}

export type Anwendungsbereich =
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
  // weitere TBD mit Experten
```

### 4.2 Produkt (`data/produkte.ts`)

Minimale Erweiterung. Bestehende Produktdaten bleiben.

```ts
export interface Produkt {
  // bestehende Felder (Name, Kategorie, Beschreibung, TDS, …) bleiben

  // NEU
  zeit_kategorie: ZeitKategorie;                  // schnell | mittel | normal
  zusatzfunktionen?: Zusatzfunktion[];            // für Oberflächenbehandlungen / inhärente Eigenschaften

  // DEPRECATED
  // eignungen?: (Belastung | Sonderbedingung | Massnahme)[];
}
```

### 4.3 Notion

- **DB „Produkte"**: bestehende Pflegefläche erweitert um `Zeit-Kategorie` (Select), `Zusatzfunktionen` (Multi-Select).
- **DB „Referenzen"**: erweitert um `Sanierungsart` (Select), `Anwendungsbereiche` (Multi-Select), `Zeit-Dringlichkeit` (Select), `Zusatzfunktionen` (Multi-Select).
- **Keine Junction-DB**, keine Eignungs-Matrix.
- Sync-Mechanik Notion ↔ `data/`-Dateien in Folge-Spec (manuelles Script oder CI-Hook).

### 4.4 Scoring (`data/loesungsfinder.ts`)

Bestehende Funktion `berechneErgebnisse` wird durch neue Version ersetzt, die auf den neuen Dimensionen operiert. Signatur bleibt konzeptionell ähnlich (Input: User-Auswahl, Output: sortierte Referenzen + aggregierte Produkte).

```ts
export interface UserAuswahl {
  sanierungsart: "punktuell" | "grossflaechig";
  anwendungsbereiche: Anwendungsbereich[];
  zeit_dringlichkeit: ZeitKategorie;
  zusatzfunktionen: Zusatzfunktion[];
}

export interface LoesungsfinderErgebnis {
  referenzen: ScoredReferenz[];     // gefiltert + sortiert, Top-N + weitere
  produkte: AggregiertesProdukt[];  // aus Top-N eingesammelt
}

export interface AggregiertesProdukt {
  produkt: Produkt;
  anzahlEinsaetze: number;          // in wie vielen der Top-N Referenzen
  referenzen: string[];             // Referenz-IDs
}

export function berechneErgebnisse(auswahl: UserAuswahl): LoesungsfinderErgebnis;
```

---

## 5. UX — Wizard und Ergebnisseite

### 5.1 Wizard-Struktur

- 4 Steps mit Fortschrittsanzeige (1 von 4, 2 von 4, …)
- Jeder Step hat einen knappen erklärenden Subtext
- Zurück / Weiter jederzeit möglich
- Step 1: Single-Choice-Cards mit Subtext
- Step 2: 8 Multi-Select-Kacheln (Grid), Icons pro Bereich
- Step 3: 3 Single-Choice-Cards, Subtext erklärt Dringlichkeitsgrad
- Step 4: Multi-Select-Chips

### 5.2 Ergebnisseite

Layout (von oben nach unten):
1. **Auswahl-Zusammenfassung** als Chip-Zeile (inkl. „Filter anpassen"-Link)
2. **Referenz-Grid** — Top-5 Karten, jede mit: Projektbild, Titel, Kurzmeta (Jahr, Fläche, Sanierungsart), Tag-Zeile, verbaute Produkte
3. **„Weitere Referenzen anzeigen"** — Collapsible für Rest der gefundenen Referenzen
4. **Aggregierte Produktliste** — Produktname · Häufigkeit („in X von 5 Referenzen") · Link zum Produkt

Jede Referenz-Karte ist klickbar → navigiert zur Referenzdetailseite.

---

## 6. Migration und Integration

### Berührpunkte

| Datei / Modul | Änderung | Risiko |
|---|---|---|
| `data/referenzen.ts` | Schema-Erweiterung (4 neue Felder), Re-Tagging aller Bestands-Referenzen | **hoch** (größter Aufwand) |
| `data/produkte.ts` | Schema-Erweiterung (`zeit_kategorie`, `zusatzfunktionen`), alle Produkte taggen | mittel |
| `data/loesungsfinder.ts` | Komplett-Rewrite: neue Step-Definitionen, neues Scoring | mittel |
| `components/Loesungsfinder.tsx` | Step-Reduktion (4 statt 5), neue UI für Anwendungsbereich-Grid | mittel |
| `app/[lang]/loesungsfinder/page.tsx` | Metadaten-Korrektur (5→4 Schritte) | gering |
| `data/types.ts` | Neue Typen (`Anwendungsbereich`, `ZeitKategorie`, `Zusatzfunktion`), alte deprecaten | gering |
| Dictionaries (`dictionaries/*.json`) | Labels für neue Steps/Optionen | mittel |
| Notion DBs | Properties in „Produkte" und „Referenzen" erweitern | extern, manuell |

### Migrationsschritte

1. Notion: Properties in beiden DBs anlegen (Select/Multi-Select).
2. Notion: Alle bestehenden Produkte + Referenzen mit den neuen Feldern taggen (Experten-Workshop).
3. Sync-Script (oder manueller Export) → `data/referenzen.ts` und `data/produkte.ts` mit neuen Feldern füllen.
4. `data/loesungsfinder.ts` neu aufbauen (Step-Definitionen + `berechneErgebnisse`).
5. `components/Loesungsfinder.tsx` umbauen (4 Steps, neue Ergebnisseite).
6. Dictionaries erweitern, i18n-Labels für die 8 Anwendungsbereiche und 3 Zeit-Stufen.
7. Bestands-Felder (`belastungen`, `zustand`, `sonderbedingungen`, `eignungen`) deprecaten (nicht sofort löschen — Compat-Fenster für andere Consumers).
8. Tests (Unit für Scoring, Snapshot für Ergebnisseite).

---

## 7. Tests

- **`berechneErgebnisse`**: Unit-Tests mit Mini-Dataset (2 Sanierungsarten, 3 Anwendungsbereiche, 3 Zeitstufen, 2 Zusatzfunktionen, 5 Referenzen). Prüft: harter Filter, Scoring-Gewichte, Hierarchie-Matching bei Zeit, Sortierung, Tiebreaker.
- **`Loesungsfinder`-Component**: Integration-Test über alle 4 Steps, Ergebnisseite rendert korrekt.
- **Empty-States**: Test für „keine Sanierungsart-Treffer" und „Score 0 für alle".
- **Aggregation**: Test dass Produkte aus Top-N korrekt nach Häufigkeit sortiert werden.

---

## 8. Success-Kriterien

- Nutzer durchläuft 4 Steps in < 30 Sekunden, Ergebnisseite zeigt relevante Referenzen.
- Referenz-Sortierung ist nachvollziehbar (Score erklärbar, kein „Zufallsranking").
- Aggregierte Produktliste liefert das Top-Produkt für einen Anwendungsbereich konsistent (nicht jedes Mal andere Reihenfolge bei gleicher Eingabe).
- Kein Regress an Produktdetailseiten / Referenzdetailseiten / Suche.
- Alte Tags (`belastungen`, `zustand`, `sonderbedingungen`) können zurückgebaut werden, ohne andere App-Teile zu brechen.

---

## 9. Experten-Abstimmungsliste

Explizit als offene Punkte, bevor die Implementation finalisiert wird:

1. **Zeit-Schwellen scharf definieren** — Was genau heißt `schnell`? < 1 h? 1–3 h? (TDS-basierte Entscheidung mit Produktmanagement)
2. **Welche Basis-Produkte haben Chemikalienbeständigkeit inhärent, welche brauchen eine Versiegelung obendrauf?** TDS-Review.
3. **Step 4 Zusatzfunktions-Optionen finalisieren** — Startliste ist Chemikalienbeständigkeit, Tausalzbeständigkeit, Rutschhemmung, Fleckenabwehr. Ergänzen / umformulieren.
4. **Lebensmittel-Zertifizierung** — Attribut am Produkt (ja/nein) oder Tag im Anwendungsbereich? Wirkt sich auf Filter-Logik aus.
5. **Wordings finalisieren** — alle Step-Titel, Subtexte, Options-Labels.
6. **Zeit-Kategorie pro Produkt zuweisen** — Workshop mit Produktmanagement zum Einsortieren aller ~17 Produkte in `schnell`/`mittel`/`normal`.
7. **Re-Tagging aller Bestands-Referenzen** — Workshop mit Vertrieb/Referenzen-Pflege zum Füllen der neuen Felder.

---

## 10. Geparkt (eigene Folge-Specs)

- **Expert-Modus** — Reaktivierung nach Produktivsetzung Phase 1 auf Basis derselben Daten (kein neuer Datentyp).
- **Sync Notion → App** — Script oder CI-Hook für `referenzen.ts` / `produkte.ts`.
- **Merge mit `/produktmatrix`** — 17.-April-Zusammenführungs-Idee einer gemeinsamen `/produktfinder`-Route.
- **Zustand-Dimension** — Reaktivierung, falls Nutzer-Feedback sie vermisst.
- **Gewichtungs-Justierung** — Weights 3/2/2 nach ersten echten Nutzungsdaten neu kalibrieren.
- **Produkt-Empfehlungs-Kombi** („Basis + Topping") — explizite Kombinationsempfehlungen, wenn Zusatzfunktion durch separates Produkt erfüllt wird.
