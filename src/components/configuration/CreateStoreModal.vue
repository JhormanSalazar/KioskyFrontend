<script setup lang="ts">
import type { RegisterStoreRequest } from '@/types/api.types';
import { ref } from 'vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';

// Props recibidos por el componente
const props = defineProps<{
  isOpen: boolean;
  loading: boolean;
}>();

// Events emitidos por el componente
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'saveStoreInfo', storeData: RegisterStoreRequest): void;
}>();

// Datos del formlulario para crear tienda
const storeFormData = ref<RegisterStoreRequest>({
  name: '',
  domain: '',
});

// Funcion para manejar el envío del formulario
const handleSubmit = () => {
  emit('saveStoreInfo', { ...storeFormData.value });
};

const closeModal = () => {
  emit('close');
};
</script>

<template>
  <div v-if="props.isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div class="bg-white rounded-xl shadow-2xl w-full max-auto max-w-lg overflow-hidden border border-gray-100">

      <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h3 class="text-xl font-semibold text-gray-800">Crear Nueva Tienda</h3>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
          <span class="text-2xl">&times;</span>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6">
        <div class="form-field">
          <label class="block text-sm font-medium text-gray-700 mb-1">Nombre de la Tienda</label>
          <input v-model="storeFormData.name" type="text" placeholder="Mi Tienda Online"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
        </div>

        <div class="form-field">
          <label class="block text-sm font-medium text-gray-700 mb-1">Dominio</label>
          <div class="flex">
            <input v-model="storeFormData.domain" type="text" placeholder="mi-tienda"
              class="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            <span
              class="inline-flex items-center px-3 bg-gray-50 border border-l-0 border-gray-300 rounded-r-lg text-gray-500 text-sm">
              .com
            </span>
          </div>
        </div>

        <div class="flex justify-end gap-2">
          <button type="button" @click="closeModal"
            class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors">
            Cancelar
          </button>
          <button type="submit" @click="handleSubmit" :disabled="props.loading"
            class="px-4 py-2 bg-amber-200 hover:bg-amber-100 text-black rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50">
            <LoadingSpinner v-if="props.loading" :size="16" color="#000" />
            {{ props.loading ? 'Guardando...' : 'Guardar Tienda' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.form-field {
  margin-bottom: 0.6rem;
}
</style>
