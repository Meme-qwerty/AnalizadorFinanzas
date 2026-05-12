import type { Goal, CreateGoalDTO } from '@/types/goal.types'

const MOCK_GOALS: Goal[] = [
  {
    id: 'goal_1', userId: 'user_1', name: 'Fondo de emergencia', icon: '🛡️',
    targetAmount: 3000000, currentAmount: 2500000, currency: 'CLP',
    deadline: undefined, status: 'active', createdAt: new Date('2026-01-01'),
  },
  {
    id: 'goal_2', userId: 'user_1', name: 'Vacaciones Europa', icon: '✈️',
    targetAmount: 4000000, currentAmount: 850000, currency: 'CLP',
    deadline: new Date('2026-12-01'), status: 'active', createdAt: new Date('2026-02-01'),
  },
  {
    id: 'goal_3', userId: 'user_1', name: 'Notebook nuevo', icon: '💻',
    targetAmount: 800000, currentAmount: 800000, currency: 'CLP',
    deadline: undefined, status: 'completed', createdAt: new Date('2025-10-01'),
  },
  {
    id: 'goal_4', userId: 'user_1', name: 'Auto 2027', icon: '🚗',
    targetAmount: 10000000, currentAmount: 1200000, currency: 'CLP',
    deadline: new Date('2027-06-01'), status: 'active', createdAt: new Date('2026-03-01'),
  },
]

let mockData = [...MOCK_GOALS]

export const goalsService = {
  async getAll(): Promise<Goal[]> {
    // TODO: return api.get('/goals').then(r => r.data)
    return mockData
  },

  async create(dto: CreateGoalDTO): Promise<Goal> {
    // TODO: return api.post('/goals', dto).then(r => r.data)
    const goal: Goal = {
      id: `goal_${Date.now()}`, userId: 'user_1',
      currentAmount: 0, currency: 'CLP', status: 'active',
      createdAt: new Date(), ...dto,
    }
    mockData = [...mockData, goal]
    return goal
  },

  async addContribution(id: string, amount: number): Promise<Goal> {
    // TODO: return api.post(`/goals/${id}/contributions`, { amount }).then(r => r.data)
    mockData = mockData.map((g) => {
      if (g.id !== id) return g
      const newAmount = g.currentAmount + amount
      return {
        ...g,
        currentAmount: Math.min(newAmount, g.targetAmount),
        status: newAmount >= g.targetAmount ? 'completed' : g.status,
      }
    })
    return mockData.find((g) => g.id === id)!
  },

  async delete(id: string): Promise<void> {
    // TODO: return api.delete(`/goals/${id}`)
    mockData = mockData.filter((g) => g.id !== id)
  },
}
