import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationZH from './locales/zh.json';
import translationEN from './locales/en.json';

// Language resources
const resources = {
  zh: {
    translation: translationZH
  },
  en: {
    translation: translationEN
  }
};

// 获取支持的语言列表
const supportedLngs = Object.keys(resources);

i18n
  // Use browser language detector
  .use(LanguageDetector)
  // Pass i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources,
    fallbackLng: 'en', // English as default fallback language
    supportedLngs, // List of supported languages
    load: 'languageOnly', // only load language without region (e.g. 'en' instead of 'en-US')
    
    interpolation: {
      escapeValue: false // Do not escape HTML tags
    },
    
    detection: {
      // Get language preference in this order
      order: ['localStorage', 'navigator', 'htmlTag'],
      // Cache user language preference
      caches: ['localStorage'],
      // Use 'language' as the localStorage key
      lookupLocalStorage: 'language'
    },
    
    // Debug in development mode
    debug: process.env.NODE_ENV === 'development'
  });

// Helper function to get current language
export const getCurrentLanguage = (): string => {
  return i18n.language.split('-')[0];
};

export default i18n; 