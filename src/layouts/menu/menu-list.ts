import i18n from '../../i18n';
import { MenuSection } from './menu-list.interface';
const { t } = i18n.global;

export default [
  {
    items: [
      {
        title: t('menu.home'),
        href: '/profile',
        icon: ['far', 'building'],
      },
      /*{
        title: t('menu.yourProfile'),
        href: '/profile/edit',
        icon: ['far', 'user'],
      },
      {
        title: t('menu.callouts'),
        href: '/callouts',
        icon: ['far', 'calendar-check'],
      },*/
      {
        title: t('menu.community'),
        href: '/contacts',
        icon: ['fa', 'users'],
        role: 'admin',
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
        icon: ['far', 'address-card'],
      },
      {
        title: t('menu.contribution'),
        href: '/profile/contribution',
        icon: ['far', 'credit-card'],
      },
    ],
  },
] as MenuSection[];
