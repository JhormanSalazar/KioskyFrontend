<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="confirmation"
        class="fixed inset-0 z-50 flex items-center justify-center"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 backdrop-blur-sm"
          @click="handleCancel"
        />

        <!-- Modal -->
        <div class="relative bg-gray-900 rounded-lg shadow-xl border border-gray-700 max-w-md w-full mx-4 transform transition-all">
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-700">
            <div class="flex items-center space-x-3">
              <component
                :is="getIcon(confirmation.type || 'warning')"
                :class="getIconClasses(confirmation.type || 'warning')"
                class="h-6 w-6"
              />
              <h3 class="text-lg font-semibold text-amber-200">
                {{ confirmation.title }}
              </h3>
            </div>

            <button
              @click="handleCancel"
              class="text-gray-400 hover:text-gray-200 transition-colors duration-200"
            >
              <X class="h-5 w-5" />
            </button>
          </div>

          <!-- Body -->
          <div class="p-6">
            <p class="text-sm text-gray-300 leading-relaxed">
              {{ confirmation.message }}
            </p>
          </div>

          <!-- Footer -->
          <div class="flex justify-end space-x-3 p-6 border-t border-gray-700">
            <button
              @click="handleCancel"
              class="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
            >
              {{ confirmation.cancelText || 'Cancelar' }}
            </button>

            <button
              @click="handleConfirm"
              :class="getConfirmButtonClasses(confirmation.type || 'warning')"
              class="px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-200"
            >
              {{ confirmation.confirmText || 'Confirmar' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  AlertTriangle,
  AlertCircle,
  Info,
  X
} from 'lucide-vue-next'
import { useNotificationStore } from '@/stores/notifications'

const notificationStore = useNotificationStore()

const confirmation = computed(() => notificationStore.confirmation)

const handleConfirm = () => {
  if (confirmation.value?.onConfirm) {
    confirmation.value.onConfirm()
  }
  notificationStore.closeConfirmation()
}

const handleCancel = () => {
  if (confirmation.value?.onCancel) {
    confirmation.value.onCancel()
  }
  notificationStore.closeConfirmation()
}

const getIcon = (type: 'danger' | 'warning' | 'info') => {
  const iconMap = {
    danger: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  }
  return iconMap[type]
}

const getIconClasses = (type: 'danger' | 'warning' | 'info') => {
  const typeClasses = {
    danger: "text-red-500",
    warning: "text-yellow-500",
    info: "text-blue-500",
  }
  return typeClasses[type]
}

const getConfirmButtonClasses = (type: 'danger' | 'warning' | 'info') => {
  const typeClasses = {
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    warning: "bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500",
    info: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
  }
  return typeClasses[type]
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
</style>
