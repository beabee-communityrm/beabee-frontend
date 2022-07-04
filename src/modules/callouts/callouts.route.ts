import { RouteRecordRaw } from 'vue-router';

export const calloutsRoute: Array<RouteRecordRaw> = [
  {
    path: '/callouts',
    name: 'callouts',
    component: () => import('./CalloutsPage.vue'),
    meta: {
      pageTitle: 'menu.callouts',
    },
  },
  {
    path: '/callouts/:id',
    name: 'callout',
    component: () => import('./pages/CalloutPage.vue'),
    meta: {
      pageTitle: 'menu.callouts',
      noAuth: true,
    },
  },
  {
    path: '/admin/callouts',
    name: 'calloutsAdmin',
    component: () => import('./pages/CalloutsAdminPage.vue'),
    meta: {
      pageTitle: 'menu.callouts',
      role: 'admin',
    },
  },
  {
    path: '/admin/callouts/new',
    name: 'new-callout',
    component: () => import('./pages/CreateCallout.vue'),
    meta: {
      pageTitle: 'menu.callouts',
      role: 'admin',
    },
  },
  {
    path: '/admin/callouts/edit/:id',
    name: 'edit-callout',
    component: () => import('./pages/CreateCallout.vue'),
    meta: {
      pageTitle: 'menu.callouts',
      role: 'admin',
    },
  },
  {
    path: '/admin/callouts/view/:id',
    name: 'calloutAdmin',
    component: () => import('./pages/CalloutAdminPage.vue'),
    meta: {
      pageTitle: 'menu.callouts',
      role: 'admin',
    },
    children: [
      {
        path: '',
        name: 'calloutAdminOverview',
        component: () => import('./pages/CalloutAdminOverviewPage.vue'),
        meta: {
          pageTitle: 'menu.callouts',
          role: 'admin',
        },
      },
      {
        path: 'responses',
        name: 'calloutAdminResponses',
        component: () => import('./pages/CalloutAdminResponsesPage.vue'),
        meta: {
          pageTitle: 'menu.callouts',
          role: 'admin',
        },
      },
    ],
  },
];
