import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/profile',
  },
  {
    path: '/profile',
    component: () => import('../components/Profile.vue'),
    meta: {
      pageTitle: 'Your profile',
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
