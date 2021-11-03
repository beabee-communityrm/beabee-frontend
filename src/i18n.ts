import { createI18n } from 'vue-i18n';

const localeWithVariant = import.meta.env.VITE_LOCALE as string;
const messages = await import(`../locales/${localeWithVariant}.json`);
const [locale] = localeWithVariant.split('@');

// We don't allow changing locales for now so fine to hardcode

const numberFormats = {
  [locale]: {
    currency: {
      style: 'currency',
      currency: import.meta.env.VITE_CURRENCY as string,
    },
  },
};

const i18n = createI18n({
  locale,
  messages: {
    [locale]: messages.default,
  },
  numberFormats,
});

export default i18n;
