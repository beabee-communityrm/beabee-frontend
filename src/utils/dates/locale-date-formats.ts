import { de, enGB } from 'date-fns/locale';
import { formatDistance } from 'date-fns';
import i18n from '../../i18n';

const { locale } = i18n.global;
const locales = { en: enGB, de };

function formatDistanceLocale(firstDate: Date, secondDate: Date): string {
  return formatDistance(firstDate, secondDate, {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - locale is interfered as string which is not
    locale: locales[locale.value as keyof typeof locales],
  });
}

export { formatDistanceLocale };
