import { useQuery } from '@tanstack/react-query'
import { analyticsService } from '@/services/analytics.service'

export function useDashboardSummary() {
  return useQuery({
    queryKey: ['analytics', 'summary'],
    queryFn: () => analyticsService.getDashboardSummary(),
  })
}

export function useMonthlyStats(months: number = 12) {
  return useQuery({
    queryKey: ['analytics', 'monthly', months],
    queryFn: () => analyticsService.getMonthlyStats(months),
  })
}

export function useCategoryStats() {
  return useQuery({
    queryKey: ['analytics', 'categories'],
    queryFn: () => analyticsService.getCategoryStats(),
  })
}

export function useTopMerchants() {
  return useQuery({
    queryKey: ['analytics', 'merchants'],
    queryFn: () => analyticsService.getTopMerchants(),
  })
}

export function useNetWorthHistory() {
  return useQuery({
    queryKey: ['analytics', 'net-worth'],
    queryFn: () => analyticsService.getNetWorthHistory(),
  })
}

export function useHealthScoreDetail() {
  return useQuery({
    queryKey: ['analytics', 'health-score'],
    queryFn: () => analyticsService.getHealthScoreDetail(),
  })
}
