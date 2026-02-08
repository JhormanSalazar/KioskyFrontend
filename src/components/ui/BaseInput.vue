<template>
  <input
    :type="type"
    :value="modelValue"
    @input="handleInput"
    @blur="$emit('blur', $event)"
    @focus="$emit('focus', $event)"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    :required="required"
    :autocomplete="autocomplete"
    :class="inputClasses"
    class="base-input"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

/**
 * BaseInput - Componente base para inputs de texto
 *
 * Proporciona estilos consistentes y manejo de eventos para inputs.
 * Compatible con v-model.
 *
 * @ejemplo de uso:
 * <BaseInput
 *   v-model="form.name"
 *   type="text"
 *   placeholder="Ingrese el nombre"
 *   :hasError="!!errors.name"
 * />
 */

const props = withDefaults(defineProps<{
  modelValue: string | number
  type?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  autocomplete?: string
  hasError?: boolean
  size?: 'sm' | 'md' | 'lg'
}>(), {
  type: 'text',
  placeholder: '',
  disabled: false,
  readonly: false,
  required: false,
  hasError: false,
  size: 'md'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

// Clases dinámicas basadas en el estado
const inputClasses = computed(() => {
  const classes = [
    'w-full',
    'rounded-md',
    'transition-colors',
    'duration-200',
    'focus:outline-none',
    'focus:ring-2'
  ]

  // Tamaño
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg'
  }
  classes.push(sizeClasses[props.size])

  // Estados
  if (props.hasError) {
    classes.push(
      'bg-gray-800',
      'border-2',
      'border-red-500',
      'text-gray-100',
      'placeholder-gray-500',
      'focus:ring-red-500',
      'focus:border-red-500'
    )
  } else if (props.disabled) {
    classes.push(
      'bg-gray-800',
      'border',
      'border-gray-700',
      'text-gray-500',
      'cursor-not-allowed',
      'opacity-60'
    )
  } else {
    classes.push(
      'bg-gray-800',
      'border',
      'border-gray-600',
      'text-gray-100',
      'placeholder-gray-500',
      'hover:border-gray-500',
      'focus:ring-amber-300',
      'focus:border-amber-300'
    )
  }

  return classes.join(' ')
})
</script>

<style scoped>
.base-input {
  /* Prevenir comportamientos no deseados del navegador */
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

/* Estilos para autofill del navegador */
.base-input:-webkit-autofill,
.base-input:-webkit-autofill:hover,
.base-input:-webkit-autofill:focus {
  -webkit-text-fill-color: #f3f4f6;
  -webkit-box-shadow: 0 0 0 1000px #1f2937 inset;
  transition: background-color 5000s ease-in-out 0s;
}
</style>
