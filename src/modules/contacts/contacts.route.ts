import { RouteRecordRaw } from 'vue-router';
import i18n from '../../i18n';

const { t } = i18n.global;

export const contactsRoute: Array<RouteRecordRaw> = [
  {
    path: '/contacts',
    name: 'contacts',
    component: () => import('./ContactsPage.vue'),
    meta: {
      pageTitle: t('menu.community'),
      role: 'admin',
    },
  },
  {
    path: '/contacts/add',
    name: 'addContact',
    component: () => import('./pages/AddContactPage.vue'),
    meta: {
      pageTitle: t('contacts.addContact'),
      role: 'admin',
    },
  },
  {
    path: '/contacts/:id',
    name: 'contact',
    component: () => import('./pages/ContactPage.vue'),
    meta: {
      pageTitle: t('menu.community'),
      role: 'admin',
    },
    children: [
      {
        path: '',
        name: 'contactOverview',
        component: () => import('./pages/ContactOverviewPage.vue'),
        meta: {
          pageTitle: t('menu.community'),
          role: 'admin',
        },
      },
      {
        path: 'information',
        name: 'contactInformation',
        component: () => import('./pages/ContactInformationPage.vue'),
        meta: {
          pageTitle: t('menu.community'),
          role: 'admin',
        },
      },
    ],
  },
];
