'use client'

import { useState, useEffect } from 'react'
import { MoreHorizontal, Pencil, Trash2, X, Tag } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
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
import { useTransactions, useDeleteTransaction, useUpdateTransaction } from '@/hooks/useTransactions'
import { useCategories } from '@/hooks/useCategories'
import { useAccounts } from '@/hooks/useAccounts'
import { usePrivacyMode } from '@/hooks/usePrivacyMode'
import { formatDate } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import { StaggerList, StaggerItem } from '@/components/shared/StaggerList'
import { Pagination } from '@/components/shared/Pagination'
import type { Transaction, TransactionFilters } from '@/types/transaction.types'

const PAGE_SIZE = 10

interface Props {
  filters: TransactionFilters
  onEdit: (transaction: Transaction) => void
}

interface CategoryInfo {
  name: string
  color: string
  icon: string
}

// ─── Skeletons ───────────────────────────────────────────────────────────────

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

function CardSkeleton() {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl border border-border">
          <Skeleton className="size-9 rounded-full shrink-0" />
          <div className="flex-1 min-w-0 space-y-1.5">
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-3 w-2/5" />
          </div>
          <div className="text-right space-y-1.5 shrink-0">
            <Skeleton className="h-4 w-20 ml-auto" />
            <Skeleton className="h-3 w-14 ml-auto" />
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Mobile card ─────────────────────────────────────────────────────────────

interface CardProps {
  tx: Transaction
  cat: CategoryInfo
  accountName: string
  selected: boolean
  masked: string
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
}

function TransactionCard({ tx, cat, accountName, selected, masked, onToggle, onEdit, onDelete }: CardProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 p-3.5 rounded-xl border border-border transition-colors',
        selected && 'bg-muted/40 border-muted-foreground/20'
      )}
    >
      {/* Checkbox + category icon */}
      <div className="flex flex-col items-center gap-2 shrink-0">
        <Checkbox
          checked={selected}
          onCheckedChange={onToggle}
          aria-label={`Seleccionar ${tx.descriptionClean}`}
        />
        <div
          className="size-8 rounded-full flex items-center justify-center text-sm"
          style={{ backgroundColor: `${cat.color}20` }}
        >
          {cat.icon}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium truncate leading-snug">{tx.descriptionClean}</p>
          <span
            className={cn(
              'text-sm font-semibold tabular-nums shrink-0 leading-snug',
              tx.type === 'income' ? 'text-income' : 'text-expense'
            )}
          >
            {tx.type === 'income' ? '+' : '-'}{masked}
          </span>
        </div>

        {tx.merchantName && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{tx.merchantName}</p>
        )}

        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <Badge
            variant="secondary"
            className="text-xs gap-1 py-0"
            style={{ backgroundColor: `${cat.color}18`, color: cat.color }}
          >
            {cat.name}
          </Badge>
          <span className="text-xs text-muted-foreground">{formatDate(tx.occurredAt)}</span>
          <span className="text-xs text-muted-foreground">· {accountName}</span>
        </div>
      </div>

      {/* Actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-7 shrink-0 -mr-1">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>
            <Pencil className="size-3.5 mr-2" /> Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive" onClick={onDelete}>
            <Trash2 className="size-3.5 mr-2" /> Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function TransactionTable({ filters, onEdit }: Props) {
  const { data: transactions, isLoading, isError } = useTransactions(filters)
  const { data: categories } = useCategories()
  const { data: accounts } = useAccounts()
  const deleteMutation = useDeleteTransaction()
  const updateMutation = useUpdateTransaction()
  const { maskAmount } = usePrivacyMode()

  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  useEffect(() => { setPage(1) }, [filters])

  const total = transactions?.length ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const paginated = transactions?.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) ?? []
  const allSelected = !!paginated.length && selected.size === paginated.length

  const getAccountName = (accountId: string) =>
    accounts?.find((a) => a.id === accountId)?.name ?? accountId

  const getCategoryInfo = (categoryId: string): CategoryInfo => {
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
    setSelected(
      selected.size === paginated.length
        ? new Set()
        : new Set(paginated.map((t) => t.id))
    )
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    await deleteMutation.mutateAsync(deleteId)
    setDeleteId(null)
  }

  const bulkDelete = () => {
    selected.forEach((id) => deleteMutation.mutate(id))
    setSelected(new Set())
  }

  const bulkCategorize = (categoryId: string) => {
    selected.forEach((id) => updateMutation.mutate({ id, categoryId }))
    setSelected(new Set())
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
        Error al cargar las transacciones. Intenta de nuevo.
      </div>
    )
  }

  const bulkBar = (
    <AnimatePresence>
      {selected.size > 0 && (
        <motion.div
          key="bulk-bar"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18, ease: [0, 0, 0.2, 1] }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted border border-border text-sm"
        >
          <button
            onClick={() => setSelected(new Set())}
            className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
            aria-label="Deseleccionar todo"
          >
            <X className="size-4" />
          </button>

          <span className="flex-1 text-muted-foreground tabular-nums">
            {selected.size} {selected.size === 1 ? 'seleccionada' : 'seleccionadas'}
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 text-xs">
                <Tag className="size-3.5 mr-1.5" />
                Categorizar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-64 overflow-y-auto">
              {categories?.map((cat) => (
                <DropdownMenuItem key={cat.id} onClick={() => bulkCategorize(cat.id)}>
                  <span className="mr-2">{cat.icon}</span>
                  {cat.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="destructive"
            size="sm"
            className="h-7 text-xs"
            onClick={bulkDelete}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="size-3.5 mr-1.5" />
            Eliminar
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )

  const empty = (
    <p className="text-center py-12 text-sm text-muted-foreground">
      No hay transacciones que coincidan con los filtros.
    </p>
  )

  return (
    <>
      {bulkBar}

      {/* ── Desktop table (md+) ─────────────────────────────────── */}
      <div className="hidden md:block rounded-lg border border-border overflow-hidden">
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
            ) : !paginated.length ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-sm">
                  No hay transacciones que coincidan con los filtros.
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((tx) => {
                const cat = getCategoryInfo(tx.categoryId)
                return (
                  <TableRow key={tx.id} className={cn(selected.has(tx.id) && 'bg-muted/40')}>
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
                      <p className="text-sm font-medium truncate max-w-50">{tx.descriptionClean}</p>
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

      {/* ── Mobile card list (< md) ──────────────────────────────── */}
      <div className="md:hidden">
        {isLoading ? (
          <CardSkeleton />
        ) : !paginated.length ? (
          empty
        ) : (
          <StaggerList className="space-y-2">
            {paginated.map((tx) => {
              const cat = getCategoryInfo(tx.categoryId)
              return (
                <StaggerItem key={tx.id}>
                  <TransactionCard
                    tx={tx}
                    cat={cat}
                    accountName={getAccountName(tx.accountId)}
                    selected={selected.has(tx.id)}
                    masked={maskAmount(tx.amount)}
                    onToggle={() => toggleSelect(tx.id)}
                    onEdit={() => onEdit(tx)}
                    onDelete={() => setDeleteId(tx.id)}
                  />
                </StaggerItem>
              )
            })}
          </StaggerList>
        )}
      </div>

      {/* ── Pagination ──────────────────────────────────────────── */}
      {!isLoading && total > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          pageSize={PAGE_SIZE}
          onChange={setPage}
        />
      )}

      {/* ── Confirm delete dialog ────────────────────────────────── */}
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
