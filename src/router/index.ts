import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from '@/pages/Dashboard.vue'
import Auth from '@/pages/Index.vue'
import { authGuard } from '@/middleware/auth'

const routes = [
  { path: '/', component: Auth },
  { path: '/dashboard', component: Dashboard, beforeEnter: authGuard }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
