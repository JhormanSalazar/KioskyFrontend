import apiClient from '../apiClient'
import type { PageResponse, PaginationParams } from '@/types/api.types'

/**
 * Servicio genérico para operaciones CRUD
 * 
 * Esta es una plantilla que puedes copiar y adaptar para otros recursos
 * Por ejemplo: productos, categorías, pedidos, etc.
 */

// Define tu tipo de entidad aquí (ejemplo: Product)
export interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  category: string
  imageUrl?: string
  createdAt?: string
  updatedAt?: string
}

export const productService = {
  /**
   * Obtener todos los productos (con paginación)
   * @param params - Parámetros de paginación
   * @returns Lista paginada de productos
   */
  async getAll(params?: PaginationParams): Promise<PageResponse<Product>> {
    const response = await apiClient.get<PageResponse<Product>>('/products', {
      params: {
        page: params?.page || 0,
        size: params?.size || 10,
        sort: params?.sort || 'id,asc'
      }
    })
    return response.data
  },

  /**
   * Obtener un producto por ID
   * @param id - ID del producto
   * @returns Producto encontrado
   */
  async getById(id: number): Promise<Product> {
    const response = await apiClient.get<Product>(`/products/${id}`)
    return response.data
  },

  /**
   * Crear un nuevo producto
   * @param product - Datos del producto (sin ID)
   * @returns Producto creado
   */
  async create(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const response = await apiClient.post<Product>('/products', product)
    return response.data
  },

  /**
   * Actualizar un producto existente
   * @param id - ID del producto a actualizar
   * @param product - Nuevos datos del producto
   * @returns Producto actualizado
   */
  async update(id: number, product: Partial<Product>): Promise<Product> {
    const response = await apiClient.put<Product>(`/products/${id}`, product)
    return response.data
  },

  /**
   * Actualización parcial de un producto
   * @param id - ID del producto
   * @param updates - Campos a actualizar
   * @returns Producto actualizado
   */
  async patch(id: number, updates: Partial<Product>): Promise<Product> {
    const response = await apiClient.patch<Product>(`/products/${id}`, updates)
    return response.data
  },

  /**
   * Eliminar un producto
   * @param id - ID del producto a eliminar
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/products/${id}`)
  },

  /**
   * Buscar productos por nombre
   * @param query - Término de búsqueda
   * @returns Lista de productos que coinciden
   */
  async search(query: string, params?: PaginationParams): Promise<PageResponse<Product>> {
    const response = await apiClient.get<PageResponse<Product>>('/products/search', {
      params: {
        q: query,
        page: params?.page || 0,
        size: params?.size || 10
      }
    })
    return response.data
  }
}
