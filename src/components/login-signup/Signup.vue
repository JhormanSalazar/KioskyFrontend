<script setup lang="ts">
import { ref } from 'vue'
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-vue-next'
import { useApiMutation } from '@/composables/useApi'
import { authService } from '@/api/services'
import { useRouter } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'

const { mutate: registerUser, loading, error } = useApiMutation(authService.register)
const { success, error: showError } = useNotifications()
const router = useRouter()

const formData = ref({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const errors = ref({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const validateForm = () => {
  errors.value = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  }

  let isValid = true

  if (!formData.value.fullName.trim()) {
    errors.value.fullName = 'El nombre completo es requerido'
    isValid = false
  }

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
  } else if (formData.value.password.length < 8) {
    errors.value.password = 'La contraseña debe tener al menos 8 caracteres'
    isValid = false
  }

  if (!formData.value.confirmPassword) {
    errors.value.confirmPassword = 'Confirma tu contraseña'
    isValid = false
  } else if (formData.value.password !== formData.value.confirmPassword) {
    errors.value.confirmPassword = 'Las contraseñas no coinciden'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (validateForm()) {
    const res = await registerUser({
      fullName: formData.value.fullName,
      email: formData.value.email,
      password: formData.value.password
    })

    if (res) {
      // Mostrar notificación de éxito
      success(
        '¡Cuenta creada exitosamente!',
        `Bienvenido ${res.fullName}. Redirigiendo al panel...`
      )

      // Redirigir después de un breve delay para que vea la notificación
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } else if (error.value) {
      // Mostrar notificación de error
      showError(
        'Error al crear la cuenta',
        error.value.message || 'Ocurrió un problema al procesar tu registro. Inténtalo de nuevo.'
      )
    }
  }
}
</script>

<template>
  <div class="signup-container min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <!-- Header -->
      <div class="text-center mb-2">
        <h2 class="text-4xl font-bold text-gray-100 mb-2">Crear cuenta</h2>
        <p class="text-gray-400 text-lg">Comienza tu experiencia con Kiosky</p>
      </div>

      <!-- Form Card -->
      <div class="bg-gray-900 rounded-lg shadow-xl p-8 border border-gray-800">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Full Name -->
          <div>
            <label for="fullName" class="block text-sm font-medium text-gray-300 mb-0.5">
              Nombre completo
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User class="h-5 w-5 text-gray-500" />
              </div>
              <input id="fullName" v-model="formData.fullName" type="text" class="input-field pl-10"
                placeholder="Juan Pérez" />
            </div>
            <p v-if="errors.fullName" class="mt-1 text-sm text-red-400">{{ errors.fullName }}</p>
          </div>

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
                placeholder="correo@ejemplo.com" />
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
                class="input-field pl-10 pr-10" placeholder="Mínimo 8 caracteres" />
              <button type="button" @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <Eye v-if="!showPassword" class="h-5 w-5 text-gray-500 hover:text-gray-300" />
                <EyeOff v-else class="h-5 w-5 text-gray-500 hover:text-gray-300" />
              </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-red-400">{{ errors.password }}</p>
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-300 mb-0.5">
              Confirmar contraseña
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock class="h-5 w-5 text-gray-500" />
              </div>
              <input id="confirmPassword" v-model="formData.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'" class="input-field pl-10 pr-10"
                placeholder="Confirma tu contraseña" />
              <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <Eye v-if="!showConfirmPassword" class="h-5 w-5 text-gray-500 hover:text-gray-300" />
                <EyeOff v-else class="h-5 w-5 text-gray-500 hover:text-gray-300" />
              </button>
            </div>
            <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-400">
              {{ errors.confirmPassword }}
            </p>
          </div>

          <!-- Submit Button -->
          <button type="submit" :disabled="loading" :class="[
            'w-full font-semibold py-3 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-gray-900',
            loading
              ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
              : 'bg-amber-200 text-black hover:bg-amber-100'
          ]">
            <span v-if="loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-300" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              Creando cuenta...
            </span>
            <span v-else>Crear cuenta</span>
          </button>
        </form>
        
        <!-- Login Link -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-400">
            ¿Ya tienes una cuenta?
            <router-link to="/login" class="font-medium text-amber-200 hover:text-amber-100 transition duration-200">
              Inicia sesión
            </router-link>
          </p>
        </div>
      </div>

      <!-- Terms -->
      <p class="mt-6 text-center text-xs text-gray-500">
        Al crear una cuenta, aceptas nuestros
        <a href="#" class="text-amber-200 hover:text-amber-100">Términos de Servicio</a>
        y
        <a href="#" class="text-amber-200 hover:text-amber-100">Política de Privacidad</a>
      </p>
    </div>
  </div>
</template>

<style scoped>
.signup-container {
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

.input-field::placeholder {
  color: #6b7280;
}
</style>
