<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { PackagePlus, Package, Eye, EyeOff } from 'lucide-vue-next'
import DataTable from '@/components/ui/DataTable.vue'
import FormModal from '@/components/ui/FormModal.vue'
import FormField from '@/components/ui/FormField.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import { productService, categoryService } from '@/api/services'
import { useUserStore } from '@/stores/user'
import { useNotifications } from '@/composables/useNotifications'
import type { ProductResponse, CreateProductRequest, UpdateProductRequest, CategoryResponse } from '@/types/api.types'
import type { TableColumn } from '@/components/ui/DataTable.vue'

/**
 * Vista de gestión de Productos
 *
 * Permite al usuario propietario de una tienda:
 * - Ver todos sus productos
 * - Crear nuevos productos
 * - Editar productos existentes
 * - Eliminar productos (con confirmación)
 * - Cambiar visibilidad de productos
 * - Validar slugs únicos
 */

// Stores y composables
const userStore = useUserStore()
const { success, error: notifyError, confirm } = useNotifications()

// Estado de datos
const products = ref<ProductResponse[]>([])
const categories = ref<CategoryResponse[]>([])
const loading = ref(false)
const loadError = ref<string | null>(null)

// Estado del modal
const showModal = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const savingProduct = ref(false)
const currentProductId = ref<number | null>(null)

// Formulario
const form = ref<Omit<CreateProductRequest, 'storeId'>>({
  name: '',
  slug: '',
  price: 0,
  description: '',
  categoryId: 0,
  isVisible: true,
  images: [''],
  attributes: ''
})

// Errores de validación
const formErrors = ref({
  name: '',
  slug: '',
  price: '',
  categoryId: '',
  images: ''
})

// Obtener storeId del usuario actual
const storeId = computed(() => userStore.currentUser?.storeId)

/**
 * Definición de columnas para la tabla
 */
const columns: TableColumn[] = [
  {
    key: 'name',
    label: 'Producto',
    cellClass: 'text-sm font-medium text-gray-900'
  },
  {
    key: 'categoryName',
    label: 'Categoría',
    cellClass: 'text-sm text-gray-600'
  },
  {
    key: 'price',
    label: 'Precio',
    cellClass: 'text-sm text-gray-900 font-semibold',
    format: (value: number) => {
      return `$${value.toFixed(2)}`
    }
  },
  {
    key: 'isVisible',
    label: 'Estado',
    cellClass: 'text-sm',
    format: (value: boolean) => {
      return value
        ? '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Visible</span>'
        : '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Oculto</span>'
    }
  }
]

/**
 * Cargar productos y categorías desde la API
 */
const loadProducts = async () => {
  if (!storeId.value) {
    notifyError('No se pudo obtener la información de la tienda')
    return
  }

  loading.value = true
  loadError.value = null

  try {
    const [productsData, categoriesData] = await Promise.all([
      productService.getByStoreId(storeId.value),
      categoryService.getByStoreId(storeId.value)
    ])

    products.value = productsData
    categories.value = categoriesData
  } catch (err: any) {
    loadError.value = err.message || 'Error al cargar los datos'
    notifyError(loadError.value)
    products.value = []
  } finally {
    loading.value = false
  }
}

/**
 * Validar el formulario
 */
const validateForm = (): boolean => {
  let isValid = true
  formErrors.value = { name: '', slug: '', price: '', categoryId: '', images: '' }

  // Validar nombre
  if (!form.value.name.trim()) {
    formErrors.value.name = 'El nombre es obligatorio'
    isValid = false
  }

  // Validar slug
  if (!form.value.slug.trim()) {
    formErrors.value.slug = 'El slug es obligatorio'
    isValid = false
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.value.slug)) {
    formErrors.value.slug = 'El slug solo puede contener letras minúsculas, números y guiones'
    isValid = false
  }

  // Validar precio
  if (form.value.price < 0) {
    formErrors.value.price = 'El precio no puede ser negativo'
    isValid = false
  }

  // Validar categoría
  if (!form.value.categoryId || form.value.categoryId === 0) {
    formErrors.value.categoryId = 'Debes seleccionar una categoría'
    isValid = false
  }

  return isValid
}

/**
 * Generar slug automáticamente desde el nombre
 */
const generateSlug = () => {
  const name = form.value.name.trim()
  if (name) {
    form.value.slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }
}

/**
 * Verificar si un slug ya existe
 */
const checkSlugExists = async (): Promise<boolean> => {
  if (!storeId.value || !form.value.slug.trim()) return false

  try {
    const exists = await productService.slugExists(storeId.value, form.value.slug)

    if (modalMode.value === 'edit') {
      const currentProduct = products.value.find(p => p.id === currentProductId.value)
      if (currentProduct && currentProduct.slug === form.value.slug) {
        return false
      }
    }

    return exists
  } catch (err) {
    return false
  }
}

/**
 * Abrir modal para crear producto
 */
const handleCreate = () => {
  if (categories.value.length === 0) {
    notifyError('Debes crear al menos una categoría antes de agregar productos')
    return
  }

  modalMode.value = 'create'
  currentProductId.value = null
  form.value = {
    name: '',
    slug: '',
    price: 0,
    description: '',
    categoryId: categories.value[0]?.id || 0,
    isVisible: true,
    images: [''],
    attributes: ''
  }
  formErrors.value = { name: '', slug: '', price: '', categoryId: '', images: '' }
  showModal.value = true
}

/**
 * Abrir modal para editar producto
 */
const handleEdit = (product: ProductResponse) => {
  modalMode.value = 'edit'
  currentProductId.value = product.id
  form.value = {
    name: product.name,
    slug: product.slug,
    price: product.price,
    description: product.description || '',
    categoryId: product.categoryId,
    isVisible: product.isVisible,
    images: product.images && product.images.length > 0 ? product.images : [''],
    attributes: product.attributes || ''
  }
  formErrors.value = { name: '', slug: '', price: '', categoryId: '', images: '' }
  showModal.value = true
}

/**
 * Guardar producto (crear o actualizar)
 */
const handleSubmit = async () => {
  if (!validateForm()) return
  if (!storeId.value) {
    notifyError('No se pudo obtener la información de la tienda')
    return
  }

  const slugExists = await checkSlugExists()
  if (slugExists) {
    formErrors.value.slug = 'Este slug ya está en uso'
    return
  }

  savingProduct.value = true

  try {
    // Filtrar imágenes vacías
    const validImages = form.value.images.filter(img => img.trim() !== '')

    if (modalMode.value === 'create') {
      const newProduct: CreateProductRequest = {
        name: form.value.name.trim(),
        slug: form.value.slug.trim(),
        price: form.value.price,
        description: form.value.description.trim() || undefined,
        categoryId: form.value.categoryId,
        storeId: storeId.value,
        isVisible: form.value.isVisible,
        images: validImages.length > 0 ? validImages : undefined,
        attributes: form.value.attributes.trim() || undefined
      }
      await productService.create(newProduct)
      success('Producto creado exitosamente')
    } else {
      const updateData: UpdateProductRequest = {
        name: form.value.name.trim(),
        slug: form.value.slug.trim(),
        price: form.value.price,
        description: form.value.description.trim() || undefined,
        categoryId: form.value.categoryId,
        isVisible: form.value.isVisible,
        images: validImages.length > 0 ? validImages : undefined,
        attributes: form.value.attributes.trim() || undefined
      }
      await productService.update(currentProductId.value!, updateData)
      success('Producto actualizado exitosamente')
    }

    showModal.value = false
    await loadProducts()
  } catch (err: any) {
    notifyError(err.response?.data?.message || 'Error al guardar el producto')
  } finally {
    savingProduct.value = false
  }
}

/**
 * Eliminar producto con confirmación
 */
const handleDelete = (product: ProductResponse) => {
  confirm(
    'Eliminar Producto',
    `¿Estás seguro de que deseas eliminar el producto "${product.name}"? Esta acción no se puede deshacer.`,
    async () => {
      try {
        await productService.delete(product.id)
        success('Producto eliminado exitosamente')
        await loadProducts()
      } catch (err: any) {
        notifyError(err.response?.data?.message || 'Error al eliminar el producto')
      }
    },
    {
      type: 'danger',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    }
  )
}

/**
 * Cambiar visibilidad de un producto
 */
const toggleVisibility = async (product: ProductResponse) => {
  try {
    await productService.toggleVisibility(product.id, !product.isVisible)
    success(`Producto ${!product.isVisible ? 'mostrado' : 'ocultado'} exitosamente`)
    await loadProducts()
  } catch (err: any) {
    notifyError('Error al cambiar la visibilidad del producto')
  }
}

/**
 * Añadir campo de imagen
 */
const addImageField = () => {
  form.value.images.push('')
}

/**
 * Remover campo de imagen
 */
const removeImageField = (index: number) => {
  if (form.value.images.length > 1) {
    form.value.images.splice(index, 1)
  }
}

/**
 * Validar si el formulario es válido
 */
const isFormValid = computed(() => {
  return form.value.name.trim().length >= 2 &&
    form.value.slug.trim().length >= 2 &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.value.slug) &&
    form.value.price >= 0 &&
    form.value.categoryId > 0
})

// Watch para generar slug automáticamente
watch(() => form.value.name, () => {
  if (modalMode.value === 'create' || !form.value.slug) {
    generateSlug()
  }
})

// Cargar datos al montar
onMounted(() => {
  loadProducts()
})
</script>

<template>
  <div class="productos-view">
    <!-- Tabla de productos -->
    <DataTable title="Productos" subtitle="Gestiona tu inventario de productos" :columns="columns" :items="products"
      :loading="loading" :empty-icon="Package" empty-message="No hay productos"
      empty-subtext="Comienza agregando tu primer producto a la tienda" create-button-text="Agregar Producto"
      @create="handleCreate" @edit="handleEdit" @delete="handleDelete">
      <!-- Slot personalizado para acciones -->
      <template #actions="{ item }">
        <div class="flex items-center justify-end space-x-2">
          <button @click="toggleVisibility(item)"
            :class="item.isVisible ? 'text-green-600 hover:text-green-900' : 'text-gray-400 hover:text-gray-600'"
            :title="item.isVisible ? 'Ocultar producto' : 'Mostrar producto'" class="transition-colors">
            <Eye v-if="item.isVisible" class="h-5 w-5" />
            <EyeOff v-else class="h-5 w-5" />
          </button>
          <button @click="handleEdit(item)" class="text-blue-600 hover:text-blue-900 transition-colors" title="Editar">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button @click="handleDelete(item)" class="text-red-600 hover:text-red-900 transition-colors"
            title="Eliminar">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </template>
    </DataTable>

    <!-- Modal de crear/editar producto -->
    <FormModal v-model:isOpen="showModal" :title="modalMode === 'create' ? 'Crear Producto' : 'Editar Producto'"
      :icon="PackagePlus" :loading="savingProduct" :is-valid="isFormValid" size="lg" submit-text="Guardar"
      @submit="handleSubmit">
      <div class="space-y-4">
        <!-- Nombre -->
        <FormField label="Nombre del producto" required :error="formErrors.name">
          <BaseInput v-model="form.name" placeholder="Ej: Laptop Gamer, Camisa Polo..." :has-error="!!formErrors.name"
            autocomplete="off" />
        </FormField>

        <!-- Slug -->
        <FormField label="Slug" required :error="formErrors.slug"
          hint="Se genera automáticamente, pero puedes personalizarlo">
          <BaseInput v-model="form.slug" placeholder="ej: laptop-gamer" :has-error="!!formErrors.slug"
            autocomplete="off" />
        </FormField>

        <!-- Precio y Categoría en dos columnas -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Precio -->
          <FormField label="Precio" required :error="formErrors.price">
            <BaseInput v-model.number="form.price" type="number" step="0.01" min="0" placeholder="0.00"
              :has-error="!!formErrors.price" />
          </FormField>

          <!-- Categoría -->
          <FormField label="Categoría" required :error="formErrors.categoryId">
            <select v-model.number="form.categoryId" :class="[
              'w-full px-4 py-2 bg-gray-800 border rounded-md text-gray-100 focus:outline-none focus:ring-2 transition-colors',
              formErrors.categoryId ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-amber-300 focus:border-amber-300'
            ]">
              <option :value="0" disabled>Selecciona una categoría</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </FormField>
        </div>

        <!-- Descripción -->
        <FormField label="Descripción" optional hint="Descripción detallada del producto">
          <textarea v-model="form.description" rows="3" placeholder="Describe tu producto..."
            class="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 transition-colors resize-none"></textarea>
        </FormField>

        <!-- Visibilidad -->
        <div class="flex items-center space-x-3 p-3 bg-gray-800 rounded-md border border-gray-700">
          <input type="checkbox" v-model="form.isVisible" id="isVisible"
            class="w-4 h-4 text-amber-300 bg-gray-700 border-gray-600 rounded focus:ring-amber-300 focus:ring-2" />
          <label for="isVisible" class="text-sm text-gray-300 cursor-pointer">
            Producto visible en el catálogo
          </label>
        </div>

        <!-- Imágenes -->
        <FormField label="Imágenes (URLs)" optional hint="URLs de las imágenes del producto">
          <div v-if="form.images" class="space-y-2">
            <div v-for="(image, index) in form.images" :key="index" class="flex space-x-2">
              <BaseInput v-model="form.images[index]" type="url" placeholder="https://ejemplo.com/imagen.jpg"
                class="flex-1" />
              <button v-if="form.images.length > 1" type="button" @click="removeImageField(index)"
                class="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                ✕
              </button>
            </div>
            <button type="button" @click="addImageField"
              class="text-sm text-amber-200 hover:text-amber-300 transition-colors">
              + Añadir otra imagen
            </button>
          </div>
        </FormField>

        <!-- Atributos (JSON) -->
        <FormField label="Atributos (JSON)" optional
          hint='Atributos adicionales en formato JSON: {"color": "rojo", "talla": "M"}'>
          <textarea v-model="form.attributes" rows="3" placeholder='{"color": "rojo", "talla": "M"}'
            class="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 transition-colors resize-none font-mono text-sm"></textarea>
        </FormField>
      </div>
    </FormModal>
  </div>
</template>

<style scoped>
.productos-view {
  max-width: 100%;
}
</style>
