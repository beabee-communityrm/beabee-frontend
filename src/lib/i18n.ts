import { watch } from 'vue';
import {
  type DefaultLocaleMessageSchema,
  type LocaleMessages,
  createI18n,
} from 'vue-i18n';
import { generalContent } from '../store';
import router from '@lib/router';

import en from '../../locales/en.json';

const i18n = createI18n({
  legacy: false,
  fallbackLocale: 'en',
  messages: { en } as LocaleMessages<DefaultLocaleMessageSchema>,
  pluralRules: {
    // Format: 0 | ends in 1 (except 11) | ends in 2,3,4 (except teens) | ...
    ru: (n) => {
      if (n === 0) {
        return 0;
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
  () =>
    [
      router.currentRoute.value?.query.lang,
      generalContent.value.locale,
      generalContent.value.currencyCode,
    ] as const,
  async ([routeLocale, globalLocale, newCurrencyCode]) => {
    const newLocale = routeLocale?.toString() || globalLocale;

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
