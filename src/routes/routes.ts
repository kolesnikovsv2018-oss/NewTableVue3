import { createRouter, createWebHistory } from 'vue-router';

export const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../pages/HomePage/HomePage.vue'),
  },
  {
    path: '/test-page-1',
    name: 'TestPage1',
    component: () => import('../pages/TestPage1/TestPage1.vue'),
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
