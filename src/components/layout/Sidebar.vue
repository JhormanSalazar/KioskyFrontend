<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import {
    LayoutDashboard,
    Package,
    FolderOpen,
    Edit3,
    Settings,
    Crown
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

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
        icon: Settings,
        path: '/configuracion'
    }
]

const isActiveRoute = (path: string) => {
    return route.path === path
}

const navigateTo = (path: string) => {
    router.push(path)
}
</script>

<template>
    <div class="sidebar h-screen w-64 bg-gray-900 text-white flex flex-col fixed left-0 top-0 z-40">
        <!-- Header -->
        <div class="p-6 px-4 border-b border-gray-700">
            <div class="flex items-center space-x-3">
                <div>
                    <h1 class="text-lg font-semibold text-amber-200">Kiosky</h1>
                    <p class="text-sm text-gray-400">Panel de Administración</p>
                </div>
            </div>
        </div>

        <!-- Navigation Menu -->
        <nav class="flex-1 px-4 py-6">
            <ul class="space-y-2">
                <li v-for="item in menuItems" :key="item.path">
                    <button @click="navigateTo(item.path)" :class="[
                        'w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 gap-1',
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

        <!-- Plan Section -->
        <div class="p-4 border-t border-gray-700">
            <div class="bg-gray-800 rounded-lg p-4">
                <p class="text-xs text-gray-400 mb-1">Plan Actual</p>
                <p class="text-sm font-semibold text-white mb-3">Plan Gratuito</p>
                <button
                    class="w-full flex items-center justify-center space-x-2 bg-amber-200 text-black py-2 px-3 rounded-md hover:bg-amber-100 transition-colors duration-200">
                    <Crown class="h-4 w-4" />
                    <span class="text-sm font-medium">Actualizar Plan</span>
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
