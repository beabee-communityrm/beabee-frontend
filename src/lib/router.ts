import { createRouter, createWebHistory } from 'vue-router';
import { currentUser, initStore, ContentGeneral, isEmbed } from '../store';
import i18n from './i18n';

import routes from '~pages';
import { watch } from 'vue';
import env from '@env';

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from) {
    return from && to.name === from.name ? undefined : { top: 0 };
  },
});

watch([i18n.global.locale, router.currentRoute], ([, route]) => {
  document.title =
    (route.meta.pageTitle ? i18n.global.t(route.meta.pageTitle) + ' - ' : '') +
    ContentGeneral.value.organisationName;
});

router.beforeEach(async (to) => {
  // Block route for initial store load, this will only happen once
  await initStore;

  // Ensure route is embeddable if we are embedded
  if (isEmbed && !to.meta.embeddable) {
    return false;
  }

  // Don't load routes that are not available in CNR mode
  if (env.cnrMode && to.meta.noCnrMode) {
    return false;
  }

  const user = currentUser.value;
  // Route requires authentication
  if (user == null && !to.meta.noAuth) {
    return { path: '/auth/login', query: { next: to.path } };
  }
  // Route requires a specific role
  if (to.meta.role && !user?.activeRoles.includes(to.meta.role)) {
    return { path: 'profile' };
  }
});

export default router;
