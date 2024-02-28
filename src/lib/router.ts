import { createRouter, createWebHistory } from 'vue-router';
import { currentUser, initStore, isEmbed } from '../store';

import routes from '~pages';
import env from '@env';

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from) {
    return from && to.name === from.name ? undefined : { top: 0 };
  },
});

router.beforeEach(async (to, from) => {
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

  // Preserve the language query parameter across routes
  const lang = to.query.lang || from.query.lang;

  const user = currentUser.value;
  // Route requires authentication
  if (user == null && !to.meta.noAuth) {
    return { path: '/auth/login', query: { next: to.path, lang } };
  }
  // Route requires a specific role
  if (to.meta.role && !user?.activeRoles.includes(to.meta.role)) {
    return { path: 'profile', lang };
  }

  if (to.query.lang !== lang) {
    return { ...to, query: { ...to.query, lang } };
  }
});

export default router;
