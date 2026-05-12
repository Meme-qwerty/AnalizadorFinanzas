import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
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
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['goals'] })
      toast.success('Meta creada')
    },
    onError: () => toast.error('Error al crear la meta'),
  })
}

export function useAddContribution() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, amount }: { id: string; amount: number }) =>
      goalsService.addContribution(id, amount),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['goals'] })
      toast.success('Aporte registrado')
    },
    onError: () => toast.error('Error al registrar el aporte'),
  })
}

export function useDeleteGoal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => goalsService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['goals'] })
      toast.success('Meta eliminada')
    },
    onError: () => toast.error('Error al eliminar la meta'),
  })
}
