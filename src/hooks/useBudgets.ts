import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { budgetsService } from '@/services/budgets.service'
import type { CreateBudgetDTO } from '@/types/budget.types'

export function useBudgets() {
  return useQuery({
    queryKey: ['budgets'],
    queryFn: () => budgetsService.getAll(),
  })
}

export function useCreateBudget() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateBudgetDTO) => budgetsService.create(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['budgets'] }),
  })
}

export function useUpdateBudget() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...dto }: { id: string } & Partial<CreateBudgetDTO>) =>
      budgetsService.update(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['budgets'] }),
  })
}

export function useDeleteBudget() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => budgetsService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['budgets'] }),
  })
}
