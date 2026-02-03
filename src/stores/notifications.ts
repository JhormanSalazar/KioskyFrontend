import { defineStore } from 'pinia'
import { ref } from 'vue'

export type NotificationType = 'success' | 'error' | 'info' | 'warning'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  duration?: number
  actions?: Array<{
    label: string
    action: () => void
    style?: 'primary' | 'secondary'
  }>
}

export interface ConfirmationOptions {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel?: () => void
  type?: 'danger' | 'warning' | 'info'
}

export const useNotificationStore = defineStore('notifications', () => {
  const notifications = ref<Notification[]>([])
  const confirmation = ref<ConfirmationOptions | null>(null)

  const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36)

  /**
   * Agregar una nueva notificación toast
   */
  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const newNotification: Notification = {
      id: generateId(),
      ...notification,
      // Asegurar que siempre haya un valor de duration, incluso si viene undefined
      duration: notification.duration ?? 5000, // 5 segundos por defecto
    }

    notifications.value.push(newNotification)

    // Auto-remove después del tiempo especificado
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        console.log(
          `Auto-removing notification: ${newNotification.id} after ${newNotification.duration}ms`,
        )
        removeNotification(newNotification.id)
      }, newNotification.duration)
    }

    return newNotification.id
  }

  /**
   * Remover una notificación específica
   */
  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex((n) => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  /**
   * Limpiar todas las notificaciones
   */
  const clearAll = () => {
    notifications.value = []
  }

  /**
   * Mostrar notificación de éxito
   */
  const success = (title: string, message: string = '', duration?: number) => {
    return addNotification({
      type: 'success',
      title,
      message,
      duration,
    })
  }

  /**
   * Mostrar notificación de error
   */
  const error = (title: string, message: string = '', duration?: number) => {
    return addNotification({
      type: 'error',
      title,
      message,
      duration: duration ?? 7000, // Los errores duran más tiempo
    })
  }

  /**
   * Mostrar notificación de información
   */
  const info = (title: string, message: string = '', duration?: number) => {
    return addNotification({
      type: 'info',
      title,
      message,
      duration,
    })
  }

  /**
   * Mostrar notificación de advertencia
   */
  const warning = (title: string, message: string = '', duration?: number) => {
    return addNotification({
      type: 'warning',
      title,
      message,
      duration: duration ?? 6000, // Advertencias duran un poco más
    })
  }

  /**
   * Mostrar modal de confirmación
   */
  const confirm = (options: ConfirmationOptions) => {
    confirmation.value = {
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      type: 'warning',
      ...options,
    }
  }

  /**
   * Cerrar modal de confirmación
   */
  const closeConfirmation = () => {
    confirmation.value = null
  }

  return {
    // State
    notifications,
    confirmation,

    // Actions
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    info,
    warning,
    confirm,
    closeConfirmation,
  }
})
