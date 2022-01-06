import { RouteRecordRaw } from 'vue-router';
import {
  completeContribution,
  completeUpdatePaymentSource,
} from './contribution.service';
import i18n from '../../i18n';

const { t } = i18n.global;

export const contributionRoute: Array<RouteRecordRaw> = [
  {
    path: '/profile/contribution',
    name: 'contribution',
    component: () => import('./ContributionPage.vue'),
    meta: {
      pageTitle: t('menu.contribution'),
      roles: [],
    },
    // these pages are never shown, `beforeEnter` redirects
    // the user to appropriate page.
    // there is now `<router-view>` in contribution page
    // - TODO: currently these pages are shown blank while makning requests
    // maybe adding a loading indicator?
    children: [
      {
        path: 'complete',
        name: 'complete contribution',
        component: () => import('./CompleteFlow.vue'),
        beforeEnter(to, from, next) {
          const redirectFlowId = to.query.redirect_flow_id;
          completeContribution(redirectFlowId as string)
            .then(() => {
              next('/profile/contribution');
            })
            .catch((err) => err);
        },
      },
      {
        path: 'payment-source/complete',
        name: 'complete payment source',
        component: () => import('./CompleteFlow.vue'),
        beforeEnter(to, from, next) {
          const redirectFlowId = to.query.redirect_flow_id;
          completeUpdatePaymentSource(redirectFlowId as string)
            .then(() => {
              next('/profile/contribution');
            })
            .catch((err) => err);
        },
      },
    ],
  },
  {
    path: '/profile/contribution/cancel',
    name: 'cancel contribution',
    component: () => import('./pages/CancelPage.vue'),
    meta: {
      roles: [],
      pageTitle: t('menu.contribution'),
    },
  },
];
