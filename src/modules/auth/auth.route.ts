import { RouteRecordRaw } from 'vue-router';
import i18n from '../../i18n';
import { Role } from '../../utils/enums/roles.enum';

const { t } = i18n.global;

export const authRoute: Array<RouteRecordRaw> = [
  {
    path: '/auth',
    component: () => import('./AuthContainer.vue'),
    meta: {
      layout: 'Auth',
      roles: [Role.NotLoggedIn],
      pageTitle: '',
    },
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('./login/LoginPage.vue'),
        meta: {
          roles: [Role.NotLoggedIn],
          pageTitle: t('pageTitle.login'),
        },
      },
      {
        path: 'forgot-password',
        name: 'forgot password',
        component: () => import('./forgot-password/ForgotPasswordPage.vue'),
        meta: {
          roles: [Role.NotLoggedIn],
          pageTitle: t('pageTitle.forgotPassword'),
        },
      },
      {
        path: ':type(set|reset)-password/:id',
        name: 'reset password',
        component: () => import('./reset-password/ResetPasswordPage.vue'),
        meta: {
          roles: [Role.NotLoggedIn],
          pageTitle: t('pageTitle.resetPassword'),
        },
      },
    ],
  },
];
