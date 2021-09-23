import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { informationRoute } from '../modules/information/information.route';
import { notFoundRoute } from '../modules/notFound/notFound.route';

// routes

const routes: RouteRecordRaw[] = [...informationRoute, ...notFoundRoute];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
