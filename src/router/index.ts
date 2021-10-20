import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { informationRoute } from '../modules/information/information.route';
import { joinRoute } from '../modules/join/join.route';

// routes

const routes: RouteRecordRaw[] = [...informationRoute, ...joinRoute];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
