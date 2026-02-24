<script setup lang="ts">
import {
  MousePointerClick,
  Package,
  MessageCircle,
  Smartphone,
  GripVertical,
  BarChart3,
  Zap,
  Globe,
} from 'lucide-vue-next'

const services = [
  {
    icon: MousePointerClick,
    title: 'Constructor No-Code',
    subtitle: 'Editor visual drag & drop',
    description:
      'Diseña catálogos profesionales con nuestro editor visual de arrastrar y soltar. Sin conocimientos técnicos, sin código, sin límites creativos.',
    features: ['Editor visual intuitivo', 'Plantillas prediseñadas', 'Personalización total'],
    accent: GripVertical,
  },
  {
    icon: Package,
    title: 'Gestión de Inventario',
    subtitle: 'Panel de administración simple',
    description:
      'Administra tus productos y categorías desde un panel limpio y organizado. Actualiza precios, stock y descripciones en segundos.',
    features: ['Productos y categorías', 'Actualización en tiempo real', 'Organización flexible'],
    accent: BarChart3,
  },
  {
    icon: MessageCircle,
    title: 'Integración WhatsApp',
    subtitle: 'Canal de ventas directo',
    description:
      'Tus clientes pueden realizar pedidos directamente desde el catálogo vía WhatsApp. Sin intermediarios, sin comisiones, ventas directas.',
    features: ['Pedidos con un toque', 'Sin comisiones', 'Comunicación directa'],
    accent: Zap,
  },
  {
    icon: Smartphone,
    title: 'Optimización Móvil',
    subtitle: 'Experiencia mobile-first',
    description:
      'Catálogos que cargan rápido y se ven perfectos en cualquier dispositivo. Diseño responsive que se adapta automáticamente a cada pantalla.',
    features: ['Carga ultrarrápida', 'Diseño responsive', 'Experiencia nativa'],
    accent: Globe,
  },
]
</script>

<template>
  <div class="services-page">
    <!-- Hero -->
    <section class="hero-bg pt-20 pb-24 px-6">
      <div class="max-w-4xl mx-auto text-center space-y-6">
        <span class="inline-flex items-center gap-2 rounded-full bg-amber-200/10 px-4 py-1.5 text-sm text-amber-200">
          <Zap class="w-4 h-4" />
          Nuestros servicios
        </span>
        <h1 class="text-4xl sm:text-5xl font-bold text-white leading-tight">
          Todo lo que necesitas para
          <span class="text-amber-200">vender más</span>
        </h1>
        <p class="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Herramientas profesionales diseñadas para que puedas enfocarte en lo que importa: hacer
          crecer tu negocio.
        </p>
      </div>
    </section>

    <!-- Services Grid -->
    <section class="content-bg py-20 px-6">
      <div class="max-w-6xl mx-auto space-y-12">
        <div v-for="(service, index) in services" :key="service.title"
          class="card-bg rounded-xl border border-gray-800 overflow-hidden hover:border-amber-200/20 transition-colors duration-300">
          <div class="flex flex-col md:flex-row items-stretch" :class="{ 'md:flex-row-reverse': index % 2 !== 0 }">
            <!-- Content -->
            <div class="flex-1 p-8 sm:p-10 space-y-5">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-amber-200/10 flex items-center justify-center">
                  <component :is="service.icon" class="w-5 h-5 text-amber-200" />
                </div>
                <span class="text-sm text-amber-200/70 font-medium">{{ service.subtitle }}</span>
              </div>
              <h2 class="text-2xl sm:text-3xl font-bold text-white">{{ service.title }}</h2>
              <p class="text-gray-400 leading-relaxed">{{ service.description }}</p>
              <ul class="space-y-2 pt-2">
                <li v-for="feature in service.features" :key="feature"
                  class="flex items-center gap-2 text-gray-300 text-sm">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-200 shrink-0"></span>
                  {{ feature }}
                </li>
              </ul>
            </div>

            <!-- Visual accent -->
            <div class="flex-1 hidden md:flex items-center justify-center p-10 bg-amber-200/[0.03]">
              <div class="relative">
                <component :is="service.icon" class="w-24 h-24 text-amber-200/20" :stroke-width="1" />
                <component :is="service.accent" class="w-10 h-10 text-amber-200/40 absolute -bottom-2 -right-2"
                  :stroke-width="1.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="hero-bg py-20 px-6">
      <div class="max-w-3xl mx-auto text-center card-bg rounded-xl p-10 border border-gray-800 space-y-6">
        <h2 class="text-2xl sm:text-3xl font-bold text-white">
          Empieza gratis, crece sin límites
        </h2>
        <p class="text-gray-400 text-lg">
          Crea tu catálogo digital en minutos. Sin tarjeta de crédito, sin compromisos.
        </p>
        <RouterLink to="/signup">
          <button
            class="mt-2 bg-amber-200 text-black font-semibold rounded-lg px-8 py-3 hover:bg-amber-100 transition-colors cursor-pointer">
            Comenzar ahora
          </button>
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero-bg {
  background-color: #0a0a0a;
}

.content-bg {
  background-color: #111111;
}

.card-bg {
  background-color: #1a1a1a;
}
</style>
