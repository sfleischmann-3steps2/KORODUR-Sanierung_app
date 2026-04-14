// Neue Typen für Lösungsfinder-Tags
export type Massnahme = "kleine-reparatur" | "grossflaechige-sanierung";

export type Belastung =
  | "schwerlast"
  | "leichte-nutzung"
  | "rollende-lasten"
  | "punktlasten";

export type Zustand =
  | "risse"
  | "abrieb"
  | "hohlstellen"
  | "beschichtungsschaeden"
  | "ebenheitsprobleme";

export type Sonderbedingung =
  | "chemikalien"
  | "tausalz"
  | "rutschhemmung"
  | "kurze-sperrzeit"
  | "aussenbereich";

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
  anwendungsbereich: Anwendungsbereich;
  massnahme: Massnahme;
  belastungen: Belastung[];
  zustand: Zustand[];
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
