import { createRouter, createWebHistory } from 'vue-router';

const baseUrl = import.meta.env.VITE_BASE_URL || '';

export const routes = [
  {
    path: `${baseUrl}/`,
    name: 'Home',
    component: () => import('@/pages/HomePage/HomePage.vue'),
  },
  {
    path: `${baseUrl}/test-page-1`,
    name: 'TestPage1',
    component: () => import('@/pages/TestPage1/TestPage1.vue'),
  },
  {
    path: `${baseUrl}/main-reestr-page`,
    name: 'MainReestrPage',
    component: () => import('@/pages/MainReestrPage/MainReestrPage.vue'),
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
