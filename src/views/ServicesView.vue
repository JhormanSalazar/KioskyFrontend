<script setup lang="ts">
import { ref } from 'vue'
import {
  MousePointerClick,
  Package,
  MessageCircle,
  Smartphone,
  GripVertical,
  BarChart3,
  Zap,
  Globe,
  ChevronDown,
} from 'lucide-vue-next'

const openFaq = ref<number | null>(null)

function toggleFaq(index: number) {
  openFaq.value = openFaq.value === index ? null : index
}

const faqs = [
  {
    question: '¿Es gratis crear un catálogo?',
    answer:
      'Sí, puedes crear tu catálogo digital de forma completamente gratuita. No necesitas tarjeta de crédito para empezar. Ofrecemos un plan gratuito con todas las funcionalidades básicas para que puedas probar la plataforma sin compromisos.',
  },
  {
    question: '¿Cómo recibo los pedidos de mis clientes?',
    answer:
      'Los pedidos se envían directamente a tu WhatsApp. Cuando un cliente selecciona productos de tu catálogo y confirma su pedido, se genera automáticamente un mensaje de WhatsApp con el detalle completo del pedido, incluyendo productos, cantidades y total.',
  },
  {
    question: '¿Necesito conocimientos técnicos?',
    answer:
      'No, Kiosky está diseñado para que cualquier persona pueda crear su catálogo sin escribir una sola línea de código. Nuestro editor visual de arrastrar y soltar te permite diseñar tu tienda de forma intuitiva.',
  },
  {
    question: '¿Puedo personalizar el diseño de mi catálogo?',
    answer:
      'Sí, puedes personalizar colores, organizar productos por categorías, añadir imágenes y descripciones. Nuestro editor te da control total sobre cómo se ve tu catálogo para que se adapte a la identidad de tu marca.',
  },
  {
    question: '¿Mi catálogo se ve bien en celulares?',
    answer:
      'Absolutamente. Todos los catálogos están optimizados para dispositivos móviles de forma automática. El diseño responsive se adapta a cualquier tamaño de pantalla, ofreciendo una experiencia nativa tanto en celulares como en tablets y computadoras.',
  },
]

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

    <!-- FAQ -->
    <section class="hero-bg py-20 px-6">
      <div class="max-w-3xl mx-auto">
        <div class="text-center space-y-4 mb-14">
          <h2 class="text-3xl sm:text-4xl font-bold text-white">
            Preguntas <span class="text-amber-200">frecuentes</span>
          </h2>
          <p class="text-lg text-gray-400">
            Resolvemos tus dudas antes de empezar
          </p>
        </div>

        <div class="space-y-3">
          <div
            v-for="(faq, index) in faqs"
            :key="index"
            class="card-bg rounded-xl border border-gray-800 overflow-hidden transition-colors duration-300"
            :class="{ 'border-amber-200/20': openFaq === index }"
          >
            <button
              class="w-full flex items-center justify-between p-6 text-left cursor-pointer"
              @click="toggleFaq(index)"
            >
              <span class="text-white font-medium pr-4">{{ faq.question }}</span>
              <ChevronDown
                class="w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300"
                :class="{ 'rotate-180 text-amber-200': openFaq === index }"
              />
            </button>
            <div
              class="overflow-hidden transition-all duration-300"
              :class="openFaq === index ? 'max-h-60 pb-6' : 'max-h-0'"
            >
              <p class="px-6 text-gray-400 text-sm leading-relaxed">{{ faq.answer }}</p>
            </div>
          </div>
        </div>
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
