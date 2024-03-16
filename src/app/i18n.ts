import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en';
import ar from '../locales/ar';
import { AR } from '../locales/constants';

i18n.use(initReactI18next).init({
  lng: localStorage.getItem('language') || AR,
  fallbackLng: AR,
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  debug: process.env.NODE_ENV === 'development',
  interpolation: {
    escapeValue: false,
    formatSeparator: '.',
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
