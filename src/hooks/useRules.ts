import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { rulesService, type CreateRuleDTO } from '@/services/rules.service'

export function useRules() {
  return useQuery({
    queryKey: ['rules'],
    queryFn: () => rulesService.getAll(),
  })
}

export function useCreateRule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateRuleDTO) => rulesService.create(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rules'] })
      toast.success('Regla creada')
    },
    onError: () => toast.error('Error al crear la regla'),
  })
}

export function useToggleRule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => rulesService.toggleActive(id),
    onSuccess: (rule) => {
      qc.invalidateQueries({ queryKey: ['rules'] })
      toast.success(rule.isActive ? 'Regla activada' : 'Regla desactivada')
    },
    onError: () => toast.error('Error al actualizar la regla'),
  })
}

export function useDeleteRule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => rulesService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rules'] })
      toast.success('Regla eliminada')
    },
    onError: () => toast.error('Error al eliminar la regla'),
  })
}
