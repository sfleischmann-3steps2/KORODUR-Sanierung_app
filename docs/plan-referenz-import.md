# Plan: Referenz-Abgleich App ↔ Notion + Import der Sanierungen

**Erstellt:** 2026-04-23
**Status:** zur Umsetzung in separater Session
**Vorarbeit erledigt (heute):**
- Notion-DB um 4 Strukturfelder erweitert: `Sanierungsart`, `Einsatzbereich` (9 Werte inkl. Trinkwasser), `Dringlichkeit`, `Zusatzfunktion`
- 56 🟢-Sanierungs-Einträge in Notion mit heuristischen Vorschlägen befüllt (Log: `docs/referenz-review-writeback.log`)
- Review-Report mit Ampel-Einschätzung: `docs/referenz-review.md`
- 9 unklare Einträge (🔴🟡🔵⚪) leer gelassen — werden von KORODUR-Experten nachbearbeitet

---

## Ziel

1. **Abgleich:** Die 26 Referenzen in `data/referenzen.ts` mit den 111 Einträgen der Notion-DB reconcilen.
2. **Delta-Writeback:** App-Referenzen, die in Notion fehlen, **in Notion nachlegen** (mit Strukturfeldern befüllt).
3. **Normalisierung:** Die App-Refs mit derselben 4-Step-Logik versehen — sofern nicht schon vorhanden (teilweise ist's schon im TS-File).
4. **Forward-Import:** Alle 🟢-Sanierungs-Einträge aus Notion (inkl. bisher nicht in der App enthaltener) in `data/referenzen.ts` bringen — **inklusive Bildern**.

---

## Arbeitsschritte

### Schritt 1 — Präzises Matching App ↔ Notion

**Was:** Für jede der 26 App-Referenzen einen eindeutigen Notion-Match finden (oder feststellen, dass keiner existiert).

**Wie:**
- Automatischer Erst-Match über (Ort-Token, Verarbeiter, Produkt-Fingerabdruck).
- Fuzzy-Match-Ergebnis als Tabelle im Report → `docs/app-notion-match.md`.
- Manuell bestätigen (Steffi durchsieht Unklarheiten).

**Vorläufige Einschätzung** (Kurz-Check heute, zu präzisieren):
- ~9 App-Refs mit eindeutigem Notion-Match (Antolin, Kleemann, NIKE Szczecin, DHL Ottendorf, Hafen Catania, Mikkeli, Werkstattboden Neutraubling, Strandkorbhalle Wenningstedt/Sylt, Bohnenkamp Essenbach).
- ~9 App-Refs mit **wahrscheinlichem Match** (Monheim/apt, Guben/Megaflex, Autohaus Versmold etc.) — zu bestätigen.
- ~8 App-Refs ohne Notion-Entsprechung (Loosen Klausen, Obstplantage Ibbenbüren, Helipad Płock, Lyreco Schweiz, Absenksteine Spreewald, Parkhaus Zürich, Theodor-Heuss-Brücke, LKW-Umfahrt Darmstadt) — **Kandidaten für Delta-Writeback**.

**Deliverable:** `docs/app-notion-match.md` mit 3 Gruppen (eindeutig · unklar · nur App).

---

### Schritt 2 — Delta in Notion nachtragen

**Was:** Die ~8 App-Refs, die nicht in Notion sind, dort neu anlegen — **inkl. Strukturfeldern**.

**Wie (pro App-Ref):**
- Neue Notion-Page in der Referenz-DB anlegen via `mcp__claude_ai_Notion__notion-create-pages`.
- Felder übernehmen aus dem TS-Objekt:
  - `Objekttitel` = `titel`
  - `Ort`, `Land` = `ort`, `land`
  - `Neubau oder Sanierung?` = "Sanierung" (alle App-Refs sind Sanierungen)
  - `Fläche` = `flaeche`
  - `Ausgangssituation` / `Herausforderung` = aus `herausforderungen[]` + `loesung`
  - `eingesetzte KORODUR Produkte` = `produkte[]`
  - **Die 4 Strukturfelder direkt gesetzt** (da die App-Refs bereits `sanierungsart`, `anwendungsbereiche`, `zeitDringlichkeit`, `zusatzfunktionen` haben — siehe `data/referenzen.ts`).
- `Status` = "durch AI bearbeitet" (neue Kategorie-Tag, damit Experten-Review möglich).

**Wichtig:** Bilder nicht hochladen (Notion-Files via MCP nicht im Umfang). Stattdessen `weitere Hinweise, die nur wir kennen` = "Bilder liegen in App-Repo unter /public/images/referenzen/{slug}-\*.jpg".

**Deliverable:** ~8 neue Notion-Pages · Log: `docs/referenz-delta-writeback.log`.

---

### Schritt 3 — App-Refs konsolidieren (optional, Minimal)

**Was:** Sicherstellen, dass alle 26 App-Refs die 4 Strukturfelder korrekt gesetzt haben.

**Status:** Laut `data/types.ts` sind die Felder `sanierungsart`, `anwendungsbereiche`, `zeitDringlichkeit`, `zusatzfunktionen` bereits Pflicht und heute schon befüllt. → Nur Qualitäts-Check nötig, keine Struktur-Änderung.

**Wie:** Script `scripts/validate-referenzen.ts`, das sicherstellt:
- Keine Referenz hat `anwendungsbereiche: []` (Mindestens einer muss gesetzt sein).
- Jeder Wert liegt im erlaubten Enum.
- Produkte-Namen matchen `data/produkte.ts`.

---

### Schritt 4 — Import klar gekennzeichneter Sanierungen aus Notion

**Was:** Alle Notion-Einträge mit gefülltem `Sanierungsart` + mind. einem `Einsatzbereich` (=App-scope) + `Status ∈ {RV geprüft, Freigegeben}` in die App bringen, **die dort noch nicht existieren**.

**Abhängigkeit:** Schritt 1 (Matching) muss fertig sein, damit wir wissen, welche Notion-Einträge neu sind.

**Wie:**

#### 4a — Notion-Fetch
- Script `scripts/import-notion-referenzen.ts`, das:
  - Notion-DB via MCP (oder notion-client Fallback) abfragt.
  - Filter: `Sanierungsart ≠ null AND Einsatzbereich ≠ [] AND Status IN ('RV geprüft','Freigegeben') AND Einsatzbereich ≠ ['Trinkwasser']` (Trinkwasser-only rauslassen — ist DB-Only).
  - Mappt nach `Referenz`-Interface:
    - `id`/`slug` = aus Objekttitel slugifiziert
    - `titel`, `untertitel` = Objekttitel + (Ort, Baujahr)
    - `kategorie` / `unterkategorie` = heuristisch aus `Einsatzbereich` (Default: "industrieboden" / "schwerlast" — bei Infrastruktur: "infrastruktur" / "verkehr")
    - `produkte[]` = aus `eingesetzte KORODUR Produkte` (nur die, die in `data/produkte.ts` existieren!)
    - `herausforderungen[]` = Bullet-Split aus `Herausforderung`
    - `loesung` = Freitext aus Notion-Content oder `Warum KORODUR?`
    - `vorteile[]` = Split aus Notion-Content (falls strukturiert) oder leer
    - `sanierungsart`, `anwendungsbereiche`, `zeitDringlichkeit`, `zusatzfunktionen` = direkt aus den neuen Strukturfeldern

#### 4b — Bilder holen
- Notion-Field `TOP 3 Bilder` + `Weitere Bilder & Dokumente` auslesen.
- Pro Referenz: **bis zu 6 Bilder** runterladen nach `/public/images/referenzen/{slug}-{n}.jpg`:
  - TOP 3 → `{slug}.jpg`, `{slug}-2.jpg`, `{slug}-3.jpg`
  - Weitere → `{slug}-4.jpg` bis `{slug}-6.jpg`
- Als WebP konvertieren (wie bestehende Refs im Projekt).
- Alt-Text = `{titel} in {ort}`.

#### 4c — Merge in `data/referenzen.ts`
- Neue Einträge **append**en, bestehende **nicht überschreiben** (Steffi hat TS bereits redaktionell bearbeitet).
- Array-Reihenfolge nach `kategorie` / `unterkategorie` (wie heute).
- TypeScript-Build muss grün bleiben (`npm run typecheck`).

**Deliverable:** `data/referenzen.ts` erweitert · `/public/images/referenzen/` mit neuen Bildern · `scripts/import-notion-referenzen.ts` committet.

---

### Schritt 5 — Verifikation & UI-Test

- `npm run build` muss ohne Fehler laufen.
- Dev-Server starten (`npm run dev`), Lösungsfinder durchklicken:
  - Test-Suche: "Großflächig / Parkdeck / Schnell / Tausalzbeständigkeit" → müssen jetzt mehrere Ergebnisse erscheinen (vorher waren Parkdeck-Refs dünn).
- Screenshot-Abgleich der Referenz-Detailseite mit vorher/nachher.
- Smoke-Test (`scripts/test-scoring.ts`) mit bestehender Logik — darf nicht regredieren.

---

## Offene Fragen zur Klärung (in Umsetzungs-Session)

1. **Bilder-Qualität:** Die Notion-`TOP 3 Bilder` sind oft Handy-Fotos. OK als V1 oder erst kuratiert rein?
2. **Slug-Kollisionen:** Ein paar Notion-Titel könnten mit bestehenden App-Slugs clashen (z.B. mehrere Versmold-Einträge). Nummerieren oder überschreiben?
3. **Status-Filter:** Nur `RV geprüft` + `Freigegeben`, oder auch `FÜR RV` rein (die sind heuristisch befüllt aber noch nicht RV-geprüft)?
4. **Kategorie/Unterkategorie-Mapping:** Heuristisch oder pro neuem Eintrag manuell?

---

## Rollback-Plan

- Notion-Änderungen sind trackbar via `docs/referenz-review-writeback.log` — Felder können bei Bedarf per `update-page` auf `null` gesetzt werden.
- App-Änderungen sind pro Commit reversierbar.
- Bilder in `/public/images/referenzen/` sind additiv → einfach löschen falls unerwünscht.

---

## Commit-Punkte (Pro Schritt)

1. `feat(referenzen): Matching-Report App ↔ Notion` (nach Schritt 1)
2. `feat(notion): Delta-Writeback (8 App-Refs) + Log` (nach Schritt 2)
3. `feat(referenzen): Validierungs-Skript + Taxonomie-Fixes` (nach Schritt 3, falls nötig)
4. `feat(referenzen): Import X Sanierungen aus Notion inkl. Bildern` (nach Schritt 4)
5. `test(referenzen): Scoring-Smoke nach Import` (nach Schritt 5)
