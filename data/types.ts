// === NEU: 4-Step-Lösungsfinder (2026-04-22) ===

export type Sanierungsart = "punktuell" | "grossflaechig";

export type AnwendungsbereichKategorie =
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
// Hinweis: weitere Zusatzfunktionen werden nach Experten-Abstimmung ergänzt.

// === LEGACY: werden durch neue Felder ersetzt, bleiben noch im Einsatz ===

/** @deprecated Wird durch `Sanierungsart` (punktuell/grossflaechig) ersetzt. */
export type Massnahme = "kleine-reparatur" | "grossflaechige-sanierung";

/** @deprecated Alte Lösungsfinder-Dimension, entfällt in 4-Step-Wizard. */
export type Belastung =
  | "schwerlast"
  | "leichte-nutzung"
  | "rollende-lasten"
  | "punktlasten";

/** @deprecated Alte Lösungsfinder-Dimension, entfällt komplett. */
export type Zustand =
  | "risse"
  | "abrieb"
  | "hohlstellen"
  | "beschichtungsschaeden"
  | "ebenheitsprobleme";

/** @deprecated Wird durch `Zusatzfunktion` ersetzt. */
export type Sonderbedingung =
  | "chemikalien"
  | "tausalz"
  | "rutschhemmung"
  | "kurze-sperrzeit"
  | "aussenbereich";

/** @deprecated Alter Single-Select-Anwendungsbereich (an Referenz), wird durch `anwendungsbereiche[]` ersetzt. */
export type Anwendungsbereich =
  | "produktionshalle"
  | "lager"
  | "werkstatt"
  | "zufahrt"
  | "parkflaeche"
  | "bruecke"
  | "hafen"
  | "sonstiges";

export type Kategorie = "industrieboden" | "industriebau" | "infrastruktur";

export type Unterkategorie =
  | "schwerlast"
  | "duennschicht"
  | "schnelle-reparaturen"
  | "fugen"
  | "verkehr"
  | "wasser";

export interface Referenz {
  id: string;
  slug: string;
  titel: string;
  untertitel: string;
  kategorie: Kategorie;
  unterkategorie: Unterkategorie;
  ort: string;
  land: string;
  flaeche?: string;
  produkte: string[];
  herausforderungen: string[];
  loesung: string;
  vorteile: string[];
  bild: string;
  bildAlt: string;
  galerieBilder?: string[];

  // === NEU (2026-04-22): 4-Step-Lösungsfinder-Tags ===
  sanierungsart: Sanierungsart;
  anwendungsbereiche: AnwendungsbereichKategorie[];
  /** Wie schnell die Wiederbelastbarkeit im Projekt historisch erforderlich war. Nicht verwechseln mit `Produkt.zeitKategorie` (Produkt-Eigenschaft). */
  zeitDringlichkeit: ZeitKategorie;
  zusatzfunktionen: Zusatzfunktion[];

  // === LEGACY (werden nach vollständiger Umstellung entfernt) ===
  /** @deprecated Nutze `anwendungsbereiche[]`. */
  anwendungsbereich: Anwendungsbereich;
  /** @deprecated Nutze `sanierungsart`. */
  massnahme: Massnahme;
  /** @deprecated Entfällt. */
  belastungen: Belastung[];
  /** @deprecated Entfällt. */
  zustand: Zustand[];
  /** @deprecated Nutze `zusatzfunktionen`. */
  sonderbedingungen: Sonderbedingung[];
}

export interface Verarbeitung {
  untergrundvorbereitung: string;
  mischverhaeltnis: string;
  schichtaufbau: string;
  verarbeitungszeit: string;
  aushaertezeit: string;
  besonderheiten: string;
}

export interface KategorieInfo {
  id: Kategorie;
  titel: string;
  beschreibung: string;
  icon: string;
  unterkategorien: {
    id: Unterkategorie;
    titel: string;
    beschreibung: string;
  }[];
}
