export interface Subscription {
  id: string
  name: string
  amount: number
  currency: string
  billingCycle: 'monthly' | 'annual' | 'weekly'
  categoryIcon: string
  categoryName: string
  nextBillingDate: Date
  lastDetectedAt: Date
  isActive: boolean
  transactionCount: number
}

const MOCK_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub_1', name: 'Netflix', amount: 10900, currency: 'CLP',
    billingCycle: 'monthly', categoryIcon: '🎮', categoryName: 'Entretenimiento',
    nextBillingDate: new Date('2026-06-05'), lastDetectedAt: new Date('2026-05-05'),
    isActive: true, transactionCount: 6,
  },
  {
    id: 'sub_2', name: 'Spotify', amount: 4990, currency: 'CLP',
    billingCycle: 'monthly', categoryIcon: '🎮', categoryName: 'Entretenimiento',
    nextBillingDate: new Date('2026-06-12'), lastDetectedAt: new Date('2026-05-12'),
    isActive: true, transactionCount: 5,
  },
  {
    id: 'sub_3', name: 'Adobe Creative Cloud', amount: 35000, currency: 'CLP',
    billingCycle: 'monthly', categoryIcon: '💻', categoryName: 'Software',
    nextBillingDate: new Date('2026-06-01'), lastDetectedAt: new Date('2026-05-01'),
    isActive: true, transactionCount: 4,
  },
  {
    id: 'sub_4', name: 'iCloud 50GB', amount: 1290, currency: 'CLP',
    billingCycle: 'monthly', categoryIcon: '☁️', categoryName: 'Software',
    nextBillingDate: new Date('2026-06-18'), lastDetectedAt: new Date('2026-05-18'),
    isActive: true, transactionCount: 8,
  },
  {
    id: 'sub_5', name: 'Amazon Prime', amount: 8990, currency: 'CLP',
    billingCycle: 'annual', categoryIcon: '📦', categoryName: 'Compras',
    nextBillingDate: new Date('2026-11-20'), lastDetectedAt: new Date('2025-11-20'),
    isActive: true, transactionCount: 2,
  },
]

export const subscriptionsService = {
  async getAll(): Promise<Subscription[]> {
    // TODO: return api.get('/subscriptions').then(r => r.data)
    return [...MOCK_SUBSCRIPTIONS]
  },

  async toggleActive(id: string): Promise<Subscription> {
    // TODO: return api.patch(`/subscriptions/${id}/toggle`).then(r => r.data)
    const sub = MOCK_SUBSCRIPTIONS.find((s) => s.id === id)!
    sub.isActive = !sub.isActive
    return { ...sub }
  },
}
