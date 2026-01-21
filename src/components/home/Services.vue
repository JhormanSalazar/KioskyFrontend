<script setup lang="ts">
import { Code, CodeXml, MessageCircle, Smartphone } from 'lucide-vue-next'
import ServiceCard from './ServiceCard.vue'
</script>

<template>
  <div class="service-bg py-18 min-h-screen">
    <div class="text-center">
      <h2 class="text-3xl font-bold sm:text-4xl">Todo lo que necesitas para vender más</h2>
      <p class="mx-auto pt-4 text-lg text-muted-foreground">
        Herramientas poderosas que hacen tu trabajo más fácil
      </p>
    </div>

    <!-- Grid de servicios -->
    <div class="w-full pt-16 flex justify-center px-6">
      <div
        class="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-md md:max-w-2xl lg:max-w-5xl w-full justify-items-center md:justify-items-stretch">
        <ServiceCard title="Creación sin código"
          description="Diseña catálogos profesionales con nuestro editor visual. Sin necesidad de conocimientos técnicos."
          :icon="CodeXml" />
        <ServiceCard title="Pedidos por WhatsApp"
          description="Tus clientes pueden realizar pedidos directamente desde el catálogo vía WhatsApp. Simple y directo."
          :icon="MessageCircle" />
        <ServiceCard title="Optimizado para móvil"
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
</style>
