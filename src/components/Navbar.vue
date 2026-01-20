<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="my-bg shadow-lg fixed top-0 w-full z-50">
    <div class="w-full mx-auto px-4">
      <div class="flex items-center h-16">
        <!-- Logo - Izquierda -->
        <div class="shrink-0">
          <RouterLink to="/">
            <img class="h-10 w-auto" src="../../public/kiosky-logo.png" alt="kiosky-logo" />
          </RouterLink>
        </div>

        <!-- Enlaces de navegación - Centro -->
        <div class="flex-1 flex justify-center">
          <div class="flex space-x-6">
            <RouterLink to="/"
              class="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition">
              Inicio
            </RouterLink>
            <RouterLink to="/about"
              class="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition">
              Acerca de
            </RouterLink>
            <a href="#" class="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition">
              Servicios
            </a>
            <a href="#" class="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition">
              Contacto
            </a>
          </div>
        </div>

        <!-- Botones de usuario - Derecha -->
        <div class="shrink-0 flex space-x-2">
          <RouterLink to="/signup"
            class="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition">
            Registrarse
          </RouterLink>
          <RouterLink to="/login"
            class="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition">
            Login
          </RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.my-bg {
  background: #0a0a0a;
}

.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>
