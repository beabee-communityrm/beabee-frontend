import { RouteRecordRaw } from 'vue-router';
import i18n from '../../i18n';

const { t } = i18n.global;

export const informationRoute: Array<RouteRecordRaw> = [
  {
    path: '/profile/information',
    name: 'information',
    component: () => import('./information.vue'),
    meta: {
      pageTitle: t('informationPage.title'),
    },
  },
];
