# KORODUR Sanierung App – Redesign-Plan

## Status (Stand: 2026-04-02)

### Phase 1: i18n-Infrastruktur - ABGESCHLOSSEN
- `lib/i18n.ts` – Locale-Typen, Konstanten, Validierung
- `lib/LocaleContext.tsx` – Client-Context für Locale + Dictionary
- `app/[lang]/dictionaries.ts` – Dictionary-Loader mit `server-only`
- `app/[lang]/dictionaries/{de,en,fr}.json` – Vollständige UI-Übersetzungen
- `app/[lang]/layout.tsx` – Neues Root-Layout mit `generateStaticParams`, `LocaleProvider`
- Alle Seiten unter `app/[lang]/` verschoben (Home, Portfolio, 3 Kategorien, Referenzen, Detail)
- Alle Components aktualisiert: Navigation, Footer, Breadcrumb, ReferenceCard, CategoryTile, SubcategoryTile
- Redirect-Stubs für alte URLs (`/portfolio` → `/de/portfolio`, etc.)
- `next.config.ts`: `trailingSlash: true` hinzugefügt
- **Build: 143 statische Seiten** (3 Sprachen × alle Routes + Redirects)

### Phase 2: App-Shell Navigation - ABGESCHLOSSEN
- `components/AppShell.tsx` – Wrapper mit Sidebar-State (open/collapsed), localStorage-Persistenz
- `components/Sidebar.tsx` – Kategorie-Baum mit aufklappbaren Unterkategorien, active-state Highlighting
- `components/TopBar.tsx` – Mobile-Hamburger, Logo (mobile), Sprachschalter
- `components/LanguageSwitcher.tsx` – DE/EN/FR Pill-Schalter mit `usePathname()` zum Locale-Tausch
- `app/[lang]/layout.tsx` – Umgebaut auf AppShell (ersetzt altes Navigation+Footer Pattern)
- `app/globals.css` – CSS-Variablen für Sidebar/TopBar-Dimensionen, Custom Scrollbar
- **Responsive**: Desktop=Sidebar 272px (auf 64px klappbar), Mobile=Drawer-Overlay
- **Build: 143 statische Seiten** (unverändert)
### Phase 3: Interaktive Features - ABGESCHLOSSEN
- `data/usecases.ts` – Use-Case Definitionen: 4 Problembereiche mit 8 spezifischen Problemen → Produkt-Mappings
- `data/konfigurator.ts` – 4-Schritte-Fragebogen mit Scoring-System für Produktempfehlungen
- `components/StepIndicator.tsx` – Fortschrittsanzeige (Dots + Verbindungslinien)
- `components/ResultsPanel.tsx` – Produkt-Karten + passende Referenzen
- `app/[lang]/wizard/page.tsx` – Lösungsfinder: Problembereich → Problem → Empfehlung (3 Schritte)
- `app/[lang]/konfigurator/page.tsx` – Produktberater: Bereich → Belastung → Zeit → Anforderungen → Ranking
- Wizard/Konfigurator in Sidebar (als "Tools" Sektion) und Startseite (als CTA-Karten) integriert
- Alle Texte in DE/EN/FR übersetzt
- **Build: 149 statische Seiten** (+6 neue: wizard + konfigurator × 3 Sprachen)
### Phase 4: Polish & UX - ABGESCHLOSSEN
- CSS @import Reihenfolge behoben (keine Build-Warnings mehr)
- `components/SearchOverlay.tsx` – Volltextsuche über Referenzen, Kategorien, Produkte
- Cmd/Ctrl+K Tastenkombination zum Öffnen der Suche
- Suchfeld mit Tastatur-Navigation (Pfeiltasten + Enter)
- Desktop-Suchbar in TopBar, Mobile-Suchicon
- Animationen: fadeInUp, slideInRight, drawer-Animation, overlay-Fade
- Staggered Animation Delays (.stagger-1 bis .stagger-6)
- Accessibility: Skip-to-Content Link, ARIA-Labels, role="dialog" für Mobile-Drawer
- Focus-Visible Styling für Keyboard-Navigation
- Alte Navigation.tsx entfernt (durch AppShell ersetzt)

---

## Ziel
Die Website in eine moderne, mehrsprachige Web-Applikation umbauen mit:
- App-Shell Layout (Sidebar + Top-Bar)
- Mehrsprachigkeit (DE/EN/FR)
- Interaktive Features (Problem→Lösung Wizard, Produktberater)

## Architektur-Entscheidungen

### i18n-Ansatz
- **Locale-prefixed Routes**: Alle Seiten unter `app/[lang]/` (`/de/...`, `/en/...`, `/fr/...`)
- **JSON-Dictionaries** pro Sprache für UI-Strings
- **Server Components** laden Dictionaries, **Client Context** verteilt sie an Client Components
- **Inhalte stufenweise**: UI sofort in DE/EN/FR, Referenz-/Produktdaten zunächst nur DE
- **Alte URLs** → Client-side Redirects auf `/de/...` (Static Export erlaubt keine Server-Redirects)
- **`trailingSlash: true`** in next.config.ts für GitHub Pages Kompatibilität

### Navigation
- **AppShell-Layout**: Sidebar (280px desktop, Drawer mobile) + Top-Bar (56px)
- **Sidebar**: Kategorie-Baum mit aufklappbaren Unterkategorien + Wizard/Konfigurator-Links
- **Top-Bar**: Logo, Sprachschalter (DE/EN/FR), optionale Suche
- **Responsive**: Desktop=Sidebar sichtbar, Tablet=Icons, Mobile=Hamburger→Drawer

### Interaktive Features
- **Wizard**: 3 Schritte (Problembereich → Spezifisches Problem → Ergebnis)
- **Konfigurator**: 5 Schritte (Bereich → Belastung → Zeitfenster → Anforderungen → Empfehlung)
- Beide filtern aus bestehenden `referenzen` + `produkte` Daten

---

## Phase 1: i18n-Infrastruktur

### Neue Dateien
| Datei | Zweck |
|---|---|
| `lib/i18n.ts` | LOCALES, DEFAULT_LOCALE, Locale-Type, Hilfsfunktionen |
| `lib/LocaleContext.tsx` | Client-Context für Locale + Dictionary |
| `app/[lang]/layout.tsx` | Neues Root-Layout mit `<html lang={lang}>`, Dictionary-Loading, AppShell |
| `app/[lang]/page.tsx` | Startseite (aus `app/page.tsx` verschoben) |
| `app/[lang]/portfolio/page.tsx` | Portfolio-Übersicht |
| `app/[lang]/portfolio/industrieboden/page.tsx` | Kategorie-Seite |
| `app/[lang]/portfolio/industriebau/page.tsx` | Kategorie-Seite |
| `app/[lang]/portfolio/infrastruktur/page.tsx` | Kategorie-Seite |
| `app/[lang]/referenzen/page.tsx` | Referenz-Übersicht mit Filtern |
| `app/[lang]/referenzen/[slug]/page.tsx` | Referenz-Detail |
| `app/[lang]/dictionaries/de.json` | Deutsche UI-Übersetzungen |
| `app/[lang]/dictionaries/en.json` | Englische UI-Übersetzungen |
| `app/[lang]/dictionaries/fr.json` | Französische UI-Übersetzungen |
| `app/[lang]/dictionaries.ts` | Dictionary-Loader (`getDictionary()`) |

### Zu ändernde Dateien
| Datei | Änderung |
|---|---|
| `app/layout.tsx` | Minimales Layout ohne `<html>`, nur `{children}` |
| `app/page.tsx` | Client-Redirect → `/de/` |
| `app/portfolio/**` | Redirect-Stubs → `/de/portfolio/...` |
| `app/referenzen/**` | Redirect-Stubs → `/de/referenzen/...` |
| `next.config.ts` | `trailingSlash: true` hinzufügen |
| `data/types.ts` | Optionale `translations`-Felder für stufenweise Übersetzung |
| Alle Components | `lang`-Prop für locale-aware Links (`/${lang}/portfolio`) |

### Dictionary-Struktur
```json
{
  "nav": { "portfolio": "Portfolio", "referenzen": "Referenzen", "wizard": "Lösungsfinder", "konfigurator": "Produktberater" },
  "home": { "tagline": "Ihr Partner für Sanierung", "hero_title": "Sanieren mit", "hero_cta": "Zum Portfolio", ... },
  "portfolio": { "title": "Unser Produktportfolio", ... },
  "referenzen": { "title": "Alle Referenzen", "filter_reset": "Filter zurücksetzen", "all_areas": "Alle Bereiche", ... },
  "detail": { "challenges": "Herausforderungen", "solution": "Unsere Lösung", "benefits": "Vorteile", "products_used": "Eingesetzte Produkte", ... },
  "common": { "learn_more": "Mehr erfahren", "references": "Referenzen", "back": "Zurück", ... }
}
```

---

## Phase 2: App-Shell Navigation (Sidebar + Top-Bar)

### Neue Dateien
| Datei | Zweck |
|---|---|
| `components/AppShell.tsx` | `"use client"` – Wrapper mit Sidebar-State (open/collapsed), localStorage-Persistenz |
| `components/Sidebar.tsx` | `"use client"` – Kategorie-Baum, Wizard/Konfigurator-Links, collapse-Animation |
| `components/TopBar.tsx` | `"use client"` – Logo, Sprachschalter, Hamburger (mobile) |
| `components/LanguageSwitcher.tsx` | `"use client"` – DE/EN/FR Dropdown, nutzt `usePathname()` zum Locale-Wechsel |

### Layout-Struktur
```
<div class="flex h-screen">
  <Sidebar collapsed={collapsed} />
  <div class="flex flex-col flex-1 overflow-hidden">
    <TopBar onMenuToggle={toggleMobile} />
    <main class="flex-1 overflow-y-auto">
      {children}
      <Footer />
    </main>
  </div>
</div>
```

### Responsive Verhalten
| Viewport | Sidebar | Top-Bar |
|---|---|---|
| Desktop (≥1024px) | 280px sichtbar, auf 64px (Icons) klappbar | Logo + Sprache + Suche |
| Tablet (768-1023px) | 64px Icons, expandiert bei Klick | Logo + Sprache |
| Mobile (<768px) | Versteckt, Drawer-Overlay bei Hamburger | Logo + Hamburger + Sprache |

### CSS-Variablen (globals.css)
```css
--sidebar-width: 280px;
--sidebar-collapsed: 64px;
--topbar-height: 56px;
```

---

## Phase 3: Interaktive Features

### Neue Dateien
| Datei | Zweck |
|---|---|
| `data/usecases.ts` | Use-Case Definitionen (Problem → Kategorie → Produkte) |
| `data/konfigurator.ts` | Konfigurator-Schritte (Fragen, Optionen, Filter-Logik) |
| `app/[lang]/wizard/page.tsx` | Problem→Lösung Wizard |
| `app/[lang]/konfigurator/page.tsx` | Produktberater |
| `components/WizardStep.tsx` | Kachel-basierte Auswahl pro Schritt |
| `components/KonfiguratorStep.tsx` | Fragebogen-Schritt (Radio/Checkbox) |
| `components/ResultsPanel.tsx` | Ergebnis-Anzeige (Produkte + Referenzen) |
| `components/StepIndicator.tsx` | Fortschritts-Anzeige (Dots/Bar) |

### Wizard-Flow
```
Schritt 1: Problembereich wählen
  → "Boden" / "Bauteil" / "Verkehrsfläche" / "Wasserbauwerk"

Schritt 2: Spezifisches Problem
  → z.B. für "Boden": "Risse & Abplatzungen" / "Verschleiß" / "Unebenheit" / "Fugenschäden"

Schritt 3: Ergebnis
  → Passende Produkte mit technischen Daten
  → Passende Referenzen als Erfolgsbeispiele
```

### Konfigurator-Flow
```
Schritt 1: "Was möchten Sie sanieren?"
  → Industrieboden / Industriebau / Infrastruktur

Schritt 2: "Welche Belastung?"
  → Schwerlast / Normal / Leicht

Schritt 3: "Wie viel Zeit haben Sie?"
  → < 24h / 2-3 Tage / Flexibel

Schritt 4: "Besondere Anforderungen?"
  → Frostbeständig / Trinkwassertauglich / WHG-konform / Keine

Schritt 5: Ergebnis
  → Ranking der empfohlenen Produkte mit Begründung
  → Passende Referenzen
```

---

## Phase 4: Polish & UX

- **Suche**: Client-side Volltextsuche über Referenzen, Produkte, Kategorien (Cmd/Ctrl+K)
- **View Transitions**: Sanfte Seitenübergänge (Next.js 16 `viewTransition` Option)
- **Animationen**: Sidebar collapse/expand, Card-Entrance (staggered fade-in), Filter-Übergänge
- **404-Seite**: Übersetzt pro Sprache
- **Accessibility**: ARIA-Labels, Fokus-Management, Keyboard-Navigation, Skip-to-Content

---

## Reihenfolge & Abhängigkeiten

```
Phase 1 (i18n) ──→ Phase 2 (Navigation) ──→ Phase 3 (Interaktiv) ──→ Phase 4 (Polish)
                                              ↑ Phase 4 teilweise parallel möglich
```

## Build-Impact
- Aktuell: ~38 statische Seiten
- Nach Redesign: ~120 Seiten (3 Locales × ~40 Routes)
- Build-Zeit bleibt akzeptabel für Static Export
