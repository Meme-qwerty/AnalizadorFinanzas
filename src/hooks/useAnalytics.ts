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

export function useTopExpenses() {
  return useQuery({
    queryKey: ['analytics', 'top-expenses'],
    queryFn: () => analyticsService.getTopExpenses(),
  })
}

export function useDayOfWeekStats() {
  return useQuery({
    queryKey: ['analytics', 'day-of-week'],
    queryFn: () => analyticsService.getDayOfWeekStats(),
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

export function useWeeklySummary() {
  return useQuery({
    queryKey: ['analytics', 'weekly'],
    queryFn: () => analyticsService.getWeeklySummary(),
  })
}

export function useHealthScoreDetail() {
  return useQuery({
    queryKey: ['analytics', 'health-score'],
    queryFn: () => analyticsService.getHealthScoreDetail(),
  })
}
