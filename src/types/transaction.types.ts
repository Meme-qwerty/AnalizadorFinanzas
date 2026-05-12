export type TransactionType = 'income' | 'expense' | 'transfer'
export type TransactionStatus = 'pending' | 'posted' | 'cancelled'

export interface Transaction {
  id: string
  userId: string
  accountId: string
  amount: number
  type: TransactionType
  description: string
  descriptionClean: string
  merchantName?: string
  categoryId: string
  tags: string[]
  notes?: string
  currency: string
  occurredAt: Date
  postedAt: Date
  status: TransactionStatus
  isRecurring: boolean
  isDuplicate: boolean
  metadata: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
}

export interface CreateTransactionDTO {
  accountId: string
  amount: number
  type: TransactionType
  description: string
  categoryId: string
  currency?: string
  occurredAt: Date
  tags?: string[]
  notes?: string
}

export interface UpdateTransactionDTO extends Partial<CreateTransactionDTO> {
  id: string
}

export type RuleConditionType = 'description_contains' | 'merchant_is' | 'amount_gt' | 'amount_lt' | 'account_is'
export type RuleActionType = 'set_category' | 'set_tag' | 'set_merchant'

export interface Rule {
  id: string
  userId: string
  conditionType: RuleConditionType
  conditionValue: string
  actionType: RuleActionType
  actionValue: string
  priority: number
  isActive: boolean
  createdAt: Date
}

export interface TransactionFilters {
  startDate?: Date
  endDate?: Date
  categoryIds?: string[]
  type?: TransactionType
  minAmount?: number
  maxAmount?: number
  accountId?: string
  search?: string
  tags?: string[]
  page?: number
  limit?: number
}
