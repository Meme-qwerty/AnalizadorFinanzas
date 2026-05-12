'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import BudgetCard from '@/components/budgets/BudgetCard'
import BudgetForm from '@/components/budgets/BudgetForm'
import { useBudgets, useDeleteBudget } from '@/hooks/useBudgets'
import { formatCLP } from '@/lib/formatters'
import type { BudgetWithStats } from '@/types/budget.types'

export default function BudgetsPage() {
  const { data: budgets, isLoading } = useBudgets()
  const deleteMutation = useDeleteBudget()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<BudgetWithStats | undefined>()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const totalBudget = budgets?.reduce((s, b) => s + b.amount, 0) ?? 0
  const totalSpent = budgets?.reduce((s, b) => s + b.spent, 0) ?? 0
  const overCount = budgets?.filter((b) => b.percentage >= 100).length ?? 0

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Presupuestos</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {formatCLP(totalSpent)} de {formatCLP(totalBudget)} usado este mes
            {overCount > 0 && <span className="text-expense ml-2">· {overCount} excedido{overCount > 1 ? 's' : ''}</span>}
          </p>
        </div>
        <Button onClick={() => { setEditing(undefined); setFormOpen(true) }}>
          <Plus className="size-4 mr-1.5" /> Nuevo presupuesto
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-44 w-full rounded-xl" />)}
        </div>
      ) : !budgets?.length ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-4xl mb-3">🎯</p>
          <p className="font-medium">Sin presupuestos</p>
          <p className="text-sm text-muted-foreground mt-1">Crea límites de gasto por categoría</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {budgets.map((b) => (
            <BudgetCard
              key={b.id}
              budget={b}
              onEdit={(budget) => { setEditing(budget); setFormOpen(true) }}
              onDelete={setDeleteId}
            />
          ))}
        </div>
      )}

      <BudgetForm open={formOpen} onClose={() => { setFormOpen(false); setEditing(undefined) }} budget={editing} />

      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar presupuesto?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={async () => { if (deleteId) { await deleteMutation.mutateAsync(deleteId); setDeleteId(null) } }}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
