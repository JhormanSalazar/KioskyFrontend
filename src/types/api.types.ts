/**
 * Tipos para las respuestas de la API
 */

// Tipos de roles de usuario
export type UserRole = 'ADMIN' | 'OWNER' | 'CUSTOMER' | 'EMPLOYEE'

// Respuesta genérica de la API
export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
  timestamp?: string
}

// Respuesta de error de la API
export interface ApiError {
  message: string
  status: number
  errors?: Record<string, string[]>
  timestamp?: string
  path?: string
}

// Configuración de paginación
export interface PaginationParams {
  page?: number
  size?: number
  sort?: string
}

// Respuesta paginada (común en Spring Boot)
export interface PageResponse<T> {
  content: T[]
  pageable: {
    pageNumber: number
    pageSize: number
    sort: {
      sorted: boolean
      unsorted: boolean
      empty: boolean
    }
    offset: number
    paged: boolean
    unpaged: boolean
  }
  totalPages: number
  totalElements: number
  last: boolean
  first: boolean
  size: number
  number: number
  numberOfElements: number
  empty: boolean
}

// Tipos de autenticación
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  message: string;
  fullName: string;
  email: string;
  role: UserRole;
  token: string;
}

export interface RegisterAppUserRequest {
  fullName: string;
  email: string;
  password: string;
}

// ===== CATEGORÍAS =====
export interface CategoryResponse {
  id: number;
  slug: string;
  name: string;
  storeId: number;
  storeName: string;
  productCount: number;
}

export interface CreateCategoryRequest {
  name: string;
  slug: string;
  storeId: number;
}

export interface UpdateCategoryRequest {
  name: string;
  slug: string;
}

// ===== PRODUCTOS =====
export interface ProductResponse {
  id: number;
  name: string;
  slug: string;
  price: number;
  description: string;
  attributes: string;
  images: string[];
  isVisible: boolean;
  createdAt: string;
  categoryId: number;
  categoryName: string;
  storeId: number;
  storeName: string;
}

export interface CreateProductRequest {
  name: string;
  slug: string;
  price: number;
  description?: string; // Opcional en Java
  attributes?: string;  // Opcional en Java
  images?: string[];    // Opcional en Java
  categoryId: number;
  isVisible?: boolean;  // Tiene default value = true
  storeId: number;
}

export interface UpdateProductRequest {
  name: string;
  slug: string;
  price: number;
  description?: string;
  attributes?: string;
  images?: string[];
  categoryId: number;
  isVisible: boolean;
}

// ===== TIENDAS =====
export interface StoreResponse {
  id: number;
  domain: string;
  themeSettings?: string;
  categories: CategoryResponse[];
  products: ProductResponse[];
}

export interface RegisterStoreRequest {
  domain: string;
  themeSettings?: string;
}

export interface RegisterStoreWithUserRequest {
  domain: string;
  themeSettings?: string;
  fullName: string;
  email: string;
  password: string;
}

// ===== USUARIOS =====
export interface AppUserResponse {
  id: number;
  fullName: string;
  email: string;
  storeId?: number
  role: UserRole;
}




