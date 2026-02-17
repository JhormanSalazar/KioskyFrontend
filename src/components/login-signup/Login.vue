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
  <div class="login-container min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <!-- Header -->
      <div class="text-center mb-2">
        <h2 class="text-4xl font-bold text-gray-100 mb-2">Iniciar sesión</h2>
        <p class="text-gray-400 text-lg">Accede a tu cuenta de Kiosky</p>
      </div>

      <!-- Form Card -->
      <div class="bg-gray-900 rounded-lg shadow-xl p-8 border border-gray-800">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-300 mb-0.5">
              Correo electrónico
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail class="h-5 w-5 text-gray-500" />
              </div>
              <input id="email" v-model="formData.email" type="email" class="input-field pl-10"
                placeholder="correo@ejemplo.com" :disabled="loading" />
            </div>
            <p v-if="errors.email" class="mt-1 text-sm text-red-400">{{ errors.email }}</p>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-300 mb-0.5">
              Contraseña
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock class="h-5 w-5 text-gray-500" />
              </div>
              <input id="password" v-model="formData.password" :type="showPassword ? 'text' : 'password'"
                class="input-field pl-10 pr-10" placeholder="Tu contraseña" :disabled="loading" />
              <button type="button" @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center" :disabled="loading">
                <Eye v-if="!showPassword" class="h-5 w-5 text-gray-500 hover:text-gray-300" />
                <EyeOff v-else class="h-5 w-5 text-gray-500 hover:text-gray-300" />
              </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-red-400">{{ errors.password }}</p>
          </div>

          <!-- Forgot Password Link -->
          <div class="flex items-center justify-end">
            <a href="#" class="text-sm text-amber-200 hover:text-amber-100 transition duration-200">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <!-- Submit Button -->
          <button type="submit" :disabled="loading" :class="[
            'w-full font-semibold py-3 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-gray-900',
            loading
              ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
              : 'bg-amber-200 text-black hover:bg-amber-100'
          ]">
            <span v-if="loading" class="flex items-center justify-center">
              <LoadingSpinner :size="20" color="#d1d5db" />
              <span class="ml-2">Iniciando sesión...</span>
            </span>
            <span v-else>Iniciar sesión</span>
          </button>
        </form>

        <!-- Divider -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-700"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-gray-900 text-gray-400">¿No tienes cuenta?</span>
            </div>
          </div>
        </div>

        <!-- Signup Link -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-400">
            <router-link to="/signup" class="font-medium text-amber-200 hover:text-amber-100 transition duration-200">
              Crear cuenta nueva
            </router-link>
          </p>
        </div>
      </div>

      <!-- Terms -->
      <p class="mt-6 text-center text-xs text-gray-500">
        Al iniciar sesión, aceptas nuestros
        <a href="#" class="text-amber-200 hover:text-amber-100">Términos de Servicio</a>
        y
        <a href="#" class="text-amber-200 hover:text-amber-100">Política de Privacidad</a>
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  background-color: #0a0a0a;
}

.input-field {
  width: 100%;
  padding: 0.75rem 2.5rem;
  background-color: #1f2937;
  border: 1px solid #374151;
  border-radius: 0.5rem;
  color: #f3f4f6;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.input-field:focus {
  outline: none;
  border-color: #fbbf24;
  background-color: #111827;
  box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.1);
}

.input-field:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.input-field::placeholder {
  color: #6b7280;
}
</style>
