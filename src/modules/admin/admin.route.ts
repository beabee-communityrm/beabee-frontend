import { RouteRecordRaw } from 'vue-router';
import i18n from '../../i18n';

const { t } = i18n.global;

export const adminRoute: Array<RouteRecordRaw> = [
  {
    path: '/admin',
    component: () => import('./AdminPage.vue'),
    meta: {
      layout: 'Dashboard',
      role: 'admin',
      pageTitle: t('menu.dashboard'),
    },
  },
];
