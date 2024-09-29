import { DEFAULT_LOCALE, locales } from '@/locales';

export const getLocaleFromUrl = () => {
  const probLocale = window.location.pathname.split('/')[1];
  if (locales.includes(probLocale)) {
    return probLocale;
  }

  return DEFAULT_LOCALE;
};
