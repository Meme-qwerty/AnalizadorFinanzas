'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useTransactions } from '@/hooks/useTransactions'
import { formatCLP } from '@/lib/formatters'
import { cn } from '@/lib/utils'

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

function heatColor(pct: number): string {
  if (pct === 0) return 'bg-muted/40'
  if (pct < 0.2) return 'bg-expense/10'
  if (pct < 0.4) return 'bg-expense/25'
  if (pct < 0.6) return 'bg-expense/45'
  if (pct < 0.8) return 'bg-expense/65'
  return 'bg-expense/85'
}

export default function SpendingHeatmap() {
  const { data: transactions, isLoading } = useTransactions({})

  const heatmap = useMemo(() => {
    if (!transactions) return null

    const grid: Record<string, number> = {}
    let maxAmount = 0

    for (const tx of transactions) {
      if (tx.type !== 'expense') continue
      const d = new Date(tx.occurredAt)
      const key = `${d.getMonth()}-${d.getDate()}`
      grid[key] = (grid[key] ?? 0) + tx.amount
      if (grid[key] > maxAmount) maxAmount = grid[key]
    }

    return { grid, maxAmount }
  }, [transactions])

  if (isLoading) return <Skeleton className="h-40 w-full" />

  const { grid = {}, maxAmount = 1 } = heatmap ?? {}

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Mapa de calor de gastos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[520px]">
            {/* Month headers */}
            <div className="flex gap-0.5 mb-1 ml-6">
              {MONTHS.map((m) => (
                <div key={m} className="text-[10px] text-muted-foreground text-center" style={{ width: `${100 / 12}%` }}>
                  {m}
                </div>
              ))}
            </div>

            {/* Grid: one row per day (1-31), one col per month */}
            <div className="flex gap-2">
              {/* Day labels */}
              <div className="flex flex-col gap-0.5 shrink-0">
                {[1, 7, 14, 21, 28].map((d) => (
                  <div
                    key={d}
                    className="text-[9px] text-muted-foreground text-right w-4 leading-none"
                    style={{ marginTop: d === 1 ? 0 : `${(d - (d === 7 ? 1 : d === 14 ? 7 : d === 21 ? 14 : 21) - 1) * 10}px` }}
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* Month columns */}
              <div className="flex gap-0.5 flex-1">
                {MONTHS.map((_, monthIdx) => (
                  <div key={monthIdx} className="flex flex-col gap-0.5 flex-1">
                    {Array.from({ length: DAYS_IN_MONTH[monthIdx] }, (_, dayIdx) => {
                      const day = dayIdx + 1
                      const key = `${monthIdx}-${day}`
                      const amount = grid[key] ?? 0
                      const pct = maxAmount > 0 ? amount / maxAmount : 0
                      return (
                        <div
                          key={day}
                          className={cn('rounded-sm cursor-default transition-opacity hover:opacity-80', heatColor(pct))}
                          style={{ height: 8 }}
                          title={amount > 0 ? `${MONTHS[monthIdx]} ${day}: ${formatCLP(amount)}` : undefined}
                        />
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-2 mt-3">
              <span className="text-[10px] text-muted-foreground">Menos</span>
              {[0, 0.2, 0.4, 0.6, 0.8, 1].map((pct) => (
                <div key={pct} className={cn('size-3 rounded-sm', heatColor(pct))} />
              ))}
              <span className="text-[10px] text-muted-foreground">Más</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
