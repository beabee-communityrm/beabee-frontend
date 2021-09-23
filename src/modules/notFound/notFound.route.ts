import { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';

export const notFoundRoute: Array<RouteRecordRaw> = [
  {
    path: '/:pathMatch(profile|callouts)?/:pathMatch(.*)*',
    component: () => import('./notFound.vue'),
  },
  {
    path: '/:pathMatch(.*)+',
    component: { template: '<div></div>' },
    beforeEnter(to: RouteLocationNormalized): void {
      window.location.href = to.fullPath;
    },
  },
];
