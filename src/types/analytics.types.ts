export interface MonthlyStats {
  month: string
  income: number
  expenses: number
  savings: number
  savingsRate: number
}

export interface CategoryStat {
  categoryId: string
  categoryName: string
  categoryIcon: string
  categoryColor: string
  amount: number
  percentage: number
  transactionCount: number
}

export interface FinancialHealthScore {
  score: number
  savingsRate: number
  budgetCompliance: number
  expenseDiversification: number
  incomeRegularity: number
  goalProgress: number
  hasEmergencyFund: boolean
}

export interface DashboardSummary {
  totalBalance: number
  monthlyIncome: number
  monthlyExpenses: number
  monthlySavings: number
  budgetRemaining: number
  healthScore: number
}

export interface TopMerchant {
  name: string
  amount: number
  count: number
  categoryIcon: string
}

export interface NetWorthSnapshot {
  month: string
  assets: number
  liabilities: number
  netWorth: number
}

export interface HealthScoreDetail {
  score: number
  savingsRate: number
  budgetCompliance: number
  expenseDiversification: number
  incomeRegularity: number
  goalProgress: number
  hasEmergencyFund: boolean
  trend: 'up' | 'down' | 'stable'
  previousScore: number
}
