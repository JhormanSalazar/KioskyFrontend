<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useApi } from '@/composables/useApi';
import { useUserStore } from '@/stores/user';
import { storeService } from '@/api/services/store.service';
import type { AppUserResponse, SimpleStoreResponse, UpdateAppUserRequest } from '@/types/api.types';
import { useNotifications } from '@/composables/useNotifications';

// ref para los datos de configuración
const userStore = useUserStore();
const { execute: loadStoreInfo } = useApi(storeService.getSimpleStoreById);
const { error } = useNotifications();

// Estado para la información de la tienda
const storeInfo = ref<SimpleStoreResponse | null>(null);

// Estado para la info del usuario.
const userInfo = ref<AppUserResponse | null>(null);

// Estado para la nueva contraseña (opcional)
const newPassword = ref('');

// Computed para validar el formulario de usuario
const isUserFormValid = computed(() => {
  if (!userInfo.value) return false;
  return userInfo.value.fullName.trim().length > 0;
});

// Computed para validar el formulario de tienda
const isStoreFormValid = computed(() => {
  if (!storeInfo.value) return false;
  return storeInfo.value.name.trim().length > 0 &&
    storeInfo.value.domain.trim().length > 0;
});

// Funcion para manejar el envío del formulario de configuración de usuario
const handleUserSubmit = async () => {
  // Validar que userInfo no sea nulo
  if (!userInfo.value) {
    error('No hay información de usuario para actualizar');
    return;
  }

  if (!isUserFormValid.value) {
    error('Por favor, completa todos los campos correctamente');
    return;
  }

  // Crear el objeto de actualización con solo los campos necesarios
  const updateData: UpdateAppUserRequest = {
    fullName: userInfo.value.fullName,
  };

  // Solo incluir la contraseña si se proporcionó
  if (newPassword.value.trim().length > 0) {
    updateData.password = newPassword.value;
  }

  // Guardar cambios de usuario - useApiMutation ya maneja loading y error
  const result = await userStore.updateUserInfo(userInfo.value.id, updateData);

  if (result) {
    // Actualizar la referencia local con los datos actualizados
    userInfo.value = { ...result };
    // Limpiar el campo de contraseña después de actualizar
    newPassword.value = '';
  } else if (userStore.userError) {
    // Mostrar error si la mutación falló con el mensaje específico del backend
    error(
      'Error al actualizar la información',
      userStore.userError.message || 'Por favor verifica los datos ingresados'
    );
  }
};

// Función para manejar la actualización de la tienda
const handleStoreSubmit = async () => {
  if (!storeInfo.value) {
    error('No hay información de tienda para actualizar');
    return;
  }

  if (!isStoreFormValid.value) {
    error('Por favor, completa todos los campos de la tienda');
    return;
  }

  // TODO: Implementar el servicio de actualización de tienda
  // const result = await storeService.updateStore(storeInfo.value.id, storeInfo.value);
  error('Funcionalidad de actualización de tienda aún no implementada');
};

// Función para cargar la configuración de la tienda
const loadStoreConfig = async () => {
  if (storeInfo.value !== null) return;

  if (!userStore.currentUser?.storeId) return;

  storeInfo.value = await loadStoreInfo(userStore.currentUser.storeId);
};

// LifeCycle hook para cargar la configuración al montar el componente
onMounted(async () => {
  await loadStoreConfig();

  // Inicializar userInfo con los datos actuales del usuario
  if (userStore.currentUser) {
    userInfo.value = { ...userStore.currentUser };
  }
});
</script>

<template>
  <div class="configuracion-view">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Configuración</h1>
      <p class="text-gray-600">Ajusta la configuración de tu tienda y cuenta.</p>
    </div>

    <div class="flex flex-col gap-8">
      <!-- Perfil -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Perfil</h2>
        <div v-if="userInfo">
          <div class="form-field">
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
            <input v-model="userInfo.fullName" type="text"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-200 focus:border-transparent"
              placeholder="Tu nombre" :disabled="userStore.userLoading">
          </div>
          <div class="form-field">
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input v-model="userInfo.email" type="email"
              class="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
              placeholder="tu@email.com" disabled>
            <p class="mt-1 text-xs text-gray-500">El email no se puede modificar</p>
          </div>
          <div class="form-field">
            <label class="block text-sm font-medium text-gray-700 mb-1">Rol</label>
            <input :value="userInfo.role" type="text" class="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
              disabled>
          </div>
          <div class="form-field">
            <label class="block text-sm font-medium text-gray-700 mb-1">Nueva Contraseña</label>
            <input v-model="newPassword" type="password"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-200 focus:border-transparent"
              placeholder="Dejar en blanco para no cambiar" :disabled="userStore.userLoading">
            <p class="mt-1 text-xs text-gray-500">Deja este campo vacío si no deseas cambiar tu contraseña</p>
          </div>
          <button @click="handleUserSubmit" :disabled="!isUserFormValid || userStore.userLoading"
            class="bg-amber-200 text-black px-4 py-2 rounded-lg hover:bg-amber-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            {{ userStore.userLoading ? 'Guardando...' : 'Guardar Cambios' }}
          </button>
        </div>
        <div v-else class="py-4 text-gray-500">
          Cargando información del usuario...
        </div>
      </div>

      <!-- Tienda -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Configuración de Tienda</h2>
        <div v-if="storeInfo">
          <div class="form-field">
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre de la tienda</label>
            <input v-model="storeInfo.name" type="text"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-200 focus:border-transparent"
              placeholder="Mi Tienda">
          </div>
          <div class="form-field">
            <label class="block text-sm font-medium text-gray-700 mb-1">Dominio</label>
            <input v-model="storeInfo.domain" type="text"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-200 focus:border-transparent"
              placeholder="mitienda.kiosky.com">
          </div>
          <button @click="handleStoreSubmit" :disabled="!isStoreFormValid"
            class="bg-amber-200 text-black px-4 py-2 rounded-lg hover:bg-amber-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            Actualizar Tienda
          </button>
        </div>
        <div v-else-if="!userStore.currentUser?.storeId" class="py-4 text-gray-500">
          No tienes una tienda asociada
        </div>
        <div v-else class="py-4 text-gray-500">
          Cargando información de la tienda...
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Espaciado entre campos del formulario */
.configuracion-view input,
.configuracion-view button[type="submit"],
.configuracion-view button[class*="bg-amber"] {
  margin-top: 0.5rem;
}

.configuracion-view .form-field {
  margin-bottom: 0.5rem;
}
</style>
