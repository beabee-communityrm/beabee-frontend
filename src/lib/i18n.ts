import { watch } from 'vue';
import { createI18n } from 'vue-i18n';
import { generalContent } from '../store';

const i18n = createI18n({
  legacy: false,
});

watch(
  () => [generalContent.value.locale, generalContent.value.currencyCode],
  async ([newLocale, newCurrencyCode]) => {
    // Remove variants (e.g. @informal)
    const [justLocale] = newLocale.split('@');

    if (i18n.global.locale.value !== justLocale) {
      const messages = await import(`../../locales/${newLocale}.json`);
      i18n.global.setLocaleMessage(justLocale, messages.default);
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
