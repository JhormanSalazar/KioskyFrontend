import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DashboardLayout from '../layouts/DashboardLayout.vue'
import { authService } from '@/api/services/auth.service'
import { useUserStore } from '@/stores/user'

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

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  const publicPages = ['/', '/about', '/login', '/signup']
  const authRequired = !publicPages.includes(to.path)

  const hasToken = authService.isAuthenticated()

  if (hasToken && !userStore.currentUser) {
    try {
      await userStore.loadUser()
    } catch (error) {
      authService.logout()
      userStore.logout()
      if (authRequired) {
        return next({ name: 'login' })
      }
      console.error('Error loading user data:', error)
    }
  }

  // Proteger rutas privadas
  if (authRequired && !userStore.isAuthenticated) {
    return next({ name: 'login' })
  }

  // Si esta autenticado e intenta ir a login o signup, redirigir al dashboard
  if (userStore.isAuthenticated && (to.path === '/login' || to.path === '/signup')) {
    return next({ name: 'dashboard' })
  }

  // Continuar navegación si cumple con todo
  next()
})

export default router
