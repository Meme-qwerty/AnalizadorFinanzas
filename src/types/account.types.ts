export type AccountType = 'checking' | 'savings' | 'credit' | 'cash' | 'investment'

export interface Account {
  id: string
  userId: string
  name: string
  type: AccountType
  balance: number
  currency: string
  color: string
  institutionId?: string
  isManual: boolean
  lastSyncAt?: Date
  createdAt: Date
}

export interface CreateAccountDTO {
  name: string
  type: AccountType
  balance: number
  currency?: string
  color: string
}
