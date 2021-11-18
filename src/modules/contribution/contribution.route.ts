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
    },
    children: [
      {
        // this page is never shown, `beforeEnter` redirects
        // the user to appropriate page
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
        // this page is never shown, `beforeEnter` redirects
        // the user to appropriate page
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
];
