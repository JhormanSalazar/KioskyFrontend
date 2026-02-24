<script setup lang="ts">
import { Sparkles, CodeXml, MessageCircle, Smartphone, UserPlus, Palette, Share2 } from 'lucide-vue-next'

const steps = [
  {
    number: '1',
    icon: UserPlus,
    title: 'Regístrate',
    description: 'Crea tu cuenta gratis en segundos. Sin tarjeta de crédito, sin compromisos.',
  },
  {
    number: '2',
    icon: Palette,
    title: 'Diseña tu catálogo',
    description: 'Usa nuestro editor visual para agregar productos, categorías y personalizar tu tienda.',
  },
  {
    number: '3',
    icon: Share2,
    title: 'Comparte y vende',
    description: 'Comparte el enlace de tu catálogo y recibe pedidos directamente por WhatsApp.',
  },
]

const features = [
  {
    icon: CodeXml,
    title: 'Creación sin código',
    description:
      'Diseña catálogos profesionales con nuestro editor visual. Sin necesidad de conocimientos técnicos.',
  },
  {
    icon: MessageCircle,
    title: 'Pedidos por WhatsApp',
    description:
      'Tus clientes pueden realizar pedidos directamente desde el catálogo vía WhatsApp. Simple y directo.',
  },
  {
    icon: Smartphone,
    title: 'Optimizado para móvil',
    description:
      'Tu catálogo se ve perfecto en cualquier dispositivo. Diseño responsive que se adapta automáticamente.',
  },
]
</script>

<template>
  <div class="home-page">
    <!-- Hero -->
    <section class="hero-bg pt-20 pb-24 px-6">
      <div class="max-w-4xl mx-auto text-center space-y-6">
        <h1 class="text-4xl sm:text-5xl font-bold text-white leading-tight">
          Crea tu catálogo digital
          <span class="text-amber-200">sin código</span>
        </h1>
        <p class="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          La plataforma más fácil para crear catálogos profesionales. Recibe pedidos por WhatsApp y
          llega a más clientes con una experiencia optimizada para móvil.
        </p>
        <div class="flex gap-4 justify-center pt-2">
          <RouterLink to="/signup">
            <button
              class="bg-amber-200 text-black font-semibold rounded-lg px-8 py-3 hover:bg-amber-100 transition-colors cursor-pointer"
            >
              Comenzar
            </button>
          </RouterLink>
          <RouterLink to="/login">
            <button
              class="border border-gray-700 text-gray-300 font-medium rounded-lg px-8 py-3 hover:border-amber-200/50 hover:text-amber-200 transition-colors cursor-pointer"
            >
              Inicia Sesión
            </button>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Cómo funciona -->
    <section class="content-bg py-20 px-6">
      <div class="max-w-5xl mx-auto">
        <div class="text-center space-y-4 mb-14">
          <h2 class="text-3xl sm:text-4xl font-bold text-white">
            Cómo <span class="text-amber-200">funciona</span>
          </h2>
          <p class="text-lg text-gray-400 max-w-2xl mx-auto">
            Tres pasos simples para tener tu catálogo listo
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <!-- Línea conectora (solo desktop) -->
          <div class="hidden md:block absolute top-10 left-[20%] right-[20%] border-t border-dashed border-gray-700"></div>

          <div
            v-for="step in steps"
            :key="step.number"
            class="flex flex-col items-center text-center space-y-4 relative"
          >
            <div
              class="w-20 h-20 rounded-full bg-amber-200/10 border-2 border-amber-200/30 flex items-center justify-center relative z-10"
            >
              <component :is="step.icon" class="w-8 h-8 text-amber-200" />
            </div>
            <span class="text-sm font-bold text-amber-200">Paso {{ step.number }}</span>
            <h3 class="text-xl font-semibold text-white">{{ step.title }}</h3>
            <p class="text-gray-400 text-sm leading-relaxed max-w-xs">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="hero-bg py-20 px-6">
      <div class="max-w-5xl mx-auto">
        <div class="text-center space-y-4 mb-14">
          <h2 class="text-3xl sm:text-4xl font-bold text-white">
            Todo lo que necesitas para
            <span class="text-amber-200">vender más</span>
          </h2>
          <p class="text-lg text-gray-400 max-w-2xl mx-auto">
            Herramientas poderosas que hacen tu trabajo más fácil
          </p>
        </div>

        <div class="grid gap-8 grid-cols-1 md:grid-cols-3">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="card-bg rounded-xl border border-gray-800 p-8 space-y-4 hover:border-amber-200/20 transition-colors duration-300"
          >
            <div
              class="w-10 h-10 rounded-lg bg-amber-200/10 flex items-center justify-center"
            >
              <component :is="feature.icon" class="w-5 h-5 text-amber-200" />
            </div>
            <h3 class="text-lg font-semibold text-white">{{ feature.title }}</h3>
            <p class="text-gray-400 text-sm leading-relaxed">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="content-bg py-20 px-6">
      <div
        class="max-w-3xl mx-auto text-center card-bg rounded-xl p-10 border border-gray-800 space-y-6"
      >
        <h2 class="text-2xl sm:text-3xl font-bold text-white">
          Empieza gratis, crece sin límites
        </h2>
        <p class="text-gray-400 text-lg">
          Crea tu catálogo digital en minutos. Sin tarjeta de crédito, sin compromisos.
        </p>
        <RouterLink to="/signup">
          <button
            class="mt-2 bg-amber-200 text-black font-semibold rounded-lg px-8 py-3 hover:bg-amber-100 transition-colors cursor-pointer"
          >
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
