import { RouteRecordRaw } from 'vue-router';

export const calloutRoute: Array<RouteRecordRaw> = [
  {
    path: '/callouts/:id',
    name: 'callout',
    component: () => import('./callout.vue'),
  },
];
