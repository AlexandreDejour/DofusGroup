import leoProfanity from "leo-profanity";

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

// Check if text contain bad words
export function containsProfanity(text: string): boolean {
  return leoProfanity.check(text);
}

// Fonction récursive qui nettoie toutes les chaînes dans un objet
export function cleanProfanity<T extends Record<string, any>>(obj: T): T {
  const result: any = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    const value = obj[key];

    if (typeof value === "string") {
      result[key] = leoProfanity.clean(value);
    } else if (typeof value === "object" && value !== null) {
      result[key] = cleanProfanity(value); // récursion pour nested objects / arrays
    } else {
      result[key] = value; // boolean, number, null, etc.
    }
  }

  return result as T;
}
