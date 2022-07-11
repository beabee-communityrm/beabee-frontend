import { RouteRecordRaw } from 'vue-router';

export const contributionRoute: Array<RouteRecordRaw> = [
  {
    path: '/profile/contribution',
    name: 'contribution',
    component: () => import('./ContributionPage.vue'),
    meta: {
      pageTitle: 'menu.contribution',
    },
  },
  {
    path: '/profile/contribution/complete',
    name: 'complete contribution',
    component: () => import('./pages/ContributionCompletePage.vue'),
    meta: {
      pageTitle: 'menu.contribution',
      layout: 'Loading',
    },
  },
  {
    path: '/profile/contribution/payment-method/complete',
    name: 'complete payment method',
    component: () => import('./pages/PaymentSourceCompletePage.vue'),
    meta: {
      pageTitle: 'menu.contribution',
      layout: 'Loading',
    },
  },
  {
    path: '/profile/contribution/cancel',
    name: 'cancel contribution',
    component: () => import('./pages/CancelPage.vue'),
    meta: {
      pageTitle: 'menu.contribution',
    },
  },
];
