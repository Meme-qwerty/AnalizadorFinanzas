export const TRANSACTION_TYPES = {
  income: 'Ingreso',
  expense: 'Gasto',
  transfer: 'Transferencia',
} as const

export const ACCOUNT_TYPES = {
  checking: 'Cuenta Corriente',
  savings: 'Cuenta de Ahorro',
  credit: 'Tarjeta de Crédito',
  cash: 'Efectivo',
  investment: 'Inversión',
} as const

export const BUDGET_PERIODS = {
  monthly: 'Mensual',
  quarterly: 'Trimestral',
  annual: 'Anual',
  custom: 'Personalizado',
} as const

export const DEFAULT_CURRENCY = 'CLP'

export const DEFAULT_ALERT_THRESHOLDS = [0.5, 0.75, 0.9, 1.0]

export const ITEMS_PER_PAGE = 20

export const SYSTEM_CATEGORIES = [
  { id: 'cat_food', name: 'Alimentación', icon: '🍔', color: '#F97316' },
  { id: 'cat_transport', name: 'Transporte', icon: '🚗', color: '#3B82F6' },
  { id: 'cat_housing', name: 'Vivienda', icon: '🏠', color: '#8B5CF6' },
  { id: 'cat_health', name: 'Salud', icon: '🏥', color: '#EF4444' },
  { id: 'cat_entertainment', name: 'Entretenimiento', icon: '🎮', color: '#EC4899' },
  { id: 'cat_education', name: 'Educación', icon: '📚', color: '#10B981' },
  { id: 'cat_shopping', name: 'Compras', icon: '🛍️', color: '#F59E0B' },
  { id: 'cat_income', name: 'Ingresos', icon: '💰', color: '#16A34A' },
  { id: 'cat_savings', name: 'Ahorro', icon: '🐷', color: '#06B6D4' },
  { id: 'cat_other', name: 'Otros', icon: '📦', color: '#6B7280' },
] as const
