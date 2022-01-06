import { RouteRecordRaw } from 'vue-router';

export const themeRoute: Array<RouteRecordRaw> = [
  {
    path: '/_theme',
    name: 'theme',
    component: () => import('./theme.vue'),
  },
];
