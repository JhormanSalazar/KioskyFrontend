<script setup lang="ts">
import { ref } from 'vue'
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-vue-next'
import { useApiMutation } from '@/composables/useApi'
import { authService } from '@/api/services'
import { useRouter } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

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
  <div class="signup-page">
    <!-- Hero header -->
    <section class="hero-bg pt-20 pb-12 px-6">
      <div class="max-w-4xl mx-auto text-center space-y-4">
        <h1 class="text-4xl sm:text-5xl font-bold text-white leading-tight">
          Crear <span class="text-amber-200">cuenta</span>
        </h1>
        <p class="text-lg text-gray-400 max-w-xl mx-auto">
          Comienza tu experiencia con Kiosky
        </p>
      </div>
    </section>

    <!-- Form -->
    <section class="content-bg py-16 px-6">
      <div class="max-w-md mx-auto">
        <div class="card-bg rounded-xl p-8 sm:p-10 border border-gray-800">
          <form @submit.prevent="handleSubmit" class="space-y-5">
            <!-- Full Name -->
            <div>
              <label for="fullName" class="block text-sm font-medium text-gray-300 mb-2">
                Nombre completo
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User class="h-4 w-4 text-gray-500" />
                </div>
                <input id="fullName" v-model="formData.fullName" type="text" placeholder="Juan Pérez"
                  :disabled="loading"
                  class="w-full rounded-lg border border-gray-700 bg-[#111111] pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:border-amber-200/50 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed" />
              </div>
              <p v-if="errors.fullName" class="mt-1.5 text-sm text-red-400">{{ errors.fullName }}</p>
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
                Correo electrónico
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail class="h-4 w-4 text-gray-500" />
                </div>
                <input id="email" v-model="formData.email" type="email" placeholder="correo@ejemplo.com"
                  :disabled="loading"
                  class="w-full rounded-lg border border-gray-700 bg-[#111111] pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:border-amber-200/50 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed" />
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
                <input id="password" v-model="formData.password" :type="showPassword ? 'text' : 'password'"
                  placeholder="Mínimo 8 caracteres" :disabled="loading"
                  class="w-full rounded-lg border border-gray-700 bg-[#111111] pl-11 pr-11 py-3 text-white placeholder-gray-500 focus:border-amber-200/50 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed" />
                <button type="button" @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-4 flex items-center" :disabled="loading">
                  <Eye v-if="!showPassword" class="h-4 w-4 text-gray-500 hover:text-gray-300 transition-colors" />
                  <EyeOff v-else class="h-4 w-4 text-gray-500 hover:text-gray-300 transition-colors" />
                </button>
              </div>
              <p v-if="errors.password" class="mt-1.5 text-sm text-red-400">{{ errors.password }}</p>
            </div>

            <!-- Confirm Password -->
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-300 mb-2">
                Confirmar contraseña
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock class="h-4 w-4 text-gray-500" />
                </div>
                <input id="confirmPassword" v-model="formData.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'" placeholder="Confirma tu contraseña"
                  :disabled="loading"
                  class="w-full rounded-lg border border-gray-700 bg-[#111111] pl-11 pr-11 py-3 text-white placeholder-gray-500 focus:border-amber-200/50 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed" />
                <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute inset-y-0 right-0 pr-4 flex items-center" :disabled="loading">
                  <Eye v-if="!showConfirmPassword"
                    class="h-4 w-4 text-gray-500 hover:text-gray-300 transition-colors" />
                  <EyeOff v-else class="h-4 w-4 text-gray-500 hover:text-gray-300 transition-colors" />
                </button>
              </div>
              <p v-if="errors.confirmPassword" class="mt-1.5 text-sm text-red-400">
                {{ errors.confirmPassword }}
              </p>
            </div>

            <!-- Submit -->
            <button type="submit" :disabled="loading"
              class="w-full bg-amber-200 text-black font-semibold rounded-lg px-6 py-3 hover:bg-amber-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <span v-if="loading" class="flex items-center justify-center gap-2">
                <LoadingSpinner :size="20" color="#d1d5db" />
                Creando cuenta...
              </span>
              <span v-else>Crear cuenta</span>
            </button>
          </form>

          <!-- Login Link -->
          <div class="mt-6 text-center">
            <p class="text-sm text-gray-400">
              ¿Ya tienes una cuenta?
              <router-link to="/login" class="font-medium text-amber-200 hover:text-amber-100 transition-colors">
                Inicia sesión
              </router-link>
            </p>
          </div>
        </div>

        <!-- Terms -->
        <p class="mt-8 text-center text-xs text-gray-500">
          Al crear una cuenta, aceptas nuestros
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
