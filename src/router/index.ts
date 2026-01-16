import { createRouter, createWebHistory } from 'vue-router'
import Page from '../views/Page.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Page,
    }
  ],
})

export default router
