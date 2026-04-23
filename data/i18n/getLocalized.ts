/**
 * Central localization helpers for data content.
 * Merges base German data with EN/FR/PL overrides.
 */

import type { Referenz } from "../types";
import type { Produkt } from "../produkte";

const translations = {
  en: {
    produkte: () => import("./produkte.en").then((m) => m.produkteEN),
    referenzen: () => import("./referenzen.en").then((m) => m.referenzenEN),
  },
  fr: {
    produkte: () => import("./produkte.fr").then((m) => m.produkteFR),
    referenzen: () => import("./referenzen.fr").then((m) => m.referenzenFR),
  },
  pl: {
    produkte: () => import("./produkte.pl").then((m) => m.produktePL),
    referenzen: () => import("./referenzen.pl").then((m) => m.referenzenPL),
  },
};

type Lang = "de" | "en" | "fr" | "pl";

const cache: Record<string, unknown> = {};

async function getTranslation<T>(lang: Lang, key: string, loader: () => Promise<T>): Promise<T | undefined> {
  if (lang === "de") return undefined;
  const cacheKey = `${lang}:${key}`;
  if (cache[cacheKey]) return cache[cacheKey] as T;
  const data = await loader();
  cache[cacheKey] = data;
  return data;
}

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

export async function localizeReferenzen(refs: Referenz[], lang: Lang): Promise<Referenz[]> {
  if (lang === "de") return refs;
  return Promise.all(refs.map((r) => localizeReferenz(r, lang)));
}

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

export async function localizeProdukte(prods: Produkt[], lang: Lang): Promise<Produkt[]> {
  if (lang === "de") return prods;
  return Promise.all(prods.map((p) => localizeProdukt(p, lang)));
}
