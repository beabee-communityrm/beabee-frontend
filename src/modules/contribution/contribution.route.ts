import { RouteRecordRaw } from 'vue-router';
import i18n from '../../i18n';

const { t } = i18n.global;

export const contributionRoute: Array<RouteRecordRaw> = [
  {
    path: '/profile/contribution',
    name: 'contribution',
    component: () => import('./ContributionPage.vue'),
    meta: {
      pageTitle: t('menu.contribution'),
    },
  },
  {
    path: '/profile/contribution/complete',
    name: 'complete contribution',
    component: () => import('./pages/ContributionCompletePage.vue'),
    meta: {
      pageTitle: t('menu.contribution'),
      layout: 'Loading',
    },
  },
  {
    path: '/profile/contribution/payment-method/complete',
    name: 'complete payment method',
    component: () => import('./pages/PaymentSourceCompletePage.vue'),
    meta: {
      pageTitle: t('menu.contribution'),
      layout: 'Loading',
    },
  },
  {
    path: '/profile/contribution/cancel',
    name: 'cancel contribution',
    component: () => import('./pages/CancelPage.vue'),
    meta: {
      pageTitle: t('menu.contribution'),
    },
  },
];
