import type { MonthlyStats, CategoryStat, DashboardSummary, TopMerchant, NetWorthSnapshot, HealthScoreDetail } from '@/types/analytics.types'

export const analyticsService = {
  async getDashboardSummary(): Promise<DashboardSummary> {
    // TODO: return api.get('/analytics/summary').then(r => r.data)
    return {
      totalBalance: 3230000,
      monthlyIncome: 1200000,
      monthlyExpenses: 487500,
      monthlySavings: 712500,
      budgetRemaining: 312500,
      healthScore: 74,
    }
  },

  async getMonthlyStats(_months: number = 12): Promise<MonthlyStats[]> {
    // TODO: return api.get('/analytics/monthly', { params: { months: _months } }).then(r => r.data)
    return [
      { month: 'Dic 2025', income: 1200000, expenses: 520000, savings: 680000, savingsRate: 56.7 },
      { month: 'Ene 2026', income: 1200000, expenses: 610000, savings: 590000, savingsRate: 49.2 },
      { month: 'Feb 2026', income: 1200000, expenses: 450000, savings: 750000, savingsRate: 62.5 },
      { month: 'Mar 2026', income: 1350000, expenses: 530000, savings: 820000, savingsRate: 60.7 },
      { month: 'Abr 2026', income: 1200000, expenses: 498000, savings: 702000, savingsRate: 58.5 },
      { month: 'May 2026', income: 1200000, expenses: 487500, savings: 712500, savingsRate: 59.4 },
    ]
  },

  async getCategoryStats(): Promise<CategoryStat[]> {
    // TODO: return api.get('/analytics/categories').then(r => r.data)
    return [
      { categoryId: 'cat_food', categoryName: 'Alimentación', categoryIcon: '🍔', categoryColor: '#F97316', amount: 185000, percentage: 37.9, transactionCount: 18 },
      { categoryId: 'cat_transport', categoryName: 'Transporte', categoryIcon: '🚗', categoryColor: '#3B82F6', amount: 95000, percentage: 19.5, transactionCount: 12 },
      { categoryId: 'cat_entertainment', categoryName: 'Entretenimiento', categoryIcon: '🎮', categoryColor: '#EC4899', amount: 78000, percentage: 16.0, transactionCount: 5 },
      { categoryId: 'cat_housing', categoryName: 'Vivienda', categoryIcon: '🏠', categoryColor: '#8B5CF6', amount: 65000, percentage: 13.3, transactionCount: 3 },
      { categoryId: 'cat_other', categoryName: 'Otros', categoryIcon: '📦', categoryColor: '#6B7280', amount: 64500, percentage: 13.2, transactionCount: 8 },
    ]
  },

  async getTopMerchants(): Promise<TopMerchant[]> {
    // TODO: return api.get('/analytics/merchants/top').then(r => r.data)
    return [
      { name: 'Lider', amount: 68000, count: 8, categoryIcon: '🍔' },
      { name: 'Copec', amount: 54000, count: 6, categoryIcon: '🚗' },
      { name: 'Netflix', amount: 10900, count: 1, categoryIcon: '🎮' },
      { name: 'Spotify', amount: 4990, count: 1, categoryIcon: '🎮' },
      { name: 'Zara', amount: 89900, count: 2, categoryIcon: '🛍️' },
      { name: 'Farmacia Cruz Verde', amount: 22000, count: 3, categoryIcon: '🏥' },
      { name: 'Uber', amount: 18500, count: 5, categoryIcon: '🚗' },
    ]
  },

  async getNetWorthHistory(): Promise<NetWorthSnapshot[]> {
    // TODO: return api.get('/analytics/net-worth/history').then(r => r.data)
    return [
      { month: 'Nov 2025', assets: 4100000, liabilities: 1200000, netWorth: 2900000 },
      { month: 'Dic 2025', assets: 4350000, liabilities: 1180000, netWorth: 3170000 },
      { month: 'Ene 2026', assets: 4520000, liabilities: 1150000, netWorth: 3370000 },
      { month: 'Feb 2026', assets: 4800000, liabilities: 1120000, netWorth: 3680000 },
      { month: 'Mar 2026', assets: 5100000, liabilities: 1090000, netWorth: 4010000 },
      { month: 'Abr 2026', assets: 5380000, liabilities: 1060000, netWorth: 4320000 },
      { month: 'May 2026', assets: 5650000, liabilities: 1030000, netWorth: 4620000 },
    ]
  },

  async getHealthScoreDetail(): Promise<HealthScoreDetail> {
    // TODO: return api.get('/analytics/health-score').then(r => r.data)
    return {
      score: 74,
      savingsRate: 59.4,
      budgetCompliance: 82,
      expenseDiversification: 71,
      incomeRegularity: 90,
      goalProgress: 48,
      hasEmergencyFund: true,
      trend: 'up',
      previousScore: 68,
    }
  },
}
