/**
 * i18n helper for data content.
 * Merges base data (DE) with translated overrides for EN/FR.
 * Falls back to DE if no translation is available.
 */

export type Locale = "de" | "en" | "fr";

export function localize<T extends Record<string, unknown>>(
  base: T,
  translations: Record<string, Partial<T>> | undefined,
  id: string,
): T {
  if (!translations) return base;
  const override = translations[id];
  if (!override) return base;
  return { ...base, ...override };
}
