import "server-only";

import { BeDictionary, Dictionary, EnDictionary } from "@/dictionaries/locale";
import { Locale } from "@/locale";

const dictionaries = {
  en: () =>
    import("./en.json").then((module) => module.default as EnDictionary),
  be: () =>
    import("./be.json").then((module) => module.default as BeDictionary),
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]();
