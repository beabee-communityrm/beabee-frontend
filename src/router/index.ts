import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { informationRoute } from '../modules/information/information.route';

// routes

const routes: RouteRecordRaw[] = [...informationRoute];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
