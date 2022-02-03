import { RouteRecordRaw } from 'vue-router';
import i18n from '../../../i18n';

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
    path: '/join/complete',
    name: 'complete join',
    component: () => import('./pages/CompletePage.vue'),
    meta: {
      layout: 'Loading',
      pageTitle: t('pageTitle.join'),
      noAuth: true,
    },
  },
  {
    path: '/join/confirm-email',
    name: 'confirm email',
    component: () => import('./pages/ConfirmEmailPage.vue'),
    meta: {
      layout: 'Auth',
      noAuth: true,
      pageTitle: t('pageTitle.confirmEmail'),
    },
  },
  {
    path: '/join/confirm-email/:id',
    name: 'confirm email id',
    component: () => import('./pages/ConfirmEmailLoadingPage.vue'),
    meta: {
      layout: 'Loading',
      noAuth: true,
      pageTitle: t('pageTitle.confirmEmail'),
    },
  },
  {
    path: '/join/failed',
    name: 'failed',
    component: () => import('./pages/FailedPage.vue'),
    meta: {
      layout: 'Auth',
      noAuth: true,
      pageTitle: t('pageTitle.failed'),
    },
  },
  {
    path: '/join/duplicate-email',
    name: 'duplicate email',
    component: () => import('./pages/DuplicateEmailPage.vue'),
    meta: {
      layout: 'Auth',
      noAuth: true,
      pageTitle: t('pageTitle.duplicateEmail'),
    },
  },
];
