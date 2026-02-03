import {defineStore } from 'pinia'
import { computed } from 'vue'
import type { AppUserResponse } from '@/types/api.types'
import { useApi } from '@/composables/useApi'
import { authService } from '@/api/services'



export const useUserStore = defineStore('user', () => {
  // USAR COMPOSABLE useApi PARA CARGAR DATOS DEL USUARIO
  const { data: currentUser, loading, error, execute } = useApi<AppUserResponse>(authService.getCurrentUser)

  const storedUser = localStorage.getItem('currentUserInfo');
  if (storedUser) {
    currentUser.value = JSON.parse(storedUser);
  }

  // ACTIONS
  const loadUser = async () => {
    const result = await execute()
    if (result) {
      currentUser.value = result
      localStorage.setItem('currentUserInfo', JSON.stringify(result));
    }
  }

  const logout = () => {
    authService.logout();
    currentUser.value = null;
    localStorage.removeItem('currentUserInfo');
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
    // actions
    loadUser,
    logout,
    // getters
    isAuthenticated,

  }
})
