import { berechneErgebnisse } from "../data/loesungsfinder";
const test1 = berechneErgebnisse({
  sanierungsart: "grossflaechig",
  einsatzbereiche: ["parkdeck"],
  zeitDringlichkeit: "schnell",
  zusatzfunktionen: ["tausalzbestaendigkeit"],
});
console.log("Test 1 (Parkdeck/Schnell/Tausalz):");
console.log(`  ${test1.referenzen.length} Referenzen · ${test1.aggregierteProdukte.length} aggregierte Produkte`);
for (const r of test1.referenzen.slice(0, 5))
  console.log(`    Score ${r.score}: ${r.referenz.titel} (${r.referenz.slug})`);

const test2 = berechneErgebnisse({
  sanierungsart: "grossflaechig",
  einsatzbereiche: ["infrastruktur-zufahrten"],
  zeitDringlichkeit: "mittel",
  zusatzfunktionen: [],
});
console.log("\nTest 2 (Infrastruktur & Zufahrten / Mittel):");
console.log(`  ${test2.referenzen.length} Referenzen`);
for (const r of test2.referenzen.slice(0, 5))
  console.log(`    Score ${r.score}: ${r.referenz.titel}`);

const test3 = berechneErgebnisse({
  sanierungsart: "punktuell",
  einsatzbereiche: [],
  zeitDringlichkeit: "schnell",
  zusatzfunktionen: [],
});
console.log("\nTest 3 (Punktuell/Schnell, alle Bereiche):");
console.log(`  ${test3.referenzen.length} Referenzen`);
