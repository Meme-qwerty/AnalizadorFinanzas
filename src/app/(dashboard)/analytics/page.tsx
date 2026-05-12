'use client'

import { useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useMonthlyStats, useCategoryStats, useTopMerchants } from '@/hooks/useAnalytics'
import { usePrivacyMode } from '@/hooks/usePrivacyMode'
import { formatCLP, formatPercentage } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import SpendingHeatmap from '@/components/analytics/SpendingHeatmap'
import ExpenseProjection from '@/components/analytics/ExpenseProjection'
import YoYComparison from '@/components/analytics/YoYComparison'

const PERIODS = [
  { label: '3 meses', value: 3 },
  { label: '6 meses', value: 6 },
  { label: '12 meses', value: 12 },
]

function PeriodSelector({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1 p-1 bg-muted rounded-lg">
      {PERIODS.map((p) => (
        <button
          key={p.value}
          onClick={() => onChange(p.value)}
          className={cn(
            'px-3 py-1 rounded-md text-xs font-medium transition-colors',
            value === p.value ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}

function CLPTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-lg text-xs space-y-1">
      <p className="font-medium text-foreground mb-2">{label}</p>
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

export default function AnalyticsPage() {
  const [period, setPeriod] = useState(6)
  const { data: monthly, isLoading: loadingMonthly } = useMonthlyStats(period)
  const { data: categories, isLoading: loadingCats } = useCategoryStats()
  const { data: merchants, isLoading: loadingMerchants } = useTopMerchants()
  const { maskAmount } = usePrivacyMode()

  const slicedMonthly = monthly?.slice(-period) ?? []

  const bestMonth = slicedMonthly.reduce((best, m) => m.savingsRate > (best?.savingsRate ?? 0) ? m : best, slicedMonthly[0])
  const avgSavings = slicedMonthly.length
    ? slicedMonthly.reduce((s, m) => s + m.savingsRate, 0) / slicedMonthly.length
    : 0

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Analítica</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Tendencias y patrones de tus finanzas</p>
        </div>
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>

      <Tabs defaultValue="resumen">
        <TabsList>
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="proyecciones">Proyecciones</TabsTrigger>
          <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
        </TabsList>

        <TabsContent value="proyecciones" className="space-y-4 mt-4">
          <ExpenseProjection />
          <YoYComparison />
        </TabsContent>

        <TabsContent value="heatmap" className="mt-4">
          <SpendingHeatmap />
        </TabsContent>

        <TabsContent value="resumen" className="space-y-6 mt-4">

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Tasa de ahorro prom.', value: formatPercentage(avgSavings), highlight: avgSavings >= 20 },
          { label: 'Mejor mes', value: bestMonth?.month ?? '—', highlight: true },
          { label: 'Categorías activas', value: `${categories?.length ?? 0}`, highlight: false },
          { label: 'Comercios distintos', value: `${merchants?.length ?? 0}`, highlight: false },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className={cn('text-lg font-bold mt-1', stat.highlight && 'text-income')}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cash-flow area chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Flujo de caja mensual</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingMonthly ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={slicedMonthly} margin={{ top: 4, right: 4, left: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} className="fill-muted-foreground" width={52} />
                <Tooltip content={<CLPTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="income" name="Ingresos" stroke="#10B981" fill="url(#incomeGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="expenses" name="Gastos" stroke="#EF4444" fill="url(#expenseGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="savings" name="Ahorro" stroke="#3B82F6" fill="none" strokeWidth={1.5} strokeDasharray="4 2" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Category + Merchants row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Category bar chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Gastos por categoría</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingCats ? (
              <Skeleton className="h-56 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={categories} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-border" />
                  <XAxis type="number" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                  <YAxis type="category" dataKey="categoryName" tick={{ fontSize: 11 }} className="fill-muted-foreground" width={90} />
                  <Tooltip content={<CLPTooltip />} />
                  <Bar dataKey="amount" name="Monto" radius={[0, 4, 4, 0]}>
                    {categories?.map((c) => <Cell key={c.categoryId} fill={c.categoryColor} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Category donut */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Distribución de gastos</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingCats ? (
              <Skeleton className="h-56 w-full" />
            ) : (
              <div className="flex items-center gap-4">
                <ResponsiveContainer width="50%" height={200}>
                  <PieChart>
                    <Pie data={categories} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="amount">
                      {categories?.map((c) => <Cell key={c.categoryId} fill={c.categoryColor} />)}
                    </Pie>
                    <Tooltip formatter={(v) => (typeof v === 'number' ? formatCLP(v) : '')} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2 min-w-0">
                  {categories?.map((c) => (
                    <div key={c.categoryId} className="flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: c.categoryColor }} />
                        <span className="truncate text-muted-foreground">{c.categoryName}</span>
                      </div>
                      <span className="font-medium shrink-0">{formatPercentage(c.percentage)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top merchants table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Top comercios</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loadingMerchants ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {merchants?.map((m, i) => (
                <div key={m.name} className="flex items-center gap-3 px-4 py-3">
                  <span className="text-xs font-medium text-muted-foreground w-4">{i + 1}</span>
                  <span className="text-base shrink-0">{m.categoryIcon}</span>
                  <span className="flex-1 text-sm font-medium">{m.name}</span>
                  <Badge variant="secondary" className="text-xs">{m.count} tx</Badge>
                  <span className="text-sm font-semibold tabular-nums">{maskAmount(m.amount)}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

        </TabsContent>
      </Tabs>
    </div>
  )
}
