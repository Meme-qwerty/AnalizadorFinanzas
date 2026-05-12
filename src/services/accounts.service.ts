import type { Account, CreateAccountDTO } from '@/types/account.types'

const MOCK_ACCOUNTS: Account[] = [
  {
    id: 'acc_1',
    userId: 'user_1',
    name: 'Cuenta Corriente BCI',
    type: 'checking',
    balance: 850000,
    currency: 'CLP',
    color: '#3B82F6',
    isManual: true,
    createdAt: new Date('2026-01-01'),
  },
  {
    id: 'acc_2',
    userId: 'user_1',
    name: 'Tarjeta Crédito Santander',
    type: 'credit',
    balance: -120000,
    currency: 'CLP',
    color: '#EF4444',
    isManual: true,
    createdAt: new Date('2026-01-01'),
  },
  {
    id: 'acc_3',
    userId: 'user_1',
    name: 'Cuenta Ahorro',
    type: 'savings',
    balance: 2500000,
    currency: 'CLP',
    color: '#10B981',
    isManual: true,
    createdAt: new Date('2026-01-01'),
  },
]

let mockData = [...MOCK_ACCOUNTS]

export const accountsService = {
  async getAll(): Promise<Account[]> {
    // TODO: return api.get('/accounts').then(r => r.data)
    return mockData
  },

  async create(dto: CreateAccountDTO): Promise<Account> {
    // TODO: return api.post('/accounts', dto).then(r => r.data)
    const newAccount: Account = {
      id: `acc_${Date.now()}`,
      userId: 'user_1',
      currency: dto.currency ?? 'CLP',
      isManual: true,
      createdAt: new Date(),
      ...dto,
    }
    mockData = [...mockData, newAccount]
    return newAccount
  },

  async getTotalBalance(): Promise<number> {
    const accounts = await accountsService.getAll()
    return accounts.reduce((sum, acc) => sum + acc.balance, 0)
  },
}
