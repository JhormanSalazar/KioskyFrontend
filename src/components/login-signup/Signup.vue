<script setup lang="ts">
import { ref } from 'vue'
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-vue-next'

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

const handleSubmit = () => {
  if (validateForm()) {
    console.log('Formulario válido', formData.value)
    // Aquí puedes agregar la lógica para enviar los datos al backend
  }
}
</script>

<template>
  <div class="signup-container min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <!-- Header -->
      <div class="text-center mb-8">
        <h2 class="text-4xl font-bold text-gray-100 mb-2">Crear cuenta</h2>
        <p class="text-gray-400 text-lg">Comienza tu experiencia con Kiosky</p>
      </div>

      <!-- Form Card -->
      <div class="bg-gray-900 rounded-lg shadow-xl p-8 border border-gray-800">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Full Name -->
          <div>
            <label for="fullName" class="block text-sm font-medium text-gray-300 mb-2">
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
            <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
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
            <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
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
            <label for="confirmPassword" class="block text-sm font-medium text-gray-300 mb-2">
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
          <button type="submit"
            class="w-full bg-amber-200 text-black font-semibold py-3 px-4 rounded-lg hover:bg-amber-100 transition duration-200 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-gray-900">
            Crear cuenta
          </button>
        </form>

        <!-- Divider -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-700"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-gray-900 text-gray-400">O continúa con</span>
            </div>
          </div>
        </div>

        <!-- Social Login -->
        <div class="mt-6 grid grid-cols-2 gap-3">
          <button type="button"
            class="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-700 rounded-lg bg-gray-800 hover:bg-gray-700 transition duration-200">
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#EA4335"
                d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z" />
              <path fill="#34A853"
                d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z" />
              <path fill="#4A90E2"
                d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z" />
              <path fill="#FBBC05"
                d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z" />
            </svg>
            <span class="ml-2 text-gray-300 text-sm font-medium">Google</span>
          </button>

          <button type="button"
            class="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-700 rounded-lg bg-gray-800 hover:bg-gray-700 transition duration-200">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fill="#1877F2"
                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span class="ml-2 text-gray-300 text-sm font-medium">Facebook</span>
          </button>
        </div>

        <!-- Login Link -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-400">
            ¿Ya tienes una cuenta?
            <a href="#" class="font-medium text-amber-200 hover:text-amber-100 transition duration-200">
              Inicia sesión
            </a>
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
  margin: 0.4rem 0;
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
