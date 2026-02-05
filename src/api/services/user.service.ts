import apiClient from "../apiClient";
import type { AppUserResponse, UpdateAppUserRequest } from "@/types/api.types";

const baseURL = "/users";

export const userService = { 

  // Obtiene todos los usuarios
  async getAll(): Promise<AppUserResponse[]> {
    const response = await apiClient.get<AppUserResponse[]>(`${baseURL}`);
    return response.data;
  },

  // Obtiene un usuario por ID
  async getById(userId: number): Promise<AppUserResponse> {
    const response = await apiClient.get<AppUserResponse>(`${baseURL}/${userId}`);
    return response.data;
  },

  // Obtiene un usuario por ID de tienda
  async getUserByStoreId(storeId: number): Promise<AppUserResponse> {
    const response = await apiClient.get<AppUserResponse>(`${baseURL}/store/${storeId}`);
    return response.data;
  },

  // Actualiza la información del usuario
  async updateUserInfo(userId: number, userData: UpdateAppUserRequest): Promise<AppUserResponse> { 
    const response = await apiClient.put<AppUserResponse>(`${baseURL}/${userId}`, userData);
    return response.data;
  },

  // Elimina un usuario por ID
  async deleteUser(userId: number): Promise<void> {
    await apiClient.delete(`${baseURL}/${userId}`);
  }

} 