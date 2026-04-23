# Matching-Report: App-Referenzen ↔ Notion

**Stand:** 2026-04-23 · **App-Refs:** 26 · **Notion-Refs (Sanierung, ohne Trinkwasser-only):** 33

**Heuristik:** Score = 3×Ort-Token-Overlap + 2×Produkt-Overlap + 4×Name-Token-Match (Marke/Branche, Ort excludiert) + 1×Land.

- **A1 sicher** = Score ≥ 5 (Name-Match bestätigt Marke/Branche zusätzlich zum Ort).
- **A2 wahrscheinlich** = Score = 4 (nur Ort+Land matchen, kein Name-Token-Treffer) — bitte einmal kurz prüfen.
- **B unklar** = Mehrere ähnlich-starke Kandidaten oder Score < 4 — manuelle Entscheidung.
- **C nur App** = keine Notion-Entsprechung → in Schritt 2 dort anlegen.
- **D nur Notion** = nicht in App → in Schritt 4 importieren.

---

## A1 — Sichere Matches (5)

| App-Slug | App-Titel · Ort | Notion-Titel · Ort | Score | Begründung |
|---|---|---|---|---|
| `antolin-wochenend-sanierung` | Sanierung übers Wochenende · Ebergassing | Antolin, Ebergassing (2018) · Ebergassing | 8 | ort:ebergassing / name:antolin / land:osterreich |
| `kleemann-produktionshalle` | Produktionshalle Kleemann · Göppingen | Kleemann, Göppingen · Göppingen | 8 | ort:goppingen / name:kleemann / land:deutschland |
| `weag-entsorgungsbetrieb` | WEAG Entsorgungsbetrieb · Deutschland | WEAG Recycling, Köngen (2023) · Köngen | 5 | name:weag / land:deutschland |
| `dhl-ueberadebruecken` | DHL Überladebrücken · Ottendorf-Okrilla | DHL Paketzentrum, Ottendorf-Okrilla (2017) · Ottendorf-Okrilla | 7 | ort:okrilla,ottendorf / land:deutschland |
| `hafen-catania` | Hafen Catania · Catania, Sizilien | Hafen-Zufahrt, Catania (2024) · Catania | 8 | ort:catania / name:hafen / land:italien |

## A2 — Wahrscheinliche Matches (3) — bitte kurz bestätigen

Match nur über Ort+Land (kein Name-Token-Treffer). Plausibel, weil im selben Ort bisher nur dieses Notion-Projekt vorliegt.

| App-Slug | App-Titel · Ort | Notion-Titel · Ort | App-Produkte | Notion-Produkte |
|---|---|---|---|---|
| `monheim-produktionsflaeche` | Produktionsfläche Monheim · Monheim | apt Extrusions, Monheim am Rhein (2021/2022) · Monheim am Rhein | KOROCRETE Schnellbeton, KORODUR HB 5 rapid | — |
| `wochenend-sanierung-werkstatt` | Wochenend-Sanierung Werkstatt · Neutraubling | Werkstattboden-Sanierung, Neutraubling (2022) · Neutraubling | NEODUR HE 60 rapid, KORODUR HB 5 rapid | — |
| `guben-produktionshalle` | Produktionshalle Guben · Guben | Megaflex Schaumstoff, Guben (2020) · Guben | NEODUR Level, KORODUR PC | — |

## B — Unklare Matches (0) — bitte entscheiden

## C — Nur App, kein Notion-Match (18) — Kandidaten für Delta-Writeback

| App-Slug | App-Titel · Ort | Produkte |
|---|---|---|
| `strandkorbhalle-sylt` | Strandkorbhalle Sylt · Sylt | NEODUR HE 65, KORODUR HB 5 rapid |
| `loosen-werkzeug-klausen` | Sanierung im laufenden Betrieb – Loosen · Klausen (Moselregion) | KOROCRETE Schnellbeton, KORODUR HB 5 rapid |
| `nike-store-polen` | Nike Store Polen · Szczecin | TRU Self-Leveling |
| `obstplantage-ibbenbueren` | Obstplantage Ibbenbüren · Ibbenbüren | KORODUR FSCem Screed, NEODUR HE 60 rapid |
| `sanierung-einer-sanierung` | Sanierung einer Sanierung · Deutschland | NEODUR Level |
| `lkw-waschstrasse` | LKW Waschstraße · Deutschland | NEODUR HE 60 rapid, KORODUR HB 5 rapid, KOROMINERAL CURE |
| `helipad-sanierung-polen` | Helipad Sanierung Polen · Płock | NEODUR HE 65 Plus |
| `fugensanierung-lyreco` | Fugensanierung Lyreco · Schweiz | Rapid Set MORTAR MIX |
| `treppenstufen-sanierung` | Treppenstufen Sanierung · Deutschland | Rapid Set CONCRETE MIX, Rapid Set CEMENT ALL |
| `sinusfugen-sanierung` | Sinusfugen Sanierung · Deutschland | Rapid Set MORTAR MIX DUR, KORODUR PC |
| `trennfugen-bohnenkamp` | Trennfugen Sanierung Bohnenkamp · Deutschland | Rapid Set MORTAR MIX |
| `absenksteine-tankstelle` | Absenksteine schnell verlegt · Spreewald | Rapid Set MORTAR MIX |
| `lkw-einstellplatz-berlin` | LKW Einstellplatz Berlin · Berlin | Rapid Set MORTAR MIX |
| `parkhaus-flughafen-zuerich` | Parkhaus Flughafen Zürich · Zürich | Epoxidharz-System |
| `theodor-heuss-bruecke` | Theodor-Heuss-Brücke · Mainz / Wiesbaden | — |
| `autohaus-versmold` | Autohaus Versmold · Versmold | ASPHALT REPAIR MIX |
| `hubschrauber-landeplatz-finnland` | Hubschrauber-Landeplatz Finnland · Mikkeli | NEODUR HE 65 Plus |
| `lkw-umfahrt-darmstadt` | LKW-Umfahrt Darmstadt · Darmstadt | KOROCRETE Schnellbeton, KOROMINERAL CURE |

## D — Nur Notion, in App nicht vorhanden (25) — Kandidaten für Forward-Import (Schritt 4)

| Notion-Titel | Ort, Land | Sanierungsart | Einsatzbereich | Produkte |
|---|---|---|---|---|
| Sanierung LKW-Zufahrt Logistikzentrum Spedition Brummer, Sankt Marienkirchen (Österreich) | Sankt Marienkirchen bei Schärding, Österreich | Großflächig | Lager & Logistik, Infrastruktur & Zufahrten | ["Rapid Set Zement"] |
| TEXACO Tankfläche, Arnheim (2018) | Arnheim, Niederlande | Großflächig | Infrastruktur & Zufahrten, Verkaufsräume | — |
| Naturex, Burgdorf (2013) | Burgdorf, Schweiz | Großflächig | Lebensmittel | ["Rapid Set CONCRETE MIX","SET Control"] |
| Torschwelle Lagerhalle (unbekannter Ort) (2017) | , Deutschland | Großflächig | Lager & Logistik | — |
| Wellpappenfabrik Gross, Versmold (2013) | Versmold, Deutschland | Großflächig | Industrie- & Produktionshalle, Lebensmittel | — |
| KORODUR Demo, Bochum-Wattenscheid (2012) | Bochum-Wattenscheid, Deutschland | Punktuell | Lager & Logistik, Industrie- & Produktionshalle | — |
| Kreisverkehr, Göppingen (2021) | Göppingen, Deutschland | Punktuell | Infrastruktur & Zufahrten | — |
| Barmenia Parkhaus, Wuppertal (2015) | Wuppertal, Deutschland | Großflächig | Parkdeck | — |
| John Lewis Lager, Stevenage (2013) | Stevenage, UK | Großflächig | Lager & Logistik, Verkaufsräume | ["Rapid Set Cement All"] |
| Fraport, Frankfurt/Main (2012) | Frankfurt/Main, Deutschland | Großflächig | Lager & Logistik, Flugzeug, Infrastruktur & Zufahrten | — |
| SNCF, Bordeaux (2016) | Bordeaux, Frankreich | Punktuell | Infrastruktur & Zufahrten | — |
| Parkhaus Freiburger Münster, Freiburg | Freiburg, Deutschland | Großflächig | Lebensmittel, Parkdeck, Verkaufsräume | — |
| Olympiastadion Berlin (2023) | Berlin, Deutschland | Großflächig | Industrie- & Produktionshalle, Infrastruktur & Zufahrten | — |
| WIRTGEN Produktionshallen, weltweit | weltweit (Deutschland, Europa, Naher Osten, China, Asien, Australien), Andorra | Großflächig | Industrie- & Produktionshalle, Infrastruktur & Zufahrten | — |
| FH Lichtschacht, Nürnberg (2012) | Nürnberg, Deutschland | Punktuell | Infrastruktur & Zufahrten | — |
| Kläranlage, Nakło (2014) | Nakło, Polen | Punktuell | Verkaufsräume, Trinkwasser | — |
| Brückensanierung, Amberg (2012) | Amberg, Deutschland | Punktuell | Infrastruktur & Zufahrten | — |
| Parkplatzsanierung, Metzingen (2017) | Metzingen, Deutschland | Punktuell | Parkdeck, Infrastruktur & Zufahrten | — |
| Schachtregulierung Fahrbahn, Nittenau (2019) | Nittenau, Deutschland | Punktuell | Lager & Logistik, Infrastruktur & Zufahrten | — |
| Treppensanierung Gehweg, Esslingen (2015) | Esslingen, Deutschland | Punktuell | Infrastruktur & Zufahrten | — |
| Burger King, Münster-Hiltrup (2021) | Münster-Hiltrup, Deutschland | Großflächig | Lebensmittel, Verkaufsräume | — |
| Kraftwerk, Bergamo (2011) | Bergamo, Italien | Großflächig | Industrie- & Produktionshalle | — |
| Fahrbahnsanierung, Wien (2020) | Wien, Österreich | Punktuell | Infrastruktur & Zufahrten | — |
| Oélie/Saur, Saint-Étienne (2024) | Saint-Étienne, Frankreich | Punktuell | Parkdeck, Infrastruktur & Zufahrten | — |
| Decathlon, Dortmund-Aplerbeck (2023) | Dortmund-Aplerbeck, Deutschland | Großflächig | Verkaufsräume | — |
