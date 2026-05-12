'use client'

import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCategories } from '@/hooks/useCategories'
import type { TransactionFilters } from '@/types/transaction.types'

interface Props {
  filters: TransactionFilters
  onChange: (filters: TransactionFilters) => void
  onAdd: () => void
}

export default function TransactionFilters({ filters, onChange, onAdd }: Props) {
  const { data: categories } = useCategories()

  const hasActiveFilters =
    !!filters.search || !!filters.type || !!filters.categoryIds?.length

  const clear = () => onChange({})

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Buscar transacción..."
          className="pl-9"
          value={filters.search ?? ''}
          onChange={(e) => onChange({ ...filters, search: e.target.value || undefined })}
        />
      </div>

      {/* Type filter */}
      <Select
        value={filters.type ?? 'all'}
        onValueChange={(v) =>
          onChange({ ...filters, type: v === 'all' ? undefined : (v as TransactionFilters['type']) })
        }
      >
        <SelectTrigger className="w-full sm:w-40">
          <SlidersHorizontal className="size-3.5 mr-2 text-muted-foreground" />
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="income">Ingresos</SelectItem>
          <SelectItem value="expense">Gastos</SelectItem>
          <SelectItem value="transfer">Transferencias</SelectItem>
        </SelectContent>
      </Select>

      {/* Category filter */}
      <Select
        value={filters.categoryIds?.[0] ?? 'all'}
        onValueChange={(v) =>
          onChange({ ...filters, categoryIds: v === 'all' ? undefined : [v] })
        }
      >
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="Categoría" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las categorías</SelectItem>
          {categories?.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.icon} {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Clear filters */}
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clear} className="shrink-0">
          <X className="size-3.5 mr-1" /> Limpiar
        </Button>
      )}

      {/* Add button */}
      <Button onClick={onAdd} className="shrink-0">
        + Nueva transacción
      </Button>
    </div>
  )
}
