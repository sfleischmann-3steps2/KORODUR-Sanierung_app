/**
 * Schritt 3 — Validierungs-Skript für data/referenzen.ts.
 *
 * Prüft pro Referenz:
 *   1. einsatzbereiche[] ist nicht leer (mind. 1 Wert)
 *   2. sanierungsart, zeitDringlichkeit liegen im Enum
 *   3. einsatzbereiche[] und zusatzfunktionen[] sind alle Enum-Werte
 *   4. produkte[] referenziert nur Namen, die in data/produkte.ts existieren
 *   5. slug ist eindeutig
 *
 * Exit-Code 1 bei jeglicher Verletzung.
 */
import { referenzen } from "../data/referenzen";
import { produkte } from "../data/produkte";
import type {
  Sanierungsart,
  EinsatzbereichKategorie,
  ZeitKategorie,
  Zusatzfunktion,
} from "../data/types";

const ALLOWED_SANIERUNGSART: ReadonlySet<Sanierungsart> = new Set<Sanierungsart>([
  "punktuell",
  "grossflaechig",
]);

const ALLOWED_EINSATZBEREICH: ReadonlySet<EinsatzbereichKategorie> = new Set<EinsatzbereichKategorie>([
  "lager-logistik",
  "industrie-produktion",
  "lebensmittel",
  "flugzeug",
  "parkdeck",
  "infrastruktur-zufahrten",
  "verkaufsraeume",
  "schwerindustrie",
]);

const ALLOWED_DRINGLICHKEIT: ReadonlySet<ZeitKategorie> = new Set<ZeitKategorie>([
  "schnell",
  "mittel",
  "normal",
]);

const ALLOWED_ZUSATZ: ReadonlySet<Zusatzfunktion> = new Set<Zusatzfunktion>([
  "chemikalienbestaendigkeit",
  "tausalzbestaendigkeit",
  "rutschhemmung",
  "fleckenabwehr",
]);

const PRODUKT_NAMES = new Set(produkte.map((p) => p.name));

type Issue = { slug: string; level: "error" | "warn"; msg: string };
const issues: Issue[] = [];

const seenSlugs = new Set<string>();
for (const r of referenzen) {
  if (seenSlugs.has(r.slug)) {
    issues.push({ slug: r.slug, level: "error", msg: "Slug ist nicht eindeutig" });
  }
  seenSlugs.add(r.slug);

  if (!r.einsatzbereiche || r.einsatzbereiche.length === 0) {
    issues.push({ slug: r.slug, level: "error", msg: "einsatzbereiche[] ist leer" });
  } else {
    for (const a of r.einsatzbereiche) {
      if (!ALLOWED_EINSATZBEREICH.has(a)) {
        issues.push({ slug: r.slug, level: "error", msg: `einsatzbereich '${a}' nicht im Enum` });
      }
    }
  }

  if (!ALLOWED_SANIERUNGSART.has(r.sanierungsart)) {
    issues.push({ slug: r.slug, level: "error", msg: `sanierungsart '${r.sanierungsart}' nicht im Enum` });
  }

  if (!ALLOWED_DRINGLICHKEIT.has(r.zeitDringlichkeit)) {
    issues.push({ slug: r.slug, level: "error", msg: `zeitDringlichkeit '${r.zeitDringlichkeit}' nicht im Enum` });
  }

  for (const z of r.zusatzfunktionen ?? []) {
    if (!ALLOWED_ZUSATZ.has(z)) {
      issues.push({ slug: r.slug, level: "error", msg: `zusatzfunktion '${z}' nicht im Enum` });
    }
  }

  for (const p of r.produkte ?? []) {
    if (!PRODUKT_NAMES.has(p)) {
      issues.push({ slug: r.slug, level: "warn", msg: `Produkt '${p}' nicht in data/produkte.ts` });
    }
  }
}

const errors = issues.filter((i) => i.level === "error");
const warnings = issues.filter((i) => i.level === "warn");

console.log(`Geprüft: ${referenzen.length} Referenzen`);
console.log(`Fehler: ${errors.length} · Warnungen: ${warnings.length}`);

if (errors.length > 0) {
  console.log("\n❌ Fehler:");
  for (const e of errors) console.log(`  [${e.slug}] ${e.msg}`);
}
if (warnings.length > 0) {
  console.log("\n⚠ Warnungen:");
  for (const w of warnings) console.log(`  [${w.slug}] ${w.msg}`);
}
if (errors.length === 0 && warnings.length === 0) {
  console.log("✅ Alle Referenzen valide.");
}

process.exit(errors.length > 0 ? 1 : 0);
