import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { accountsService } from '@/services/accounts.service'
import type { CreateAccountDTO } from '@/types/account.types'

export function useAccounts() {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: () => accountsService.getAll(),
  })
}

export function useTotalBalance() {
  return useQuery({
    queryKey: ['accounts', 'balance'],
    queryFn: () => accountsService.getTotalBalance(),
  })
}

export function useCreateAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateAccountDTO) => accountsService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success('Cuenta creada')
    },
    onError: () => toast.error('Error al crear la cuenta'),
  })
}
