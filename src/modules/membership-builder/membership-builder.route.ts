import { RouteRecordRaw } from 'vue-router';
import i18n from '../../i18n';

const { t } = i18n.global;

export const membershipBuilderRoute: Array<RouteRecordRaw> = [
  {
    path: '/admin/membership-builder',
    name: 'membershipBuilder',
    component: () => import('./MembershipBuilderPage.vue'),
    meta: {
      pageTitle: t('membershipBuilder.title'),
      role: 'admin',
    },
  },
];
