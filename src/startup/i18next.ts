import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import locales from 'locales';

void i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: locales,
    fallbackLng: 'en',
    keySeparator: false,
    nsSeparator: '.',
    interpolation: {
      escapeValue: true,
    },
  });

export default i18n;
