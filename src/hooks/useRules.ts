import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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
    onSuccess: () => qc.invalidateQueries({ queryKey: ['rules'] }),
  })
}

export function useToggleRule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => rulesService.toggleActive(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['rules'] }),
  })
}

export function useDeleteRule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => rulesService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['rules'] }),
  })
}
