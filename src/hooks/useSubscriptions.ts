import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
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
    onSuccess: (sub) => {
      qc.invalidateQueries({ queryKey: ['subscriptions'] })
      toast.success(sub.isActive ? 'Suscripción activada' : 'Suscripción pausada')
    },
    onError: () => toast.error('Error al actualizar la suscripción'),
  })
}
