import type {
  Referenz,
  Sanierungsart,
  EinsatzbereichKategorie,
  ZeitKategorie,
  Zusatzfunktion,
} from "./types";
import { referenzen } from "./referenzen";
import { produkte, type Produkt } from "./produkte";

// === Step-Definitionen ===

export interface FlowOption<T extends string> {
  id: T;
  label: string;
  beschreibung?: string;
}

export interface FlowStep<T extends string> {
  id: string;
  frage: string;
  mehrfach: boolean;
  optionen: FlowOption<T>[];
}

export const stepSanierungsart: FlowStep<Sanierungsart> = {
  id: "sanierungsart",
  frage: "Was ist Ihre Situation?",
  mehrfach: false,
  optionen: [
    {
      id: "punktuell",
      label: "Punktuelle Sanierung",
      beschreibung: "Kosmetische oder funktionale Reparaturen wichtiger Flächen (Boden, Wand, Decke)",
    },
    {
      id: "grossflaechig",
      label: "Großflächige Sanierung",
      beschreibung: "Sanierungsmaßnahmen bei Restrukturierung, Modernisierung, Umnutzung oder energetischer Sanierung",
    },
  ],
};

export const stepEinsatzbereich: FlowStep<EinsatzbereichKategorie> = {
  id: "einsatzbereich",
  frage: "In welchem Bereich wird saniert?",
  mehrfach: true,
  optionen: [
    { id: "lager-logistik", label: "Lager & Logistik" },
    { id: "industrie-produktion", label: "Industrie- & Produktionshalle" },
    { id: "lebensmittel", label: "Lebensmittel" },
    { id: "flugzeug", label: "Flugzeug (Hangar, Landebahn)" },
    { id: "parkdeck", label: "Parkdeck / Parkhaus / Tiefgarage" },
    { id: "infrastruktur-zufahrten", label: "Infrastruktur & Zufahrten" },
    { id: "verkaufsraeume", label: "Verkaufsräume" },
    { id: "schwerindustrie", label: "Schwerindustrie (Entsorgung, Kettenfahrzeuge)" },
  ],
};

export const stepZeit: FlowStep<ZeitKategorie> = {
  id: "zeit",
  frage: "Wie dringlich ist die Wieder-Belastbarkeit?",
  mehrfach: false,
  optionen: [
    {
      id: "schnell",
      label: "Super dringlich",
      beschreibung: "Fläche muss schnell wieder belastbar sein (wenige Stunden)",
    },
    {
      id: "mittel",
      label: "Enger Zeitplan",
      beschreibung: "Zügig, aber nicht akut (1 Tag)",
    },
    {
      id: "normal",
      label: "Keine Zeitbegrenzung",
      beschreibung: "Zeit spielt keine Rolle",
    },
  ],
};

export const stepZusatzfunktion: FlowStep<Zusatzfunktion> = {
  id: "zusatzfunktion",
  frage: "Welche Zusatzfunktionen werden gebraucht?",
  mehrfach: true,
  optionen: [
    { id: "chemikalienbestaendigkeit", label: "Chemikalienbeständigkeit" },
    { id: "tausalzbestaendigkeit", label: "Tausalzbeständigkeit" },
    { id: "rutschhemmung", label: "Rutschhemmung" },
    { id: "fleckenabwehr", label: "Fleckenabwehr" },
  ],
};

// === Scoring ===

export interface UserAuswahl {
  sanierungsart: Sanierungsart;
  einsatzbereiche: EinsatzbereichKategorie[];
  zeitDringlichkeit: ZeitKategorie;
  zusatzfunktionen: Zusatzfunktion[];
}

export interface ScoredReferenz {
  referenz: Referenz;
  score: number;
  matchingTags: string[];
}

export interface AggregiertesProdukt {
  produkt: Produkt;
  anzahlEinsaetze: number;
  referenzen: string[]; // Referenz-Slugs
}

export interface LoesungsfinderErgebnis {
  referenzen: ScoredReferenz[];
  aggregierteProdukte: AggregiertesProdukt[];
}

const WEIGHT_EINSATZBEREICH = 3;
const WEIGHT_ZEIT = 2;
const WEIGHT_ZUSATZFUNKTION = 2;

const ZEIT_RANK: Record<ZeitKategorie, number> = {
  schnell: 3,
  mittel: 2,
  normal: 1,
};

function zeitMatchesHierarchisch(
  userAuswahl: ZeitKategorie,
  referenzTag: ZeitKategorie,
): boolean {
  // Hierarchie: schnell ⊂ mittel ⊂ normal
  // Nutzer wählt "mittel" → match bei "schnell" und "mittel"
  // Nutzer wählt "normal" → match bei allen
  // Nutzer wählt "schnell" → match nur bei "schnell"
  return ZEIT_RANK[referenzTag] >= ZEIT_RANK[userAuswahl];
}

export function berechneErgebnisse(
  auswahl: UserAuswahl,
): LoesungsfinderErgebnis {
  // Harter Filter: Sanierungsart muss matchen
  const kandidaten = referenzen.filter(
    (ref) => ref.sanierungsart === auswahl.sanierungsart,
  );

  // Scoring
  const scored: ScoredReferenz[] = kandidaten.map((ref) => {
    let score = 0;
    const matchingTags: string[] = [];

    // Step 2: Einsatzbereich (Multi-Match, +3 pro Überschneidung)
    for (const ab of auswahl.einsatzbereiche) {
      if (ref.einsatzbereiche.includes(ab)) {
        score += WEIGHT_EINSATZBEREICH;
        matchingTags.push(ab);
      }
    }

    // Step 3: Zeit (hierarchisch, +2 wenn match)
    if (zeitMatchesHierarchisch(auswahl.zeitDringlichkeit, ref.zeitDringlichkeit)) {
      score += WEIGHT_ZEIT;
      matchingTags.push(ref.zeitDringlichkeit);
    }

    // Step 4: Zusatzfunktionen (Multi-Match, +2 pro Überschneidung)
    for (const zf of auswahl.zusatzfunktionen) {
      if (ref.zusatzfunktionen.includes(zf)) {
        score += WEIGHT_ZUSATZFUNKTION;
        matchingTags.push(zf);
      }
    }

    return { referenz: ref, score, matchingTags };
  });

  // Sortierung: Score desc, dann Slug asc (stabiler Tiebreaker — kein Datum-Feld vorhanden)
  const sortiert = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.referenz.slug.localeCompare(b.referenz.slug);
    });

  // Produkt-Aggregation aus Top-5
  const topN = sortiert.slice(0, 5);
  const aggregierteProdukte = aggregiereProdukte(topN);

  return {
    referenzen: sortiert,
    aggregierteProdukte,
  };
}

export function aggregiereProdukte(
  topReferenzen: ScoredReferenz[],
): AggregiertesProdukt[] {
  const produktMap = new Map<string, { anzahl: number; referenzen: string[] }>();

  for (const scored of topReferenzen) {
    for (const produktName of scored.referenz.produkte) {
      const existing = produktMap.get(produktName);
      if (existing) {
        existing.anzahl += 1;
        existing.referenzen.push(scored.referenz.slug);
      } else {
        produktMap.set(produktName, {
          anzahl: 1,
          referenzen: [scored.referenz.slug],
        });
      }
    }
  }

  // Map zu AggregiertesProdukt[] — nur Produkte, die auch im Katalog existieren
  const result: AggregiertesProdukt[] = [];
  for (const [produktName, meta] of produktMap.entries()) {
    const produkt = produkte.find((p) => p.name === produktName);
    if (!produkt) continue; // Referenz nennt Produkt, das nicht (mehr) im Katalog ist
    result.push({
      produkt,
      anzahlEinsaetze: meta.anzahl,
      referenzen: meta.referenzen,
    });
  }

  // Sortierung: Anzahl desc, dann Name asc
  result.sort((a, b) => {
    if (b.anzahlEinsaetze !== a.anzahlEinsaetze) {
      return b.anzahlEinsaetze - a.anzahlEinsaetze;
    }
    return a.produkt.name.localeCompare(b.produkt.name);
  });

  return result;
}
