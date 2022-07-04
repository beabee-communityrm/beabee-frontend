import { computed } from 'vue';
import { MenuSection } from './menu-list.interface';
import { generalContent } from '../../store/generalContent';

export const menu = computed(
  () =>
    [
      {
        type: 'main',
        items: [
          {
            title: 'menu.home',
            href: '/profile',
            icon: ['far', 'building'],
          },
          /*{
        title: 'menu.yourProfile',
        href: '/profile/edit',
        icon: ['far', 'user'],
      },*/
          {
            title: 'menu.callouts',
            href: '/callouts',
            icon: ['far', 'calendar-check'],
            isActive: /^\/callouts/,
          },
        ],
      },
      {
        title: 'menu.settings',
        type: 'settings',
        items: [
          {
            title: 'menu.yourInformation',
            href: '/profile/information',
            icon: ['far', 'address-card'],
          },
          ...(generalContent.value.hideContribution
            ? []
            : [
                {
                  title: 'menu.contribution',
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
    title: 'menu.admin',
    items: [
      {
        title: 'menu.dashboard',
        href: '/admin',
        icon: ['far', 'building'],
      },
      {
        title: 'menu.community',
        href: '/admin/contacts',
        icon: ['fa', 'users'],
        isActive: /^\/admin\/contacts.*/,
      },
      {
        title: 'menu.callouts',
        href: '/admin/callouts',
        icon: ['far', 'calendar-check'],
        isActive: /^\/admin\/callouts.*/,
      },
      {
        title: 'menu.notices',
        href: '/admin/notices',
        icon: ['fa', 'bullhorn'],
        isActive: /^\/admin\/notices.*/,
      },
    ],
  },
];
