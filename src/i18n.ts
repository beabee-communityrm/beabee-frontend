import { createI18n } from 'vue-i18n';
import messages from '@intlify/vite-plugin-vue-i18n/messages';

const numberFormats = {
  en: {
    currency: {
      style: 'currency',
      currency: import.meta.env.VITE_CURRENCY as string,
    },
  },
  de: {
    currency: {
      style: 'currency',
      currency: import.meta.env.VITE_CURRENCY as string,
    },
  },
};
const i18n = createI18n({
  locale: 'en',
  messages,
  numberFormats,
});

export default i18n;
