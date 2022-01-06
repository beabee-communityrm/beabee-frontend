import i18n from '../../i18n';
import { MenuSection } from './menu-list.interface';
const { t } = i18n.global;

export default [
  {
    items: [
      {
        title: t('menu.home'),
        href: '/profile',
        icon: 'building',
      },
      /*{
        title: t('menu.yourProfile'),
        href: '/profile/edit',
        icon: 'user',
      },*/
      {
        title: t('menu.callouts'),
        href: '/callouts',
        icon: 'calendar-check',
      },
    ],
  },
  {
    title: t('menu.settings'),
    type: 'settings',
    items: [
      {
        title: t('menu.yourInformation'),
        href: '/profile/information',
        icon: 'address-card',
      },
      {
        title: t('menu.contribution'),
        href: '/profile/contribution',
        icon: 'credit-card',
      },
    ],
  },
] as MenuSection[];
