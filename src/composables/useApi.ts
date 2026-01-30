import { ref, type Ref } from 'vue'
import type { ApiError } from '@/types/api.types'

/**
 * Composable para manejar el estado de las peticiones API
 *
 * Simplifica el manejo de loading, error y data en componentes Vue
 *
 * @example
 * const { data, loading, error, execute } = useApi(productService.getAll)
 *
 * onMounted(async () => {
 *   await execute({ page: 0, size: 10 })
 * })
 */

export function useApi<T, P extends any[] = []>(apiFunction: (...args: P) => Promise<T>) {
  const data: Ref<T | null> = ref(null)
  const loading = ref(false)
  const error: Ref<ApiError | null> = ref(null)

  /**
   * Ejecutar la función API
   * @param args - Argumentos para la función API
   */
  const execute = async (...args: P): Promise<T | null> => {
    loading.value = true
    error.value = null

    try {
      const result = await apiFunction(...args)
      data.value = result
      return result
    } catch (err) {
      error.value = err as ApiError
      console.error('Error en useApi:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Resetear el estado
   */
  const reset = () => {
    data.value = null
    error.value = null
    loading.value = false
  }

  return {
    data,
    loading,
    error,
    execute,
    reset,
  }
}

/**
 * Composable para manejar múltiples peticiones API
 *
 * @example
 * const { data: products, loading, error } = useApiQuery(() => productService.getAll())
 * const { mutate: createProduct, loading: creating } = useApiMutation(productService.create)
 */

export function useApiQuery<T>(
  queryFn: () => Promise<T>,
  options: { immediate?: boolean } = { immediate: true },
) {
  const data: Ref<T | null> = ref(null)
  const loading = ref(false)
  const error: Ref<ApiError | null> = ref(null)

  const refetch = async (): Promise<T | null> => {
    loading.value = true
    error.value = null

    try {
      const result = await queryFn()
      data.value = result
      return result
    } catch (err) {
      error.value = err as ApiError
      return null
    } finally {
      loading.value = false
    }
  }

  // Ejecutar inmediatamente si immediate es true
  if (options.immediate) {
    refetch()
  }

  return {
    data,
    loading,
    error,
    refetch,
  }
}

export function useApiMutation<T, P extends any[] = []>(mutationFn: (...args: P) => Promise<T>) {
  const loading = ref(false)
  const error: Ref<ApiError | null> = ref(null)

  const mutate = async (...args: P): Promise<T | null> => {
    loading.value = true
    error.value = null

    try {
      const result = await mutationFn(...args)
      return result
    } catch (err) {
      error.value = err as ApiError
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    mutate,
    loading,
    error
  }
}
