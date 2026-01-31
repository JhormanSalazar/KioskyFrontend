import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DashboardLayout from '../layouts/DashboardLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../components/login-signup/Signup.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../components/login-signup/Login.vue'),
    },
    // Rutas protegidas con layout del dashboard
    {
      path: '/dashboard',
      component: DashboardLayout,
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('../views/DashboardView.vue'),
        },
        {
          path: '/productos',
          name: 'productos',
          component: () => import('../views/ProductosView.vue'),
        },
        {
          path: '/categorias',
          name: 'categorias',
          component: () => import('../views/CategoriasView.vue'),
        },
        {
          path: '/editor',
          name: 'editor',
          component: () => import('../views/EditorView.vue'),
        },
        {
          path: '/configuracion',
          name: 'configuracion',
          component: () => import('../views/ConfiguracionView.vue'),
        },
      ],
    },
  ],
})

export default router
