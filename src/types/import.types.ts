export type ImportStatus = 'pending' | 'processing' | 'completed' | 'error'

export type MappableField = 'date' | 'amount' | 'description' | 'type' | 'skip'

export interface ColumnMapping {
  [csvColumn: string]: MappableField
}

export interface ParsedRow {
  [key: string]: string
}

export interface ValidatedRow {
  raw: ParsedRow
  date?: Date
  amount?: number
  description?: string
  type?: 'income' | 'expense'
  errors: string[]
  isDuplicate: boolean
}

export interface ImportJob {
  id: string
  fileName: string
  status: ImportStatus
  totalRows: number
  importedRows: number
  rejectedRows: number
  duplicateRows: number
  createdAt: Date
  completedAt?: Date
}

export interface ImportResult {
  imported: number
  rejected: number
  duplicates: number
  errors: { row: number; message: string }[]
}
