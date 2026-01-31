<script setup lang="ts">
// Vista de configuración
</script>

<template>
    <div class="configuracion-view">
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Configuración</h1>
            <p class="text-gray-600">Ajusta la configuración de tu tienda y cuenta.</p>
        </div>

        <div class="space-y-6">
            <!-- Perfil -->
            <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-xl font-semibold text-gray-900 mb-4">Perfil</h2>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                        <input type="text" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="Tu nombre">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" class="w-full p-3 border border-gray-300 rounded-lg"
                            placeholder="tu@email.com">
                    </div>
                    <button
                        class="bg-amber-200 text-black px-4 py-2 rounded-lg hover:bg-amber-100 transition-colors duration-200">
                        Guardar Cambios
                    </button>
                </div>
            </div>

            <!-- Tienda -->
            <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-xl font-semibold text-gray-900 mb-4">Configuración de Tienda</h2>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Nombre de la tienda</label>
                        <input type="text" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="Mi Tienda">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Dominio</label>
                        <input type="text" class="w-full p-3 border border-gray-300 rounded-lg"
                            placeholder="mitienda.kiosky.com">
                    </div>
                    <button
                        class="bg-amber-200 text-black px-4 py-2 rounded-lg hover:bg-amber-100 transition-colors duration-200">
                        Actualizar Tienda
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
