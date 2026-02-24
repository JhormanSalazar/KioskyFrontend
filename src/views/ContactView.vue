<script setup lang="ts">
import { ref } from 'vue'
import { Mail, Send, Github, Twitter, MessageCircle } from 'lucide-vue-next'

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const isSubmitting = ref(false)
const submitted = ref(false)

function handleSubmit() {
  isSubmitting.value = true

  // Simular envío (reemplazar con integración real)
  setTimeout(() => {
    isSubmitting.value = false
    submitted.value = true
    form.value = { name: '', email: '', subject: '', message: '' }
  }, 1000)
}

const socialLinks = [
  { icon: MessageCircle, label: 'WhatsApp', href: '#' },
  { icon: Twitter, label: 'Twitter / X', href: '#' },
  { icon: Github, label: 'GitHub', href: '#' },
]
</script>

<template>
  <div class="contact-page">
    <!-- Hero -->
    <section class="hero-bg pt-20 pb-24 px-6">
      <div class="max-w-4xl mx-auto text-center space-y-6">
        <span
          class="inline-flex items-center gap-2 rounded-full bg-amber-200/10 px-4 py-1.5 text-sm text-amber-200"
        >
          <Mail class="w-4 h-4" />
          Contacto
        </span>
        <h1 class="text-4xl sm:text-5xl font-bold text-white leading-tight">
          Hablemos sobre tu
          <span class="text-amber-200">proyecto</span>
        </h1>
        <p class="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Tienes una pregunta, sugerencia o simplemente quieres saludar. Estamos aquí para
          ayudarte.
        </p>
      </div>
    </section>

    <!-- Form + Info -->
    <section class="content-bg py-20 px-6">
      <div class="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
        <!-- Formulario -->
        <div class="lg:col-span-3 card-bg rounded-xl p-8 sm:p-10 border border-gray-800">
          <div v-if="submitted" class="text-center py-12 space-y-4">
            <div
              class="w-16 h-16 rounded-full bg-amber-200/10 flex items-center justify-center mx-auto"
            >
              <Send class="w-8 h-8 text-amber-200" />
            </div>
            <h3 class="text-2xl font-bold text-white">Mensaje enviado</h3>
            <p class="text-gray-400">Te responderemos lo antes posible.</p>
            <button
              class="mt-4 text-amber-200 hover:text-amber-100 text-sm font-medium cursor-pointer"
              @click="submitted = false"
            >
              Enviar otro mensaje
            </button>
          </div>

          <form v-else class="space-y-6" @submit.prevent="handleSubmit">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-300 mb-2">Nombre</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                placeholder="Tu nombre completo"
                class="w-full rounded-lg border border-gray-700 bg-[#111111] px-4 py-3 text-white placeholder-gray-500 focus:border-amber-200/50 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                placeholder="tu@email.com"
                class="w-full rounded-lg border border-gray-700 bg-[#111111] px-4 py-3 text-white placeholder-gray-500 focus:border-amber-200/50 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label for="subject" class="block text-sm font-medium text-gray-300 mb-2"
                >Asunto</label
              >
              <input
                id="subject"
                v-model="form.subject"
                type="text"
                required
                placeholder="Asunto del mensaje"
                class="w-full rounded-lg border border-gray-700 bg-[#111111] px-4 py-3 text-white placeholder-gray-500 focus:border-amber-200/50 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label for="message" class="block text-sm font-medium text-gray-300 mb-2"
                >Mensaje</label
              >
              <textarea
                id="message"
                v-model="form.message"
                rows="5"
                required
                placeholder="Cuéntanos en qué podemos ayudarte..."
                class="w-full rounded-lg border border-gray-700 bg-[#111111] px-4 py-3 text-white placeholder-gray-500 focus:border-amber-200/50 focus:outline-none transition-colors resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full bg-amber-200 text-black font-semibold rounded-lg px-6 py-3 hover:bg-amber-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send v-if="!isSubmitting" class="w-4 h-4" />
              {{ isSubmitting ? 'Enviando...' : 'Enviar mensaje' }}
            </button>
          </form>
        </div>

        <!-- Sidebar info -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Soporte -->
          <div class="card-bg rounded-xl p-8 border border-gray-800 space-y-4">
            <h3 class="text-lg font-semibold text-white">Soporte</h3>
            <p class="text-gray-400 text-sm leading-relaxed">
              Nuestro equipo responde en menos de 24 horas. Para consultas urgentes, escríbenos
              directamente por WhatsApp.
            </p>
            <a
              href="mailto:soporte@kiosky.app"
              class="inline-flex items-center gap-2 text-amber-200 hover:text-amber-100 text-sm font-medium transition-colors"
            >
              <Mail class="w-4 h-4" />
              soporte@kiosky.app
            </a>
          </div>

          <!-- Redes sociales -->
          <div class="card-bg rounded-xl p-8 border border-gray-800 space-y-5">
            <h3 class="text-lg font-semibold text-white">Síguenos</h3>
            <div class="space-y-3">
              <a
                v-for="link in socialLinks"
                :key="link.label"
                :href="link.href"
                class="flex items-center gap-3 text-gray-400 hover:text-amber-200 transition-colors group"
              >
                <div
                  class="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center group-hover:bg-amber-200/10 transition-colors"
                >
                  <component :is="link.icon" class="w-4 h-4" />
                </div>
                <span class="text-sm font-medium">{{ link.label }}</span>
              </a>
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
