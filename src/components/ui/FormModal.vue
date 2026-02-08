<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center"
        @click.self="handleCancel"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 backdrop-blur-sm"
          @click="handleCancel"
        />

        <!-- Modal -->
        <div
          class="relative bg-gray-900 rounded-lg shadow-xl border border-gray-700 w-full mx-4 transform transition-all"
          :class="sizeClasses"
        >
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-700">
            <div class="flex items-center space-x-3">
              <component
                v-if="icon"
                :is="icon"
                class="h-6 w-6 text-amber-200"
              />
              <h3 class="text-lg font-semibold text-amber-200">
                {{ title }}
              </h3>
            </div>

            <button
              @click="handleCancel"
              class="text-gray-400 hover:text-gray-200 transition-colors duration-200"
              :disabled="loading"
            >
              <X class="h-5 w-5" />
            </button>
          </div>

          <!-- Body con formulario -->
          <form @submit.prevent="handleSubmit">
            <div class="p-6 max-h-[60vh] overflow-y-auto">
              <!-- Slot para el contenido del formulario -->
              <slot :loading="loading"></slot>
            </div>

            <!-- Footer con botones de acción -->
            <div class="flex justify-end space-x-3 p-6 border-t border-gray-700">
              <button
                type="button"
                @click="handleCancel"
                :disabled="loading"
                class="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ cancelText }}
              </button>

              <button
                type="submit"
                :disabled="loading || !isValid"
                class="px-4 py-2 text-sm font-medium bg-amber-200 text-gray-900 rounded-md hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <span v-if="loading" class="inline-block animate-spin rounded-full h-4 w-4 border-2 border-gray-900 border-t-transparent"></span>
                <span>{{ loading ? loadingText : submitText }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'

/**
 * FormModal - Componente reutilizable para modales de formularios
 *
 * Este componente proporciona un modal consistente para crear/editar entidades.
 * El contenido del formulario se define mediante slots, lo que permite
 * total flexibilidad en los campos y su disposición.
 *
 * @ejemplo de uso - Formulario de categoría:
 * <FormModal
 *   v-model:isOpen="showModal"
 *   title="Crear Categoría"
 *   :icon="FolderPlus"
 *   :loading="loading"
 *   @submit="handleSubmit"
 * >
 *   <FormField label="Nombre" required>
 *     <input v-model="form.name" type="text" />
 *   </FormField>
 * </FormModal>
 */

type ModalSize = 'sm' | 'md' | 'lg' | 'xl'

// Props
const props = withDefaults(defineProps<{
  isOpen: boolean                    // Controla si el modal está abierto
  title: string                      // Título del modal
  icon?: any                         // Icono opcional para el header
  size?: ModalSize                   // Tamaño del modal
  loading?: boolean                  // Estado de carga durante submit
  isValid?: boolean                  // Si el formulario es válido (para habilitar/deshabilitar submit)
  submitText?: string                // Texto del botón submit
  cancelText?: string                // Texto del botón cancelar
  loadingText?: string               // Texto mostrado durante loading
  closeOnOverlayClick?: boolean      // Cerrar al hacer click fuera del modal
}>(), {
  size: 'md',
  loading: false,
  isValid: true,
  submitText: 'Guardar',
  cancelText: 'Cancelar',
  loadingText: 'Guardando...',
  closeOnOverlayClick: true
})

// Events
const emit = defineEmits<{
  'update:isOpen': [value: boolean]
  submit: []
  cancel: []
}>()

// Clases de tamaño del modal
const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl'
}[props.size]

// Handlers
const handleSubmit = () => {
  if (!props.loading && props.isValid) {
    emit('submit')
  }
}

const handleCancel = () => {
  if (!props.loading && props.closeOnOverlayClick) {
    emit('cancel')
    emit('update:isOpen', false)
  }
}
</script>

<style scoped>
/* Transiciones del modal */
.modal-enter-active {
  transition: all 0.3s ease-out;
}

.modal-leave-active {
  transition: all 0.3s ease-in;
}

.modal-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Animación de loading */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Estilos para el scroll del body */
:deep(.p-6.max-h-\[60vh\]) {
  scrollbar-width: thin;
  scrollbar-color: #4b5563 #1f2937;
}

:deep(.p-6.max-h-\[60vh\])::-webkit-scrollbar {
  width: 8px;
}

:deep(.p-6.max-h-\[60vh\])::-webkit-scrollbar-track {
  background: #1f2937;
  border-radius: 4px;
}

:deep(.p-6.max-h-\[60vh\])::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 4px;
}

:deep(.p-6.max-h-\[60vh\])::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>
