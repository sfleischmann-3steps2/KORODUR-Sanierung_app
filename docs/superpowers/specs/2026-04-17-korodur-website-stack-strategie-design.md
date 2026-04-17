# KORODUR Website-Relaunch — Stack- & Vorgehensstrategie

**Stand:** 2026-04-17
**Status:** Design — zur Freigabe
**Autorin:** Steffi (Applied AI Manager, KORODUR) + Claude Code
**Bezug:** KORODUR-Sanierung_app (Sanierungs-App V2.3) + korodur-website (Relaunch-Projekt, Phase 3)

---

## Executive Summary

Die Sanierungs-App (Next.js Static Export, V2.3 live, 4 Sprachen) wird **die Keimzelle der neuen korodur.de**. Statt WordPress zu modernisieren oder einen Big-Bang-Relaunch zu wagen, gehen wir **hybrid**: Die alte WP-Seite bleibt parallel live, die neue Website entsteht auf demselben Stack wie die Sanierungs-App, und Bereich für Bereich werden URLs von alt auf neu per 301 umgezogen.

Der Tech-Stack wird **nicht final festgenagelt** — stattdessen legen wir jetzt nur die Entscheidungen fest, die risikofrei sind (Frontend, CMS-Kategorie, Datenmodell-Prinzipien, Multi-Locale-Struktur). Die konkrete CMS-Wahl (Payload-Favorit, Sanity-Fallback) wird durch einen **parallelen Prototyp-Test** evidenzbasiert getroffen, nicht per Bauchentscheidung.

Die Sanierungs-App bleibt weiterhin das Flow-Labor: dort wird UX geschärft, während im Hintergrund ein CMS-Prototyp aufgebaut wird.

---

## 1. Ausgangslage

### Sanierungs-App (dieses Repo)
- **Live:** sfleischmann-3steps2.github.io/KORODUR-Sanierung_app/
- **Stack:** Next.js 16 Static Export, TypeScript, Tailwind, GitHub Pages
- **Umfang:** 270 Seiten (4 Sprachen × Routen), 26 Referenzen, 16 Produkte, 3 Portfolio-Bereiche, Produktfinder, Produktmatrix, Volltextsuche
- **Status:** V2.3 — produktiv, gepflegt, technisch sauber
- **Inhalte:** in `.ts`-Files, typisiert, CMS-agnostisch

### korodur.de (bestehende Website)
- **Stack:** WordPress 6.9 + Astra + Elementor Pro + WooCommerce + WPML + 14 Plugins
- **Audit-Ergebnis (2026-03-24):** rot in Stack, Performance, SEO, URL-Struktur
  - Kein H1 auf Homepage, 858 URLs inkl. Duplikaten, WooCommerce als B2B-Katalog missbraucht
  - Doppelstruktur `/bereiche/` vs. `/produkt-kategorie/`, jQuery-Abhängigkeit, 30+ JS-Bundles
  - Kein Standard-Analytics → keine Traffic-Baseline für den Relaunch
- **Inhalte:** ~280 einzigartige Seiten, 71 Produkte, 131 Referenzen, dreisprachig DE/EN/FR

### Relaunch-Projekt (Repo: `korodur-website`)
- Phasen 1–2 abgeschlossen (technisches Audit, Content-Audit, Benchmark, Feature-Matrix)
- Phase 3 in Arbeit: **neue IA steht** (`ia_new.md`) — 6 Top-Level-Menüpunkte, drei Zielgruppen-Einstiege, 858 → 284 URLs konsolidiert
- **Diese IA ist CMS-agnostisch** und trägt alle hier diskutierten Stacks

---

## 2. Strategische Leitentscheidungen (jetzt)

### 2.1 Vorgehensmodell: Hybrid (parallel alt + neu)

Wir verwerfen zwei Extrem-Varianten:

- **Nicht Big Bang:** alte Seite komplett ersetzen zu einem Stichtag — zu risikoreich bei 858 URLs, 131 Referenzen und fehlenden Analytics-Daten.
- **Nicht Element-Einbau in WP:** neue App-Bausteine per iframe oder Web Components in WordPress einbetten — führt zu gemischten Designsystemen, doppelten Headern, kaputtem SEO.

Gewählt: **Parallelbetrieb auf Subdomain, bereichsweise Umzug via 301-Redirect.**

- Neue Website lebt auf `neu.korodur.de` (oder Staging-Domain).
- Jedes Bereich, das fertig ist, wird produktiv: WP-URL → 301 → neue URL.
- Am Ende ist WP leergeräumt und wird abgeschaltet. Zeithorizont: realistisch 12–24 Monate.

### 2.2 Frontend-Stack: Next.js

Entschieden — weil bereits in der Sanierungs-App produktiv, gleiches Team, gleiche Typen, gleiches Build-System. Die Sanierungs-App ist faktisch der Prototyp des neuen Frontends.

### 2.3 CMS-Kategorie: Headless, strukturierte Inhalte

Entschieden — weil:
- 2–3 Redakteure brauchen eine Editor-UI (rein Git-basierte Lösungen scheiden aus)
- Agenten sollen Inhalte anlegen können (strukturierte Felder + Draft-Workflow nötig)
- Bilder + Dokumente (TDS, SDS, DoP, LV) brauchen Metadaten, nicht nur Mediathek-Dump
- Multi-Locale (siehe 2.5) muss feldlevel funktionieren

Ausgeschlossen: Elementor-artige Page Builder, Git-only Markdown, Jet Engine auf WP.

### 2.4 Konkretes CMS-Produkt: *nicht jetzt* festlegen

**Favorit: Payload CMS 3.0.** Gründe:
- Läuft selbst als Next.js-App → ein Repo, ein Deploy, ein Typsystem
- Self-hosted, keine Seat-Kosten, kein Vendor-Lock-in
- Feldlevel-Lokalisierung nativ (Multi-Locale out of the box)
- Drafts + Review-Workflow + Rollen nativ
- Agent-API: REST + lokaler API-Call innerhalb desselben Node-Prozesses

**Fallback: Sanity.** Bessere editorielle UX in Randfällen, aber SaaS und bei Skalierung kostenpflichtig.

**Entscheidung per Evidenz:** Wir bauen einen Payload-Prototyp (siehe Abschnitt 5), migrieren dort einen Content-Typ (Referenzen), testen mit 1–2 realen Redakteuren + einem Agenten-Workflow. Nach 2–4 Wochen wissen wir, ob Payload trägt, oder ob wir auf Sanity umziehen.

### 2.5 Datenmodell: Multi-Locale von Tag 1

KORODUR-Länder in den nächsten 2–3 Jahren: **DACH (DE, AT, CH), FR, PL, IT, NL** — möglicherweise mehr. Deshalb bauen wir das Modell **skalierbar**, nicht auf 4 Sprachen begrenzt.

**Kategorisierung jedes Content-Felds:**

| Typ | Beispiele | Verhalten |
|---|---|---|
| **Sprachinvariant** | Produktname, Markenname, numerische Werte, Bilder | identisch in allen Locales |
| **Lokalisiert (pro Sprache)** | Beschreibung, Slogan, Überschriften | übersetzt — DE/EN/FR/PL/IT/NL |
| **Regionalisiert (pro Land)** | Ansprechpartner, Distributoren, Zertifizierungen (DVGW/ACS/WRAS), Impressum, zulässige Produkte | kann pro Land unterschiedlich sein |
| **Sprache + Land** | rechtliche Texte, AGB, Preisangaben (falls irgendwann) | Matrix: Sprache × Land |

**Fallback-Logik:** Wenn für eine Locale (z. B. DE-AT) kein Override existiert, greift DE-DE. Diese Logik muss das CMS unterstützen — Payload und Sanity tun das.

**Fallunterscheidung in der Sanierungs-App heute:** noch nicht nötig — aktuell ist nur Sprache (DE/EN/FR/PL) umgestellt. Die Typen in `data/*.ts` müssen aber so gebaut werden, dass regionalisierte Felder nachträglich ohne Breaking Change ergänzt werden können.

### 2.6 Hosting: nicht GitHub Pages

GitHub Pages reicht für die Sanierungs-App heute, hat aber harte Grenzen bei:
- 301-Redirects (für die 858 WP-URLs nicht sauber machbar)
- Custom Headers (Security, Caching)
- SSR-Fallbacks (Händlerfinder, Verbrauchsrechner, Agent-Endpoints)

Ziel-Hosting: **Cloudflare Pages** (empfohlen wegen Edge-Netzwerk + Workers für serverseitige Logik) oder **Vercel** (einfachste Next.js-Integration). Finale Wahl später.

---

## 3. Was wir *nicht* jetzt entscheiden

| Thema | Optionen | Entscheidungszeitpunkt |
|---|---|---|
| Konkretes CMS | Payload (Favorit) / Sanity (Fallback) | nach Payload-Prototyp (4–6 Wochen) |
| Konkretes Hosting | Cloudflare Pages / Vercel / Netlify | bei erstem Produktiv-Deployment |
| Suche | Pagefind (statisch) / Algolia (hosted) | bei Suche-Redesign |
| Formulare | Formspree / Basin / eigener Worker | bei erstem Formular-Bereich |
| Analytics | Plausible / Matomo / GA4 | kritisch: **jetzt auf alter WP-Seite installieren** (Baseline!) |
| E-Commerce (falls je) | nicht geplant | — |

---

## 4. Multi-Locale: konkretes Modell

### 4.1 Locale-Liste (startbar)

| Locale | Sprache | Land | Priorität |
|---|---|---|---|
| `de-de` | Deutsch | Deutschland | Phase 1 |
| `de-at` | Deutsch | Österreich | Phase 2 |
| `de-ch` | Deutsch | Schweiz | Phase 2 |
| `en` | Englisch | (international, Default für Export) | Phase 1 |
| `fr-fr` | Französisch | Frankreich | Phase 1 |
| `pl-pl` | Polnisch | Polen | Phase 1 |
| `it-it` | Italienisch | Italien | Phase 2 |
| `nl-nl` | Niederländisch | Niederlande | Phase 2 |

`de-de` ist `x-default`. Englisch kann zusätzlich pro Land ausdifferenziert werden (`en-gb`, `en-us`), aber erst, wenn konkreter Bedarf da ist.

### 4.2 URL-Schema

```
korodur.de/de/                 → x-default (Deutsch, keine Länder-Markierung)
korodur.de/de-at/              → Deutsch, Österreich
korodur.de/de-ch/              → Deutsch, Schweiz
korodur.de/en/                 → Englisch international
korodur.de/fr/                 → Französisch, Frankreich (kurz, da nur 1 FR-Land)
korodur.de/pl/
korodur.de/it/
korodur.de/nl/
```

Wir **vermeiden** `/fr-fr/`, solange es nur ein FR-Land gibt — das hält URLs schlank. Erweiterungspfad bleibt offen (`/fr-be/` ergänzbar).

### 4.3 Content-Typ-Beispiel: Referenz

```typescript
type Referenz = {
  // sprachinvariant
  slug: string;
  jahr: number;
  flaeche_qm: number;
  bilder: Image[];

  // lokalisiert (pro Sprache)
  titel: Localized<string>;
  beschreibung: Localized<string>;
  herausforderungen: Localized<string[]>;

  // regionalisiert (pro Land) — NEU gegenüber heute
  sichtbar_in_laendern: CountryCode[];  // z. B. nur DACH sichtbar
  ansprechpartner_land: RegionalizedBy<CountryCode, Kontakt>;
}
```

Die Sanierungs-App-Typen müssen schon jetzt so gebaut werden, dass `sichtbar_in_laendern` und `regionalisiert`-Felder nachträglich hinzugefügt werden können, ohne bestehende Aufrufer zu brechen.

---

## 5. Vorgehensplan: Ansatz B — UX + CMS parallel

### 5.1 Zwei parallele Spuren

**Spur 1 — UX-Werkstatt in der Sanierungs-App (Steffi + Claude)**
- Flows schärfen, die auf der neuen Website gebraucht werden
- Content bleibt vorerst in `.ts`-Files
- Mögliche Schwerpunkte (Auswahl treffen — siehe offene Punkte):
  - Produktfinder-Vertiefung (Taxonomie aus `docs/taxonomie-vorschlag-loesungsfinder.md` produktiv machen)
  - Referenz-Flow (Filter + Galerie + Produkt↔Referenz-Verknüpfung)
  - Planer-Bereich als neuer App-Abschnitt (Ausschreibungstexte, Normen, Systemaufbauten, Download-Center)

**Spur 2 — Payload-CMS-Prototyp (neu aufzusetzen)**
- Eigenes Next.js-Repo oder Integration in die Sanierungs-App
- Content-Typ **Referenz** als Testfall migrieren (26 Stück aus `data/referenzen.ts`)
- Editor-Test mit 1–2 realen KORODUR-Redakteuren
- Agent-Test: Workflow "Agent liest PPTX → legt Referenz-Draft in Payload an → Mensch prüft → Publish"
- Entscheidungs-Kriterien dokumentieren (UX, Performance, Deployment, Agent-DX)

### 5.2 Zeitfenster

| Woche | Spur 1 (UX) | Spur 2 (CMS-Prototyp) |
|---|---|---|
| 1 | Flow-Priorisierung (eine der drei Spuren starten) | Payload-Repo aufsetzen, Schema für Referenz definieren |
| 2–3 | Flow-Arbeit | Migration 26 Referenzen + Editor-Tests + Agent-Prototyp |
| 4 | Reviewpoint mit Kollegen | Entscheidung Payload ja/nein |
| 5+ | nächste Flow-Spur | wenn Payload: zweiter Content-Typ (Produkt) |

### 5.3 Was danach kommt

Nach bestätigter CMS-Wahl: schrittweise Migration gemäß IA aus dem `korodur-website`-Repo (Phase-1-Reihenfolge: Produkte → Planer → Download-Center → Unternehmen → Referenzen → Homepage). Die Sanierungs-App wird dabei zur `/sanierung/`-Route der neuen Website.

---

## 6. Risiken & Gegenmaßnahmen

| Risiko | Auswirkung | Gegenmaßnahme |
|---|---|---|
| Payload erfüllt Editor-Anforderungen nicht | 4 Wochen "verloren" | 4-Wochen-Timebox, dann Sanity-Prototyp als Plan B |
| WP-Seite verschlechtert sich während der Parallelphase | SEO-Verlust auf alter Seite | Minimale Hygiene auf WP (H1s, Meta-Descriptions, keine Funktions-Neuentwicklung) |
| Fehlende Traffic-Daten → Priorisierung nach Bauchgefühl | Fehlinvestition in Bereiche mit wenig Relevanz | **GA4 oder Plausible sofort auf WP installieren**, 3 Monate Baseline sammeln |
| 858 URLs werden nicht sauber umgeleitet | SEO-Crash beim Relaunch | Redirect-Map als CSV pflegen, automatisiert testen |
| Multi-Locale-Nachrüstung wird später teurer | Breaking Changes in Typen | Typen schon jetzt regional-ready anlegen, `sichtbar_in_laendern` als optionales Feld einführen |
| Agent-Workflow liefert minderwertige Inhalte | Redaktions-Mehraufwand | Draft-Only für Agenten, Pflicht-Review vor Publish |

---

## 7. Offene Punkte (vor Start)

1. **Flow-Priorität Spur 1.** Welche der drei Spuren (Produktfinder / Referenz-Flow / Planer-Bereich) starten wir zuerst? — Empfehlung folgt nach Rücksprache.
2. **Redakteure benennen.** Wer ist in Spur 2 Editor-Testperson? (Ziel: 1–2 Personen aus KORODUR mit realen Pflege-Cases.)
3. **Domain / Staging.** Bekommt der Prototyp eine Subdomain wie `prototyp.korodur.de` oder bleibt er auf Vercel-Preview-URLs?
4. **Analytics auf WP.** Wer installiert GA4/Plausible auf korodur.de? (sollte *nächste Woche* passieren, unabhängig vom Relaunch)
5. **Agent-Use-Cases konkret.** Welche zwei Agenten-Flows sind am wertvollsten? Vorschlag: (a) PPTX → Referenz-Draft, (b) Produktdatenblatt-Update aus Notion-DB ziehen.

---

## 8. Entscheidungs-Log

| Datum | Entscheidung | Begründung |
|---|---|---|
| 2026-03-23 | Schrittweiser Relaunch (korodur-website-Repo) | Risikoreduzierung |
| 2026-03-23 | WordPress bleibt vorerst als CMS | Migration zu komplex für Phase 1 |
| **2026-04-17** | **Sanierungs-App wird Keimzelle der neuen Website** | **Einheitlicher Stack, keine Iframe-Kompromisse** |
| **2026-04-17** | **Frontend: Next.js festgelegt** | **Produktiv bewährt in Sanierungs-App** |
| **2026-04-17** | **CMS-Kategorie: Headless strukturiert** | **Editor-UI + Agent-Workflow + Multi-Locale** |
| **2026-04-17** | **Konkretes CMS: später, nach Payload-Prototyp** | **Evidenzbasierte Entscheidung, 4-Wochen-Timebox** |
| **2026-04-17** | **Multi-Locale-Modell: Sprache × Land, 8 Startlocales** | **DACH + FR + PL + IT + NL + EN international** |

---

## 9. Nächste konkrete Schritte (nach Freigabe dieses Specs)

1. User-Review dieses Specs → Freigabe oder Änderungen
2. Konzept in Notion-Seite "Website-Konzeption Phase 3" übernehmen (sobald Notion-MCP wieder verfügbar, oder per Copy-Paste jetzt)
3. Flow-Priorität festlegen (Offener Punkt 1)
4. Implementation-Plan schreiben (Skill: writing-plans) — zweigleisig: UX-Spur 1 + Prototyp-Spur 2
5. Analytics-Einbau auf korodur.de parallel anstoßen (unabhängig vom Relaunch, aber zeitkritisch)

---

*Dieser Spec ist die verbindliche Konzeptgrundlage. Änderungen werden im Entscheidungs-Log dokumentiert.*
