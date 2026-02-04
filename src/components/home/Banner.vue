<script setup lang="ts">
import MetaBalls from '@/components/ui/MetaBalls/MetaBalls.vue';
</script>

<template>
  <div class="banner-bg w-full min-h-[500px] pt-20 pb-24 flex justify-center items-center relative overflow-hidden">
    <MetaBalls class="!absolute !inset-0 w-full h-full z-0 opacity-30" color="#27FF64" :speed="0.3"
      :enableMouseInteraction="true" :hoverSmoothness="0.05" :animationSize="30" :ballCount="15" :clumpFactor="1"
      :cursorBallSize="3" cursorBallColor="#27FF64" :enableTransparency="true" mixBlendMode="screen" />
    <div class="px-8 gap-y-8 flex flex-col max-w-4xl text-green-100 text-center relative z-10 pointer-events-none">
      <div class="relative overflow-hidden">
        <h1 class="text-5xl py-1 drop-shadow-lg">Crea tu catálogo digital <b>sin código</b></h1>
      </div>
      <div>
        <p class="text-2xl drop-shadow-md">
          La plataforma más fácil para crear catálogos profesionales. Recibe pedidos por WhatsApp y
          llega a más clientes con una experiencia optimizada para móvil.
        </p>
      </div>
      <div class="flex gap-4 justify-center text-black">
        <RouterLink to="/signup" class="pointer-events-auto">
          <button class="bg-amber-200 rounded-md px-4 py-2 hover:bg-amber-100 cursor-pointer">Comenzar</button>
        </RouterLink>
        <RouterLink to="/login" class="pointer-events-auto">
          <button class="bg-amber-100 rounded-md px-4 py-2 hover:bg-amber-50 cursor-pointer">Inicia Sesión</button>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.banner-bg {
  background-color: #0a0a0a;
}

/* Forzar que MetaBalls ocupe todo el contenedor como background */
.banner-bg :deep(> div:first-child) {
  position: absolute !important;
  inset: 0 !important;
  width: 100% !important;
  height: 100% !important;
  pointer-events: auto;
}

.banner-bg :deep(> div:first-child canvas) {
  width: 100% !important;
  height: 100% !important;
}
</style>
