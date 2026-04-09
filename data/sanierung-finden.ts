import { referenzen } from "./referenzen";
import { getProduktByName, type Produkt } from "./produkte";
import type { Referenz } from "./types";

// === Step definitions ===

export interface SanierungOption {
  id: string;
  labelKey: string;
  descriptionKey?: string;
  icon?: string;
}

export interface SanierungStep {
  id: string;
  questionKey: string;
  options: SanierungOption[];
}

export const sanierungSteps: SanierungStep[] = [
  {
    id: "bereich",
    questionKey: "sanierung.step1_question",
    options: [
      { id: "industrieboden", labelKey: "sanierung.opt_industrieboden", descriptionKey: "sanierung.opt_industrieboden_desc", icon: "factory" },
      { id: "industriebau", labelKey: "sanierung.opt_industriebau", descriptionKey: "sanierung.opt_industriebau_desc", icon: "building" },
      { id: "verkehr", labelKey: "sanierung.opt_verkehr", descriptionKey: "sanierung.opt_verkehr_desc", icon: "road" },
    ],
  },
  {
    id: "massnahme",
    questionKey: "sanierung.step2_question",
    options: [
      { id: "punktuell", labelKey: "sanierung.opt_punktuell", descriptionKey: "sanierung.opt_punktuell_desc" },
      { id: "flaechensanierung", labelKey: "sanierung.opt_flaechensanierung", descriptionKey: "sanierung.opt_flaechensanierung_desc" },
      { id: "unsicher", labelKey: "sanierung.opt_unsicher", descriptionKey: "sanierung.opt_unsicher_desc" },
    ],
  },
  {
    id: "zeit",
    questionKey: "sanierung.step3_question",
    options: [
      { id: "stunden", labelKey: "sanierung.opt_stunden", descriptionKey: "sanierung.opt_stunden_desc" },
      { id: "wochenende", labelKey: "sanierung.opt_wochenende", descriptionKey: "sanierung.opt_wochenende_desc" },
      { id: "flexibel", labelKey: "sanierung.opt_flexibel", descriptionKey: "sanierung.opt_flexibel_desc" },
    ],
  },
];

// === Scoring & Recommendations ===

export interface Recommendation {
  produkt: Produkt;
  score: number;
  isBestMatch: boolean;
}

export interface SanierungResult {
  produkte: Recommendation[];
  referenzen: Referenz[];
}

export function getRecommendations(answers: Record<string, string>): SanierungResult {
  const scores: Record<string, number> = {};
  const addScore = (name: string, points: number) => {
    scores[name] = (scores[name] || 0) + points;
  };

  const bereich = answers.bereich;
  const massnahme = answers.massnahme;
  const zeit = answers.zeit;

  // --- Bereich scoring ---
  if (bereich === "industrieboden") {
    addScore("NEODUR HE 60 rapid", 3);
    addScore("NEODUR HE 65 Plus", 3);
    addScore("NEODUR HE 65", 2);
    addScore("NEODUR Level", 2);
    addScore("KORODUR FSCem Screed", 1);
    addScore("Rapid Set CEMENT ALL", 1);
  } else if (bereich === "industriebau") {
    addScore("Rapid Set CEMENT ALL", 3);
    addScore("Rapid Set MORTAR MIX", 3);
    addScore("Rapid Set MORTAR MIX DUR", 2);
    addScore("Rapid Set CONCRETE MIX", 2);
  } else if (bereich === "verkehr") {
    addScore("NEODUR HE 65 Plus", 3);
    addScore("KOROCRETE Schnellbeton", 3);
    addScore("ASPHALT REPAIR MIX", 2);
    addScore("DUROP", 1);
  }

  // --- Massnahme scoring ---
  if (massnahme === "punktuell") {
    // Favors repair products
    addScore("Rapid Set CEMENT ALL", 3);
    addScore("Rapid Set MORTAR MIX", 2);
    addScore("Rapid Set CONCRETE MIX", 2);
    addScore("ASPHALT REPAIR MIX", 2);
    addScore("Rapid Set MORTAR MIX DUR", 1);
  } else if (massnahme === "flaechensanierung") {
    // Favors screeds and large-area systems
    addScore("NEODUR HE 60 rapid", 3);
    addScore("NEODUR HE 65 Plus", 3);
    addScore("NEODUR HE 65", 2);
    addScore("NEODUR Level", 2);
    addScore("KORODUR FSCem Screed", 2);
    addScore("KOROCRETE Schnellbeton", 2);
  } else if (massnahme === "unsicher") {
    // Broader set, moderate scores
    addScore("NEODUR HE 60 rapid", 1);
    addScore("NEODUR HE 65 Plus", 1);
    addScore("Rapid Set CEMENT ALL", 1);
    addScore("Rapid Set MORTAR MIX", 1);
    addScore("KOROCRETE Schnellbeton", 1);
  }

  // --- Zeit scoring ---
  if (zeit === "stunden") {
    // Fast-cure bonus
    addScore("Rapid Set CEMENT ALL", 3);
    addScore("Rapid Set MORTAR MIX", 2);
    addScore("NEODUR HE 60 rapid", 2);
    addScore("ASPHALT REPAIR MIX", 2);
  } else if (zeit === "wochenende") {
    addScore("NEODUR HE 60 rapid", 1);
    addScore("NEODUR HE 65 Plus", 1);
    addScore("KOROCRETE Schnellbeton", 1);
  }
  // "flexibel" adds no time bonus

  // Sort by score, take top products
  const sorted = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4);

  const topScore = sorted[0]?.[1] || 0;
  const produkte: Recommendation[] = sorted
    .map(([name, score]) => {
      const produkt = getProduktByName(name);
      if (!produkt) return null;
      return { produkt, score, isBestMatch: score === topScore };
    })
    .filter((r): r is Recommendation => r !== null)
    .slice(0, 2);

  // Find matching references
  const bereichToKategorie: Record<string, string> = {
    industrieboden: "industrieboden",
    industriebau: "industriebau",
    verkehr: "infrastruktur",
  };
  const kategorie = bereichToKategorie[bereich] || bereich;

  // Filter references by category, exclude Microtop/wasser
  const matchingRefs = referenzen
    .filter((r) => r.kategorie === kategorie && r.unterkategorie !== "wasser")
    .slice(0, 3);

  return {
    produkte,
    referenzen: matchingRefs,
  };
}
