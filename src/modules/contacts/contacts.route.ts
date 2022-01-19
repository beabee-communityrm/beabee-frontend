import { RouteRecordRaw } from 'vue-router';
import i18n from '../../i18n';
import { Role } from '../../utils/enums/roles.enum';

const { t } = i18n.global;

export const contactsRoute: Array<RouteRecordRaw> = [
  {
    path: '/contacts',
    name: 'contacts',
    component: () => import('./ContactsPage.vue'),
    meta: {
      pageTitle: t('menu.community'),
      role: Role.Admin,
    },
  },
];
