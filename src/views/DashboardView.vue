<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { Package, FolderOpen, Eye, BarChart3, Package2, Clock } from 'lucide-vue-next'
import { useUserStore } from '@/stores/user'
import { useApi } from '@/composables/useApi'
import { productService, categoryService } from '@/api/services'
import StatCard from '@/components/ui/StatCard.vue'
import type { ProductResponse, CategoryResponse } from '@/types/api.types'

const userStore = useUserStore()
const storeId = computed(() => userStore.currentUser?.storeId)

const {
  data: products,
  loading: loadingProducts,
  execute: loadProducts,
} = useApi<ProductResponse[], [number]>(productService.getByStoreId)

const {
  data: categories,
  loading: loadingCategories,
  execute: loadCategories,
} = useApi<CategoryResponse[], [number]>(categoryService.getByStoreId)

onMounted(async () => {
  if (storeId.value) {
    await Promise.all([loadProducts(storeId.value), loadCategories(storeId.value)])
  }
})

// ─── Stats ────────────────────────────────────────────────────────────────────
const totalProducts = computed(() => products.value?.length ?? 0)
const visibleProducts = computed(() => products.value?.filter((p) => p.isVisible).length ?? 0)
const totalCategories = computed(() => categories.value?.length ?? 0)

// Visitas al catálogo (persistidas en localStorage)
const VISITS_KEY = 'catalog_visits'
const catalogVisits = computed(() => {
  const stored = localStorage.getItem(VISITS_KEY)
  return stored ? parseInt(stored, 10) : 0
})

const loadingStats = computed(() => loadingProducts.value || loadingCategories.value)

// ─── Actividad reciente ───────────────────────────────────────────────────────
interface ActivityItem {
  id: string
  icon: typeof Package
  color: string
  dotColor: string
  description: string
  meta: string
  time: string
}

const recentActivity = computed((): ActivityItem[] => {
  const items: ActivityItem[] = []

  // Últimos 3 productos ordenados por createdAt desc
  const recentProducts = [...(products.value ?? [])]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)

  for (const p of recentProducts) {
    items.push({
      id: `product-${p.id}`,
      icon: Package,
      color: 'text-blue-400',
      dotColor: 'bg-blue-400',
      description: `Producto "${p.name}"`,
      meta: p.categoryName,
      time: formatRelativeTime(p.createdAt),
    })
  }

  // Categorías (sin timestamp → las mostramos al final)
  for (const c of (categories.value ?? []).slice(0, 2)) {
    items.push({
      id: `category-${c.id}`,
      icon: FolderOpen,
      color: 'text-amber-400',
      dotColor: 'bg-amber-400',
      description: `Categoría "${c.name}"`,
      meta: `${c.productCount} ${c.productCount === 1 ? 'producto' : 'productos'}`,
      time: '—',
    })
  }

  return items.slice(0, 5)
})

function formatRelativeTime(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime()
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return 'Ahora'
  if (minutes < 60) return `Hace ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `Hace ${hours} h`
  const days = Math.floor(hours / 24)
  return `Hace ${days} día${days > 1 ? 's' : ''}`
}
</script>

<template>
  <div class="dashboard-view space-y-6">

    <!-- Header ────────────────────────────────────────────────────────────── -->
    <div
      class="flex items-center justify-between bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
      <div>
        <h2 class="text-2xl font-bold text-amber-200">Dashboard</h2>
        <p class="text-sm text-gray-400 mt-1 ml-0.5">
          Bienvenido de vuelta. Aquí tienes un resumen de tu tienda.
        </p>
      </div>
      <div v-if="storeId"
        class="text-xs text-gray-600 font-mono bg-gray-800 px-3 py-1.5 rounded border border-gray-700">
        Tienda #{{ storeId }}
      </div>
    </div>

    <!-- Stats cards ────────────────────────────────────────────────────────── -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Total de productos" :value="totalProducts" :icon="Package" color="blue" :loading="loadingStats"
        :subtitle="storeId ? undefined : 'Sin tienda asignada'" />
      <StatCard title="Productos visibles" :value="visibleProducts" :icon="Eye" color="green" :loading="loadingStats"
        :subtitle="totalProducts > 0 ? `de ${totalProducts} total` : undefined" />
      <StatCard title="Categorías" :value="totalCategories" :icon="FolderOpen" color="purple" :loading="loadingStats" />
      <StatCard title="Visitas al catálogo" :value="catalogVisits" :icon="BarChart3" color="amber"
        :subtitle="'Total acumulado'" />
    </div>

    <!-- Bottom grid: activity + quick stats ──────────────────────────────── -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">

      <!-- Recent activity ──── -->
      <div class="lg:col-span-2 bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-700">
        <div class="flex items-center gap-2 p-4 border-b border-gray-700">
          <Clock class="w-4 h-4 text-amber-400" />
          <h3 class="text-sm font-semibold text-gray-200">Actividad reciente</h3>
        </div>

        <!-- Loading -->
        <div v-if="loadingStats" class="p-4 space-y-4">
          <div v-for="i in 4" :key="i" class="flex items-center gap-3">
            <div class="w-2 h-2 rounded-full bg-gray-700 animate-pulse shrink-0" />
            <div class="flex-1 space-y-1.5">
              <div class="h-3 bg-gray-700 rounded animate-pulse w-3/4" />
              <div class="h-2.5 bg-gray-700 rounded animate-pulse w-1/4" />
            </div>
          </div>
        </div>

        <!-- Items -->
        <div v-else-if="recentActivity.length" class="p-4 divide-y divide-gray-700/50">
          <div v-for="item in recentActivity" :key="item.id" class="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
            <div :class="['mt-1.5 w-2 h-2 rounded-full shrink-0', item.dotColor]" />
            <div class="min-w-0 flex-1">
              <p class="text-sm text-gray-200 truncate">{{ item.description }}</p>
              <p class="text-xs text-gray-500 mt-0.5">{{ item.meta }}</p>
            </div>
            <span class="shrink-0 text-xs text-gray-600 whitespace-nowrap">{{ item.time }}</span>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else class="flex flex-col items-center justify-center gap-2 py-12 px-4">
          <Package2 class="w-8 h-8 text-gray-700" />
          <p class="text-sm text-gray-500 text-center">
            Sin actividad reciente.<br />Agrega productos o categorías para comenzar.
          </p>
        </div>
      </div>

      <!-- Quick summary ────── -->
      <div class="bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-700 flex flex-col">
        <div class="flex items-center gap-2 p-4 border-b border-gray-700">
          <BarChart3 class="w-4 h-4 text-amber-400" />
          <h3 class="text-sm font-semibold text-gray-200">Resumen</h3>
        </div>

        <div class="flex-1 p-4 space-y-4">
          <!-- Products by visibility -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <p class="text-xs text-gray-400">Visibilidad de productos</p>
              <p class="text-xs font-medium text-gray-300">
                {{ totalProducts > 0 ? Math.round((visibleProducts / totalProducts) * 100) : 0 }}%
              </p>
            </div>
            <div class="h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div class="h-full bg-green-400 rounded-full transition-all duration-500" :style="{
                width: totalProducts > 0 ? `${(visibleProducts / totalProducts) * 100}%` : '0%'
              }" />
            </div>
          </div>

          <!-- Products per category avg -->
          <div class="pt-1 space-y-2">
            <p class="text-xs text-gray-400 mb-3">Productos por categoría</p>
            <div v-if="!loadingStats">
              <div v-for="cat in (categories ?? []).slice(0, 4)" :key="cat.id" class="flex items-center gap-2 mb-2">
                <FolderOpen class="w-3 h-3 text-gray-500 shrink-0" />
                <p class="text-xs text-gray-400 truncate flex-1">{{ cat.name }}</p>
                <span class="text-xs font-medium text-amber-400 shrink-0">{{ cat.productCount }}</span>
              </div>
              <p v-if="!categories?.length" class="text-xs text-gray-600 text-center py-2">
                Sin categorías
              </p>
            </div>
            <div v-else class="space-y-2">
              <div v-for="i in 4" :key="i" class="flex gap-2 items-center">
                <div class="w-3 h-3 bg-gray-700 rounded animate-pulse" />
                <div class="h-2.5 bg-gray-700 rounded animate-pulse flex-1" />
                <div class="h-2.5 w-5 bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.dashboard-view {
  max-width: 100%;
}
</style>
