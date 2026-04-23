// === Lösungsfinder-Taxonomie (4-Step) ===

export type Sanierungsart = "punktuell" | "grossflaechig";

export type EinsatzbereichKategorie =
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

export interface Referenz {
  id: string;
  slug: string;
  titel: string;
  untertitel: string;
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

  // Lösungsfinder-Tags
  sanierungsart: Sanierungsart;
  einsatzbereiche: EinsatzbereichKategorie[];
  /** Wie schnell die Wiederbelastbarkeit im Projekt historisch erforderlich war. Nicht verwechseln mit `Produkt.zeitKategorie` (Produkt-Eigenschaft). */
  zeitDringlichkeit: ZeitKategorie;
  zusatzfunktionen: Zusatzfunktion[];
}

export interface Verarbeitung {
  untergrundvorbereitung: string;
  mischverhaeltnis: string;
  schichtaufbau: string;
  verarbeitungszeit: string;
  aushaertezeit: string;
  besonderheiten: string;
}
