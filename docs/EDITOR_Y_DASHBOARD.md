# Documentación: Dashboard y Editor de Catálogo

> **Para quién es esto:** Esta guía está escrita para alguien que no tiene experiencia previa con este tipo de herramientas. Explica qué se construyó, cómo funciona internamente, cómo mantenerlo y cómo agregar nuevas funcionalidades.

---

## Tabla de contenidos

1. [Resumen general](#1-resumen-general)
2. [Archivos creados y modificados](#2-archivos-creados-y-modificados)
3. [Cómo funciona el Dashboard](#3-cómo-funciona-el-dashboard)
4. [Cómo funciona el StatCard](#4-cómo-funciona-el-statcard)
5. [Cómo funciona el Editor de catálogo](#5-cómo-funciona-el-editor-de-catálogo)
6. [Cómo se guardan y cargan los datos del editor](#6-cómo-se-guardan-y-cargan-los-datos-del-editor)
7. [Sistema de tipos del editor](#7-sistema-de-tipos-del-editor)
8. [Cómo agregar un nuevo tipo de bloque](#8-cómo-agregar-un-nuevo-tipo-de-bloque)
9. [Cómo agregar una nueva StatCard](#9-cómo-agregar-una-nueva-statcard)
10. [Patrones de código usados](#10-patrones-de-código-usados)
11. [Preguntas frecuentes y solución de errores](#11-preguntas-frecuentes-y-solución-de-errores)

---

## 1. Resumen general

Se construyeron tres funcionalidades principales:

### 1.1 StatCard (tarjeta de estadística)
Un componente reutilizable que muestra un número con un ícono, un título y opcionalmente una tendencia (%) o subtítulo. Se usa en el Dashboard para mostrar métricas de la tienda.

### 1.2 Dashboard mejorado
La vista del dashboard ahora carga datos reales de la API (productos y categorías de la tienda del usuario logueado). Muestra:
- 4 StatCards con métricas reales
- Actividad reciente basada en los últimos productos agregados
- Un panel de resumen lateral con barra de progreso y lista de categorías

### 1.3 Editor de catálogo (no-code)
Una herramienta visual que permite construir la página pública del catálogo arrastrando y soltando bloques. No se necesita escribir código. El diseño se guarda como JSON en el campo `themeSettings` de la tienda en el backend.

---

## 2. Archivos creados y modificados

```
src/
├── components/
│   ├── editor/
│   │   └── CatalogBlockRenderer.vue   ← NUEVO: renderiza cada bloque visualmente
│   └── ui/
│       └── StatCard.vue               ← NUEVO: tarjeta de estadística reutilizable
├── types/
│   └── editor.types.ts               ← NUEVO: tipos TypeScript del editor
├── api/
│   └── services/
│       ├── store.service.ts           ← MODIFICADO: se agregó updateThemeSettings()
│       └── index.ts                  ← MODIFICADO: se exporta storeService
└── views/
    ├── DashboardView.vue              ← MODIFICADO: datos reales + StatCards
    └── EditorView.vue                 ← REEMPLAZADO: editor completo
```

---

## 3. Cómo funciona el Dashboard

**Archivo:** `src/views/DashboardView.vue`

### Flujo de datos

```
Usuario se loguea
       ↓
userStore.currentUser.storeId  (ID de la tienda del usuario)
       ↓
onMounted → llama a loadProducts(storeId) y loadCategories(storeId) en paralelo
       ↓
products.value y categories.value se llenan con datos de la API
       ↓
Los computed (totalProducts, visibleProducts, etc.) se recalculan automáticamente
       ↓
Las StatCards y la actividad reciente se renderizan con los datos reales
```

### Sobre el `storeId`

El `storeId` viene del usuario logueado. Se accede a él así:

```typescript
const userStore = useUserStore()
const storeId = computed(() => userStore.currentUser?.storeId)
```

El `?.` es "optional chaining" — si `currentUser` es `null` (usuario no logueado), no da error, simplemente devuelve `undefined`.

### Visitas al catálogo

No hay un endpoint en el backend para esto todavía. Las visitas se guardan en `localStorage` del navegador con la clave `catalog_visits`. Cuando el catálogo público sea visitado, deberá ejecutarse:

```typescript
const visits = parseInt(localStorage.getItem('catalog_visits') || '0', 10)
localStorage.setItem('catalog_visits', String(visits + 1))
```

Esto se puede implementar en la página pública del catálogo cuando se construya.

### Actividad reciente

Se construye a partir de los datos ya cargados. Los productos tienen `createdAt` (fecha de creación), por lo que se ordenan del más nuevo al más viejo. Las categorías no tienen fecha en el tipo actual, así que se muestran al final sin timestamp.

```typescript
// Ordenar productos por fecha descendente y tomar los 3 más recientes
const recentProducts = [...(products.value ?? [])]
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  .slice(0, 3)
```

---

## 4. Cómo funciona el StatCard

**Archivo:** `src/components/ui/StatCard.vue`

### Props disponibles

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `title` | `string` | ✅ | Texto descriptivo arriba del número |
| `value` | `string \| number` | ✅ | El número o valor a mostrar |
| `icon` | `Component` | ✅ | Ícono de Lucide (se pasa como componente) |
| `color` | `'amber' \| 'blue' \| 'green' \| 'purple' \| 'pink' \| 'cyan' \| 'rose'` | ❌ | Color del ícono y badge. Default: `'amber'` |
| `loading` | `boolean` | ❌ | Muestra skeleton animado. Default: `false` |
| `trend` | `{ value: number, label: string }` | ❌ | Muestra porcentaje de cambio con flecha |
| `subtitle` | `string` | ❌ | Texto pequeño debajo del número |

### Cómo usarlo en cualquier vista

```vue
<script setup lang="ts">
import { Package } from 'lucide-vue-next'
import StatCard from '@/components/ui/StatCard.vue'
</script>

<template>
  <!-- Uso básico -->
  <StatCard
    title="Total de ventas"
    :value="1250"
    :icon="Package"
    color="green"
  />

  <!-- Con tendencia -->
  <StatCard
    title="Nuevos clientes"
    :value="43"
    :icon="Package"
    color="blue"
    :trend="{ value: 12, label: 'este mes' }"
  />

  <!-- Con estado de carga -->
  <StatCard
    title="Categorías"
    :value="totalCategories"
    :icon="Package"
    color="purple"
    :loading="loadingCategories"
  />
</template>
```

### Por qué el ícono se pasa como `:icon="Package"` y no como string

En Vue 3, cuando usas `<component :is="...">`, puedes pasar directamente el objeto del componente. Los íconos de Lucide son componentes Vue, así que se importan y se pasan directamente sin comillas. Esto es más eficiente que buscarlos por nombre en un objeto.

---

## 5. Cómo funciona el Editor de catálogo

**Archivo:** `src/views/EditorView.vue`

### Estructura visual

```
┌─────────────────────────────────────────────────────────────┐
│  Barra superior: título, Restablecer, Vista previa, Guardar  │
├────────────────┬──────────────────────────┬─────────────────┤
│ Panel izquierdo│       Canvas             │ Panel derecho   │
│                │                          │                 │
│ Tab: Bloques   │  [Bloque Hero]           │ Propiedades del │
│   [Hero]       │  ──────────────          │ bloque          │
│   [Productos]  │  [Grilla productos]      │ seleccionado    │
│   [Categorías] │  ──────────────          │                 │
│   [Texto]      │  [Separador]             │ Título: ____    │
│   [Banner]     │                          │ Color:  ____    │
│   [Separador]  │                          │                 │
│                │                          │                 │
│ Tab: Tema      │  ← Arrastrar aquí        │                 │
│   Colores...   │                          │                 │
└────────────────┴──────────────────────────┴─────────────────┘
```

### Cómo funciona el drag & drop con `vuedraggable`

La librería `vuedraggable` envuelve listas y permite arrastrar elementos entre ellas. Se usan dos instancias:

**Paleta (panel izquierdo):**
```vue
<draggable
  :list="paletteItems"
  :group="{ name: 'catalog-blocks', pull: 'clone', put: false }"
  :clone="cloneBlock"
  item-key="type"
  :sort="false"
>
```
- `pull: 'clone'` → cuando arrastras desde la paleta, se hace una **copia** (el original sigue en la paleta)
- `put: false` → no se puede soltar nada en la paleta
- `:sort="false"` → los elementos de la paleta no se pueden reordenar
- `:clone="cloneBlock"` → función que crea la copia con un ID único

**Canvas (área central):**
```vue
<draggable
  v-model="layout.blocks"
  :group="{ name: 'catalog-blocks', pull: true, put: true }"
  item-key="id"
  :animation="200"
>
```
- `v-model="layout.blocks"` → el array de bloques se actualiza automáticamente al reordenar
- `pull: true, put: true` → se puede arrastrar hacia afuera y recibir elementos

**El mismo `name: 'catalog-blocks'`** en ambos grupos es lo que permite mover elementos entre ellos.

### Cómo funciona la selección de bloques

Cuando haces click en un bloque del canvas:

```typescript
function selectBlock(id: string) {
  // Si ya está seleccionado → deseleccionar. Si no → seleccionar.
  selectedBlockId.value = id === selectedBlockId.value ? null : id
}
```

El bloque seleccionado aparece con borde ámbar. El panel derecho muestra automáticamente el formulario correcto según el `type` del bloque:

```typescript
// Computeds que devuelven null si el bloque seleccionado no es de ese tipo
const heroProps = computed(() =>
  selectedBlock.value?.type === 'hero'
    ? (selectedBlock.value.props as HeroBlockProps)
    : null
)
```

En el template, cada sección de configuración usa `v-if="heroProps"` — si `heroProps` es null, esa sección no se muestra.

### Cómo funciona la edición de propiedades en tiempo real

Cuando cambias un campo en el panel derecho:

```typescript
function setSelectedProp(key: string, value: any) {
  if (selectedBlock.value) {
    (selectedBlock.value.props as any)[key] = value
    hasUnsavedChanges.value = true
  }
}
```

Esto muta directamente el objeto de props del bloque seleccionado. Como Vue 3 usa reactividad profunda, el canvas se actualiza instantáneamente mostrando el cambio.

### Vista previa

El botón "Vista previa" activa `previewMode = true`, lo que:
1. Oculta los paneles izquierdo y derecho
2. Aplica el color de fondo del tema al canvas
3. Quita los controles (handle de arrastre, botón eliminar) de cada bloque
4. Muestra una etiqueta "Vista previa del catálogo"

---

## 6. Cómo se guardan y cargan los datos del editor

### Guardar

El layout completo (todos los bloques con sus props + configuración del tema) se serializa a JSON y se envía al backend:

```typescript
async function saveLayout() {
  const json = JSON.stringify(layout.value)
  // Llama a PATCH /stores/{storeId}/theme con { themeSettings: json }
  await saveTheme(storeId.value, json)
}
```

El JSON resultante tiene esta estructura:

```json
{
  "version": 1,
  "blocks": [
    {
      "id": "block-hero-1234567890",
      "type": "hero",
      "props": {
        "title": "Bienvenido a nuestra tienda",
        "subtitle": "...",
        "bgColor": "#1f2937",
        "textColor": "#fde68a",
        "ctaText": "Ver productos",
        "ctaVisible": true,
        "alignment": "center"
      }
    }
  ],
  "theme": {
    "primaryColor": "#fde68a",
    "accentColor": "#d97706",
    "bgColor": "#111827",
    "cardBgColor": "#1f2937",
    "fontFamily": "Inter, sans-serif",
    "borderRadius": "md"
  }
}
```

### Cargar

Al montar la vista del editor, se carga la tienda del backend y se intenta parsear `themeSettings`:

```typescript
onMounted(async () => {
  await loadStore(storeId.value)

  if (storeData.value?.themeSettings) {
    try {
      const parsed = JSON.parse(storeData.value.themeSettings)
      if (parsed?.blocks) {
        layout.value = parsed  // ← restaura el layout guardado
      }
    } catch {
      // Si el JSON está corrupto, usa el layout por defecto
    }
  }
})
```

### Endpoint del backend

El método `updateThemeSettings` usa:
```
PATCH /stores/{storeId}/theme
Body: { "themeSettings": "...json string..." }
```

> ⚠️ **Importante:** Si tu backend usa una URL diferente (por ejemplo `PUT /stores/{storeId}` con todo el body de la tienda), debes cambiar solo la línea en `src/api/services/store.service.ts:41`.

---

## 7. Sistema de tipos del editor

**Archivo:** `src/types/editor.types.ts`

Este archivo define la "forma" de todos los datos del editor en TypeScript. Es la fuente de verdad para saber qué propiedades tiene cada tipo de bloque.

### Jerarquía de tipos

```
CatalogLayout               ← el layout completo que se guarda
├── version: number
├── theme: CatalogTheme     ← configuración visual global
│   ├── primaryColor
│   ├── accentColor
│   ├── bgColor
│   ├── cardBgColor
│   ├── fontFamily
│   └── borderRadius
└── blocks: EditorBlock[]   ← array de bloques en orden
    └── EditorBlock
        ├── id: string      ← identificador único (ej: "block-hero-1234")
        ├── type: BlockType ← qué tipo de bloque es
        └── props: BlockProps ← propiedades específicas del tipo
```

### BlockType y sus props

```typescript
// Cada tipo tiene su interfaz de props correspondiente:

'hero'           → HeroBlockProps
'product-grid'   → ProductGridBlockProps
'category-grid'  → CategoryGridBlockProps
'text-block'     → TextBlockProps
'banner'         → BannerBlockProps
'divider'        → DividerBlockProps
```

### BLOCK_DEFINITIONS

Es un array constante que define todos los tipos de bloques disponibles en la paleta. Cada entrada tiene:

```typescript
{
  type: 'hero',                          // identificador interno
  label: 'Hero',                         // nombre visible en la paleta
  description: 'Cabecera principal...', // descripción breve
  icon: 'Sparkles',                      // nombre del ícono de Lucide
  defaultProps: { ... }                  // props que tiene el bloque al agregarlo
}
```

---

## 8. Cómo agregar un nuevo tipo de bloque

Supongamos que quieres agregar un bloque de tipo `'image-banner'` que muestra una imagen con texto encima.

### Paso 1: Definir el tipo en `editor.types.ts`

```typescript
// Agregar la interfaz de props
export interface ImageBannerBlockProps {
  imageUrl: string
  overlayText: string
  overlayColor: string
  height: 'sm' | 'md' | 'lg'
}

// Agregar al tipo BlockType
export type BlockType =
  | 'hero'
  | 'product-grid'
  | 'category-grid'
  | 'text-block'
  | 'divider'
  | 'banner'
  | 'image-banner'  // ← agregar aquí

// Agregar al tipo unión BlockProps
export type BlockProps =
  | HeroBlockProps
  | ProductGridBlockProps
  | CategoryGridBlockProps
  | TextBlockProps
  | DividerBlockProps
  | BannerBlockProps
  | ImageBannerBlockProps  // ← agregar aquí

// Agregar a BLOCK_DEFINITIONS
export const BLOCK_DEFINITIONS: BlockDefinition[] = [
  // ... bloques existentes ...
  {
    type: 'image-banner',
    label: 'Imagen con texto',
    description: 'Imagen de fondo con texto superpuesto',
    icon: 'Image',          // nombre del ícono en lucide-vue-next
    defaultProps: {
      imageUrl: '',
      overlayText: 'Texto sobre la imagen',
      overlayColor: 'rgba(0,0,0,0.5)',
      height: 'md',
    } as ImageBannerBlockProps,
  },
]
```

### Paso 2: Agregar el renderizado en `CatalogBlockRenderer.vue`

Agregar el nuevo bloque como `v-else-if` antes del cierre del template:

```vue
<!-- ── IMAGE BANNER ────────────────────────────────────────── -->
<div
  v-else-if="block.type === 'image-banner'"
  :style="{
    backgroundImage: `url(${(block.props as ImageBannerBlockProps).imageUrl})`,
    height: { sm: '150px', md: '250px', lg: '350px' }[(block.props as ImageBannerBlockProps).height]
  }"
  class="relative bg-cover bg-center rounded-lg overflow-hidden flex items-center justify-center"
>
  <div
    class="absolute inset-0"
    :style="{ backgroundColor: (block.props as ImageBannerBlockProps).overlayColor }"
  />
  <p class="relative text-white text-2xl font-bold text-center px-4">
    {{ (block.props as ImageBannerBlockProps).overlayText }}
  </p>
</div>
```

> También necesitas importar `ImageBannerBlockProps` en el `<script setup>` del archivo.

### Paso 3: Agregar el formulario de configuración en `EditorView.vue`

**3a.** Importar el nuevo tipo:
```typescript
import type { ..., ImageBannerBlockProps } from '@/types/editor.types'
```

**3b.** Agregar el computed helper:
```typescript
const imageBannerProps = computed(() =>
  selectedBlock.value?.type === 'image-banner'
    ? (selectedBlock.value.props as ImageBannerBlockProps)
    : null
)
```

**3c.** Agregar el ícono al mapa:
```typescript
import { Image } from 'lucide-vue-next'

const iconComponents: Record<string, any> = {
  // ... iconos existentes ...
  Image,
}
```

**3d.** Agregar el formulario en el panel derecho (dentro de `<div v-else class="flex-1 overflow-y-auto p-3 space-y-4">`):
```vue
<!-- ─ IMAGE BANNER settings ─────────────── -->
<template v-if="imageBannerProps">
  <div class="space-y-3">
    <div>
      <label class="settings-label">URL de la imagen</label>
      <input
        type="url"
        :value="imageBannerProps.imageUrl"
        @input="setSelectedProp('imageUrl', ($event.target as HTMLInputElement).value)"
        class="settings-input"
        placeholder="https://..."
      />
    </div>
    <div>
      <label class="settings-label">Texto superpuesto</label>
      <input
        type="text"
        :value="imageBannerProps.overlayText"
        @input="setSelectedProp('overlayText', ($event.target as HTMLInputElement).value)"
        class="settings-input"
      />
    </div>
    <div>
      <label class="settings-label">Altura</label>
      <select
        :value="imageBannerProps.height"
        @change="setSelectedProp('height', ($event.target as HTMLSelectElement).value)"
        class="settings-input"
      >
        <option value="sm">Pequeña</option>
        <option value="md">Mediana</option>
        <option value="lg">Grande</option>
      </select>
    </div>
  </div>
</template>
```

### Eso es todo — ¡4 pasos y el nuevo bloque funciona!

---

## 9. Cómo agregar una nueva StatCard

Si quieres agregar una nueva métrica al dashboard (por ejemplo "Pedidos pendientes"), simplemente agrega una StatCard más en `DashboardView.vue`:

**Paso 1:** Cargar los datos necesarios (si vienen de la API):
```typescript
const {
  data: orders,
  loading: loadingOrders,
  execute: loadOrders,
} = useApi<OrderResponse[], [number]>(orderService.getByStoreId)

// En onMounted:
await Promise.all([
  loadProducts(storeId.value),
  loadCategories(storeId.value),
  loadOrders(storeId.value),  // ← agregar
])
```

**Paso 2:** Crear el computed:
```typescript
const pendingOrders = computed(() =>
  orders.value?.filter((o) => o.status === 'PENDING').length ?? 0
)
```

**Paso 3:** Agregar la StatCard en el template:
```vue
<StatCard
  title="Pedidos pendientes"
  :value="pendingOrders"
  :icon="ShoppingCart"
  color="rose"
  :loading="loadingOrders"
/>
```

**Paso 4:** Cambiar el grid de 4 a 5 columnas si es necesario:
```html
<!-- Cambiar lg:grid-cols-4 por lg:grid-cols-5 -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
```

---

## 10. Patrones de código usados

### `useApi` — carga de datos

```typescript
// Declara la llamada sin ejecutarla todavía
const {
  data: products,   // ref que contiene los datos (null hasta que se carga)
  loading,          // ref boolean que es true mientras carga
  execute: loadProducts, // función para disparar la llamada
} = useApi<ProductResponse[], [number]>(productService.getByStoreId)

// La función tipada: <TipoDeRespuesta, [TiposDeArgumentos]>
// El segundo argumento de useApi es la función del servicio

// Ejecutar en el ciclo de vida
onMounted(async () => {
  await loadProducts(storeId.value) // ← pasar el argumento aquí
})
```

### `useApiMutation` — guardar / crear / eliminar

```typescript
const { mutate: saveTheme, loading: savingTheme } = useApiMutation<
  StoreResponse,          // tipo de respuesta
  [number, string]        // tipos de los argumentos
>(storeService.updateThemeSettings)

// Llamar con los argumentos
const result = await saveTheme(storeId, jsonString)
if (result) { /* éxito */ }
else { /* error */ }
```

### `computed` — valores derivados reactivos

```typescript
// Se recalcula automáticamente cuando products.value cambia
const totalProducts = computed(() => products.value?.length ?? 0)

// El ?? 0 significa: "si el resultado es null/undefined, usar 0"
// El ?. es optional chaining: "si products.value es null, no des error"
```

### `ref` — estado local reactivo

```typescript
const showModal = ref(false)   // boolean
const selectedId = ref<string | null>(null)  // string o null

// Para leer: selectedId.value
// Para escribir: selectedId.value = 'nuevo-id'
```

### `watch` — ejecutar código cuando algo cambia

```typescript
// Observar el tema del layout y marcar cambios sin guardar
watch(
  () => layout.value.theme,  // qué observar
  () => { hasUnsavedChanges.value = true },  // qué hacer
  { deep: true }  // deep: observar cambios dentro del objeto, no solo la referencia
)
```

---

## 11. Preguntas frecuentes y solución de errores

### ❓ "No se cargan los datos en el dashboard"

**Causa probable:** El usuario no tiene `storeId` en su perfil.

**Cómo revisar:** Abre las DevTools del navegador (F12), ve a la consola. Si ves un error de API, revisa la pestaña Network para ver qué está respondiendo el backend.

**En el código:** El dashboard no carga datos si `storeId` es undefined:
```typescript
onMounted(async () => {
  if (storeId.value) {  // ← si storeId es undefined, no hace nada
    await Promise.all([...])
  }
})
```

---

### ❓ "El botón Guardar del editor no funciona"

**Causa probable:** El endpoint `PATCH /stores/{id}/theme` no existe en el backend.

**Solución:** Coordinar con el backend para implementar el endpoint, o adaptar la URL en `store.service.ts`:

```typescript
// Línea 41 en store.service.ts — ajustar según lo que tenga el backend
async updateThemeSettings(storeId: number, themeSettings: string): Promise<StoreResponse> {
  // Opción A: endpoint dedicado (actual)
  const response = await apiClient.patch<StoreResponse>(`${baseURL}/${storeId}/theme`, { themeSettings })

  // Opción B: endpoint de actualización general de la tienda
  // const response = await apiClient.put<StoreResponse>(`${baseURL}/${storeId}`, { themeSettings })

  return response.data
}
```

---

### ❓ "Los bloques no se arrastran correctamente"

**Causa probable:** El `name` del grupo no coincide entre paleta y canvas.

**Solución:** Verificar que ambos usen el mismo nombre:
```typescript
const paletteGroup = { name: 'catalog-blocks', pull: 'clone', put: false }
const canvasGroup  = { name: 'catalog-blocks', pull: true,    put: true  }
//                          ↑ deben ser idénticos ↑
```

---

### ❓ "Error de Tailwind: `Cannot apply unknown utility class`"

**Causa:** Se usa `@apply` en un bloque `<style scoped>` sin la directiva `@reference`.

**Solución:** Agregar `@reference "tailwindcss"` al inicio del bloque de estilos:
```css
<style scoped>
@reference "tailwindcss";

.mi-clase {
  @apply text-sm text-gray-400;   /* ahora funciona */
}
</style>
```

---

### ❓ "¿Cómo cambiar el layout por defecto?"

Modificar el objeto `DEFAULT_CATALOG_LAYOUT` en `src/types/editor.types.ts`. Solo afecta a tiendas que **nunca han guardado** su catálogo (tiendas nuevas o después de "Restablecer").

---

### ❓ "¿Las visitas al catálogo son reales?"

Por ahora no. Son un contador en `localStorage` del navegador del usuario administrador. Para tener visitas reales necesitarías:

1. Un endpoint en el backend (ej: `POST /stores/{id}/visit`) que registre cada visita
2. Llamar a ese endpoint desde la página pública del catálogo cuando un cliente la visita
3. Un endpoint para consultar el total (ej: `GET /stores/{id}/stats`)
4. Actualizar el Dashboard para usar ese endpoint en lugar de `localStorage`

---

## Resumen rápido de archivos

| Archivo | Cuándo modificarlo |
|---|---|
| `editor.types.ts` | Para agregar/modificar tipos de bloques o propiedades del tema |
| `CatalogBlockRenderer.vue` | Para cambiar cómo se ve un bloque en el canvas/preview |
| `EditorView.vue` | Para cambiar el formulario de configuración de un bloque o la UI del editor |
| `DashboardView.vue` | Para agregar/quitar métricas o cambiar la actividad reciente |
| `StatCard.vue` | Para cambiar el diseño visual de las tarjetas de estadística |
| `store.service.ts` | Para adaptar el endpoint de guardado del tema |
