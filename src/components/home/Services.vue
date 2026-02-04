<script setup lang="ts">
import { CodeXml, MessageCircle, Smartphone } from 'lucide-vue-next'
import ServiceCard from './ServiceCard.vue'
import Cubes from '@/components/ui/Cubes/Cubes.vue'
</script>

<template>
  <div class="service-bg py-18 min-h-screen bg-gray-900 relative overflow-hidden">
    <!-- Cubes Background -->
    <Cubes class="!absolute !inset-0 w-full h-full z-0 opacity-20" :gridSize="12" :maxAngle="25" :radius="5"
      borderStyle="1px solid #fde68a" faceColor="#1a1a1a" rippleColor="#fde68a" :rippleSpeed="3" :autoAnimate="true"
      :rippleOnClick="true" />

    <div class="text-center relative z-10 pointer-events-none">
      <h2 class="text-3xl font-bold sm:text-4xl">Todo lo que necesitas para vender más</h2>
      <p class="mx-auto pt-4 text-lg text-muted-foreground">
        Herramientas poderosas que hacen tu trabajo más fácil
      </p>
    </div>

    <!-- Grid de servicios -->
    <div class="w-full pt-16 flex justify-center px-6 relative z-10 pointer-events-none">
      <div
        class="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-md md:max-w-2xl lg:max-w-5xl w-full justify-items-center md:justify-items-stretch">
        <ServiceCard class="pointer-events-none" title="Creación sin código"
          description="Diseña catálogos profesionales con nuestro editor visual. Sin necesidad de conocimientos técnicos."
          :icon="CodeXml" />
        <ServiceCard class="pointer-events-none" title="Pedidos por WhatsApp"
          description="Tus clientes pueden realizar pedidos directamente desde el catálogo vía WhatsApp. Simple y directo."
          :icon="MessageCircle" />
        <ServiceCard class="pointer-events-none" title="Optimizado para móvil"
          description="Tu catálogo se ve perfecto en cualquier dispositivo. Diseño responsive que se adapta automáticamente."
          :icon="Smartphone" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.service-bg {
  background-color: #262626;
  color: #d1d5db;
}

/* Forzar que Cubes ocupe todo el contenedor como background */
.service-bg :deep(> div:first-child) {
  position: absolute !important;
  inset: 0 !important;
  width: 100% !important;
  height: 100% !important;
  pointer-events: auto;
}
</style>
