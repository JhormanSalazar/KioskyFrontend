<script setup lang="ts">
// Vista de categorías
</script>

<template>
    <div class="categorias-view">
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Categorías</h1>
            <p class="text-gray-600">Organiza tus productos en categorías.</p>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-semibold text-gray-900">Lista de Categorías</h2>
                <button
                    class="bg-amber-200 text-black px-4 py-2 rounded-lg hover:bg-amber-100 transition-colors duration-200">
                    + Agregar Categoría
                </button>
            </div>

            <div class="text-center py-12">
                <div class="text-gray-400 mb-4">
                    <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10">
                        </path>
                    </svg>
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">No hay categorías</h3>
                <p class="text-gray-500 mb-4">Crea categorías para organizar mejor tus productos.</p>
                <button
                    class="bg-amber-200 text-black px-6 py-2 rounded-lg hover:bg-amber-100 transition-colors duration-200">
                    Crear Categoría
                </button>
            </div>
        </div>
    </div>
</template>
