import { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';

export const notFoundRoute: Array<RouteRecordRaw> = [
  {
    path: '/:path1(profile|callouts)?/:pathRest(.*)*',
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
