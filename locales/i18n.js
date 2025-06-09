/* eslint-disable import/no-named-as-default-member */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// import {getLocales} from 'react-native-localize';
import { en } from './translations/en';

import { ar } from './translations/ar';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },

    ar: { translation: ar },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});
