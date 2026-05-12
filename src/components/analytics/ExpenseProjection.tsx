'use client'

import {
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useMonthlyStats } from '@/hooks/useAnalytics'
import { formatCLP } from '@/lib/formatters'

function buildProjection(historical: { month: string; income: number; expenses: number; savings: number; savingsRate: number }[]) {
  if (historical.length < 2) return []

  const n = historical.length
  const avgExpenses = historical.reduce((s, m) => s + m.expenses, 0) / n
  const avgIncome = historical.reduce((s, m) => s + m.income, 0) / n

  // Simple linear trend
  const expenseTrend = (historical[n - 1].expenses - historical[0].expenses) / (n - 1)
  const incomeTrend = (historical[n - 1].income - historical[0].income) / (n - 1)

  const PROJ_MONTHS = ['Jun 2026', 'Jul 2026', 'Ago 2026']

  return PROJ_MONTHS.map((month, i) => ({
    month,
    expenses: Math.round(avgExpenses + expenseTrend * (i + 1)),
    income: Math.round(avgIncome + incomeTrend * (i + 1)),
    isProjection: true,
  }))
}

function CLPTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-lg text-xs space-y-1">
      <p className="font-medium mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="size-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-semibold">{formatCLP(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

export default function ExpenseProjection() {
  const { data: monthly, isLoading } = useMonthlyStats(6)

  if (isLoading) return <Skeleton className="h-64 w-full" />
  if (!monthly) return null

  const projection = buildProjection(monthly)
  const lastMonth = monthly[monthly.length - 1]

  const combined = [
    ...monthly.map((m) => ({ ...m, isProjection: false })),
    ...projection,
  ]

  const projectedExpense = projection[0]?.expenses ?? 0
  const expenseDiff = projectedExpense - lastMonth.expenses
  const diffPct = lastMonth.expenses > 0 ? (expenseDiff / lastMonth.expenses) * 100 : 0

  return (
    <Card>
      <CardHeader className="pb-2 flex-row items-center justify-between">
        <CardTitle className="text-base">Proyección de gastos</CardTitle>
        <Badge
          className={expenseDiff > 0
            ? 'bg-expense/10 text-expense border-0 text-xs'
            : 'bg-income/10 text-income border-0 text-xs'}
        >
          Próx. mes: {expenseDiff > 0 ? '+' : ''}{diffPct.toFixed(1)}%
        </Badge>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <ComposedChart data={combined} margin={{ top: 4, right: 4, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
            <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} className="fill-muted-foreground" width={52} />
            <Tooltip content={<CLPTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <ReferenceLine x={lastMonth.month} stroke="hsl(var(--border))" strokeDasharray="4 2" label={{ value: 'Hoy', position: 'top', fontSize: 10 }} />
            <Bar dataKey="expenses" name="Gastos reales" fill="#EF444440" radius={[4, 4, 0, 0]} />
            <Line type="monotone" dataKey="expenses" name="Gastos" stroke="#EF4444" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="income" name="Ingresos" stroke="#10B981" strokeWidth={1.5} strokeDasharray="4 2" dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Las proyecciones se calculan con tendencia lineal sobre los últimos 6 meses. Solo referencial.
        </p>
      </CardContent>
    </Card>
  )
}
