export type BudgetPeriod = 'monthly' | 'quarterly' | 'annual' | 'custom'

export interface Budget {
  id: string
  userId: string
  categoryId: string
  amount: number
  currency: string
  period: BudgetPeriod
  startDate: Date
  endDate: Date
  alertThresholds: number[]
  createdAt: Date
}

export interface BudgetWithStats extends Budget {
  spent: number
  remaining: number
  percentage: number
  categoryName: string
  categoryIcon: string
  categoryColor: string
}

export interface CreateBudgetDTO {
  categoryId: string
  amount: number
  period: BudgetPeriod
  startDate: Date
  endDate: Date
  alertThresholds?: number[]
}
