export const DEFAULT_LOCALE = "en";

export const locales = [DEFAULT_LOCALE, "be"];

export const i18n = {
  defaultLocale: DEFAULT_LOCALE,
  locales: locales.map((l) => l),
} as const;

export type Locale = (typeof i18n)["locales"][number];
