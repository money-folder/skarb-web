import { headers } from "next/headers";

import { i18n, Locale } from "./locale";

export function getServerLocale(): Locale {
  const headersList = headers();
  const pathname = headersList.get("x-invoke-path") || "";
  const locale = pathname.split("/")[1] as Locale;

  if (i18n.locales.includes(locale)) {
    return locale;
  }

  return i18n.defaultLocale;
}
