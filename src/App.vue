<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from '@/components/Navbar.vue';
import Footer from '@/components/home/Footer.vue';
</script>

<template>
  <div id="app" class="pt-16">
    <NavBar />
    <main class="min-h-screen bg-gray-100 pb-0">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
</style>
