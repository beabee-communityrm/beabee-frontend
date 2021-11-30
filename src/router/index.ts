import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { homeRoute } from '../modules/home/home.route';
import { informationRoute } from '../modules/information/information.route';
import { joinRoute } from '../modules/auth/join/join.route';
import { authRoute } from '../modules/auth/auth.route';
import { contributionRoute } from '../modules/contribution/contribution.route';
import { fetchMember } from '../modules/home/home.service';
import { Roles } from '../utils/enums/roles.enum';
import { contactRoute } from '../modules/contact/contact.route';

// routes
const routes: RouteRecordRaw[] = [
  ...informationRoute,
  ...joinRoute,
  ...homeRoute,
  ...authRoute,
  ...contributionRoute,
  ...contactRoute,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  const isAuthPath = new RegExp('^/(auth|join)').test(to.path);

  const redirectTo = isAuthPath ? null : to.path;

  const newsroomName = import.meta.env.VITE_NEWSROOM_NAME as string;

  document.title = to.meta.pageTitle
    ? to.meta.pageTitle + ' - ' + newsroomName
    : newsroomName;

  if (!isAuthenticated && !isAuthPath) {
    return next({ path: '/auth/login', query: { redirectTo } });
  } else {
    // set user to local storage
    const localStorageUser = localStorage.getItem('user');
    const currentUser = localStorageUser ? JSON.parse(localStorageUser) : null;

    if (!currentUser) {
      fetchMember()
        .then(({ data }) => {
          localStorage.setItem('user', JSON.stringify(data));
        })
        .catch((err) => err);
    }

    // if route has an empty roles array it means it can be accsesed by all users
    const roles = to.meta.roles;
    if (!roles?.length) return next();

    // handle authorization
    const roleIndex = currentUser.roles.findIndex((role: Roles) => {
      // `role` has definitly `Roles` type because of the above condition
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      return roles.includes(role);
    });
    const isAuthorized = roleIndex > -1;
    if (isAuthorized) {
      next();
    } else {
      // - TODO: What should we do here? -
      next({ path: '/profile' });
    }
  }
});

export default router;
