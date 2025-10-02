import leoProfanity from "leo-profanity";

import { typeGuard } from "../../components/modals/utils/typeGuard";

/**
 * Init filter in depends of user language
 * @param lang Language code (ex: "fr", "en")
 */
export function initProfanity(lang: string = "en") {
  // init disctionnaries
  leoProfanity.clearList();

  switch (lang) {
    case "fr":
      leoProfanity.loadDictionary("fr");
      break;
    case "en":
      leoProfanity.loadDictionary("en");
      break;
    default:
      leoProfanity.loadDictionary("en");
      break;
  }
}

export function loadProfanityDictionary(lang: string) {
  leoProfanity.clearList();
  if (lang.startsWith("fr")) {
    leoProfanity.loadDictionary("fr");
  } else {
    leoProfanity.loadDictionary("en");
  }
}

// Check if text contains bad-words
export function containsProfanity(text: string): boolean {
  return leoProfanity.check(text);
}

/**
 * Check recursively if an object contains bad words
 * @param obj Object to check
 * @returns true if at least one string contains profanity
 */
export function containsProfanityInObject<T extends Record<string, any>>(
  obj: T,
): boolean {
  for (const key in obj) {
    const value = obj[key];

    if (typeof value === "string") {
      if (leoProfanity.check(value)) {
        return true;
      }
    } else if (typeof value === "object" && value !== null) {
      if (containsProfanityInObject(value)) {
        return true; // recursive for array or nested object
      }
    }
  }

  return false;
}

// Recursive fonction clean all string in object
export function cleanProfanity<T extends Record<string, any>>(obj: T): T {
  const result: any = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    const value = obj[key];

    if (typeof value === "string") {
      result[key] = leoProfanity.clean(value);
    } else if (typeGuard.isDate(value)) {
      result[key] = value; // Do nothing if Date
    } else if (Array.isArray(value)) {
      result[key] = value.map((v: any) =>
        typeof v === "string" ? leoProfanity.clean(v) : v,
      );
    } else if (typeof value === "object" && value !== null) {
      result[key] = cleanProfanity(value); // recursive for object
    } else {
      result[key] = value; // boolean, number, null, etc.
    }
  }

  return result as T;
}
