import apiClient from '../apiClient'
import type {
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest
} from '@/types/api.types'

/**
 * Servicio de Categorías
 *
 * Maneja todas las operaciones relacionadas con categorías de productos:
 * - Listar, crear, actualizar y eliminar categorías
 * - Búsqueda por slug
 * - Filtrado por tienda
 * - Validación de slugs únicos
 */

const baseURL = '/categories'

export const categoryService = {
  /**
   * Obtener todas las categorías
   * @returns Lista de todas las categorías del sistema
   */
  async getAll(): Promise<CategoryResponse[]> {
    const response = await apiClient.get<CategoryResponse[]>(baseURL)
    return response.data
  },

  /**
   * Obtener una categoría por ID
   * @param id - ID de la categoría
   * @returns Categoría encontrada
   */
  async getById(id: number): Promise<CategoryResponse> {
    const response = await apiClient.get<CategoryResponse>(`${baseURL}/${id}`)
    return response.data
  },

  /**
   * Obtener una categoría por slug
   * @param slug - Slug único de la categoría
   * @returns Categoría encontrada
   */
  async getBySlug(slug: string): Promise<CategoryResponse> {
    const response = await apiClient.get<CategoryResponse>(`${baseURL}/slug/${slug}`)
    return response.data
  },

  /**
   * Obtener todas las categorías de una tienda específica
   * @param storeId - ID de la tienda
   * @returns Lista de categorías de la tienda
   */
  async getByStoreId(storeId: number): Promise<CategoryResponse[]> {
    const response = await apiClient.get<CategoryResponse[]>(`${baseURL}/store/${storeId}`)
    return response.data
  },

  /**
   * Obtener una categoría por slug dentro de una tienda específica
   * @param storeId - ID de la tienda
   * @param slug - Slug de la categoría
   * @returns Categoría encontrada en la tienda
   */
  async getByStoreAndSlug(storeId: number, slug: string): Promise<CategoryResponse> {
    const response = await apiClient.get<CategoryResponse>(
      `${baseURL}/store/${storeId}/slug/${slug}`
    )
    return response.data
  },

  /**
   * Verificar si un slug ya existe en una tienda
   * Útil para validar antes de crear o actualizar categorías
   * @param storeId - ID de la tienda
   * @param slug - Slug a verificar
   * @returns true si el slug ya existe, false si está disponible
   */
  async slugExists(storeId: number, slug: string): Promise<boolean> {
    const response = await apiClient.get<boolean>(
      `${baseURL}/store/${storeId}/slug/${slug}/exists`
    )
    return response.data
  },

  /**
   * Crear una nueva categoría
   * @param category - Datos de la nueva categoría
   * @returns Categoría creada con su ID asignado
   */
  async create(category: CreateCategoryRequest): Promise<CategoryResponse> {
    const response = await apiClient.post<CategoryResponse>(baseURL, category)
    return response.data
  },

  /**
   * Actualizar una categoría existente
   * @param id - ID de la categoría a actualizar
   * @param category - Nuevos datos de la categoría
   * @returns Categoría actualizada
   */
  async update(id: number, category: UpdateCategoryRequest): Promise<CategoryResponse> {
    const response = await apiClient.put<CategoryResponse>(`${baseURL}/${id}`, category)
    return response.data
  },

  /**
   * Eliminar una categoría
   * IMPORTANTE: Asegúrate de que el backend maneje correctamente
   * la eliminación de productos asociados o impida eliminar categorías con productos
   * @param id - ID de la categoría a eliminar
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`${baseURL}/${id}`)
  }
}
