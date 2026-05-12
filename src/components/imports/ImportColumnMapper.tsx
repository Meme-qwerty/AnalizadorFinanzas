'use client'

import { useState } from 'react'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useAccounts } from '@/hooks/useAccounts'
import { useCategories } from '@/hooks/useCategories'
import { validateRows } from '@/services/imports.service'
import type { ColumnMapping, ParsedRow, ValidatedRow } from '@/types/import.types'

const FIELD_OPTIONS: { value: string; label: string }[] = [
  { value: 'date', label: '📅 Fecha' },
  { value: 'amount', label: '💰 Monto' },
  { value: 'description', label: '📝 Descripción' },
  { value: 'type', label: '🔄 Tipo (ingreso/gasto)' },
  { value: 'skip', label: '— Ignorar columna' },
]

interface Props {
  headers: string[]
  rows: ParsedRow[]
  initialMapping: ColumnMapping
  fileName: string
  onImport: (validatedRows: ValidatedRow[], accountId: string, categoryId: string) => void
  onBack: () => void
}

export default function ImportColumnMapper({
  headers, rows, initialMapping, fileName, onImport, onBack,
}: Props) {
  const [mapping, setMapping] = useState<ColumnMapping>(initialMapping)
  const [defaultAccountId, setDefaultAccountId] = useState('')
  const [defaultCategoryId, setDefaultCategoryId] = useState('cat_other')
  const { data: accounts } = useAccounts()
  const { data: categories } = useCategories()

  const previewRows = rows.slice(0, 5)
  const validated = validateRows(rows, mapping)
  const validCount = validated.filter((r) => r.errors.length === 0).length
  const errorCount = validated.filter((r) => r.errors.length > 0).length

  const mappedFields = Object.values(mapping)
  const hasDate = mappedFields.includes('date')
  const hasAmount = mappedFields.includes('amount')
  const hasDescription = mappedFields.includes('description')
  const canImport = hasDate && hasAmount && hasDescription && !!defaultAccountId

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-sm">{fileName}</p>
          <p className="text-xs text-muted-foreground">{rows.length} filas detectadas</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Badge variant="secondary" className="text-income border-income/30">
            ✓ {validCount} válidas
          </Badge>
          {errorCount > 0 && (
            <Badge variant="secondary" className="text-expense border-expense/30">
              ✗ {errorCount} con errores
            </Badge>
          )}
        </div>
      </div>

      {/* Column mapping */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Mapeo de columnas</Label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {headers.map((header) => (
            <div key={header} className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-28 truncate shrink-0" title={header}>
                {header}
              </span>
              <Select
                value={mapping[header] ?? 'skip'}
                onValueChange={(v) => setMapping((prev) => ({ ...prev, [header]: v as ColumnMapping[string] }))}
              >
                <SelectTrigger className="h-8 text-xs flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-xs">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
        {(!hasDate || !hasAmount || !hasDescription) && (
          <p className="text-xs text-warning">
            ⚠ Mapea al menos: Fecha, Monto y Descripción para poder importar.
          </p>
        )}
      </div>

      {/* Defaults */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm">Cuenta destino <span className="text-destructive">*</span></Label>
          <Select value={defaultAccountId} onValueChange={setDefaultAccountId}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una cuenta" />
            </SelectTrigger>
            <SelectContent>
              {accounts?.map((acc) => (
                <SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm">Categoría por defecto</Label>
          <Select value={defaultCategoryId} onValueChange={setDefaultCategoryId}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories?.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.icon} {cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Preview table */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Vista previa (primeras 5 filas)</Label>
        <div className="rounded-lg border border-border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                {headers.map((h) => (
                  <TableHead key={h} className="text-xs whitespace-nowrap">
                    {h}
                    {mapping[h] !== 'skip' && (
                      <Badge variant="outline" className="ml-1 text-xs py-0 h-4">
                        {FIELD_OPTIONS.find((o) => o.value === mapping[h])?.label.split(' ').slice(1).join(' ')}
                      </Badge>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {previewRows.map((row, i) => (
                <TableRow key={i}>
                  {headers.map((h) => (
                    <TableCell key={h} className="text-xs whitespace-nowrap">{row[h] ?? '—'}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>← Volver</Button>
        <Button
          disabled={!canImport}
          onClick={() => onImport(validated, defaultAccountId, defaultCategoryId)}
        >
          Importar {validCount} transacciones →
        </Button>
      </div>
    </div>
  )
}
