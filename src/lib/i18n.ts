import { watch } from 'vue';
import {
  type DefaultLocaleMessageSchema,
  type LocaleMessages,
  createI18n,
} from 'vue-i18n';
import { generalContent } from '../store';

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

watch(
  () => [generalContent.value.locale, generalContent.value.currencyCode],
  async ([newLocale, newCurrencyCode]) => {
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
