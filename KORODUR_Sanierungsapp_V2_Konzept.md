# KORODUR Sanierungsapp – Optimierungskonzept V2

**Stand:** April 2026  
**Basis:** Analyse der Live-App unter `sfleischmann-3steps2.github.io/KORODUR-Sanierung_app/de/`

---

## 1. Ausgangslage & Problemdiagnose

### Was gut funktioniert
- Referenzinhalte sind stark und verkaufen ohne viel Text
- Die drei Portfolio-Bereiche (Industrieboden / Industriebau / Infrastruktur) sind inhaltlich klar und logisch
- Mehrsprachigkeit (DE/EN/FR) ist bereits angelegt
- Technische Struktur der App ist sauber

### Identifizierte Schwachstellen

**Problem 1: Zwei Tools, die dasselbe tun**  
Lösungsfinder und Produktberater stellen beide dieselbe Einstiegsfrage (Was ist betroffen? / Was möchten Sie sanieren?). Für einen Erstbesucher ist nicht erkennbar, worin der Unterschied liegt. Das erzeugt Unsicherheit und erhöht die Abbruchrate.

| Tool | Schritt 1 | Folgeschritte |
|---|---|---|
| Lösungsfinder | Was ist betroffen? (Boden / Bauteil / Verkehrsfläche / Wasserbauwerk) | Problem → Empfehlung |
| Produktberater | Was möchten Sie sanieren? (Industrieboden / Industriebau / Infrastruktur) | Belastung → Zeit → Anforderungen → Empfehlung |

→ Beide führen zum gleichen Ziel. Ein Tool reicht.

**Problem 2: Microtop passt nicht in diese App**  
Microtop taucht aktuell unter `Infrastruktur > Wasser` auf – mit 3 Referenzen (Haidberg, Bad Nauheim, Budapest). Das Produkt adressiert eine völlig andere Zielgruppe (kommunale Wasserwerksbetreiber, Bauhofleiter, DVGW-pflichtige Planer) und einen anderen Kaufprozess. Ein Hallenboden-Entscheider und ein Trinkwasserbehälter-Planer kommen nie gleichzeitig auf dieselbe Seite.

**Problem 3: Navigation ist zu tief für eine Orientierungsapp**  
Die App hat 7 Navigationspunkte (inkl. Untermenüs). Für eine App, die primär Aufmerksamkeit wecken und Einstieg schaffen soll, ist das zu viel. Nutzer, die KORODUR noch nicht kennen, verlieren sich.

---

## 2. Strategische Leitentscheidungen für V2

### Entscheidung 1: Microtop auslagern

Microtop bekommt einen **eigenen, separaten Bereich** – keine eigene komplette App, aber eine klar abgetrennte Microsite oder Unterseite, die über einen dezenten CTA von der Hauptapp erreichbar ist.

**Begründung:** Andere Zielgruppe, anderer Buying-Prozess, andere Sprache (DVGW, Trinkwasserverordnung, mineralische Beschichtung vs. Sanierungsmörtel). Microtop in der Hauptapp zu belassen verwässert die Botschaft für beide Zielgruppen.

**Umsetzung:**  
- Route: `/de/microtop/` (oder separate Subdomain später)
- Verlinkung aus der Hauptapp: Nur als Footer-CTA, z. B. *„Trinkwasser-Infrastruktur? → KORODUR Micro-Top"*
- Eigener kleiner Lösungsfinder für Microtop (Behältertyp → Volumen → DVGW-Anforderung → Empfehlung)

### Entscheidung 2: Zwei Tools zu einem zusammenführen

Der Lösungsfinder (`/wizard/`) wird zum einzigen Einstiegs-Tool. Der Produktberater (`/konfigurator/`) wird abgelöst oder als erweiterter Schritt integriert.

**Neues Tool-Konzept: "Sanierung finden" (kombinierter Assistent)**

```
Schritt 1: Was sanieren Sie?
→ Industrieboden (Hallen, Lager, Werkstätten)
→ Industriebau (Bauteile, Fugen, Treppen, Fundamente)
→ Verkehrs- & Logistikflächen (Höfe, Parkhäuser, Häfen, Brücken)

Schritt 2: Welche Art von Maßnahme?
→ Punktuelle Reparatur (Löcher, Fugen, einzelne Flächen)
→ Flächensanierung (komplette Halle / Abschnitt)
→ Ich bin mir nicht sicher

Schritt 3: Zeitrahmen?
→ Stunden (Produktion darf nicht stillstehen)
→ Wochenende / Stillstand geplant
→ Flexibel

→ Ergebnis: 1–2 empfohlene Produkte + 2–3 passende Referenzen
```

**Warum dieser Schnitt:** Schritt 1 entspricht grob dem Marktbereich, Schritt 2 unterscheidet Instandsetzung von Sanierung (das ist die eigentliche Kaufentscheidungsvariable), Schritt 3 ist das stärkste KORODUR-Differenzierungsmerkmal (Schnellaushärtung).

### Entscheidung 3: Infrastruktur-Bereich schärfen

Mit Microtop draußen besteht `Infrastruktur` nur noch aus dem Verkehrs-Bereich (6 Referenzen). Das ist sauberer und konsistenter. Umbenennung optional: **„Verkehr & Logistik"** wäre präziser als „Infrastruktur" für diese Zielgruppe.

---

## 3. Neue Informationsarchitektur (V2)

```
/de/
├── index (Startseite)
├── sanierung-finden/ (neuer kombinierter Assistent – ersetzt wizard + konfigurator)
├── portfolio/
│   ├── industrieboden/
│   │   ├── #schwerlast
│   │   ├── #duennschicht
│   │   └── #schnelle-reparaturen
│   ├── industriebau/
│   │   ├── #fugen
│   │   └── #schnelle-reparaturen
│   └── infrastruktur/ (ggf. umbenennen: verkehr-logistik)
│       └── #verkehr (Wasser-Bereich entfällt hier)
├── referenzen/
└── microtop/ (neu, abgetrennt)
    ├── index
    ├── referenzen/ (Haidberg, Bad Nauheim, Budapest)
    └── loesung-finden/ (eigener Mini-Assistent)

ENTFÄLLT:
- /wizard/ (→ abgelöst durch /sanierung-finden/)
- /konfigurator/ (→ zusammengeführt)
- Infrastruktur > Wasser (→ nach /microtop/)
```

---

## 4. Startseite V2 – Inhaltliche Empfehlungen

### Hero
Klarer Fokus auf den zentralen Nutzen:  
> *„Von der Punktreparatur bis zur Großfläche – KORODUR saniert, während Sie produzieren."*

Einziger primärer CTA: **„Sanierung finden →"** (führt in den kombinierten Assistenten)

### Sekundäre Inhaltsblöcke (Reihenfolge)
1. **Warum KORODUR** – die drei Kernaussagen (Schnelligkeit / Belastbarkeit / Wirtschaftlichkeit) – wie jetzt, kann bleiben
2. **Referenz-Highlights** – 3 starke Bildkarten direkt auf der Startseite (z. B. Kleemann, Guben, Catania) als sozialer Beweis
3. **Portfolio-Kacheln** – Industrieboden / Industriebau / Infrastruktur → „Mehr erfahren"
4. **Footer-CTA Microtop** – dezent, klar abgegrenzt:  
   > *„Auch für Trinkwasser-Infrastruktur: KORODUR Micro-Top – mineralische Systeme nach DVGW. → Mehr erfahren"*

### Navigation (V2)
```
[Logo]  |  Sanierung finden  |  Portfolio ▾  |  Referenzen  |  [DE / EN / FR]
```
Kein eigener Menüpunkt für Tools. Der Assistent ist der Haupteinstieg, erreichbar direkt aus dem Hero.

---

## 5. Microtop-Bereich – Minimalkonzept

Da Microtop eine andere Zielgruppe hat, braucht der Bereich eine eigene Sprache.

### Startseite `/microtop/`
**Headline:** *„Trinkwasser-Infrastruktur dauerhaft schützen – mineralisch, DVGW-konform."*

Inhalte:
- Kurze Produktpositionierung (was ist Microtop, wofür)
- Anwendungsbereiche: Hochbehälter / Türme / Rohrleitungen / Becken
- Referenzen: Haidberg, Bad Nauheim, Budapest
- Mini-Assistent: Behältertyp → Oberfläche → → Produktempfehlung

### Navigation Microtop (eigenständig, kein Menü-Overlap mit Hauptapp)
```
[Logo Microtop] | Produkte | Referenzen | Lösungsfinder | Kontakt
```

---

## 6. Umsetzungsreihenfolge (empfohlen)

| Priorität | Maßnahme | Aufwand |
|---|---|---|
| 🔴 Hoch | Microtop aus Haupt-Navigation entfernen | Niedrig |
| 🔴 Hoch | `/wizard/` und `/konfigurator/` durch `/sanierung-finden/` ersetzen | Mittel |
| 🔴 Hoch | Infra-Unterbereich „Wasser" deaktivieren / ausblenden | Niedrig |
| 🟡 Mittel | Startseite anpassen: Hero-CTA auf neuen Assistenten zeigen | Niedrig |
| 🟡 Mittel | 3 Referenz-Highlights auf Startseite einbauen | Niedrig |
| 🟡 Mittel | Footer-CTA Microtop ergänzen | Niedrig |
| 🟢 Später | `/microtop/` als eigene Route mit Mini-Assistent aufbauen | Mittel–Hoch |
| 🟢 Später | Infrastruktur umbenennen zu „Verkehr & Logistik" | Niedrig |

---

## 7. Was sich NICHT ändern sollte

- Referenzstruktur und Referenzinhalte – die sind stark, einfach weiter befüllen
- Dreisprachigkeit – Struktur beibehalten
- Die drei Portfolio-Bereiche als inhaltliche Tiefenschicht – sie sind richtig, nur nicht als primärer Einstieg

---

## Offene Fragen fürs Terminal

Bevor du anfängst, diese Dinge klären oder im Code prüfen:

1. **Wo ist Microtop im Code verankert?** Suche nach `microtop` oder `MICROTOP` in den Content-Dateien – ist es eine eigene Seite oder nur über Referenzen eingebunden?
2. **Wie ist der Assistent gebaut?** Wizard und Konfigurator – statisches Markdown oder JavaScript-Logik? Das bestimmt den Umbauaufwand.
3. **Gibt es eine `nav.yml` oder ähnliche Konfigurationsdatei** für die Navigation? Dann ist das Ausblenden von Menüpunkten einfach.
4. **Welches Static-Site-Framework?** (Vermutlich MkDocs oder Astro nach dem Look) – das beeinflusst wie Routen angelegt werden.
