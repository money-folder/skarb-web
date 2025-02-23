import "server-only";

import { BeDictionary, Dictionary, EnDictionary } from "@/dictionaries/locale";
import { Locale } from "@/locale";
import { ObjectPaths, PathValue } from "@/shared/types/utils";

const dictionaries = {
  en: () =>
    import("./en.json").then((module) => module.default as EnDictionary),
  be: () =>
    import("./be.json").then((module) => module.default as BeDictionary),
};

export async function getDictionary(locale: Locale): Promise<Dictionary>;

export async function getDictionary<P extends ObjectPaths<Dictionary>>(
  locale: Locale,
  path: P,
): Promise<PathValue<Dictionary, P>>;

export async function getDictionary<P extends ObjectPaths<Dictionary>>(
  locale: Locale,
  path?: P,
) {
  const dictionary = await dictionaries[locale]();

  if (!path) {
    return dictionary;
  }

  return (
    path
      .split(".")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .reduce((acc: any, key) => acc[key], dictionary) as unknown as PathValue<
      Dictionary,
      P
    >
  );
}
