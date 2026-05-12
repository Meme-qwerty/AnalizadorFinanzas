import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { subscriptionsService } from '@/services/subscriptions.service'

export function useSubscriptions() {
  return useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => subscriptionsService.getAll(),
  })
}

export function useToggleSubscription() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => subscriptionsService.toggleActive(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['subscriptions'] }),
  })
}
