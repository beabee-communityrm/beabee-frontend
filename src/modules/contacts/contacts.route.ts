import { RouteRecordRaw } from 'vue-router';
import i18n from '../../i18n';

const { t } = i18n.global;

export const contactsRoute: Array<RouteRecordRaw> = [
  {
    path: '/contacts',
    name: 'contacts',
    component: () => import('./ContactsPage.vue'),
    meta: {
      pageTitle: t('menu.community'),
      role: 'admin',
    },
  },
  {
    path: '/contacts/:id',
    name: 'contact',
    component: () => import('./ContactsPage.vue'),
    meta: {
      pageTitle: t('menu.community'),
      role: 'admin',
    },
  },
];
