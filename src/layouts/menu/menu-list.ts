import { computed } from 'vue';
import { MenuSection } from './menu-list.interface';
import { generalContent } from '../../store/generalContent';

export const menu = computed(
  () =>
    [
      {
        items: [
          {
            title: 'menu.home',
            href: '/profile',
            icon: ['fa', 'house'],
          },
          {
            title: 'menu.callouts',
            href: '/callouts',
            icon: ['fa', 'bullhorn'],
            isActive: /^\/callouts/,
          },
        ],
      },
      {
        items: [
          {
            title: 'menu.account',
            href: '/profile/account',
            icon: ['fa', 'address-card'],
          },
          ...(generalContent.value.hideContribution
            ? []
            : [
                {
                  title: 'menu.contribution',
                  href: '/profile/contribution',
                  icon: ['fa', 'credit-card'],
                },
              ]),
        ],
      },
    ] as MenuSection[]
);

export const adminMenu: MenuSection[] = [
  {
    title: 'menu.admin',
    items: [
      {
        title: 'menu.dashboard',
        href: '/admin',
        icon: ['fa', 'chart-line'],
      },
      {
        title: 'menu.contacts',
        href: '/admin/contacts',
        icon: ['fa', 'users'],
        isActive: /^\/admin\/contacts.*/,
      },
      {
        title: 'menu.callouts',
        href: '/admin/callouts',
        icon: ['fa', 'bullhorn'],
        isActive: /^\/admin\/callouts.*/,
      },
      {
        title: 'menu.notices',
        href: '/admin/notices',
        icon: ['fa', 'sign-hanging'],
        isActive: /^\/admin\/notices.*/,
      },
    ],
  },
  {
    items: [
      {
        title: 'menu.membershipBuilder',
        href: '/admin/membership-builder',
        icon: ['fa', 'hands-helping'],
      },
      {
        title: 'menu.adminSettings',
        href: '/admin/settings',
        icon: ['fa', 'cog'],
        isActive: /^\/admin\/settings.*/,
      },
    ],
  },
];
