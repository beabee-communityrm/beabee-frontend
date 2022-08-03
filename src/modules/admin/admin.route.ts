import { RouteRecordRaw } from 'vue-router';

export const adminRoute: Array<RouteRecordRaw> = [
  {
    path: '/admin',
    component: () => import('./AdminPage.vue'),
    meta: {
      layout: 'Dashboard',
      role: 'admin',
      pageTitle: 'menu.dashboard',
    },
  },
];
