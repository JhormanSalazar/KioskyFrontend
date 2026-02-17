<script setup lang="ts">
import { RouterView } from 'vue-router'
import Sidebar from '@/components/layout/Sidebar.vue'
</script>

<template>
  <div class="dashboard-layout min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <div class="pl-64 min-h-screen">
      <main class="p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.dashboard-layout {
  background-color: #F9FAFB;
}
</style>
