import { RouteRecordRaw } from 'vue-router';

export const informationRoute: Array<RouteRecordRaw> = [
  {
    path: '/profile/information',
    name: 'information',
    component: () => import('./InformationPage.vue'),
    meta: {
      pageTitle: 'informationPage.title',
    },
  },
];
