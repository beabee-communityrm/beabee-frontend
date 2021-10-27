import { RouteRecordRaw } from 'vue-router';
import i18n from '../../i18n';

const { t } = i18n.global;

export const homeRoute: Array<RouteRecordRaw> = [
  {
    path: '/profile',
    name: 'home',
    component: () => import('./HomePage.vue'),
    meta: {
      pageTitle: t('homePage.title'),
    },
  },
];
