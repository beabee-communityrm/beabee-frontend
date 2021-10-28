import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { calloutRoute } from '../modules/callout/callout.route';
import { homeRoute } from '../modules/home/home.route';
import { informationRoute } from '../modules/information/information.route';
import { joinRoute } from '../modules/join/join.route';

// routes

const routes: RouteRecordRaw[] = [
  ...calloutRoute,
  ...informationRoute,
  ...joinRoute,
  ...homeRoute,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
