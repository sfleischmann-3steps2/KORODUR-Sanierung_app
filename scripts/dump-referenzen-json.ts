/**
 * Exportiert data/referenzen.ts nach docs/cache/app-referenzen.json
 * damit Python-Skripte die App-Refs strukturiert nutzen können.
 */
import { referenzen } from "../data/referenzen";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const out = resolve(__dirname, "../docs/cache/app-referenzen.json");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(referenzen, null, 2));
console.log(`Wrote ${out} (${referenzen.length} refs)`);
