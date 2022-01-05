import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { homeRoute } from '../modules/home/home.route';
import { informationRoute } from '../modules/information/information.route';
import { joinRoute } from '../modules/auth/join/join.route';
import { authRoute } from '../modules/auth/auth.route';
import { themeRoute } from '../modules/theme/theme.route';
import { contributionRoute } from '../modules/contribution/contribution.route';
import { Role } from '../utils/enums/roles.enum';
import { currentUser, initialUserPromise } from '../store';

// routes

const routes: RouteRecordRaw[] = [
  ...informationRoute,
  ...joinRoute,
  ...homeRoute,
  ...authRoute,
  ...themeRoute,
  ...contributionRoute,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach(async (to, from, next) => {
  const newsroomName = import.meta.env.VITE_NEWSROOM_NAME;
  document.title = to.meta.pageTitle
    ? to.meta.pageTitle + ' - ' + newsroomName
    : newsroomName;

  // Block route for initial user load, this will only happen once
  await initialUserPromise;

  const user = currentUser.value;
  const routeRoles = to.meta.roles || [];

  // Only certain routes don't require authentication
  if (user == null && !routeRoles.includes(Role.NotLoggedIn)) {
    return next({ path: '/auth/login', query: { next: to.path } });
  }

  if (
    routeRoles.length > 0 &&
    routeRoles.some((role) => user?.roles.includes(role))
  ) {
    return next({ path: 'profile' });
  }

  next();
});

export default router;
