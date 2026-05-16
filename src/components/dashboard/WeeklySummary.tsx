'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { useWeeklySummary } from '@/hooks/useAnalytics'
import { usePrivacyMode } from '@/hooks/usePrivacyMode'
import { cn } from '@/lib/utils'

export default function WeeklySummary() {
  const { data, isLoading } = useWeeklySummary()
  const { maskAmount } = usePrivacyMode()

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2"><Skeleton className="h-5 w-36" /></CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-8 w-32" />
          <div className="flex items-end gap-1.5 h-16">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="flex-1 rounded-sm" style={{ height: `${40 + Math.random() * 30}%` }} />
            ))}
          </div>
          <Skeleton className="h-4 w-48" />
        </CardContent>
      </Card>
    )
  }

  if (!data) return null

  const { days, currentTotal, previousTotal, changePercent } = data
  const maxVal = Math.max(...days.flatMap((d) => [d.current, d.previous]), 1)
  const isDown = changePercent <= 0

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Esta semana</CardTitle>
          <div className={cn(
            'flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
            isDown ? 'bg-income/10 text-income' : 'bg-expense/10 text-expense'
          )}>
            {isDown
              ? <TrendingDown className="size-3" />
              : <TrendingUp className="size-3" />}
            {changePercent > 0 ? '+' : ''}{changePercent.toFixed(1)}%
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div>
          <p className="text-2xl font-semibold tabular-nums tracking-tight text-expense">
            {maskAmount(currentTotal)}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">en gastos esta semana</p>
        </div>

        {/* Bar chart */}
        <div className="flex items-end gap-1.5" style={{ height: 56 }}>
          {days.map((d) => {
            const currH = maxVal > 0 ? (d.current / maxVal) * 100 : 0
            const prevH = maxVal > 0 ? (d.previous / maxVal) * 100 : 0
            return (
              <div key={d.label} className="flex-1 flex flex-col items-center gap-0.5 h-full">
                <div className="flex-1 w-full flex flex-col justify-end gap-0.5">
                  {/* previous week — lighter */}
                  <div
                    className="w-full rounded-sm bg-muted-foreground/20"
                    style={{ height: `${prevH}%`, minHeight: prevH > 0 ? 2 : 0 }}
                  />
                  {/* current week */}
                  <div
                    className={cn(
                      'w-full rounded-sm',
                      d.current > d.previous ? 'bg-expense/70' : 'bg-expense/40'
                    )}
                    style={{ height: `${currH}%`, minHeight: currH > 0 ? 2 : 0 }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground leading-none">{d.label}</span>
              </div>
            )
          })}
        </div>

        {/* Legend + comparison */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-0.5">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="inline-block size-2 rounded-sm bg-expense/50" /> Esta semana
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block size-2 rounded-sm bg-muted-foreground/25" /> Semana pasada
            </span>
          </div>
          <span className="tabular-nums">{maskAmount(previousTotal)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
