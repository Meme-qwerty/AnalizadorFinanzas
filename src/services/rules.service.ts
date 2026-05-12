import type { Rule } from '@/types/transaction.types'

// Re-export Rule type for convenience
export type { Rule }

const MOCK_RULES: Rule[] = [
  {
    id: 'rule_1', userId: 'user_1', conditionType: 'description_contains',
    conditionValue: 'NETFLIX', actionType: 'set_category', actionValue: 'cat_entertainment',
    priority: 1, isActive: true, createdAt: new Date('2026-01-01'),
  },
  {
    id: 'rule_2', userId: 'user_1', conditionType: 'description_contains',
    conditionValue: 'SPOTIFY', actionType: 'set_category', actionValue: 'cat_entertainment',
    priority: 2, isActive: true, createdAt: new Date('2026-01-01'),
  },
  {
    id: 'rule_3', userId: 'user_1', conditionType: 'description_contains',
    conditionValue: 'COPEC', actionType: 'set_category', actionValue: 'cat_transport',
    priority: 3, isActive: true, createdAt: new Date('2026-01-01'),
  },
  {
    id: 'rule_4', userId: 'user_1', conditionType: 'description_contains',
    conditionValue: 'LIDER', actionType: 'set_category', actionValue: 'cat_food',
    priority: 4, isActive: false, createdAt: new Date('2026-01-15'),
  },
  {
    id: 'rule_5', userId: 'user_1', conditionType: 'amount_gt',
    conditionValue: '500000', actionType: 'set_tag', actionValue: 'gasto-grande',
    priority: 5, isActive: true, createdAt: new Date('2026-02-01'),
  },
]

let mockData = [...MOCK_RULES]

const CATEGORY_NAMES: Record<string, string> = {
  cat_food: '🍔 Alimentación', cat_transport: '🚗 Transporte',
  cat_entertainment: '🎮 Entretenimiento', cat_health: '🏥 Salud',
  cat_shopping: '🛍️ Compras', cat_income: '💰 Ingresos', cat_other: '📦 Otros',
}

export const CONDITION_LABELS: Record<string, string> = {
  description_contains: 'Descripción contiene',
  merchant_is: 'Comercio es',
  amount_gt: 'Monto mayor a',
  amount_lt: 'Monto menor a',
  account_is: 'Cuenta es',
}

export const ACTION_LABELS: Record<string, string> = {
  set_category: 'Asignar categoría',
  set_tag: 'Asignar etiqueta',
  set_merchant: 'Asignar comercio',
}

export function formatRuleCondition(rule: Rule): string {
  const label = CONDITION_LABELS[rule.conditionType] ?? rule.conditionType
  const val = rule.conditionType === 'amount_gt' || rule.conditionType === 'amount_lt'
    ? `$${Number(rule.conditionValue).toLocaleString('es-CL')}`
    : rule.conditionValue
  return `${label}: "${val}"`
}

export function formatRuleAction(rule: Rule): string {
  const label = ACTION_LABELS[rule.actionType] ?? rule.actionType
  const val = rule.actionType === 'set_category'
    ? (CATEGORY_NAMES[rule.actionValue] ?? rule.actionValue)
    : `"${rule.actionValue}"`
  return `${label} → ${val}`
}

export interface CreateRuleDTO {
  conditionType: Rule['conditionType']
  conditionValue: string
  actionType: Rule['actionType']
  actionValue: string
}

export const rulesService = {
  async getAll(): Promise<Rule[]> {
    // TODO: return api.get('/rules').then(r => r.data)
    return [...mockData].sort((a, b) => a.priority - b.priority)
  },

  async create(dto: CreateRuleDTO): Promise<Rule> {
    // TODO: return api.post('/rules', dto).then(r => r.data)
    const rule: Rule = {
      id: `rule_${Date.now()}`, userId: 'user_1',
      priority: mockData.length + 1, isActive: true, createdAt: new Date(), ...dto,
    }
    mockData = [...mockData, rule]
    return rule
  },

  async toggleActive(id: string): Promise<Rule> {
    // TODO: return api.patch(`/rules/${id}/toggle`).then(r => r.data)
    mockData = mockData.map((r) => r.id === id ? { ...r, isActive: !r.isActive } : r)
    return mockData.find((r) => r.id === id)!
  },

  async delete(id: string): Promise<void> {
    // TODO: return api.delete(`/rules/${id}`)
    mockData = mockData.filter((r) => r.id !== id)
  },
}
