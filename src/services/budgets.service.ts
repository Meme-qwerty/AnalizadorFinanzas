import type { Budget, BudgetWithStats, CreateBudgetDTO } from '@/types/budget.types'

const now = new Date()
const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

const MOCK_BUDGETS: Budget[] = [
  {
    id: 'bud_1', userId: 'user_1', categoryId: 'cat_food', amount: 200000, currency: 'CLP',
    period: 'monthly', startDate: startOfMonth, endDate: endOfMonth,
    alertThresholds: [0.5, 0.75, 0.9, 1.0], createdAt: new Date('2026-01-01'),
  },
  {
    id: 'bud_2', userId: 'user_1', categoryId: 'cat_transport', amount: 80000, currency: 'CLP',
    period: 'monthly', startDate: startOfMonth, endDate: endOfMonth,
    alertThresholds: [0.5, 0.75, 0.9, 1.0], createdAt: new Date('2026-01-01'),
  },
  {
    id: 'bud_3', userId: 'user_1', categoryId: 'cat_entertainment', amount: 60000, currency: 'CLP',
    period: 'monthly', startDate: startOfMonth, endDate: endOfMonth,
    alertThresholds: [0.5, 0.75, 0.9, 1.0], createdAt: new Date('2026-01-01'),
  },
  {
    id: 'bud_4', userId: 'user_1', categoryId: 'cat_health', amount: 50000, currency: 'CLP',
    period: 'monthly', startDate: startOfMonth, endDate: endOfMonth,
    alertThresholds: [0.5, 0.75, 0.9, 1.0], createdAt: new Date('2026-01-01'),
  },
  {
    id: 'bud_5', userId: 'user_1', categoryId: 'cat_shopping', amount: 100000, currency: 'CLP',
    period: 'monthly', startDate: startOfMonth, endDate: endOfMonth,
    alertThresholds: [0.5, 0.75, 0.9, 1.0], createdAt: new Date('2026-01-01'),
  },
]

// Mock spent amounts per category
const MOCK_SPENT: Record<string, number> = {
  cat_food: 185000,
  cat_transport: 63500,
  cat_entertainment: 63990,
  cat_health: 22500,
  cat_shopping: 89900,
}

const CATEGORY_META: Record<string, { name: string; icon: string; color: string }> = {
  cat_food: { name: 'Alimentación', icon: '🍔', color: '#F97316' },
  cat_transport: { name: 'Transporte', icon: '🚗', color: '#3B82F6' },
  cat_entertainment: { name: 'Entretenimiento', icon: '🎮', color: '#EC4899' },
  cat_health: { name: 'Salud', icon: '🏥', color: '#EF4444' },
  cat_shopping: { name: 'Compras', icon: '🛍️', color: '#F59E0B' },
}

let mockData = [...MOCK_BUDGETS]

export const budgetsService = {
  async getAll(): Promise<BudgetWithStats[]> {
    // TODO: return api.get('/budgets').then(r => r.data)
    return mockData.map((b) => {
      const spent = MOCK_SPENT[b.categoryId] ?? 0
      const meta = CATEGORY_META[b.categoryId] ?? { name: b.categoryId, icon: '📦', color: '#6B7280' }
      return {
        ...b,
        spent,
        remaining: b.amount - spent,
        percentage: Math.min((spent / b.amount) * 100, 100),
        categoryName: meta.name,
        categoryIcon: meta.icon,
        categoryColor: meta.color,
      }
    })
  },

  async create(dto: CreateBudgetDTO): Promise<Budget> {
    // TODO: return api.post('/budgets', dto).then(r => r.data)
    const budget: Budget = {
      id: `bud_${Date.now()}`, userId: 'user_1', currency: 'CLP',
      alertThresholds: dto.alertThresholds ?? [0.5, 0.75, 0.9, 1.0],
      createdAt: new Date(), ...dto,
    }
    mockData = [...mockData, budget]
    return budget
  },

  async update(id: string, dto: Partial<CreateBudgetDTO>): Promise<Budget> {
    // TODO: return api.patch(`/budgets/${id}`, dto).then(r => r.data)
    mockData = mockData.map((b) => b.id === id ? { ...b, ...dto } : b)
    return mockData.find((b) => b.id === id)!
  },

  async delete(id: string): Promise<void> {
    // TODO: return api.delete(`/budgets/${id}`)
    mockData = mockData.filter((b) => b.id !== id)
  },
}
