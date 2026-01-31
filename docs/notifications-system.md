# Sistema de Notificaciones Kiosky

Este sistema de notificaciones proporciona toasts modernos y modales de confirmación para toda la aplicación.

## Características

✅ **Toasts responsivos** - Aparecen desde la esquina superior derecha
✅ **4 tipos de notificación** - Success, Error, Warning, Info
✅ **Modal de confirmación** - Para acciones críticas
✅ **Accesible globalmente** - No necesitas importar en cada componente
✅ **Auto-dismissible** - Se cierran automáticamente
✅ **Animaciones suaves** - Transiciones modernas
✅ **Colores del proyecto** - Tema consistente con Kiosky

## Uso básico

```vue
<script setup lang="ts">
import { useNotifications } from '@/composables/useNotifications'

const { success, error, info, warning, confirm } = useNotifications()

// Notificación de éxito
const handleSuccess = () => {
  success('¡Operación exitosa!', 'Los datos se guardaron correctamente')
}

// Notificación de error
const handleError = () => {
  error('Error en el servidor', 'No se pudo procesar la solicitud')
}

// Notificación de información
const handleInfo = () => {
  info('Nueva actualización', 'Hay una nueva versión disponible')
}

// Notificación de advertencia
const handleWarning = () => {
  warning('Cuota casi llena', 'Has usado el 90% de tu espacio disponible')
}

// Modal de confirmación
const handleDelete = () => {
  confirm(
    '¿Eliminar elemento?',
    'Esta acción no se puede deshacer. ¿Estás seguro?',
    () => {
      // Lógica de eliminación
      success('Elemento eliminado', 'El elemento se eliminó correctamente')
    },
    {
      type: 'danger',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    }
  )
}
</script>
```

## Opciones avanzadas

### Duración personalizada
```typescript
// Toast que dura 10 segundos
success('Mensaje', 'Descripción', 10000)

// Toast que no se cierra automáticamente
info('Mensaje persistente', 'Este mensaje no se cierra solo', 0)
```

### Notificaciones con acciones
```typescript
notificationStore.addNotification({
  type: 'info',
  title: 'Nueva función disponible',
  message: 'Descubre las nuevas características',
  actions: [
    {
      label: 'Ver tour',
      action: () => startTour(),
      style: 'primary'
    },
    {
      label: 'Más tarde',
      action: () => dismissTour(),
      style: 'secondary'
    }
  ]
})
```

### Tipos de confirmación
```typescript
// Confirmación de peligro (roja)
confirm('Eliminar cuenta', 'Esta acción es irreversible', onDelete, { type: 'danger' })

// Confirmación de advertencia (amarilla)
confirm('Descartar cambios', '¿Estás seguro?', onDiscard, { type: 'warning' })

// Confirmación informativa (azul)
confirm('Continuar proceso', '¿Deseas continuar?', onContinue, { type: 'info' })
```

## Implementación en Signup.vue

El componente de registro ya está conectado con el sistema:

- ✅ **Éxito**: Muestra toast verde cuando el registro es exitoso
- ✅ **Error**: Muestra toast rojo cuando hay errores del servidor
- ✅ **Loading**: Botón se deshabilita y muestra spinner durante la carga

## Arquitectura

### Store Global (`stores/notifications.ts`)
- Maneja el estado de todas las notificaciones
- Funciones helper para cada tipo
- Auto-cleanup de notificaciones expiradas

### Componentes UI
- `NotificationToast.vue` - Toasts deslizantes
- `ConfirmationModal.vue` - Modal de confirmación

### Composable (`composables/useNotifications.ts`)
- API simplificada para uso en componentes
- Funciones helper con mejor DX

### Integración Global (`App.vue`)
- Componentes incluidos globalmente
- Disponibles en toda la aplicación sin imports