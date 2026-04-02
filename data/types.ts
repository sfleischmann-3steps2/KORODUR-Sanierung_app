export type Kategorie = "industrieboden" | "industriebau" | "infrastruktur";

export type Unterkategorie =
  | "schwerlast"
  | "duennschicht"
  | "schnelle-reparaturen"
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
