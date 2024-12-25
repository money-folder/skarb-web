"use client";

import { createContext } from "react";

import { Dictionary } from "@/shared/types/locale";

import en from "../dictionaries/en.json";

interface LocaleContextParams {
  d: Dictionary;
}

export const DictionaryContext = createContext<LocaleContextParams>({
  d: en,
});

interface DictionaryProviderProps {
  d: Dictionary;
  children: React.ReactNode;
}

export default function DictionaryProvider({
  d,
  children,
}: DictionaryProviderProps) {
  return (
    <DictionaryContext.Provider value={{ d }}>
      {children}
    </DictionaryContext.Provider>
  );
}
