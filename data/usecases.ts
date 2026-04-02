import type { Kategorie, Unterkategorie } from "./types";

export interface UseCase {
  id: string;
  problemArea: string;
  problemAreaIcon: string;
  problems: Problem[];
}

export interface Problem {
  id: string;
  label: string;
  beschreibung: string;
  kategorie: Kategorie;
  unterkategorie: Unterkategorie;
  empfohleneProdukte: string[];
  tags: string[];
}

export const useCases: UseCase[] = [
  {
    id: "boden",
    problemArea: "Boden",
    problemAreaIcon: "floor",
    problems: [
      {
        id: "boden-verschleiss",
        label: "Verschleiß & Abrieb",
        beschreibung: "Der Boden zeigt starke Abnutzung durch Schwerlastverkehr, Stapler oder Kettenfahrzeuge.",
        kategorie: "industrieboden",
        unterkategorie: "schwerlast",
        empfohleneProdukte: ["NEODUR HE 60 rapid", "NEODUR HE 65 Plus", "NEODUR HE 65"],
        tags: ["schwerlast", "verschleiss", "abrieb"],
      },
      {
        id: "boden-unebenheit",
        label: "Unebenheit & Niveauausgleich",
        beschreibung: "Der Boden ist uneben, hat Höhenunterschiede oder muss nivelliert werden.",
        kategorie: "industrieboden",
        unterkategorie: "duennschicht",
        empfohleneProdukte: ["NEODUR Level", "KORODUR PC", "KORODUR FSCem Screed"],
        tags: ["dünnschicht", "nivellierung", "ebenheit"],
      },
      {
        id: "boden-risse",
        label: "Risse & Abplatzungen",
        beschreibung: "Punktuelle Schäden wie Risse, Abplatzungen oder Ausbrüche müssen schnell repariert werden.",
        kategorie: "industrieboden",
        unterkategorie: "schnelle-reparaturen",
        empfohleneProdukte: ["Rapid Set CEMENT ALL", "Rapid Set MORTAR MIX", "Rapid Set CONCRETE MIX"],
        tags: ["reparatur", "risse", "schnell"],
      },
    ],
  },
  {
    id: "bauteil",
    problemArea: "Bauteil & Konstruktion",
    problemAreaIcon: "building",
    problems: [
      {
        id: "bauteil-fugen",
        label: "Fugenschäden",
        beschreibung: "Sinus-, Trenn- oder Schwerlastfugen sind beschädigt und müssen instandgesetzt werden.",
        kategorie: "industriebau",
        unterkategorie: "fugen",
        empfohleneProdukte: ["Rapid Set MORTAR MIX DUR", "Rapid Set MORTAR MIX"],
        tags: ["fugen", "profile", "schwerlast"],
      },
      {
        id: "bauteil-reparatur",
        label: "Treppen, Kanten & Bauteile",
        beschreibung: "Treppen, Überladebrücken, Absenksteine oder andere Bauteile müssen schnell repariert werden.",
        kategorie: "industriebau",
        unterkategorie: "schnelle-reparaturen",
        empfohleneProdukte: ["Rapid Set CEMENT ALL", "Rapid Set MORTAR MIX", "Rapid Set CONCRETE MIX"],
        tags: ["reparatur", "treppen", "kanten", "schnell"],
      },
    ],
  },
  {
    id: "verkehr",
    problemArea: "Verkehrsfläche",
    problemAreaIcon: "road",
    problems: [
      {
        id: "verkehr-bruecke",
        label: "Brücken & Parkhäuser",
        beschreibung: "Fahrbahnbeläge, Abdichtungen oder Beschichtungen auf Brücken und in Parkhäusern sind beschädigt.",
        kategorie: "infrastruktur",
        unterkategorie: "verkehr",
        empfohleneProdukte: ["NEODUR HE 65 Plus", "KOROCRETE Schnellbeton", "DUROP"],
        tags: ["brücke", "parkhaus", "verkehr", "außen"],
      },
      {
        id: "verkehr-asphalt",
        label: "Asphalt & Logistikflächen",
        beschreibung: "Asphaltflächen, Hafenterminals oder Logistikareale brauchen schnelle, belastbare Reparaturen.",
        kategorie: "infrastruktur",
        unterkategorie: "verkehr",
        empfohleneProdukte: ["ASPHALT REPAIR MIX", "KOROCRETE Schnellbeton", "NEODUR HE 65 Plus"],
        tags: ["asphalt", "hafen", "logistik", "außen"],
      },
    ],
  },
  {
    id: "wasser",
    problemArea: "Wasserbauwerk",
    problemAreaIcon: "water",
    problems: [
      {
        id: "wasser-trinkwasser",
        label: "Trinkwasserbehälter & -türme",
        beschreibung: "Trinkwasserbehälter oder -türme müssen nach DVGW-Standards mineralisch saniert werden.",
        kategorie: "infrastruktur",
        unterkategorie: "wasser",
        empfohleneProdukte: ["MICROTOP TW"],
        tags: ["trinkwasser", "dvgw", "mineralisch", "beschichtung"],
      },
    ],
  },
];

export function getUseCaseById(id: string): UseCase | undefined {
  return useCases.find((uc) => uc.id === id);
}

export function getProblemById(problemId: string): Problem | undefined {
  for (const uc of useCases) {
    const p = uc.problems.find((p) => p.id === problemId);
    if (p) return p;
  }
  return undefined;
}
