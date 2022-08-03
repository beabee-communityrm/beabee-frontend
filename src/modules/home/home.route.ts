import { RouteRecordRaw } from 'vue-router';

export const homeRoute: Array<RouteRecordRaw> = [
  {
    path: '/profile',
    name: 'home',
    component: () => import('./HomePage.vue'),
    meta: {
      pageTitle: 'homePage.title',
    },
  },
];
