'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { usePrivacyMode } from '@/hooks/usePrivacyMode'
import { cn } from '@/lib/utils'
import type { BudgetWithStats } from '@/types/budget.types'

interface Props {
  budgets: BudgetWithStats[]
  isLoading: boolean
}

function statusColor(pct: number) {
  if (pct >= 100) return { fill: 'bg-expense',  text: 'text-expense' }
  if (pct >= 90)  return { fill: 'bg-expense',  text: 'text-expense' }
  if (pct >= 75)  return { fill: 'bg-warning',  text: 'text-warning' }
  return               { fill: 'bg-income',  text: 'text-income' }
}

interface RowProps {
  budget: BudgetWithStats
  maxAmount: number
  maskAmount: (n: number) => string
}

function BudgetRow({ budget, maxAmount, maskAmount }: RowProps) {
  const { fill, text } = statusColor(budget.percentage)
  const isOver = budget.percentage >= 100

  // Width of the budget track relative to the widest budget
  const trackPct = (budget.amount / maxAmount) * 100
  // Width of the spent fill inside the track (capped at track width)
  const fillPct  = Math.min(budget.percentage, 100)

  return (
    <div className="flex items-center gap-3 group">
      {/* Category label */}
      <div className="flex items-center gap-2 w-36 shrink-0">
        <span
          className="size-7 rounded-lg flex items-center justify-center text-sm shrink-0"
          style={{ backgroundColor: `${budget.categoryColor}20` }}
        >
          {budget.categoryIcon}
        </span>
        <span className="text-sm font-medium truncate">{budget.categoryName}</span>
      </div>

      {/* Bar */}
      <div className="flex-1 relative h-5 flex items-center">
        {/* Full-width background */}
        <div className="absolute inset-0 rounded-full bg-muted" />

        {/* Budget track (relative width) */}
        <div
          className="absolute left-0 top-0 bottom-0 rounded-full bg-muted-foreground/10 border border-muted-foreground/15"
          style={{ width: `${trackPct}%` }}
        />

        {/* Spent fill */}
        <div
          className={cn('absolute left-0 top-0.5 bottom-0.5 rounded-full transition-all duration-700', fill, isOver && 'opacity-90')}
          style={{ width: `${(fillPct / 100) * trackPct}%` }}
        />

        {/* Threshold markers (at 75% and 90% of track) */}
        {[75, 90].map((threshold) => (
          <div
            key={threshold}
            className="absolute top-0 bottom-0 w-px bg-muted-foreground/25"
            style={{ left: `${(threshold / 100) * trackPct}%` }}
          />
        ))}

        {/* 100% budget marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-muted-foreground/40 rounded-full"
          style={{ left: `calc(${trackPct}% - 1px)` }}
        />

        {/* Over-budget indicator */}
        {isOver && (
          <div
            className="absolute -right-0 top-1 bottom-1 flex items-center"
            style={{ left: `${trackPct}%` }}
          >
            <span className="text-[10px] font-bold text-expense ml-1.5 whitespace-nowrap">
              +{(budget.percentage - 100).toFixed(0)}%
            </span>
          </div>
        )}
      </div>

      {/* Amounts */}
      <div className="text-right shrink-0 min-w-28">
        <span className={cn('text-sm font-semibold tabular-nums', text)}>
          {maskAmount(budget.spent)}
        </span>
        <span className="text-xs text-muted-foreground tabular-nums">
          {' '}/{' '}{maskAmount(budget.amount)}
        </span>
      </div>

      {/* Percentage */}
      <div className={cn('text-xs font-bold tabular-nums text-right shrink-0 w-10', text)}>
        {budget.percentage.toFixed(0)}%
      </div>
    </div>
  )
}

function ChartSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="size-7 rounded-lg shrink-0" />
          <Skeleton className="h-4 w-24 shrink-0" />
          <Skeleton className="h-5 flex-1 rounded-full" />
          <Skeleton className="h-4 w-28 shrink-0" />
          <Skeleton className="h-4 w-8 shrink-0" />
        </div>
      ))}
    </div>
  )
}

export function BudgetComparisonChart({ budgets, isLoading }: Props) {
  const { maskAmount } = usePrivacyMode()

  const maxAmount = Math.max(...(budgets.map((b) => b.amount)), 1)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Presupuesto vs gasto real</CardTitle>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-3 rounded-sm bg-income/70" /> OK
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-3 rounded-sm bg-warning/70" /> 75–90%
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-3 rounded-sm bg-expense/70" /> {'>'} 90%
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <ChartSkeleton />
        ) : budgets.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            No hay presupuestos para mostrar.
          </p>
        ) : (
          <div className="space-y-3.5">
            {budgets
              .slice()
              .sort((a, b) => b.percentage - a.percentage)
              .map((budget) => (
                <BudgetRow
                  key={budget.id}
                  budget={budget}
                  maxAmount={maxAmount}
                  maskAmount={maskAmount}
                />
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
