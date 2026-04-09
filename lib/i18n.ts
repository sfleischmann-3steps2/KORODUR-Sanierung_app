export const LOCALES = ["de", "en", "fr", "pl"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "de";

export function isValidLocale(locale: string): locale is Locale {
  return LOCALES.includes(locale as Locale);
}
