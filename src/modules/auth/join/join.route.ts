import { RouteRecordRaw } from 'vue-router';
import i18n from '../../../i18n';
import { updateCurrentUser } from '../../../store';
import { completeSignUp, confirmEmail } from '../../../utils/api/signup';

const { t } = i18n.global;

export const joinRoute: Array<RouteRecordRaw> = [
  {
    path: '/join',
    name: 'join',
    component: () => import('./JoinPage.vue'),
    meta: {
      layout: 'Auth',
      noAuth: true,
      pageTitle: t('pageTitle.join'),
    },
  },
  {
    path: '/join/setup',
    name: 'setup',
    component: () => import('./pages/SetupPage.vue'),
    meta: {
      layout: 'Auth',
      pageTitle: t('pageTitle.setup'),
    },
  },
  {
    // this page is never shown, `beforeEnter` redirects
    // the user to appropriate page
    path: '/join/complete',
    name: 'complete join',
    component: () => import('./pages/CompletePage.vue'),
    meta: {
      pageTitle: t('pageTitle.join'),
      noAuth: true,
    },
    beforeEnter(to, from, next) {
      const redirectFlowId = to.query.redirect_flow_id;
      completeSignUp(redirectFlowId as string)
        .then(() => {
          next('/join/confirm-email');
        })
        .catch(() => {
          next('/join/failed');
        });
    },
  },
  {
    path: '/join/confirm-email',
    name: 'confirm email',
    component: () => import('./pages/ConfirmEmailPage.vue'),
    meta: {
      layout: 'Splash',
      noAuth: true,
      pageTitle: t('pageTitle.confirmEmail'),
    },
  },
  {
    path: '/join/confirm-email/:id',
    name: 'confirm email id',
    component: () => import('./pages/ConfirmEmailPage.vue'),
    meta: {
      noAuth: true,
      pageTitle: t('pageTitle.confirmEmail'),
    },
    beforeEnter(to, from, next) {
      confirmEmail(to.params.id)
        .then(updateCurrentUser)
        .then(() => next('/join/setup'))
        .catch((error) => {
          if (error.response?.data?.code === 'duplicate-email') {
            next('/join/duplicate-email');
          } else {
            next('/join/failed');
          }
        });
    },
  },
  {
    path: '/join/failed',
    name: 'failed',
    component: () => import('./pages/FailedPage.vue'),
    meta: {
      layout: 'Splash',
      noAuth: true,
      pageTitle: t('pageTitle.failed'),
    },
  },
  {
    path: '/join/duplicate-email',
    name: 'duplicate email',
    component: () => import('./pages/DuplicateEmailPage.vue'),
    meta: {
      layout: 'Splash',
      noAuth: true,
      pageTitle: t('pageTitle.duplicateEmail'),
    },
  },
];
