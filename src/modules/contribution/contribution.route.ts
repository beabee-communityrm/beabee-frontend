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
  // these next 2 pages are never shown, `beforeEnter` redirects
  // the user to appropriate page.
  // - TODO: currently these pages are shown blank while makning requests
  // maybe adding a loading indicator?
  {
    path: '/contribution/complete/:id',
    name: 'complete contribution',
    component: () => import('./CompleteFlow.vue'),
    beforeEnter(to, from, next) {
      const redirectFlowId = to.query.redirect_flow_id as string;
      const id = to.params.id as string;
      completeContribution(redirectFlowId, id)
        .then(() => {
          id
            ? next(`/contacts/${id}/contribution`)
            : next('/profile/contribution');
        })
        .catch((err) => err);
    },
  },
  {
    path: '/contribution/payment-source/complete/:id',
    name: 'complete payment source',
    component: () => import('./CompleteFlow.vue'),
    beforeEnter(to, from, next) {
      const redirectFlowId = to.query.redirect_flow_id as string;
      const id = to.params.id as string;
      completeUpdatePaymentSource(redirectFlowId, id)
        .then(() => {
          id
            ? next(`/contacts/${id}/contribution`)
            : next('/profile/contribution');
        })
        .catch((err) => err);
    },
  },
];
