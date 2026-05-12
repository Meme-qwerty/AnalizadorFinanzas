'use client'

import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { usePrivacyMode } from '@/hooks/usePrivacyMode'
import { formatCLP, formatPercentage } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import type { BudgetWithStats } from '@/types/budget.types'

interface Props {
  budget: BudgetWithStats
  onEdit: (budget: BudgetWithStats) => void
  onDelete: (id: string) => void
}

function getStatusColor(pct: number) {
  if (pct >= 100) return { bar: 'bg-expense', text: 'text-expense' }
  if (pct >= 90) return { bar: 'bg-expense', text: 'text-expense' }
  if (pct >= 75) return { bar: 'bg-warning', text: 'text-warning' }
  return { bar: 'bg-income', text: 'text-income' }
}

export default function BudgetCard({ budget, onEdit, onDelete }: Props) {
  const { maskAmount } = usePrivacyMode()
  const { bar, text } = getStatusColor(budget.percentage)
  const isOver = budget.percentage >= 100

  return (
    <Card className={cn(isOver && 'border-expense/40 bg-expense/[0.02]')}>
      <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="size-9 rounded-lg flex items-center justify-center text-lg shrink-0"
              style={{ backgroundColor: `${budget.categoryColor}20` }}
            >
              {budget.categoryIcon}
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: budget.categoryColor }}>
                {budget.categoryName}
              </p>
              <p className="text-xs text-muted-foreground capitalize">{
                { monthly: 'Mensual', quarterly: 'Trimestral', annual: 'Anual', custom: 'Personalizado' }[budget.period]
              }</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-7 -mr-1 -mt-1">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(budget)}>
                <Pencil className="size-3.5 mr-2" /> Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={() => onDelete(budget.id)}>
                <Trash2 className="size-3.5 mr-2" /> Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Amounts */}
        <div className="space-y-2">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Gastado</p>
              <p className={cn('text-lg font-bold tabular-nums', text)}>
                {maskAmount(budget.spent)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Límite</p>
              <p className="text-sm font-medium tabular-nums text-muted-foreground">
                {maskAmount(budget.amount)}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-1">
            <Progress
              value={budget.percentage}
              className="h-2"
              indicatorClassName={bar}
            />
            <div className="flex justify-between text-xs">
              <span className={cn('font-semibold', text)}>
                {formatPercentage(budget.percentage)}
              </span>
              <span className="text-muted-foreground">
                {budget.remaining >= 0
                  ? `${maskAmount(budget.remaining)} restante`
                  : `${maskAmount(Math.abs(budget.remaining))} excedido`}
              </span>
            </div>
          </div>
        </div>

        {isOver && (
          <p className="text-xs text-expense font-medium">
            ⚠ Presupuesto excedido este mes
          </p>
        )}
      </CardContent>
    </Card>
  )
}
