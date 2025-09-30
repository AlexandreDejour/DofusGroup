// i18n-helper.ts
import { t } from "i18next";
import type fr from "./locales/fr/translation.json";

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & string]: ObjectType[Key] extends object
    ? `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : Key;
}[keyof ObjectType & string];

export type TranslationKeys = NestedKeyOf<typeof fr>;

/**
 * ✅ Typed translation helper
 */
export function typedT(key: TranslationKeys, options?: Record<string, any>) {
  return t(key, options);
}
