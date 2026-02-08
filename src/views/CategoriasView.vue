<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { FolderPlus, FolderOpen } from 'lucide-vue-next'
import DataTable from '@/components/ui/DataTable.vue'
import FormModal from '@/components/ui/FormModal.vue'
import FormField from '@/components/ui/FormField.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import { categoryService } from '@/api/services'
import { useUserStore } from '@/stores/user'
import { useNotifications } from '@/composables/useNotifications'
import type { CategoryResponse, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/api.types'
import type { TableColumn } from '@/components/ui/DataTable.vue'

/**
 * Vista de gestión de Categorías
 *
 * Permite al usuario propietario de una tienda:
 * - Ver todas sus categorías
 * - Crear nuevas categorías
 * - Editar categorías existentes
 * - Eliminar categorías (con confirmación)
 * - Validar slugs únicos
 */

// Stores y composables
const userStore = useUserStore()
const { success, error: notifyError, confirm } = useNotifications()

// Estado de datos
const categories = ref<CategoryResponse[]>([])
const loading = ref(false)
const loadError = ref<string | null>(null)

// Estado del modal
const showModal = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const savingCategory = ref(false)
const currentCategoryId = ref<number | null>(null)

// Formulario
const form = ref({
  name: '',
  slug: ''
})

// Errores de validación
const formErrors = ref({
  name: '',
  slug: ''
})

// Obtener storeId del usuario actual
const storeId = computed(() => userStore.currentUser?.storeId)

/**
 * Definición de columnas para la tabla
 */
const columns: TableColumn[] = [
  {
    key: 'name',
    label: 'Nombre',
    cellClass: 'text-sm font-medium text-gray-900'
  },
  {
    key: 'slug',
    label: 'Slug',
    cellClass: 'text-sm text-gray-600 font-mono'
  },
  {
    key: 'productCount',
    label: 'Productos',
    cellClass: 'text-sm text-gray-600',
    format: (value: number) => {
      return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        value > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
      }">${value} ${value === 1 ? 'producto' : 'productos'}</span>`
    }
  }
]

/**
 * Cargar categorías desde la API
 */
const loadCategories = async () => {
  if (!storeId.value) {
    notifyError('No se pudo obtener la información de la tienda')
    return
  }

  loading.value = true
  loadError.value = null

  try {
    categories.value = await categoryService.getByStoreId(storeId.value)
  } catch (err: any) {
    loadError.value = err.message || 'Error al cargar las categorías'
    notifyError(loadError.value)
    categories.value = []
  } finally {
    loading.value = false
  }
}

/**
 * Validar el formulario
 */
const validateForm = (): boolean => {
  let isValid = true
  formErrors.value = { name: '', slug: '' }

  // Validar nombre
  if (!form.value.name.trim()) {
    formErrors.value.name = 'El nombre es obligatorio'
    isValid = false
  } else if (form.value.name.trim().length < 2) {
    formErrors.value.name = 'El nombre debe tener al menos 2 caracteres'
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
      .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
      .replace(/[^a-z0-9\s-]/g, '')     // Eliminar caracteres especiales
      .replace(/\s+/g, '-')              // Espacios a guiones
      .replace(/-+/g, '-')               // Múltiples guiones a uno
      .replace(/^-|-$/g, '')             // Eliminar guiones al inicio/fin
  }
}

/**
 * Verificar si un slug ya existe
 */
const checkSlugExists = async (): Promise<boolean> => {
  if (!storeId.value || !form.value.slug.trim()) return false

  try {
    const exists = await categoryService.slugExists(storeId.value, form.value.slug)

    // Si estamos editando, permitir el mismo slug
    if (modalMode.value === 'edit') {
      const currentCategory = categories.value.find(c => c.id === currentCategoryId.value)
      if (currentCategory && currentCategory.slug === form.value.slug) {
        return false
      }
    }

    return exists
  } catch (err) {
    return false
  }
}

/**
 * Abrir modal para crear categoría
 */
const handleCreate = () => {
  modalMode.value = 'create'
  currentCategoryId.value = null
  form.value = { name: '', slug: '' }
  formErrors.value = { name: '', slug: '' }
  showModal.value = true
}

/**
 * Abrir modal para editar categoría
 */
const handleEdit = (category: CategoryResponse) => {
  modalMode.value = 'edit'
  currentCategoryId.value = category.id
  form.value = {
    name: category.name,
    slug: category.slug
  }
  formErrors.value = { name: '', slug: '' }
  showModal.value = true
}

/**
 * Guardar categoría (crear o actualizar)
 */
const handleSubmit = async () => {
  if (!validateForm()) return
  if (!storeId.value) {
    notifyError('No se pudo obtener la información de la tienda')
    return
  }

  // Verificar si el slug ya existe
  const slugExists = await checkSlugExists()
  if (slugExists) {
    formErrors.value.slug = 'Este slug ya está en uso'
    return
  }

  savingCategory.value = true

  try {
    if (modalMode.value === 'create') {
      const newCategory: CreateCategoryRequest = {
        name: form.value.name.trim(),
        slug: form.value.slug.trim(),
        storeId: storeId.value
      }
      await categoryService.create(newCategory)
      success('Categoría creada exitosamente')
    } else {
      const updateData: UpdateCategoryRequest = {
        name: form.value.name.trim(),
        slug: form.value.slug.trim()
      }
      await categoryService.update(currentCategoryId.value!, updateData)
      success('Categoría actualizada exitosamente')
    }

    showModal.value = false
    await loadCategories()
  } catch (err: any) {
    notifyError(err.response?.data?.message || 'Error al guardar la categoría')
  } finally {
    savingCategory.value = false
  }
}

/**
 * Eliminar categoría con confirmación
 */
const handleDelete = (category: CategoryResponse) => {
  const warningMessage = category.productCount > 0
    ? `\n\nEsta categoría tiene ${category.productCount} ${category.productCount === 1 ? 'producto' : 'productos'} asociado(s).`
    : ''

  confirm(
    'Eliminar Categoría',
    `¿Estás seguro de que deseas eliminar la categoría "${category.name}"?${warningMessage}`,
    async () => {
      try {
        await categoryService.delete(category.id)
        success('Categoría eliminada exitosamente')
        await loadCategories()
      } catch (err: any) {
        notifyError(err.response?.data?.message || 'Error al eliminar la categoría')
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
 * Validar si el formulario es válido para habilitar el botón de guardar
 */
const isFormValid = computed(() => {
  return form.value.name.trim().length >= 2 &&
         form.value.slug.trim().length >= 2 &&
         /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.value.slug)
})

// Watch para generar slug automáticamente cuando se escribe el nombre
watch(() => form.value.name, (newName, oldName) => {
  // Solo generar slug automáticamente al crear (no al editar)
  if (modalMode.value === 'create' || !form.value.slug) {
    generateSlug()
  }
})

// Cargar categorías al montar el componente
onMounted(() => {
  loadCategories()
})
</script>

<template>
  <div class="categorias-view">
    <!-- Tabla de categorías -->
    <DataTable
      title="Categorías"
      subtitle="Organiza tus productos en categorías"
      :columns="columns"
      :items="categories"
      :loading="loading"
      :empty-icon="FolderOpen"
      empty-message="No hay categorías"
      empty-subtext="Crea tu primera categoría para organizar tus productos"
      create-button-text="Agregar Categoría"
      @create="handleCreate"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <!-- Modal de crear/editar categoría -->
    <FormModal
      v-model:isOpen="showModal"
      :title="modalMode === 'create' ? 'Crear Categoría' : 'Editar Categoría'"
      :icon="FolderPlus"
      :loading="savingCategory"
      :is-valid="isFormValid"
      submit-text="Guardar"
      @submit="handleSubmit"
    >
      <!-- Nombre de la categoría -->
      <FormField
        label="Nombre de la categoría"
        required
        :error="formErrors.name"
        description="Nombre descriptivo para tu categoría de productos"
      >
        <BaseInput
          v-model="form.name"
          type="text"
          placeholder="Ej: Electrónica, Ropa, Alimentos..."
          :has-error="!!formErrors.name"
          autocomplete="off"
        />
      </FormField>

      <!-- Slug -->
      <FormField
        label="Slug"
        required
        :error="formErrors.slug"
        description="URL amigable (solo letras minúsculas, números y guiones)"
        hint="Se genera automáticamente desde el nombre, pero puedes personalizarlo"
      >
        <BaseInput
          v-model="form.slug"
          type="text"
          placeholder="ej: electronica"
          :has-error="!!formErrors.slug"
          autocomplete="off"
        />
      </FormField>

      <!-- Preview del slug -->
      <div v-if="form.slug" class="mt-2 p-3 bg-gray-800 rounded-md border border-gray-700">
        <p class="text-xs text-gray-400 mb-1">Vista previa de la URL:</p>
        <p class="text-sm text-amber-200 font-mono break-all">
          /categoria/{{ form.slug }}
        </p>
      </div>
    </FormModal>
  </div>
</template>

<style scoped>
.categorias-view {
  max-width: 100%;
}
</style>
