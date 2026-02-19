import type { StoreResponse, SimpleStoreResponse, RegisterStoreRequest } from '@/types/api.types'
import apiClient from '../apiClient'

const baseURL = '/stores'

export const storeService = {
  // Obtiene todas las tiendas y su información completa.
  async getAll(): Promise<StoreResponse[]> {
    const response = await apiClient.get<StoreResponse[]>(`${baseURL}`)
    return response.data
  },

  // Obtiene toda la informacion de una tienda por su ID
  async getById(storeId: number): Promise<StoreResponse> {
    const response = await apiClient.get<StoreResponse>(`${baseURL}/${storeId}`)
    return response.data
  },

  // Obtiene la información basica de una tienda por su ID
  async getSimpleStoreById(storeId: number): Promise<SimpleStoreResponse> {
    const response = await apiClient.get<SimpleStoreResponse>(`${baseURL}/simple/${storeId}`)
    return response.data
  },

  // Crea una tienda nueva para un usuario existente
  async createStoreForUser(
    userId: number,
    storeData: RegisterStoreRequest,
  ): Promise<StoreResponse> {
    const response = await apiClient.post<StoreResponse>(`${baseURL}/user/${userId}`, storeData)
    return response.data
  },

  async domainExists(domain: string): Promise<boolean> {
    const response = await apiClient.get<{ exists: boolean }>(`${baseURL}/domain/exists/${domain}`)
    return response.data.exists
  },

  // Actualiza la configuración visual (themeSettings JSON) de una tienda
  async updateThemeSettings(storeId: number, themeSettings: string): Promise<StoreResponse> {
    const response = await apiClient.patch<StoreResponse>(`${baseURL}/${storeId}/theme`, {
      themeSettings,
    })
    return response.data
  },

  // Elimina una tienda por su ID
  async deleteStore(storeId: number): Promise<void> {
    await apiClient.delete(`${baseURL}/${storeId}`)
  },
}
