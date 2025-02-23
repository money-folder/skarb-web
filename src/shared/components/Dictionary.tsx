"use client";

import { createContext } from "react";

import { Dictionary } from "@/dictionaries/locale";
import { Locale } from "@/locale";

import en from "../../dictionaries/en.json";

interface LocaleContextParams {
  d: Dictionary;
  locale: Locale;
}

export const DictionaryContext = createContext<LocaleContextParams>({
  d: en,
  locale: "en",
});

interface DictionaryProviderProps {
  d: Dictionary;
  locale: Locale;
  children: React.ReactNode;
}

export default function DictionaryProvider({
  d,
  locale,
  children,
}: DictionaryProviderProps) {
  return (
    <DictionaryContext.Provider value={{ d, locale }}>
      {children}
    </DictionaryContext.Provider>
  );
}
