export const DEFAULT_LOCALE = "en";

export const locales = [DEFAULT_LOCALE, "be"];
export type Locale = "en" | "be";

export const i18n = {
  defaultLocale: DEFAULT_LOCALE,
  locales: locales.map((l) => l),
} as const;
