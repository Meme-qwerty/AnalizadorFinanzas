import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { goalsService } from '@/services/goals.service'
import type { CreateGoalDTO } from '@/types/goal.types'

export function useGoals() {
  return useQuery({
    queryKey: ['goals'],
    queryFn: () => goalsService.getAll(),
  })
}

export function useCreateGoal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateGoalDTO) => goalsService.create(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['goals'] }),
  })
}

export function useAddContribution() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, amount }: { id: string; amount: number }) =>
      goalsService.addContribution(id, amount),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['goals'] }),
  })
}

export function useDeleteGoal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => goalsService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['goals'] }),
  })
}
