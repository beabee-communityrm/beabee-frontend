import i18n from '../../i18n';
const { t } = i18n.global;

export default [
  {
    title: t('menu.home'),
    href: '/profile',
    icon: 'building',
  },
  {
    title: t('menu.yourProfile'),
    href: '/profile/edit',
    icon: 'user',
  },
  {
    title: t('menu.callouts'),
    href: '/callouts',
    icon: 'calendar-check',
  },
  {
    title: t('menu.settings'),
    divider: true,
  },
  {
    title: t('menu.yourInformation'),
    href: '/profile/information',
    icon: 'address-card',
    isSubsection: true,
  },
  {
    title: t('menu.contribution'),
    href: '/profile/contribution',
    icon: 'credit-card',
    isSubsection: true,
  },
];
