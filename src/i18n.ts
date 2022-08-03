import { createI18n } from 'vue-i18n';

const i18n = createI18n({
  legacy: false,
});

export async function setLocale(
  locale: string,
  currency: string
): Promise<void> {
  // Remove variants (e.g. @informal)
  const [justLocale] = locale.split('@');

  if (i18n.global.locale.value !== justLocale) {
    const messages = await import(`../locales/${locale}.json`);
    i18n.global.setLocaleMessage(justLocale, messages.default);
    i18n.global.setNumberFormat(justLocale, {
      currency: {
        style: 'currency',
        currency,
      },
    });

    i18n.global.locale.value = justLocale;
    document.documentElement.setAttribute('lang', justLocale);
  }
}

export default i18n;
