import { RouteRecordRaw } from 'vue-router';
import { completeSignUp, confirmEmail } from './join.service';
import i18n from '../../../i18n';
import { Role } from '../../../utils/enums/roles.enum';
import { updateCurrentUser } from '../../../store';

const { t } = i18n.global;

export const joinRoute: Array<RouteRecordRaw> = [
  {
    path: '/join',
    name: 'join',
    component: () => import('./JoinPage.vue'),
    meta: {
      layout: 'Auth',
      roles: [Role.NotLoggedIn],
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
      roles: [Role.NotLoggedIn],
    },
    beforeEnter(to, from, next) {
      const redirectFlowId = to.query.redirect_flow_id;
      completeSignUp(redirectFlowId)
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
      roles: [Role.NotLoggedIn],
      pageTitle: t('pageTitle.confirmEmail'),
    },
  },
  {
    path: '/join/confirm-email/:id',
    name: 'confirm email id',
    component: () => import('./pages/ConfirmEmailPage.vue'),
    meta: {
      roles: [Role.NotLoggedIn],
      pageTitle: t('pageTitle.confirmEmail'),
    },
    beforeEnter(to, from, next) {
      const { id } = to.params;
      confirmEmail(id)
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
      roles: [Role.NotLoggedIn],
      pageTitle: t('pageTitle.failed'),
    },
  },
  {
    path: '/join/duplicate-email',
    name: 'duplicate email',
    component: () => import('./pages/DuplicateEmailPage.vue'),
    meta: {
      layout: 'Splash',
      roles: [Role.NotLoggedIn],
      pageTitle: t('pageTitle.duplicateEmail'),
    },
  },
];
