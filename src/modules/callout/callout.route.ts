import { RouteRecordRaw } from 'vue-router';

export const calloutRoute: Array<RouteRecordRaw> = [
  {
    path: '/callouts/:slug',
    name: 'callout',
    component: () => import('./callout.vue'),
  },
];
