<script setup lang="ts">
import { computed } from 'vue'
import type { EditorBlock, HeroBlockProps, ProductGridBlockProps, CategoryGridBlockProps, TextBlockProps, DividerBlockProps, BannerBlockProps } from '@/types/editor.types'
import type { ProductResponse, CategoryResponse } from '@/types/api.types'
import { Package, FolderOpen } from 'lucide-vue-next'

const props = defineProps<{
  block: EditorBlock
  products: ProductResponse[]
  categories: CategoryResponse[]
  isSelected?: boolean
}>()

// ─── Helpers de tipado ────────────────────────────────────────────────────────
const heroProps = computed(() => props.block.props as HeroBlockProps)
const productProps = computed(() => props.block.props as ProductGridBlockProps)
const categoryProps = computed(() => props.block.props as CategoryGridBlockProps)
const textProps = computed(() => props.block.props as TextBlockProps)
const dividerProps = computed(() => props.block.props as DividerBlockProps)
const bannerProps = computed(() => props.block.props as BannerBlockProps)

const visibleProducts = computed(() => {
  const { onlyVisible, maxProducts } = productProps.value
  const filtered = onlyVisible
    ? props.products.filter((p) => p.isVisible)
    : props.products
  return filtered.slice(0, maxProducts)
})

const colsClass = (cols: number) =>
({
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
}[cols] ?? 'grid-cols-3')

const textSizeClass = (size: string) =>
({
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-2xl',
}[size] ?? 'text-base')

const dividerSpacingClass = (spacing: string) =>
({
  sm: 'my-2',
  md: 'my-5',
  lg: 'my-8',
}[spacing] ?? 'my-5')

const alignClass = (alignment: string) =>
({
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}[alignment] ?? 'text-left')

const formatPrice = (price: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(price)
</script>

<template>
  <!-- ── HERO ────────────────────────────────────────────────────────────── -->
  <div v-if="block.type === 'hero'" :style="{ backgroundColor: heroProps.bgColor, color: heroProps.textColor }"
    :class="['px-8 py-14 rounded-lg', alignClass(heroProps.alignment)]">
    <h1 class="text-3xl font-bold leading-tight mb-3">{{ heroProps.title }}</h1>
    <p class="text-base opacity-75 mb-6">{{ heroProps.subtitle }}</p>
    <button v-if="heroProps.ctaVisible" :style="{ backgroundColor: heroProps.textColor, color: heroProps.bgColor }"
      class="px-6 py-2 rounded-lg font-semibold text-sm transition-opacity hover:opacity-90">
      {{ heroProps.ctaText }}
    </button>
  </div>

  <!-- ── PRODUCT GRID ────────────────────────────────────────────────────── -->
  <div v-else-if="block.type === 'product-grid'" class="px-1 py-4">
    <h2 v-if="productProps.title" class="text-lg font-semibold text-gray-100 mb-4">
      {{ productProps.title }}
    </h2>

    <div v-if="visibleProducts.length" :class="['grid gap-3', colsClass(productProps.columns)]">
      <div v-for="product in visibleProducts" :key="product.id"
        class="bg-gray-700/60 border border-gray-600/50 rounded-lg overflow-hidden">
        <!-- Product image / placeholder -->
        <div class="aspect-square bg-gray-700 flex items-center justify-center">
          <img v-if="product.images?.length" :src="product.images[0]" :alt="product.name"
            class="w-full h-full object-cover" />
          <Package v-else class="w-8 h-8 text-gray-500" />
        </div>
        <div class="p-3">
          <p class="text-sm font-medium text-gray-200 truncate">{{ product.name }}</p>
          <p v-if="productProps.showCategory" class="text-xs text-gray-500 mt-0.5">
            {{ product.categoryName }}
          </p>
          <p v-if="productProps.showPrices" class="text-sm font-bold text-amber-400 mt-1.5">
            {{ formatPrice(product.price) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else
      class="flex flex-col items-center justify-center py-10 border border-dashed border-gray-600 rounded-lg gap-2">
      <Package class="w-8 h-8 text-gray-600" />
      <p class="text-sm text-gray-500">Sin productos disponibles</p>
    </div>
  </div>

  <!-- ── CATEGORY GRID ───────────────────────────────────────────────────── -->
  <div v-else-if="block.type === 'category-grid'" class="px-1 py-4">
    <h2 v-if="categoryProps.title" class="text-lg font-semibold text-gray-100 mb-4">
      {{ categoryProps.title }}
    </h2>

    <div v-if="categories.length" :class="['grid gap-3', colsClass(categoryProps.columns)]">
      <div v-for="category in categories" :key="category.id"
        class="bg-gray-700/60 border border-gray-600/50 rounded-lg p-4 flex flex-col items-center gap-2 text-center">
        <div class="w-10 h-10 bg-amber-400/10 ring-1 ring-amber-400/20 rounded-lg flex items-center justify-center">
          <FolderOpen class="w-5 h-5 text-amber-400" />
        </div>
        <p class="text-sm font-medium text-gray-200">{{ category.name }}</p>
        <p v-if="categoryProps.showProductCount" class="text-xs text-gray-500">
          {{ category.productCount }} {{ category.productCount === 1 ? 'producto' : 'productos' }}
        </p>
      </div>
    </div>

    <div v-else
      class="flex flex-col items-center justify-center py-10 border border-dashed border-gray-600 rounded-lg gap-2">
      <FolderOpen class="w-8 h-8 text-gray-600" />
      <p class="text-sm text-gray-500">Sin categorías disponibles</p>
    </div>
  </div>

  <!-- ── TEXT BLOCK ──────────────────────────────────────────────────────── -->
  <div v-else-if="block.type === 'text-block'"
    :class="['px-1 py-4 whitespace-pre-wrap', textSizeClass(textProps.size), alignClass(textProps.alignment)]"
    :style="{ color: textProps.color }">
    {{ textProps.content }}
  </div>

  <!-- ── BANNER ──────────────────────────────────────────────────────────── -->
  <div v-else-if="block.type === 'banner'"
    :style="{ backgroundColor: bannerProps.bgColor, color: bannerProps.textColor }"
    class="px-6 py-4 rounded-lg text-center font-semibold text-sm">
    {{ bannerProps.text }}
  </div>

  <!-- ── DIVIDER ─────────────────────────────────────────────────────────── -->
  <div v-else-if="block.type === 'divider'" :class="['px-1', dividerSpacingClass(dividerProps.spacing)]">
    <hr :style="{ borderColor: dividerProps.color, borderStyle: dividerProps.style }" class="border-t" />
  </div>
</template>
