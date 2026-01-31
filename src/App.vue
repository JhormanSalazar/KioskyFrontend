<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'
import NavBar from '@/components/Navbar.vue';
import Footer from '@/components/home/Footer.vue';
import NotificationToast from '@/components/ui/NotificationToast.vue';
import ConfirmationModal from '@/components/ui/ConfirmationModal.vue';

const route = useRoute()

// Rutas donde se muestra el navbar y footer público
const publicRoutes = ['home', 'about', 'login', 'signup']
const isPublicRoute = computed(() => publicRoutes.includes(route.name as string))
</script>

<template>
  <div id="app">
    <!-- Layout público (Home, Login, Signup) -->
    <template v-if="isPublicRoute">
      <div class="pt-16">
        <NavBar />
        <main class="min-h-screen bg-gray-100 pb-0">
          <RouterView />
        </main>
        <Footer />
      </div>
    </template>

    <!-- Layout del dashboard (rutas protegidas) -->
    <template v-else>
      <RouterView />
    </template>
    <!-- Sistema de notificaciones global -->
    <NotificationToast />
    <ConfirmationModal />
  </div>
</template>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
</style>
