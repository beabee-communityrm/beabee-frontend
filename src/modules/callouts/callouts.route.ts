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
  {
    path: '/admin/callouts/:id',
    name: 'calloutAdmin',
    component: () => import('./pages/CalloutAdminPage.vue'),
    meta: {
      pageTitle: t('menu.callouts'),
      role: 'admin',
    },
    children: [
      {
        path: '',
        name: 'calloutAdminOverview',
        component: () => import('./pages/CalloutAdminOverviewPage.vue'),
        meta: {
          pageTitle: t('menu.callouts'),
          role: 'admin',
        },
      },
      {
        path: 'responses',
        name: 'calloutAdminResponses',
        component: () => import('./pages/CalloutAdminResponsesPage.vue'),
        meta: {
          pageTitle: t('menu.callouts'),
          role: 'admin',
        },
      },
    ],
  },
];
