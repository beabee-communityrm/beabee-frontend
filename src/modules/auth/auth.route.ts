import { RouteRecordRaw } from 'vue-router';
import i18n from '../../i18n';

const { t } = i18n.global;

export const authRoute: Array<RouteRecordRaw> = [
  {
    path: '/auth',
    component: () => import('./AuthContainer.vue'),
    meta: {
      layout: 'Auth',
      roles: [],
      pageTitle: '',
    },
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('./login/LoginPage.vue'),
        meta: {
          roles: [],
          pageTitle: t('pageTitle.login'),
        },
      },
      {
        path: 'forgot-password',
        name: 'forgot password',
        component: () => import('./forgot-password/ForgotPasswordPage.vue'),
        meta: {
          roles: [],
          pageTitle: t('pageTitle.forgotPassword'),
        },
      },
      {
        path: 'reset-password/:id',
        name: 'reset password',
        component: () => import('./reset-password/ResetPasswordPage.vue'),
        meta: {
          roles: [],
          pageTitle: t('pageTitle.resetPassword'),
        },
      },
    ],
  },
];
