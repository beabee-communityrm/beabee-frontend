import { watch } from 'vue';
import {
  type DefaultLocaleMessageSchema,
  type LocaleMessages,
  createI18n,
} from 'vue-i18n';
import { ContentGeneral } from '../store';

import en from '../../locales/en.json';

const i18n = createI18n({
  legacy: false,
  fallbackLocale: 'en',
  messages: { en } as LocaleMessages<DefaultLocaleMessageSchema>,
});

watch(
  () => [ContentGeneral.value.locale, ContentGeneral.value.currencyCode],
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
