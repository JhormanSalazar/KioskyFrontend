<script setup lang="ts">
import { ref } from 'vue'
import { Mail, Lock, Eye, EyeOff } from 'lucide-vue-next'
import { useApiMutation } from '@/composables/useApi'
import { authService } from '@/api/services'
import { useRouter } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'
import { useUserStore } from '@/stores/user'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const { mutate: loginUser, loading, error } = useApiMutation(authService.login)
const { success, error: showError } = useNotifications()
const router = useRouter()
const userStore = useUserStore()

const formData = ref({
  email: '',
  password: '',
})

const showPassword = ref(false)
const errors = ref({
  email: '',
  password: '',
})

const validateForm = () => {
  errors.value = {
    email: '',
    password: '',
  }

  let isValid = true

  if (!formData.value.email.trim()) {
    errors.value.email = 'El correo electrónico es requerido'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    errors.value.email = 'Ingresa un correo electrónico válido'
    isValid = false
  }

  if (!formData.value.password) {
    errors.value.password = 'La contraseña es requerida'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (validateForm()) {
    const res = await loginUser({
      email: formData.value.email,
      password: formData.value.password
    })

    if (res) {
      // Cargar los datos del usuario en el store
      await userStore.loadUser()

      // Mostrar notificación de éxito
      success(
        '¡Inicio de sesión exitoso!',
        `Bienvenido de vuelta ${res.fullName}`
      )

      // Redirigir después de un breve delay para que vea la notificación
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    } else if (error.value) {
      // Mostrar notificación de error
      showError(
        'Error al iniciar sesión',
        error.value.message || 'Credenciales inválidas. Verifica tu email y contraseña.'
      )
    }
  }
}
</script>

<template>
  <div class="login-page">
    <!-- Hero header -->
    <section class="hero-bg pt-20 pb-12 px-6">
      <div class="max-w-4xl mx-auto text-center space-y-4">
        <h1 class="text-4xl sm:text-5xl font-bold text-white leading-tight">
          Iniciar <span class="text-amber-200">sesión</span>
        </h1>
        <p class="text-lg text-gray-400 max-w-xl mx-auto">
          Accede a tu cuenta de Kiosky
        </p>
      </div>
    </section>

    <!-- Form -->
    <section class="content-bg py-16 px-6">
      <div class="max-w-md mx-auto">
        <div class="card-bg rounded-xl p-8 sm:p-10 border border-gray-800">
          <form @submit.prevent="handleSubmit" class="space-y-5">
            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
                Correo electrónico
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail class="h-4 w-4 text-gray-500" />
                </div>
                <input
                  id="email"
                  v-model="formData.email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  :disabled="loading"
                  class="w-full rounded-lg border border-gray-700 bg-[#111111] pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:border-amber-200/50 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <p v-if="errors.email" class="mt-1.5 text-sm text-red-400">{{ errors.email }}</p>
            </div>

            <!-- Password -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
                Contraseña
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock class="h-4 w-4 text-gray-500" />
                </div>
                <input
                  id="password"
                  v-model="formData.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Tu contraseña"
                  :disabled="loading"
                  class="w-full rounded-lg border border-gray-700 bg-[#111111] pl-11 pr-11 py-3 text-white placeholder-gray-500 focus:border-amber-200/50 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-4 flex items-center"
                  :disabled="loading"
                >
                  <Eye v-if="!showPassword" class="h-4 w-4 text-gray-500 hover:text-gray-300 transition-colors" />
                  <EyeOff v-else class="h-4 w-4 text-gray-500 hover:text-gray-300 transition-colors" />
                </button>
              </div>
              <p v-if="errors.password" class="mt-1.5 text-sm text-red-400">{{ errors.password }}</p>
            </div>

            <!-- Forgot Password -->
            <div class="flex justify-end">
              <a href="#" class="text-sm text-amber-200 hover:text-amber-100 transition-colors">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <!-- Submit -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-amber-200 text-black font-semibold rounded-lg px-6 py-3 hover:bg-amber-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span v-if="loading" class="flex items-center justify-center gap-2">
                <LoadingSpinner :size="20" color="#d1d5db" />
                Iniciando sesión...
              </span>
              <span v-else>Iniciar sesión</span>
            </button>
          </form>

          <!-- Divider -->
          <div class="my-6 relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-700"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-3 text-gray-500" style="background-color: #1a1a1a">¿No tienes cuenta?</span>
            </div>
          </div>

          <!-- Signup Link -->
          <div class="text-center">
            <router-link
              to="/signup"
              class="text-sm font-medium text-amber-200 hover:text-amber-100 transition-colors"
            >
              Crear cuenta nueva
            </router-link>
          </div>
        </div>

        <!-- Terms -->
        <p class="mt-8 text-center text-xs text-gray-500">
          Al iniciar sesión, aceptas nuestros
          <a href="#" class="text-amber-200 hover:text-amber-100 transition-colors">Términos de Servicio</a>
          y
          <a href="#" class="text-amber-200 hover:text-amber-100 transition-colors">Política de Privacidad</a>
        </p>
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
