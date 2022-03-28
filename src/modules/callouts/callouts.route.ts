import { RouteRecordRaw } from 'vue-router';
import i18n from '../../i18n';

const { t } = i18n.global;

export const calloutsRoute: Array<RouteRecordRaw> = [
  {
    path: '/callouts',
    name: 'callouts',
    component: () => import('./CalloutsPage.vue'),
    meta: {
      pageTitle: t('menu.callouts'),
    },
  },
  {
    path: '/callouts/:id',
    name: 'callout',
    component: () => import('./pages/CalloutPage.vue'),
    meta: {
      pageTitle: t('menu.callouts'),
      noAuth: true,
    },
  },
  {
    path: '/admin/callouts',
    name: 'calloutsAdmin',
    component: () => import('./pages/CalloutsAdminPage.vue'),
    meta: {
      pageTitle: t('menu.callouts'),
      role: 'admin',
    },
  },
];
