import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import des fichiers JSON typés
import en from "./locales/en/translation.json";
import fr from "./locales/fr/translation.json";

i18n
  .use(LanguageDetector) // Detect navigator language
  .use(initReactI18next) // Init with react
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
    },
    fallbackLng: "en", // default language
    interpolation: {
      escapeValue: false,
    },
    detection: {
      // detection language order
      order: ["querystring", "localStorage", "navigator"],
      // save user language
      caches: ["localStorage"],
    },
  });

export default i18n;
