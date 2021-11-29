import { RouteRecordRaw } from 'vue-router';
import i18n from '../../i18n';

const { t } = i18n.global;

export const contactRoute: Array<RouteRecordRaw> = [
  {
    path: '/contacts/:id/information',
    name: 'contact information',
    component: () => import('../information/InformationPage.vue'),
    meta: {
      pageTitle: t('informationPage.title'),
    },
  },
];
