<template>
  <div class="form-field mb-4">
    <!-- Label -->
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium text-gray-300 mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-red-400 ml-1">*</span>
      <span v-if="optional" class="text-gray-500 text-xs ml-1">(opcional)</span>
    </label>

    <!-- Descripción/ayuda -->
    <p v-if="description" class="text-xs text-gray-400 mb-2">
      {{ description }}
    </p>

    <!-- Contenedor del input/slot -->
    <div class="relative">
      <slot :id="id" :hasError="!!error"></slot>
    </div>

    <!-- Mensaje de error -->
    <Transition name="error">
      <p v-if="error" class="mt-2 text-sm text-red-400 flex items-center space-x-1">
        <AlertCircle class="h-4 w-4" />
        <span>{{ error }}</span>
      </p>
    </Transition>

    <!-- Mensaje de ayuda/hint -->
    <p v-if="hint && !error" class="mt-2 text-xs text-gray-400">
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { AlertCircle } from 'lucide-vue-next'

/**
 * FormField - Componente para campos de formulario consistentes
 *
 * Proporciona un envoltorio estandarizado para inputs con:
 * - Label con indicador de requerido/opcional
 * - Descripción/ayuda
 * - Mensajes de error
 * - Hints informativos
 *
 * @ejemplo de uso:
 * <FormField
 *   label="Nombre de la categoría"
 *   required
 *   :error="errors.name"
 *   hint="Use un nombre descriptivo y corto"
 * >
 *   <input
 *     v-model="form.name"
 *     type="text"
 *     class="form-input"
 *   />
 * </FormField>
 */

const props = withDefaults(defineProps<{
  label?: string           // Etiqueta del campo
  id?: string              // ID para el input (se genera automáticamente si no se provee)
  required?: boolean       // Indica si el campo es obligatorio
  optional?: boolean       // Muestra etiqueta "(opcional)"
  description?: string     // Descripción/contexto del campo
  error?: string           // Mensaje de error
  hint?: string            // Texto de ayuda debajo del input
}>(), {
  required: false,
  optional: false
})

// Genera un ID único si no se proporciona
const id = computed(() => {
  return props.id || `field-${Math.random().toString(36).substr(2, 9)}`
})
</script>

<style scoped>
/* Transición para el mensaje de error */
.error-enter-active,
.error-leave-active {
  transition: all 0.2s ease;
}

.error-enter-from,
.error-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
