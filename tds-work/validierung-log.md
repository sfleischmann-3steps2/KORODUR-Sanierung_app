# Validierung-Log: Produktmatrix Sanierung vs. aktuelle TDS

**Stand:** 2026-05-15 · **Vorbereitet von:** Steffi für Termin mit Frank Sander & Richard Vadder
**Basis:** 15 TDS heruntergeladen am 2026-05-15 von korodur.de, Volltext via pdfplumber
**Vorlage (Diff-Referenz):** `produktmatrix-validierung.pdf` (Mai 2026), 17 Zeilen
**Methode:** TDS-PDF primär als Quelle; Notion-DB nur zur Plausibilisierung; Klassifikation konservativ (lieber "leer" als überreden)

---

## TL;DR — 4 Kern-Funde für den Termin

### Fund 1 — „Parkdeck"-Spalte braucht Begriffsklärung ⚠

Vorlage hat bei **NEODUR HE 60 rapid** UND **NEODUR HE 65** Parkdeck = leer. TDS beider Produkte nennt „Parkhäuser" als *ersten* Anwendungsfall:

> ANWENDUNG: Industrieboden für höchste Beanspruchung, z. B. **Parkhäuser**, Industriehallen, Montagehallen, Flugzeughallen, Werkstätten, Hochregallager …
> *(TDS NEODUR HE 60 rapid 03/2025 + NEODUR HE 65 03/2025, jeweils Abschnitt ANWENDUNG)*

**Hypothese:** Vorlage meint mit „Parkdeck" speziell das *witterungsexponierte oberste Geschoss mit OS-System*, nicht Parkhäuser allgemein. Hartstoffestrich passt nicht zu OS-System, aber sehr wohl zu Parkhaus-Hallenböden im Erdgeschoss.

**Klärungsfrage:** *Ist „Parkdeck"-Spalte = OS-System-Schicht (eng) oder Parkhäuser allgemein (weit)?* — Auswirkung auf HE 60 rapid, HE 65, NEODUR Level, KORODUR PC, evtl. KOROCRETE.

### Fund 2 — KORODUR PC ist in der Vorlage falsch klassifiziert ⚠

Vorlage: „**KORODUR PC** — Polymer-Cement-Mörtel" mit Fl=B (beides).
TDS 02/2026: *„flüssige, lösemittelfreie, einkomponentige, wasserverdünnbare Kunstharzdispersion zur Vorbehandlung von saugenden Untergründen für selbstverlaufende NEODUR Level Beschichtungen"* — also keine Mörtel-Reparatur, sondern **Grundierung/Vorstrich**. Verbrauch 50-200 g/m², kein Schichtaufbau.

**Korrektur-Vorschlag:** Untertitel ändern auf „Kunstharzdispersion-Grundierung für NEODUR Level / LevelFlor", Fl=G (Systemkomponente zum großflächigen Zielboden).

### Fund 3 — Rapid Set MORTAR MIX DUR hat kein eigenes TDS ⚠

Einziger Beleg ist 1 Satz im **MORTAR MIX-TDS 04/2024 (Seite 1)**:

> Bei hohem Schleifverschleiß ist MORTAR MIX auch in der Qualität **MORTAR MIX DUR mit Verschleißträger gem. DIN 1100 Gruppe A (KORODUR VS 0/5) für Bodensanierungen > 15 mm auf Anfrage lieferbar**.

**Klärungsfrage:** Eigenes TDS angedacht (so wie HE 60 rapid SVS-Qualitäten ein eigenes Spalten-System haben)? Oder als reine Varianten-Zeile zu MORTAR MIX in der App führen? Vor dieser Entscheidung kein sauberes Pre-Fill möglich.

### Fund 4 — 4 gelbe Zeilen sind Scope-Fragen, keine TDS-Fragen

CEMENT ALL Plus · CONCRETE PHARMACY · SYSTEM KOROCRETE · DUROP sind „App-Aufnahme prüfen". TDS-Recherche zahlt erst nach Scope-Entscheidung ein — wird im Termin geklärt, hier nicht weiter behandelt.

---

## Pro Produkt — 9 TDS-belegte Vorlage-Zeilen

Legende: **H** = Haupt-Einsatzbereich (im TDS namentlich) · **M** = möglich (Eigenschaft passt, nicht namentlich) · **—** = leer (kein Hinweis) · Bei Diff zur Vorlage: ⚠

### 1. NEODUR HE 60 rapid — TDS-Stand 03/2025
**PDF:** https://www.korodur.de/wp-content/uploads/NEODUR_HE_60_rapid_de.pdf

| | Fl | Zeit | Lager | Industrie | Lebensm. | Flugzeug | Parkdeck | Infra | Verkauf | Schwerind. |
|---|---|---|---|---|---|---|---|---|---|---|
| **TDS-Sicht** | G | ■ | H | H | — | H | **H** | — | — | M |
| Vorlage | B | ■ | H | H | M | H | **—** ⚠ | M | — | H |

**Belege:**
- *ANWENDUNG:* „Für die Herstellung und Sanierung schnell nutzbarer Verbundestriche … z. B. Parkhäuser, Industriehallen, Montagehallen, Flugzeughallen, Werkstätten, Hochregallager"
- *TECHNISCHE DATEN:* „begehbar nach ca. 3 Stunden, nutzbar nach ca. 24 Stunden" → ■ (schnell)
- Schichtdicke ab 10 mm, Verbundestrich → großflächig (kein punktueller Anwendungsfall im TDS)

**Diff-Begründung:**
- **Fl B→G:** TDS beschreibt durchgehend Verbundestrich-Anwendung, kein Reparatur-Spotting
- **Lebensmittel M→—:** „nassraumtauglich" steht allgemein, Lebensmittel/HACCP/Bäckerei nicht im TDS
- **Parkdeck —→H** ⚠ Parkhäuser erstgenannt
- **Infra M→—:** Frost-/Tausalzbeständigkeit nur „in Verbindung mit KOROMINERAL Li+", keine Straßen/Brücken/Zufahrten im TDS
- **Schwerindustrie H→M:** „stärkster Beanspruchung" passt, aber „Stahlwerk/Gießerei/Walzwerk" nicht namentlich

---

### 2. NEODUR HE 65 — TDS-Stand 03/2025
**PDF:** https://www.korodur.de/wp-content/uploads/NEODUR_HE_65_de.pdf

| | Fl | Zeit | Lager | Industrie | Lebensm. | Flugzeug | Parkdeck | Infra | Verkauf | Schwerind. |
|---|---|---|---|---|---|---|---|---|---|---|
| **TDS-Sicht** | G | — | H | H | — | H | **H** | — | — | M |
| Vorlage | G | — | H | H | H | H | **—** ⚠ | — | H | H |

**Belege:**
- *ANWENDUNG:* „Parkhäuser, Industriehallen, Montagehallen, Flugzeughallen, Werkstätten, Hochregallager und sonstige Industrieflächen mit stärkster Beanspruchung"
- Schichtdicke nach Beanspruchungsgruppen gem. DIN 18560-7 (15 mm bei Gruppe I) → Standard-Hartstoffestrich, **keine** Schnellaushärtung im TDS

**Diff-Begründung:**
- **Lebensmittel H→—:** TDS-Text identisch wie HE 60 rapid, kein Lebensmittel-Hinweis
- **Parkdeck —→H** ⚠ (s. Fund 1)
- **Verkaufsräume H→—:** Nicht im TDS
- **Schwerindustrie H→M:** wie HE 60 rapid

---

### 3. Rapid Set MORTAR MIX — TDS-Stand 04/2024
**PDF:** https://www.korodur.de/wp-content/uploads/2025/03/Mortar_Mix_de.pdf

| | Fl | Zeit | Lager | Industrie | Lebensm. | Flugzeug | Parkdeck | Infra | Verkauf | Schwerind. |
|---|---|---|---|---|---|---|---|---|---|---|
| **TDS-Sicht** | B | ■ | — | — | — | — | — | **H** | — | — |
| Vorlage | P | ■ | M | H | — | — | — | H | H | M |

**Belege:**
- *ANWENDUNG:* „Betoninstandsetzung, Reparatur von Stuck und Putz, einschichtige **Außenputze**, Ausgleichsschichten, Schalungsarbeiten sowie für die **Reparatur von Fahrbahnen**"
- 10-150 mm Schichtdicke → punktuelle Reparatur + großflächige Ausgleichsschicht/Außenputz möglich → **B**
- „Belastbar nach ca. 60 Minuten" → ■

**Diff-Begründung:**
- **Fl P→B:** TDS nennt explizit Außenputze und Fahrbahn-Reparaturen → großflächig auch möglich
- **Lager/Industrie/Verkauf/Schwerind:** TDS gibt KEINE konkreten Branchen — alle Werte in der Vorlage sind nicht TDS-belegt (möglich aber, gerne im Termin diskutieren)
- **Infra H:** „Reparatur von Fahrbahnen" → unbestritten

---

### 4. Rapid Set CEMENT ALL — TDS-Stand 10/2022
**PDF:** https://www.korodur.de/wp-content/uploads/2025/03/Cement_All_de.pdf

| | Fl | Zeit | Lager | Industrie | Lebensm. | Flugzeug | Parkdeck | Infra | Verkauf | Schwerind. |
|---|---|---|---|---|---|---|---|---|---|---|
| **TDS-Sicht** | P | ■ | — | M | M | — | — | M | — | — |
| Vorlage | P | ■ | H | H | M | H | M | H | H | — |

**Belege:**
- *ANWENDUNG:* „multifunktionaler Schnellreparaturmörtel geeignet für Betoninstandsetzung, Vergussarbeiten, Verankerung und Injektion, Spachteln, Schalungsarbeiten und Bodenbeschichtungen (ab 10 mm empfehlen wir MORTAR-MIX)"
- „Belastbar nach ca. 60 Minuten" → ■

**Diff-Begründung:**
- TDS ist eindeutig **branchen-agnostisch** — Vorlage hat sehr großzügig H/M-Werte verteilt
- M-Werte in TDS-Sicht: weil „innen und außen, auch in Nassbereichen", frost-/tausalzbeständig, chloridfrei → Eigenschaften für Industrie/Lebensmittel/Infra passen, aber nicht namentlich genannt
- Vorlage-Werte (H für Lager, Industrie, Flugzeug, Verkaufsräume) sind nicht aus dem TDS belegbar — vermutlich erfahrungsbasiert

---

### 5. Rapid Set CONCRETE MIX — TDS-Stand 04/2026
**PDF:** https://www.korodur.de/wp-content/uploads/Concrete_Mix_de.pdf

| | Fl | Zeit | Lager | Industrie | Lebensm. | Flugzeug | Parkdeck | Infra | Verkauf | Schwerind. |
|---|---|---|---|---|---|---|---|---|---|---|
| **TDS-Sicht** | B | ■ | M | H | — | — | — | H | — | M |
| Vorlage | B | ■ | M | H | — | — | — | H | H | — / M |

**Belege:**
- *ANWENDUNG:* „Betoninstandsetzung, für Reparatur und Bau von Gehwegen, **Fahrbahnen**, Beton- und Maschinenfundamente, Schalungsarbeiten sowie **Industrieböden**"
- 50-600 mm Schichtdicke → strukturell, sowohl Fundament (punktuell) als auch Industrieboden (großflächig)
- „Belastbar nach ca. 60 Minuten" → ■

**Diff-Begründung:** Vorlage und TDS sind hier weitgehend konsistent. Verkaufsräume H in Vorlage ist nicht TDS-belegt (50-600 mm Schichtdicke passt nicht zu Verkaufsraum-Sanierung). Schwerindustrie M in TDS-Sicht: „Maschinenfundamente" + „Industrieböden" passt zur Schwerlast-Erwartung.

---

### 6. ASPHALT REPAIR MIX — TDS-Stand 09/2024
**PDF:** https://www.korodur.de/wp-content/uploads/Asphalt-Repair-Mix_de.pdf

| | Fl | Zeit | Lager | Industrie | Lebensm. | Flugzeug | Parkdeck | Infra | Verkauf | Schwerind. |
|---|---|---|---|---|---|---|---|---|---|---|
| **TDS-Sicht** | B | ■ | — | M | — | — | M | **H** | — | — |
| Vorlage | P | ■ | — | M | — | — | H | H | H | — |

**Belege:**
- *ANWENDUNG:* „ideal für die schnelle, einfache und dauerhafte Beseitigung von **Schlaglöchern im Asphalt** … für die Reparatur von **Straßenschäden, Frostaufbrüchen, Grundstücks- und Garageneinfahrten, Parkplätzen, Gehwegen, industriellen Verkehrsflächen** oder auch für die Einfassung/Angleichung von Straßenkanalschächten"
- 30-600 mm Schichtdicke
- „Verkehrsfreigabe bereits nach ca. 30 Minuten" → ■

**Diff-Begründung:**
- **Fl P→B:** Schlaglöcher = punktuell, aber „Parkplätze, Gehwege" = großflächig auch genannt
- **Parkdeck H→M:** „Parkplätze" sind ebenerdige Außen-Parkflächen, nicht Parkdeck (Etagen-Bau) — abgeleitet, nicht namentlich Parkdeck
- **Verkaufsräume H:** im TDS nicht belegt, Vorlage-Wert nicht haltbar

---

### 7. TRU Self-Leveling — TDS-Stand 10/2022
**PDF:** https://www.korodur.de/wp-content/uploads/TRU_Self_Leveling_de.pdf

| | Fl | Zeit | Lager | Industrie | Lebensm. | Flugzeug | Parkdeck | Infra | Verkauf | Schwerind. |
|---|---|---|---|---|---|---|---|---|---|---|
| **TDS-Sicht** | G | ■ | — | — | M | M | — | — | **H** | — |
| Vorlage | G | ■ | H | H | H | — | — | — | M | H |

**Belege:**
- *ANWENDUNG:* „Für attraktives, einzigartiges Design von **Verkaufsräumen, Restaurants, Foyers, Museen, Bürogebäuden, Schulen, Flughäfen** sowie allen anderen repräsentativen Räumen"
- 5-35 mm Schichtdicke, geschliffener Sichtestrich
- „nach 2 - 3 Stunden begehbar, nach 24 Stunden schleifbar" → ■

**Diff-Begründung:**
- **Lager/Industrie H→—:** Sichtestrich nicht für Lager/Industrie konzipiert (Designboden)
- **Lebensmittel H→M:** „Restaurants" = Gastronomie, also nahe Lebensmittel, aber nicht Bäckerei/Brauerei/HACCP
- **Flugzeug —→M:** „Flughäfen" steht im TDS, vermutlich Terminal-Bereich (nicht Hangar/Vorfeld)
- **Verkaufsräume M→H:** Vorlage hat hier zu schwach klassifiziert — „Verkaufsräume" ist erster Anwendungsfall im TDS
- **Schwerindustrie H→—:** Schichtdicke 5-35 mm passt nicht zu Schwerlast

---

### 8. KOROCRETE — TDS-Stand 09/2021
**PDF:** https://www.korodur.de/wp-content/uploads/2023/02/KOROCRETE_Schnellbeton_de.pdf

| | Fl | Zeit | Lager | Industrie | Lebensm. | Flugzeug | Parkdeck | Infra | Verkauf | Schwerind. |
|---|---|---|---|---|---|---|---|---|---|---|
| **TDS-Sicht** | G | ■ | M | M | — | — | — | M | — | — |
| Vorlage | G | — | H | H | — | H | H | H | — | H |

**Belege:**
- *ANWENDUNG:* „Für die Herstellung von schnell nutzbaren Betonböden im Innen- und Außenbereich. Sanierung von Betonböden mit hoher Dauerhaftigkeit aufgrund von Volumenstabilität sowie hohen Betonendfestigkeiten"
- Verkehrsfreigabe nach 6 Stunden → ■ (Vorlage hat — fälschlich)

**Diff-Begründung:**
- **Zeit — → ■** ⚠ KOROCRETE ist ein Schnellbeton; 6h-Belastbarkeit erfüllt das Vorlage-Kriterium „schnellaushärtend"
- TDS gibt KEINE konkreten Branchen — Vorlage hat fast alle Felder H gesetzt, das ist nicht TDS-belegt sondern erfahrungsbasiert
- M-Werte in TDS-Sicht: aufgrund „Industrieböden allgemein" + „Außenbereich" + Schnellbeton-Charakter

---

### 9. KORODUR PC — TDS-Stand 02/2026
**PDF:** https://www.korodur.de/wp-content/uploads/KORODUR_PC_de.pdf

| | Fl | Zeit | Lager | Industrie | Lebensm. | Flugzeug | Parkdeck | Infra | Verkauf | Schwerind. |
|---|---|---|---|---|---|---|---|---|---|---|
| **TDS-Sicht** | G* | — | — | — | — | — | — | — | — | — |
| Vorlage | B | — | M | H | H | — | — | H | M | M |

*G = großflächig als Systemkomponente, da Zielboden NEODUR Level / LevelFlor großflächig ist

**Belege:**
- *BESCHREIBUNG:* „**flüssige, lösemittelfreie, einkomponentige, wasserverdünnbare Kunstharzdispersion** zur Vorbehandlung von saugenden Untergründen für selbstverlaufende NEODUR Level Beschichtungen"
- *ANWENDUNG:* „**Grundierung** von zementären Untergründen für selbstverlaufende Beschichtungen wie NEODUR Level, NEODUR Level AU und LevelFlor"
- Materialverbrauch 50-200 g/m² → keine Mörtel-Schicht

**Diff-Begründung:**
- ⚠ **Untertitel-Fehler in Vorlage:** „Polymer-Cement-Mörtel" stimmt nicht. KORODUR PC ist eine Kunstharzdispersion-Grundierung, kein Mörtel.
- **Einsatzbereiche:** TDS nennt keine konkreten Branchen — es ist eine Systemkomponente. Einsatzbereiche aus Zielboden ableiten (NEODUR Level, LevelFlor).
- **Korrektur-Vorschlag im Termin:** Untertitel ändern, alle Einsatzbereiche aus NEODUR Level übernehmen (Lager H, Industrie H, Parkdeck H, Verkaufsräume H).

---

## 8 Vorlage-Zeilen ohne eigene TDS-Validierung

| # | Produkt | Status |
|---|---|---|
| 4 | Rapid Set MORTAR MIX DUR | Kein eigenes TDS — siehe Fund 3, Klärung im Termin |
| 6 | Rapid Set CEMENT ALL Plus | Gelb, "App-Aufnahme prüfen" — Scope-Frage |
| 8 | Rapid Set CONCRETE PHARMACY | Gelb — Scope-Frage |
| 12 | SYSTEM KOROCRETE | Gelb — Scope-Frage (System aus FSCem + Gesteinskörnung) |
| 14 | NEODUR PFM 1K Easyfix | Pflasterfugenmörtel, TDS nicht in diesem Lauf nachgeladen |
| 15 | DUROP | Gelb, Reaktivharz — außerhalb mineralischer TDS-Range |
| 16 | [Produkt 16 — offen] | Platzhalter |
| 17 | [Produkt 17 — offen] | Platzhalter |

---

## Bonus — 7 zusätzliche TDS, die ich gelesen habe (nicht in Vorlage)

Diese 7 Produkte sind in `data/produkte.ts` der Sanierungs-App, aber nicht in der Validierungsvorlage. Recherche-Ergebnisse liegen vor (in `tds-work/classification.json`), falls relevant:

- **NEODUR HE 65 Plus** (TDS 11/2025) — wie HE 65, aber zusätzlich WHG-Anwendungen (Waschplätze, Tankstellen, Hafen)
- **NEODUR Level** (TDS 08/2025) — Dünnestrich 4-30 mm, schnell, Innen, Verkaufsräume H
- **KORODUR HB 5 rapid** (TDS 03/2022) — Haftbrücke, Systemkomponente für HE 60 rapid + FSCem Screed
- **KORODUR FSCem Screed** (TDS 11/2021) — Ausgleichsestrich CT-C40-F6 bis 120 mm
- **KOROCURE** (TDS 08/2020) — Verdunstungsschutz / Zwischen-Nachbehandlung
- **KOROMINERAL CURE** (TDS 10/2023) — Nachbehandlung + Silikatisierung
- **KOROTEX** (TDS 08/2020) — Nachbehandlung Acrylharzbasis

**Frage:** Sind diese gewollt nicht in der Vorlage oder Lücke?

---

## Anhang — Methodische Hinweise

**Klassifikations-Heuristik (TDS-primär):**
- **Fl=P (punktuell):** Reparaturmörtel mit geringer Schichtdicke (≤ 10 mm), Spotting-Anwendungen wie „Schlaglöcher", „Verankerung", „Verguss"
- **Fl=G (großflächig):** Estrich, Verbundestrich, Selbstverlauf, Sichtestrich; auch Schnellbeton großflächig
- **Fl=B (beides):** TDS nennt explizit beide Anwendungsformen (z. B. CONCRETE MIX = Maschinenfundament UND Industrieboden)
- **Zeit=■:** Begehbar < 4h ODER belastbar < 24h ODER „rapid"/„schnell" im Namen+TDS-Text
- **Einsatzbereich H:** Branche namentlich im TDS-Anwendungs-Abschnitt
- **Einsatzbereich M:** Eigenschaften des Produkts passen klar zur Branche, aber nicht namentlich genannt
- **Einsatzbereich leer:** Kein Hinweis im TDS, dass das Produkt dort einsetzbar ist
- **Einsatzbereich ?:** TDS-Information widersprüchlich oder fehlend

**Was bewusst nicht gemacht wurde:** Notion-Daten als primäre Quelle. Notion-`Einsatzbereiche`-Feld ist bei 13/17 Vorlage-Produkten leer oder lückenhaft — daher TDS-Volltext als Single Source of Truth gewählt, Notion nur zur Plausibilisierung.

**Reproduzierbarkeit:** Alle 15 TDS-PDFs liegen in `tds-work/pdfs/`, extrahierte Texte in `tds-work/texts/`, strukturierte Klassifikation in `tds-work/classification.json`.
