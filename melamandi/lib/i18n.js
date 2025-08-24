import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import risorse
import it from "../locales/it.json";
import en from "../locales/en.json";

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector) // autodetect browser/localStorage
    .use(initReactI18next)
    .init({
      resources: {
        it: { translation: it },
        en: { translation: en },
      },
      // lingua iniziale
      lng: "it",
      fallbackLng: "en",

      interpolation: { escapeValue: false },

      detection: {
        order: ["localStorage", "navigator", "htmlTag", "cookie"],
        caches: ["localStorage"],
      },

      ns: ["translation"], // namespace unico (scalabile se aggiungi altri)
      defaultNS: "translation",

      debug: process.env.NODE_ENV === "development" && false, // abilita se vuoi debug
    });
}

export default i18n;
