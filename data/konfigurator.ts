export interface KonfiguratorOption {
  id: string;
  label: string;
  icon?: string;
}

export interface KonfiguratorStep {
  id: string;
  questionKey: string; // translation key
  options: KonfiguratorOption[];
  multiSelect?: boolean;
}

export const konfiguratorSteps: KonfiguratorStep[] = [
  {
    id: "bereich",
    questionKey: "konfigurator.step1_question",
    options: [
      { id: "industrieboden", label: "konfigurator.opt_industrieboden", icon: "factory" },
      { id: "industriebau", label: "konfigurator.opt_industriebau", icon: "building" },
      { id: "infrastruktur", label: "konfigurator.opt_infrastruktur", icon: "road" },
    ],
  },
  {
    id: "belastung",
    questionKey: "konfigurator.step2_question",
    options: [
      { id: "schwerlast", label: "konfigurator.opt_schwerlast" },
      { id: "normal", label: "konfigurator.opt_normal" },
      { id: "leicht", label: "konfigurator.opt_leicht" },
    ],
  },
  {
    id: "zeit",
    questionKey: "konfigurator.step3_question",
    options: [
      { id: "unter-24h", label: "konfigurator.opt_unter_24h" },
      { id: "2-3-tage", label: "konfigurator.opt_2_3_tage" },
      { id: "flexibel", label: "konfigurator.opt_flexibel" },
    ],
  },
  {
    id: "anforderungen",
    questionKey: "konfigurator.step4_question",
    multiSelect: true,
    options: [
      { id: "frostbestaendig", label: "konfigurator.opt_frost" },
      { id: "trinkwasser", label: "konfigurator.opt_trinkwasser" },
      { id: "whg", label: "konfigurator.opt_whg" },
      { id: "keine", label: "konfigurator.opt_keine" },
    ],
  },
];

// Product scoring based on konfigurator answers
export interface ProductScore {
  produktName: string;
  score: number;
  reasons: string[];
}

export function scoreProducts(
  answers: Record<string, string | string[]>
): ProductScore[] {
  const scores: Record<string, { score: number; reasons: string[] }> = {};

  const addScore = (name: string, points: number, reason: string) => {
    if (!scores[name]) scores[name] = { score: 0, reasons: [] };
    scores[name].score += points;
    scores[name].reasons.push(reason);
  };

  const bereich = answers.bereich as string;
  const belastung = answers.belastung as string;
  const zeit = answers.zeit as string;
  const anforderungen = (answers.anforderungen || []) as string[];

  // Bereich-based scoring
  if (bereich === "industrieboden") {
    addScore("NEODUR HE 60 rapid", 3, "bereich");
    addScore("NEODUR HE 65 Plus", 3, "bereich");
    addScore("NEODUR Level", 2, "bereich");
    addScore("NEODUR HE 65", 2, "bereich");
    addScore("KORODUR FSCem Screed", 1, "bereich");
  } else if (bereich === "industriebau") {
    addScore("Rapid Set CEMENT ALL", 3, "bereich");
    addScore("Rapid Set MORTAR MIX", 3, "bereich");
    addScore("Rapid Set MORTAR MIX DUR", 2, "bereich");
    addScore("Rapid Set CONCRETE MIX", 2, "bereich");
  } else if (bereich === "infrastruktur") {
    addScore("NEODUR HE 65 Plus", 3, "bereich");
    addScore("KOROCRETE Schnellbeton", 3, "bereich");
    addScore("ASPHALT REPAIR MIX", 2, "bereich");
    addScore("MICROTOP TW", 2, "bereich");
    addScore("DUROP", 1, "bereich");
  }

  // Belastung-based scoring
  if (belastung === "schwerlast") {
    addScore("NEODUR HE 60 rapid", 2, "belastung");
    addScore("NEODUR HE 65 Plus", 2, "belastung");
    addScore("NEODUR HE 65", 2, "belastung");
    addScore("KOROCRETE Schnellbeton", 2, "belastung");
    addScore("Rapid Set CONCRETE MIX", 1, "belastung");
  } else if (belastung === "normal") {
    addScore("NEODUR HE 60 rapid", 1, "belastung");
    addScore("NEODUR Level", 1, "belastung");
    addScore("Rapid Set CEMENT ALL", 1, "belastung");
  } else if (belastung === "leicht") {
    addScore("NEODUR Level", 2, "belastung");
    addScore("TRU Self-Leveling", 2, "belastung");
  }

  // Zeit-based scoring
  if (zeit === "unter-24h") {
    addScore("Rapid Set CEMENT ALL", 3, "zeit");
    addScore("Rapid Set MORTAR MIX", 2, "zeit");
    addScore("NEODUR HE 60 rapid", 2, "zeit");
    addScore("ASPHALT REPAIR MIX", 2, "zeit");
  } else if (zeit === "2-3-tage") {
    addScore("NEODUR HE 60 rapid", 1, "zeit");
    addScore("NEODUR HE 65 Plus", 1, "zeit");
    addScore("KOROCRETE Schnellbeton", 1, "zeit");
  }
  // "flexibel" adds no time-based bonus

  // Anforderungen-based scoring
  if (anforderungen.includes("frostbestaendig")) {
    addScore("NEODUR HE 65 Plus", 2, "anforderung");
    addScore("KOROCRETE Schnellbeton", 1, "anforderung");
    addScore("Rapid Set CONCRETE MIX", 1, "anforderung");
  }
  if (anforderungen.includes("trinkwasser")) {
    addScore("MICROTOP TW", 5, "anforderung");
  }
  if (anforderungen.includes("whg")) {
    addScore("NEODUR HE 65 Plus", 3, "anforderung");
  }

  return Object.entries(scores)
    .map(([produktName, data]) => ({
      produktName,
      score: data.score,
      reasons: data.reasons,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}
