import "server-only";

import { Dictionary } from "@/types/locale";

// TODO: fix
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dictionaries: any = {
  en: () => import("./en.json").then((module) => module.default),
  be: () => import("./be.json").then((module) => module.default),
};

export const getDictionary = async (locale: string): Promise<Dictionary> =>
  dictionaries[locale]();
