import { RouteRecordRaw } from 'vue-router';

export const noticesRoute: Array<RouteRecordRaw> = [
  {
    path: '/admin/notices',
    component: () => import('./NoticesPage.vue'),
    meta: {
      layout: 'Dashboard',
      role: 'admin',
      pageTitle: 'menu.notices',
    },
  },
];
