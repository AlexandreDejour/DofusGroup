import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import des fichiers JSON typés
import en from "./locales/en/translation.json";
import fr from "./locales/fr/translation.json";
import gcuEN from "./locales/en/gcu.json";
import gcuFR from "./locales/fr/gcu.json";
import aboutEN from "./locales/en/about.json";
import aboutFR from "./locales/fr/about.json";
import privacyPolicyEN from "./locales/en/privacyPolicy.json";
import privacyPolicyFR from "./locales/fr/privacyPolicy.json";

i18n
  .use(LanguageDetector) // Detect navigator language
  .use(initReactI18next) // Init with react
  .init({
    resources: {
      en: {
        translation: en,
        gcu: gcuEN,
        about: aboutEN,
        privacyPolicy: privacyPolicyEN,
      },
      fr: {
        translation: fr,
        gcu: gcuFR,
        about: aboutFR,
        privacyPolicy: privacyPolicyFR,
      },
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
