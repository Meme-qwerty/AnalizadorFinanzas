import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { categoriesService } from '@/services/categories.service'
import type { CreateCategoryDTO } from '@/types/category.types'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesService.getAll(),
    staleTime: 10 * 60 * 1000,
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateCategoryDTO) => categoriesService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Categoría creada')
    },
    onError: () => toast.error('Error al crear la categoría'),
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => categoriesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Categoría eliminada')
    },
    onError: () => toast.error('Error al eliminar la categoría'),
  })
}
