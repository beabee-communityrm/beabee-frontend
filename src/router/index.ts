import { createRouter, createWebHistory } from 'vue-router';
import { currentUser, initStore, generalContent } from '../store';
import i18n from '../i18n';

import routes from '~pages';
import { watch } from 'vue';

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from) {
    return from && to.name === from.name ? undefined : { top: 0 };
  },
});

watch([i18n.global.locale, router.currentRoute], ([locale, route]) => {
  document.title =
    (route.meta.pageTitle ? i18n.global.t(route.meta.pageTitle) + ' - ' : '') +
    generalContent.value.organisationName;
});

router.beforeEach(async (to, from, next) => {
  // Block route for initial store load, this will only happen once
  await initStore;

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
