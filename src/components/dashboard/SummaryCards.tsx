'use client'

import { TrendingUp, TrendingDown, Wallet, ArrowUpDown, Target, Heart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useDashboardSummary } from '@/hooks/useAnalytics'
import { usePrivacyMode } from '@/hooks/usePrivacyMode'
import { cn } from '@/lib/utils'
import { formatPercentage } from '@/lib/formatters'
import { StaggerList, StaggerItem } from '@/components/shared/StaggerList'

interface SummaryCardProps {
  title: string
  value: string
  subtitle?: string
  icon: React.ReactNode
  accentClass?: string
  change?: number
  changePositiveIsGood?: boolean
  prevMonthLabel?: string
}

function SummaryCard({ title, value, subtitle, icon, accentClass, change, changePositiveIsGood = true, prevMonthLabel }: SummaryCardProps) {
  const showChange = change !== undefined && prevMonthLabel
  const isGood = showChange ? (changePositiveIsGood ? change >= 0 : change <= 0) : false
  const changeLabel = showChange
    ? `${change > 0 ? '+' : ''}${change.toFixed(1)}%`
    : ''

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1 min-w-0">
            <p className="text-sm font-medium text-muted-foreground truncate">{title}</p>
            <p className={cn('text-2xl font-semibold tabular-nums tracking-tight', accentClass)}>
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className={cn('p-2 rounded-lg shrink-0 ml-3', accentClass ? `${accentClass} bg-current/10` : 'bg-muted')}>
            <div className={cn('size-5', accentClass ?? 'text-muted-foreground')}>
              {icon}
            </div>
          </div>
        </div>

        {showChange && (
          <div className="mt-2.5 flex items-center gap-1.5">
            {isGood
              ? <TrendingUp className="size-3 shrink-0 text-income" />
              : <TrendingDown className="size-3 shrink-0 text-expense" />}
            <span className={cn('text-xs font-medium tabular-nums', isGood ? 'text-income' : 'text-expense')}>
              {changeLabel}
            </span>
            <span className="text-xs text-muted-foreground">vs {prevMonthLabel}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function SummaryCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="size-9 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  )
}

export default function SummaryCards() {
  const { data, isLoading, isError } = useDashboardSummary()
  const { maskAmount } = usePrivacyMode()

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => <SummaryCardSkeleton key={i} />)}
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="col-span-full text-center text-sm text-muted-foreground py-8">
        Error al cargar el resumen. Intenta de nuevo.
      </div>
    )
  }

  const savingsRate = data.monthlyIncome > 0
    ? (data.monthlySavings / data.monthlyIncome) * 100
    : 0

  const pct = (curr: number, prev: number) =>
    prev > 0 ? ((curr - prev) / prev) * 100 : 0

  const cards: SummaryCardProps[] = [
    {
      title: 'Saldo total',
      value: maskAmount(data.totalBalance),
      subtitle: 'Todas las cuentas',
      icon: <Wallet className="size-5" />,
      accentClass: 'text-primary',
    },
    {
      title: 'Ingresos del mes',
      value: maskAmount(data.monthlyIncome),
      icon: <TrendingUp className="size-5" />,
      accentClass: 'text-income',
      change: pct(data.monthlyIncome, data.prevMonthlyIncome),
      changePositiveIsGood: true,
      prevMonthLabel: data.prevMonthLabel,
    },
    {
      title: 'Gastos del mes',
      value: maskAmount(data.monthlyExpenses),
      icon: <TrendingDown className="size-5" />,
      accentClass: 'text-expense',
      change: pct(data.monthlyExpenses, data.prevMonthlyExpenses),
      changePositiveIsGood: false,
      prevMonthLabel: data.prevMonthLabel,
    },
    {
      title: 'Ahorro del mes',
      value: maskAmount(data.monthlySavings),
      subtitle: `Tasa: ${formatPercentage(savingsRate)}`,
      icon: <ArrowUpDown className="size-5" />,
      accentClass: data.monthlySavings >= 0 ? 'text-income' : 'text-expense',
      change: pct(data.monthlySavings, data.prevMonthlySavings),
      changePositiveIsGood: true,
      prevMonthLabel: data.prevMonthLabel,
    },
    {
      title: 'Presupuesto restante',
      value: maskAmount(data.budgetRemaining),
      subtitle: 'Este mes',
      icon: <Target className="size-5" />,
      accentClass: data.budgetRemaining > 0 ? 'text-income' : 'text-expense',
    },
    {
      title: 'Salud financiera',
      value: `${data.healthScore}/100`,
      subtitle: data.healthScore >= 70 ? 'Buena' : data.healthScore >= 50 ? 'Regular' : 'Por mejorar',
      icon: <Heart className="size-5" />,
      accentClass: data.healthScore >= 70 ? 'text-income' : data.healthScore >= 50 ? 'text-warning' : 'text-expense',
    },
  ]

  return (
    <StaggerList className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => (
        <StaggerItem key={card.title}>
          <SummaryCard {...card} />
        </StaggerItem>
      ))}
    </StaggerList>
  )
}
