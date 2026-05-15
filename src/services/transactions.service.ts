import type { Transaction, CreateTransactionDTO, UpdateTransactionDTO, TransactionFilters } from '@/types/transaction.types'

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_1', userId: 'user_1', accountId: 'acc_1', amount: 3500, type: 'expense',
    description: 'SUPERMERCADO LIDER', descriptionClean: 'Supermercado Lider',
    merchantName: 'Lider', categoryId: 'cat_food', tags: [], currency: 'CLP',
    occurredAt: new Date('2026-05-08'), postedAt: new Date('2026-05-08'),
    status: 'posted', isRecurring: false, isDuplicate: false, metadata: {},
    createdAt: new Date('2026-05-08'), updatedAt: new Date('2026-05-08'),
  },
  {
    id: 'tx_2', userId: 'user_1', accountId: 'acc_1', amount: 1200000, type: 'income',
    description: 'TRANSFERENCIA EMPRESA S.A.', descriptionClean: 'Sueldo Empresa S.A.',
    categoryId: 'cat_income', tags: ['sueldo'], currency: 'CLP',
    occurredAt: new Date('2026-05-01'), postedAt: new Date('2026-05-01'),
    status: 'posted', isRecurring: true, isDuplicate: false, metadata: {},
    createdAt: new Date('2026-05-01'), updatedAt: new Date('2026-05-01'),
  },
  {
    id: 'tx_3', userId: 'user_1', accountId: 'acc_2', amount: 15990, type: 'expense',
    description: 'NETFLIX.COM', descriptionClean: 'Netflix',
    merchantName: 'Netflix', categoryId: 'cat_entertainment', tags: ['suscripción'], currency: 'CLP',
    occurredAt: new Date('2026-05-05'), postedAt: new Date('2026-05-05'),
    status: 'posted', isRecurring: true, isDuplicate: false, metadata: {},
    createdAt: new Date('2026-05-05'), updatedAt: new Date('2026-05-05'),
  },
  {
    id: 'tx_4', userId: 'user_1', accountId: 'acc_1', amount: 45000, type: 'expense',
    description: 'COPEC', descriptionClean: 'Bencina Copec',
    merchantName: 'Copec', categoryId: 'cat_transport', tags: [], currency: 'CLP',
    occurredAt: new Date('2026-05-07'), postedAt: new Date('2026-05-07'),
    status: 'posted', isRecurring: false, isDuplicate: false, metadata: {},
    createdAt: new Date('2026-05-07'), updatedAt: new Date('2026-05-07'),
  },
  {
    id: 'tx_5', userId: 'user_1', accountId: 'acc_2', amount: 8990, type: 'expense',
    description: 'SPOTIFY', descriptionClean: 'Spotify',
    merchantName: 'Spotify', categoryId: 'cat_entertainment', tags: ['suscripción'], currency: 'CLP',
    occurredAt: new Date('2026-05-05'), postedAt: new Date('2026-05-05'),
    status: 'posted', isRecurring: true, isDuplicate: false, metadata: {},
    createdAt: new Date('2026-05-05'), updatedAt: new Date('2026-05-05'),
  },
  {
    id: 'tx_6', userId: 'user_1', accountId: 'acc_1', amount: 125000, type: 'expense',
    description: 'ARRIENDO DEPTO', descriptionClean: 'Arriendo departamento',
    categoryId: 'cat_housing', tags: ['arriendo'], currency: 'CLP',
    occurredAt: new Date('2026-05-03'), postedAt: new Date('2026-05-03'),
    status: 'posted', isRecurring: true, isDuplicate: false, metadata: {},
    createdAt: new Date('2026-05-03'), updatedAt: new Date('2026-05-03'),
  },
  {
    id: 'tx_7', userId: 'user_1', accountId: 'acc_1', amount: 22500, type: 'expense',
    description: 'FARMACIA AHUMADA', descriptionClean: 'Farmacia Ahumada',
    merchantName: 'Farmacia Ahumada', categoryId: 'cat_health', tags: [], currency: 'CLP',
    occurredAt: new Date('2026-05-06'), postedAt: new Date('2026-05-06'),
    status: 'posted', isRecurring: false, isDuplicate: false, metadata: {},
    createdAt: new Date('2026-05-06'), updatedAt: new Date('2026-05-06'),
  },
  {
    id: 'tx_8', userId: 'user_1', accountId: 'acc_2', amount: 89900, type: 'expense',
    description: 'ZARA', descriptionClean: 'Zara ropa',
    merchantName: 'Zara', categoryId: 'cat_shopping', tags: [], currency: 'CLP',
    occurredAt: new Date('2026-05-04'), postedAt: new Date('2026-05-04'),
    status: 'posted', isRecurring: false, isDuplicate: false, metadata: {},
    createdAt: new Date('2026-05-04'), updatedAt: new Date('2026-05-04'),
  },
  {
    id: 'tx_9', userId: 'user_1', accountId: 'acc_1', amount: 18500, type: 'expense',
    description: 'UBER', descriptionClean: 'Uber',
    merchantName: 'Uber', categoryId: 'cat_transport', tags: [], currency: 'CLP',
    occurredAt: new Date('2026-05-09'), postedAt: new Date('2026-05-09'),
    status: 'posted', isRecurring: false, isDuplicate: false, metadata: {},
    createdAt: new Date('2026-05-09'), updatedAt: new Date('2026-05-09'),
  },
  {
    id: 'tx_10', userId: 'user_1', accountId: 'acc_1', amount: 12000, type: 'expense',
    description: 'RESTAURANT EL PARRÓN', descriptionClean: 'Restaurant El Parrón',
    merchantName: 'El Parrón', categoryId: 'cat_food', tags: [], currency: 'CLP',
    occurredAt: new Date('2026-05-10'), postedAt: new Date('2026-05-10'),
    status: 'posted', isRecurring: false, isDuplicate: false, metadata: {},
    createdAt: new Date('2026-05-10'), updatedAt: new Date('2026-05-10'),
  },
  {
    id: 'tx_11', userId: 'user_1', accountId: 'acc_2', amount: 6990, type: 'expense',
    description: 'AMAZON PRIME', descriptionClean: 'Amazon Prime',
    merchantName: 'Amazon', categoryId: 'cat_entertainment', tags: ['suscripción'], currency: 'CLP',
    occurredAt: new Date('2026-05-05'), postedAt: new Date('2026-05-05'),
    status: 'posted', isRecurring: true, isDuplicate: false, metadata: {},
    createdAt: new Date('2026-05-05'), updatedAt: new Date('2026-05-05'),
  },
  {
    id: 'tx_12', userId: 'user_1', accountId: 'acc_1', amount: 35000, type: 'expense',
    description: 'JUMBO PUDAHUEL', descriptionClean: 'Supermercado Jumbo',
    merchantName: 'Jumbo', categoryId: 'cat_food', tags: [], currency: 'CLP',
    occurredAt: new Date('2026-05-12'), postedAt: new Date('2026-05-12'),
    status: 'posted', isRecurring: false, isDuplicate: false, metadata: {},
    createdAt: new Date('2026-05-12'), updatedAt: new Date('2026-05-12'),
  },
  {
    id: 'tx_13', userId: 'user_1', accountId: 'acc_1', amount: 9500, type: 'expense',
    description: 'METRO SANTIAGO', descriptionClean: 'Metro Santiago',
    merchantName: 'Metro', categoryId: 'cat_transport', tags: [], currency: 'CLP',
    occurredAt: new Date('2026-05-11'), postedAt: new Date('2026-05-11'),
    status: 'posted', isRecurring: false, isDuplicate: false, metadata: {},
    createdAt: new Date('2026-05-11'), updatedAt: new Date('2026-05-11'),
  },
  {
    id: 'tx_14', userId: 'user_1', accountId: 'acc_2', amount: 250000, type: 'income',
    description: 'FREELANCE DISEÑO WEB', descriptionClean: 'Freelance diseño web',
    categoryId: 'cat_income', tags: ['freelance'], currency: 'CLP',
    occurredAt: new Date('2026-05-09'), postedAt: new Date('2026-05-09'),
    status: 'posted', isRecurring: false, isDuplicate: false, metadata: {},
    createdAt: new Date('2026-05-09'), updatedAt: new Date('2026-05-09'),
  },
  {
    id: 'tx_15', userId: 'user_1', accountId: 'acc_1', amount: 48000, type: 'expense',
    description: 'ENTEL MOVIL', descriptionClean: 'Plan Entel móvil',
    merchantName: 'Entel', categoryId: 'cat_services', tags: [], currency: 'CLP',
    occurredAt: new Date('2026-05-02'), postedAt: new Date('2026-05-02'),
    status: 'posted', isRecurring: true, isDuplicate: false, metadata: {},
    createdAt: new Date('2026-05-02'), updatedAt: new Date('2026-05-02'),
  },
  {
    id: 'tx_16', userId: 'user_1', accountId: 'acc_1', amount: 15000, type: 'expense',
    description: 'GIMNASIO SMART FIT', descriptionClean: 'Gimnasio Smart Fit',
    merchantName: 'Smart Fit', categoryId: 'cat_health', tags: ['suscripción'], currency: 'CLP',
    occurredAt: new Date('2026-05-01'), postedAt: new Date('2026-05-01'),
    status: 'posted', isRecurring: true, isDuplicate: false, metadata: {},
    createdAt: new Date('2026-05-01'), updatedAt: new Date('2026-05-01'),
  },
  {
    id: 'tx_17', userId: 'user_1', accountId: 'acc_2', amount: 55000, type: 'expense',
    description: 'H&M PARQUE ARAUCO', descriptionClean: 'H&M ropa',
    merchantName: 'H&M', categoryId: 'cat_shopping', tags: [], currency: 'CLP',
    occurredAt: new Date('2026-05-13'), postedAt: new Date('2026-05-13'),
    status: 'posted', isRecurring: false, isDuplicate: false, metadata: {},
    createdAt: new Date('2026-05-13'), updatedAt: new Date('2026-05-13'),
  },
  {
    id: 'tx_18', userId: 'user_1', accountId: 'acc_1', amount: 7500, type: 'expense',
    description: 'CAFÉ STARBUCKS', descriptionClean: 'Starbucks',
    merchantName: 'Starbucks', categoryId: 'cat_food', tags: [], currency: 'CLP',
    occurredAt: new Date('2026-05-14'), postedAt: new Date('2026-05-14'),
    status: 'posted', isRecurring: false, isDuplicate: false, metadata: {},
    createdAt: new Date('2026-05-14'), updatedAt: new Date('2026-05-14'),
  },
  {
    id: 'tx_19', userId: 'user_1', accountId: 'acc_1', amount: 68000, type: 'expense',
    description: 'ENEL DISTRIBUCIÓN', descriptionClean: 'Cuenta luz Enel',
    merchantName: 'Enel', categoryId: 'cat_services', tags: [], currency: 'CLP',
    occurredAt: new Date('2026-05-03'), postedAt: new Date('2026-05-03'),
    status: 'posted', isRecurring: true, isDuplicate: false, metadata: {},
    createdAt: new Date('2026-05-03'), updatedAt: new Date('2026-05-03'),
  },
  {
    id: 'tx_20', userId: 'user_1', accountId: 'acc_2', amount: 14990, type: 'expense',
    description: 'DISNEY PLUS', descriptionClean: 'Disney+',
    merchantName: 'Disney', categoryId: 'cat_entertainment', tags: ['suscripción'], currency: 'CLP',
    occurredAt: new Date('2026-05-05'), postedAt: new Date('2026-05-05'),
    status: 'posted', isRecurring: true, isDuplicate: false, metadata: {},
    createdAt: new Date('2026-05-05'), updatedAt: new Date('2026-05-05'),
  },
  {
    id: 'tx_21', userId: 'user_1', accountId: 'acc_1', amount: 38500, type: 'expense',
    description: 'RAPPI MARKET', descriptionClean: 'Rappi Market',
    merchantName: 'Rappi', categoryId: 'cat_food', tags: [], currency: 'CLP',
    occurredAt: new Date('2026-05-15'), postedAt: new Date('2026-05-15'),
    status: 'posted', isRecurring: false, isDuplicate: false, metadata: {},
    createdAt: new Date('2026-05-15'), updatedAt: new Date('2026-05-15'),
  },
  {
    id: 'tx_22', userId: 'user_1', accountId: 'acc_1', amount: 12800, type: 'expense',
    description: 'FARMACIAS CRUZ VERDE', descriptionClean: 'Cruz Verde',
    merchantName: 'Cruz Verde', categoryId: 'cat_health', tags: [], currency: 'CLP',
    occurredAt: new Date('2026-05-13'), postedAt: new Date('2026-05-13'),
    status: 'posted', isRecurring: false, isDuplicate: false, metadata: {},
    createdAt: new Date('2026-05-13'), updatedAt: new Date('2026-05-13'),
  },
  {
    id: 'tx_23', userId: 'user_1', accountId: 'acc_2', amount: 95000, type: 'expense',
    description: 'APPLE ICLOUD+', descriptionClean: 'Apple iCloud+',
    merchantName: 'Apple', categoryId: 'cat_services', tags: ['suscripción'], currency: 'CLP',
    occurredAt: new Date('2026-05-01'), postedAt: new Date('2026-05-01'),
    status: 'posted', isRecurring: true, isDuplicate: false, metadata: {},
    createdAt: new Date('2026-05-01'), updatedAt: new Date('2026-05-01'),
  },
  {
    id: 'tx_24', userId: 'user_1', accountId: 'acc_1', amount: 33000, type: 'expense',
    description: 'FALABELLA.COM', descriptionClean: 'Falabella online',
    merchantName: 'Falabella', categoryId: 'cat_shopping', tags: [], currency: 'CLP',
    occurredAt: new Date('2026-05-11'), postedAt: new Date('2026-05-11'),
    status: 'posted', isRecurring: false, isDuplicate: false, metadata: {},
    createdAt: new Date('2026-05-11'), updatedAt: new Date('2026-05-11'),
  },
  {
    id: 'tx_25', userId: 'user_1', accountId: 'acc_1', amount: 21500, type: 'expense',
    description: 'DIDECO AGUA', descriptionClean: 'Cuenta de agua',
    categoryId: 'cat_services', tags: [], currency: 'CLP',
    occurredAt: new Date('2026-05-04'), postedAt: new Date('2026-05-04'),
    status: 'posted', isRecurring: true, isDuplicate: false, metadata: {},
    createdAt: new Date('2026-05-04'), updatedAt: new Date('2026-05-04'),
  },
]

let mockData = [...MOCK_TRANSACTIONS]

export const transactionsService = {
  async getAll(filters?: TransactionFilters): Promise<Transaction[]> {
    let result = [...mockData]
    if (filters?.type) result = result.filter((t) => t.type === filters.type)
    if (filters?.categoryIds?.length) result = result.filter((t) => filters.categoryIds!.includes(t.categoryId))
    if (filters?.accountId) result = result.filter((t) => t.accountId === filters.accountId)
    if (filters?.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (t) => t.descriptionClean.toLowerCase().includes(q) || t.merchantName?.toLowerCase().includes(q)
      )
    }
    if (filters?.minAmount !== undefined) result = result.filter((t) => t.amount >= filters.minAmount!)
    if (filters?.maxAmount !== undefined) result = result.filter((t) => t.amount <= filters.maxAmount!)
    return result.sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime())
  },

  async getById(id: string): Promise<Transaction | undefined> {
    return mockData.find((t) => t.id === id)
  },

  async create(dto: CreateTransactionDTO): Promise<Transaction> {
    const newTransaction: Transaction = {
      id: `tx_${Date.now()}`,
      userId: 'user_1',
      descriptionClean: dto.description,
      tags: dto.tags ?? [],
      status: 'posted',
      isRecurring: false,
      isDuplicate: false,
      metadata: {},
      postedAt: dto.occurredAt,
      createdAt: new Date(),
      updatedAt: new Date(),
      currency: dto.currency ?? 'CLP',
      ...dto,
    }
    mockData = [newTransaction, ...mockData]
    return newTransaction
  },

  async update(dto: UpdateTransactionDTO): Promise<Transaction> {
    mockData = mockData.map((t) => (t.id === dto.id ? { ...t, ...dto, updatedAt: new Date() } : t))
    return mockData.find((t) => t.id === dto.id)!
  },

  async delete(id: string): Promise<void> {
    mockData = mockData.filter((t) => t.id !== id)
  },
}
