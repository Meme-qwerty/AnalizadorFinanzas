import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { transactionsService } from '@/services/transactions.service'
import type { CreateTransactionDTO, UpdateTransactionDTO, TransactionFilters } from '@/types/transaction.types'

export function useTransactions(filters?: TransactionFilters) {
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => transactionsService.getAll(filters),
  })
}

export function useTransaction(id: string) {
  return useQuery({
    queryKey: ['transactions', id],
    queryFn: () => transactionsService.getById(id),
    enabled: !!id,
  })
}

export function useCreateTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateTransactionDTO) => transactionsService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      toast.success('Transacción guardada')
    },
    onError: () => toast.error('Error al guardar la transacción'),
  })
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: UpdateTransactionDTO) => transactionsService.update(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      toast.success('Transacción actualizada')
    },
    onError: () => toast.error('Error al actualizar la transacción'),
  })
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => transactionsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      toast.success('Transacción eliminada')
    },
    onError: () => toast.error('Error al eliminar la transacción'),
  })
}
