import { RouteRecordRaw } from 'vue-router';

export const themeRoute: Array<RouteRecordRaw> = [
  {
    path: '/_theme',
    name: 'theme',
    meta: {
      noAuth: true,
      pageTitle: 'Theme settings',
    },
    component: () => import('./theme.vue'),
  },
];
