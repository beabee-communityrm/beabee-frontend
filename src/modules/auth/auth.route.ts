import { RouteRecordRaw } from 'vue-router';

export const authRoute: Array<RouteRecordRaw> = [
  {
    path: '/auth',
    component: () => import('./AuthContainer.vue'),
    meta: {
      layout: 'Auth',
      roles: [],
    },
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('./login/LoginPage.vue'),
      },
      {
        path: 'forgot-password',
        name: 'forgot password',
        component: () => import('./forgot-password/ForgotPasswordPage.vue'),
      },
      {
        path: 'reset-password/:id',
        name: 'reset password',
        component: () => import('./reset-password/ResetPasswordPage.vue'),
      },
    ],
  },
];
