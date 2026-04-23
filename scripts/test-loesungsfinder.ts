import assert from "node:assert/strict";
import { berechneErgebnisse } from "../data/loesungsfinder";
import { referenzen } from "../data/referenzen";
import type { UserAuswahl } from "../data/loesungsfinder";

let pass = 0;
let fail = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    pass += 1;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    fail += 1;
    console.error(`  ✗ ${name}`);
    console.error(`    ${(err as Error).message}`);
  }
}

console.log("\n=== berechneErgebnisse ===");

test("Harter Filter: punktuell schließt großflächige Referenzen aus", () => {
  const auswahl: UserAuswahl = {
    sanierungsart: "punktuell",
    einsatzbereiche: [],
    zeitDringlichkeit: "normal",
    zusatzfunktionen: [],
  };
  const ergebnis = berechneErgebnisse(auswahl);
  for (const scored of ergebnis.referenzen) {
    assert.equal(scored.referenz.sanierungsart, "punktuell");
  }
});

test("Harter Filter: grossflaechig schließt punktuelle Referenzen aus", () => {
  const auswahl: UserAuswahl = {
    sanierungsart: "grossflaechig",
    einsatzbereiche: [],
    zeitDringlichkeit: "normal",
    zusatzfunktionen: [],
  };
  const ergebnis = berechneErgebnisse(auswahl);
  for (const scored of ergebnis.referenzen) {
    assert.equal(scored.referenz.sanierungsart, "grossflaechig");
  }
});

test("Zeit-Hierarchie: 'normal' als User matcht alle Zeit-Tags", () => {
  const auswahl: UserAuswahl = {
    sanierungsart: "grossflaechig",
    einsatzbereiche: [],
    zeitDringlichkeit: "normal",
    zusatzfunktionen: [],
  };
  const ergebnis = berechneErgebnisse(auswahl);
  const grossRefs = referenzen.filter((r) => r.sanierungsart === "grossflaechig");
  if (grossRefs.length > 0) {
    assert.ok(ergebnis.referenzen.length > 0, "Mindestens eine Referenz erwartet");
    assert.ok(
      ergebnis.referenzen.every((s) => s.score >= 2),
      "Alle Referenzen sollten Zeit-Match haben",
    );
  }
});

test("Zeit-Hierarchie: 'schnell' als User matcht nur schnell-Referenzen", () => {
  const auswahl: UserAuswahl = {
    sanierungsart: "grossflaechig",
    einsatzbereiche: [],
    zeitDringlichkeit: "schnell",
    zusatzfunktionen: [],
  };
  const ergebnis = berechneErgebnisse(auswahl);
  for (const scored of ergebnis.referenzen) {
    if (scored.score >= 2) {
      assert.equal(
        scored.referenz.zeitDringlichkeit,
        "schnell",
        `Referenz ${scored.referenz.slug} sollte schnell sein`,
      );
    }
  }
});

test("Anwendungsbereich-Scoring: Multi-Match addiert sich", () => {
  const auswahl: UserAuswahl = {
    sanierungsart: "grossflaechig",
    einsatzbereiche: ["industrie-produktion", "lager-logistik"],
    zeitDringlichkeit: "normal",
    zusatzfunktionen: [],
  };
  const ergebnis = berechneErgebnisse(auswahl);
  assert.ok(ergebnis.referenzen.length > 0);
});

test("Sortierung: höchster Score zuerst", () => {
  const auswahl: UserAuswahl = {
    sanierungsart: "grossflaechig",
    einsatzbereiche: ["industrie-produktion"],
    zeitDringlichkeit: "normal",
    zusatzfunktionen: ["chemikalienbestaendigkeit"],
  };
  const ergebnis = berechneErgebnisse(auswahl);
  for (let i = 1; i < ergebnis.referenzen.length; i++) {
    assert.ok(
      ergebnis.referenzen[i - 1].score >= ergebnis.referenzen[i].score,
      "Scores müssen absteigend sortiert sein",
    );
  }
});

console.log("\n=== aggregiereProdukte ===");

test("Aggregation zählt Produkt-Einsätze korrekt", () => {
  const auswahl: UserAuswahl = {
    sanierungsart: "grossflaechig",
    einsatzbereiche: [],
    zeitDringlichkeit: "normal",
    zusatzfunktionen: [],
  };
  const ergebnis = berechneErgebnisse(auswahl);
  const top5Slugs = new Set(ergebnis.referenzen.slice(0, 5).map((s) => s.referenz.slug));
  for (const agg of ergebnis.aggregierteProdukte) {
    assert.ok(agg.anzahlEinsaetze >= 1);
    assert.ok(agg.anzahlEinsaetze <= 5);
    assert.ok(agg.referenzen.every((slug) => top5Slugs.has(slug)));
  }
});

test("Aggregation sortiert nach Häufigkeit", () => {
  const auswahl: UserAuswahl = {
    sanierungsart: "grossflaechig",
    einsatzbereiche: [],
    zeitDringlichkeit: "normal",
    zusatzfunktionen: [],
  };
  const ergebnis = berechneErgebnisse(auswahl);
  for (let i = 1; i < ergebnis.aggregierteProdukte.length; i++) {
    assert.ok(
      ergebnis.aggregierteProdukte[i - 1].anzahlEinsaetze >=
        ergebnis.aggregierteProdukte[i].anzahlEinsaetze,
    );
  }
});

console.log(`\n→ ${pass} passed, ${fail} failed\n`);
process.exit(fail > 0 ? 1 : 0);
