'use client'

import { useState } from 'react'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useTransactions, useDeleteTransaction } from '@/hooks/useTransactions'
import { useCategories } from '@/hooks/useCategories'
import { useAccounts } from '@/hooks/useAccounts'
import { usePrivacyMode } from '@/hooks/usePrivacyMode'
import { formatDate } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import type { Transaction, TransactionFilters } from '@/types/transaction.types'

interface Props {
  filters: TransactionFilters
  onEdit: (transaction: Transaction) => void
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="size-4" /></TableCell>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell><Skeleton className="h-4 w-40" /></TableCell>
          <TableCell><Skeleton className="h-5 w-24 rounded-full" /></TableCell>
          <TableCell><Skeleton className="h-4 w-28" /></TableCell>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell><Skeleton className="size-8 ml-auto" /></TableCell>
        </TableRow>
      ))}
    </>
  )
}

export default function TransactionTable({ filters, onEdit }: Props) {
  const { data: transactions, isLoading, isError } = useTransactions(filters)
  const { data: categories } = useCategories()
  const { data: accounts } = useAccounts()
  const deleteMutation = useDeleteTransaction()
  const { maskAmount } = usePrivacyMode()

  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const getAccountName = (accountId: string) =>
    accounts?.find((a) => a.id === accountId)?.name ?? accountId

  const getCategoryInfo = (categoryId: string) => {
    const cat = categories?.find((c) => c.id === categoryId)
    return { name: cat?.name ?? '—', color: cat?.color ?? '#6B7280', icon: cat?.icon ?? '📦' }
  }

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    if (!transactions) return
    setSelected(
      selected.size === transactions.length
        ? new Set()
        : new Set(transactions.map((t) => t.id))
    )
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    await deleteMutation.mutateAsync(deleteId)
    setDeleteId(null)
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
        Error al cargar las transacciones. Intenta de nuevo.
      </div>
    )
  }

  const allSelected = !!transactions?.length && selected.size === transactions.length

  return (
    <>
      {selected.size > 0 && (
        <div className="flex items-center gap-3 px-1 py-2 text-sm">
          <span className="text-muted-foreground">{selected.size} seleccionadas</span>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              selected.forEach((id) => deleteMutation.mutate(id))
              setSelected(new Set())
            }}
          >
            Eliminar seleccionadas
          </Button>
        </div>
      )}

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-10">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={toggleAll}
                  aria-label="Seleccionar todas"
                />
              </TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Cuenta</TableHead>
              <TableHead className="text-right">Monto</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton />
            ) : !transactions?.length ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-sm">
                  No hay transacciones que coincidan con los filtros.
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((tx) => {
                const cat = getCategoryInfo(tx.categoryId)
                return (
                  <TableRow
                    key={tx.id}
                    className={cn(selected.has(tx.id) && 'bg-muted/40')}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selected.has(tx.id)}
                        onCheckedChange={() => toggleSelect(tx.id)}
                        aria-label={`Seleccionar ${tx.descriptionClean}`}
                      />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {formatDate(tx.occurredAt)}
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-medium truncate max-w-50">
                        {tx.descriptionClean}
                      </p>
                      {tx.merchantName && (
                        <p className="text-xs text-muted-foreground">{tx.merchantName}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="text-xs gap-1"
                        style={{ backgroundColor: `${cat.color}18`, color: cat.color }}
                      >
                        {cat.icon} {cat.name}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {getAccountName(tx.accountId)}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={cn(
                          'text-sm font-semibold tabular-nums',
                          tx.type === 'income' ? 'text-income' : 'text-expense'
                        )}
                      >
                        {tx.type === 'income' ? '+' : '-'}{maskAmount(tx.amount)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(tx)}>
                            <Pencil className="size-3.5 mr-2" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setDeleteId(tx.id)}
                          >
                            <Trash2 className="size-3.5 mr-2" /> Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Confirm delete dialog */}
      <Dialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>¿Eliminar transacción?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Esta acción no se puede deshacer.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancelar</Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
