import { useNotificationStore } from '@/stores/notifications'

/**
 * Composable para manejar notificaciones de forma sencilla
 
 * @example
 * const { success, error, info, warning, confirm } = useNotifications()
 *
 * // Mostrar notificación de éxito
 * success('¡Registro exitoso!', 'Tu cuenta ha sido creada correctamente')
 *
 * // Mostrar error
 * error('Error en el servidor', 'No se pudo procesar la solicitud')
 *
 * // Confirmar acción
 * confirm('¿Eliminar elemento?', 'Esta acción no se puede deshacer', () => {
 *   // lógica de confirmación
 * })
 */
export function useNotifications() {
  const notificationStore = useNotificationStore()

  /**
   * Mostrar notificación de éxito
   */
  const success = (title: string, message: string = '', duration?: number) => {
    return notificationStore.success(title, message, duration)
  }

  /**
   * Mostrar notificación de error
   */
  const error = (title: string, message: string = '', duration?: number) => {
    return notificationStore.error(title, message, duration)
  }

  /**
   * Mostrar notificación de información
   */
  const info = (title: string, message: string = '', duration?: number) => {
    return notificationStore.info(title, message, duration)
  }

  /**
   * Mostrar notificación de advertencia
   */
  const warning = (title: string, message: string = '', duration?: number) => {
    return notificationStore.warning(title, message, duration)
  }

  /**
   * Mostrar modal de confirmación
   */
  const confirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    options?: {
      confirmText?: string
      cancelText?: string
      onCancel?: () => void
      type?: 'danger' | 'warning' | 'info'
    },
  ) => {
    notificationStore.confirm({
      title,
      message,
      onConfirm,
      ...options,
    })
  }

  /**
   * Limpiar todas las notificaciones
   */
  const clearAll = () => {
    notificationStore.clearAll()
  }

  /**
   * Cerrar notificación específica
   */
  const remove = (id: string) => {
    notificationStore.removeNotification(id)
  }

  return {
    success,
    error,
    info,
    warning,
    confirm,
    clearAll,
    remove,
  }
}
