# Produktmatrix — Logik, Datenmodell & System-Integration

**Stand:** 2026-04-17
**Status:** Design — zur Freigabe
**Autorin:** Steffi (Applied AI Manager, KORODUR) + Claude Code
**Bezug:** KORODUR-Sanierung_app (Sanierungs-App V2.3) — Website-Relaunch-Strategie (2026-04-17)

---

## Executive Summary

Die heutige Produktmatrix (`components/Produktmatrix.tsx`) mischt 11 Spalten gleichrangig (Maßnahme + Belastung + Sonderbedingung) und zeigt Treffer binär als blauen Punkt. Das schränkt die Beratungsqualität ein: Eine „bedingte" Eignung sieht aus wie ein voller Treffer, eine „ungeeignete" Kombination nicht von einer „nicht bewerteten" zu unterscheiden.

Diese Spec definiert einen Neuaufbau in drei Dimensionen:

1. **Hierarchische Struktur** — Maßnahme (Reparatur/Sanierung) wird Modus-Toggle oben, darunter schmalere Matrix mit Belastung + Sonderbedingung als Super-Header-Gruppen.
2. **6-stufige Qualifizierung** — ×××, ××, ×, +, ++, +++ ersetzt das binäre System. Leere Zelle bleibt „noch nicht bewertet".
3. **Notion als Single Source of Truth** — Produktwissen wandert in ein relationales 3-DB-Setup in Notion. Die App bekommt einen generierten TypeScript-Contract. Notion-Pflege wird zur gemeinsamen Arbeitsfläche mit dem Team, Erkenntnisse aus Gesprächen fließen strukturiert (Notiz, Quelle, Datum) in die Datenbank zurück.

Die Sync-Mechanik zwischen Notion und App wird in dieser Spec **nicht** entschieden — wir definieren nur den Contract. Sync, Bodenzustand-Dimension und Payload-Brücke sind separate Folge-Specs.

Strategisch passt das zum Website-Relaunch-Plan (Ansatz B aus der Stack-Strategie): Notion bleibt internes Produktwissens-Tool, Payload — wenn es kommt — wird der Web-Publisher, der aus Notion synct.

---

## 1. Ausgangslage

### Aktueller Stand der Matrix

- **Route:** `app/[lang]/produktmatrix/page.tsx`
- **Komponente:** `components/Produktmatrix.tsx` (~250 Zeilen)
- **Daten:** `data/produkte.ts` → Feld `eignungen?: (Belastung | Sonderbedingung | Massnahme)[]`
- **Struktur:** 11 Spalten nebeneinander (2 Maßnahmen + 4 Belastungen + 5 Sonderbedingungen)
- **Treffer:** binär — blauer Punkt (Eignung enthalten) oder leer
- **Gruppierung:** 5 Kategorien (Estriche, Schnellzemente & Mörtel, Grundierungen & Haftbrücken, Nachbehandlung, Sonstige) als aufklappbare Gruppen
- **Filter:** keine
- **Produkte:** ~17 (MICROTOP TW aktuell ausgeschlossen)

### Schmerzpunkte

- **A:** Gleichrangige Spaltenmischung aus Maßnahme + Belastung + Sonderbedingung ist strukturell unsauber und schwer zu scannen.
- **B:** Binäre Treffer tragen zu wenig Information für professionelle Entscheidungen. Ein „bedingt geeignet" ist nicht dasselbe wie „ideal".
- **C (geparkt):** Bodenzustand (Risse, Abrieb, Hohlstellen…) wird im Lösungsfinder abgefragt, taucht aber in der Matrix nicht auf. Relevanz für die Matrix unklar — Team-Klärung nötig.
- **D (geparkt):** Keine Dimensions-Filter — bei 11 Spalten schwer zu fokussieren.

### Strategischer Kontext

Die App soll sich vom „einfachen Renderer" zu einer Schicht in einem **Produktwissen-System** entwickeln: Notion pflegt das Wissen, die App rendert es, Gespräche und Erfahrungen fließen zurück nach Notion. Das macht die Matrix zur Arbeitsfläche mit Kollegen, nicht zum statischen Content-Feature.

---

## 2. Entscheidungen

### 2.1 CMS-Strategie

**Notion = interner Source of Truth für Produktwissen. Payload (geplant für Website-Relaunch) importiert/synct später aus Notion.** Keine Notion-auf-Website-Live-Anbindung.

### 2.2 Sync-Mechanik

**Geparkt.** Für diese Spec genügt ein Daten-Contract (`data/matrix.generated.ts`) — wie er gefüllt wird (manuelles Script, CI-Build-Hook, Hybrid), entscheidet eine Folge-Spec. Bevorzugte Ziel-Richtung: Hybrid — manuelles Script existiert und wird im Pre-Build-Hook zusätzlich aufgerufen.

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

**Leere Zelle** = noch nicht bewertet. Bewusste Trennung von „×××" (bewertet, aber ungeeignet).

### 2.4 Dimensions-Hierarchie

**Maßnahme als Modus-Toggle oben**, darunter schmalere Matrix mit Belastung + Sonderbedingung als **Super-Header-Gruppen**. Maßnahme ist kein Kriterium, sondern Attribut jeder Eignung — ein Produkt kann „für Reparatur ××, für Sanierung +++" sein. Dimensions-Filter (C aus Schmerzpunkten) kommt in einer Folge-Spec.

### 2.5 Notion-Datenmodell

**Vollrelational, drei Datenbanken:** Produkte × Kriterien × Eignungen (Junction). Siehe Schema unten.

---

## 3. Architektur

```
┌──────────────┐   ┌────────────────┐   ┌──────────────────────┐   ┌──────────────────┐
│   📒 Notion  │ → │  🔄 Sync       │ → │  📄 Generated Data   │ → │  🖥 Matrix       │
│              │   │     (geparkt)  │   │  matrix.generated.ts │   │     Komponente   │
│ 3 DBs:       │   │                │   │                      │   │                  │
│ - Produkte   │   │ - Notion API   │   │ - flat arrays        │   │ - Toggle         │
│ - Kriterien  │   │ - Join         │   │ - typed (Rating)     │   │ - 6-Stufen-Cells │
│ - Eignungen  │   │ - Validate     │   │ - i18n Labels        │   │ - (Filter später)│
└──────────────┘   └────────────────┘   └──────────────────────┘   └──────────────────┘
```

### Prinzipien

- **Single Source of Truth in Notion** — keine manuell gepflegten `eignungen`-Arrays in `produkte.ts` mehr.
- **Contract in der Mitte** — die App kennt nur `matrix.generated.ts`, nicht Notion. Die Matrix-Komponente ist testbar ohne Notion-Zugang.
- **Sync-Script ist austauschbar** — ob manuell, CI-getrieben oder hybrid, der Contract bleibt stabil.
- **Keine Breaking Changes für andere App-Teile** — `produkte.ts` bleibt für Produktseiten zuständig. Matrix nutzt `matrix.generated.ts` zusätzlich. Konvergenz später.

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

Technische Daten, Normen, Verarbeitung bleiben vorerst in `produkte.ts` — Scope dieser Spec ist ausschließlich Matrix.

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

Maßnahme ist bewusst **kein** Kriterium — sie ist Modus, nicht Spalte.

### DB 3 — Eignungen (Junction, Herzstück)

| Property            | Typ                                         | Zweck                                           |
|---------------------|---------------------------------------------|-------------------------------------------------|
| **Titel**           | Title (Formel)                              | "Produkt × Kriterium × Maßnahme" automatisch    |
| ↔ Produkt           | Relation → DB 1 (genau 1)                   |                                                 |
| ↔ Kriterium         | Relation → DB 2 (genau 1)                   |                                                 |
| Maßnahme            | Select (reparatur, sanierung, beide)        | Toggle-Filter in UI                             |
| **Bewertung**       | Select: `×××`, `××`, `×`, `+`, `++`, `+++`  | 6-Stufen-Qualifizierung                         |
| Notiz               | Text                                        | „Warum?" — Rückfluss aus Gesprächen             |
| Quelle / Referenz   | Text                                        | Projekt, TDS-Nummer, Kollegen-Name              |
| Letzte Bestätigung  | Date                                        | Für „veraltet?"-Prüfung                         |

**Junction-Anzahl bei Start:** ~17 Produkte × 9 Kriterien × 2 Maßnahmen = ~306 Einträge. Seed-Script generiert initial aus heutigen `eignungen`-Arrays (konservatives Start-Rating „+" wenn enthalten, leer wenn nicht). Feinjustierung im Team in Notion.

---

## 5. Daten-Contract (`data/matrix.generated.ts`)

```ts
export type Rating = "×××" | "××" | "×" | "+" | "++" | "+++";
export type Massnahme = "reparatur" | "sanierung";
export type KriteriumGruppe = "belastung" | "sonderbedingung";

export interface MatrixKriterium {
  key: string;                    // "schwerlast"
  gruppe: KriteriumGruppe;
  reihenfolge: number;
  labels: { de: string; en: string; fr: string; pl: string };
  beschreibung?: { de: string; en: string; fr: string; pl: string };
  icon?: string;
}

export interface MatrixProdukt {
  id: string;                     // "neodur-he-60-rapid"
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

- **Drei flache Arrays, keine verschachtelte Struktur** — spiegelt Notion-Modell. Joins erledigt die Matrix-Komponente mit Maps in O(1).
- **Rating als String-Union mit `×`-Unicode-Zeichen** — TypeScript erzwingt das Vokabular app-seitig, Tippfehler by construction ausgeschlossen. Die Werte stimmen 1:1 mit den Notion-Select-Optionen überein; das Sync-Script kopiert ohne Mapping.
- **Massnahme als separates Feld** — Toggle filtert trivial (`eignungen.filter(e => e.massnahme === aktiveMassnahme)`).
- **Labels als Sprachen-Objekt pro Kriterium** — Matrix-Komponente wählt `labels[lang]`. Keine i18n-JSONs mehr für Matrix-Labels.
- **`generiertAm`-Stempel** — für Debugging und „Stand"-Anzeige im UI.

---

## 6. Matrix-Komponente — Verhalten

### Layout

- **Maßnahme-Toggle oben** — Default „Sanierung" (häufigerer Fall). Wechsel filtert `matrixEignungen` client-side, kein Reload.
- **Super-Header** Gruppe (Belastung | Sonderbedingung) mit dünnem Trenner zwischen den Gruppen.
- **Kategorien-Gruppen** bleiben aufklappbar wie heute (Estriche, Schnellzemente, …). Default: erste 2 offen.
- **Produktname** ist Link zur Produktdetailseite.
- **Zellen** zeigen Rating als farbiges Symbol: `+++`, `++`, `+` in Blau (#009ee3), `×`, `××`, `×××` in Rot (#b00020). Leer = nicht bewertet.
- **Hover auf Bewertung** → Tooltip mit `notiz` falls vorhanden. Mobile: Tap.
- **Legende** dauerhaft sichtbar unter der Tabelle.
- **Stand-Datum** oben rechts aus `generiertAm`.
- **Horizontal scrollbar** auf Mobile — durch schmalere Matrix seltener nötig.

### Aus-Scope

- Dimensions-Filter (C aus Schmerzpunkten) — Folge-Spec.
- Persistierter UI-State (welche Kategorien offen) — nice-to-have.
- Vergleichs-Modus (2 Produkte nebeneinander) — eigene Feature-Idee.

---

## 7. Integration & Migration

### Berührpunkte

| Datei / Modul                         | Änderung                                                             | Risiko   |
|---------------------------------------|----------------------------------------------------------------------|----------|
| `components/Produktmatrix.tsx`        | Neu geschrieben — liest aus `matrix.generated.ts`                    | isoliert |
| `data/matrix.generated.ts`            | Neu, Seed-Inhalt aus bestehender `eignungen`-Liste                   | isoliert |
| `data/produkte.ts`                    | `eignungen`-Feld `@deprecated` markieren, bleibt zunächst            | gering   |
| `data/loesungsfinder.ts`              | Keine                                                                | 0        |
| `data/types.ts`                       | Keine (neue Types in `matrix.generated.ts`)                          | 0        |
| `app/[lang]/produktmatrix/page.tsx`   | Seitentitel/Intro aus Dictionary ziehen — sonst unverändert          | minimal  |
| `dictionaries/*.json`                 | Matrix-Spalten-Labels entfallen (kommen aus `matrix.generated.ts`)   | mittel   |
| `scripts/seed-matrix.ts`              | Neu — einmalig, generiert initiale `matrix.generated.ts` aus `produkte.ts`  | isoliert |

### Migrationsschritte

1. Types + leerer Contract (`matrix.generated.ts` mit Types und leeren Arrays).
2. Seed-Script `scripts/seed-matrix.ts` — liest heutige `eignungen`-Arrays, erzeugt Start-Belegung mit Rating `+` (bewusst konservativ — Team verfeinert in Notion).
3. Matrix-Komponente neu schreiben gegen den Contract, Entwicklung gegen Seed-Daten.
4. Legende + Tooltip + Toggle ausarbeiten.
5. Dictionaries aufräumen — Matrix-Spalten-Keys entfernen.
6. Notion-DBs nach Schema anlegen (Task für Steffi + Kollege).
7. Seed-Script umbauen → importiert aus Notion per API (beginnt die Sync-Folge-Spec).

---

## 8. Tests

- **Matrix-Komponente:** Rendering-Test mit festem Test-Contract (3 Produkte, 2 Kriterien, 2 Maßnahmen). Prüft: Toggle filtert korrekt, leere Zelle unterscheidet sich von `×××`, Tooltip erscheint bei `notiz`.
- **Contract:** TypeScript-Check ist der primäre Test — Rating-Union verhindert Tippfehler by construction.
- **Seed-Script:** Snapshot-Test auf den generierten Output (reproduzierbar aus den Eingabedaten).

---

## 9. Success-Kriterien

- Die neue Matrix rendert mit Seed-Daten eine zur heutigen Sichtbarkeit äquivalente Belegung (Regressionstest gegen die jetzige „Punkt-Ja/Leer-Nein"-Logik: jeder heutige Punkt wird zu mindestens `+`).
- Maßnahme-Toggle funktioniert visuell und technisch, Wechsel ohne Reload.
- Alle 6 Rating-Stufen werden korrekt dargestellt; leere Zellen sind von `×××` klar unterscheidbar.
- Tooltip zeigt Notion-Notizen, wenn vorhanden.
- Notion-Schema ist in einer Test-Seite mit 3 Beispiel-Produkten manuell validiert.

---

## 10. Geparkt (eigene Folge-Specs)

- **Sync-Script gegen echte Notion-API** — Build-Hook-Integration, Fehlerbehandlung, Caching, Auth.
- **Bodenzustand-Dimension** — Aufnahme in die Matrix nach Team-Klärung der Relevanz.
- **Dimensions-Filter (C)** — UI-Erweiterung, Spaltengruppen ein/ausblenden.
- **Payload-Brücke** — Notion → Payload für Website-Relaunch (passend zur Stack-Strategie).
- **Lösungsfinder nutzt Matrix-Ratings** — perspektivische Konsolidierung des Scoring, heute scort der Lösungsfinder gegen `referenzen`.
- **Konvergenz `produkte.ts` → Notion** — Migration der Stammdaten (technische Daten, Normen, Verarbeitung) in Notion-DB 1.
