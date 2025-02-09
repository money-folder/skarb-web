import type beDictionary from "./be.json";
import type enDictionary from "./en.json";

export type BeDictionary = typeof beDictionary;
export type EnDictionary = typeof enDictionary;

export type Dictionary = BeDictionary & EnDictionary;
