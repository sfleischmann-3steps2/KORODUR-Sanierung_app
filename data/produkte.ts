import type { Verarbeitung, Belastung, Sonderbedingung, Massnahme, ZeitKategorie, Zusatzfunktion } from "./types";

// ---------------------------------------------------------------------------
// HINWEIS — 4-Step-Lösungsfinder-Migration (2026-04-22)
// Das Feld `zeitKategorie` ist aktuell heuristisch gesetzt (Name-Matching auf
// "rapid"/"schnell"/"ESC" + Grundierungen → "schnell", Rest → "normal").
// Das finale Mapping muss mit Produktmanagement im Workshop bestätigt werden.
// Ebenso `zusatzfunktionen`: aktuell leer bis auf explizit bekannte Fälle.
// Spec: docs/superpowers/specs/2026-04-22-loesungsfinder-4step-design.md
// ---------------------------------------------------------------------------

export interface Produkt {
  id: string;
  name: string;
  kategorie: "estrich" | "grundierung" | "schnellzement" | "beschichtung" | "nachbehandlung" | "sonstige";
  kurzbeschreibung: string;
  schichtdicke?: string;
  qualitaetsklasse?: string;
  normen: string[];
  technischeDaten: { label: string; wert: string }[];
  besonderheiten: string[];
  websiteUrl?: string;
  verarbeitung?: Verarbeitung;
  tdsUrl?: string;

  // === NEU (2026-04-22): 4-Step-Lösungsfinder ===
  /**
   * Zeit-Kategorie des Produkts. Platzhalter "normal" bis Experten-Tagging erfolgt.
   * TODO (Experten-Workshop): TDS-basiert pro Produkt auf schnell/mittel/normal setzen.
   */
  zeitKategorie: ZeitKategorie;
  /** Zusatzfunktionen, die dieses Produkt inhärent mitbringt. Leer = keine. */
  zusatzfunktionen?: Zusatzfunktion[];

  /** @deprecated Alter Eignungs-Array, entfällt nach Migrationsabschluss. */
  eignungen?: (Belastung | Sonderbedingung | Massnahme)[];
  bild?: string;
}

export const produkte: Produkt[] = [
  // === ESTRICHE ===
  {
    id: "neodur-he-60-rapid",
    name: "NEODUR HE 60 rapid",
    kategorie: "estrich",
    kurzbeschreibung: "Hartstoff-Schnellestrich – volle Belastbarkeit nach 24 h",
    schichtdicke: "10–60 mm",
    qualitaetsklasse: "CT-C60-F8-A6",
    normen: [
      "DIN EN 13813",
      "DIN 18560",
      "DIN 18202 (Ebenheit)",
    ],
    technischeDaten: [
      { label: "Druckfestigkeit", wert: "≥ 60 N/mm²" },
      { label: "Biegezugfestigkeit", wert: "≥ 8 N/mm²" },
      { label: "Verschleißwiderstand", wert: "A6 (≤ 6 cm³/50 cm²)" },
      { label: "Begehbar nach", wert: "ca. 4–6 h" },
      { label: "Voll belastbar nach", wert: "ca. 24 h" },
    ],
    besonderheiten: [
      "Hohe Abriebfestigkeit",
      "Chemikalienbeständig",
      "Schnelle Erhärtung",
      "Schwindarm",
    ],
    verarbeitung: {
      untergrundvorbereitung: "Tragfähiger, sauberer, rauer Betonuntergrund. Kugelstrahlen oder Fräsen empfohlen. Grundierung mit KORODUR HB 5 rapid.",
      mischverhaeltnis: "25 kg Pulver auf ca. 3,0–3,25 l Wasser. Mischzeit: 3 Minuten mit Zwangsmischer.",
      schichtaufbau: "Einschichtig 10–60 mm auf Haftbrücke KORODUR HB 5 rapid.",
      verarbeitungszeit: "Ca. 20–30 Minuten bei 20 °C.",
      aushaertezeit: "Begehbar nach ca. 4–6 h. Voll belastbar nach ca. 24 h.",
      besonderheiten: "Verarbeitungstemperatur: +5 °C bis +30 °C. Nicht auf gefrorenem Untergrund verarbeiten.",
    },
    tdsUrl: "https://www.korodur.de/downloads/tds-neodur-he-60-rapid.pdf",
    eignungen: ["grossflaechige-sanierung", "schwerlast", "rollende-lasten", "chemikalien", "kurze-sperrzeit"],
    bild: "/images/produkte/neodur-he-60-rapid.png",
    zeitKategorie: "schnell",
    zusatzfunktionen: ["chemikalienbestaendigkeit"],
  },
  {
    id: "neodur-he-65-plus",
    name: "NEODUR HE 65 Plus",
    kategorie: "estrich",
    kurzbeschreibung: "Hochbelastbarer Hartstoffestrich für Innen und Außen – ohne Haftbrücke",
    schichtdicke: "15–30 mm",
    qualitaetsklasse: "CT-C70-F9-A6",
    normen: [
      "DIN EN 13813",
      "DIN 18560",
      "DIN EN 13687 (Frost-/Tausalzbeständigkeit)",
      "WHG (Wasserhaushaltsgesetz)",
    ],
    technischeDaten: [
      { label: "Druckfestigkeit", wert: "≥ 70 N/mm²" },
      { label: "Biegezugfestigkeit", wert: "≥ 9 N/mm²" },
      { label: "Verschleißwiderstand", wert: "A6 (≤ 6 cm³/50 cm²)" },
      { label: "Frost-/Tausalzbeständig", wert: "Ja" },
      { label: "Haftbrücke erforderlich", wert: "Nein" },
    ],
    besonderheiten: [
      "Ohne Haftbrücke verarbeitbar",
      "Frost- & tausalzbeständig",
      "WHG-tauglich",
      "Polymermodifiziert & faserverstärkt",
    ],
    verarbeitung: {
      untergrundvorbereitung: "Tragfähiger Betonuntergrund, fräsen oder kugelstrahlen. Keine Haftbrücke erforderlich.",
      mischverhaeltnis: "25 kg Pulver auf ca. 3,0–3,5 l Wasser. Zwangsmischer erforderlich.",
      schichtaufbau: "Einschichtig 15–30 mm direkt auf vorbereiteten Untergrund.",
      verarbeitungszeit: "Ca. 30–40 Minuten bei 20 °C.",
      aushaertezeit: "Begehbar nach ca. 6–8 h. Voll belastbar nach ca. 48 h.",
      besonderheiten: "Frost- und tausalzbeständig. Auch für Außenbereiche geeignet. WHG-konform.",
    },
    tdsUrl: "https://www.korodur.de/downloads/tds-neodur-he-65-plus.pdf",
    eignungen: ["grossflaechige-sanierung", "schwerlast", "rollende-lasten", "chemikalien", "tausalz", "aussenbereich"],
    zeitKategorie: "normal",
    zusatzfunktionen: ["chemikalienbestaendigkeit", "tausalzbestaendigkeit"],
  },
  {
    id: "neodur-level",
    name: "NEODUR Level",
    kategorie: "estrich",
    kurzbeschreibung: "Selbstverlaufender Hartstoff-Dünnestrich für präzise Bodensanierung",
    schichtdicke: "4–10 mm",
    qualitaetsklasse: "CT-C40-F8-AR0,5",
    normen: [
      "DIN EN 13813",
      "DIN 18560",
      "DIN 18202 Zeile 3 (erhöhte Ebenheit)",
    ],
    technischeDaten: [
      { label: "Druckfestigkeit", wert: "≥ 40 N/mm²" },
      { label: "Biegezugfestigkeit", wert: "≥ 8 N/mm²" },
      { label: "Verschleißwiderstand", wert: "AR0,5 (≤ 0,5 cm³/50 cm²)" },
      { label: "Selbstverlaufend", wert: "Ja" },
      { label: "Ebenheit", wert: "DIN 18202, Zeile 3" },
    ],
    besonderheiten: [
      "Selbstverlaufend – sehr gute Ebenheit",
      "Schnelle Nutzbarkeit",
      "Integrierter Verschleißträger",
      "Maschinell verarbeitbar",
    ],
    verarbeitung: {
      untergrundvorbereitung: "Tragfähiger, sauberer Betonuntergrund. Kugelstrahlen empfohlen. Grundierung mit KORODUR PC erforderlich.",
      mischverhaeltnis: "25 kg Pulver auf ca. 5,0–5,5 l Wasser. Zwangsmischer, 3 Minuten Mischzeit.",
      schichtaufbau: "Einschichtig 4–10 mm auf Grundierung KORODUR PC. Selbstverlaufend.",
      verarbeitungszeit: "Ca. 20–30 Minuten bei 20 °C.",
      aushaertezeit: "Begehbar nach ca. 4–6 h. Voll belastbar nach ca. 24 h.",
      besonderheiten: "Maschinelle Verarbeitung möglich. Für große Flächen mit Pumptechnik geeignet.",
    },
    tdsUrl: "https://www.korodur.de/downloads/tds-neodur-level.pdf",
    eignungen: ["grossflaechige-sanierung", "leichte-nutzung", "rollende-lasten"],
    bild: "/images/produkte/neodur-level.png",
    zeitKategorie: "normal",
  },

  // === GRUNDIERUNGEN / HAFTBRÜCKEN ===
  {
    id: "korodur-hb-5-rapid",
    name: "KORODUR HB 5 rapid",
    kategorie: "grundierung",
    kurzbeschreibung: "Schnellerhärtende Haftbrücke für kraftschlüssigen Verbund zum Untergrund",
    normen: [
      "DIN EN 1504-4",
    ],
    technischeDaten: [
      { label: "Haftzugfestigkeit", wert: "≥ 1,5 N/mm²" },
      { label: "Verarbeitungszeit", wert: "ca. 15 min" },
      { label: "Überarbeitbar nach", wert: "frisch-in-frisch" },
    ],
    besonderheiten: [
      "Schnelle Erhärtung",
      "Hohe Haftzugwerte",
      "Frisch-in-frisch Verarbeitung",
    ],
    eignungen: ["kleine-reparatur", "kurze-sperrzeit"],
    bild: "/images/produkte/korodur-hb5-rapid.png",
    zeitKategorie: "schnell",
  },
  {
    id: "korodur-pc",
    name: "KORODUR PC",
    kategorie: "grundierung",
    kurzbeschreibung: "Grundierung für Dünnestrich-Systeme",
    normen: [
      "DIN EN 1504-4",
    ],
    technischeDaten: [
      { label: "Haftzugfestigkeit", wert: "≥ 1,0 N/mm²" },
      { label: "Anwendung", wert: "Für NEODUR Level" },
    ],
    besonderheiten: [
      "Speziell für Dünnestrich-Systeme",
      "Polymermodifiziert",
    ],
    eignungen: ["grossflaechige-sanierung"],
    zeitKategorie: "schnell",
  },

  // === SCHNELLZEMENTE / MÖRTEL ===
  {
    id: "rapid-set-cement-all",
    name: "Rapid Set CEMENT ALL",
    kategorie: "schnellzement",
    kurzbeschreibung: "Universeller Schnellzement für punktuelle Reparaturen",
    normen: [
      "ASTM C928",
      "DIN EN 1504-3",
    ],
    technischeDaten: [
      { label: "Druckfestigkeit (1 h)", wert: "≥ 21 N/mm²" },
      { label: "Druckfestigkeit (24 h)", wert: "≥ 42 N/mm²" },
      { label: "Begehbar nach", wert: "ca. 15 min" },
      { label: "Voll belastbar nach", wert: "ca. 1 h" },
    ],
    besonderheiten: [
      "Ultrakurze Aushärtezeit",
      "Hohe Frühfestigkeit",
      "Innen und Außen einsetzbar",
      "Schwundkompensiert",
    ],
    verarbeitung: {
      untergrundvorbereitung: "Sauberer, tragfähiger Untergrund. Lose Teile entfernen, anfeuchten.",
      mischverhaeltnis: "Ca. 2,8 l Wasser pro 25 kg Sack. Nur mit sauberem Wasser mischen.",
      schichtaufbau: "Einschichtig 6–100 mm. Für größere Schichtdicken mehrlagig möglich.",
      verarbeitungszeit: "Ca. 15 Minuten bei 20 °C.",
      aushaertezeit: "Begehbar nach ca. 15 min. Voll belastbar nach ca. 1 h.",
      besonderheiten: "Kein Haftvermittler erforderlich. Verarbeitung bei +5 °C bis +35 °C.",
    },
    tdsUrl: "https://www.korodur.de/downloads/tds-rapid-set-cement-all.pdf",
    eignungen: ["kleine-reparatur", "kurze-sperrzeit", "aussenbereich"],
    bild: "/images/produkte/rapid-set-cement-all.png",
    zeitKategorie: "schnell",
  },
  {
    id: "rapid-set-mortar-mix",
    name: "Rapid Set MORTAR MIX",
    kategorie: "schnellzement",
    kurzbeschreibung: "Schnellmörtel für Fugen, Reprofilierung und Einbau von Profilen",
    normen: [
      "ASTM C928",
      "DIN EN 1504-3",
    ],
    technischeDaten: [
      { label: "Druckfestigkeit (1 h)", wert: "≥ 21 N/mm²" },
      { label: "Druckfestigkeit (24 h)", wert: "≥ 42 N/mm²" },
      { label: "Verarbeitbar", wert: "pastös bis plastisch" },
      { label: "Belastbar nach", wert: "ca. 1–2 h" },
    ],
    besonderheiten: [
      "Schwundneutral",
      "Kein Haftvermittler nötig",
      "Pastöse bis steife Konsistenz einstellbar",
      "Nur mit Wasser mischen",
    ],
    eignungen: ["kleine-reparatur", "kurze-sperrzeit"],
    bild: "/images/produkte/rapid-set-mortar-mix.png",
    zeitKategorie: "schnell",
  },
  {
    id: "rapid-set-concrete-mix",
    name: "Rapid Set CONCRETE MIX",
    kategorie: "schnellzement",
    kurzbeschreibung: "Schnellbeton für strukturelle Reparaturen und Kantenreprofilierung",
    normen: [
      "ASTM C928",
      "DIN EN 1504-3",
    ],
    technischeDaten: [
      { label: "Druckfestigkeit (1 h)", wert: "≥ 21 N/mm²" },
      { label: "Druckfestigkeit (28 d)", wert: "≥ 55 N/mm²" },
      { label: "Belastbar nach", wert: "ca. 1–2 h" },
    ],
    besonderheiten: [
      "Grobe Körnung für strukturelle Reparaturen",
      "Hohe Endfestigkeit",
      "Frostbeständig",
    ],
    eignungen: ["kleine-reparatur", "schwerlast", "kurze-sperrzeit", "tausalz", "aussenbereich"],
    bild: "/images/produkte/rapid-set-concrete-mix.png",
    zeitKategorie: "schnell",
    zusatzfunktionen: ["tausalzbestaendigkeit"],
  },
  {
    id: "korocrete",
    name: "KOROCRETE Schnellbeton",
    kategorie: "schnellzement",
    kurzbeschreibung: "Schnellbeton für Großflächen – volumetrisch mischbar vor Ort",
    normen: [
      "DIN EN 206",
      "DIN 1045-2",
    ],
    technischeDaten: [
      { label: "Druckfestigkeit (24 h)", wert: "≥ 35 N/mm²" },
      { label: "Druckfestigkeit (28 d)", wert: "≥ 55 N/mm²" },
      { label: "Befahrbar nach", wert: "ca. 4–6 h" },
      { label: "Mischung", wert: "volumetrisch vor Ort" },
    ],
    besonderheiten: [
      "Volumetrische Mischtechnik vor Ort",
      "Kein Restbeton / minimale Verluste",
      "Großflächig einsetzbar",
      "Hochbelastbar",
    ],
    eignungen: ["grossflaechige-sanierung", "schwerlast", "rollende-lasten", "kurze-sperrzeit"],
    zeitKategorie: "schnell", // TODO-Workshop: TDS deutet eher auf "mittel" (befahrbar 4–6 h)
  },

  {
    id: "rapid-set-mortar-mix-dur",
    name: "Rapid Set MORTAR MIX DUR",
    kategorie: "schnellzement",
    kurzbeschreibung: "Schnellmörtel mit integriertem Verschleißträger für Fugenreparaturen",
    normen: [
      "ASTM C928",
      "DIN EN 1504-3",
    ],
    technischeDaten: [
      { label: "Druckfestigkeit (1 h)", wert: "≥ 21 N/mm²" },
      { label: "Druckfestigkeit (24 h)", wert: "≥ 42 N/mm²" },
      { label: "Verarbeitbar", wert: "pastös bis plastisch" },
      { label: "Belastbar nach", wert: "ca. 2 h" },
    ],
    besonderheiten: [
      "Integrierter Verschleißträger",
      "Für Schwerlastfugen geeignet",
      "Schwundneutral",
      "Pastöse Konsistenz einstellbar",
    ],
    eignungen: ["kleine-reparatur", "schwerlast", "punktlasten", "kurze-sperrzeit"],
    zeitKategorie: "schnell",
  },
  {
    id: "asphalt-repair-mix",
    name: "ASPHALT REPAIR MIX",
    kategorie: "schnellzement",
    kurzbeschreibung: "Schnellreparaturmischung für Asphaltflächen – ohne Haftbrücke",
    normen: [
      "DIN EN 1504-3",
    ],
    technischeDaten: [
      { label: "Schichtdicke", wert: "30–80 mm" },
      { label: "Belastbar nach", wert: "ca. 2 h" },
      { label: "Haftbrücke", wert: "Nicht erforderlich" },
    ],
    besonderheiten: [
      "Für Asphaltflächen geeignet",
      "Ohne Haftbrücke",
      "Einfache Verarbeitung",
      "Hohe Belastbarkeit",
    ],
    eignungen: ["kleine-reparatur", "grossflaechige-sanierung", "schwerlast", "rollende-lasten", "kurze-sperrzeit", "aussenbereich"],
    bild: "/images/produkte/asphalt-repair-mix.png",
    zeitKategorie: "normal",
  },
  {
    id: "korodur-fscem-screed",
    name: "KORODUR FSCem Screed",
    kategorie: "estrich",
    kurzbeschreibung: "Ausgleichsestrich für unterschiedliche Einbauhöhen",
    normen: [
      "DIN EN 13813",
      "DIN 18560",
    ],
    technischeDaten: [
      { label: "Schichtdicke", wert: "45–115 mm" },
      { label: "Anwendung", wert: "Ausgleichsschicht" },
    ],
    besonderheiten: [
      "Große Schichtdicken möglich",
      "Als Ausgleichsschicht einsetzbar",
      "Schnelle Erhärtung",
    ],
    eignungen: ["grossflaechige-sanierung", "kurze-sperrzeit"],
    bild: "/images/produkte/korodur-fscem-screed.png",
    zeitKategorie: "normal",
  },
  {
    id: "neodur-he-65",
    name: "NEODUR HE 65",
    kategorie: "estrich",
    kurzbeschreibung: "Hartstoffestrich für Innen- und Außenbereiche mit Silotechnik",
    normen: [
      "DIN EN 13813",
      "DIN 18560",
    ],
    technischeDaten: [
      { label: "Druckfestigkeit", wert: "≥ 65 N/mm²" },
      { label: "Verschleißwiderstand", wert: "A6 (≤ 6 cm³/50 cm²)" },
      { label: "Verarbeitung", wert: "Silosystem / Pumptechnik" },
    ],
    besonderheiten: [
      "Witterungsbeständig",
      "Mit Silosystem verarbeitbar",
      "Wirtschaftlich auf Großflächen",
      "Kraftschlüssiger Verbund",
    ],
    eignungen: ["grossflaechige-sanierung", "schwerlast", "rollende-lasten", "aussenbereich"],
    bild: "/images/produkte/neodur-he-65.png",
    zeitKategorie: "normal",
  },

  {
    id: "tru-self-leveling",
    name: "TRU Self-Leveling",
    kategorie: "estrich",
    kurzbeschreibung: "Selbstverlaufender Sichtestrich für designorientierte Bodenlösungen",
    normen: [
      "DIN EN 13813",
    ],
    technischeDaten: [
      { label: "Optik", wert: "Betonähnliche Sichtestrich-Oberfläche" },
      { label: "Verarbeitung", wert: "Selbstverlaufend" },
      { label: "Haftbrücke", wert: "Nicht erforderlich" },
    ],
    besonderheiten: [
      "Designorientierte Betonoptik",
      "Fugenlose Oberfläche",
      "Ohne Haftbrücke",
      "Hygienisch & pflegeleicht",
    ],
    eignungen: ["grossflaechige-sanierung", "leichte-nutzung"],
    zeitKategorie: "normal",
  },
  // === NACHBEHANDLUNG ===
  {
    id: "korocure",
    name: "KOROCURE",
    kategorie: "nachbehandlung",
    kurzbeschreibung: "Curing-Compound zur kontrollierten Nachbehandlung von Estrichflächen",
    normen: [
      "DIN EN 13813",
    ],
    technischeDaten: [
      { label: "Wirkung", wert: "Feuchtigkeitsretention / Curing" },
      { label: "Anwendung", wert: "Sprüh- oder Rollauftrag" },
    ],
    besonderheiten: [
      "Kontrollierte Aushärtung",
      "Für Außenflächen geeignet",
      "Reduziert Schwindrisse",
    ],
    eignungen: ["grossflaechige-sanierung", "aussenbereich"],
    zeitKategorie: "normal",
  },
  {
    id: "koromineral-cure",
    name: "KOROMINERAL CURE",
    kategorie: "nachbehandlung",
    kurzbeschreibung: "Oberflächenschutz mittels Silikatisierung",
    normen: [
      "DIN EN 13813",
    ],
    technischeDaten: [
      { label: "Wirkung", wert: "Silikatisierung / Imprägnierung" },
      { label: "Anwendung", wert: "Auf frischen Estrich" },
    ],
    besonderheiten: [
      "Erhöht Oberflächenhärte",
      "Reduziert Staubbildung",
      "Verbessert chemische Beständigkeit",
    ],
    eignungen: ["grossflaechige-sanierung", "chemikalien"],
    zeitKategorie: "normal",
  },
  {
    id: "korotex",
    name: "KOROTEX",
    kategorie: "nachbehandlung",
    kurzbeschreibung: "Curing-Mittel zur kontrollierten Aushärtung",
    normen: [
      "DIN EN 13813",
    ],
    technischeDaten: [
      { label: "Wirkung", wert: "Feuchtigkeitsretention / Curing" },
      { label: "Anwendung", wert: "Sprühauftrag" },
    ],
    besonderheiten: [
      "Kontrollierte Aushärtung",
      "Reduziert Schwindrisse",
      "Sprühbare Anwendung",
    ],
    eignungen: ["grossflaechige-sanierung"],
    zeitKategorie: "normal",
  },
];

export function getProduktByName(name: string): Produkt | undefined {
  return produkte.find(
    (p) => p.name === name || p.name.toLowerCase() === name.toLowerCase()
  );
}

export function getProduktById(id: string): Produkt | undefined {
  return produkte.find((p) => p.id === id);
}

export function getProdukteByNames(names: string[]): Produkt[] {
  return names
    .map((name) => getProduktByName(name))
    .filter((p): p is Produkt => p !== undefined);
}
