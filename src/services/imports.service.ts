import type { ImportJob, ImportResult, ValidatedRow, ColumnMapping, ParsedRow } from '@/types/import.types'
import { transactionsService } from './transactions.service'

const MOCK_HISTORY: ImportJob[] = [
  {
    id: 'imp_1', fileName: 'cartola_abril_2026.csv', status: 'completed',
    totalRows: 48, importedRows: 45, rejectedRows: 1, duplicateRows: 2,
    createdAt: new Date('2026-05-01T10:30:00'), completedAt: new Date('2026-05-01T10:30:05'),
  },
  {
    id: 'imp_2', fileName: 'cartola_marzo_2026.csv', status: 'completed',
    totalRows: 52, importedRows: 50, rejectedRows: 2, duplicateRows: 0,
    createdAt: new Date('2026-04-02T09:15:00'), completedAt: new Date('2026-04-02T09:15:04'),
  },
]

let mockHistory = [...MOCK_HISTORY]

// Detects which CSV column likely maps to a given field
export function autoDetectColumns(headers: string[]): ColumnMapping {
  const mapping: ColumnMapping = {}
  const rules: { field: 'date' | 'amount' | 'description' | 'type'; patterns: RegExp[] }[] = [
    { field: 'date', patterns: [/fecha|date|día|dia|f\.op|fecop/i] },
    { field: 'amount', patterns: [/monto|amount|valor|importe|cargo|abono|debito|credito|total/i] },
    { field: 'description', patterns: [/descripci[oó]n|description|glosa|detalle|concepto|comercio/i] },
    { field: 'type', patterns: [/tipo|type|movimiento|clase/i] },
  ]

  const usedFields = new Set<string>()
  for (const header of headers) {
    for (const { field, patterns } of rules) {
      if (!usedFields.has(field) && patterns.some((p) => p.test(header))) {
        mapping[header] = field
        usedFields.add(field)
        break
      }
    }
    if (!mapping[header]) mapping[header] = 'skip'
  }
  return mapping
}

export function validateRows(rows: ParsedRow[], mapping: ColumnMapping): ValidatedRow[] {
  const dateCol = Object.entries(mapping).find(([, v]) => v === 'date')?.[0]
  const amountCol = Object.entries(mapping).find(([, v]) => v === 'amount')?.[0]
  const descCol = Object.entries(mapping).find(([, v]) => v === 'description')?.[0]
  const typeCol = Object.entries(mapping).find(([, v]) => v === 'type')?.[0]

  return rows.map((row) => {
    const errors: string[] = []
    let date: Date | undefined
    let amount: number | undefined
    let description: string | undefined
    let type: 'income' | 'expense' | undefined

    // Parse date
    if (dateCol && row[dateCol]) {
      const parsed = new Date(row[dateCol].replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1'))
      if (isNaN(parsed.getTime())) errors.push('Fecha inválida')
      else date = parsed
    } else {
      errors.push('Fecha requerida')
    }

    // Parse amount
    if (amountCol && row[amountCol]) {
      const clean = row[amountCol].replace(/[$.\s]/g, '').replace(',', '.')
      const num = parseFloat(clean)
      if (isNaN(num)) errors.push('Monto inválido')
      else amount = Math.abs(num)
    } else {
      errors.push('Monto requerido')
    }

    // Parse description
    if (descCol && row[descCol]) {
      description = row[descCol].trim()
    } else {
      errors.push('Descripción requerida')
    }

    // Parse type (heuristic if no explicit column)
    if (typeCol && row[typeCol]) {
      const val = row[typeCol].toLowerCase()
      type = /ingreso|abono|crédito|credito|credit/i.test(val) ? 'income' : 'expense'
    } else if (amountCol && row[amountCol]) {
      // Negative amounts are expenses in some bank formats
      const raw = row[amountCol].replace(/[$.\s]/g, '').replace(',', '.')
      type = parseFloat(raw) < 0 ? 'expense' : 'income'
    } else {
      type = 'expense'
    }

    return { raw: row, date, amount, description, type, errors, isDuplicate: false }
  })
}

export const importsService = {
  async getHistory(): Promise<ImportJob[]> {
    // TODO: return api.get('/imports').then(r => r.data)
    return [...mockHistory].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  },

  async processImport(
    validRows: ValidatedRow[],
    fileName: string,
    defaultCategoryId: string,
    defaultAccountId: string,
  ): Promise<ImportResult> {
    // TODO: send to API
    const result: ImportResult = { imported: 0, rejected: 0, duplicates: 0, errors: [] }

    for (let i = 0; i < validRows.length; i++) {
      const row = validRows[i]
      if (row.errors.length > 0) {
        result.rejected++
        result.errors.push({ row: i + 1, message: row.errors.join(', ') })
        continue
      }
      if (row.isDuplicate) {
        result.duplicates++
        continue
      }
      await transactionsService.create({
        amount: row.amount!,
        type: row.type!,
        description: row.description!,
        categoryId: defaultCategoryId,
        accountId: defaultAccountId,
        occurredAt: row.date!,
        currency: 'CLP',
      })
      result.imported++
    }

    const job: ImportJob = {
      id: `imp_${Date.now()}`,
      fileName,
      status: 'completed',
      totalRows: validRows.length,
      importedRows: result.imported,
      rejectedRows: result.rejected,
      duplicateRows: result.duplicates,
      createdAt: new Date(),
      completedAt: new Date(),
    }
    mockHistory = [job, ...mockHistory]
    return result
  },
}
