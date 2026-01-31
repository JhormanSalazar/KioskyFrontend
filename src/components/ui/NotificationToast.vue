<template>
  <div class="fixed top-4 right-4 z-50 space-y-3 pointer-events-none max-w-md">
    <TransitionGroup name="toast" tag="div">
      <div v-for="notification in notifications" :key="notification.id" :class="toastClasses(notification.type)"
        class="pointer-events-auto relative overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 w-full min-w-[320px] max-w-md transform transition-all duration-300">

        <!-- Barra de progreso superior -->
        <div v-if="notification.duration && notification.duration > 0" :class="progressBarClasses(notification.type)"
          class="absolute top-0 left-0 h-1 animate-progress"
          :style="{ animationDuration: notification.duration + 'ms' }" />

        <!-- Icono y contenido principal -->
        <div class="p-4">
          <div class="flex items-start gap-2">
            <!-- Icono -->
            <div class="flex-shrink-0">
              <component :is="getIcon(notification.type)" :class="iconClasses(notification.type)" class="h-5 w-5" />
            </div>

            <!-- Contenido -->
            <div class="flex-1 min-w-0">
              <p class="text-xs font-semibold text-amber-200 break-words">
                {{ notification.title }}
              </p>
              <p v-if="notification.message" class="mt-1 text-xs text-gray-300 leading-relaxed break-words">
                {{ notification.message }}
              </p>

              <!-- Botones de acción -->
              <div v-if="notification.actions && notification.actions.length > 0" class="mt-2 flex space-x-2">
                <button v-for="action in notification.actions" :key="action.label" @click="action.action"
                  :class="actionButtonClasses(action.style || 'secondary')"
                  class="text-xs font-medium px-2 py-1 rounded-md transition-colors duration-200">
                  {{ action.label }}
                </button>
              </div>
            </div>

            <!-- Botón cerrar -->
            <div class="ml-4 flex-shrink-0 flex">
              <button @click="removeNotification(notification.id)"
                class="inline-flex text-gray-400 hover:text-gray-200 focus:outline-none focus:text-gray-200 transition-colors duration-200">
                <X class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
  X
} from 'lucide-vue-next'
import { useNotificationStore, type NotificationType } from '@/stores/notifications'

const notificationStore = useNotificationStore()

const notifications = computed(() => notificationStore.notifications)

const removeNotification = (id: string) => {
  notificationStore.removeNotification(id)
}

const getIcon = (type: NotificationType) => {
  const iconMap = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  }
  return iconMap[type]
}

const toastClasses = (type: NotificationType) => {
  return "bg-gray-800"
}

const progressBarClasses = (type: NotificationType) => {
  const typeClasses = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
  }

  return typeClasses[type]
}

const iconClasses = (type: NotificationType) => {
  const typeClasses = {
    success: "text-green-500",
    error: "text-red-500",
    warning: "text-yellow-500",
    info: "text-blue-500",
  }

  return typeClasses[type]
}

const actionButtonClasses = (style: 'primary' | 'secondary') => {
  return style === 'primary'
    ? "bg-amber-200 text-black hover:bg-amber-100"
    : "bg-gray-700 text-gray-200 hover:bg-gray-600"
}
</script>

<style scoped>
/* Animaciones para la barra de progreso */
@keyframes progress {
  from {
    width: 100%;
  }

  to {
    width: 0%;
  }
}

.animate-progress {
  animation-name: progress;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

/* Transiciones para los toasts */
.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.3s ease-in;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
