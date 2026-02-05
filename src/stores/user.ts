import { defineStore } from 'pinia'
import { computed } from 'vue'
import type { AppUserResponse, UpdateAppUserRequest } from '@/types/api.types'
import { useApi, useApiMutation } from '@/composables/useApi'
import { authService } from '@/api/services'
import { userService } from '@/api/services/user.service'
import { useNotifications } from '@/composables/useNotifications'

export const useUserStore = defineStore('user', () => {
  // USAR COMPOSABLE useApi PARA CARGAR DATOS DEL USUARIO
  const {
    data: currentUser,
    loading,
    error,
    execute,
  } = useApi<AppUserResponse>(authService.getCurrentUser)

  const {
    loading: userLoading,
    error: userError,
    mutate,
  } = useApiMutation<AppUserResponse, [number, UpdateAppUserRequest]>(userService.updateUserInfo)

  const { success } = useNotifications()

  // Cargar usuario desde localStorage al iniciar la tienda

  const storedUser = localStorage.getItem('currentUserInfo')
  if (storedUser) {
    currentUser.value = JSON.parse(storedUser)
  }

  // ACTIONS
  const loadUser = async () => {
    const result = await execute()
    if (result) {
      currentUser.value = result
      localStorage.setItem('currentUserInfo', JSON.stringify(result))
    }
  }

  // Update user info
  const updateUserInfo = async (userId: number, userData: UpdateAppUserRequest) => {
    const result = await mutate(userId, userData)
    if (result) {
      currentUser.value = result
      localStorage.setItem('currentUserInfo', JSON.stringify(result))
      success('Información de usuario actualizada correctamente')
    }
    return result
  }

  const logout = () => {
    authService.logout()
    currentUser.value = null
    localStorage.removeItem('currentUserInfo')
  }

  // GETTERS
  const isAuthenticated = computed(() => {
    return currentUser.value !== null
  })

  return {
    // state
    // from useApi
    currentUser,
    loading,
    error,
    userLoading,
    userError,
    // actions
    updateUserInfo,
    loadUser,
    logout,
    // getters
    isAuthenticated,
  }
})
