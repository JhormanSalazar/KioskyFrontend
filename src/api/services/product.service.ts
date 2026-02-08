import apiClient from '../apiClient'
import type {
  ProductResponse,
  CreateProductRequest,
  UpdateProductRequest
} from '@/types/api.types'

/**
 * Servicio de Productos
 *
 * Maneja todas las operaciones relacionadas con productos:
 * - Listar, crear, actualizar y eliminar productos
 * - Búsqueda por slug, categoría, tienda
 * - Filtrado por visibilidad y rango de precios
 * - Validación de slugs únicos
 */

export const productService = {
  /**
   * Obtener todos los productos del sistema
   * @returns Lista de todos los productos
   */
  async getAll(): Promise<ProductResponse[]> {
    const response = await apiClient.get<ProductResponse[]>('/api/products')
    return response.data
  },

  /**
   * Obtener un producto por ID
   * @param id - ID del producto
   * @returns Producto encontrado
   */
  async getById(id: number): Promise<ProductResponse> {
    const response = await apiClient.get<ProductResponse>(`/api/products/${id}`)
    return response.data
  },

  /**
   * Obtener un producto por slug
   * @param slug - Slug único del producto
   * @returns Producto encontrado
   */
  async getBySlug(slug: string): Promise<ProductResponse> {
    const response = await apiClient.get<ProductResponse>(`/api/products/slug/${slug}`)
    return response.data
  },

  /**
   * Obtener todos los productos de una categoría
   * @param categoryId - ID de la categoría
   * @returns Lista de productos de la categoría
   */
  async getByCategoryId(categoryId: number): Promise<ProductResponse[]> {
    const response = await apiClient.get<ProductResponse[]>(`/api/products/category/${categoryId}`)
    return response.data
  },

  /**
   * Obtener todos los productos de una tienda
   * @param storeId - ID de la tienda
   * @returns Lista de productos de la tienda
   */
  async getByStoreId(storeId: number): Promise<ProductResponse[]> {
    const response = await apiClient.get<ProductResponse[]>(`/api/products/store/${storeId}`)
    return response.data
  },

  /**
   * Obtener productos visibles de una tienda (para el catálogo público)
   * @param storeId - ID de la tienda
   * @returns Lista de productos visibles
   */
  async getVisibleByStoreId(storeId: number): Promise<ProductResponse[]> {
    const response = await apiClient.get<ProductResponse[]>(`/api/products/store/${storeId}/visible`)
    return response.data
  },

  /**
   * Buscar productos por nombre en una tienda
   * @param storeId - ID de la tienda
   * @param query - Término de búsqueda
   * @returns Lista de productos que coinciden
   */
  async searchByStore(storeId: number, query: string): Promise<ProductResponse[]> {
    const response = await apiClient.get<ProductResponse[]>(
      `/api/products/store/${storeId}/search`,
      { params: { query } }
    )
    return response.data
  },

  /**
   * Filtrar productos por rango de precios en una tienda
   * @param storeId - ID de la tienda
   * @param minPrice - Precio mínimo
   * @param maxPrice - Precio máximo
   * @returns Lista de productos en el rango
   */
  async filterByPriceRange(
    storeId: number,
    minPrice: number,
    maxPrice: number
  ): Promise<ProductResponse[]> {
    const response = await apiClient.get<ProductResponse[]>(
      `/api/products/store/${storeId}/price-range`,
      { params: { minPrice, maxPrice } }
    )
    return response.data
  },

  /**
   * Obtener un producto por slug dentro de una tienda
   * @param storeId - ID de la tienda
   * @param slug - Slug del producto
   * @returns Producto encontrado
   */
  async getByStoreAndSlug(storeId: number, slug: string): Promise<ProductResponse> {
    const response = await apiClient.get<ProductResponse>(
      `/api/products/store/${storeId}/slug/${slug}`
    )
    return response.data
  },

  /**
   * Verificar si un slug ya existe en una tienda
   * @param storeId - ID de la tienda
   * @param slug - Slug a verificar
   * @returns true si el slug ya existe
   */
  async slugExists(storeId: number, slug: string): Promise<boolean> {
    const response = await apiClient.get<boolean>(
      `/api/products/store/${storeId}/slug/${slug}/exists`
    )
    return response.data
  },

  /**
   * Crear un nuevo producto
   * @param product - Datos del nuevo producto
   * @returns Producto creado
   */
  async create(product: CreateProductRequest): Promise<ProductResponse> {
    const response = await apiClient.post<ProductResponse>('/api/products', product)
    return response.data
  },

  /**
   * Actualizar un producto existente
   * @param id - ID del producto
   * @param product - Nuevos datos del producto
   * @returns Producto actualizado
   */
  async update(id: number, product: UpdateProductRequest): Promise<ProductResponse> {
    const response = await apiClient.put<ProductResponse>(`/api/products/${id}`, product)
    return response.data
  },

  /**
   * Cambiar la visibilidad de un producto
   * @param id - ID del producto
   * @param isVisible - Nueva visibilidad
   * @returns Producto actualizado
   */
  async toggleVisibility(id: number, isVisible: boolean): Promise<ProductResponse> {
    const response = await apiClient.patch<ProductResponse>(
      `/api/products/${id}/visibility`,
      { isVisible }
    )
    return response.data
  },

  /**
   * Eliminar un producto
   * @param id - ID del producto a eliminar
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/products/${id}`)
  }
}

