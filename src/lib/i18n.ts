import { watch } from 'vue';
import {
  type DefaultLocaleMessageSchema,
  type LocaleMessages,
  createI18n,
} from 'vue-i18n';
import { generalContent } from '../store';
import router from '@lib/router';

import i18nConfig from './i18n-config.json';

import en from '../../locales/en.json';

type LocaleKey = keyof typeof i18nConfig;

export function isLocaleKey(key: string): key is LocaleKey {
  return key in i18nConfig;
}

export const localeItems = Object.entries(i18nConfig).map(([id, config]) => ({
  id,
  label: config.name,
}));

const i18n = createI18n({
  legacy: false,
  fallbackLocale: 'en',
  messages: { en } as LocaleMessages<DefaultLocaleMessageSchema>,
  pluralRules: {
    // Format: 0 | ends in 1 (except 11) | ends in 2,3,4 (except teens) | the rest
    ru: (n) => {
      if (n === 0) {
        return 0;
      }

      // Assume no number given is singular
      if (n === -1) {
        return 1;
      }

      const endsWith = n % 10;
      return (n > 10 && n < 20) || endsWith >= 5 ? 3 : endsWith === 1 ? 1 : 2;
    },
  },
});

// Update document title on route or locale change
watch([i18n.global.locale, router.currentRoute], ([, route]) => {
  document.title =
    (route.meta.pageTitle ? i18n.global.t(route.meta.pageTitle) + ' - ' : '') +
    generalContent.value.organisationName;
});

// Update i18n language on route or global locale change
watch(
  [
    () => router.currentRoute.value.path,
    () => router.currentRoute.value.query.lang,
    () => generalContent.value.locale,
    () => generalContent.value.currencyCode,
  ],
  async ([path, routeLang, globalLocale, newCurrencyCode]) => {
    let newLocale = routeLang?.toString() || globalLocale;

    // Some locales have only been translated in non-admin areas
    if (isLocaleKey(newLocale) && path.startsWith('/admin')) {
      newLocale = i18nConfig[newLocale].adminLocale;
    }

    // Remove variants (e.g. @informal)
    const [justLocale] = newLocale.split('@');

    if (i18n.global.locale.value !== justLocale) {
      // en is already loaded
      if (newLocale !== 'en') {
        const messages = await import(`../../locales/${newLocale}.json`);
        i18n.global.setLocaleMessage(justLocale, messages.default);
      }

      i18n.global.setNumberFormat(justLocale, {
        currency: {
          style: 'currency',
          currency: newCurrencyCode,
        },
      });

      i18n.global.locale.value = justLocale;
      document.documentElement.setAttribute('lang', justLocale);
    }
  }
);

export default i18n;
