import { createI18n } from 'vue-i18n';
import messages from '../locales/_current.json';
import { generalContent, initGeneralContent } from './store/generalContent';

// We don't allow changing locales for now so fine to hardcode the locale

// messages are statically compiled, this extract the actual string
// this is super hacky and should probably be removed
// https://github.com/intlify/vite-plugin-vue-i18n#static-bundle-importing
const locale = (messages.locale as any)({ normalize: (s: string[]) => s[0] });

const i18n = createI18n({
  locale,
  messages: {
    [locale]: messages,
  },
});

initGeneralContent.then(() => {
  i18n.global.setNumberFormat(locale, {
    currency: {
      style: 'currency',
      currency: generalContent.value.currencyCode,
    },
  });
});

export default i18n;
