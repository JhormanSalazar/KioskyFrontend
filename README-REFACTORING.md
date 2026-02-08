# 📚 Kiosky Frontend - Refactorización y Mejoras

## 📋 Tabla de Contenidos
- [Estado del Proyecto ANTES](#-estado-del-proyecto-antes)
- [Problemas Identificados](#-problemas-identificados)
- [Soluciones Implementadas](#-soluciones-implementadas)
- [Arquitectura de Componentes](#-arquitectura-de-componentes)
- [Conceptos Clave](#-conceptos-clave)
- [Guía de Desarrollo](#-guía-de-desarrollo)
- [Mejores Prácticas](#-mejores-prácticas)
- [Próximos Pasos](#-próximos-pasos)

---

## 🔍 Estado del Proyecto ANTES

### Estructura Inicial

El proyecto **Kiosky** tenía una base sólida con Vue 3, TypeScript, Tailwind CSS y Pinia, pero presentaba varios puntos de mejora en su implementación:

#### ✅ Lo que estaba bien:
- ✔️ Arquitectura moderna con Vue 3 Composition API
- ✔️ TypeScript configurado correctamente
- ✔️ Sistema de autenticación con JWT funcional
- ✔️ Servicios de API bien estructurados (auth, store, user)
- ✔️ State management con Pinia implementado
- ✔️ Composables reutilizables (`useApi`, `useNotifications`)
- ✔️ Sistema de notificaciones global
- ✔️ Paleta de colores consistente

---

## ❌ Problemas Identificados

### 1. **Falta de Servicio de Categorías**

**Problema:**
El backend tenía endpoints completos para categorías (`/api/categories`), pero **no existía el servicio en el frontend** (`category.service.ts`).

**Impacto:**
- Imposible gestionar categorías desde el frontend
- Dependencia incompleta para la vista de Productos

---

### 2. **Vistas Sin Funcionalidad**

**Problema:**
Las vistas `CategoriasView.vue` y `ProductosView.vue` eran solo **esqueletos HTML estáticos** sin lógica:

```vue
<!-- Antes -->
<script setup lang="ts">
// Vista de categorías
</script>

<template>
    <div class="categorias-view">
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Categorías</h1>
            <p class="text-gray-600">Organiza tus productos en categorías.</p>
        </div>
        <!-- UI estática, sin datos reales -->
    </div>
</template>
```

**Impacto:**
- No se podían listar, crear, editar ni eliminar categorías/productos
- Sin integración con la API del backend
- Sin validaciones de formularios

---

### 3. **Falta de Componentes Reutilizables**

**Problema:**
No existían componentes genéricos para:
- Tablas de datos (cada vista tendría que implementar su propia tabla)
- Modales de formularios (código duplicado en cada CRUD)
- Campos de formulario consistentes
- Inputs con estilos estandarizados

**Impacto:**
- **Código duplicado** en cada nueva funcionalidad
- **Inconsistencia visual** entre diferentes secciones
- **Mayor tiempo de desarrollo** al crear nuevas vistas
- **Difícil mantenimiento** (cambios en UI requieren modificar múltiples archivos)

---

### 4. **Servicio de Productos Desactualizado**

**Problema:**
El archivo `product.service.ts` era una **plantilla genérica** que no coincidía con los endpoints reales del backend:

```typescript
// Antes - plantilla genérica
export interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number  // ❌ No existe en el backend
  category: string
  // ...
}
```

**Impacto:**
- Tipos incompatibles con la API real
- Endpoints incorrectos
- Imposible integrar productos con el backend

---

## ✅ Soluciones Implementadas

### 1. **Servicio de Categorías Completo**

**Archivo:** `src/api/services/category.service.ts`

**Qué hace:**
Proporciona todos los métodos necesarios para gestionar categorías, siguiendo el patrón establecido en el proyecto.

**Métodos implementados:**
```typescript
categoryService.getAll()                        // Listar todas las categorías
categoryService.getById(id)                     // Obtener por ID
categoryService.getBySlug(slug)                 // Obtener por slug
categoryService.getByStoreId(storeId)           // Filtrar por tienda
categoryService.getByStoreAndSlug(storeId, slug) // Obtener por tienda y slug
categoryService.slugExists(storeId, slug)       // Validar slug único
categoryService.create(category)                // Crear categoría
categoryService.update(id, category)            // Actualizar categoría
categoryService.delete(id)                      // Eliminar categoría
```

**Por qué es importante:**
- ✅ Consistencia con otros servicios del proyecto
- ✅ Tipado fuerte con TypeScript
- ✅ Documentación clara con JSDoc
- ✅ Manejo de errores centralizado en `apiClient`

---

### 2. **Componente DataTable.vue - Tabla Reutilizable**

**Archivo:** `src/components/ui/DataTable.vue`

**Qué hace:**
Componente genérico para mostrar **cualquier tipo de datos** en formato tabla con funcionalidades integradas.

**Características:**
- ✅ **Columnas configurables** con tipos y formato personalizado
- ✅ **Estados de loading** y vacío integrados
- ✅ **Búsqueda opcional** con input integrado
- ✅ **Acciones por fila** (editar, eliminar) customizables
- ✅ **Slots** para personalización avanzada
- ✅ **Botón de crear** con evento customizable

**Ejemplo de uso:**
```vue
<DataTable
  title="Categorías"
  subtitle="Organiza tus productos en categorías"
  :columns="[
    { key: 'name', label: 'Nombre' },
    { key: 'productCount', label: 'Productos', format: (value) => `${value} productos` }
  ]"
  :items="categories"
  :loading="loading"
  @create="handleCreate"
  @edit="handleEdit"
  @delete="handleDelete"
/>
```

**Conceptos clave:**
- **Slot patterns**: Permite personalizar columnas y acciones
- **Props dinámicos**: Configuración flexible sin modificar el componente
- **Eventos customizados**: Comunicación padre-hijo mediante `emit`

---

### 3. **Componente FormModal.vue - Modal Reutilizable**

**Archivo:** `src/components/ui/FormModal.vue`

**Qué hace:**
Modal genérico para formularios de creación/edición con **validación y estados de loading**.

**Características:**
- ✅ **Teleport** para renderizar fuera del DOM padre
- ✅ **Transiciones animadas** suaves
- ✅ **Backdrop blur** para mejor UX
- ✅ **Estados de loading** durante submit
- ✅ **Validación opcional** (habilita/deshabilita botón guardar)
- ✅ **Tamaños configurables** (sm, md, lg, xl)
- ✅ **Slot para contenido** completamente personalizable

**Ejemplo de uso:**
```vue
<FormModal
  v-model:isOpen="showModal"
  title="Crear Categoría"
  :icon="FolderPlus"
  :loading="saving"
  :is-valid="formIsValid"
  @submit="handleSubmit"
>
  <!-- Contenido del formulario aquí -->
  <FormField label="Nombre" required>
    <BaseInput v-model="form.name" />
  </FormField>
</FormModal>
```

**Conceptos clave:**
- **Teleport**: Renderiza el modal en `<body>` para evitar problemas de z-index
- **v-model:isOpen**: Two-way binding para controlar apertura/cierre
- **Slots**: El contenido del formulario es completamente flexible

---

### 4. **Componentes FormField.vue y BaseInput.vue**

**Archivos:**
- `src/components/ui/FormField.vue`
- `src/components/ui/BaseInput.vue`

**Qué hacen:**
Componentes para crear **campos de formulario consistentes** con validación visual.

**FormField - Envoltorio de campos:**
```vue
<FormField
  label="Nombre de la categoría"
  required
  :error="errors.name"
  hint="Usa un nombre descriptivo"
>
  <BaseInput v-model="form.name" />
</FormField>
```

**BaseInput - Input estilizado:**
```vue
<BaseInput
  v-model="form.email"
  type="email"
  placeholder="correo@ejemplo.com"
  :has-error="!!errors.email"
/>
```

**Por qué son importantes:**
- ✅ **Estilos consistentes** en todo el proyecto
- ✅ **Validación visual** automática (bordes rojos en error)
- ✅ **Mensajes de error** integrados
- ✅ **Hints informativos** para mejorar UX
- ✅ **Compatible con v-model** (two-way binding)

---

### 5. **Vista de Categorías Completa**

**Archivo:** `src/views/CategoriasView.vue`

**Qué hace:**
Vista **completamente funcional** para gestionar categorías con todas las operaciones CRUD.

**Funcionalidades implementadas:**
- ✅ **Listar categorías** de la tienda del usuario
- ✅ **Crear categorías** con validación
- ✅ **Editar categorías** existentes
- ✅ **Eliminar categorías** con confirmación
- ✅ **Validación de slugs únicos**
- ✅ **Generación automática de slugs** desde el nombre
- ✅ **Estados de loading** y errores
- ✅ **Notificaciones** de éxito/error

**Validaciones implementadas:**
```typescript
// Validación de nombre
if (!form.value.name.trim()) {
  errors.name = 'El nombre es obligatorio'
} else if (form.value.name.length < 2) {
  errors.name = 'Mínimo 2 caracteres'
}

// Validación de slug
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.value.slug)) {
  errors.slug = 'Solo letras minúsculas, números y guiones'
}

// Verificar slug único en el backend
const exists = await categoryService.slugExists(storeId, form.slug)
if (exists) {
  errors.slug = 'Este slug ya está en uso'
}
```

**Generación automática de slugs:**
```typescript
// "Electrónica y Gadgets" → "electronica-y-gadgets"
const generateSlug = () => {
  form.value.slug = form.value.name
    .toLowerCase()
    .normalize('NFD')               // Descomponer caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .replace(/[^a-z0-9\s-]/g, '')    // Solo letras, números, espacios y guiones
    .replace(/\s+/g, '-')            // Espacios → guiones
    .replace(/-+/g, '-')             // Múltiples guiones → uno solo
    .replace(/^-|-$/g, '')           // Eliminar guiones al inicio/fin
}
```

---

### 6. **Vista de Productos Completa**

**Archivo:** `src/views/ProductosView.vue`

**Qué hace:**
Vista **completamente funcional** para gestionar productos con operaciones CRUD avanzadas.

**Funcionalidades implementadas:**
- ✅ **Listar productos** con información de categoría
- ✅ **Crear productos** con múltiples campos
- ✅ **Editar productos** existentes
- ✅ **Eliminar productos** con confirmación
- ✅ **Toggle de visibilidad** (mostrar/ocultar en catálogo)
- ✅ **Múltiples imágenes** (URLs)
- ✅ **Atributos personalizados** (JSON)
- ✅ **Validación completa** de formulario
- ✅ **Carga paralela** de productos y categorías

**Campos del formulario:**
```typescript
form = {
  name: string          // Nombre del producto
  slug: string          // URL amigable
  price: number         // Precio (validado > 0)
  description: string   // Descripción (opcional)
  categoryId: number    // FK a categoría
  isVisible: boolean    // Visibilidad en catálogo
  images: string[]      // Array de URLs de imágenes
  attributes: string    // JSON de atributos personalizados
}
```

**Manejo de imágenes dinámico:**
```typescript
// Añadir campo de imagen
const addImageField = () => {
  form.value.images.push('')
}

// Remover campo si hay más de uno
const removeImageField = (index: number) => {
  if (form.images.length > 1) {
    form.images.splice(index, 1)
  }
}
```

**Toggle de visibilidad:**
```typescript
const toggleVisibility = async (product: ProductResponse) => {
  await productService.toggleVisibility(product.id, !product.isVisible)
  success(`Producto ${!product.isVisible ? 'mostrado' : 'ocultado'}`)
  await loadProducts()
}
```

---

### 7. **Servicio de Productos Actualizado**

**Archivo:** `src/api/services/product.service.ts`

**Qué hace:**
Servicio actualizado con **todos los endpoints reales** del backend y tipos correctos.

**Métodos añadidos:**
```typescript
productService.getByStoreId(storeId)              // Por tienda
productService.getVisibleByStoreId(storeId)       // Solo visibles
productService.searchByStore(storeId, query)      // Búsqueda
productService.filterByPriceRange(min, max)       // Filtro precio
productService.slugExists(storeId, slug)          // Validar slug
productService.toggleVisibility(id, isVisible)    // Cambiar visibilidad
```

**Uso de tipos correctos:**
```typescript
// Ahora usa los tipos definidos en api.types.ts
import type {
  ProductResponse,
  CreateProductRequest,
  UpdateProductRequest
} from '@/types/api.types'
```

---

## 🏗️ Arquitectura de Componentes

### Jerarquía de Reutilización

```
📁 src/components/ui/
├── DataTable.vue         → Tabla genérica reutilizable
├── FormModal.vue         → Modal genérico para formularios
├── FormField.vue         → Campo de formulario con validación
├── BaseInput.vue         → Input estilizado base
└── ConfirmationModal.vue → Modal de confirmación (ya existía)

📁 src/views/
├── CategoriasView.vue    → Usa DataTable + FormModal + FormField + BaseInput
└── ProductosView.vue     → Usa DataTable + FormModal + FormField + BaseInput
```

### Flujo de Datos

```
Vista (CategoriasView.vue)
    ↓
    ├─→ DataTable (muestra datos)
    │       ↓
    │       └─→ Emite eventos (@create, @edit, @delete)
    │
    ├─→ FormModal (formulario de creación/edición)
    │       ↓
    │       ├─→ FormField (campos individuales)
    │       │       ↓
    │       │       └─→ BaseInput (inputs estilizados)
    │       ↓
    │       └─→ Emite evento (@submit)
    │
    └─→ Servicio (categoryService / productService)
            ↓
            └─→ apiClient → Backend
```

---

## 💡 Conceptos Clave

### 1. **Composition API (Vue 3)**

**Qué es:**
Forma moderna de escribir componentes Vue con funciones reutilizables (composables).

**Antes (Options API):**
```javascript
export default {
  data() {
    return {
      categories: []
    }
  },
  methods: {
    loadCategories() {
      // ...
    }
  }
}
```

**Ahora (Composition API):**
```typescript
const categories = ref<CategoryResponse[]>([])

const loadCategories = async () => {
  categories.value = await categoryService.getByStoreId(storeId.value)
}
```

**Ventajas:**
- ✅ Mejor organización del código
- ✅ Más fácil de testear
- ✅ Composables reutilizables
- ✅ Mejor soporte de TypeScript

---

### 2. **Reactivity (ref y computed)**

**ref - Para valores reactivos:**
```typescript
const loading = ref(false)    // Valor reactivo
loading.value = true          // Acceder con .value en script
// En template: <div v-if="loading"> → sin .value
```

**computed - Para valores derivados:**
```typescript
const isFormValid = computed(() => {
  return form.value.name.length >= 2 &&
         form.value.slug.length >= 2
})
// Se recalcula automáticamente cuando cambian las dependencias
```

---

### 3. **Two-Way Binding (v-model)**

**Qué es:**
Sincronización bidireccional entre el input y el estado.

**Ejemplo:**
```vue
<BaseInput v-model="form.name" />

<!-- Equivalente a: -->
<BaseInput
  :modelValue="form.name"
  @update:modelValue="(val) => form.name = val"
/>
```

**v-model personalizado en componentes:**
```typescript
// En BaseInput.vue
const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const handleInput = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
```

---

### 4. **Slots - Contenido Personalizado**

**Qué son:**
Permiten que el componente padre inyecte contenido en el hijo.

**Slot básico:**
```vue
<!-- FormModal.vue -->
<div class="modal-body">
  <slot></slot> <!-- El padre puede poner cualquier contenido aquí -->
</div>

<!-- Uso: -->
<FormModal>
  <p>Este contenido va en el slot</p>
</FormModal>
```

**Slot con nombre:**
```vue
<!-- DataTable.vue -->
<td>
  <slot name="actions" :item="item">
    <!-- Contenido por defecto si no se proporciona slot -->
    <button @click="edit(item)">Editar</button>
  </slot>
</td>

<!-- Uso: -->
<DataTable :items="products">
  <template #actions="{ item }">
    <button @click="customAction(item)">Acción Custom</button>
  </template>
</DataTable>
```

**Scoped slots:**
El componente hijo puede **pasar datos al slot** que el padre puede usar.

---

### 5. **Async/Await - Operaciones Asíncronas**

**Por qué es importante:**
Las llamadas a la API son asíncronas (toman tiempo).

**Uso correcto:**
```typescript
const loadCategories = async () => {
  loading.value = true
  try {
    // Espera a que termine la llamada
    categories.value = await categoryService.getByStoreId(storeId.value)
  } catch (error) {
    notifyError('Error al cargar categorías')
  } finally {
    // Se ejecuta siempre, haya error o no
    loading.value = false
  }
}
```

**Llamadas en paralelo:**
```typescript
// ❌ Secuencial (lento)
const products = await productService.getByStoreId(storeId)
const categories = await categoryService.getByStoreId(storeId)

// ✅ Paralelo (rápido)
const [products, categories] = await Promise.all([
  productService.getByStoreId(storeId),
  categoryService.getByStoreId(storeId)
])
```

---

### 6. **TypeScript - Tipado Fuerte**

**Por qué es importante:**
Detecta errores **antes de ejecutar el código**.

**Definición de tipos:**
```typescript
// api.types.ts
export interface CategoryResponse {
  id: number
  slug: string
  name: string
  storeId: number
  storeName: string
  productCount: number
}
```

**Uso con tipado:**
```typescript
// ✅ TypeScript sabe qué propiedades tiene
const categories = ref<CategoryResponse[]>([])

// Autocompletado y validación
categories.value.forEach(cat => {
  console.log(cat.name)      // ✅ OK
  console.log(cat.invalid)   // ❌ Error: no existe
})
```

**Props tipadas:**
```typescript
const props = defineProps<{
  title: string
  columns: TableColumn[]
  loading?: boolean  // Opcional
}>()
```

---

### 7. **Composables - Lógica Reutilizable**

**Qué son:**
Funciones que encapsulan lógica reutilizable con estado reactivo.

**Ejemplo existente en el proyecto:**
```typescript
// useNotifications.ts
export const useNotifications = () => {
  const { addNotification, confirm } = useNotificationStore()

  const success = (message: string) => {
    addNotification({ type: 'success', message })
  }

  return { success, error, info, warning, confirm }
}

// Uso en componentes:
const { success, error } = useNotifications()
success('Categoría creada!')
```

---

## 📘 Guía de Desarrollo

### Cómo Crear una Nueva Vista CRUD

Imagina que quieres crear una vista para **gestionar clientes**. Aquí está el proceso paso a paso:

---

#### **Paso 1: Definir Tipos**

Archivo: `src/types/api.types.ts`

```typescript
export interface CustomerResponse {
  id: number
  name: string
  email: string
  phone: string
  createdAt: string
}

export interface CreateCustomerRequest {
  name: string
  email: string
  phone: string
}

export interface UpdateCustomerRequest {
  name: string
  email: string
  phone: string
}
```

---

#### **Paso 2: Crear Servicio**

Archivo: `src/api/services/customer.service.ts`

```typescript
import apiClient from '../apiClient'
import type { CustomerResponse, CreateCustomerRequest, UpdateCustomerRequest } from '@/types/api.types'

export const customerService = {
  async getAll(): Promise<CustomerResponse[]> {
    const response = await apiClient.get<CustomerResponse[]>('/api/customers')
    return response.data
  },

  async getById(id: number): Promise<CustomerResponse> {
    const response = await apiClient.get<CustomerResponse>(`/api/customers/${id}`)
    return response.data
  },

  async create(customer: CreateCustomerRequest): Promise<CustomerResponse> {
    const response = await apiClient.post<CustomerResponse>('/api/customers', customer)
    return response.data
  },

  async update(id: number, customer: UpdateCustomerRequest): Promise<CustomerResponse> {
    const response = await apiClient.put<CustomerResponse>(`/api/customers/${id}`, customer)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/customers/${id}`)
  }
}
```

---

#### **Paso 3: Crear Vista**

Archivo: `src/views/ClientesView.vue`

```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Users, UserPlus } from 'lucide-vue-next'
import DataTable from '@/components/ui/DataTable.vue'
import FormModal from '@/components/ui/FormModal.vue'
import FormField from '@/components/ui/FormField.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import { customerService } from '@/api/services/customer.service'
import { useNotifications } from '@/composables/useNotifications'
import type { CustomerResponse, CreateCustomerRequest, UpdateCustomerRequest } from '@/types/api.types'
import type { TableColumn } from '@/components/ui/DataTable.vue'

// Composables
const { success, error: notifyError, confirm } = useNotifications()

// Estado
const customers = ref<CustomerResponse[]>([])
const loading = ref(false)
const showModal = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const savingCustomer = ref(false)
const currentCustomerId = ref<number | null>(null)

// Formulario
const form = ref({
  name: '',
  email: '',
  phone: ''
})

// Errores
const formErrors = ref({
  name: '',
  email: '',
  phone: ''
})

// Columnas de la tabla
const columns: TableColumn[] = [
  { key: 'name', label: 'Nombre', cellClass: 'font-medium' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Teléfono' }
]

// Cargar clientes
const loadCustomers = async () => {
  loading.value = true
  try {
    customers.value = await customerService.getAll()
  } catch (err: any) {
    notifyError('Error al cargar clientes')
  } finally {
    loading.value = false
  }
}

// Validar formulario
const validateForm = (): boolean => {
  let isValid = true
  formErrors.value = { name: '', email: '', phone: '' }

  if (!form.value.name.trim()) {
    formErrors.value.name = 'El nombre es obligatorio'
    isValid = false
  }

  if (!form.value.email.trim()) {
    formErrors.value.email = 'El email es obligatorio'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    formErrors.value.email = 'Email inválido'
    isValid = false
  }

  return isValid
}

// Crear cliente
const handleCreate = () => {
  modalMode.value = 'create'
  currentCustomerId.value = null
  form.value = { name: '', email: '', phone: '' }
  formErrors.value = { name: '', email: '', phone: '' }
  showModal.value = true
}

// Editar cliente
const handleEdit = (customer: CustomerResponse) => {
  modalMode.value = 'edit'
  currentCustomerId.value = customer.id
  form.value = {
    name: customer.name,
    email: customer.email,
    phone: customer.phone
  }
  formErrors.value = { name: '', email: '', phone: '' }
  showModal.value = true
}

// Guardar cliente
const handleSubmit = async () => {
  if (!validateForm()) return

  savingCustomer.value = true

  try {
    if (modalMode.value === 'create') {
      await customerService.create(form.value)
      success('Cliente creado exitosamente')
    } else {
      await customerService.update(currentCustomerId.value!, form.value)
      success('Cliente actualizado exitosamente')
    }

    showModal.value = false
    await loadCustomers()
  } catch (err: any) {
    notifyError('Error al guardar el cliente')
  } finally {
    savingCustomer.value = false
  }
}

// Eliminar cliente
const handleDelete = async (customer: CustomerResponse) => {
  const confirmed = await confirm({
    title: 'Eliminar Cliente',
    message: `¿Estás seguro de que deseas eliminar a ${customer.name}?`,
    type: 'danger',
    confirmText: 'Eliminar',
    cancelText: 'Cancelar'
  })

  if (!confirmed) return

  try {
    await customerService.delete(customer.id)
    success('Cliente eliminado exitosamente')
    await loadCustomers()
  } catch (err: any) {
    notifyError('Error al eliminar el cliente')
  }
}

// Form válido?
const isFormValid = computed(() => {
  return form.value.name.trim().length > 0 &&
         form.value.email.trim().length > 0 &&
         /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)
})

// Cargar al montar
onMounted(() => {
  loadCustomers()
})
</script>

<template>
  <div class="clientes-view">
    <!-- Tabla -->
    <DataTable
      title="Clientes"
      subtitle="Gestiona tu base de clientes"
      :columns="columns"
      :items="customers"
      :loading="loading"
      :empty-icon="Users"
      empty-message="No hay clientes"
      empty-subtext="Comienza agregando tu primer cliente"
      create-button-text="+ Agregar Cliente"
      @create="handleCreate"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <!-- Modal -->
    <FormModal
      v-model:isOpen="showModal"
      :title="modalMode === 'create' ? 'Crear Cliente' : 'Editar Cliente'"
      :icon="UserPlus"
      :loading="savingCustomer"
      :is-valid="isFormValid"
      @submit="handleSubmit"
    >
      <!-- Nombre -->
      <FormField label="Nombre" required :error="formErrors.name">
        <BaseInput
          v-model="form.name"
          placeholder="Juan Pérez"
          :has-error="!!formErrors.name"
        />
      </FormField>

      <!-- Email -->
      <FormField label="Email" required :error="formErrors.email">
        <BaseInput
          v-model="form.email"
          type="email"
          placeholder="juan@ejemplo.com"
          :has-error="!!formErrors.email"
        />
      </FormField>

      <!-- Teléfono -->
      <FormField label="Teléfono" optional :error="formErrors.phone">
        <BaseInput
          v-model="form.phone"
          type="tel"
          placeholder="+1 234 567 8900"
          :has-error="!!formErrors.phone"
        />
      </FormField>
    </FormModal>
  </div>
</template>

<style scoped>
.clientes-view {
  max-width: 100%;
}
</style>
```

---

#### **Paso 4: Agregar Ruta**

Archivo: `src/router/index.ts`

```typescript
{
  path: '/dashboard/clientes',
  name: 'clientes',
  component: () => import('../views/ClientesView.vue'),
  meta: { requiresAuth: true }
}
```

---

#### **Paso 5: Agregar al Sidebar**

Archivo: `src/components/layout/Sidebar.vue`

```vue
<router-link
  to="/dashboard/clientes"
  class="sidebar-link"
>
  <Users class="h-5 w-5" />
  <span>Clientes</span>
</router-link>
```

---

## ✅ Mejores Prácticas

### 1. **Estructura de Archivos**

```
src/
├── api/
│   └── services/
│       └── [entidad].service.ts      # Un servicio por entidad
├── components/
│   └── ui/
│       └── [ComponentName].vue       # Componentes reutilizables
├── views/
│   └── [EntidadView].vue             # Una vista por sección
├── types/
│   └── api.types.ts                  # Todos los tipos de API centralizados
└── stores/
    └── [entidad].ts                  # Un store por dominio
```

---

### 2. **Nomenclatura**

**Componentes:**
- PascalCase: `DataTable.vue`, `FormModal.vue`
- Descriptivos: indican qué hacen

**Variables y funciones:**
- camelCase: `loadCategories`, `isFormValid`
- Verbos para funciones: `handleCreate`, `validateForm`

**Tipos:**
- PascalCase: `CategoryResponse`, `CreateCategoryRequest`
- Sufijos claros: `Response`, `Request`

---

### 3. **Comentarios y Documentación**

**JSDoc en servicios:**
```typescript
/**
 * Obtener todas las categorías de una tienda
 * @param storeId - ID de la tienda
 * @returns Lista de categorías
 */
async getByStoreId(storeId: number): Promise<CategoryResponse[]> {
  // ...
}
```

**Comentarios en lógica compleja:**
```typescript
// Generar slug: "Electrónica" → "electronica"
const generateSlug = () => {
  form.value.slug = form.value.name
    .toLowerCase()
    .normalize('NFD')                // Descomponer acentos
    .replace(/[\u0300-\u036f]/g, '') // Eliminar marcas diacríticas
    // ...
}
```

---

### 4. **Manejo de Errores**

**Siempre usa try-catch en operaciones async:**
```typescript
const loadData = async () => {
  loading.value = true
  try {
    data.value = await service.getData()
  } catch (err: any) {
    // Mostrar error al usuario
    notifyError(err.response?.data?.message || 'Error al cargar datos')
    // Log para debugging
    console.error('Error loading data:', err)
  } finally {
    // Siempre se ejecuta
    loading.value = false
  }
}
```

---

### 5. **Validaciones**

**Validación en múltiples niveles:**
1. **Frontend**: UX inmediata
2. **Backend**: Seguridad y consistencia

```typescript
// Frontend (rápido, mejora UX)
const validateForm = () => {
  if (!form.value.name.trim()) {
    errors.name = 'El nombre es obligatorio'
    return false
  }
  return true
}

// Backend también valida (no confiar solo en frontend)
```

---

### 6. **Estados de Loading**

**Siempre manejar estados de carga:**
```typescript
const loading = ref(false)

const loadData = async () => {
  loading.value = true  // Activar antes de la llamada
  try {
    data.value = await service.getData()
  } finally {
    loading.value = false  // Desactivar siempre
  }
}
```

**En la UI:**
```vue
<DataTable
  :items="items"
  :loading="loading"
/>
```

---

## 🚀 Próximos Pasos

### Funcionalidades a Implementar

1. **Búsqueda y Filtros**
   - Añadir búsqueda en tiempo real a DataTable
   - Filtros por categoría, precio, estado

2. **Paginación**
   - Implementar paginación en DataTable
   - Usar los parámetros `PaginationParams` existentes

3. **Ordenamiento**
   - Click en headers para ordenar columnas
   - Indicadores visuales de ordenamiento

4. **Drag & Drop**
   - Reordenar productos/categorías
   - Usa la librería `vuedraggable` ya instalada

5. **Subida de Imágenes**
   - Integrar con servicio de almacenamiento (AWS S3, Cloudinary)
   - Componente de upload con preview

6. **Validación Avanzada**
   - Integrar librería como `vee-validate` o `yup`
   - Validaciones asíncronas

7. **Tests**
   - Unit tests para servicios
   - Component tests para UI
   - E2E tests para flujos críticos

---

## 📚 Recursos de Aprendizaje

### Documentación Oficial
- **Vue 3**: https://vuejs.org/guide/introduction.html
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Pinia**: https://pinia.vuejs.org/

### Conceptos Clave
- **Composition API**: https://vuejs.org/guide/extras/composition-api-faq.html
- **Reactivity**: https://vuejs.org/guide/essentials/reactivity-fundamentals.html
- **Slots**: https://vuejs.org/guide/components/slots.html
- **TypeScript con Vue**: https://vuejs.org/guide/typescript/overview.html

---

## 🎉 Resumen

### Lo que logramos:
✅ **Servicio de categorías completo** con todos los endpoints
✅ **Servicio de productos actualizado** con tipos correctos
✅ **4 componentes reutilizables** (DataTable, FormModal, FormField, BaseInput)
✅ **Vista de Categorías funcional** con CRUD completo
✅ **Vista de Productos funcional** con CRUD avanzado
✅ **Validaciones robustas** en formularios
✅ **Generación automática de slugs**
✅ **Manejo de errores consistente**
✅ **UI/UX mejorada** con estados de loading
✅ **Código documentado** y fácil de mantener

### Arquitectura establecida:
✅ **Patrón de componentes reutilizables**
✅ **Servicios consistentes** para APIs
✅ **Tipado fuerte** con TypeScript
✅ **Composables** para lógica compartida
✅ **Convenciones de nomenclatura** claras

### Para el futuro:
🚀 **Cualquier nueva vista CRUD** se puede crear en **minutos** usando los componentes y patrones establecidos
🚀 **Código escalable** y fácil de mantener
🚀 **Base sólida** para seguir creciendo el proyecto

---

**¡Felicidades!** Ahora tienes una arquitectura de frontend robusta, escalable y fácil de extender. Cada nueva funcionalidad será más rápida de implementar gracias a los componentes y patrones establecidos. 🎊
