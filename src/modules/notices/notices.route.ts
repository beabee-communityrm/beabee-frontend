import { RouteRecordRaw } from 'vue-router';
import i18n from '../../i18n';

const { t } = i18n.global;

export const noticesRoute: Array<RouteRecordRaw> = [
  {
    path: '/notices',
    component: () => import('./NoticesPage.vue'),
    meta: {
      layout: 'Dashboard',
      role: 'admin',
      pageTitle: t('menu.notices'),
    },
  },
];
