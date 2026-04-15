# Taxonomie-Vorschlag: Lösungsfinder qualifizieren

**Datum:** 2026-04-15
**Status:** Entwurf — zur Abstimmung mit Fachkollegen

---

## Ziel

Die aktuelle Lösungsfinder-Logik basiert auf aus Referenztexten abgeleiteten Tags. Dieses Dokument schlägt eine fachlich fundierte Taxonomie vor, die:

1. **Klare Dimensionen** definiert (was wird abgefragt?)
2. **Abgestufte Werte** statt binär ja/nein verwendet
3. **K.O.-Kriterien** einführt (harte Ausschlüsse)
4. **Scoring-Gewichte** transparent und anpassbar macht
5. Sowohl für **Produkte** als auch **Referenzen** anwendbar ist

---

## Übersicht: 5 Dimensionen

| # | Dimension | Aktuell | Neu | K.O.-fähig? |
|---|-----------|---------|-----|-------------|
| 1 | Art der Maßnahme | 2 Werte | 4 Werte | Nein (Vorfilter) |
| 2 | Mechanische Belastung | 4 Werte, binär | 4 Werte, 3-stufig | Nein |
| 3 | Schadensbild | 5 Werte, binär | 6 Werte, binär | Nein |
| 4 | Zeitrahmen / Sperrzeit | binär "kurze-sperrzeit" | 4 Klassen | **Ja** |
| 5 | Umgebung & Sonderanforderungen | 5 Werte gemischt | 2 Gruppen getrennt | **Ja** (Umgebung) |

---

## Dimension 1: Art der Maßnahme

**Frage im Wizard:** "Was soll gemacht werden?"

| ID | Label | Beschreibung |
|----|-------|--------------|
| `punktuelle-reparatur` | Punktuelle Reparatur | Einzelne Schadstellen: Löcher, Risse, Ausbrüche, Fugen |
| `grossflaechige-sanierung` | Großflächige Sanierung | Ganze Hallenbereiche oder Außenflächen erneuern |
| `ausgleich-nivellierung` | Ausgleich / Nivellierung | Ebenheit herstellen, Höhenunterschiede ausgleichen |
| `schutzbeschichtung` | Schutzbeschichtung | Oberfläche schützen (Trinkwasser, Verschleiß, Chemie) |

**Änderung vs. aktuell:** "kleine-reparatur" wird zu "punktuelle-reparatur". Neu: "ausgleich-nivellierung" und "schutzbeschichtung" als eigene Kategorien (aktuell beide unter "grossflaechige-sanierung" versteckt).

**Scoring:** Vorfilter — reduziert Ergebnismenge, aber kein harter Ausschluss.

---

## Dimension 2: Mechanische Belastung

**Frage im Wizard:** "Welche Belastung muss der Boden aushalten?"

| ID | Label | Beispiele |
|----|-------|-----------|
| `schwerlast` | Schwerlast | Stapler, LKW, Container, Kettenfahrzeuge |
| `rollende-lasten` | Rollende Lasten | Hubwagen, Flurförderzeuge, PKW |
| `punktlasten` | Punktlasten | Regale, Maschinen, Stützen |
| `leichte-nutzung` | Leichte Nutzung | Fußgänger, leichte Wagen, Retail |

### Eignungsstufen pro Produkt (NEU)

Statt binär ja/nein → 3-stufig:

| Stufe | Label | Bedeutung |
|-------|-------|-----------|
| **2** | Ideal geeignet | Dafür gemacht, bewährt |
| **1** | Geeignet | Funktioniert, aber nicht erste Wahl |
| **0** | Nicht geeignet | Produkt kann das nicht leisten |

**Beispiel:**

| Produkt | Schwerlast | Rollend | Punkt | Leicht |
|---------|-----------|---------|-------|--------|
| NEODUR HE 60 rapid | 2 | 2 | 1 | 2 |
| NEODUR Level | 0 | 1 | 0 | 2 |
| Rapid Set CEMENT ALL | 1 | 0 | 1 | 2 |
| TRU Self-Leveling | 0 | 0 | 0 | 2 |

→ Diese Matrix muss der Experte pro Produkt ausfüllen.

---

## Dimension 3: Schadensbild

**Frage im Wizard:** "Wie sieht der aktuelle Zustand aus?"

| ID | Label | Beschreibung |
|----|-------|--------------|
| `risse-ausbrueche` | Risse / Ausbrüche | Strukturelle Schäden, Kantenbrüche |
| `abrieb-verschleiss` | Abrieb / Verschleiß | Oberflächenabtrag, Staubbildung |
| `hohlstellen` | Hohlstellen / Ablösungen | Keine Haftung zum Untergrund |
| `beschichtungsschaeden` | Beschichtungsschäden | Alte Beschichtung defekt / blättert |
| `ebenheitsprobleme` | Ebenheitsprobleme | Unebenheiten, Höhenversatz |
| `fugen-defekt` | Fugen defekt | Fugenprofile verschlissen, ausgebrochen |

**Änderung vs. aktuell:** "fugen-defekt" neu (aktuell nur über Unterkategorie "fugen" abgebildet, nicht im Lösungsfinder).

**Scoring:** Gewicht 1 pro Match (bleibt). Binär reicht hier — ein Schadensbild liegt vor oder nicht.

---

## Dimension 4: Zeitrahmen / Sperrzeit (K.O.-Kriterium)

**Frage im Wizard:** "Wie viel Zeit steht für die Maßnahme zur Verfügung?"

| ID | Label | Beschreibung |
|----|-------|--------------|
| `sofort` | Sofort nutzbar (< 2 h) | Notfall, laufender Betrieb, kein Stillstand möglich |
| `ueber-nacht` | Über Nacht (< 24 h) | Nachtschicht / Wochenende, am nächsten Tag nutzbar |
| `wenige-tage` | Wenige Tage (1–5 Tage) | Geplante Betriebspause, kurzer Stillstand |
| `geplant` | Geplant (> 5 Tage) | Reguläre Baumaßnahme, Zeit ist kein Engpass |

### Produkt-Zuordnung (Experte prüft)

| Produkt | Max. Sperrzeitklasse | Begründung |
|---------|---------------------|------------|
| Rapid Set CEMENT ALL | `sofort` | 15 min begehbar, 1 h belastbar |
| Rapid Set MORTAR MIX | `sofort` | 1–2 h belastbar |
| Rapid Set CONCRETE MIX | `sofort` | 1–2 h belastbar |
| Rapid Set MORTAR MIX DUR | `sofort` | ca. 2 h belastbar |
| ASPHALT REPAIR MIX | `sofort` | ca. 2 h belastbar |
| KORODUR HB 5 rapid | `sofort` | frisch-in-frisch |
| NEODUR HE 60 rapid | `ueber-nacht` | 4–6 h begehbar, 24 h belastbar |
| KOROCRETE Schnellbeton | `ueber-nacht` | 4–6 h befahrbar |
| NEODUR Level | `ueber-nacht` | 4–6 h begehbar, 24 h belastbar |
| KORODUR FSCem Screed | `ueber-nacht` | schnelle Erhärtung (genau prüfen) |
| NEODUR HE 65 Plus | `wenige-tage` | 6–8 h begehbar, 48 h belastbar |
| NEODUR HE 65 | `wenige-tage` | (genau prüfen) |
| KORODUR PC | `wenige-tage` | Grundierung, nicht eigenständig |
| TRU Self-Leveling | `wenige-tage` | (genau prüfen) |
| MICROTOP TW | `geplant` | Nassspritzverfahren, Nachbehandlung |
| KOROCURE | — | Nachbehandlung, kein eigenständiges Produkt |
| KOROMINERAL CURE | — | Nachbehandlung, kein eigenständiges Produkt |
| KOROTEX | — | Nachbehandlung, kein eigenständiges Produkt |
| DUROP | — | Abstreumaterial, kein eigenständiges Produkt |

### K.O.-Logik

> Wenn der Nutzer `sofort` wählt, werden alle Produkte mit Sperrzeitklasse `wenige-tage` oder `geplant` **ausgeschlossen** — unabhängig vom Score.

Aufwärts-Kompatibilität: Wer `geplant` wählt, bekommt auch `sofort`-Produkte (die sind ja ebenfalls geeignet).

---

## Dimension 5: Umgebung & Sonderanforderungen

Aktuell sind Umgebung und Sonderanforderungen in einem Topf. Vorschlag: **aufteilen** in zwei Untergruppen.

### 5a: Umgebung (K.O.-Kriterium)

**Frage im Wizard:** "Wo befindet sich die Fläche?"

| ID | Label | K.O.-Logik |
|----|-------|------------|
| `innen` | Innenbereich | Standard, kein Ausschluss |
| `aussen` | Außenbereich | Nur Produkte mit Witterungsbeständigkeit |
| `frost-tausalz` | Außen mit Frost-/Tausalzbelastung | Nur Produkte mit nachgewiesener Frost-/Tausalzbeständigkeit |
| `nassbereich` | Nassbereich / Trinkwasser | Nur DVGW-/WHG-zugelassene Produkte |

### Produkt-Zuordnung (Experte prüft)

| Produkt | innen | aussen | frost-tausalz | nassbereich |
|---------|-------|--------|---------------|-------------|
| NEODUR HE 60 rapid | ja | nein | nein | nein |
| NEODUR HE 65 Plus | ja | ja | ja | nein |
| NEODUR HE 65 | ja | ja | ? | nein |
| Rapid Set CEMENT ALL | ja | ja | ? | nein |
| Rapid Set CONCRETE MIX | ja | ja | ja | nein |
| MICROTOP TW | nein | nein | nein | ja |
| ... | | | | |

→ K.O.: Wenn Nutzer `frost-tausalz` wählt, fallen alle Produkte ohne "ja" bei frost-tausalz komplett raus.

### 5b: Sonderanforderungen (Scoring, kein K.O.)

**Frage im Wizard:** "Gibt es besondere Anforderungen?"

| ID | Label |
|----|-------|
| `chemikalien` | Chemikalienbeständigkeit |
| `rutschhemmung` | Rutschhemmung |
| `normkonform` | Bestimmte Normen erforderlich (DIN EN 1504, DVGW, ...) |
| `designanspruch` | Optik / Designanspruch |
| `maschinelle-verarbeitung` | Maschinelle Verarbeitung / Silosystem |

**Änderung vs. aktuell:** "tausalz" und "aussenbereich" → in Dimension 5a verschoben. "normkonform", "designanspruch", "maschinelle-verarbeitung" → neu.

---

## Scoring-Modell (Vorschlag)

### Produkt-Score

```
Score = Summe(Belastungs-Eignungen × 2)
      + Summe(Schadensbild-Matches × 1)
      + Summe(Sonderanforderung-Matches × 2)
      + Maßnahmen-Match × 3
```

### Filter-Reihenfolge

1. **Maßnahme** → Vorfilter (reduziert Menge)
2. **K.O. Sperrzeit** → harter Ausschluss
3. **K.O. Umgebung** → harter Ausschluss
4. **Scoring** → Belastung + Schadensbild + Sonderanforderungen
5. **Sortierung** → Score absteigend

### Referenz-Score

Referenzen werden weiterhin über Tag-Matching gescored, aber:
- Nur Referenzen anzeigen, deren Produkte die K.O.-Filter überleben
- Matching-Tags jetzt aus der neuen Taxonomie

---

## Änderungen an der Wizard-UI

| Aktuell (4 Schritte) | Neu (5 Schritte) |
|---|---|
| 1. Situation (2 Optionen) | 1. Maßnahme (4 Optionen) |
| 2. Belastung (Mehrfach) | 2. Zeitrahmen (Einfach) — NEU |
| 3. Zustand (Mehrfach) | 3. Umgebung (Einfach) — NEU |
| 4. Anforderungen (Mehrfach) | 4. Schadensbild (Mehrfach) |
| — | 5. Belastung & Sonderanforderungen (Mehrfach) |
| 5. Ergebnisse | 6. Ergebnisse |

**Begründung Reihenfolge:** Zeitrahmen und Umgebung zuerst, weil sie K.O.-Kriterien sind → reduziert die Ergebnismenge früh und vermeidet Enttäuschung ("warum wird mir nichts passendes angezeigt?").

---

## Offene Fragen für die Fachkollegen

1. **Sperrzeitklassen:** Stimmen die 4 Klassen? Fehlt eine Zwischenstufe?
2. **Umgebung:** Reichen innen/außen/frost-tausalz/nassbereich? Gibt es weitere K.O.-Umgebungen (z.B. Lebensmittel, ESD)?
3. **Belastungsstufen:** Ist die 3er-Skala (ideal/geeignet/nicht geeignet) richtig, oder braucht es eine 4er-Skala mit "bedingt geeignet"?
4. **Nachbehandlungsprodukte:** Sollen KOROCURE, KOROMINERAL CURE, KOROTEX und DUROP im Lösungsfinder eigenständig erscheinen, oder nur als Systembestandteil bei den Hauptprodukten?
5. **Normen als Filter:** Lohnt es sich, "DIN EN 1504 erforderlich" oder "DVGW erforderlich" als eigene Filteroption aufzunehmen?
6. **Fehlende Produkte:** Gibt es Produkte im Sanierungsportfolio, die aktuell in der App fehlen?

---

## Nächste Schritte

1. [ ] Taxonomie mit Fachkollegen abstimmen
2. [ ] Produkt-Qualifizierung durchführen (Excel-Vorlage → Experte füllt aus)
3. [ ] Referenz-Qualifizierung durchführen (Excel-Vorlage → Experte prüft/korrigiert)
4. [ ] Neue Taxonomie + Daten in die App einbauen
5. [ ] Scoring-Logik mit K.O.-Filtern implementieren
6. [ ] Testen & iterieren
