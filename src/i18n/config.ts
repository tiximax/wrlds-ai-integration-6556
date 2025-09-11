import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslation from '../translations/en.json';
import viTranslation from '../translations/vi.json';

// Language resources
const resources = {
  en: {
    translation: enTranslation,
  },
  vi: {
    translation: viTranslation,
  },
};

i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass the i18n instance to react-i18next
  .init({
    resources,
    
    // Language to use if translations in user language are not available
    fallbackLng: 'vi',
    
    // Default namespace
    defaultNS: 'translation',
    
    // Debug mode (disable in production)
    debug: process.env.NODE_ENV === 'development',

    interpolation: {
      escapeValue: false, // React already does escaping
    },

    // Language detection options
    detection: {
      // Order and from where user language should be detected
      order: ['localStorage', 'navigator', 'htmlTag'],
      
      // Cache user language on
      caches: ['localStorage'],

      // Optional htmlTag with lang attribute
      htmlTag: document.documentElement,
    },
  });

export default i18n;
