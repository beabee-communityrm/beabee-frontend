import { computed, Ref } from 'vue';
import i18n from '../../i18n';
import { MenuSection } from './menu-list.interface';
import { generalContent } from '../../store/generalContent';

const { t } = i18n.global;

export const menu = computed(
  () =>
    [
      {
        type: 'main',
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
      },*/
          {
            title: t('menu.callouts'),
            href: '/callouts',
            icon: ['far', 'calendar-check'],
            isActive: /^\/callouts/,
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
          ...(generalContent.value.hideContribution
            ? []
            : [
                {
                  title: t('menu.contribution'),
                  href: '/profile/contribution',
                  icon: ['far', 'credit-card'],
                },
              ]),
        ],
      },
    ] as MenuSection[]
);

export const adminMenu: MenuSection[] = [
  {
    type: 'main',
    title: t('menu.admin'),
    items: [
      {
        title: t('menu.dashboard'),
        href: '/admin',
        icon: ['fa', 'chart-line'],
      },
      {
        title: t('menu.community'),
        href: '/admin/contacts',
        icon: ['fa', 'users'],
        isActive: /^\/admin\/contacts.*/,
      },
      {
        title: t('menu.callouts'),
        href: '/admin/callouts',
        icon: ['far', 'calendar-check'],
        isActive: /^\/admin\/callouts.*/,
      },
      {
        title: t('menu.notices'),
        href: '/admin/notices',
        icon: ['fa', 'bullhorn'],
        isActive: /^\/admin\/notices.*/,
      },
    ],
  },
  /*{
    type: 'settings',
    title: t('menu.settings'),
    items: [
      {
        title: t('menu.membershipBuilder'),
        href: '/admin/membership-builder',
        icon: ['fa', 'hands-helping'],
      },
    ],
  },*/
];
