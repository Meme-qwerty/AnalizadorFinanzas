'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useTransactions } from '@/hooks/useTransactions'
import { usePrivacyMode } from '@/hooks/usePrivacyMode'
import { formatCLP } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import type { Transaction } from '@/types/transaction.types'

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

function getCalendarDays(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const startDow = (first.getDay() + 6) % 7
  const days: (Date | null)[] = Array(startDow).fill(null)
  for (let d = 1; d <= last.getDate(); d++) {
    days.push(new Date(year, month, d))
  }
  const remainder = (7 - (days.length % 7)) % 7
  for (let i = 0; i < remainder; i++) days.push(null)
  return days
}

type DayStats = { income: number; expense: number; txs: Transaction[] }

function DayCell({
  date,
  stats,
  isSelected,
  isToday,
  onClick,
}: {
  date: Date | null
  stats?: DayStats
  isSelected: boolean
  isToday: boolean
  onClick: () => void
}) {
  if (!date) return <div className="h-16 rounded-lg" />

  const hasActivity = stats && (stats.income > 0 || stats.expense > 0)

  return (
    <button
      onClick={onClick}
      className={cn(
        'h-16 rounded-lg p-1.5 text-left transition-colors flex flex-col gap-0.5 border',
        isSelected
          ? 'border-primary bg-primary/5'
          : isToday
          ? 'border-primary/40 bg-primary/[0.02]'
          : 'border-transparent hover:border-border hover:bg-muted/50'
      )}
    >
      <span className={cn(
        'text-xs font-medium w-5 h-5 flex items-center justify-center rounded-full',
        isToday ? 'bg-primary text-primary-foreground' : 'text-foreground'
      )}>
        {date.getDate()}
      </span>
      {hasActivity && (
        <div className="flex flex-col gap-0.5 mt-auto">
          {stats!.income > 0 && (
            <div className="h-1 rounded-full bg-income/60" style={{ width: `${Math.min(100, (stats!.income / 1500000) * 100)}%` }} />
          )}
          {stats!.expense > 0 && (
            <div className="h-1 rounded-full bg-expense/60" style={{ width: `${Math.min(100, (stats!.expense / 1500000) * 100)}%` }} />
          )}
        </div>
      )}
    </button>
  )
}

export default function CalendarPage() {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState<Date | null>(today)

  const { data: transactions, isLoading } = useTransactions({})
  const { maskAmount } = usePrivacyMode()

  const calendarDays = useMemo(() => getCalendarDays(viewYear, viewMonth), [viewYear, viewMonth])

  const dayStats = useMemo<Record<string, DayStats>>(() => {
    if (!transactions) return {}
    const map: Record<string, DayStats> = {}
    for (const tx of transactions) {
      const d = new Date(tx.occurredAt)
      if (d.getFullYear() !== viewYear || d.getMonth() !== viewMonth) continue
      const key = d.getDate().toString()
      if (!map[key]) map[key] = { income: 0, expense: 0, txs: [] }
      if (tx.type === 'income') map[key].income += tx.amount
      else if (tx.type === 'expense') map[key].expense += tx.amount
      map[key].txs.push(tx)
    }
    return map
  }, [transactions, viewYear, viewMonth])

  const selectedKey = selectedDate?.getDate().toString()
  const selectedStats = selectedKey ? dayStats[selectedKey] : undefined

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(viewYear - 1); setViewMonth(11) }
    else setViewMonth(viewMonth - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(viewYear + 1); setViewMonth(0) }
    else setViewMonth(viewMonth + 1)
  }

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Calendario</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Transacciones por día</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Calendar grid */}
        <div className="lg:col-span-2 space-y-3">
          {/* Month navigation */}
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={prevMonth}><ChevronLeft className="size-4" /></Button>
            <h2 className="text-sm font-semibold capitalize">{monthLabel}</h2>
            <Button variant="ghost" size="icon" onClick={nextMonth}><ChevronRight className="size-4" /></Button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1">
            {WEEKDAYS.map((d) => (
              <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">{d}</div>
            ))}
          </div>

          {/* Day cells */}
          {isLoading ? (
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 35 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((date, i) => (
                <DayCell
                  key={i}
                  date={date}
                  stats={date ? dayStats[date.getDate().toString()] : undefined}
                  isSelected={!!date && !!selectedDate && date.toDateString() === selectedDate.toDateString()}
                  isToday={!!date && date.toDateString() === today.toDateString()}
                  onClick={() => date && setSelectedDate(date)}
                />
              ))}
            </div>
          )}

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
            <div className="flex items-center gap-1.5"><div className="h-1.5 w-6 rounded-full bg-income/60" /> Ingresos</div>
            <div className="flex items-center gap-1.5"><div className="h-1.5 w-6 rounded-full bg-expense/60" /> Gastos</div>
          </div>
        </div>

        {/* Day detail panel */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">
            {selectedDate
              ? selectedDate.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })
              : 'Selecciona un día'}
          </h3>

          {selectedStats ? (
            <div className="space-y-2">
              {selectedStats.income > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Ingresos</span>
                  <span className="font-semibold text-income">{maskAmount(selectedStats.income)}</span>
                </div>
              )}
              {selectedStats.expense > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Gastos</span>
                  <span className="font-semibold text-expense">{maskAmount(selectedStats.expense)}</span>
                </div>
              )}

              <div className="pt-1 space-y-2">
                {selectedStats.txs.map((tx) => (
                  <Card key={tx.id}>
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-medium truncate">{tx.description}</p>
                          <Badge variant="secondary" className="text-xs mt-1">{tx.type === 'income' ? 'Ingreso' : 'Gasto'}</Badge>
                        </div>
                        <span className={cn('text-sm font-bold tabular-nums shrink-0', tx.type === 'income' ? 'text-income' : 'text-expense')}>
                          {tx.type === 'income' ? '+' : '-'}{maskAmount(tx.amount)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <p className="text-2xl mb-2">📅</p>
                <p className="text-sm text-muted-foreground">Sin transacciones este día</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
