<script setup lang="ts">
// Vista de productos
</script>

<template>
    <div class="productos-view">
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Productos</h1>
            <p class="text-gray-600">Gestiona tu inventario de productos.</p>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-semibold text-gray-900">Lista de Productos</h2>
                <button
                    class="bg-amber-200 text-black px-4 py-2 rounded-lg hover:bg-amber-100 transition-colors duration-200">
                    + Agregar Producto
                </button>
            </div>

            <div class="text-center py-12">
                <div class="text-gray-400 mb-4">
                    <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                    </svg>
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">No hay productos</h3>
                <p class="text-gray-500 mb-4">Comienza agregando tu primer producto a la tienda.</p>
                <button
                    class="bg-amber-200 text-black px-6 py-2 rounded-lg hover:bg-amber-100 transition-colors duration-200">
                    Crear Producto
                </button>
            </div>
        </div>
    </div>
</template>
