'use client'

import { CreditCard, RefreshCw, Calendar, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { useSubscriptions, useToggleSubscription } from '@/hooks/useSubscriptions'
import { usePrivacyMode } from '@/hooks/usePrivacyMode'
import { formatCLP, formatDate } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import type { Subscription } from '@/services/subscriptions.service'

const CYCLE_LABELS: Record<string, string> = {
  monthly: 'Mensual',
  annual: 'Anual',
  weekly: 'Semanal',
}

function SubscriptionRow({ sub }: { sub: Subscription }) {
  const toggle = useToggleSubscription()
  const { maskAmount } = usePrivacyMode()

  const daysUntil = Math.ceil((sub.nextBillingDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  const isSoon = daysUntil <= 7

  return (
    <div className={cn('flex items-center gap-4 py-4 group', !sub.isActive && 'opacity-50')}>
      <div className="size-10 rounded-xl bg-muted flex items-center justify-center text-xl shrink-0">
        {sub.categoryIcon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold">{sub.name}</p>
          <Badge variant="secondary" className="text-xs">{CYCLE_LABELS[sub.billingCycle]}</Badge>
          {isSoon && sub.isActive && (
            <Badge className="text-xs bg-warning/10 text-warning border-0">Próxima</Badge>
          )}
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="size-3" /> Próx. cobro: {formatDate(sub.nextBillingDate)}
          </p>
          <p className="text-xs text-muted-foreground">{sub.transactionCount} pagos detectados</p>
        </div>
      </div>
      <p className="text-sm font-bold tabular-nums shrink-0">{maskAmount(sub.amount)}</p>
      <Switch
        checked={sub.isActive}
        onCheckedChange={() => toggle.mutate(sub.id)}
        className="shrink-0"
      />
    </div>
  )
}

export default function SubscriptionsPage() {
  const { data: subs, isLoading } = useSubscriptions()
  const { maskAmount } = usePrivacyMode()

  const active = subs?.filter((s) => s.isActive) ?? []
  const inactive = subs?.filter((s) => !s.isActive) ?? []

  const monthlyTotal = active.reduce((sum, s) => {
    if (s.billingCycle === 'monthly') return sum + s.amount
    if (s.billingCycle === 'annual') return sum + s.amount / 12
    if (s.billingCycle === 'weekly') return sum + s.amount * 4.3
    return sum
  }, 0)

  const annualTotal = monthlyTotal * 12

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold">Suscripciones</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Pagos recurrentes detectados automáticamente
        </p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <CreditCard className="size-3.5" />
              <p className="text-xs">Activas</p>
            </div>
            <p className="text-xl font-bold">{active.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <RefreshCw className="size-3.5" />
              <p className="text-xs">Costo mensual</p>
            </div>
            <p className="text-xl font-bold tabular-nums">{maskAmount(monthlyTotal)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="size-3.5" />
              <p className="text-xs">Costo anual</p>
            </div>
            <p className="text-xl font-bold tabular-nums">{maskAmount(annualTotal)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Subscription list */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-base">Suscripciones activas ({active.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0 px-4">
          {isLoading ? (
            <div className="space-y-4 py-4">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
            </div>
          ) : active.length === 0 ? (
            <div className="py-12 text-center">
              <CreditCard className="size-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No se detectaron suscripciones activas</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {active.map((sub) => <SubscriptionRow key={sub.id} sub={sub} />)}
            </div>
          )}
        </CardContent>
      </Card>

      {inactive.length > 0 && (
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-base text-muted-foreground">Pausadas ({inactive.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0 px-4">
            <div className="divide-y divide-border">
              {inactive.map((sub) => <SubscriptionRow key={sub.id} sub={sub} />)}
            </div>
          </CardContent>
        </Card>
      )}

      <p className="text-xs text-muted-foreground text-center">
        Las suscripciones se detectan automáticamente analizando patrones de pagos recurrentes.
      </p>
    </div>
  )
}
