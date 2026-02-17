<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useApi, useApiMutation } from '@/composables/useApi';
import { useUserStore } from '@/stores/user';
import { storeService } from '@/api/services/store.service';
import type { AppUserResponse, SimpleStoreResponse, UpdateAppUserRequest, RegisterStoreRequest } from '@/types/api.types';
import { useNotifications } from '@/composables/useNotifications';
import CreateStoreModal from '@/components/configuration/CreateStoreModal.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import FormField from '@/components/ui/FormField.vue';
import BaseInput from '@/components/ui/BaseInput.vue';

// ref para los datos de configuración
const userStore = useUserStore();
const { execute: loadStoreInfo } = useApi(storeService.getSimpleStoreById);
const { mutate: createStore, error: createStoreError, loading: createStoreLoading } = useApiMutation(storeService.createStoreForUser);
const { success, error } = useNotifications();

// Variable reactiva para mostrar modal
const isCreateStoreModalOpen = ref(false);

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
const loadStoreConfig = async (force = false) => {
  if (!force && storeInfo.value !== null) return;

  if (!userStore.currentUser?.storeId) return;

  storeInfo.value = await loadStoreInfo(userStore.currentUser.storeId);
};

// Funcion que abre el modal de crear tienda
const handleCreateStore = async (storeData: RegisterStoreRequest) => {
  if (userInfo.value !== null && userInfo.value.storeId === null) {
    const result = await createStore(userInfo.value.id, storeData);
    if (result) {
      // Actualizar userInfo con el nuevo storeId
      userInfo.value.storeId = result.id;

      // Actualizar el currentUser en el store con el nuevo storeId
      if (userStore.currentUser) {
        userStore.currentUser.storeId = result.id;
        // Actualizar también en localStorage para persistencia
        localStorage.setItem('currentUserInfo', JSON.stringify(userStore.currentUser));
      }

      isCreateStoreModalOpen.value = false;
      success('Tienda creada exitosamente');

      // Forzar la carga de la configuración de la tienda recién creada
      await loadStoreConfig(true);
    } else if (createStoreError.value) {
      error(
        'Error al crear la tienda',
        createStoreError.value?.message || 'Por favor verifica los datos ingresados'
      );
    }
    return;
  }
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
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-100 mb-2">Configuración</h2>
      <p class="text-gray-400">Ajusta la configuración de tu tienda y cuenta.</p>
    </div>

    <div class="flex flex-col gap-8">
      <!-- Perfil -->
      <div class="bg-gray-900 rounded-lg shadow p-6 border border-gray-700">
        <h2 class="text-xl font-semibold text-amber-200 mb-2">Perfil</h2>
        <div v-if="userInfo">
          <FormField label="Nombre completo" required>
            <BaseInput v-model="userInfo.fullName" type="text" placeholder="Tu nombre"
              :disabled="userStore.userLoading" />
          </FormField>

          <FormField label="Email" hint="El email no se puede modificar">
            <BaseInput v-model="userInfo.email" type="email" placeholder="tu@email.com" disabled />
          </FormField>

          <FormField label="Rol">
            <BaseInput :model-value="userInfo.role" type="text" disabled />
          </FormField>

          <FormField label="Nueva Contraseña" optional hint="Deja este campo vacío si no deseas cambiar tu contraseña">
            <BaseInput v-model="newPassword" type="password" placeholder="Dejar en blanco para no cambiar"
              :disabled="userStore.userLoading" />
          </FormField>

          <button @click="handleUserSubmit" :disabled="!isUserFormValid || userStore.userLoading"
            class="bg-amber-200 text-black text-sm px-4 py-2 rounded-lg hover:bg-amber-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            <LoadingSpinner v-if="userStore.userLoading" :size="16" color="#000" />
            {{ userStore.userLoading ? 'Guardando...' : 'Guardar Cambios' }}
          </button>
        </div>
        <div v-else class="py-4 text-gray-400 flex items-center gap-3">
          <LoadingSpinner :size="30" />
          <span>Cargando información del usuario...</span>
        </div>
      </div>

      <!-- Tienda -->
      <div class="bg-gray-900 rounded-lg shadow p-6 border border-gray-700">
        <h2 class="text-xl font-semibold text-amber-200 mb-4">Configuración de Tienda</h2>
        <div v-if="storeInfo">
          <FormField label="Nombre de la tienda" required>
            <BaseInput v-model="storeInfo.name" type="text" placeholder="Mi Tienda" />
          </FormField>

          <FormField label="Dominio" required>
            <BaseInput v-model="storeInfo.domain" type="text" placeholder="mitienda.kiosky.com" />
          </FormField>

          <button @click="handleStoreSubmit" :disabled="!isStoreFormValid"
            class="bg-amber-200 text-black text-sm px-4 py-2 rounded-lg hover:bg-amber-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            Actualizar Tienda
          </button>
        </div>
        <div v-else-if="!userStore.currentUser?.storeId" class="py-4 text-gray-400">
          No tienes una tienda asociada, crea una para configurar sus detalles.

          <div>
            <button @click="isCreateStoreModalOpen = true"
              class="mt-3 bg-amber-200 text-black px-4 py-2 rounded-lg hover:bg-amber-100 transition-colors duration-200">
              Crear Tienda
            </button>
          </div>
        </div>
        <div v-else class="py-4 text-gray-400">
          Cargando información de la tienda...
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de Crear Tienda -->
  <CreateStoreModal :is-open="isCreateStoreModalOpen" :loading="createStoreLoading"
    @close="isCreateStoreModalOpen = false" @saveStoreInfo="handleCreateStore" />
</template>

<style scoped>
/* Estilos específicos de la vista de configuración */
</style>
