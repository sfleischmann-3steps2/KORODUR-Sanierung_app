import type { Referenz, Massnahme, Belastung, Zustand, Sonderbedingung } from "./types";
import { referenzen } from "./referenzen";
import { produkte, type Produkt } from "./produkte";

/* ---- Step-Definitionen ---- */

export interface FlowOption<T extends string> {
  id: T | "nicht-bekannt" | "keine";
  label: string;
  beschreibung?: string;
}

export interface FlowStep<T extends string> {
  id: string;
  frage: string;
  mehrfach: boolean;
  exklusiv?: string[];
  optionen: FlowOption<T>[];
}

export const step1: FlowStep<Massnahme> = {
  id: "situation",
  frage: "Was ist Ihre Situation?",
  mehrfach: false,
  optionen: [
    {
      id: "kleine-reparatur",
      label: "Kleine Reparatur",
      beschreibung: "Punktuelle Schäden wie Risse, Ausbrüche oder Löcher",
    },
    {
      id: "grossflaechige-sanierung",
      label: "Großflächige Sanierung",
      beschreibung: "Ganzheitliche Erneuerung eines Industriebodens",
    },
  ],
};

export const step2: FlowStep<Belastung> = {
  id: "belastung",
  frage: "Welche Belastungen muss der Boden künftig aushalten?",
  mehrfach: true,
  exklusiv: ["nicht-bekannt"],
  optionen: [
    { id: "schwerlast", label: "Schwerlast (Stapler, LKW)" },
    { id: "leichte-nutzung", label: "Leichte Nutzung (Fußgänger, leichte Wagen)" },
    { id: "rollende-lasten", label: "Rollende Lasten" },
    { id: "punktlasten", label: "Punktlasten (Regale, Maschinen)" },
    { id: "nicht-bekannt", label: "Nicht bekannt" },
  ],
};

export const step3: FlowStep<Zustand> = {
  id: "zustand",
  frage: "Wie sieht der aktuelle Zustand aus?",
  mehrfach: true,
  exklusiv: ["nicht-bekannt"],
  optionen: [
    { id: "risse", label: "Risse / Ausbrüche" },
    { id: "abrieb", label: "Abrieb / Verschleiß" },
    { id: "hohlstellen", label: "Hohlstellen / Ablösungen" },
    { id: "beschichtungsschaeden", label: "Beschichtungsschäden" },
    { id: "ebenheitsprobleme", label: "Ebenheitsprobleme" },
    { id: "nicht-bekannt", label: "Nicht bekannt" },
  ],
};

export const step4: FlowStep<Sonderbedingung> = {
  id: "sonderbedingungen",
  frage: "Gibt es besondere Anforderungen?",
  mehrfach: true,
  exklusiv: ["nicht-bekannt", "keine"],
  optionen: [
    { id: "chemikalien", label: "Chemikalienbeständigkeit" },
    { id: "tausalz", label: "Tausalzbeständigkeit" },
    { id: "rutschhemmung", label: "Rutschhemmung" },
    { id: "kurze-sperrzeit", label: "Kurze Sperrzeit (schnelle Nutzung)" },
    { id: "aussenbereich", label: "Außenbereich / Witterung" },
    { id: "keine", label: "Keine besonderen Anforderungen" },
    { id: "nicht-bekannt", label: "Nicht bekannt" },
  ],
};

/* ---- Scoring ---- */

export interface UserSelection {
  massnahme: string;
  belastungen: string[];
  zustand: string[];
  sonderbedingungen: string[];
}

export interface ScoredReferenz {
  referenz: Referenz;
  score: number;
  matchingTags: string[];
}

export interface FlowErgebnis {
  referenzen: ScoredReferenz[];
  produkte: Produkt[];
}

export function berechneErgebnisse(auswahl: UserSelection): FlowErgebnis {
  const scored: ScoredReferenz[] = referenzen.map((ref) => {
    let score = 0;
    const matchingTags: string[] = [];

    // Massnahme (weight 3)
    if (auswahl.massnahme !== "nicht-bekannt" && ref.massnahme === auswahl.massnahme) {
      score += 3;
      matchingTags.push(ref.massnahme);
    }

    // Belastungen (weight 2 each)
    const belastungen = auswahl.belastungen.filter((b) => b !== "nicht-bekannt");
    for (const b of belastungen) {
      if (ref.belastungen.includes(b as Belastung)) {
        score += 2;
        matchingTags.push(b);
      }
    }

    // Zustand (weight 1 each)
    const zustand = auswahl.zustand.filter((z) => z !== "nicht-bekannt");
    for (const z of zustand) {
      if (ref.zustand.includes(z as Zustand)) {
        score += 1;
        matchingTags.push(z);
      }
    }

    // Sonderbedingungen (weight 2 each)
    const sonder = auswahl.sonderbedingungen.filter(
      (s) => s !== "nicht-bekannt" && s !== "keine"
    );
    for (const s of sonder) {
      if (ref.sonderbedingungen.includes(s as Sonderbedingung)) {
        score += 2;
        matchingTags.push(s);
      }
    }

    return { referenz: ref, score, matchingTags };
  });

  // Sort descending, only matches with score > 0
  const sortiert = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  // Extract unique products from top references
  const produktNamen = new Set<string>();
  for (const s of sortiert.slice(0, 10)) {
    for (const p of s.referenz.produkte) {
      produktNamen.add(p);
    }
  }

  const matchedProdukte = produkte.filter((p) => produktNamen.has(p.name));

  return {
    referenzen: sortiert,
    produkte: matchedProdukte,
  };
}
