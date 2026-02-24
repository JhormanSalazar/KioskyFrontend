<script setup lang="ts">
import { Target, Lightbulb, Heart, Rocket, Users, Gift } from 'lucide-vue-next'

const values = [
  {
    icon: Lightbulb,
    title: 'Simplicidad',
    description:
      'Herramientas intuitivas que cualquier persona puede usar, sin importar su nivel técnico.',
  },
  {
    icon: Users,
    title: 'Empoderamiento',
    description:
      'Damos a los emprendedores el control total sobre su presencia digital y sus ventas.',
  },
  {
    icon: Gift,
    title: 'Gratuidad',
    description:
      'Creemos que las herramientas digitales esenciales deben estar al alcance de todos, sin costo.',
  },
]
</script>

<template>
  <div class="about-page">
    <!-- Hero -->
    <section class="hero-bg pt-20 pb-24 px-6">
      <div class="max-w-4xl mx-auto text-center space-y-6">
        <span class="inline-flex items-center gap-2 rounded-full bg-amber-200/10 px-4 py-1.5 text-sm text-amber-200">
          <Heart class="w-4 h-4" />
          Nuestra historia
        </span>
        <h1 class="text-4xl sm:text-5xl font-bold text-white leading-tight">
          Democratizamos el acceso a herramientas
          <span class="text-amber-200">digitales</span>
        </h1>
        <p class="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Kiosky nace con un propósito claro: eliminar las barreras técnicas y de costos que impiden
          a los pequeños negocios tener presencia digital profesional.
        </p>
      </div>
    </section>

    <!-- Misión y Propósito -->
    <section class="content-bg py-20 px-6">
      <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Misión -->
        <div class="card-bg rounded-xl p-8 space-y-4 border border-gray-800">
          <div class="w-12 h-12 rounded-lg bg-amber-200/10 flex items-center justify-center">
            <Target class="w-6 h-6 text-amber-200" />
          </div>
          <h2 class="text-2xl font-bold text-white">Nuestra Misión</h2>
          <p class="text-gray-400 leading-relaxed">
            Democratizar el acceso a herramientas digitales para pequeños negocios. Queremos que cada
            emprendedor, sin importar su presupuesto o conocimientos técnicos, pueda crear un
            catálogo digital profesional y vender sus productos en línea.
          </p>
        </div>

        <!-- Propósito -->
        <div class="card-bg rounded-xl p-8 space-y-4 border border-gray-800">
          <div class="w-12 h-12 rounded-lg bg-amber-200/10 flex items-center justify-center">
            <Rocket class="w-6 h-6 text-amber-200" />
          </div>
          <h2 class="text-2xl font-bold text-white">Nuestro Propósito</h2>
          <p class="text-gray-400 leading-relaxed">
            Kiosky nació para eliminar las barreras técnicas y de costos que enfrentan los
            emprendedores al intentar digitalizar sus negocios. Creemos que la tecnología debe ser
            una herramienta accesible, no un obstáculo.
          </p>
        </div>
      </div>
    </section>

    <!-- Valores -->
    <section class="hero-bg py-20 px-6">
      <div class="max-w-5xl mx-auto">
        <div class="text-center mb-14">
          <h2 class="text-3xl sm:text-4xl font-bold text-white">Nuestros Valores</h2>
          <p class="mt-4 text-gray-400 text-lg max-w-xl mx-auto">
            Los principios que guían cada decisión que tomamos.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="value in values" :key="value.title"
            class="card-bg rounded-xl p-8 space-y-4 border border-gray-800 text-center hover:border-amber-200/30 transition-colors duration-300">
            <div class="w-14 h-14 rounded-lg bg-amber-200/10 flex items-center justify-center mx-auto">
              <component :is="value.icon" class="w-7 h-7 text-amber-200" />
            </div>
            <h3 class="text-xl font-semibold text-white">{{ value.title }}</h3>
            <p class="text-gray-400 leading-relaxed">{{ value.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="content-bg py-20 px-6">
      <div class="max-w-3xl mx-auto text-center card-bg rounded-xl p-10 border border-gray-800 space-y-6">
        <h2 class="text-2xl sm:text-3xl font-bold text-white">
          Comienza a construir tu catálogo hoy
        </h2>
        <p class="text-gray-400 text-lg">
          Únete a miles de emprendedores que ya confían en Kiosky para digitalizar sus negocios.
        </p>
        <RouterLink to="/signup">
          <button
            class="mt-2 bg-amber-200 text-black font-semibold rounded-lg px-8 py-3 hover:bg-amber-100 transition-colors cursor-pointer">
            Crear cuenta gratis
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
