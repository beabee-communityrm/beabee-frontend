import { RouteRecordRaw } from 'vue-router';
import { Role } from '../../utils/enums/roles.enum';

export const themeRoute: Array<RouteRecordRaw> = [
  {
    path: '/_theme',
    name: 'theme',
    meta: {
      roles: [Role.NotLoggedIn],
      pageTitle: 'Theme settings',
    },
    component: () => import('./theme.vue'),
  },
];
