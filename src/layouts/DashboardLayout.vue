<script setup lang="ts">
import { RouterView } from 'vue-router'
import Sidebar from '@/components/layout/Sidebar.vue'
import DotGrid from '@/components/ui/DotGrid.vue'
</script>

<template>
  <div class="dashboard-layout min-h-screen">
    <!-- Background animado - fijo en toda la pantalla -->
    <div class="dot-grid-container">
      <DotGrid :dot-size="4" :gap="24" base-color="#374151" active-color="#fde68a" :proximity="120" :speed-trigger="80"
        :shock-radius="200" :shock-strength="3" :max-speed="5000" :resistance="750" :return-duration="1.5" />
    </div>

    <!-- Sidebar (ya es fixed con z-40) -->
    <Sidebar />

    <!-- Main Content -->
    <div class="pl-64 min-h-screen relative z-10">
      <main class="p-4">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.dashboard-layout {
  background-color: #0a0a0a;
}

.dot-grid-container {
  position: fixed;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>
