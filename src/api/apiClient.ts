import axios from 'axios'
import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import type { ApiError, ApiResponse } from '@/types/api.types'

/**
 * Configuración de la instancia de Axios
 * 
 * Esta instancia está preconfigurada con:
 * - URL base de la API
 * - Timeout
 * - Headers comunes
 * - Interceptores para manejo de autenticación y errores
 */

// Crear instancia de axios
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

/**
 * Interceptor de Request
 * Se ejecuta ANTES de cada petición
 * Aquí añadimos el token de autenticación si existe
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Obtener token del localStorage (o de tu store de Pinia)
    const token = localStorage.getItem('auth_token')
    
    if (token && config.headers) {
      // Añadir token al header Authorization
      config.headers.Authorization = `Bearer ${token}`
    }

    // Log en desarrollo para debugging
    if (import.meta.env.DEV) {
      console.log('📤 Request:', config.method?.toUpperCase(), config.url)
    }

    return config
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

/**
 * Interceptor de Response
 * Se ejecuta DESPUÉS de recibir cada respuesta
 * Aquí manejamos errores globales y transformamos respuestas
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // Log en desarrollo
    if (import.meta.env.DEV) {
      console.log('✅ Response:', response.config.url, response.status)
    }

    // Retornar solo los datos relevantes
    return response
  },
  (error: AxiosError<ApiError>) => {
    // Log del error
    console.error('❌ Response Error:', error.response?.status, error.message)

    // Manejo de errores comunes
    if (error.response) {
      const status = error.response.status

      switch (status) {
        case 401:
          // No autorizado - limpiar sesión y redirigir al login
          console.warn('🔒 Sesión expirada o no autorizado')
          localStorage.removeItem('auth_token')
          // Redirigir al login (puedes usar el router aquí)
          window.location.href = '/login'
          break

        case 403:
          // Prohibido - no tiene permisos
          console.warn('⛔ No tienes permisos para esta acción')
          break

        case 404:
          // No encontrado
          console.warn('🔍 Recurso no encontrado')
          break

        case 500:
          // Error del servidor
          console.error('💥 Error interno del servidor')
          break

        case 503:
          // Servicio no disponible
          console.error('🚫 Servicio temporalmente no disponible')
          break
      }

      // Crear objeto de error normalizado
      const apiError: ApiError = {
        message: error.response.data?.message || error.message,
        status: status,
        errors: error.response.data?.errors,
        timestamp: error.response.data?.timestamp,
        path: error.response.data?.path
      }

      return Promise.reject(apiError)
    } else if (error.request) {
      // La petición fue hecha pero no hubo respuesta
      console.error('📡 No hay respuesta del servidor')
      return Promise.reject({
        message: 'No se pudo conectar con el servidor. Verifica tu conexión.',
        status: 0
      } as ApiError)
    } else {
      // Error al configurar la petición
      console.error('⚙️ Error al configurar la petición')
      return Promise.reject({
        message: error.message,
        status: 0
      } as ApiError)
    }
  }
)

export default apiClient
