<template>
  <div class="data-table">
    <!-- Header con título y botón de acción -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">{{ title }}</h2>
        <p v-if="subtitle" class="text-sm text-gray-600 mt-1">{{ subtitle }}</p>
      </div>

      <button
        v-if="showCreateButton"
        @click="$emit('create')"
        class="flex items-center space-x-2 px-4 py-2 bg-amber-200 text-gray-900 text-sm rounded-md hover:bg-amber-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2"
      >
        <Plus class="h-5 w-5" />
        <span>{{ createButtonText }}</span>
      </button>
    </div>

    <!-- Barra de búsqueda (opcional) -->
    <div v-if="searchable" class="mb-4">
      <div class="relative">
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          :value="searchQuery"
          @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
          :placeholder="searchPlaceholder"
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
        />
      </div>
    </div>

    <!-- Estado de carga -->
    <div v-if="loading" class="bg-white rounded-lg shadow p-8 text-center">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-200 border-t-transparent"></div>
      <p class="mt-4 text-gray-600">Cargando datos...</p>
    </div>

    <!-- Estado sin datos -->
    <div v-else-if="!items || items.length === 0" class="bg-white rounded-lg shadow p-8 text-center">
      <component
        :is="emptyIcon"
        class="h-12 w-12 text-gray-400 mx-auto mb-4"
      />
      <p class="text-gray-600 font-medium">{{ emptyMessage }}</p>
      <p class="text-sm text-gray-500 mt-2">{{ emptySubtext }}</p>
      <button
        v-if="showCreateButton"
        @click="$emit('create')"
        class="mt-4 px-4 py-2 bg-amber-200 text-gray-900 font-medium rounded-md hover:bg-amber-300 transition-colors"
      >
        {{ createButtonText }}
      </button>
    </div>

    <!-- Tabla de datos -->
    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                v-for="column in columns"
                :key="column.key"
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                :class="column.headerClass"
              >
                {{ column.label }}
              </th>
              <th
                v-if="hasActions"
                scope="col"
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="(item, index) in items"
              :key="getItemKey(item, index)"
              class="hover:bg-gray-50 transition-colors duration-150"
            >
              <!-- Renderizado de columnas -->
              <td
                v-for="column in columns"
                :key="column.key"
                class="px-6 py-4 whitespace-nowrap"
                :class="column.cellClass"
              >
                <!-- Slot personalizado para la columna si existe -->
                <slot
                  :name="`cell-${column.key}`"
                  :item="item"
                  :value="getNestedValue(item, column.key)"
                >
                  <!-- Renderizado por defecto -->
                  <span
                    v-if="column.format"
                    v-html="column.format(getNestedValue(item, column.key), item)"
                  ></span>
                  <span v-else>{{ getNestedValue(item, column.key) }}</span>
                </slot>
              </td>

              <!-- Columna de acciones -->
              <td
                v-if="hasActions"
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
              >
                <slot name="actions" :item="item">
                  <div class="flex items-center justify-end space-x-2">
                    <button
                      @click="$emit('edit', item)"
                      class="text-blue-600 hover:text-blue-900 transition-colors"
                      title="Editar"
                    >
                      <Pencil class="h-5 w-5" />
                    </button>
                    <button
                      @click="$emit('delete', item)"
                      class="text-red-600 hover:text-red-900 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 class="h-5 w-5" />
                    </button>
                  </div>
                </slot>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer con información de paginación (opcional) -->
      <div
        v-if="showFooter"
        class="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between"
      >
        <div class="text-sm text-gray-600">
          Mostrando <span class="font-medium">{{ items.length }}</span>
          {{ items.length === 1 ? 'registro' : 'registros' }}
        </div>
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Plus, Search, Pencil, Trash2, Package } from 'lucide-vue-next'

/**
 * DataTable - Componente reutilizable para mostrar tablas de datos
 *
 * Este componente proporciona una tabla completa con:
 * - Columnas configurables
 * - Estados de loading y empty
 * - Búsqueda integrada (opcional)
 * - Acciones personalizables por item
 * - Slots para personalización avanzada
 *
 * @ejemplo de uso:
 * <DataTable
 *   title="Categorías"
 *   :columns="[
 *     { key: 'name', label: 'Nombre' },
 *     { key: 'productCount', label: 'Productos' }
 *   ]"
 *   :items="categories"
 *   :loading="loading"
 *   @create="handleCreate"
 *   @edit="handleEdit"
 *   @delete="handleDelete"
 * />
 */

// Definición de tipos
export interface TableColumn {
  key: string                                    // Clave del campo en el objeto (soporta notación punto: 'store.name')
  label: string                                  // Etiqueta a mostrar en el header
  format?: (value: any, item: any) => string    // Función de formateo opcional
  headerClass?: string                           // Clases CSS para el header
  cellClass?: string                             // Clases CSS para la celda
}

// Props
const props = withDefaults(defineProps<{
  title: string                        // Título de la tabla
  subtitle?: string                    // Subtítulo opcional
  columns: TableColumn[]               // Definición de columnas
  items: any[]                         // Array de datos a mostrar
  loading?: boolean                    // Estado de carga
  itemKey?: string                     // Campo a usar como key (default: 'id')

  // Botón de crear
  showCreateButton?: boolean           // Mostrar botón de crear
  createButtonText?: string            // Texto del botón crear

  // Búsqueda
  searchable?: boolean                 // Habilitar búsqueda
  searchQuery?: string                 // Query de búsqueda
  searchPlaceholder?: string           // Placeholder del input de búsqueda

  // Acciones
  hasActions?: boolean                 // Mostrar columna de acciones

  // Estado vacío
  emptyMessage?: string                // Mensaje cuando no hay datos
  emptySubtext?: string                // Subtexto del estado vacío
  emptyIcon?: any                      // Icono del estado vacío

  // Footer
  showFooter?: boolean                 // Mostrar footer
}>(), {
  loading: false,
  itemKey: 'id',
  showCreateButton: true,
  createButtonText: 'Crear Nuevo',
  searchable: false,
  searchQuery: '',
  searchPlaceholder: 'Buscar...',
  hasActions: true,
  emptyMessage: 'No hay datos para mostrar',
  emptySubtext: 'Comienza creando un nuevo registro',
  emptyIcon: Package,
  showFooter: false
})

// Events
defineEmits<{
  create: []
  edit: [item: any]
  delete: [item: any]
  'update:searchQuery': [query: string]
}>()

// Métodos auxiliares
const getItemKey = (item: any, index: number): string | number => {
  return item[props.itemKey] || index
}

/**
 * Obtiene un valor anidado de un objeto usando notación punto
 * Ejemplo: getNestedValue({ store: { name: 'Mi Tienda' } }, 'store.name') => 'Mi Tienda'
 */
const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}
</script>

<style scoped>
/* Animación para el estado de carga */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
