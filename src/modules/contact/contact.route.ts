import { RouteRecordRaw } from 'vue-router';
import i18n from '../../i18n';
import { Roles } from '../../utils/enums/roles.enum';

const { t } = i18n.global;

export const contactRoute: Array<RouteRecordRaw> = [
  {
    path: '/contacts/:id/information',
    name: 'contact information',
    component: () => import('../information/InformationPage.vue'),
    meta: {
      // - TODO: replace this with menu.yourInformation and
      // see if you need to remove informationPage.title-
      pageTitle: t('informationPage.title'),
      roles: [Roles.Admin, Roles.SuperAdmin],
    },
  },
  {
    path: '/contacts/:id/contribution',
    name: 'contact contribution',
    component: () => import('../contribution/ContributionPage.vue'),
    meta: {
      pageTitle: t('menu.contribution'),
      roles: [Roles.Admin, Roles.SuperAdmin],
    },
  },
  {
    path: '/contacts/:id/contribution/cancel',
    name: 'contact cancel contribution',
    component: () => import('../contribution/pages/CancelPage.vue'),
    meta: {
      pageTitle: t('menu.contribution'),
      roles: [Roles.Admin, Roles.SuperAdmin],
    },
  },
];
