import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { homeRoute } from '../modules/home/home.route';
import { informationRoute } from '../modules/information/information.route';
import { joinRoute } from '../modules/auth/join/join.route';
import { authRoute } from '../modules/auth/auth.route';
import { themeRoute } from '../modules/theme/theme.route';
import { contributionRoute } from '../modules/contribution/contribution.route';
import { contactsRoute } from '../modules/contacts/contacts.route';
import { currentUser, initStore, generalContent } from '../store';

// routes

const routes: RouteRecordRaw[] = [
  ...informationRoute,
  ...joinRoute,
  ...homeRoute,
  ...authRoute,
  ...themeRoute,
  ...contributionRoute,
  ...contactsRoute,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from) {
    return from && to.name === from.name ? undefined : { top: 0 };
  },
});

router.beforeEach(async (to, from, next) => {
  // Block route for initial store load, this will only happen once
  await initStore;

  document.title = to.meta.pageTitle
    ? to.meta.pageTitle + ' - ' + generalContent.value.organisationName
    : generalContent.value.organisationName;

  const user = currentUser.value;

  if (user == null && !to.meta.noAuth) {
    return next({ path: '/auth/login', query: { next: to.path } });
  }

  if (to.meta.role && !user?.activeRoles.includes(to.meta.role)) {
    return next({ path: 'profile' });
  }

  next();
});

export default router;
