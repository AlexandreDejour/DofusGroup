import translation from "./locales/en/translation.json";
import i18n from "./i18n";

// Type utilitaire pour générer toutes les clés profondes du JSON
type DotPrefix<T extends string> = T extends "" ? "" : `.${T}`;
type DeepKeys<T> = T extends object
  ? {
      [K in keyof T & (string | number)]: K extends string
        ? T[K] extends object
          ? K | `${K}${DotPrefix<DeepKeys<T[K]>>}`
          : K
        : never;
    }[keyof T & (string | number)]
  : "";

export type TranslationKeys = DeepKeys<typeof translation>;

export function t(
  key: TranslationKeys,
  options?: Record<string, unknown>,
): string {
  return i18n.t(key, options);
}
