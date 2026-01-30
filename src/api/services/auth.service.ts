import apiClient from '../apiClient'
import type {
  LoginRequest,
  LoginResponse,
  AppUserResponse,
  RegisterAppUserRequest,
  RegisterStoreWithUserRequest
} from '@/types/api.types'

/**
 * Servicio de Autenticación
 *
 * Maneja todas las operaciones relacionadas con autenticación:
 * - Login
 * - Logout
 * - Registro
 * - Renovación de token
 */

export const authService = {
  /**
   * Iniciar sesión
   * @param credentials - Usuario y contraseña
   * @returns Token y datos del usuario
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials)

    // Guardar token en localStorage
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token)
    }

    return response.data
  },

  /**
   * Registrar nuevo usuario
   * @param userData - Datos del nuevo usuario
   * @returns Usuario creado
   */
  async register(userData: RegisterAppUserRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/register', userData)

    // Guardar token si el registro incluye auto-login
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token)
    }

    return response.data
  },

  /**
   * Registrar nueva tienda junto con un usuario owner al mismo tiempo.
   * @param data - Datos de la tienda y del usuario
   * @returns Usuario creado con token
  */
  async registerStoreWithUser(data: RegisterStoreWithUserRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/register-owner', data)

    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token)
    }

    return response.data  
  },

  /**
   * Cerrar sesión
   * Limpia los tokens almacenados
   */
  logout(): void {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
    // Redirigir al login si es necesario
    window.location.href = '/login'
  },

  /**
   * Obtener el usuario actual autenticado
   * @returns Datos del usuario actual
   */
  async getCurrentUser(): Promise<AppUserResponse> {
    const response = await apiClient.get<AppUserResponse>('/auth/me')
    return response.data
  },

  /**
   * Verificar si el usuario está autenticado
   * @returns true si hay un token válido
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token')
  },
}
