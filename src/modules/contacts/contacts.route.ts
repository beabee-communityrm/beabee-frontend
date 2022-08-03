import { RouteRecordRaw } from 'vue-router';

export const contactsRoute: Array<RouteRecordRaw> = [
  {
    path: '/admin/contacts',
    name: 'contacts',
    component: () => import('./ContactsPage.vue'),
    meta: {
      pageTitle: 'menu.community',
      role: 'admin',
    },
  },
  {
    path: '/admin/contacts/add',
    name: 'addContact',
    component: () => import('./pages/AddContactPage.vue'),
    meta: {
      pageTitle: 'contacts.addContact',
      role: 'admin',
    },
  },
  {
    path: '/admin/contacts/:id',
    name: 'contact',
    component: () => import('./pages/ContactPage.vue'),
    meta: {
      pageTitle: 'menu.community',
      role: 'admin',
    },
    children: [
      {
        path: '',
        name: 'contactOverview',
        component: () => import('./pages/ContactOverviewPage.vue'),
        meta: {
          pageTitle: 'menu.community',
          role: 'admin',
        },
      },
      {
        path: 'information',
        name: 'contactInformation',
        component: () => import('./pages/ContactInformationPage.vue'),
        meta: {
          pageTitle: 'menu.community',
          role: 'admin',
        },
      },
    ],
  },
];
