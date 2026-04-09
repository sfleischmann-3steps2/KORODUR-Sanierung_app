/**
 * Central localization helpers for data content.
 * Merges base German data with EN/FR overrides.
 */

import type { Referenz, KategorieInfo } from "../types";
import type { Produkt } from "../produkte";

// Lazy imports to avoid loading all translations upfront
const translations = {
  en: {
    kategorien: () => import("./kategorien.en").then((m) => ({ kat: m.kategorienEN, sub: m.unterkategorienEN })),
    produkte: () => import("./produkte.en").then((m) => m.produkteEN),
    referenzen: () => import("./referenzen.en").then((m) => m.referenzenEN),
  },
  fr: {
    kategorien: () => import("./kategorien.fr").then((m) => ({ kat: m.kategorienFR, sub: m.unterkategorienFR })),
    produkte: () => import("./produkte.fr").then((m) => m.produkteFR),
    referenzen: () => import("./referenzen.fr").then((m) => m.referenzenFR),
  },
  pl: {
    kategorien: () => import("./kategorien.pl").then((m) => ({ kat: m.kategorienPL, sub: m.unterkategorienPL })),
    produkte: () => import("./produkte.pl").then((m) => m.produktePL),
    referenzen: () => import("./referenzen.pl").then((m) => m.referenzenPL),
  },
};

type Lang = "de" | "en" | "fr" | "pl";

// Cache for loaded translations
const cache: Record<string, unknown> = {};

async function getTranslation<T>(lang: Lang, key: string, loader: () => Promise<T>): Promise<T | undefined> {
  if (lang === "de") return undefined;
  const cacheKey = `${lang}:${key}`;
  if (cache[cacheKey]) return cache[cacheKey] as T;
  const data = await loader();
  cache[cacheKey] = data;
  return data;
}

/** Localize a single reference */
export async function localizeReferenz(ref: Referenz, lang: Lang): Promise<Referenz> {
  if (lang === "de") return ref;
  const t = translations[lang as "en" | "fr" | "pl"];
  if (!t) return ref;
  const data = await getTranslation(lang, "referenzen", t.referenzen);
  if (!data) return ref;
  const override = (data as Record<string, Partial<Referenz>>)[ref.id];
  if (!override) return ref;
  return { ...ref, ...override };
}

/** Localize an array of references */
export async function localizeReferenzen(refs: Referenz[], lang: Lang): Promise<Referenz[]> {
  if (lang === "de") return refs;
  return Promise.all(refs.map((r) => localizeReferenz(r, lang)));
}

/** Localize a single product */
export async function localizeProdukt(produkt: Produkt, lang: Lang): Promise<Produkt> {
  if (lang === "de") return produkt;
  const t = translations[lang as "en" | "fr" | "pl"];
  if (!t) return produkt;
  const data = await getTranslation(lang, "produkte", t.produkte);
  if (!data) return produkt;
  const override = (data as Record<string, Partial<Produkt>>)[produkt.id];
  if (!override) return produkt;
  return { ...produkt, ...override };
}

/** Localize an array of products */
export async function localizeProdukte(prods: Produkt[], lang: Lang): Promise<Produkt[]> {
  if (lang === "de") return prods;
  return Promise.all(prods.map((p) => localizeProdukt(p, lang)));
}

/** Localize a kategorie */
export async function localizeKategorie(kat: KategorieInfo, lang: Lang): Promise<KategorieInfo> {
  if (lang === "de") return kat;
  const t = translations[lang as "en" | "fr" | "pl"];
  if (!t) return kat;
  const data = await getTranslation(lang, "kategorien", t.kategorien);
  if (!data) return kat;
  const { kat: katT, sub: subT } = data as { kat: Record<string, Partial<KategorieInfo>>; sub: Record<string, { titel?: string; beschreibung?: string }> };
  const katOverride = katT[kat.id] || {};
  const localizedSubs = kat.unterkategorien.map((s) => {
    const sOverride = subT[s.id] || {};
    return { ...s, ...sOverride };
  });
  return { ...kat, ...katOverride, unterkategorien: localizedSubs };
}

/** Localize kategorien array */
export async function localizeKategorien(kats: KategorieInfo[], lang: Lang): Promise<KategorieInfo[]> {
  if (lang === "de") return kats;
  return Promise.all(kats.map((k) => localizeKategorie(k, lang)));
}

