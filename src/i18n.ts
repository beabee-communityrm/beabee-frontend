import { createI18n } from 'vue-i18n';
import messages from '../locales/_current.json';

// We don't allow changing locales for now so fine to hardcode the locale

// messages are statically compiled, this extract the actual string
// this is super hacky and should probably be removed
// https://github.com/intlify/vite-plugin-vue-i18n#static-bundle-importing
const locale = (messages.locale as any)({ normalize: (s: string[]) => s[0] });

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
    [locale]: messages,
  },
  numberFormats,
});

export default i18n;
