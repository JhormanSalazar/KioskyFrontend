<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  Edit3,
  UserCog,
  SquareUserRound
} from 'lucide-vue-next'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const menuItems = [
  {
    name: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard'
  },
  {
    name: 'Productos',
    icon: Package,
    path: '/productos'
  },
  {
    name: 'Categorías',
    icon: FolderOpen,
    path: '/categorias'
  },
  {
    name: 'Editor',
    icon: Edit3,
    path: '/editor'
  },
  {
    name: 'Configuración',
    icon: UserCog,
    path: '/configuracion'
  }
]

const isActiveRoute = (path: string) => {
  return route.path === path
}

const navigateTo = (path: string) => {
  router.push(path)
}

const handleLogout = () => {
  userStore.logout()
}
</script>

<template>
  <div class="sidebar h-screen w-64 bg-gray-900 text-white flex flex-col fixed left-0 top-0 z-40">
    <!-- Header -->
    <div class="p-6 px-4 border-b border-gray-700">
      <div class="flex items-center space-x-2">
        <div>
          <h1 class="text-lg font-semibold text-amber-200">Kiosky</h1>
          <p class="text-sm text-gray-400">Panel de Administración</p>
        </div>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 px-4 py-6">
      <ul class="space-y-1">
        <li v-for="item in menuItems" :key="item.path">
          <button @click="navigateTo(item.path)" :class="[
            'w-full flex items-center space-x-0.5 px-4 py-3 rounded-lg text-left transition-colors duration-200 gap-1',
            isActiveRoute(item.path)
              ? 'bg-gray-800 text-amber-200 shadow-sm'
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]">
            <component :is="item.icon" class="h-5 w-5" />
            <span class="font-medium">{{ item.name }}</span>
          </button>
        </li>
      </ul>
    </nav>

    <!-- User Section -->
    <div class="p-4 border-t border-gray-700">
      <div class="bg-gray-800 rounded-lg p-4">
        <div class="flex py-2 ">
          <SquareUserRound class="h-10 w-10 text-amber-200 flex-shrink-0" />
          <div class="flex flex-col pl-0.5 min-w-0 flex-1">
            <p class="text-md text-amber-200 font-semibold mb-1 truncate">{{ userStore.currentUser?.fullName }}</p>
            <p class="text-xs text-white mb-3">{{ userStore.currentUser?.role }}</p>
          </div>
        </div>
        <button @click="handleLogout"
          class="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-md bg-amber-200 text-gray-900 transition-colors duration-200 cursor-pointer hover:bg-amber-100">

          <span class="text-sm font-medium">Log out</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
}
</style>
