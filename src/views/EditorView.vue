<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import draggable from 'vuedraggable'
import {
  Save, Eye, EyeOff, RotateCcw, Trash2, GripVertical, ChevronRight,
  Sparkles, Package, FolderOpen, AlignLeft, Minus, Megaphone,
  Palette, Settings, Plus, CheckCircle2, AlertCircle
} from 'lucide-vue-next'

import { useUserStore } from '@/stores/user'
import { useApi, useApiMutation } from '@/composables/useApi'
import { useNotifications } from '@/composables/useNotifications'
import { productService, categoryService, storeService } from '@/api/services'
import CatalogBlockRenderer from '@/components/editor/CatalogBlockRenderer.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

import type { StoreResponse } from '@/types/api.types'

import {
  BLOCK_DEFINITIONS,
  DEFAULT_CATALOG_LAYOUT,
  type EditorBlock,
  type CatalogLayout,
  type BlockType,
  type HeroBlockProps,
  type ProductGridBlockProps,
  type CategoryGridBlockProps,
  type TextBlockProps,
  type DividerBlockProps,
  type BannerBlockProps,
} from '@/types/editor.types'
import type { ProductResponse, CategoryResponse } from '@/types/api.types'

// ─── State ────────────────────────────────────────────────────────────────────
const userStore = useUserStore()
const { success, error: notifyError } = useNotifications()
const storeId = computed(() => userStore.currentUser?.storeId)

const previewMode = ref(false)
const selectedBlockId = ref<string | null>(null)
const hasUnsavedChanges = ref(false)
const isSaving = ref(false)
const activePanel = ref<'blocks' | 'theme'>('blocks')

// Serializamos y deserializamos el layout para romper referencias (reactividad) y evitar mutaciones reactivas no deseadas al clonar bloques o resetear al default. Esto hace que cada bloque tenga su propio objeto de props independiente.
const layout = ref<CatalogLayout>(JSON.parse(JSON.stringify(DEFAULT_CATALOG_LAYOUT)))

// ─── API ──────────────────────────────────────────────────────────────────────
const {
  data: products,
  loading: loadingProducts,
  execute: loadProducts,
} = useApi<ProductResponse[], [number]>(productService.getByStoreId) // [number] le dice a TypeScript: "La función execute debe llamarse pasando un único número entre los paréntesis"

const {
  data: categories,
  loading: loadingCategories,
  execute: loadCategories,
} = useApi<CategoryResponse[], [number]>(categoryService.getByStoreId)

const {
  data: storeData,
  loading: loadingStore,
  execute: loadStore,
} = useApi<StoreResponse, [number]>(storeService.getById)

const { mutate: saveTheme, loading: savingTheme } = useApiMutation<any, [number, string]>(
  storeService.updateThemeSettings
)

const loading = computed(() => loadingProducts.value || loadingCategories.value || loadingStore.value)

// ─── Init ─────────────────────────────────────────────────────────────────────
onMounted(async () => {
  if (!storeId.value) return
  await Promise.all([
    loadProducts(storeId.value),
    loadCategories(storeId.value),
    loadStore(storeId.value),
  ])
  // Restore saved layout from themeSettings
  if (storeData.value?.themeSettings) {
    try {
      // 1. Intenta convertir el string de la DB a un objeto JS
      const parsed = JSON.parse(storeData.value.themeSettings) as CatalogLayout

      // 2. Si el objeto tiene la estructura esperada, lo aplica al editor
      if (parsed?.blocks) {
        layout.value = parsed
      }
    } catch {
      // 3. Si algo falla, no rompas la app, simplemente usa el layout por defecto
      /* first time or invalid JSON → use default */
    }
  }
})

// ─── Selected block ───────────────────────────────────────────────────────────
const selectedBlock = computed<EditorBlock | null>(() =>
  selectedBlockId.value
    ? layout.value.blocks.find((b) => b.id === selectedBlockId.value) ?? null
    : null
)

function selectBlock(id: string) {
  selectedBlockId.value = id === selectedBlockId.value ? null : id
}

// ─── Drag & drop ──────────────────────────────────────────────────────────────
const paletteItems = BLOCK_DEFINITIONS

const paletteGroup = { name: 'catalog-blocks', pull: 'clone', put: false }
const canvasGroup = { name: 'catalog-blocks', pull: true, put: true }

function cloneBlock(original: typeof BLOCK_DEFINITIONS[0]): EditorBlock {
  return {
    id: `block-${original.type}-${Date.now()}`,
    type: original.type,
    props: JSON.parse(JSON.stringify(original.defaultProps)),
  }
}

function onCanvasChange() {
  hasUnsavedChanges.value = true
  // Deselect if block was removed
  if (selectedBlockId.value && !layout.value.blocks.find((b) => b.id === selectedBlockId.value)) {
    selectedBlockId.value = null
  }
}

function removeBlock(id: string) {
  layout.value.blocks = layout.value.blocks.filter((b) => b.id !== id)
  if (selectedBlockId.value === id) selectedBlockId.value = null
  hasUnsavedChanges.value = true
}

// ─── Theme changes ────────────────────────────────────────────────────────────
watch(
  () => layout.value.theme,
  () => { hasUnsavedChanges.value = true },
  { deep: true }
)

// ─── Save ─────────────────────────────────────────────────────────────────────
async function saveLayout() {
  if (!storeId.value) return
  isSaving.value = true
  const json = JSON.stringify(layout.value)
  const result = await saveTheme(storeId.value, json)
  isSaving.value = false
  if (result) {
    hasUnsavedChanges.value = false
    success('Catálogo guardado', 'Los cambios fueron guardados correctamente.')
  } else {
    notifyError('Error al guardar', 'No se pudo guardar el catálogo. Inténtalo de nuevo.')
  }
}

// ─── Reset to default ─────────────────────────────────────────────────────────
function resetLayout() {
  layout.value = JSON.parse(JSON.stringify(DEFAULT_CATALOG_LAYOUT))
  selectedBlockId.value = null
  hasUnsavedChanges.value = true
}

// ─── Icon map ─────────────────────────────────────────────────────────────────
const iconComponents: Record<string, any> = {
  Sparkles,
  Package,
  FolderOpen,
  AlignLeft,
  Minus,
  Megaphone,
}

// ─── Settings panel helpers ───────────────────────────────────────────────────
const heroProps = computed(() => selectedBlock.value?.type === 'hero' ? (selectedBlock.value.props as HeroBlockProps) : null)
const productProps = computed(() => selectedBlock.value?.type === 'product-grid' ? (selectedBlock.value.props as ProductGridBlockProps) : null)
const categoryProps = computed(() => selectedBlock.value?.type === 'category-grid' ? (selectedBlock.value.props as CategoryGridBlockProps) : null)
const textProps = computed(() => selectedBlock.value?.type === 'text-block' ? (selectedBlock.value.props as TextBlockProps) : null)
const dividerProps = computed(() => selectedBlock.value?.type === 'divider' ? (selectedBlock.value.props as DividerBlockProps) : null)
const bannerProps = computed(() => selectedBlock.value?.type === 'banner' ? (selectedBlock.value.props as BannerBlockProps) : null)

function updateBlockProp(block: EditorBlock, key: string, value: any) {
  ; (block.props as any)[key] = value
  hasUnsavedChanges.value = true
}

function setSelectedProp(key: string, value: any) {
  if (selectedBlock.value) updateBlockProp(selectedBlock.value, key, value)
}

const blockLabel = (type: BlockType) => BLOCK_DEFINITIONS.find((d) => d.type === type)?.label ?? type
</script>

<template>
  <div class="editor-view flex flex-col h-full min-h-0" style="height: calc(100vh - 2rem)">

    <!-- ── Top bar ─────────────────────────────────────────────────────────── -->
    <div
      class="flex items-center justify-between mb-4 bg-gray-900/80 backdrop-blur-sm rounded-lg px-4 py-3 border border-gray-700 shrink-0">
      <div>
        <h2 class="text-xl font-bold text-amber-200 leading-tight">Editor del catálogo</h2>
        <p class="text-xs text-gray-300 mt-0.5">Arrastra bloques para construir tu catálogo.</p>
      </div>

      <div class="flex items-center gap-2">
        <!-- Unsaved indicator -->
        <div v-if="hasUnsavedChanges" class="flex items-center gap-1.5 text-xs text-amber-400 mr-1">
          <AlertCircle class="w-3.5 h-3.5" />
          Cambios sin guardar
        </div>
        <div v-else class="flex items-center gap-1.5 text-xs text-green-400 mr-1">
          <CheckCircle2 class="w-3.5 h-3.5" />
          Guardado
        </div>

        <!-- Reset -->
        <button @click="resetLayout" title="Restablecer al diseño inicial"
          class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-gray-200 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors duration-200">
          <RotateCcw class="w-3.5 h-3.5" />
          Restablecer
        </button>

        <!-- Preview toggle -->
        <button @click="previewMode = !previewMode" :class="[
          'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-lg transition-colors duration-200',
          previewMode
            ? 'text-amber-300 bg-amber-400/10 border-amber-400/30 hover:bg-amber-400/20'
            : 'text-gray-400 hover:text-gray-200 bg-gray-800 hover:bg-gray-700 border-gray-700'
        ]">
          <component :is="previewMode ? EyeOff : Eye" class="w-3.5 h-3.5" />
          {{ previewMode ? 'Editar' : 'Vista previa' }}
        </button>

        <!-- Save -->
        <button @click="saveLayout" :disabled="isSaving || savingTheme"
          class="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-gray-900 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors duration-200">
          <Save class="w-3.5 h-3.5" />
          {{ isSaving || savingTheme ? 'Guardando...' : 'Guardar' }}
        </button>
      </div>
    </div>

    <!-- ── Main area ───────────────────────────────────────────────────────── -->
    <div class="flex-1 min-h-0 flex gap-4 overflow-hidden">

      <!-- Loading overlay -->
      <div v-if="loading" class="flex-1 flex items-center justify-center">
        <div class="flex flex-col items-center gap-3">
          <LoadingSpinner :size="60" />
          <p class="text-sm text-gray-500">Cargando datos de la tienda...</p>
        </div>
      </div>

      <template v-else>

        <!-- ── Left: Palette / Theme ─────────────────────────────────────── -->
        <div v-if="!previewMode"
          class="w-56 shrink-0 flex flex-col bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-lg overflow-hidden">
          <!-- Tab switcher -->
          <div class="flex border-b border-gray-700 shrink-0">
            <button
              v-for="tab in [{ id: 'blocks', icon: Plus, label: 'Bloques' }, { id: 'theme', icon: Palette, label: 'Tema' }]"
              :key="tab.id" @click="activePanel = tab.id as 'blocks' | 'theme'" :class="[
                'flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium border-b-2 transition-colors duration-200',
                activePanel === tab.id
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              ]">
              <component :is="tab.icon" class="w-3.5 h-3.5" />
              {{ tab.label }}
            </button>
          </div>

          <!-- BLOCKS palette -->
          <div v-if="activePanel === 'blocks'" class="flex-1 overflow-y-auto p-2 space-y-1">
            <p class="px-2 py-1.5 text-xs text-gray-600 font-medium uppercase tracking-wider">Arrastra al canvas</p>
            <draggable :list="paletteItems" :group="paletteGroup" :clone="cloneBlock" item-key="type" :sort="false"
              class="space-y-1">
              <template #item="{ element }">
                <div
                  class="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-gray-700/50 border border-gray-600/50 cursor-grab active:cursor-grabbing hover:bg-gray-700 hover:border-gray-500 transition-colors duration-150 select-none">
                  <component :is="iconComponents[element.icon]" class="w-4 h-4 text-amber-400 shrink-0" />
                  <div class="min-w-0">
                    <p class="text-xs font-medium text-gray-200">{{ element.label }}</p>
                    <p class="text-[10px] text-gray-500 truncate mt-0.5">{{ element.description }}</p>
                  </div>
                </div>
              </template>
            </draggable>
          </div>

          <!-- THEME panel -->
          <div v-if="activePanel === 'theme'" class="flex-1 overflow-y-auto p-3 space-y-4">
            <div>
              <label class="block text-xs font-medium text-gray-400 mb-1.5">Color primario</label>
              <div class="flex items-center gap-2">
                <input type="color" :value="layout.theme.primaryColor"
                  @input="layout.theme.primaryColor = ($event.target as HTMLInputElement).value"
                  class="w-8 h-8 rounded border border-gray-600 bg-gray-700 cursor-pointer p-0.5" />
                <span class="text-xs text-gray-500 font-mono">{{ layout.theme.primaryColor }}</span>
              </div>
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-400 mb-1.5">Color de acento</label>
              <div class="flex items-center gap-2">
                <input type="color" :value="layout.theme.accentColor"
                  @input="layout.theme.accentColor = ($event.target as HTMLInputElement).value"
                  class="w-8 h-8 rounded border border-gray-600 bg-gray-700 cursor-pointer p-0.5" />
                <span class="text-xs text-gray-500 font-mono">{{ layout.theme.accentColor }}</span>
              </div>
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-400 mb-1.5">Fondo del catálogo</label>
              <div class="flex items-center gap-2">
                <input type="color" :value="layout.theme.bgColor"
                  @input="layout.theme.bgColor = ($event.target as HTMLInputElement).value"
                  class="w-8 h-8 rounded border border-gray-600 bg-gray-700 cursor-pointer p-0.5" />
                <span class="text-xs text-gray-500 font-mono">{{ layout.theme.bgColor }}</span>
              </div>
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-400 mb-1.5">Fondo de tarjetas</label>
              <div class="flex items-center gap-2">
                <input type="color" :value="layout.theme.cardBgColor"
                  @input="layout.theme.cardBgColor = ($event.target as HTMLInputElement).value"
                  class="w-8 h-8 rounded border border-gray-600 bg-gray-700 cursor-pointer p-0.5" />
                <span class="text-xs text-gray-500 font-mono">{{ layout.theme.cardBgColor }}</span>
              </div>
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-400 mb-1.5">Radio de bordes</label>
              <select :value="layout.theme.borderRadius"
                @change="layout.theme.borderRadius = ($event.target as HTMLSelectElement).value as any"
                class="w-full bg-gray-700 border border-gray-600 text-gray-200 text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:border-amber-400">
                <option value="none">Sin bordes</option>
                <option value="sm">Pequeño</option>
                <option value="md">Mediano</option>
                <option value="lg">Grande</option>
                <option value="full">Completo</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-400 mb-1.5">Tipografía</label>
              <select :value="layout.theme.fontFamily"
                @change="layout.theme.fontFamily = ($event.target as HTMLSelectElement).value"
                class="w-full bg-gray-700 border border-gray-600 text-gray-200 text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:border-amber-400">
                <option value="Inter, sans-serif">Inter</option>
                <option value="'Roboto', sans-serif">Roboto</option>
                <option value="'Poppins', sans-serif">Poppins</option>
                <option value="'Playfair Display', serif">Playfair Display</option>
                <option value="'DM Sans', sans-serif">DM Sans</option>
              </select>
            </div>
          </div>
        </div>

        <!-- ── Center: Canvas ────────────────────────────────────────────── -->
        <div class="flex-1 min-w-0 overflow-y-auto rounded-lg border border-gray-700 p-4"
          :style="{ backgroundColor: previewMode ? layout.theme.bgColor : '#0f172a' }">
          <!-- Preview badge -->
          <div v-if="previewMode" class="flex items-center justify-center gap-2 mb-4">
            <div
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-xs text-amber-300">
              <Eye class="w-3 h-3" />
              Vista previa del catálogo
            </div>
          </div>

          <!-- Empty canvas state -->
          <div v-if="!layout.blocks.length && !previewMode"
            class="flex flex-col items-center justify-center gap-3 py-20 border-2 border-dashed border-gray-700 rounded-lg">
            <div class="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center">
              <Plus class="w-6 h-6 text-gray-600" />
            </div>
            <p class="text-sm text-gray-500 text-center">
              Arrastra bloques desde el panel izquierdo<br />para construir tu catálogo.
            </p>
          </div>

          <!-- Draggable canvas blocks -->
          <draggable v-model="layout.blocks" :group="canvasGroup" item-key="id" :animation="200"
            ghost-class="block-ghost" chosen-class="block-chosen" drag-class="block-drag" @change="onCanvasChange"
            class="space-y-3 min-h-16">
            <template #item="{ element }">
              <div :class="[
                'relative group/block rounded-lg transition-all duration-150',
                !previewMode && 'border',
                !previewMode && selectedBlockId === element.id
                  ? 'border-amber-400/60 bg-gray-800/40'
                  : !previewMode
                    ? 'border-gray-700/50 hover:border-gray-600/80 bg-gray-800/20'
                    : ''
              ]" @click.stop="!previewMode && selectBlock(element.id)">
                <!-- Drag handle & controls (edit mode only) -->
                <div v-if="!previewMode" :class="[
                  'absolute -top-px left-0 right-0 flex items-center justify-between px-2 py-1 rounded-t-lg opacity-0 group-hover/block:opacity-100 transition-opacity duration-150 z-10',
                  selectedBlockId === element.id ? 'opacity-100' : ''
                ]" style="background: linear-gradient(to bottom, rgba(17,24,39,0.9), transparent)">
                  <div class="flex items-center gap-1.5">
                    <GripVertical class="w-3.5 h-3.5 text-gray-500 cursor-grab active:cursor-grabbing" />
                    <span class="text-xs font-medium text-gray-400">{{ blockLabel(element.type) }}</span>
                  </div>
                  <button @click.stop="removeBlock(element.id)"
                    class="p-0.5 rounded text-gray-600 hover:text-rose-400 hover:bg-rose-400/10 transition-colors duration-150"
                    title="Eliminar bloque">
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>

                <!-- Selected border accent -->
                <div v-if="!previewMode && selectedBlockId === element.id"
                  class="absolute inset-0 rounded-lg ring-1 ring-amber-400/40 pointer-events-none" />

                <!-- Block content -->
                <div :class="!previewMode ? 'px-2 pt-6 pb-2' : ''">
                  <CatalogBlockRenderer :block="element" :products="products ?? []" :categories="categories ?? []"
                    :is-selected="selectedBlockId === element.id" />
                </div>
              </div>
            </template>
          </draggable>

          <!-- Preview empty state -->
          <div v-if="!layout.blocks.length && previewMode" class="text-center py-20">
            <p class="text-sm text-gray-500">Este catálogo no tiene bloques aún.</p>
          </div>
        </div>

        <!-- ── Right: Block settings ─────────────────────────────────────── -->
        <div v-if="!previewMode"
          class="w-64 shrink-0 flex flex-col bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-lg overflow-hidden">
          <div class="flex items-center gap-2 px-4 py-3 border-b border-gray-700 shrink-0">
            <Settings class="w-4 h-4 text-amber-400" />
            <h3 class="text-sm font-semibold text-gray-200">Propiedades</h3>
          </div>

          <!-- No block selected -->
          <div v-if="!selectedBlock" class="flex-1 flex flex-col items-center justify-center gap-2 p-4 text-center">
            <ChevronRight class="w-6 h-6 text-gray-700" />
            <p class="text-xs text-gray-600 leading-relaxed">
              Haz clic en un bloque del canvas para editar sus propiedades.
            </p>
          </div>

          <!-- Block settings form -->
          <div v-else class="flex-1 overflow-y-auto p-3 space-y-4">

            <p class="text-xs font-semibold text-amber-400/80 uppercase tracking-wider">
              {{ blockLabel(selectedBlock.type) }}
            </p>

            <!-- ─ HERO settings ─────────────────────── -->
            <template v-if="heroProps">
              <div class="space-y-3">
                <div>
                  <label class="settings-label">Título</label>
                  <input type="text" :value="heroProps.title"
                    @input="setSelectedProp('title', ($event.target as HTMLInputElement).value)"
                    class="settings-input" />
                </div>
                <div>
                  <label class="settings-label">Subtítulo</label>
                  <textarea :value="heroProps.subtitle"
                    @input="setSelectedProp('subtitle', ($event.target as HTMLTextAreaElement).value)"
                    class="settings-input resize-none" rows="2" />
                </div>
                <div>
                  <label class="settings-label">Alineación</label>
                  <select :value="heroProps.alignment"
                    @change="setSelectedProp('alignment', ($event.target as HTMLSelectElement).value)"
                    class="settings-input">
                    <option value="left">Izquierda</option>
                    <option value="center">Centro</option>
                    <option value="right">Derecha</option>
                  </select>
                </div>
                <div class="flex gap-2">
                  <div class="flex-1">
                    <label class="settings-label">Color de fondo</label>
                    <input type="color" :value="heroProps.bgColor"
                      @input="setSelectedProp('bgColor', ($event.target as HTMLInputElement).value)"
                      class="settings-color" />
                  </div>
                  <div class="flex-1">
                    <label class="settings-label">Color de texto</label>
                    <input type="color" :value="heroProps.textColor"
                      @input="setSelectedProp('textColor', ($event.target as HTMLInputElement).value)"
                      class="settings-color" />
                  </div>
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <input type="checkbox" :checked="heroProps.ctaVisible"
                      @change="setSelectedProp('ctaVisible', ($event.target as HTMLInputElement).checked)"
                      class="settings-checkbox" id="cta-visible" />
                    <label for="cta-visible" class="text-xs text-gray-400 cursor-pointer">Mostrar botón CTA</label>
                  </div>
                </div>
                <div v-if="heroProps.ctaVisible">
                  <label class="settings-label">Texto del botón</label>
                  <input type="text" :value="heroProps.ctaText"
                    @input="setSelectedProp('ctaText', ($event.target as HTMLInputElement).value)"
                    class="settings-input" />
                </div>
              </div>
            </template>

            <!-- ─ PRODUCT GRID settings ─────────────── -->
            <template v-if="productProps">
              <div class="space-y-3">
                <div>
                  <label class="settings-label">Título de sección</label>
                  <input type="text" :value="productProps.title"
                    @input="setSelectedProp('title', ($event.target as HTMLInputElement).value)"
                    class="settings-input" />
                </div>
                <div>
                  <label class="settings-label">Columnas</label>
                  <select :value="productProps.columns"
                    @change="setSelectedProp('columns', parseInt(($event.target as HTMLSelectElement).value))"
                    class="settings-input">
                    <option value="2">2 columnas</option>
                    <option value="3">3 columnas</option>
                    <option value="4">4 columnas</option>
                  </select>
                </div>
                <div>
                  <label class="settings-label">Máximo de productos</label>
                  <input type="number" :value="productProps.maxProducts"
                    @input="setSelectedProp('maxProducts', parseInt(($event.target as HTMLInputElement).value) || 6)"
                    min="1" max="24" class="settings-input" />
                </div>
                <div class="space-y-2">
                  <label class="settings-label mb-0">Opciones de visualización</label>
                  <div class="flex items-center gap-2">
                    <input type="checkbox" :checked="productProps.showPrices"
                      @change="setSelectedProp('showPrices', ($event.target as HTMLInputElement).checked)"
                      class="settings-checkbox" id="show-prices" />
                    <label for="show-prices" class="text-xs text-gray-400 cursor-pointer">Mostrar precios</label>
                  </div>
                  <div class="flex items-center gap-2">
                    <input type="checkbox" :checked="productProps.showCategory"
                      @change="setSelectedProp('showCategory', ($event.target as HTMLInputElement).checked)"
                      class="settings-checkbox" id="show-cat" />
                    <label for="show-cat" class="text-xs text-gray-400 cursor-pointer">Mostrar categoría</label>
                  </div>
                  <div class="flex items-center gap-2">
                    <input type="checkbox" :checked="productProps.onlyVisible"
                      @change="setSelectedProp('onlyVisible', ($event.target as HTMLInputElement).checked)"
                      class="settings-checkbox" id="only-visible" />
                    <label for="only-visible" class="text-xs text-gray-400 cursor-pointer">Solo visibles</label>
                  </div>
                </div>
              </div>
            </template>

            <!-- ─ CATEGORY GRID settings ─────────────── -->
            <template v-if="categoryProps">
              <div class="space-y-3">
                <div>
                  <label class="settings-label">Título de sección</label>
                  <input type="text" :value="categoryProps.title"
                    @input="setSelectedProp('title', ($event.target as HTMLInputElement).value)"
                    class="settings-input" />
                </div>
                <div>
                  <label class="settings-label">Columnas</label>
                  <select :value="categoryProps.columns"
                    @change="setSelectedProp('columns', parseInt(($event.target as HTMLSelectElement).value))"
                    class="settings-input">
                    <option value="2">2 columnas</option>
                    <option value="3">3 columnas</option>
                    <option value="4">4 columnas</option>
                  </select>
                </div>
                <div class="flex items-center gap-2">
                  <input type="checkbox" :checked="categoryProps.showProductCount"
                    @change="setSelectedProp('showProductCount', ($event.target as HTMLInputElement).checked)"
                    class="settings-checkbox" id="show-pcount" />
                  <label for="show-pcount" class="text-xs text-gray-400 cursor-pointer">Mostrar nro. de
                    productos</label>
                </div>
              </div>
            </template>

            <!-- ─ TEXT BLOCK settings ─────────────────── -->
            <template v-if="textProps">
              <div class="space-y-3">
                <div>
                  <label class="settings-label">Contenido</label>
                  <textarea :value="textProps.content"
                    @input="setSelectedProp('content', ($event.target as HTMLTextAreaElement).value)"
                    class="settings-input resize-none" rows="4" />
                </div>
                <div>
                  <label class="settings-label">Tamaño</label>
                  <select :value="textProps.size"
                    @change="setSelectedProp('size', ($event.target as HTMLSelectElement).value)"
                    class="settings-input">
                    <option value="sm">Pequeño</option>
                    <option value="md">Mediano</option>
                    <option value="lg">Grande</option>
                    <option value="xl">Extra grande</option>
                  </select>
                </div>
                <div>
                  <label class="settings-label">Alineación</label>
                  <select :value="textProps.alignment"
                    @change="setSelectedProp('alignment', ($event.target as HTMLSelectElement).value)"
                    class="settings-input">
                    <option value="left">Izquierda</option>
                    <option value="center">Centro</option>
                    <option value="right">Derecha</option>
                  </select>
                </div>
                <div>
                  <label class="settings-label">Color del texto</label>
                  <input type="color" :value="textProps.color"
                    @input="setSelectedProp('color', ($event.target as HTMLInputElement).value)"
                    class="settings-color" />
                </div>
              </div>
            </template>

            <!-- ─ BANNER settings ─────────────────────── -->
            <template v-if="bannerProps">
              <div class="space-y-3">
                <div>
                  <label class="settings-label">Texto del banner</label>
                  <textarea :value="bannerProps.text"
                    @input="setSelectedProp('text', ($event.target as HTMLTextAreaElement).value)"
                    class="settings-input resize-none" rows="2" />
                </div>
                <div class="flex gap-2">
                  <div class="flex-1">
                    <label class="settings-label">Fondo</label>
                    <input type="color" :value="bannerProps.bgColor"
                      @input="setSelectedProp('bgColor', ($event.target as HTMLInputElement).value)"
                      class="settings-color" />
                  </div>
                  <div class="flex-1">
                    <label class="settings-label">Texto</label>
                    <input type="color" :value="bannerProps.textColor"
                      @input="setSelectedProp('textColor', ($event.target as HTMLInputElement).value)"
                      class="settings-color" />
                  </div>
                </div>
              </div>
            </template>

            <!-- ─ DIVIDER settings ───────────────────── -->
            <template v-if="dividerProps">
              <div class="space-y-3">
                <div>
                  <label class="settings-label">Estilo de línea</label>
                  <select :value="dividerProps.style"
                    @change="setSelectedProp('style', ($event.target as HTMLSelectElement).value)"
                    class="settings-input">
                    <option value="solid">Sólido</option>
                    <option value="dashed">Guiones</option>
                    <option value="dotted">Puntos</option>
                  </select>
                </div>
                <div>
                  <label class="settings-label">Espaciado</label>
                  <select :value="dividerProps.spacing"
                    @change="setSelectedProp('spacing', ($event.target as HTMLSelectElement).value)"
                    class="settings-input">
                    <option value="sm">Pequeño</option>
                    <option value="md">Mediano</option>
                    <option value="lg">Grande</option>
                  </select>
                </div>
                <div>
                  <label class="settings-label">Color</label>
                  <input type="color" :value="dividerProps.color"
                    @input="setSelectedProp('color', ($event.target as HTMLInputElement).value)"
                    class="settings-color" />
                </div>
              </div>
            </template>

          </div>
        </div>

      </template>
    </div>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.editor-view {
  max-width: 100%;
}

/* Ghost / drag states */
:deep(.block-ghost) {
  opacity: 0.4;
  background: rgba(251, 191, 36, 0.05);
  border: 1px dashed rgba(251, 191, 36, 0.3) !important;
  border-radius: 0.5rem;
}

:deep(.block-chosen) {
  box-shadow: 0 0 0 2px rgba(251, 191, 36, 0.3);
}

:deep(.block-drag) {
  opacity: 0.9;
}

/* Shared settings form inputs */
.settings-label {
  @apply block text-xs font-medium text-gray-400 mb-1;
}

.settings-input {
  @apply w-full bg-gray-700 border border-gray-600 text-gray-200 text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:border-amber-400 transition-colors duration-150;
}

.settings-color {
  @apply w-full h-8 rounded border border-gray-600 bg-gray-700 cursor-pointer p-0.5;
}

.settings-checkbox {
  @apply w-3.5 h-3.5 rounded border-gray-600 bg-gray-700 text-amber-400 cursor-pointer accent-amber-400;
}
</style>
